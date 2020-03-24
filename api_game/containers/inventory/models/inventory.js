const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, // --> CACHING
    itemId: { type: String }, //I01 , I02 , T01
    item:{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, 
    category: { type: String }, // category of item, ex: TREE | RANDOMBOX | ITEM | CHARACTER
    getFromCode: { type: String }, // B = BUY //  
    // get from, ex; 'RANDOMBOX': 'R01' | 'R02' | 'R03' |..., 'PRESENT': 'P01' | 'P02' | 'P03' |..., 'EVENT': 'E01' | 'E02' | 'E03' |...
                                  //buying:S01:CHARSHOP - S02:ITEMSHOP - S03:GIFTSHOP
    /*
        getFromCode:
        1. Nhận từ randombox - RANDOMBOX (R)
        - R01: Nhận từ hộp thường
        - R02: Nhận từ hộp hiếm
        - R03: Nhận từ hộp huyền thoại
        2. Mua từ shop (B)
        - B01: Mua từ shop
        3. PRESENT (P) => chưa sử dụng
        4. Nhận từ event - EVENT (E) => chưa sử dụng
        5. Nhận từ kết hợp cây (M)
        - M01: nhận từ kết hợp cây
    */
    quantity: {type : Number, default:0 },
    createdDate: { type: Date, default: Date.now },
    // position: { type: Number, default: 0 },
    defaultProfit: { type: Number, default: 0 }, // template T01: 10% , T02: 20% .

    updateDate: [
        { type: Date, default: Date.now }
    ],
});

// //receive item log
// {
//     userId: 'aaasdsadsad',
//     itemId : 'T01',
//     category : 'TREE'
//     getFromCode: 'B',
//     quantity :5,
//     date : ''
// }

//use item log
// {
//     userId: 'aaasdsadsad',
//     itemId : 'T01',
//     category : 'TREE'
//     // getFromCode: 'B',
//     quantity :5,
//     date : ''
// }

module.exports = inventorySchema
