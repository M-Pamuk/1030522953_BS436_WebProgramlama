const express_ws = require('express-ws');


let ews;

function init(app) {
    ews = express_ws(app);
    app.ws('/', function (socket, req) {
        console.log('Yeni ws bağlantısı kuruldu');
        broadCastCount();
        socket.on('close', () => {
            broadCastCount();
        });
    });
}

function broadCastCount() {
    //socket e abone olan client ların sayısı alınıyor.
    const n = ews.getWss().clients.size;
    // Her bir client a client sayısı mesaj olarak geçiliyor
    ews.getWss().clients.forEach((client) => {

        const data = JSON.stringify({userCount: n});

        client.send(data);
    });
}


module.exports = {init};