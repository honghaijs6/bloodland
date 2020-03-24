const mongoose = require('mongoose');
const landDefaultHistorySchema = new mongoose.Schema({
    landPrice: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
});
module.exports =  landDefaultHistorySchema;
