const mongoose = require('mongoose');
const randomBoxInventorySchema = new mongoose.Schema({
    //1 row in DB is 1 box ?
    //
    userId: { type: mongoose.Schema.Types.ObjectId, index: true },
    randomBoxId:{type : String},
    quantity: {type : Number, default:0 },
    createdDate: { type: Date, default: Date.now },
    getFromCode: { type: String }, // B = BUY //,
    itemlist: [{
        itemId: { type:String, required: true },
        ratio: { type: Number, required: true },
        _id:false
    }],
    randomBox:{ type: mongoose.Schema.Types.ObjectId, ref: 'RandomBox' }, 
});

module.exports = randomBoxInventorySchema;
