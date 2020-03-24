const mongoose = require('mongoose');
const landBuyFailureHistorySchema = new mongoose.Schema({
    buyerNid: { type: Number, default: -1 },
    sellerNid: { type: Number, default: -1 },
    quantity: { type: String, default: 0 },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    quadKey: { type: String },
    txid: { type: String, default: '' },
    userId: { type : mongoose.Types.ObjectId },
    createdDate: { type: Date, default: Date.now },
    id: false
});

landBuyFailureHistorySchema.set('toJSON', { virtuals: true });
module.exports =  landBuyFailureHistorySchema
