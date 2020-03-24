const mongoose = require('mongoose');
const characterSchema = new mongoose.Schema({
    characterId: { type: String, required: true, index: true, unique: true, default: '' }, //C1, C2, C3 ...
    name_ko: { type: String, default: '' },
    name_en: { type: String, default: '' },
    name_vi: { type: String, default: '' },
    descriptionForDetail_ko: { type: String, default: '' }, //캐릭터 설명
    descriptionForDetail_en: { type: String, default: '' }, //character Description
    descriptionForDetail_vi: { type: String, default: '' }, //Mô tả Nhân vật
    //=====================
    descriptionForInventory_ko: { type: String, default: '' },
    descriptionForInventory_en: { type: String, default: '' },
    descriptionForInventory_vi: { type: String, default: '' },
    descriptionForShop_ko: { type: String, default: '' },
    descriptionForShop_en: { type: String, default: '' },
    descriptionForShop_vi: { type: String, default: '' },
    //=====================
    price: { type: String, default: '' },
    imagePath: { type: String, default: '' },
    type: { type: String, default: '' },
});

module.exports = characterSchema;

// {
//     "name": "일반 나무",
//     "typeCode": "normal-blood-tree",
//     "descriptionForInventory": "가장 일반적인 나무<br/>연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.",
//     "descriptionForDetail": "연 이율이 0.6%를 가지고 있으며<br/>마우스 드래그로  나의 랜드위에 <br/>사용할 수 있다",
//     "descriptionForShop": "가장 일반적인 나무 연 0.6%의 고정이율을 <br/>가지고 있다.<br/>하루마다 이자를 받는다.",
//     "image" : "normal-blood-tree.png",
//     "type":"blood-tree"
// }