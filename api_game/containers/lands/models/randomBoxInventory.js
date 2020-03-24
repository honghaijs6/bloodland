const mongoose = require('mongoose');
const characterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true },
    boxTypeCode: {type: String },
    openedItemId: { type: mongoose.Schema.Types.ObjectId },
    price: { type: Number, required: true, default: 0 },
    opened: { type: Boolean, default: false, index: true },
    openedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
});

module.exports = characterSchema;
