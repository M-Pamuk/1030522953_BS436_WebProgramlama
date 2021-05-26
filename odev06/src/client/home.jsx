import React, {Component} from 'react';
import {Link} from "react-router-dom";

export class Home extends Component {
    render() {
        return (
            <div>
                <h2>Kart Oyunu</h2>
                <p className="welcome-text">
                    Bu oyunda 3 kapalı kart içindeki kediyi bulman gerekmektedir.İlk tercihte kedi kartını bulamaz isen 2.seçim hakkı verilecektir.
                </p>
                <div className="action">
                    <Link to={"/game"} className="play">Oyna</Link>
                </div>
            </div>
        );
    }
}

