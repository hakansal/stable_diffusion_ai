
const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({

    paycheck: {
        type: Boolean,
        required: true
    },
    subs_limit_date: {
        type: Date,
        required: true
    },
    subs_logs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subs_log"
    }
});

module.exports = mongoose.model("Subs", SubscriberSchema);