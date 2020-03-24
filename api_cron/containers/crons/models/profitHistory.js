const mongoose = require('mongoose');

const profitHistorySchema = new mongoose.Schema({
    items: [{
	    nid: { type: Number },
	    amount: { type: String }
    }],
    txid: { type: String, default: "" },
    successes: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
});

module.exports = profitHistorySchema;

