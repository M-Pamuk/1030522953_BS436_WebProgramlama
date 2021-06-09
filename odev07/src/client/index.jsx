import React, { Component } from 'react';

import ReactDOM from "react-dom";

import { Home } from "./home";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Navbar from "./navbar";
import Login from "./login";
import SignUp from "./signup";
import Game from "./game";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,//login için değişken tanımlanır
            userCount: 0//websocket ile çekilen verinin tutulacağı değişken tanımlanır
        };
    }

    fetchAndUpdateUserInfo = async () => {

        const url = "/api/user";//istek route belirlenir.
        let response;
        try {
            //fetch ile async bir iste atılır. geriye promise döner.
            response = await fetch("http://localhost:8080/api/user");
        } catch (err) {
            //Hata durumu state e geçilerek bilgilendirilir.
            this.setState({ errorMsg: "Sunucu bağlantısında hata: " + err });
            return;
        }

        if (response.status === 401) {
            //401 unauthorize dönmesi durumunda oturum bulunmamaktadır.Bu durumda mevcut user null olarak değiştirilir.
            this.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 201) {
            //işlemin farklı status code döndermesi durumunda kullanıcıya bilgilendirme yapılabilir.
        }
        else {
            //fetch isteğinden dönen promisin .json() ile body kısmı json a çevrilir.
            const payload = await response.json();
            //response body de yer alan user objesi mevcut user olarak set edilir 
            this.updateLoggedInUser(payload);
        }
    };
    //user set edilmesi
    updateLoggedInUser = (user) => {
        this.setState({ user: user });
    };
    componentDidMount() {
        //Component yüklenmesi ile user bilgileri güncellenir.
        this.fetchAndUpdateUserInfo();
        //WebSocket in kullandığı protokol HTTP->ws HTTPS ->wss olmasından dolayı kontrol sağlanır.
        let protocol = "ws:";
        if (window.location.protocol.toLowerCase() === "https:") {
            protocol = "wss:";
        }
        //açılan socketin yolu belirtiliyor(örn:wss://localhost:8080)
        this.socket = new WebSocket(protocol + "//" + window.location.host);
        //socket dinlemesi yapılır ve mesaj geçildiği an onmessage tetiklenir.
        this.socket.onmessage = (event) => {
            //mesajın data sı alınır.
            const dto = JSON.parse(event.data);
            //mesaj içeriğinin boş olup olmadığı kontrolü yapılarak kullanıcı sayısı state e set edilir.
            if (!dto || !dto.userCount) {
                this.setState({ userCount: "WebSocket Hatası" });
                return;
            }

            this.setState({ userCount: dto.userCount });
        };

    }
    //componentin sonlanması ile socket kapatılır
    componentWillUnmount() {
        this.socket.close();
    }
    notFound = () => {
        return (
            <div>
                <h2>Sayfa Bulunamadı: 404</h2>
                <p>
                    Hata: Aradığınız sayfaya şu anda ulaşılamıyor.
                    Lütfen daha sonra tekrar deneyiniz.
                </p>
            </div>
        )
    }

    render() {

        //Oturumda user var ise id si navbar a veriliyor.
        const id = this.state.user ? this.state.user.id : null;
        /*Switch ile component router yapılırken props özelliği geçebilmek için render özelliği kullanılması gerekiyor.
          componentlerin index de yer alan kullanıcı güncelleme ve apiden çekme işlemlerini diğer componentler de
          gerçekleştirebilmesi için fetchAndUpdateUserInfo  ve updateLoggedInUser fonksiyonlarını state lift up olarak propslara geçiriliyor.
          */
        return (
            <HashRouter>
                <div>
                    <Navbar userId={id}
                        updateLoggedInUser={this.updateLoggedInUser} />
                    <Switch>
                        <Route exact path="/game"
                            render={props => <Game {...props}
                                user={this.state.user}
                                updateLoggedInUser={this.updateLoggedInUser}
                                fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                            />} />
                        <Route exact path="/login"
                            render={props => <Login {...props}
                                fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo} />} />
                        <Route exact path="/signup"
                            render={props => <SignUp {...props}
                                fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo} />} />
                        <Route exact path="/"
                            render={props => <Home {...props}
                                userCount={this.state.userCount}
                                user={this.state.user}
                                fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo} />} />
                        <Route component={this.notFound} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}



ReactDOM.render(<App />, document.getElementById("root"));

