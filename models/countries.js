const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: true,
    },
    country_name: {
        type: String,
        required: true,
    },
    country_clicks: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('countries', countriesSchema);
