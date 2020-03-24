const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const adminLandHistorySchema = new mongoose.Schema({
	type: { type: String },
    quadKey: { type: String },
    seller: { type: Schema.Types.ObjectId, default: null },
    buyer: { type: Schema.Types.ObjectId, default: null },
    price: { type: Number, default: 0 }, // sold price for each land
    nid: { type: Number, default: -1 },
    dateTrading: { type: Date, default: Date.now },
});
module.exports = adminLandHistorySchema;
