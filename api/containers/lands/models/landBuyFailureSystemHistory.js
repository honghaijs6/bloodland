const mongoose = require('mongoose');
const landBuyFailureSystemHistorySchema = new mongoose.Schema({
    buyerNid: { type: Number, default: -1 },
    sellerNid: { type: Number, default: -1 },
    quantity: { type: String, default: 0 },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    quadKey: { type: String },
    txid: { type: String, default: '' },
    reason: { type: String, default: '' },
    userId: { type : mongoose.Types.ObjectId },
    createdDate: { type: Date, default: Date.now },
    id: false
});

landBuyFailureSystemHistorySchema.set('toJSON', { virtuals: true });
module.exports =  landBuyFailureSystemHistorySchema;
