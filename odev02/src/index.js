//Tüm  sayfa yüklendikten sonra oyunu set ediyor.
document.addEventListener("DOMContentLoaded", function () {
  
    Game.newGame();

});

//global değişkenler
let correctIndex;
let cardCount;
let choiceNumber;
let reduceScore;


//Oyun elementleri set ediliyor.
export const newGame = () => {
    //Önceki oyun ekranı temizlenir.
    document.getElementById("cards").innerHTML = "";
    correctIndex;
    //Kullanıcı ayarlardan belirlemediyse default değerler atanır.
    if(choiceNumber==null){
        cardCount = 3;
        choiceNumber = cardCount - 1;
    }
    //daha önceki oyun varsa onun ayarları set edilir.
    else{
        cardCount = document.getElementById("settingsCardCount").value;
        choiceNumber = document.getElementById("settingsHak").value;
    }
    
    //doğru kartın index i belirlenir.
    correctIndex = (Math.floor(Math.random() * cardCount));
    //yanlış seçimde düşülecek skor puanı
    reduceScore=Number(100/choiceNumber);
    
    //Başlangıc text leri set ediliyor.
    document.getElementById("alanId").innerText = "Kedi kartını bulmak için kartın üzerine tıklamalısın.";
    document.getElementById("txtScore").innerText = "100";
    document.getElementById("txtHak").innerText = choiceNumber;
    document.getElementById("btnSetting").innerText = "Ayarlar";
    //belirlenen kart sayısı kadar kart oluşturuyor.
    createCard(cardCount);
    //Başlangıçta ekranların görünümleri ayarlanır.
    document.getElementById("settings").style.display="none";
    document.getElementById("gameContainer").style.display="block";
}

//Kart tıklanan kartın doğru olup olmadığı kontrolleri yapılarak src ve score düzenlemesi 
export const selectCard = (card) => {
    //Hak düzenlemesi yapılır.
    choiceNumber--;
    document.getElementById("txtHak").innerText = choiceNumber;
    //index doğru ise kedi src set edilir ve oyun sonuna gönderilir.
    if (card.id === "img" + correctIndex) {
        card.setAttribute("src", "img/kedi.png");
        gameFinish(true);
    }
    //yanlış ise köpek set edilir ,score düzenlenir. Hak bitmiş ise oyun sonuna gönderilir.
    else {
        card.setAttribute("src", "img/kopek.png");
        document.getElementById("txtScore").innerText = Number(Number(document.getElementById("txtScore").innerText) -reduceScore ).toFixed(2);
        choiceNumber == 0 ? gameFinish(false) : wrongMessage();

    }

}
//Yanlış seçimde verilen mesaj
const wrongMessage = () => {
    document.getElementById("alanId").innerText = "Yanlış Seçim. Tekrar deneyin.";

}
//Oyun sonu elementlerin düzenlenmesi gerçekleşiyor. 
const gameFinish = (answer) => {
    //verilen cevaba  göre gösterilecek mesaj set ediliyor.
    let message = answer === true ? "Kazandınız!!. Tebrik ederiz." : "Kaybettiniz!!.";
    let container = message + 'Yeni bir oyun oynamak istersen ' +
        '<span onclick="Game.newGame()" style="cursor:pointer;color:white"><u>buraya</u></span> ' +
        'tıklayabilirsin.';
    document.getElementById("alanId").innerHTML = container;
    let cards = document.querySelectorAll(".kart");
    //Tüm kartların onlick silinerek kullanıcı etkileşimi kesiliyor.
    cards.forEach(element => {
        element.removeAttribute("onclick");
        if(element.id==="img"+correctIndex){
            element.setAttribute("src","img/kedi.png")
        }
    });
    //Son seçimin doğru olması durumunda score düzenlemesi yapılıyor.
    let elScore=document.getElementById("txtScore");
    answer==false? elScore.innerText =0:elScore.innerText=elScore.innerHTML;

}
//Kart sayısına göre DOM a kart ekleniyor
const createCard = (cardCount) => {
    //Her bir karta başlangıç src,onlick ve eşsiz id verilip cards divine eklenir.
    for (var i = 0; i < cardCount; i++) {
        let element = document.createElement("img");
        element.setAttribute("src", "img/question.png");
        element.className = "kart";
        element.setAttribute("onclick", "Game.selectCard(this)");
        element.id = "img" + i;
        document.getElementById("cards").appendChild(element);
    }
}
//Ayarlar butonuna oyun ekranı ve ayar ekranı görünüm toggle yapılıyor. 
export const settings = (el) => {
    var settingsPanel = document.getElementById("settings");
    var gamePanel = document.getElementById("gameContainer");
    if (settingsPanel.style.display === "none") {
        gamePanel.style.display = "none";
        settingsPanel.style.display = "block";
        el.innerText="Kapat";
    }
    else {
        settingsPanel.style.display = "none";
        gamePanel.style.display = "block";
        el.innerText="Ayarlar";
    }
}
//Girilen ayarları global değişkenlere ataması yapılıyor.
export const setSettings=()=>{
    //ayarlar ekranındaki input değerleri alınıyor.
    cardCount = document.getElementById("settingsCardCount").value;
    choiceNumber = document.getElementById("settingsHak").value;
    //Girilen ayarlara göre yeni oyun başlatılıyor.
    newGame()
}
//Kart sayısı ve tanınan hak validation yapılıyor.(Hak en fazla kartSayısı-1 olabilir.)
export function limit() {
    var elCardCount = document.getElementById("settingsCardCount");
    var elHak = document.getElementById("settingsHak");
	if(elHak.value>=elCardCount.value){
        elHak.value=elCardCount.value-1;
    }

    
}





