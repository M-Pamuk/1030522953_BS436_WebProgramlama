import React from "react";
import ReactDOM from "react-dom";
import { Game } from "./game";

class App extends React.Component {
    render(){
        return(<><Game/></>)
    }
    

}
//üst alanda yer alan static mesajlar ayrı component olarak oluşturuluyor.
class InfoText extends React.Component {
    render() {
        return (<>{this.renderHeadInfo()}</>)
    }
    renderHeadInfo() {
        return (<div>
            <h2>Kedi Bulmaca</h2>
            <p>Bu oyunda kapalı kart içerisinde kediyi bulman gerekmektedir.İlk tercihte kediyi bulamazsan ikinci hak
        tanınacaktır.</p>

        </div>)
    }
}
ReactDOM.render(<App />, document.getElementById("root"));//root render ediliyor.
ReactDOM.render(<InfoText />, document.getElementById("headinfo"));//static üst mesajlar render ediliyor.
