const Total = require('../models/Total');

module.exports = {
    async getTotalClicks() {
        try {
            const all = await Total.find();
            return all[0].total_clicks;
        } catch (err) {
            console.log(err);
        }
    },
    updateTotal(info) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        Total.findOneAndUpdate(
            { _id: '6195592b70226a6cc73d9d29' },
            { $inc: { total_clicks: info.user_clicks } },
            options,
            function (error, result) {
                if (error) return;
                // do something with the document
            }
        );
    },
};
