const mongoose = require('mongoose');

const bloodPending = new mongoose.Schema({
    items: { type: mongoose.Schema.Types.Mixed, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, unique: true },
    nid: { type: String, unique: true, index: true }, // wallet Id
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

bloodPending.set('toJSON', { virtuals: true });
module.exports = bloodPending;
