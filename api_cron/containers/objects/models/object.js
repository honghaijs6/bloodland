const mongoose = require('mongoose');
const objectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User' }, // --> CACHING
    nid: { type: Number, required: true, index: true },
    quadKey: { type: String, unique: true, index: true },
    quadKeyParent1: { type: String, index: true }, // --> CACHING
    quadKeyParent2: { type: String, index: true }, // --> CACHING
    //for ref
    item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' }, // New
    //
    itemId: { type: String, ref: 'Item' }, // T01 T06 T07 T08
    category: { type: String }, // category of item, ex; 'TREE' | 'RANDOMBOX' | 'BUYDIRECT' | 'PRESENT' | 'EVENT'
    getFromCode: { type: String }, // get from, ex; 'RANDOMBOX': 'R01' | 'R02' | 'R03' |..., 'PRESENT': 'P01' | 'P02' | 'P03' |..., 'EVENT': 'E01' | 'E02' | 'E03' |...


    waterPeriod: { type: Number, default: 2592000 },
    waterStartTime: { type: Date }, // New
    waterEndTime: { type: Date }, // New
    createdDateWater: { type: Date, default: Date.now },
    //giai đoạn thuốc
    nutritionalPeriod: { type: Number },
    //
    nutritionalStartTime1: { type: Date, default: null },
    nutritionalStartTime2: { type: Date, default: null },
    nutritionalStartTime3: { type: Date, default: null },
    nutritionalStartTime4: { type: Date, default: null },
    //
    nutritionalEndTime1: { type: Date, default: null },
    nutritionalEndTime2: { type: Date, default: null },
    nutritionalEndTime3: { type: Date, default: null },
    nutritionalEndTime4: { type: Date, default: null },
    //is really 4 time  ?
    //what happended in future if limit time is 5 or 6 or any ? 
    limitUseNutritional: { type: Number, default: 2 }, //limit use of nutritional: 0~4

    profit: { type: Number, default: 0 }, // profit =  10% + ..... // 
    //when use nutrient, how many percent 
    profitNutritional1: { type: Number, default: 0 }, // percent when use profit nutrional time 1
    profitNutritional2: { type: Number, default: 0 }, // percent of time 2 when use profit nutrional
    profitNutritional3: { type: Number, default: 0 }, // percent of time 3 when use profit nutrional
    profitNutritional4: { type: Number, default: 0 }, // percent of time 4 when use profit nutrional
    profitTotal: { type: Number, default: 0 }, // Set value to profit + profitNutritional1 + profitNutritional2 + profitNutritional3 + profitNutritional4, when update any profit

    //cứ mỡi n ngày trôi qua thì trả tiền
    periodPayProfit: { type: Number, default: 1 }, // New, default is 1 (= 1 day)

    price: { type: Number, default: 0 }, //giá item hoặc character - không đổi khi bị mua lại
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree


    plantedTree: { type: Boolean, default: false, index: true }, // isPlantedTree - New, true/false planted tree // --> CACHING
    deletedTree: { type: Boolean, default: false, index: true }, // is Tree Die ?- New, true/false deleted tree // --> CACHING

    createdDate: { type: Date, default: Date.now }, // ngày tạo
    plantedDate: { type: Date, default: null }, // ngày trồng cây
    deletedDate: { type: Date, default: null }, // ngày xóa cây

    //để sau 
    characterId: { type: mongoose.Schema.Types.ObjectId, default: null }, // New
    characterName: { type: String, default: null }, // New
    characterPrice: { type: Number, default: 0 }, // New
    //end để sau

    //giá ban đầu của miếng đất
    landPrice: { type: Number, default: 0 }, // New, price buy fitst time, (remain when resell) 20000
    //
    historyPrice: { type: Number, default: 0 }, // New, (reset when resell) 20000 -> 30000 -> 40000 , giá đất mua lại từ người khác

    distributedPrice: { type: Number, default: 0 }, // total blood get from profit 
    distributeLastDate: { type: Date, default: null },

    ext1: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext2: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext3: { type: mongoose.Schema.Types.Mixed, default: null }, // New
    ext4: { type: mongoose.Schema.Types.Mixed, default: null }, // New
});

module.exports = objectSchema
