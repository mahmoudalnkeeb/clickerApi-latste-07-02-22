const countries = require('../models/countries');

module.exports = {
    async getTopCountries() {
        const countriesAPI = await countries.find();
        let top = countriesAPI.sort((a, b) => {
            return b.country_clicks - a.country_clicks;
        });
        return top.slice(0, 30);
    },
    async getCountries() {
        return await countries.find();
    },
    async getUserCountry(info) {
        try {
            const country = await countries.findOne({ country_code: info.user_country});
            return JSON.stringify({
                name: country.country_name,
                clicks: country.country_clicks
            })
            
        } catch (err) {
            throw err;
        }
    },
    updateCountries(info) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        countries.findOneAndUpdate(
            { country_code: info.user_country },
            { $inc: { country_clicks: info.user_clicks } },
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
