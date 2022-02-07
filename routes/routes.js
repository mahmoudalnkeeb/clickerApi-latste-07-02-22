const cities = require('../controllers/cities');
const countries = require('../controllers/countries');
const total = require('../controllers/totals');
const users = require('../controllers/users');
let bannedIPs = ['49.37.156.121', '197.47.21.22', '149.200.185.107'];

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.redirect('https://thepraise.online/');
    });
    app.get('/api/top', (req, res) => {
        countries.getTopCountries(req, res);
    });
    app.post('/api/start', (req, res) => {
        users.startApi(req, res);
    });
    app.get('/api/countries', (req, res) => {
        countries.getCountries(req, res);
    });
    app.get('/api/all', (req, res) => {
        total.getTotalClicks(req, res);
    });
    app.get('/api/country/:code', (req, res) => {
        countries.getUserCountry(req, res);
    });
    app.get('/api/country-cities/:code', (req, res) => {
        cities.getUserCity(req, res);
    });
    app.get('/api/visitorcity/:id', (req, res) => {
        cities.checkVisitorCity(req, res);
    });
    app.post('/api/click', (req, res) => {
        if (bannedIPs.includes(req.body.ip)) {
            return res.send(
                'u are banned! contact me : https://www.facebook.com/AnwarRiffian'
            );
        } else if (req.body.clicks > 10) {
            return res.send(
                'u are banned! contact me : https://www.facebook.com/AnwarRiffian'
            );
        } else {
            countries.updateCountries(req, res);
            total.updateTotal(req, res);
            cities.updateCities(req, res);
            users.sendUserClicks(req, res);
        }
    });
};
