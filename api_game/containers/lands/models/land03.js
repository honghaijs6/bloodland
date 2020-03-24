const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const land03Schema = new mongoose.Schema({
    quadKey: { type: String, index: true, unique: true },
    count: { type: Number, default: 0 },
    id: false
});
module.exports = land03Schema
