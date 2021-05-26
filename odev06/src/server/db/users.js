// Map türünde nesne ile CRUD işlemleri yapabileceğimiz veritabanı taklit ediliyor.
const users = new Map();

//kullanici id'si map de mevcut değilse user objesi oluşturulup map e set ediliyor.
createUser = (id,password) =>{
    if(getUser(id)){//Kullanıcı zaten mevcut ise yeniden oluşturmadan false dönülüyor.
        return false;
    }

    //user objesi oluşturuluyor.
    const user = {
        id,
        password,
        victories:0,
        defeats:0
    }
    //map e ekleniyor.
    users.set(id,user);
    return true;
}
// id ye göre user objesi gönderiliyor.
getUser = (id) =>users.get(id);

//kullanici doğrulaması yapılıyor. İd'li kayıt yoksa veya şifre uyumsuz ise false dönülüyor.
verifyUser = (id,password) => {
    const user = getUser(id);
    if(!user)
        return false;
    return user.password === password;
}


// Map in içi temizleniyor. Tüm kayıtlar siliniyor.
resetAllUsers =() => users.clear();

//Oyun sona erdiğinde oyuncunun id 'si ile bilgileri çekilerek kazanma veya kaybetme değeri artırılıyor.
reportEndOfMatch = (userId, isVictory) =>{
    const user = getUser(userId);

    if(!user){
        throw "Gecersiz kullanici id:" +userId;//Kullanıcı map da bulunmuyorsa hata fırlatılıyor
    }
    if(isVictory){
        user.victories++;
    }else{
        user.defeats++;
    }
}

module.exports= {getUser,verifyUser,createUser,resetAllUsers,reportEndOfMatch}