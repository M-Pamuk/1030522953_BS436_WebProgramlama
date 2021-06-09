import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {withRouter} from "react-router";


class Navbar extends Component {

    doLogout = async () => {
        const url = "/api/logout";//çıkış endpoint i
        let response;
        try {
            // fetch ile çıkış için asenkron istek atılır.
            response = await fetch(url, { method: "post" });
        } catch (err) {//istek sırasında hata oluşması durumda catch e düşülür.
            alert("Sunucuya bağlanmada hata: " + err);
            return;
        }

        if (response.status !== 204) {//No-Content değilse bir sorun vardır. Durum alert ile bildirilir.
            alert("Sunucuya bağlanmada hata: durum kodu " + response.status);
            return;
        }

        //mevcut user objesi null olarak set edilir ve çıkış işlemi bitirilir.
        this.props.updateLoggedInUser(null);
        this.props.history.push("/");//Anasayfa yönlendirilmesi yapılır.
    };


    //Kullanıcı giriş yapmışsa navbar da gösterilecek alan içeriği olışturuluyor.
    renderLoggedIn(userId) {
        return (
            <React.Fragment>
                <p className="header-text">
                    Hoş geldin {userId}
                </p>
                <button className="header-button" onClick={this.doLogout}>
                    Logout
                </button>
            </React.Fragment>
        );
    }
    //Kullanıcı giriş yapmamışsa gösterilecek içerik oluşturuluyor.
    renderNotLoggedIn() {
        return (
            <React.Fragment>
                <p className="header-text">Giriş yapmadınız</p>
                <div className="action-buttons">
                    <Link className="header-button" to="/login" tabIndex="0">
                        Giriş Yap
                    </Link>
                    <Link className="header-button" to="/signup" tabIndex="0">
                        Üye Ol
                    </Link>
                </div>
            </React.Fragment>
        );
    }


    render() {
        //index den props olarak geçilen userid eğer null ise kullanıcı giriş yapmamış demektir.
        const userId = this.props.userId;
        let content;
        if (!userId) {//Giriş yapıp yapmamasına göre render edilecek alan değişkene atılıyor
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }
        return (
            <div className="header">
                <Link className="header-logo" to={"/"} tabIndex="0">
                Kedi Bulmaca
                </Link>
                {content}
            </div>
        );
    }
}

export default withRouter(Navbar);