const mongoose = require('mongoose');
const landPendingHistorySchema = new mongoose.Schema({
	quadKey: { type: String, index: true },
	txid: { type: String,  default: '' },
    payed: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    buyerNid: { type: Number, default: false },
    sellerNid: { type: Number, default: false },
    refunded: { type: Boolean, default: false },
    failed: { type: Boolean, default: false },
    error: { type: String, default: '' },
    createDate: { type: Date, default: Date.now },
});
module.exports =  landPendingHistorySchema;
