const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


const app = express();

const server = http.createServer(app)
const io = socketio(server)




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

io.on('connection', (socket) => {

    setInterval(() => {
        (async () => {
            //Total Clicks
            let TotalClicks = await total.getTotalClicks()
            socket.emit("TotalClicks", JSON.stringify({type: "totalClicks", clicks: TotalClicks}));
    
            //Get Countries
            let Countries = await countries.getTopCountries()
            socket.emit("Countries", JSON.stringify({type: "countries", Countries: Countries}));
            
        })();
    }, 1000);

    socket.on('start', function (infor) {
        let info = JSON.parse(infor);
        function getInfo(info) {
            (async () => {
                //Get user country and user country clicks
                let UserCountry = await countries.getUserCountry(info)
                socket.emit("UserCountry", UserCountry);
            })(); 
        }
        getInfo(info);
    });


    socket.on('click', (infor) => {
        let info = JSON.parse(infor);
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
            
        }
        function getInfo(info) {
            (async () => {
                //Get user country and user country clicks
                let UserCountry = await countries.getUserCountry(info)
                socket.emit("UserCountry", UserCountry);
            })(); 
        }
        getInfo(info);
    })
});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public/')));

app.get("/" , (req, res) => {
    res.render("index.ejs");
});

server.listen(process.env.PORT || 3000);
