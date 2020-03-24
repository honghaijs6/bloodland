const mongoose = require('mongoose');
const receivedWaySchema = new mongoose.Schema({
    receivedWayId: { type: String, required: true, default: '' }, //B, R, E, P
    receivedWayName_ko: { type: String, default: '' }, //구매, 랜덤박스, 이벤트, 선물
    receivedWayName_en: { type: String, default: '' }, //Buying, RandomBox, Event, Present
    receivedWayName_vi: { type: String, default: '' }, //Mua, Hộp ngẫu nhiên, Sự kiện, Hiện tại
});

module.exports = receivedWaySchema;
