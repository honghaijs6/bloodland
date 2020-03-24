const mongoose = require('mongoose');

const bloodUseSuccess = new mongoose.Schema({
    items: { type: mongoose.Schema.Types.Mixed, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    nid: { type: String, index: true, required: true }, // wallet Id
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

bloodUseSuccess.set('toJSON', { virtuals: true });
module.exports = bloodUseSuccess;
