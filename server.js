const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ws = require('ws');
const path = require('path');
const wss = new ws.Server({port: 5000});

//Baned Ip's
let bannedIPs = ['49.37.156.121', '197.47.21.22', '149.200.185.107'];


//Controllers
const cities = require('./controllers/cities');
const countries = require('./controllers/countries');
const total = require('./controllers/totals');
const users = require('./controllers/users');


mongoose.connect(
    'mongodb+srv://Anwar:Anwar123@hassanat.fvbzq.mongodb.net/hassanat?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);



wss.on('connection', (socket) => {

    function getInfo(info) {
        (async () => {
            //Total Clicks
            let TotalClicks = await total.getTotalClicks()
            socket.send(JSON.stringify({type: "totalClicks", clicks: TotalClicks}));
    
            //Get Countries
            let Countries = await countries.getTopCountries()
            socket.send(JSON.stringify({type: "countries", Countries: Countries}));

            //Get user country and user country clicks
            let UserCountry = await countries.getUserCountry(info)
            socket.send(JSON.stringify({type: "userCountry", UserCountry: UserCountry}));

        })();
    }
   
    socket.onmessage = function(message){

    let info = JSON.parse(message.data);



        if (info.type == "click") {
            if (bannedIPs.includes(info.user_ip)) {
                socket.send( 'u are banned! contact me : https://www.facebook.com/AnwarRiffian')
            } else if (info.user_clicks > 2) {
                socket.send( 'u are banned! contact me : https://www.facebook.com/AnwarRiffian')
                bannedIPs.push(info.user_ip);
            } else {
                countries.updateCountries(info);
                total.updateTotal(info);
                cities.updateCities(info);
                users.sendUserClicks(info);
                socket.send(JSON.stringify({type: "OK"}));
            }
        }else if (info.type == "update") {
            getInfo(info);
        }else if (info.type == "start") {
            users.startApi(info);
        }

        getInfo(info);
    }
});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/" , (req, res) => {
    res.render("index.ejs");
});












app.listen(3000, () => {
    console.log('Server Running! on port 3000')
});