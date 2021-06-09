import React from "react";
import { withRouter } from "react-router-dom";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        //Kullanıcı kayıt için gerekli bilgiler için değişkenler state içerisinde tutuluyor.
        this.state = {
            userId: "",
            password: "",
            confirm: "",
            errorMsg: null
        };
    }

    //Two way binding sağlamak için input onchange eventlerine bu metot bağlanıyor.
    onTextChange = event => {
        this.setState({  [event.target.id]: event.target.value, errorMsg: null });
    };

    //Kayıt ol butonu ile tetiklenerek asenkron bir şekilde apiye post ediliyor.
    doSignUp = async () => {
        const { userId, password, confirm } = this.state;//state den değişkenler alınıyor
        if (confirm !== password) {//Şifre ve şifre tekrarı aynı olup olmaması kontrolü yapılıyor
            this.setState({ errorMsg: "Şifreler eşleşmemektedir" });
            return;
        }

        const url = "/api/signup";//Api'deki kayıt ol endpoint
        const payload = { userId: userId, password: password };//Post edilmek üzere obje oluşturuluyor.
        let response;

        try {
            //fetch ile oluşturulan obje endpointe post ediliyor. JSON.stringify ile obje string hale getiriliyor.
            //Content-Type ile api ye json obje gönderildiği bilgisi header a yerleştirilerek bildiriliyor.
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {//hata durumunda error set ediliyor.
            this.setState({ errorMsg: "Sunucuya bağlanırken hata: " + err });
            return;
        }

        if (response.status === 400) {//Bad request dönmesi post edilen verilerin hatalı olması durumu.
            this.setState({ errorMsg: "Geçersiz kullanıcıId/şifre" });
            return;
        }
        //farklı bir sorun gerçekleştiğinde hatanın set edlmesi.
        if (response.status !== 201) {
            this.setState({
                errorMsg:
                    "Sunucuya bağlanırken hata: durum kodu " + response.status
            });
            return;
        }

        this.setState({ errorMsg: null });
        await this.props.fetchAndUpdateUserInfo();//user güncellenir
        this.props.history.push("/");//anasayfaya yönlendirilir.
    };

    render() {
        //Hata varsa hatanın gösterileceği içerik oluşturulur.
        let error = <div></div>;
        if (this.state.errorMsg) {
            error = (
                <div className="errorMsg">
                    <p>{this.state.errorMsg}</p>
                </div>
            );
        }

        let confirmMsg = "Ok";
        if (this.state.confirm !== this.state.password) {
            confirmMsg = "Eşleşmemektedir";
        }

        return (
            //inputlara state te karşılık gelecek şekilde id ve onTextChange metodu onchange e verilecek two way binding yapılır.
            <div className="center">
                <div>
                    <p>Kullanıcı Id:</p>
                    <input
                        type="text"
                        value={this.state.userId}
                        id="userId"
                        onChange={this.onTextChange}
                    />
                </div>
                <div>
                    <p>Şifre:</p>
                    <input
                        type="password"
                        value={this.state.password}
                        id="password"
                        onChange={this.onTextChange}
                    />
                </div>
                <div>
                    <p>Onay:</p>
                    <input
                        type="password"
                        value={this.state.confirm}
                        id="confirm"
                        onChange={this.onTextChange}
                    />
                    <div>{confirmMsg}</div>
                </div>

                {error}

                <button className="button" onClick={this.doSignUp}>
                    Üye Ol
                </button>
            </div>
        );
    }
}

export default withRouter(SignUp);
