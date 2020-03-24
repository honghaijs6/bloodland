const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const landCharacterSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId },
    quadKey: { type: String, index: true },
    quadKeyParent1: { type: String, index: true },
    quadKeyParent2: { type: String, index: true },
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    descriptionShop: { type: String, default: '' },
    waterPeriod: { type: Number, default: 2592000 },
    waterWarning: { type: Boolean, default: false },
    transformPeriod: { type: Number, default: 0 },
    transformToTypeCode: { type: String, default: '' },
    limitUseNutritional: { type: Number, default: 2 }, //limit use of nutritional
    limitUseSmell: { type: Number, default: 3 }, //limit use of smell
    limitProfit: { type: Number, default: 0 }, //limit got of profit
    profit: { type: Number, default: 0 }, // profit
    profitHarvest: { type: Number, default: 4 }, // profit Harvest
    profitDay: { type: Number, default: 0 },
    profitMonth: { type: Number, default: 0 },
    profitYear: { type: Number, default: 0 },
    profitGot: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
    createdDateWater: { type: Number, default: Date.now },
    createdDateMonthHarvest: { type: Number, default: Date.now },
    createdDateYearHarvest: { type: Number, default: Date.now },
    createdDate: { type: Number, default: Date.now },
    id: false,
    // _id:false
});

landCharacterSchema.set('toJSON', { virtuals: true });
module.exports = landCharacterSchema
