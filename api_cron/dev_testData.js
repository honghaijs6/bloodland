const mongoose = require('mongoose');
const groupBy = require('lodash.groupby');
const isEqual = require('lodash.isequal');
const uniq = require('lodash.uniq');
const differenceWith = require('lodash.differencewith');
const cloneDeep = require('lodash.clonedeep');
const ObjectId = require('mongoose').Types.ObjectId;
const dotenv = require('dotenv');
const isNull = require('lodash.isnull');
dotenv.config();

const { bloodDB, landLogDB, bloodGameDB } = require('./db');
const config = require('./db/config');
//const { setLandPrice } = require('./containers/lands/services/landPrice');
// //old code
const dbURI = config.connectHost;

bloodDB.Promise = global.Promise;
const db = {
    //Land
    User: bloodDB.model('User', require('./containers/users/models/user')),
    UserTrade: bloodDB.model('UserTrade', require('./containers/users/models/userTrade')),
    UserMail: bloodDB.model('UserMail', require('./containers/users/models/userMail')),
    UserFriend: bloodDB.model('UserFriend', require('./containers/users/models/userFriend')),
    UserSetting: bloodDB.model('UserSetting', require('./containers/users/models/userSetting')),
    UserHarvest: bloodDB.model('UserHarvest', require('./containers/users/models/userHarvest')),
    Notify: bloodDB.model('Notify', require('./containers/notifies/models/notify')),
    AdminNotify: bloodDB.model('AdminNotify', require('./containers/notifies/models/notifyAdmin')),
    LandConfig: bloodDB.model('LandConfig', require('./containers/lands/models/LandConfig')),
    LandCategory: bloodDB.model('LandCategory', require('./containers/lands/models/landCategory')),
    LandHistory: bloodDB.model('LandHistory', require('./containers/lands/models/landHistory')),
    LandPending: bloodDB.model('LandPending', require('./containers/lands/models/landPending')),


    Land01: bloodDB.model('Land01', require('./containers/lands/models/land01')),
    Land02: bloodDB.model('Land02', require('./containers/lands/models/land02')),
    Land03: bloodDB.model('Land03', require('./containers/lands/models/land03')),
    Land04: bloodDB.model('Land04', require('./containers/lands/models/land04')),
    Land05: bloodDB.model('Land05', require('./containers/lands/models/land05')),
    Land06: bloodDB.model('Land06', require('./containers/lands/models/land06')),
    Land07: bloodDB.model('Land07', require('./containers/lands/models/land07')),
    Land08: bloodDB.model('Land08', require('./containers/lands/models/land08')),
    Land09: bloodDB.model('Land09', require('./containers/lands/models/land09')),
    Land10: bloodDB.model('Land10', require('./containers/lands/models/land10')),
    Land11: bloodDB.model('Land11', require('./containers/lands/models/land11')),
    Land12: bloodDB.model('Land12', require('./containers/lands/models/land12')),
    Land13: bloodDB.model('Land13', require('./containers/lands/models/land13')),
    Land14: bloodDB.model('Land14', require('./containers/lands/models/land14')),
    Land15: bloodDB.model('Land15', require('./containers/lands/models/land15')),
    Land16: bloodDB.model('Land16', require('./containers/lands/models/land16')),
    Land17: bloodDB.model('Land17', require('./containers/lands/models/land17')),
    Land18: bloodDB.model('Land18', require('./containers/lands/models/land18')),
    Land19: bloodDB.model('Land19', require('./containers/lands/models/land19')),
    Land20: bloodDB.model('Land20', require('./containers/lands/models/land20')),
    Land21: bloodDB.model('Land21', require('./containers/lands/models/land21')),
    Land22: bloodDB.model('Land22', require('./containers/lands/models/land22')),
    Land23: bloodDB.model('Land23', require('./containers/lands/models/land23')),

    //Game
    //Game
    Item: bloodGameDB.model('Item', require('./containers/item/models/item')),
    Object: bloodGameDB.model('Object', require('./containers/objects/models/object')),
    ObjectHistory: bloodGameDB.model('ObjectHistory', require('./containers/objects/models/objectHistory')),
    Inventory: bloodGameDB.model('Inventory', require('./containers/inventory/models/inventory')),
    RandomBox: bloodGameDB.model('RandomBox', require('./containers/randombox/models/randomBox')),
    RandomBoxInventory: bloodGameDB.model('RandomBoxInventory', require('./containers/randomBoxInventory/models/randomBoxInventory')),

    AdminLandHistory: landLogDB.model('AdminLandHistory', require('./containers/lands/models/adminlLandHistory')),
    LandPendingHistory: landLogDB.model('LandPendingHistory', require('./containers/lands/models/landPendingHistory')),
    LandBuySuccessHistory: landLogDB.model('landBuySuccessHistory', require('./containers/lands/models/landBuySuccessHistory')),
    LandBuyFailureHistory: landLogDB.model('landBuyFailureHistory', require('./containers/lands/models/landBuyFailureHistory')),
    LandSellHistory: landLogDB.model('landSellHistory', require('./containers/lands/models/landSellHistory')),
    LandRemoveSellHistory: landLogDB.model('landRemoveSellHistory', require('./containers/lands/models/landRemoveSellHistory')),
    LandChangePriceHistory: landLogDB.model('landChangePriceHistory', require('./containers/lands/models/landChangePriceHistory')),
    //land default price
    LandDefaultPriceHistory: landLogDB.model('landDefaultHistory', require('./containers/lands/models/landDefaultHistory')),
};




