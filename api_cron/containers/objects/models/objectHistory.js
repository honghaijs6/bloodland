const mongoose = require('mongoose');
const objectHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, // --> CACHING
    quadKey: { type: String },
    item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' }, // New
    itemId: { type: String, ref: 'Item' }, // T01 T06 T07 T08
    category: { type: String }, // category of item, ex; 'TREE' | 'RANDOMBOX' | 'BUYDIRECT' | 'PRESENT' | 'EVENT'
    deletedDate: { type: Date, default: null }, // ngày xóa cây
});

module.exports = objectHistorySchema
