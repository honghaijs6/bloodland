const mongoose = require('mongoose');

const itemPendingSchema = new mongoose.Schema({
    //userId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' },
    itemId: { type: String, index: true, ref: 'Item' },
    nid: { type: Number },
    quantity: { type: Number },
    type: { type: String },
    //USING_ITEM: item đang sử dụng (đang mua, đang merge)
    //BUY_IN_SHOP: item đang được mua trong cửa hàng
});

module.exports = itemPendingSchema;