async function createItem(){
    const data = [
        {
            "itemId" : "C01",
            "name_ko" : "꼬마 악어",
            "name_en" : "Little Crocodile",
            "name_vi" : "_Cá sấu nhỏ",
            "name_cn" : "小鳄鱼",
            "descriptionForDetail_ko" : "언제나 웃고 있다. 엄마가 선물해준 옷|언제나 웃고 있다. 엄마가 선물해준 옷.",
            "descriptionForDetail_en" : "Always smiling. Cloth mom gave as a present.|Always smiling. Cloth mom gave as a present.",
            "descriptionForDetail_vi" : "lúc nào cũng cười. mẹ cho quà... cười/luôn luôn cười. Mẹ cho quà... cười.",
            "descriptionForDetail_cn" : "永远都在微笑。妈妈送的衣服|永远都在微笑。妈妈送的衣服",
            "descriptionForInventory_ko" : "언제나 웃고 있다. 엄마가 선물해준 옷|언제나 웃고 있다. 엄마가 선물해준 옷.",
            "descriptionForInventory_en" : "Always smiling. Cloth mom gave as a present.|Always smiling. Cloth mom gave as a present.",
            "descriptionForInventory_vi" : "lúc nào cũng cười. mẹ cho quà cười/luôn luôn cười. Mẹ cho quà cười.",
            "descriptionForInventory_cn" : "永远都在微笑。妈妈送的衣服|永远都在微笑。妈妈送的衣服",
            "descriptionForShop_ko" : "언제나 웃고 있다. 엄마가 선물해준 옷.",
            "descriptionForShop_en" : "Always smiling. Cloth mom gave as a present.",
            "descriptionForShop_vi" :"lúc nào cũng cười. mẹ cho quà cười",
            "descriptionForShop_cn" : "永远都在微笑。妈妈送的衣服",
            "interestRate" : 0,
            "price" : 1000,
            "category" : "CHARACTER",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "C02",
            "name_ko" : "꼬마 강아지",
            "name_en" : "Little Puppy",
            "name_vi" : "Chú cún nhỏ_",
            "name_cn" : "小狗狗",
            "descriptionForDetail_ko" : "언제나 즐거운 아이. 동생을 피해 다닌다.",
            "descriptionForDetail_en" : "A boy who is always happy. Runs away from his brother.",
            "descriptionForDetail_vi" : "Đứa trẻ luôn vui vẻ. Nhường em khi đi qua",
            "descriptionForDetail_cn" : "永远都很快乐的宝宝 躲开了弟弟。",
            "descriptionForInventory_ko" : "언제나 즐거운 아이. 동생을 피해 다닌다.",
            "descriptionForInventory_en" : "A boy who is always happy. Runs away from his brother.",
            "descriptionForInventory_vi" : "Đứa trẻ luôn vui vẻ. Nhường em khi đi qua",
            "descriptionForInventory_cn" : "永远都很快乐的宝宝 躲开了弟弟。",
            "descriptionForShop_ko" : "언제나 즐거운 아이. 동생을 피해 다닌다.",
            "descriptionForShop_en" : "A boy who is always happy. Runs away from his brother.",
            "descriptionForShop_vi" : "Đứa trẻ luôn vui vẻ. Nhường em khi đi qua",
            "descriptionForShop_cn" : "永远都很快乐的宝宝 躲开了弟弟。",
            "interestRate" : 0,
            "price" : 1000,
            "category" : "CHARACTER",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "C03",
            "name_ko" : "분홍 알파카",
            "name_en" : "Pink Alpaca",
            "name_vi" : "_Alpica hồng",
            "name_cn" : "粉红羊驼",
            "descriptionForDetail_ko" : "언제나 당신을 바라만 보고 있는 동물.",
            "descriptionForDetail_en" : "An animal that is always looking at you.",
            "descriptionForDetail_vi" : "Con vật luôn chỉ nhìn mỗi bạn",
            "descriptionForDetail_cn" : "永远都在看着你的动物。",
            "descriptionForInventory_ko" : "언제나 당신을 바라만 보고 있는 동물.",
            "descriptionForInventory_en" : "An animal that is always looking at you.",
            "descriptionForInventory_vi" : "Con vật luôn chỉ nhìn mỗi bạn",
            "descriptionForInventory_cn" : "永远都在看着你的动物。",
            "descriptionForShop_ko" : "언제나 당신을 바라만 보고 있는 동물.",
            "descriptionForShop_en" : "An animal that is always looking at you.",
            "descriptionForShop_vi" : "Con vật luôn chỉ nhìn mỗi bạn",
            "descriptionForShop_cn" : "永远都在看着你的动物。",
            "interestRate" : 0,
            "price" : 1000,
            "category" : "CHARACTER",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "C04",
            "name_ko" : "호박 마녀",
            "name_en" : "Pumpkin Witch",
            "name_vi" : "_Cô phù thủy bí ngô",
            "name_cn" : "南瓜巫女",
            "descriptionForDetail_ko" : "호박 마녀.",
            "descriptionForDetail_en" : "Pumpkin Witch",
            "descriptionForDetail_vi" : "Phù thủy bí ngô",
            "descriptionForDetail_cn" : "南瓜巫女",
            "descriptionForInventory_ko" : "호박 마녀.",
            "descriptionForInventory_en" : "Pumpkin Witch",
            "descriptionForInventory_vi" : "Phù thủy bí ngô",
            "descriptionForInventory_cn" : "南瓜巫女",
            "descriptionForShop_ko" : "호박 마녀.",
            "descriptionForShop_en" : "Pumpkin Witch",
            "descriptionForShop_vi" : "Phù thủy bí ngô",
            "descriptionForShop_cn" : "南瓜巫女",
            "interestRate" : 0,
            "price" : 1000,
            "category" : "CHARACTER",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "T01",
            "name_ko" : "일반 나무",
            "name_en" : "Normal Tree",
            "name_vi" : "Cây thường",
            "name_cn" : "",
            "descriptionForDetail_ko" : "가장 일반적인 나무<br/>연 이율 약 6.0%의 고정이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A normal tree.<br/>They have a fixed interest rate of 0.6% per year.<br/>You will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây bình thường nhất có lãi xuất cố định năm khoảng 6.0%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "A normal tree.<br/>They have a fixed interest rate of 0.6% per year.<br/>You will receive interest once a day.",
            "descriptionForInventory_ko" : "연 이율 약 6.0%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다",
            "descriptionForInventory_en" : "They have a fixed interest rate of 6.0% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 6.0%.<br/> Bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "A normal tree.<br/>They have a fixed interest rate of 0.6% per year.<br/>You will receive interest once a day.",
            "descriptionForShop_ko" : "가장 일반적인 나무 연 이율 약 6.0%의 고정이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A normal tree,<br/>it has a fixed interest rate of 6.0% per year.<br/>You will receive interest once a day.",
            "descriptionForShop_vi" : "Cây bình thường nhất có lãi xuất cố định năm khoảng 6.0%. Nhận lợi nhuận mỗi ngày",
            "descriptionForShop_cn" : "A normal tree.<br/>They have a fixed interest rate of 0.6% per year.<br/>You will receive interest once a day.",
            "defaultProfit" : 0.01643835616,
            "defaultNutritionalPeriod":(30*6),
            "price" : 100,
            "category" : "TREE",
            "status":"HIDDEN"
        },
        {
            "itemId" : "T02",
            "name_ko" : "화이트 나무",
            "name_en" : "White Tree",
            "name_vi" : "Cây trắng",
            "name_cn" : "白色树木",
            "descriptionForDetail_ko" : "눈이 덮여 있는 나무<br/>연 이율 약 7.2%의 고정이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A tree covered in snow.<br/>They have a fixed interest rate of 7.2% per year.<br/>You will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây có tuyết phủ, có lãi xuất cố định năm khoảng 7.2%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "覆盖了雪的树木 在初次购买的Land价格基础上，年固定利率约为7.2%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 7.2%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다",
            "descriptionForInventory_en" : "They have a fixed interest rate of 7.2% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 7.2%.<br/>Bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 7.2% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "눈이 덮여 있는 나무 연 이율 약 7.2%의 고정이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A tree covered in snow,<br/>it has a fixed interest rate of 7.2% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây có tuyết phủ, có lãi xuất cố định năm khoảng 7.2%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "覆盖了雪的树木 在初次购买的Land价格基础上，年固定利率约为7.2%，每天结清一次利息。",
            "defaultProfit" : 0.01972602739,
            "defaultNutritionalPeriod":(30*6),
            "price" : 180,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T03",
            "name_ko" : "그린 나무",
            "name_en" : "Green tree",
            "name_vi" : "Cây xanh lá",
            "name_cn" : "绿色树木",
            "descriptionForDetail_ko" : "초록 잎사귀를 가진 나무<br/>연 이율 약 7.8%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A green tree.<br/>They have a fixed interest rate of 7.8% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây có lá màu xanh lá, có lãi xuất cố định năm khoảng 7.8%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "长有绿色树叶的树木 在初次购买的Land价格基础上，年固定利率约为7.8%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 7.8%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 7.8% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 7.8%. <br/> Bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 7.8% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "초록 잎사귀를 가진 나무 연 이율 약 7.8%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A green tree,<br/>it has a fixed interest rate of 7.8% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây có lá màu xanh lá, có lãi xuất cố định năm khoảng 7.8%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "长有绿色树叶的树木 在初次购买的Land价格基础上，年固定利率约为7.8%，每天结清一次利息。",
            "defaultProfit" : 0.02136986301,
            "defaultNutritionalPeriod":(30*6),
            "price" : 260,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T04",
            "name_ko" : "블루 나무",
            "name_en" : "Blue tree",
            "name_vi" : "Cây xanh dương",
            "name_cn" : "蓝色树木",
            "descriptionForDetail_ko" : "파란색 잎사귀를 가진 나무<br/>연 이율 약 8.4%의 고정 이율을 가지고 있다.<br/>하루마다 이자를  받는다.",
            "descriptionForDetail_en" : "A blue tree.<br/>They have a fixed interest rate of 8.4% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây có lá màu xanh dương, có lãi xuất cố định năm khoảng 8.4%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "长有蓝色树叶的树木 在初次购买的Land价格基础上，年固定利率约为8.4%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 8.4%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 8.4% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 8.4% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 8.4% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "파란색 잎사귀를 가진 나무 연 이율 약 8.4%의 고정 이율을 가지고 있다.<br/>하루마다 이자를  받는다.",
            "descriptionForShop_en" : "A blue tree,<br/>it has a fixed interest rate of 8.4% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây có lá màu xanh dương, có lãi xuất cố định năm khoảng 8.4%. Nhận lợi nhuận mỗi ngày",
            "descriptionForShop_cn" : "长有蓝色树叶的树木 在初次购买的Land价格基础上，年固定利率约为8.4%，每天结清一次利息。",
            "defaultProfit" : 0.02301369863,
            "defaultNutritionalPeriod":(30*6),
            "price" : 350,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T05",
            "name_ko" : "브론즈 나무",
            "name_en" : "Bronze tree",
            "name_vi" : "Cây đồng",
            "name_cn" : "青铜树木",
            "descriptionForDetail_ko" : "건강한 나무<br/>연 이율 약 9.6%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A tree covered in bronze.<br/>They have a fixed interest rate of 9.6% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây khỏe mạnh, có lãi xuất cố định năm khoảng 9.6%. <br/>Nhận lợi nhuận mỗi ngày. ",
            "descriptionForDetail_cn" : "健康的树木 在初次购买的Land价格基础上，年固定利率约为9.6%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 9.6%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 9.6% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 9.6% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 9.6% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "건강한 나무 연 이율 약 9.6%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A tree covered in bronze,<br/>it has a fixed rate of 9.6% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây khỏe mạnh, có lãi xuất cố định năm khoảng 9.6%. Nhận lợi nhuận mỗi ngày",
            "descriptionForShop_cn" : "健康的树木 在初次购买的Land价格基础上，年固定利率约为9.6%，每天结清一次利息。",
            "defaultProfit" : 0.02630136986,
            "defaultNutritionalPeriod":(30*6),
            "price" : 480,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T06",
            "name_ko" : "실버 나무",
            "name_en" : "Silver tree",
            "name_vi" : "Cây bạc",
            "name_cn" : "银色树木",
            "descriptionForDetail_ko" : "은색 잎사귀를 가진 나무<br/>연 이율 약 11.4%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A tree covered in silver.<br/>They have a fixed interest rate of 11.4% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây có lá màu bạc, có lãi xuất cố định năm khoảng 11.4%. <br/>Nhận lợi nhuận mỗi ngày. ",
            "descriptionForDetail_cn" : "长有银色树叶的树木 在初次购买的Land价格基础上，年固定利率约为11.4%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 11.4%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 11.4% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 11.4% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 11.4% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "은색 잎사귀를 가진 나무 연 이율 약 11.4%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A tree covered in silver,<br/>it has a fixed interest rate of 11.4% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây có lá màu bạc, có lãi xuất cố định năm khoảng 11.4%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "长有银色树叶的树木 在初次购买的Land价格基础上，年固定利率约为11.4%，每天结清一次利息。",
            "defaultProfit" : 0.03123287671,
            "defaultNutritionalPeriod":(30*6),
            "price" : 760,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T07",
            "name_ko" : "골드 나무",
            "name_en" : "Gold tree",
            "name_vi" : "Cây vàng",
            "name_cn" : "金色树木",
            "descriptionForDetail_ko" : "금색 잎사귀를 가진 나무<br/>연 이율 약 13.2%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A tree covered in gold.<br/>They have a fixed interest rate of 13.2% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây có lá vàng, có lãi xuất cố định năm khoảng 13.2%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "长有金色树叶的树木 在初次购买的Land价格基础上，年固定利率约为13.2%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 13.2%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 13.2% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 13.2% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 13.2% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "금색 잎사귀를 가진 나무 연 이율 약 13.2%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A tree covered in gold,<br/>it has a fixed interest rate of 13.2% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây có lá vàng, có lãi xuất cố định năm khoảng 13.2%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "长有金色树叶的树木 在初次购买的Land价格基础上，年固定利率约为13.2%，每天结清一次利息。",
            "defaultProfit" : 0.03616438356,
            "defaultNutritionalPeriod":(30*6),
            "price" : 1500,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T08",
            "name_ko" : "플래티넘 나무",
            "name_en" : "Platinum tree",
            "name_vi" : "Cây bạch kim",
            "name_cn" : "铂金树木",
            "descriptionForDetail_ko" : "가장 좋은 나무<br/>연 이율 약 15%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A tree covered in platinum.<br/>They have a fixed interest rate of 15% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây tốt nhất, có lãi xuất cố định năm khoảng 15%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "可以在商店中购买到的最好的树木 在初次购买的Land价格基础上，年固定利率约为15%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 15%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 15% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 15% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 15% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "가장 좋은 나무 연 이율 약 15%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A tree covered in platinum,<br/>it has a fixed interest rate of 15% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây tốt nhất, có lãi xuất cố định năm khoảng 15%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "可以在商店中购买到的最好的树木 在初次购买的Land价格基础上，年固定利率约为15%，每天结清一次利息。",
            "defaultProfit" : 0.04109589041,
            "defaultNutritionalPeriod":(30*6),
            "price" : 3000,
            "category" : "TREE",
            "status":"CANBUY"
        },
        {
            "itemId" : "T09",
            "name_ko" : "다이아몬드 나무",
            "name_en" : "Diamond tree",
            "name_vi" : "Cây kim cương",
            "name_cn" : "钻石树木",
            "descriptionForDetail_ko" : "랜덤박스에서만 받을<br/>수 있는 희귀한 나무<br/>연 이율 약 45%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForDetail_en" : "A rare tree. Only can obtain from the<br/>Legendary Random Box.<br/>They have a fixed interest rate of 45% per year.<br/>Will receive interest once a day.",
            "descriptionForDetail_vi" : "Cây quý hiếm chỉ có thể nhận được từ hộp ngẫu nhiêm,<br/> có lãi xuất cố định năm khoảng 45%. <br/>Nhận lợi nhuận mỗi ngày.",
            "descriptionForDetail_cn" : "只能在随机盒子中可以获得的稀有的树木 在初次购买的Land价格基础上，年固定利率约为45%，每天结清一次利息。",
            "descriptionForInventory_ko" : "연 이율 약 45%를 가지고 있으며<br/>마우스 드래그로 나의 랜드위에 <br/>사용할 수 있다.",
            "descriptionForInventory_en" : "They have a fixed interest rate of 45% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForInventory_vi" : "Một năm lãi xuất 45% <br/>bạn có thể sử dụng trên đất của mình<br/> bằng cách kéo thả chuột.",
            "descriptionForInventory_cn" : "They have a fixed interest rate of 45% per year.<br/>You can use it on my land<br/>by dragging it with your mouse.",
            "descriptionForShop_ko" : "랜덤박스에서만 받을 수 있는 희귀한 나무<br/>연 이율 약 45%의 고정 이율을 가지고 있다.<br/>하루마다 이자를 받는다.",
            "descriptionForShop_en" : "A rare tree. Only can obtain from the<br/>Legendary Random Box.<br/>They have a fixed interest rate of 45% per year.<br/>Will receive interest once a day.",
            "descriptionForShop_vi" : "Cây quý hiếm chỉ có thể nhận được từ hộp ngẫu nhiêm, có lãi xuất cố định năm khoảng 45%. Nhận lợi nhuận mỗi ngày.",
            "descriptionForShop_cn" : "只能在随机盒子中可以获得的稀有的树木 在初次购买的Land价格基础上，年固定利率约为45%，每天结清一次利息。",
            "defaultProfit" : 0.12328767123,
            "defaultNutritionalPeriod":(30*6),
            "price" : 0,
            "category" : "TREE",
            "status":"HIDDEN"
        },
        {
            "itemId" : "T10", 
            "name_ko" : "Bitamin Tree", 
            "defaultProfit" : 0.0, 
            "category" : "TREE", 
            "status" : "LIMIT", 
            "price" : 99, 
            "buyLimitAmount" : 1000
        },
        {
            "itemId" : "I01",
            "name_ko" : "무럭무럭 영양제",
            "name_en" : "Nutrient",
            "name_vi" : "Thuốc dinh dưỡng",
            "name_cn" : "旺盛生长营养剂",
            "descriptionForDetail_ko" : "나무의 월 이율을 180일동안 약 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.",
            "descriptionForDetail_en" : "The nutrient enhances<br/>trees yearly interest rate<br/>up to 0.005% for 180 days.<br/>The usage count is limited.",
            "descriptionForDetail_vi" : "Làm tăng lãi xuất tháng của cây trong 180 ngày thêm khoảng 0.005%.<br>Không thể cho nhiều thuốc dinh dưỡng vào cây.",
            "descriptionForDetail_cn" : "树木的月利率大约以0.005%幅度增长180天。仅限用于我的树木，最多可使用0.01%。",
            "descriptionForInventory_ko" : "나무의 월 이율이 약 0.005%가 <br>180일 동안 늘어나게 된다<br>나의 나무에만 사용 할 수 있으며<br>최대 0.01%까지 적용 된다.",
            "descriptionForInventory_en" : "The nutrient enhances<br/>trees yearly interest rate<br/>up to 0.0005% for 180 days.<br/>It can only be used to my tree,<br/>and it will be limited when<br/>it reaches the rate of 0.01%.",
            "descriptionForInventory_vi" : "Làm tăng lãi xuất tháng của cây <br>trong 180 ngày thêm khoảng 0.005%<br> và có thể áp dụng tối đa 0.01%",
            "descriptionForInventory_cn" : "树木的月利率大约以0.005%幅度增长180天。仅限用于我的树木，最多可使用0.01%。",
            "descriptionForShop_ko" : "나무의 월 이율을 180일동안 약 0.005%를 올려준다.<br>나무에 영양제를 많이 줄 수 없다.",
            "descriptionForShop_en" : "The nutrient enhances<br/>trees yearly interest rate<br/>up to 0.005% for 180 days.<br/>The usage count is limited.",
            "descriptionForShop_vi" : "Làm tăng lãi xuất tháng của cây trong 180 ngày thêm khoảng 0.005%.Không thể cho nhiều thuốc dinh dưỡng vào cây.",
            "descriptionForShop_cn" : "树木的月利率大约以0.005%幅度增长180天。仅限用于我的树木，最多可使用0.01%。",
            "defaultProfit" : 0,
            "price" : 10,
            "category" : "ITEM",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "I02",
            "name_ko" : "없애버려 삽",
            "name_en" : "Shovel",
            "name_vi" : "Xẻng bứng cây",
            "name_cn" : "砍树铁铲",
            "descriptionForDetail_ko" : "랜드에 심어져 있는 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.",
            "descriptionForDetail_en" : "It removes a tree planted on the land.<br/>Removed tree's purchase price will not be returned.",
            "descriptionForDetail_vi" : "Có thể bứng bỏ cây đang được trồng trên đất.<br> Không được hoàn lại việc mua khi cây bị bứng bỏ",
            "descriptionForDetail_cn" : "It removes a tree planted on the land.<br/>Removed tree's purchase price will not be returned.",
            "descriptionForInventory_ko" : "나의 랜드에 심어져 있는 나무를 <br>제거 할 때 사용하는 삽.",
            "descriptionForInventory_en" : "A shovel used to remove<br/>a tree that is planted in my land.",
            "descriptionForInventory_vi" : "Xẻng sử dụng khi bứng bỏ cây<br> đang trồng trên đất",
            "descriptionForInventory_cn" : "在砍伐我的Land上种植的树木时使用的铁铲",
            "descriptionForShop_ko" : "랜드에 심어져 있는 나무를 제거 할 수 있다.<br>제거된 나무의 구입가는 반환되지 않는다.",
            "descriptionForShop_en" : "It removes a tree planted on the land.<br/>Removed tree's purchase price will not be returned.",
            "descriptionForShop_vi" : "Có thể bứng bỏ cây đang được trồng trên đất. Không được hoàn lại việc mua khi cây bị bứng bỏ",
            "descriptionForShop_cn" : "It removes a tree planted on the land.<br/>Removed tree's purchase price will not be returned.",
            "defaultProfit" : 0,
            "price" : 50,
            "category" : "ITEM",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "I03",
            "name_ko" : "탱글탱글 물방울",
            "name_en" : "Droplet",
            "name_vi" : "Nước tưới cây",
            "name_cn" : "滋润水滴",
            "descriptionForDetail_ko" : "나무가 한달동안 살 수 있게 해주는 신비한 물방울.<br>나무에 물을 주지않으면 나무가 말라죽는다.",
            "descriptionForDetail_en" : "A mysterious water drop, which makes<br/>the tree alive for a month.<br/>The tree dries up and dies<br/>if it is not provided with water drop.",
            "descriptionForDetail_vi" : "Giọt nước thần kỳ giúp cây có thể sống trong suốt 1 tháng.<br>Nếu không tưới nước cho cây, cây sẽ chết khô.",
            "descriptionForDetail_cn" : "A mysterious water drop, which makes<br/>the tree alive for a month.<br/>The tree dries up and dies<br/>if it is not provided with water drop.",
            "descriptionForInventory_ko" : "나의랜드에 심어져 있는 나무에 <br>사용 할 수 있다. <br>나무에 물을 주지않으면 나무가 <br>말라 죽게 된다.",
            "descriptionForInventory_en" : "It is used on a tree that is planted on my land.<br/>The tree dries up and dies<br/>if it is not provided with water drop.",
            "descriptionForInventory_vi" : "Có thể sử dụng cho cây đang trồng trên đất.<br> Nếu không tưới nước cây sẽ chết khô.",
            "descriptionForInventory_cn" : "可以为我的Land上种的树木使用。 不给树浇水，树就会干死。",
            "descriptionForShop_ko" : "나무가 한달동안 살 수 있게 해주는 신비한 물방울.<br>나무에 물을 주지않으면 나무가 말라죽는다.",
            "descriptionForShop_en" : "A mysterious water drop, which makes<br/>the tree alive for a month.<br/>The tree dries up and dies<br/>if it is not provided with water drop.",
            "descriptionForShop_vi" : "Giọt nước thần kỳ giúp cây có thể sống trong suốt 1 tháng. Nếu không tưới nước cho cây, cây sẽ chết khô.",
            "descriptionForShop_cn" : "A mysterious water drop, which makes<br/>the tree alive for a month.<br/>The tree dries up and dies<br/>if it is not provided with water drop.",
            "defaultProfit" : 0,
            "price" : 0,
            "category" : "ITEM",
            "status":"CANNOTBUY"
        },
        {
            "itemId" : "I04",
            "name_ko" : "비타민 전용 삽",
            "defaultProfit" : 0,
            "price" : 0,
            "category" : "ITEM",
            "status":"CANNOTBUY"
        }
    ];

    return db.Item.insertMany(data);
}







