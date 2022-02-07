const Total = require('../models/Total');

module.exports = {
    async getTotalClicks(req, res) {
        try {
            const all = await Total.find();
            res.status(200).json({ clicks: all[0].total_clicks });
        } catch (err) {
            res.status(400);
            throw err;
        }
    },
    updateTotal(req, res) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        Total.findOneAndUpdate(
            { _id: '6195592b70226a6cc73d9d29' },
            { $inc: { total_clicks: req.body.clicks } },
            options,
            function (error, result) {
                if (error) return;
                // do something with the document
            }
        );
    },
};
