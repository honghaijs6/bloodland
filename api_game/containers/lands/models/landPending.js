const mongoose = require('mongoose');
const landPendingSchema = new mongoose.Schema({
    buyerNid: { type: Number, default: 0 },
    sellerNid: { type: Number, default: 0 },
    name: { type: String, default: 'land' },
    category: { type: String, default: 'bloodland:land' },
    quantity: { type: String, default: 0 },
    amount: { type: Number, default: 0 },
    quadKey: { type: String, unique: true, required: true },
    txid: { type: String, default: '' },
    userId: {type : mongoose.Types.ObjectId},
    createdDate: { type: Date, default: Date.now },
    id: false
});

landPendingSchema.set('toJSON', { virtuals: true });
module.exports = landPendingSchema
