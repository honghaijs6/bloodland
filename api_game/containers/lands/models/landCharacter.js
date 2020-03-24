const mongoose = require('mongoose');
const gameObjectSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, // --> CACHING
    quadKey: { type: String },
    quadKeyParent1: { type: String, index: true }, // --> CACHING
    quadKeyParent2: { type: String, index: true }, // --> CACHING
    item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' }, // New
    category: { type: String }, // category of item, ex; 'TREE' | 'RANDOMBOX' | 'BUYDIRECT' | 'PRESENT' | 'EVENT'
    getFromCode: { type: String }, // get from, ex; 'RANDOMBOX': 'R01' | 'R02' | 'R03' |..., 'PRESENT': 'P01' | 'P02' | 'P03' |..., 'EVENT': 'E01' | 'E02' | 'E03' |...
    waterPeriod: { type: Number, default: 2592000 },
    waterStartTime: { type: Date }, // New
    waterEndTime: { type: Date }, // New
    nutritionalPeriod: { type: Number, default: null }, // New
    nutritionalStartTime1: { type: Number, default: null }, // New
    nutritionalStartTime2: { type: Number, default: null }, // New
    nutritionalStartTime3: { type: Number, default: null }, // New
    nutritionalStartTime4: { type: Number, default: null }, // New
    limitUseNutritional: { type: Number, default: 2 }, //limit use of nutritional: 0~4
    
    profit: { type: Number, default: 0 }, // profit
    profitNutritional1: { type: Number, default: null }, // New
    profitNutritional2: { type: Number, default: null }, // New
    profitNutritional3: { type: Number, default: null }, // New
    profitNutritional4: { type: Number, default: null }, // New
    periodPayProfit: { type: Number, default: 1 }, // New, default is 1 (= 1 day)

    price: { type: Number, default: 0 }, //giá item hoặc character - không đổi khi bị mua lại
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
    createdDateWater: { type: Date, default: Date.now },

    plantedTree: { type: Boolean, default: false, index: true }, // ngày trồng cây - New, true/false planted tree // --> CACHING
    deletedTree: { type: Boolean, default: false, index: true }, // ngày xóa cây - New, true/false deleted tree // --> CACHING

    createdDate: { type: Date, default: Date.now }, // ngày tạo
    plantedDate: { type: Date, default: null }, // ngày trồng cây
    deletedDate: { type: Date, default: null }, // ngày xóa cây

    characterId: { type: mongoose.Schema.Types.ObjectId, default: null }, // New
    characterName: { type: String, default: null }, // New
    characterPrice: { type: Number, default: 0 }, // New

    landPrice: { type: Number, default: 0 }, // New, price buy fitst time, (remain when resell)
    historyPrice: { type: Number, default: 0 }, // New, (reset when resell)

    distributedPrice: {type: Number, default: 0}, // New, (reset when resell)

    ext1: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext2: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext3: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext4: { type: mongoose.Schema.Types.Mixed, default: null }, // New
});

module.exports = gameObjectSchema
