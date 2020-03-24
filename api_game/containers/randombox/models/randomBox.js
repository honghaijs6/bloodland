const mongoose = require('mongoose');
const randomBoxSchema = new mongoose.Schema({
    randomBoxId: { type: String, required: true, index: true, unique: true, default: '' }, //R01, R02, R03 ...

    name_ko: { type: String, default: '' },
    name_en: { type: String, default: '' },
    name_vi: { type: String, default: '' },
    name_cn: { type: String, default: '' },

    descriptionForDetail_ko: { type: String, default: '' }, //캐릭터 설명
    descriptionForDetail_en: { type: String, default: '' }, //character Description
    descriptionForDetail_vi: { type: String, default: '' }, //Mô tả Nhân vật
    descriptionForDetail_cn: { type: String, default: '' }, //China

    descriptionForInventory_ko: { type: String, default: '' },
    descriptionForInventory_en: { type: String, default: '' },
    descriptionForInventory_vi: { type: String, default: '' },
    descriptionForInventory_cn: { type: String, default: '' },

    descriptionForShop_ko: { type: String, default: '' },
    descriptionForShop_en: { type: String, default: '' },
    descriptionForShop_vi: { type: String, default: '' },
    descriptionForShop_cn: { type: String, default: '' },

    receivingBoxRatio:{type: Number, required: true},
    price: { type: Number, default: 0 },
    itemlist: [{
        itemId: { type:String, required: true },
        ratio: { type: Number, required: true },
        _id:false
    }],
});

module.exports = randomBoxSchema;
