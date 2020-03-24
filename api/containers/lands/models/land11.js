const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const land11Schema = new mongoose.Schema({
    quadKey: { type: String, index: true, unique: true },
    quadKeyParent1: { type: String, index: true },
    quadKeyParent2: { type: String, index: true },
    landmarkCount: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    id: false
});
module.exports =  land11Schema
