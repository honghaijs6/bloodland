const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemId: { type: String, required: true, index: true, unique: true, default: '' }, //C1, C2, C3 ...
    //=====================
    name_ko: { type: String, default: '' },
    name_en: { type: String, default: '' },
    name_vi: { type: String, default: '' },
    name_cn: { type: String, default: '' },
    //=====================
    descriptionForDetail_ko: { type: String, default: '' }, //캐릭터 설명
    descriptionForDetail_en: { type: String, default: '' }, //character Description
    descriptionForDetail_vi: { type: String, default: '' }, //Mô tả Nhân vật
    descriptionForDetail_cn: { type: String, default: '' }, //China
    //=====================
    descriptionForInventory_ko: { type: String, default: '' },
    descriptionForInventory_en: { type: String, default: '' },
    descriptionForInventory_vi: { type: String, default: '' },
    descriptionForInventory_cn: { type: String, default: '' },
    //=====================
    descriptionForShop_ko: { type: String, default: '' },
    descriptionForShop_en: { type: String, default: '' },
    descriptionForShop_vi: { type: String, default: '' },
    descriptionForShop_cn: { type: String, default: '' },
    //=====================
    defaultProfit: { type: Number, default: 0 }, // template T01: 10% , T02: 20% 
    price: { type: Number },
    category: { type: String, default: '' }, //'TREE' | 'RANDOMBOX' | ITEM | CHARACTER
    //=============================================================
    buyLimitAmount: {type: Number},
    buyLimitDate: {type:Date,default: Date.now },
    status:{ type:String, default:'' } , //CANBUY - HIDDEN - NOTBUY ----- show in shop - only for shop
});

module.exports = itemSchema;