async function getAllTreeTemplate() {
    return db.Item.find({ 'category': 'TREE' });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async function () {
    await db.User.deleteMany({});
    await db.Object.deleteMany({});
    await db.Item.deleteMany({});
    const isTemplateNoExist = await db.Item.find();
    if(isTemplateNoExist.length <= 0){
        await createItem();
    }
    for (let i = 1; i < 20000; i++) {
        const _user = new db.User();
        _user.userName = i.toString() + '--------------' + i.toString();
        _user.nid = i.toString()
        _user.firstName = i.toString() + '--------------' + i.toString();
        _user.lastName = i.toString() + '--------------' + i.toString();
        _user.hash = i.toString() + '--------------' + i.toString();
        const savedUser = await _user.save();
        if (!isNull(savedUser)) {
            const treesTemplate = await getAllTreeTemplate();

            let treesLength = getRandomInt(0, 100);
            //let treesLength = 1;
            var currentDate = new Date();
            var days = 30;
            var after1MonthDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            for (let j = 0; j < treesLength; j++) {

                let treeOrder = treesTemplate[getRandomInt(0, treesTemplate.length - 1)];

                const treeObj = new db.Object();
                treeObj.category = 'TREE';
                treeObj.userId = savedUser._id;
                treeObj.nid = parseInt(savedUser.nid);
                treeObj.quadKey = i.toString() + '----------------' + j.toString();
                treeObj.quadKeyParent1 = i.toString() + '---------------' + j.toString();
                treeObj.quadKeyParent2 = i.toString() + '--------------' + j.toString();
                treeObj.item = treeOrder._id;
                treeObj.itemId = treeOrder.itemId;
                treeObj.waterStartTime = currentDate;
                treeObj.waterEndTime = after1MonthDate;
                treeObj.landPrice = getRandomInt(1, 10) * 4000;
                treeObj.profit = treeOrder.defaultProfit;
                treeObj.profitTotal = treeOrder.defaultProfit;
                treeObj.plantedDate = currentDate;
                treeObj.plantedTree = true;
                treeObj.deletedTree = false;

                let resultTreeObj = await treeObj.save();
                if(!isNull(resultTreeObj)){
                    //console.log("ok ok ok create tree");
                }

            }
            console.log("create user " + i.toString() + " successs" );
        }
    }

})();