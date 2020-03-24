const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const land23Schema = new mongoose.Schema({
    quadKey: { type: String, index: true, unique: true },
    quadKeyParent1: { type: String, index: true },
    quadKeyParent2: { type: String, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'LandCategory', default: null },
    initialPrice: { type: Number, default: 0 }, // initial price for Harvest Tree
    isPlant: { type: Boolean, default: true }, //is plant tree
    sellPrice: { type: Number, default: 0 }, // sell land for the price
    purchasePrice: { type: Number, default: 0 }, // sell land for the price
    forSaleStatus: {type: Boolean, default: false }, // user set forSale
    forbidStatus: {type: Boolean, default: false }, // forbid of land
    name: { type: String, default: '' },
    //userId: { type: Schema.Types.ObjectId, ref: 'User' },
    user: {
        _id: { type: Schema.Types.ObjectId, default: null },
        nid: { type: String },
        role : {type : String, default: 'user'},
        name: { type: String, default: '' },
        wId: { type: String },
    },
    txid: { type: String, default: '' },
    createdDate: { type: Date, default: Date.now },
    purchaseDate: { type: Date, default: Date.now },
    id: false
},
{ timestamps: true});

land23Schema.set('toJSON', { virtuals: true });
module.exports =land23Schema
