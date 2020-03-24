const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    categoryId: { type: String, required: true, index: true, unique: true, default: '' }, //R, I, T, C
    categoryName_ko: { type: String, default: '' }, //랜덤박스, 아이템, 나무, 캐릭터
    categoryName_en: { type: String, default: '' }, //RandomBox, Item, Tree, Character
    categoryName_vi: { type: String, default: '' }, //RandomBox, Vật phẩm, Cây, Nhân vật
});

module.exports = categorySchema
