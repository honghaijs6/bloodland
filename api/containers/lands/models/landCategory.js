const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new mongoose.Schema({
    name: { type: String, default: 'empty' },
    userId : { type: Schema.Types.ObjectId, ref: 'User' },
    createdDate: { type: Date, default: Date.now },
    typeOfCate : { type: String, default: 'normal'},
    center : {
    	lat: { type: Number, default: 0 },
    	lng: { type: Number, default: 0 },
    },
    id: false,
});

categorySchema.set('toJSON', { virtuals: true });
module.exports = categorySchema