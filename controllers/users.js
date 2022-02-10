const User = require('../models/User');



module.exports = {
    async startApi(info) {
        var query = User.find({
            user_ip: info.user_ip,
        })
            .lean()
            .limit(1);

        // Find the document
        query.exec(async function (error, result) {
            var savedUser = null;
            if (error) {
                throw error;
            }
            // If the document doesn't exist
            if (!result.length) {
                // Create a new one
                const newUser = new User({
                    user_ip: info.user_ip,
                    user_clicks: info.user_clicks,
                    user_country: info.user_country,
                });
                savedUser = await newUser.save();
                savedUser.save(function (error) {
                    if (error) {
                        return error;
                    }
                });
            } else {
                savedUser = await User.findOne({ users_id: info.user_ip });
                return JSON.stringify({
                    ip: savedUser.user_ip,
                    clicks: savedUser.user_clicks,
                    country: savedUser.user_country
                })
            }
        });
    },
    sendUserClicks(info) {
        var query = { user_ip: info.user_ip },
            update = {
                user_ip: info.user_ip,
                $inc: { user_clicks: info.user_clicks },
                user_country: info.user_country,
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the User and update
        User.findOneAndUpdate(query, update, options, function (error, result) {
            if (error) return;
            // do something with the document
        });
    },
};
