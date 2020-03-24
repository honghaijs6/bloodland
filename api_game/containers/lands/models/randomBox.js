const mongoose = require('mongoose');
const randomBoxSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true },
    name_ko: { type: String, default: '' },
    name_en: { type: String, default: '' },
    name_vi: { type: String, default: '' },
    description_ko: { type: String, default: '' },
    description_en: { type: String, default: '' },
    description_vi: { type: String, default: '' },
    price: { type: Number, default: 0 },
    itemlist: [{
        itemId: { type: String },
        ratio: { type: Number, required: true }
    }],
});

module.exports = randomBoxSchema;
