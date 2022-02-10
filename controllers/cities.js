const cities = require('../models/City');

module.exports = {
    async getUserCity(req, res) {
        try {
            const city = await cities.find({ country_code: req.params.code });
            res.status(200).json(city);
        } catch (err) {
            throw err;
        }
    },
    async checkVisitorCity(req, res) {
        try {
            const city = await cities.findOne({ _id: req.params.id });
            res.status(200).json(city);
        } catch (err) {
            throw err;
        }
    },

    updateCities(info) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        cities.findOneAndUpdate(
            { _id: info.user_city },
            { $inc: { city_clicks: info.user_clicks } },
            options,
            function (error, result) {
                if (error) {
                    return error;
                }
            }
        );
    },
};
