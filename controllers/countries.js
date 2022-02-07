const countries = require('../models/countries');

module.exports = {
    async getTopCountries(req, res) {
        const countriesAPI = await countries.find();
        let top = countriesAPI.sort((a, b) => {
            return b.country_clicks - a.country_clicks;
        });
        res.send(top.slice(0, 30));
    },
    async getCountries(req, res) {
        res.send(await countries.find());
    },
    async getUserCountry(req, res) {
        try {
            const country = await countries.findOne({
                country_code: req.params.code,
            });
            res.status(200).json({
                name: country.country_name,
                clicks: country.country_clicks,
            });
        } catch (err) {
            throw err;
        }
    },
    updateCountries(req, res) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        countries.findOneAndUpdate(
            { country_code: req.body.country },
            { $inc: { country_clicks: req.body.clicks } },
            options,
            function (error, result) {
                if (error) {
                    res.status(400);
                    return error;
                }
            }
        );
    },
};
