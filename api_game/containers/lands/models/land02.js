const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const land02Schema = new mongoose.Schema({
    quadKey: { type: String, index: true, unique: true },
    count: { type: Number, default: 0 },
    id: false
});
module.exports = land02Schema

