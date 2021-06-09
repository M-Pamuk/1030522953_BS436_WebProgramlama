import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";

class Login extends Component {
    constructor(props) {
        super(props);
        //kullanıcı bilgileri ve api response error için state değişkenleri tanımlanır.
        this.state = {
            userId: "",
            password: "",
            errorMsg: null
        };
    }
    //asenkron olarak girilen kullanıcı bilgileri ile /api/login endpoint ine istek atılır.
    //db de yer alıyorsa oturum set edilir.
    doLogIn = async () => {
        const { userId, password } = this.state;//kullanıcın girmiş olduğu bilgiler alınıyor.
        const url = "/api/login";//endpoint
        const payload = { userId: userId, password: password };//post edilecek obje oluşturuluyor
        let response;
        try {
            //fetch ile json obje endpointe post ediliyor. JSON.stringify ile obje string hale getiriliyor.
            //Content-Type ile api ye json obje gönderildiği bilgisi header a yerleştirilerek bildiriliyor.
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
           
        } catch (err) {//İstek sırasında hata oluşursa catch e düşecek. hata içeriği err de yer alır.
            this.setState({ errorMsg: "Sunucuya bağlanırken hata: " + err });
            return;
        }

        if (response.status === 401) {//Unauthorize dönmesi girilen bilgilere ait kullanıcı bulunmaması durumunu belirtir.
            this.setState({ errorMsg: "Geçersiz kullanıcıId/şifre" });
            
            return;
        }

        if (response.status !== 204) {//204 No-Content dönmesi işlemin başarılı gerçekleştiği anlamına gelir.Dönmemesi durumunda oluşan hata set edilir.
            this.setState({
                errorMsg:
                    "Sunucuya bağlanırken hata: durum kodu " + response.status
            });
            return;
        }

        this.setState({ errorMsg: null });
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push("/");//History e '/' push edilerek anasayfaya dönülmesi sağlanır
    };

    onTextChange = event => {
        //React one way binding olduğu için anlık input değişimi state e set edilemez. 
        //Bu durumu aşmak için onchange eventine metot bağlanarak two way işlemi yapılır
        this.setState({ [event.target.id]: event.target.value });
    };

    render() {
        //Herhangi bir error mesajı state te yer alıyorsa gösterilmesi için içerik oluşturulur.
        let error = <div></div>;
        if (this.state.errorMsg) {
            error = (
                <div className="errorMsg">
                    <p>{this.state.errorMsg}</p>
                </div>
            );
        }

        return (
            <div className="center">
                <div>
                    <p>Kullanıcı:</p>
                    <input
                        type="text"
                        value={this.state.userId}
                        id="userId"
                        onChange={this.onTextChange}//two way binding sağlamak için
                    />
                </div>
                <div>
                    <p>Şifre:</p>
                    <input
                        type="password"
                        id="password"
                        value={this.state.password}
                        onChange={this.onTextChange}
                    />
                </div>

                {error}

                <button className="button" onClick={this.doLogIn}>
                    Giriş
                </button>
                <Link className="button" tabIndex="0" to={"/signup"}>
                    Üye Ol
                </Link>
            </div>
        );
    }
}

export default withRouter(Login);