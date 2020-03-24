// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const landGroupSchema = new mongoose.Schema({
//     userId: { type: Schema.Types.ObjectId },
//     name: { type: String, default: 'empty' },
//     mmLatLng: {
//         minLat: { type: Number, default: 0 },
//         maxLat: { type: Number, default: 0 },
//         minLng: { type: Number, default: 0 },
//         maxLng: { type: Number, default: 0 },
//     },
//     lands: [
//         {
//             quadKey: { type: String },
//             tile: {
//                 x: { type: Number },
//                 y: { type: Number },
//                 level: { type: Number },
//                 lat: { type: Number },
//                 lng: { type: Number },
//             },
//             initialPrice: { type: Number, default: 0 }, // initial price for Harvest Tree
//             sellPrice: { type: Number, default: 0 }, // sell land for the price
//             forSaleStatus: {type: Boolean, default: false }, // user set forSale
//             forbidStatus: {type: Boolean, default: false }, // forbid of land
//             name: { type: String, default: '' },
//             userId : { type: Schema.Types.ObjectId, ref: 'User' },
//             createdDate: { type: Date, default: Date.now },
//             id: false
//         }
//     ],
//     createdDate: { type: Date, default: Date.now },
//     id: false
// });

// landGroupSchema.set('toJSON', { virtuals: true });
// module.exports = mongoose.model('LandGroup', landGroupSchema);



const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const landGroupSchema = new mongoose.Schema({
    quadKey: { type: String },
    tile: {
        x: { type: Number },
        y: { type: Number },
        level: { type: Number },
        lat: { type: Number },
        lng: { type: Number },
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'LandCategory', default: null },
    initialPrice: { type: Number, default: 0 }, // initial price for Harvest Tree
    isPlant: { type: Boolean, default: true },
    sellPrice: { type: Number, default: 0 }, // sell land for the price
    forSaleStatus: {type: Boolean, default: false }, // user set forSale
    forbidStatus: {type: Boolean, default: false }, // forbid of land
    name: { type: String, default: '' },
    user : {
        _id: { type: Schema.Types.ObjectId, default: null },
        nid: { type: String, default: '' }
    },
    txid: { type: String, default: '' },
    createdDate: { type: Date, default: Date.now },
    id: false
});

landGroupSchema.set('toJSON', { virtuals: true });
module.exports =  landGroupSchema