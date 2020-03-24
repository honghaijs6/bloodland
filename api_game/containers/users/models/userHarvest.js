const mongoose = require('mongoose');

const userHarvestSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId },
    walletId: { type: String, required: true },
    total: { type: Number, required: true },
    items: {
            name: { type: String, default: '' },
            typeCode: { type: String, required: true },
            description: { type: String, default: '' },
            quadKey: { type: String },
            id: false,
            _id:false
        }
    ,
    id: false,
    createdDate: { type: Date, default: Date.now }
});

userHarvestSchema.set('toJSON', { virtuals: true });
module.exports = userHarvestSchema