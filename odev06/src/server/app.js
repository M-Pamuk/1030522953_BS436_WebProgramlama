const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;
const Users = require('./db/users');
const app = express();
const authApi= require('./routes/auth-api');



//uygulamada kullanılacak session ayarları set ediliyor. Oturum depolama seçenekleri(resave,saveUninitialized vb.) aktif veya pasif olduğu belirtiliyor.
app.use(session({
    secret: "cookie key",
    resave: false,
    saveUninitialized:false
}));


/*passport local olarak kullanıyoruz. Burada da pasport localStrategy ile ayarları set ediyoruz.
oturum için kullanılacak field belirtiliyor. Callback ile field ları alıp Users map de kontrolü sağlanıyor.Done ile işlem cevabı dönderiliyor. */
passport.use(new localStrategy({
    usernameField:'userId',
    passwordField:'password'
},(userId,password,done)=>{
    //girilen alanların Users tarafında kontrolü yapılıyor
    const ok = Users.verifyUser(userId,password);

    if(!ok){
        return done(null,false,{message:'Gecersiz kullanici adi/sifre'});//done ile başarısız olunduğunda mesaj dönülüyor.
    }

    const user = Users.getUser(userId);
    return done(null,user);//başarılı ise user 'ı dönüyoruz ve eşleşme yapılmış oluyor
}));

//passport serilize biçimde objeyi string hale getirerek bellekte tutuyor. 
passport.serializeUser((user,done)=>{
   done(null,user.id);
});

//kullanılmak istendiğinde deserialize ile string ten objeye (istenilen türe)  dönüştürülüyor
passport.deserializeUser((id,done)=>{
    const user = Users.getUser(id);
    
    if(user){
        done(null,user);
    }else{
        done(null,false);
    }
});
//passport uygulamaya set ediliyor
app.use(passport.initialize());
//passport session kullanıldığı uygulamaya set ediliyor
app.use(passport.session());


app.use(bodyParser.json());

app.use('/api',authApi);

app.use(express.static('public'));


app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports= app;