const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    user_ip: {
        type: String,
        required: true,
    },
    user_clicks: {
        type: Number,
        required: true,
    },
    user_country: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', UsersSchema);
