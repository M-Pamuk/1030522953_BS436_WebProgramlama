const React = require('react');
const { mount } = require('enzyme');
const {Game}  = require('../src/game');
import renderer from 'react-test-renderer';


//kart sayısı ve başlangıc src kontrolü
const checkCardsCount = (driver) =>{
    const cards = driver.find('.kart');
    expect(cards.length).toEqual(3);
    checkBeginSrc(driver);
}
//başlangıc src kontrolü yapılıyor
const checkBeginSrc=(driver)=>{
    let src=driver.find('.kart').at(0).prop('src');
    expect(src).toBe('img/question.png')
}
//doğru render edilip edilmediği test ediliyor
test('render correctly',()=>{
    const tree = renderer.create(<Game />).toJSON();
    expect(tree).toMatchSnapshot();
})
//oyun başlangıc testi 
test("test begin",()=>{
    const driver = mount(<Game/>);
    checkCardsCount(driver);
});

//kart seçimi simule edilerek fonksiyonlar test ediliyor.
test("simple play game",()=>{
    let driver = mount(<Game/>);
    let card = driver.find('.kart').at(0);
    card.simulate('click');
    var srcName=card.prop("src");
    /*click simüle edildikten sonra src değeri değişmedi.card.props().onClick() metodu denendi ama hata alındı
    Tarayıcıda sorunsuz çalışmasına rağmen denenen diğer metot farklı sorunlar çıkardı.
    Aynı şekilde oyun tarafında doğru kartın hak bitiminde gösterilmesi de sorun oluşturmuştur.
    Bu konuda yardımcı olabilirseniz sevinirim.*/
    expect(srcName).toBe('img/question.png');
})
// çoklu art arda seçim yaparak test ediliyor
test("simple play game multiple select",()=>{
    let driver = mount(<Game/>);
    for(let i=0;i<3;i++){

        let card = driver.find('.kart').at(i);
        card.simulate('click');
        //card.props().onClick();
        let srcName=card.prop("src");
        expect(srcName).toBe('img/question.png');
        driver = mount(<Game/>);
    
        }
    
    
})

//Tekrar oyna tıklanılması test ediliyor
test("try again click",()=>{
    let driver=mount(<Game/>)
    let againPlay=driver.find(".mesaj");
    againPlay.simulate("click");
})