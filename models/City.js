const mongoose = require('mongoose');

const citiessSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: true,
    },
    city_name: {
        type: String,
        required: true,
    },
    city_clicks: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('cities', citiessSchema);
