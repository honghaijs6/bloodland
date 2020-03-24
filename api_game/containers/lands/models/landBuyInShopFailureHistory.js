const mongoose = require('mongoose');
const buyInShopFailureHistorySchema = new mongoose.Schema({
    nid: { type: Number, default: 0 },
    itemId: { type: String },
    userId: { type : mongoose.Types.ObjectId },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
});
module.exports =  buyInShopFailureHistorySchema;