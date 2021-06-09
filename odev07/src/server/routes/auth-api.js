const express = require('express');
const passport = require('passport');
const Users = require('../db/users');


//Router ile gelen istek yollarını ve metotlarını yakalıyoruz.
const router= express.Router();

// GET isteği ile kayıtlı kullanıcı bilgileri json şeklinde dönülüyor.
router.get('/user',(req,res)=>{
    if(!req.user){
        res.status(401).send();//Oturum mevcut değilse 401 Unauthorized ile giriş yapılmadığı belirtiliyor.
        return;
    }
    res.status(201).json({//kullanıcı objesi oluşturulup mevcut kullanıcı (oturumu bulunan) set edilerek dönderiliyor
        id:req.user.id,
        victories: req.user.victories,
        defeats: req.user.defeats
    });
});

//logine post edilen kullanıcı bilgileri doğru ise passport tarafından bir oturum oluşturulur. ve 204 başarılı kodu döndürülür.
router.post('/login',passport.authenticate('local'),(req,res)=>{
    res.status(204).send();
});

//Post edilen kullanıcı bilgilerini local veritabanında yeni kullanıcı olarak oluşturuyor
router.post('/signup',(req,res)=>{

    const created = Users.createUser(req.body.userId,req.body.password);//isteğin body sinde yer alan bilgiler ile kullanıcı oluşturuluyor.

    //Oluşturma hatası gerçekleşirse 400 Bad Request döndererek isteğin istenilen şekilde olmadığı belirtiliyor.
    if(!created){
        res.status(400).send();
        return;
    }
    //başarılı ise local'de passport ile oturum oluşturuluyor
    passport.authenticate('local')(req,res, ()=>{
        //oluşturma başarılı ise kullanıcıyı sessiona kayıt ediliyor
        req.session.save((err)=>{
            if(err){
                res.status(500).send();//Session kaydedilmezse sunucu taraflı bir sorun oluştuğu belirtiliyor.
            }else{
                res.status(201).send();//başarılı ise 201 Created dönülüyor.
            }
        });
    });
});

//Çıkış yapıldığında session temizleniyor.Böylece oturum silinmiş oluyor. 

router.post('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.status(204).send();
});



module.exports = router;