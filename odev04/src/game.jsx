import React, { Component } from 'react'

export  class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            cardCount: 3,
            choiceCount: 2,
            correctIndex: (Math.floor(Math.random() * 3)),
            score: 100,
            reduceScore: (100 / 2).toFixed(2),
            footerMessage: "Kediyi bulabilmek için kartların üzerine tıklamalısınız.",
            isFinish: false
        }

    }


    render() {
        //kart sayısı kadar kart üretilip diziye atılıyor
        let cards = [];
        for (var i = 0; i < this.state.cardCount; i++) {
            cards.push(this.renderCard(i));
        }
        //üst alanda yer alan score ve hak render edildikten sonra cards dizisi ekrana basılıyor.Ardından alt tarafta mesaj set ediliyor.
        return (<div>
            {this.renderScoreChoice()}
            {cards}
            {this.renderFooterInfo()}
        </div>);

    }
    //kart eleman oluşturuluyor
    renderCard(index) {
        var _id = "img" + index;//eşsiz id oluşturuluyor.
        return <img id={_id} key={_id} className="kart" src="img/question.png" onClick={(e) => this.selectCard(e)} />

    }
    selectCard = (card) => {
        if (!this.state.isFinish) { //oyun devam ediyor mu kontrol ediliyor
            //Hak düzenlemesi yapılır.
            this.setState(prevState => ({ choiceCount: prevState.choiceCount - 1 }));
            //index doğru ise kedi src set edilir ve oyun sonuna gönderilir.
            if (card.target.id === "img" + this.state.correctIndex) {
                card.target.setAttribute("src", "img/kedi.png");
                this.gameFinish(true);
            }
            //yanlış ise köpek set edilir ,score düzenlenir. Hak bitmiş ise oyun sonuna gönderilir.
            else {
                card.target.setAttribute("src", "img/kopek.png");
                this.setState(prevState => ({ score: prevState.score - this.state.reduceScore }));
                this.state.choiceCount - 1 == 0 ? this.gameFinish(false) : this.wrongMessage();

            }

        }
    }
    //Skor ve hak label ları render ediliyor.
    renderScoreChoice() {
        return (<div>
            <label style={{ display: "block" }}>Skor:<span id="txtScore">{this.state.score}</span></label>
            <label style={{ display: "block" }}>Kalan Hak:<span id="txtHak"></span>{this.state.choiceCount}</label>
        </div>)
    }
    //Kullanıcıya verilecek alt tarafta mesaj alanı set ediliyor.dangerouslySet ile string içerisindeki html taglari render ediyor.
    renderFooterInfo() {
        return (<div className="mesaj">
            <p dangerouslySetInnerHTML={{ __html: this.state.footerMessage }} onClick={this.state.isFinish == true ? this.newGame : null}></p>

        </div>
        )
    }
    //Yanlış seçim mesajı veriliyor.
    wrongMessage = () => {
        this.setState({
            footerMessage: "Yanlış seçim. Son hakkınız kaldı."
        })

    }
    gameFinish = (answer) => {
        //oyun bitiş kontrolü true yapılıyor.
        this.setState({ isFinish: true }, function () {
            console.log(this.state.isFinish)
        });
        //doğru kart kullanıcıya gösteriliyor.
        //document.getElementById("img" + this.state.correctIndex).setAttribute("src", "img/kedi.png");

        //verilen cevaba  göre gösterilecek mesaj set ediliyor.
        let message = answer === true ? "Kazandınız!!. Tebrik ederiz." : "Kaybettiniz!!.";
        let container = message + 'Yeni bir oyun oynamak istersen ' +
            '<span  style="cursor:pointer;color:white" class="tryAgain"><u>buraya</u></span> ' +
            'tıklayabilirsin.';
        //state set edilerek mesaj yenileniyor.    
        this.setState({ footerMessage: container });


    }
    newGame = () => {
        //başlangıç değişkenleri set ediliyor.
        this.setState({
            choiceCount: 2,
            correctIndex: (Math.floor(Math.random() * 3)),
            score:100,
            isFinish:false,
            footerMessage: "Kediyi bulabilmek için kartların üzerine tıklamalısınız.",


        });
        let cards = document.querySelectorAll(".kart");
        //Tüm kartların src soru işaretine çevriliyor.
        cards.forEach(element => {
          element.setAttribute("src", "img/question.png")   
        });
        
    }
}
