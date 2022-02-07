const User = require('../models/User');



module.exports = {
    async startApi(req, res) {
        var query = User.find({
            user_ip: req.body.ip,
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
                    user_ip: req.body.ip,
                    user_clicks: req.body.clicks,
                    user_country: req.body.country,
                });
                savedUser = await newUser.save();
                savedUser.save(function (error) {
                    if (error) {
                        return error;
                    }
                });
            } else {
                savedUser = await User.findOne({ users_id: req.body.ip });
                res.status(200).json({
                    ip: savedUser.user_ip,
                    clicks: savedUser.user_clicks,
                    country: savedUser.user_country,
                });
            }
        });
    },
    sendUserClicks(req, res) {
        var query = { user_ip: req.body.ip },
            update = {
                user_ip: req.body.ip,
                $inc: { user_clicks: req.body.clicks },
                user_country: req.body.country,
            },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the User and update
        User.findOneAndUpdate(query, update, options, function (error, result) {
            if (error) return;
            // do something with the document
        });
    },
};
