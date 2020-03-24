const mongoose = require('mongoose');
const landItemHarvestSchema = new mongoose.Schema({
    items: { type: Array },
    txid: { type: String, default: '' },
    createdDate: { type: Number, default: Date.now },
});

landItemHarvestSchema.set('toJSON', { virtuals: true });
module.exports = landItemHarvestSchema