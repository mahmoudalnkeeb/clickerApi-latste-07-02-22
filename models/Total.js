const mongoose = require('mongoose');

const TotalSchema = new mongoose.Schema({
    total_clicks: {
        type: Number,
        required: true,
    },
    total_countries: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Total', TotalSchema);
