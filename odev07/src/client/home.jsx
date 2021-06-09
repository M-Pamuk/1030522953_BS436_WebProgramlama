import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Navbar from './navbar';

export class Home extends Component {
    componentDidMount() {
        if (this.props.user) {//props a geçirilmiş bir user var ise bilgileri güncellenir
            this.props.fetchAndUpdateUserInfo();
        }
    }
    
    render() {
        //kullanıcının login olup olmaması kontrol edilir ve buna göre icerik render edilir.
        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;
        return (
            <div>
                
                <h2>Kart Oyunu</h2>
                <p className="welcome-text">
                    Bu oyunda 3 kapalı kart içindeki kediyi bulman gerekmektedir.İlk tercihte kedi kartını bulamaz isen 2.seçim hakkı verilecektir.
                </p>
                <p>Online oyuncu sayısı: {this.props.userCount}</p>
                {loggedIn ? (
                    <div>
                        <Link to={"/game"} className={"button"}>
                            Oyna
                        </Link>
                        <div className="action">
                            <p>Galibiyet: {user.victories}</p>
                            <p>Mağlubiyet: {user.defeats}</p>
                        </div>
                    </div>
                ) : (
                    <p>Oynamak için giriş yapmanız gerekmektedir!</p>
                )}
            </div>
        );
    }
}

