const mongoose = require('mongoose');

const mergeHistorySchema = new mongoose.Schema({
    nid: { type: Number },
    items: [{
        itemId: { type: String },
        quantity: { type: Number }
    }],
    mergeItems: { type: Array, default: null },
    reqDate: { type: Date, default: Date.now },
    rspDate: { type: Date, default: null },
});

module.exports = mergeHistorySchema;
