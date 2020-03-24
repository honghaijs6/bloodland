const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const historySchema = new mongoose.Schema({
    landId : { type: Schema.Types.ObjectId, ref: 'Land23' },
    status : {type: Boolean, default: false},
    seller: { type: Schema.Types.ObjectId, default: null },
    sellerDeleted: { type: Boolean, default: false },
    buyer: { type: Schema.Types.ObjectId, default: null },
    buyerDeleted: { type: Boolean, default: false },
    landNumber: { type: Number },
    soldPrice: { type: Number, default: 0 }, // sold price for each land
    dateTrading: { type: Date, default: Date.now },
});

historySchema.set('toJSON', { virtuals: true });
module.exports =  historySchema
