const mongoose = require('mongoose');
const bitaminHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, // --> CACHING
    category: { type: String },
    categoryDetail: { type: String, default: null },
    nid: { type: Number, index: true },
    amount: { type: Number },
    items: [{
        nid: { type: Number, index: true },
        amount: { type: Number },
    }],
    txid: { type: String },
    status: { type: Boolean, default: false },
    error: { type: String, default: "" },
}, { timestamps: true});

module.exports = bitaminHistorySchema;

/*  
    category:
    RECEIVE: nhận bitamin
        + PROFIT: từ thu hoạch cây
    USE: sử dụng
        + BUY TREE: để mua cây
    EXCHANGE: trao đổi
*/

/*
    categoryDetail:
    + PROFIT: từ thu hoạch cây
    + BUYTREE: để mua cây
*/