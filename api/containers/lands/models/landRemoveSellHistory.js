const mongoose = require('mongoose');
const landRemoveSellHistorySchema = new mongoose.Schema({
    sellerId: { type: mongoose.Types.ObjectId },
    sellerNid: { type: Number, default: -1 },
    success: { type: Boolean, default: false },
    quadKey: { type: String },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
    id: false
});

landRemoveSellHistorySchema.set('toJSON', { virtuals: true });
module.exports =  landRemoveSellHistorySchema;
