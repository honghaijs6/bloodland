const mongoose = require('mongoose');
const landPendingHistorySchema = new mongoose.Schema({
    buyerNid: { type: Number, default: 0 },
    sellerNid: { type: Number, default: 0 },
    quantity: { type: String, default: 0 },
    amount: { type: Number, default: 0 },
    quadKey: { type: String, index: true },
    txid: { type: String, default: '' },
    userId: { type : mongoose.Types.ObjectId },
    createdDate: { type: Date, default: Date.now },
    id: false
});

landPendingHistorySchema.set('toJSON', { virtuals: true });
module.exports =  landPendingHistorySchema;
