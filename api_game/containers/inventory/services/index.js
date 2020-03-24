const db = require('../../../db/db');
const config = require('../../../db/config');

const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const Inventory = db.Inventory;
const Objects = db.Object;
const Land23 = db.Land23;
const Item = db.Item;
const PARENT_1_RANGE = 4; //lv19
const PARENT_2_RANGE = 5; //lv18
const logger = require('./../../../helpers/logger');
const trades = require('./../../trades');
const _ = require('lodash');
const { QuadKeyToTileXY } = require('../../../helpers/custom/quadKeyConvert');
// const chain = require('lodash.')
//exist buyer,seller,quadKey in landpendinghistory and exist in buyFailureLandLog
const { createItemPending, getItemPending, deleteItemPending } = require('../../item/services/itemPending');
const { createMergeHistory, updateMergeHistory } = require('../../logs/services/mergeHistory');

module.exports = {
    combineTrees,
    getCharacterInventoryByUserId,
    getItemInventoryByUserId,
    addItemToInventory,
    moveTreeToMap,
    useItem,
    checkAnyDeadTrees,
    checkParamBeforeUseItem,
    getAllTreesByUserId,
};

const MIN_TOTAL_TREE_PRICE = 4000;

function mergeUserItems(userItems){
    var mergeItemsFunction = {
        validPay : MIN_TOTAL_TREE_PRICE,
        
        defaultItems : [
            {"itemId": "T07", "pay" : 1500},
            {"itemId": "T06", "pay" : 760},
            {"itemId": "T05", "pay" : 480},
            {"itemId": "T04", "pay" : 350},
            {"itemId": "T03", "pay" : 260},
            {"itemId": "T02", "pay" : 180},
            {"itemId": "T01", "pay" : 100}
        ],
        // •50% 확률로 병합 시, 병합시킨 카드 중 가장 높은 나무
        // •45% 확률 가장 낮은 나무
        // •5% 확률 나무 값의 80%를 블러드 또는 비타민 나무 보상
        // •4.99 확률로 플래티넘 나무
        // •0.01 확률 다이아 나무
        reward : [
            {"name" : "R1","percentage" :  30},
            {"name" : "R2","percentage" : 65},
           // {"name" : "blood","percentage" : 5},
            {"name" : "R3","percentage" : 4.99},
            {"name" : "R4","percentage" : 0.01}
        ],
        sumBykeyValue : function(array){
            var result  = 0;
            try {
                for (var i = 0; i < array.length; i++) {
                    for (var j = 0; j < this.defaultItems.length; j++) {
                        if(array[i].itemId == this.defaultItems[j].itemId){
                             result += (this.defaultItems[j].pay * array[i].cnt);
                        }
                    }
                }
            }
            catch (e) {
               console.log(e);
            }    
            
            return result;
        },
        getLvTopItem : function(cnt,array){
            var sortItem = this.sortByKey(array,'itemId' , 'desc');
            var limitCnt = 0;
            var resultTopItems = [];
            try {
                for (var i = 0; i < sortItem.length; i++) {
                
                    for (var j = 0; j < sortItem[i].cnt; j++) {
                        if(limitCnt < cnt){
                            limitCnt += 1;
                            var resultTopItem = {itemId : sortItem[i].itemId};
                            resultTopItems.push(resultTopItem);
                        }
                    }
                    if(limitCnt == cnt){
                         break;
                    }
                }
            }
            catch (e) {
               console.log(e);
            }    
            return resultTopItems;
        },
        getRewardItem : function(cnt){
            let arrItem = [];
            for (let i = 0; i < cnt; i++) {
                let item = this.cloneObject(this.findItem(this.reward, this.random(0, 100)));
                arrItem.push(item);
            }
            return arrItem;
        },
        setResultRewardItems : function(rewardItems,lvTopItems){
            
            var tree = {w: "T02",p: "T08",d: "T09"};
            var r1Cnt = 0;
            for(var i = 0; i < rewardItems.length; i++){
               switch(rewardItems[i].name) {
                  case 'R4':  // •R4 확률 다이아 나무
                    rewardItems[i].itemId = tree.d;
                    break;
                  case 'R3': // •R3 확률로 플래티넘 나무
                    rewardItems[i].itemId = tree.p;
                    break;
                  case 'R2': // •R2 확률 가장 낮은 나무
                     rewardItems[i].itemId = tree.w;
                    break;
                  default: // •R1 병합시킨 카드 중 가장 높은 나무
                    var code = lvTopItems[r1Cnt].itemId.replace("T0","");
                    code = "T0"+ (Number(code)+1);
                    rewardItems[i].itemId = code;
                    r1Cnt++;
                }
                //rewardItems[i].point = i;
               // console.log("::         ",rewardItems[i], lvTopItems[i])
            }
           
            return rewardItems;
        },
        

        cloneObject : function(obj) {
            var nobj = {};
            for (var k in obj) nobj[k] = obj[k];
            return nobj;
        },
        findItem : function(arrBox, ranNumber){
            let iStart = 0;
            for(let box of arrBox){
                iStart += box.percentage;
                if(iStart > ranNumber) {
                    return box;
                }
            }
            return arrBox[0];
        },
        random : function(min, max){
            return Math.floor(Math.random()*(max-min+1)+min);
        },
        sortByKey : function(array, key , sort) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return sort == 'asc' ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        },
        value : function(items) { 
            //1.   해당유저에게 아이템이 존재한다면 신청한 아이템의 금액이 validPay 보다 높거나 같은지 확인한다.
            var totalPay = this.sumBykeyValue(items);
            //2. sumBykeyValue / 2000 을하여 나온갯수만큼 보상을 해준다. 
            var mergeItemCnt = Math.floor((totalPay / this.validPay));
            //3. 나온갯수만큼 가장높은 나무를 추출한다. 보상확률적용
            var lvTopItems = this.getLvTopItem(mergeItemCnt,items);
            //4. 보상을 추출한다.
            var rewardItems = this.getRewardItem(mergeItemCnt);
            //5. 보상아이템을 생성한다.
            var resultItems = this.setResultRewardItems(rewardItems,lvTopItems);
            
            return resultItems;
        }
    }

    // var userItems = [
    //     {"itemId": "T07", "cnt" : 2},
    //     {"itemId": "T06", "cnt": 71},
    //     {"itemId": "T05", "cnt": 134},
    //     {"itemId": "T04", "cnt": 169},
    //     {"itemId": "T03", "cnt" : 7 },
    //     {"itemId": "T02", "cnt" :1},
    //     {"itemId": "T01", "cnt":1}
    // ]
    var mergeItems = mergeItemsFunction.value(userItems);
    //console.log('mergeItems',mergeItems);
    return mergeItems;
}

async function checkQuantityItems({ userId, nid, items }){
    try {
        let totalBlood = 0;
        for(let item of items){
            const promiseInventory = db.Inventory.findOne({ userId: ObjectId(userId), itemId: item.itemId, quantity: { $gte: item.quantity } }).populate('item');
            const promiseItemPending = getItemPending({ itemId: item.itemId, nid, item: 'USING_ITEM' });
            const [itemInventory, itemPending] = await Promise.all([promiseInventory, promiseItemPending]);
            //console.log('[itemInventory, itemPending]', [itemInventory, itemPending]);

            const itemPendingQuantity = itemPending && itemPending.quantity ? itemPending.quantity : 0;
            //lấy tổng - số item đang pending > số item dùng để kết hợp
            if(!itemInventory){
                return { status: false, errorMessage: "notEnoughQuantity" };
                break;
            }
            if(itemInventory.quantity - itemPendingQuantity < item.quantity){
                //console.log('FALSE => itemPending && itemInventory.quantity - itemPending.quantity >= item.quantity');
                return { status: false, errorMessage: "notFoundItem" };
                break;
            }
            //console.log('itemInventory', itemInventory);
            totalBlood += itemInventory.item.price*item.quantity;
        }
        //console.log('TRUE');
        if(totalBlood < MIN_TOTAL_TREE_PRICE) return { status: false, errorMessage: "notEnoughBlood" };
        //console.log('totalBlood',totalBlood);
        return { status: true };
    } catch(e){
        console.log('Error: ', e);
        return { status: false, errorMessage: e };
    }
}

async function combineTrees({ userId, items }) {
    //console.log("nquan", { userId, items });

    const user = await db.User.findById(userId).lean();
    const nid = Number(user.nid);

    //create history
    let mergeHistory = await createMergeHistory({ nid, items });


    let updatedInventory = await Inventory.find({ 'userId': ObjectId(userId), 'category': 'TREE' }).lean();
    //console.log('items');
    //kiểm tra pending, kiểm tra item của user, kiểm tra tổng giá của tất cả item có > 2000 ko?,
    const isEnoughQuantity = await checkQuantityItems({ userId, nid, items });
    if(!isEnoughQuantity.status){
        console.log('isEnoughQuantity = false', isEnoughQuantity.errorMessage);
        return { status: false, mergeItems: [], updatedInventory, errorMessage: isEnoughQuantity.errorMessage };
    }

    try {
        //khi có đầy đủ nguyên liệu => tạo pending
        //console.log('items', items);
        await Promise.all(items.map(item => createItemPending({ nid, itemId: item.itemId, type: 'USING_ITEM', quantity: item.quantity })));

        //create new tree - Mr. Lee
        const userItems = items.map(item => ({ itemId: item.itemId, cnt: item.quantity }));
        
        const mergeItems = mergeUserItems(userItems);
        //console.log('mergeItems', mergeItems);
        //group Item
        const grpMergeItems = Object.values(_.groupBy(mergeItems, 'itemId')).map(grpItem => ({ itemId: grpItem[0].itemId, quantity: grpItem.length }));
        //console.log('grpMergeItems', grpMergeItems);

    
        //remove quantity from inventory
        const updateItemQuantity = await Promise.all(items.map(item => db.Inventory.findOneAndUpdate({userId: ObjectId(userId), itemId: item.itemId}, {$inc: {quantity: -item.quantity}},{new: true})));
        const deleteItemQuantity = await Promise.all(items.map(item => db.Inventory.findOneAndDelete({userId: ObjectId(userId), itemId: item.itemId, quantity: 0})));
        //console.log('updateItemQuantity', updateItemQuantity);
        //console.log('deleteItemQuantity', deleteItemQuantity);

        let addMergeItems = await Promise.all(grpMergeItems.map(item => addItemToInventory({ itemId: item.itemId, quantity: item.quantity, userId, getFromCode: "M01" })));
        //console.log('==============addMergeItems', addMergeItems);

        //cập nhật history 
        await updateMergeHistory({ _id: mergeHistory._id, nid, mergeItems: grpMergeItems });

        //xóa khỏi pending
        //console.log('items', items);
        await Promise.all(items.map(item => deleteItemPending({ nid, itemId: item.itemId, type: 'USING_ITEM', quantity: item.quantity })));

        //console.log('');
        updatedInventory = await Inventory.find({ 'userId': ObjectId(userId), 'category': 'TREE' }).lean();
        //console.log({ status: true, mergeItems: grpMergeItems, updatedInventory });
        return { status: true, mergeItems: grpMergeItems, updatedInventory };

    } catch(e) {
        console.log('Error: ', e);
        return { status: false, mergeItems: [], updatedInventory, errorMessage: e };
    }
}



async function getTreesByTreesId({ trees, userId }) {
    try {
        return await db.Object.find({ '_id': { $in: trees }, 'category': 'TREE', 'userId': ObjectId(userId) });
    } catch (err) {
        return [];
    }
}

async function getAllTreesByUserId({ userId }) {
    try {
        const treeTemplate = await db.Item.find({ 'category': 'TREE' }).lean();
        const treeOfUser = await db.Inventory.find({ 'category': 'TREE', 'userId': ObjectId(userId) }).lean();
        let mappedTrees = treeTemplate.map(tree => {
            let isTreeExist = treeOfUser.find(t => t.itemId === tree.itemId);
            return {
                tree: tree,
                maxAmount: isTreeExist ? isTreeExist.quantity : 0,
                usingAmount: 0,
                remainAmount: 0
            }
        })
        return mappedTrees;
    } catch (err) {
        return []
    }
}

var SHOP_ITEMS = ['I01', 'I02'];
async function checkParamBeforeUseItem({ itemId, trees, userId }) {
    try {
        // console.log("==================================================");
        // const user = await db.User.findById(userId).lean();
        // console.log("uuu",user);
        // const wallet = await trades.getBalance(user);
        // console.log("wallet",wallet);
        // const goldBlood = parseInt(wallet.balance);
        // console.log("goldBlood", goldBlood);



        if (SHOP_ITEMS.indexOf(itemId) == -1) {
            console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
            return { status: false, error: "error item" };
        }

        //create price
        var price = 0;

        //check user
        const user = await db.User.findById(userId).lean();
        if (isNull(user)) { // nếu item template lỗi , ko tìm thấy item -> fail
            return { status: false, result: [], msg: 'user no exist' }
        }

        //check itemObj
        const itemObj = await db.Item.findOne({ itemId: itemId });
        if (isNull(itemObj)) { // nếu item template lỗi , ko tìm thấy item -> fail
            return { status: false, result: [], msg: 'item template no exist' }
        }

        //check any dead tree
        const result = await checkAnyDeadTrees({ itemId, trees, userId })
        if (result.deadTrees.length > 0) { // nếu có ít nhất 1 cây bị chết -> fail
            return { status: !result.status, result: [], msg: 'some tree dies' }
        }

        // check trees of this user
        const findTrees = await getTreesByTreesId({ trees, userId });
        if (findTrees.length !== trees.length) {
            return { status: false, result: [], msg: 'trees that request no equal to exist trees' }
        }

        const itemInInventory = await db.Inventory.findOne({ itemId: itemId, userId: ObjectId(userId) });
        if (isNull(itemInInventory)) {
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // // // // // // quantity in inventory == 0
            console.log('process.env.NODE_ENV=', process.env.NODE_ENV);
            if (process.env.NODE_ENV === 'development') {
                //console.log('development', process.env.NODE_ENV === 'development');
                const goldBlood = user.goldBlood;
                console.log('pass goldBlood', goldBlood);
                if (goldBlood <= 0 || goldBlood - price < 0) {
                    return { status: false, result: [], msg: 'No more money' }
                }
                return { status: true, result: price };
            }
            else {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                try {
                    const wallet = await trades.getBalance(user);
                    const goldBlood = parseInt(wallet.balance);
                    price = trees.length * itemObj.price;
                    console.log('pass price', price);
                    if (goldBlood <= 0 || goldBlood - price < 0) {
                        return { status: false, result: [], msg: 'No more money' }
                    }
                    return { status: true, result: price };
                } catch (err) {
                    return { status: false, result: [], msg: 'Error when pay item' }
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } else {
            var itemInInventoryAfterUse = itemInInventory.quantity - trees.length;
            if (itemInInventoryAfterUse >= 0) {
                //just use item in inventory, dont need pay any gold
                price = 0;
                return { status: true, result: price }
            }
            else {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (process.env.NODE_ENV === 'development') {
                    //console.log('process.env.NODE_ENV testtt',process.env.NODE_ENV );
                    const goldBlood = parseInt(user.goldBlood);
                    price = trees.length * itemObj.price;
                    if (goldBlood <= 0 || goldBlood - price < 0) {
                        return { status: false, result: [], msg: 'No more money' }
                    }
                    return { status: true, result: price };
                }
                else {
                    //current quantity of item in inventory = 0
                    //pay more gold for use
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    try {
                        const wallet = await trades.getBalance(user);
                        const goldBlood = parseInt(wallet.balance);
                        price = trees.length * itemObj.price;
                        if (goldBlood <= 0 || goldBlood - price < 0) {
                            return { status: false, result: [], msg: 'No more money' }
                        }
                        return { status: true, result: price };
                    } catch (err) {
                        return { status: false, result: [], msg: 'Error when pay item' }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

    } catch (err) {
        return { status: false, result: [], msg: 'Error when pay item' }
    }
}

function createDeleteTreeHistory(_id, userId) {
    db.Object
        .findOne({ '_id': ObjectId(_id), 'userId': ObjectId(userId) })
        .select('userId quadKey item itemId category')
        .lean()
        .then(treeObj => {
            const { userId, quadKey, item, itemId, category } = treeObj;
            const deleteTreeHistory = new db.ObjectHistory({
                userId,
                quadKey,
                item,
                itemId,
                category,
                deletedDate: new Date()
            });
            deleteTreeHistory
                .save(savedTree => { return savedTree })
                .catch(err => { return null })
        })
        .catch(err => {
            return null
        })


}

async function getCharacterInventoryByUserId({ userId }) {
    try {
        var items = await Inventory
            .find({ userId: ObjectId(userId), category: { $in: ['TREE', 'CHARACTER'] } })
            .populate('item', '-defaultProfit -price -_id -status -category')
            .lean();

        items = items.map(i => {
            i = { ...i, ...i.item };
            delete i.item;
            return i
        });
        return items
    } catch (e) {
        return [];
    }
}

async function getItemInventoryByUserId({ userId }) {
    try {
        //add I04 for open Buy Item in Shop - Mr. Quân
        var itemsInInventory = await Inventory.find({ userId: ObjectId(userId), category: { $in: ['ITEM'] }, itemId: { $in: ['I01', 'I02', 'I04'] } }).lean();
        var items = await Item.find({ category: { $in: ['ITEM'] } }).lean();
        //map lại 1 array và check xem item đó trong inventory chưa ?
        items = items.map(eachItem => {
            var isExistInInventory = itemsInInventory.find(IinInv => IinInv.itemId === eachItem.itemId)
            if (isExistInInventory) {
                eachItem.quantity = isExistInInventory.quantity;
            } else {
                eachItem.quantity = 0;
            }
            return eachItem;
        })
        return items;
    } catch (e) {
        return [];
    }
}

function treeObj(treeParam) {
    const { nid, userId, quadKey, quadKeyParent1, quadKeyParent2, item,
        itemId, category, defaultProfit, price, nutritionalPeriod,
        landPrice, historyPrice, bigTreeQuadKeys /*distributedPrice*/ } = treeParam;
    var currentDate = new Date();
    var days = 30;
    var after1MonthDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    // var after1MonthDate = new Date(Date.now() + 45 * 1000);
    const aTree = {
        nid: nid,
        userId: ObjectId(userId),
        quadKey: quadKey,
        quadKeyParent1: quadKeyParent1,
        quadKeyParent2: quadKeyParent2,

        item: item,
        itemId: itemId,
        category: category, // category of item, ex; 'TREE' | 'RANDOMBOX' | 'BUYDIRECT' | 'PRESENT' | 'EVENT'
        // getFromCode: getFromCode, // get from, ex; 'RANDOMBOX': 'R01' | 'R02' | 'R03' |..., 'PRESENT': 'P01' | 'P02' | 'P03' |..., 'EVENT': 'E01' | 'E02' | 'E03' |...
        waterPeriod: 2592000,
        waterStartTime: currentDate, // New
        waterEndTime: after1MonthDate, // New
        limitUseNutritional: 2, //limit use of nutritional: 0~4
        profit: defaultProfit, // profit
        periodPayProfit: 1, // New, default is 1 (= 1 day)
        price: price, //giá item hoặc character - không đổi khi bị mua lại
        createdDateWater: currentDate,
        plantedTree: true, // ngày trồng cây - New, true/false planted tree // --> CACHING
        deletedTree: false, // ngày xóa cây - New, true/false deleted tree // --> CACHING
        createdDate: currentDate, // ngày tạo
        plantedDate: currentDate, // ngày trồng cây
        landPrice: landPrice,
        historyPrice: historyPrice,
        bigTreeQuadKeys,
        // distributedPrice: distributedPrice,
        nutritionalPeriod: nutritionalPeriod,
        profitTotal: defaultProfit //tổng profit lần đầu khi trồng cây = profit mặc định
    };
    if(itemId === "T10"){
        aTree.waterStartTime = null;
        aTree.waterEndTime = null;

    }
    return aTree;
}

// const items = {
//     quadKey: "132110320120111102130202",
//     quadKeys: [
//         "132110320120111102130202",
//         "132110320120111102130203",
//         "132110320120111102130221",
//         "132110320120111102130220"
//     ]
// }

function checkSquareQuadKeys(baseQuadKey, quadKeys) {
    if (!quadKeys) return false;
    if (quadKeys.length != 4) return false;

    if (baseQuadKey != quadKeys[0]) return false;

    var base = QuadKeyToTileXY(baseQuadKey);
    var p1 = QuadKeyToTileXY(quadKeys[0]);
    var p2 = QuadKeyToTileXY(quadKeys[1]);
    var p3 = QuadKeyToTileXY(quadKeys[2]);
    var p4 = QuadKeyToTileXY(quadKeys[3]);

    if (base.level != 24) return false;
    if (p1.level != 24) return false;
    if (p2.level != 24) return false;
    if (p3.level != 24) return false;
    if (p4.level != 24) return false;

    p1 = {x: p1.x - base.x, y: p1.y - base.y};
    p2 = {x: p2.x - base.x, y: p2.y - base.y};
    p3 = {x: p3.x - base.x, y: p3.y - base.y};
    p4 = {x: p4.x - base.x, y: p4.y - base.y};

    if ((p1.x == 0 && p1.y == 0) == false) return false;
    if ((p2.x == 1 && p2.y == 0) == false) return false;
    if ((p3.x == 1 && p3.y == 1) == false) return false;
    if ((p4.x == 0 && p4.y == 1) == false) return false;

    return true;
}


async function moveTreeToMap({ userId, items }) {
    //console.log('moveTreeToMap', items);
    //ItemPending

    let preparingMovingItems = [];
    // prepare to move tree to land
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // check my quadkey has tree
        const userInfo = await db.User.findById(userId).lean();

        if (item.quadKeys) {
            var isSquareQuadKeys = checkSquareQuadKeys(item.quadKey, item.quadKeys);
            if (isSquareQuadKeys == false) {
                console.log("isSquareQuadKeys: false", item.quadKey, item.quadKeys);
                break;
            }
            console.log("isSquareQuadKeys: true", item.quadKey, item.quadKeys);
        }

        const isExistCharacterInLand = await Objects.findOne({ userId: ObjectId(userId), $or: [{quadKey: item.quadKey},{quadKey: {$in: item.quadKeys || []}}, {bigTreeQuadKeys: {$eq: item.quadKey}}] }).lean();
        console.log(isExistCharacterInLand);
        if (!isNull(userInfo) && isNull(isExistCharacterInLand)) {
            //check if your land belongs

            let landPrice;
            let historyPrice;
            let isMyLand = false;
            if(item.quadKeys){
                const myLands = await Land23.find({ 'user._id': ObjectId(userId), quadKey: {$in: item.quadKeys}, forSaleStatus: false }).lean(); //Land for Sale cannot plant tree
                if(myLands && myLands.length === 4){
                    isMyLand = true;
                    landPrice = 0;
                    historyPrice = 0;
                    //landPrice = myLands.reduce((total, mLand) => total + mLand.initialPrice, 0);
                    //historyPrice = myLands.reduce((total, mLand) => total + mLand.sellPrice, 0);
                }
            } else { //Plant normal tree
                const myLand = await Land23.findOne({ 'user._id': ObjectId(userId), quadKey: item.quadKey, forSaleStatus: false }).lean(); //Land for Sale cannot plant tree
                if(myLand){
                    isMyLand = true;
                    landPrice = myLand.initialPrice;
                    historyPrice = myLand.sellPrice;
                }
            }
            //console.log('lllllllll', { landPrice, historyPrice, isMyLand});
            //const myLand = await Land23.findOne({ 'user._id': ObjectId(userId), quadKey: item.quadKey }).lean();
            //console.log('myLand',myLand);
            if (isMyLand) {
                //Check the item available in the inventory
                let isItemExist = await Inventory.findOne({ userId: ObjectId(userId), 'itemId': item.itemId }).lean();
                if (isItemExist) {
                    try {
                        //lấy pending item đang sử dụng
                        const itemPending = await getItemPending({ itemId: item.itemId, nid: Number(userInfo.nid), type: 'USING_ITEM' });
                        const itemPendingQuantity = itemPending && itemPending.quantity ? itemPending.quantity : 0;
                        // console.log('itemPending', itemPending);
                        // console.log('isItemExist', isItemExist);

                        //ref đến bảng items lấy dữ liệu
                        const itemObj = await Item.findOne({ 'itemId': item.itemId }).lean();
                        // check amount of item > 0
                        if (isItemExist.quantity >= 1 && isItemExist.quantity > itemPendingQuantity) {
                            await createItemPending({ nid: Number(userInfo.nid), itemId: item.itemId, type: 'USING_ITEM' });
                            const nid = parseInt(userInfo.nid);

                            const quadKey = item.quadKey;
                            const quadKeyParent1 = item.quadKey.substr(0, 24 - PARENT_1_RANGE);
                            const quadKeyParent2 = item.quadKey.substr(0, 24 - PARENT_2_RANGE);
                            //thừa
                            // const getFromCode = item.getFromCode;
                            //
                            //ref bảng item lấy dữ liệu
                            const itemId = item.itemId;
                            const item_id = itemObj._id;
                            const category = itemObj.category;
                            const defaultProfit = itemObj.defaultProfit;
                            const price = itemObj.price;
                            //end
                            //ref bảng land 23 lấy dữ liệu
                            //const landPrice = land23Obj.initialPrice;
                            //const historyPrice = land23Obj.sellPrice;
                            // const distributedPrice = 6996000;
                            //end
                            //add to preparing trees list
                            const nutritionalPeriod = itemObj.defaultNutritionalPeriod;

                            preparingMovingItems.push(
                                treeObj({
                                    nid,
                                    userId,
                                    quadKey,
                                    quadKeyParent1,
                                    quadKeyParent2,
                                    bigTreeQuadKeys: item.quadKeys || null,
                                    itemId,
                                    category,
                                    defaultProfit,
                                    price,
                                    landPrice,
                                    historyPrice,
                                    // distributedPrice,
                                    nutritionalPeriod,
                                    item: item_id,
                                })
                            );
                        }
                    } catch(e){
                        console.log("Error: ", e);
                        break;
                    }
                } else {
                    //Lỗi khi đang sử dụng item ở một nơi khác
                    console.log("Lỗi khi đang sử dụng item ở một nơi khác");
                    break;
                }
            }
        }
    }
    
    const defaultInventory = await Inventory.find({ 'userId': ObjectId(userId), 'category': 'TREE' }).lean();
    //console.log("preparingMovingItems",preparingMovingItems);
    try {
        //console.log("preparingMovingItems",preparingMovingItems);
        if (preparingMovingItems.length <= 0) {
            console.log("fail buy tree");
            return { status: false, result: { updatedInventory: defaultInventory, plantedTrees: [] } }
        }
        // move to land
        const plantedTrees = await db.Object.insertMany(preparingMovingItems);
        // update quantity of added items ....
        const updatedInventory = await updateItemQuantity(items, plantedTrees, userId);

        //======================================================logger plant tree======================================================
        var logPlantedTree = preparingMovingItems.filter(tree => plantedTrees.find(t => t.quadKey === tree.quadKey));
        logPlantedTree = logPlantedTree.map(tree => {
            return {
                'quadKey': tree.quadKey,
                'itemId': tree.itemId,
                'createdDate': tree.createdDateWater,
                'waterStartTime': tree.waterStartTime,
                'waterEndTime': tree.waterEndTime,
                'limitUseNutritional': tree.limitUseNutritional,
                'landPrice': tree.landPrice,
                'historyPrice': tree.historyPrice
            }
        });
        logger.plantTree(logPlantedTree);
        //======================================================End logger plant tree======================================================
        return { status: true, result: { updatedInventory, plantedTrees } };
    }
    catch (e) {
        console.log("Error: ", e);
        return { status: false, result: { updatedInventory: defaultInventory, plantedTrees: [] } };
    }
}
//update item quantity if has result
async function updateItemQuantity(items, plantedTrees, userId) {
    //console.log('items',items);
    const userInfo = await db.User.findById(userId).lean();
    //check result.length and items.length > 0
    var grpTreeWithItemId = [];
    for (tree of plantedTrees) {
        var index = grpTreeWithItemId.findIndex(t => t.itemId === tree.itemId);
        if (index === -1) {
            grpTreeWithItemId.push({
                'itemId': tree.itemId,
                'usingAmount': 1
            });
        } else {
            grpTreeWithItemId[index].usingAmount += 1;
        }
        //console.log('dele', { nid: Number(userInfo.nid), itemId: tree.itemId, type: 'USING_ITEM' })
        //remove item out pending
        await deleteItemPending({ nid: Number(userInfo.nid), itemId: tree.itemId, type: 'USING_ITEM' });

    }

    try {
        await Promise.all(grpTreeWithItemId.map(treeObj => {
            return Inventory.findOne({ 'userId': ObjectId(userId), 'itemId': treeObj.itemId }, (err, tree) => {
                if (err) {
                    return null;
                } else {
                    tree.quantity = tree.quantity - treeObj.usingAmount;
                    if (tree.quantity <= 0) {
                        Inventory.findByIdAndRemove(tree._id)
                            .then((treeResult => { return treeResult }))
                            .catch(err => { return { err: err } });
                    } else {
                        tree.save()
                            .then((treeResult => { return treeResult }))
                            .catch(err => { return { err: err } });
                    }
                }
            })
        }));
        return Inventory.find({ 'userId': ObjectId(userId), 'category': 'TREE' }).lean();
    } catch (err) {
        return { err: err }
    }
}

//Hien add item new code
async function addItemToInventory({ itemId, quantity, userId, getFromCode }) {
    try {
        const inventoryOfUser = await Inventory.findOne({ 'userId': ObjectId(userId), 'itemId': itemId });
        if (isNull(inventoryOfUser)) {
            //nếu chưa có item này trong kho hàng của user , tạo mới
            const itemObj = await Item.findOne({ 'itemId': itemId }).lean();
            if (isNull(itemObj)) {
                return { status: false, result: null }
            }
            const { category, defaultProfit, _id } = itemObj;
            const newInventory = new Inventory({
                'userId': new ObjectId(userId),
                'itemId': itemId,
                'quantity': quantity,
                'category': category,
                'defaultProfit': defaultProfit,
                'getFromCode': getFromCode,
                'item': _id,
                'updateDate': new Date()
            });
            const result = await newInventory.save();
            //logger
            logger.receiveitem({ 'userId': userId, 'itemId': itemId, 'quantity': quantity, 'getFromCode': getFromCode, 'date': new Date() })
            //logger
            return { status: true, result: result };
        } else {
            //nếu có rồi, update số lượng
            const result = await Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), 'itemId': itemId }, {
                '$inc': {
                    'quantity': quantity
                },
                '$push': {
                    'updateDate': new Date()
                }
            }, { new: true });
            //logger
            logger.receiveitem({ 'userId': userId, 'itemId': itemId, 'quantity': quantity, 'getFromCode': getFromCode, 'date': new Date() })
            //logger
            return { status: true, result: result }
        }
    } catch (err) {
        return { status: false, result: null, err }
    }
}

async function checkAnyDeadTrees({ itemId, trees, userId }) {
    let aliveTrees = await Promise.all(trees.map(tree => {
        return db.Object.findOne({
            'userId': ObjectId(userId),
            '_id': ObjectId(tree),
            "waterEndTime": {
                "$gte": new Date()
            }
        }).lean().then(result => { return result._id }).catch(err => { return null });

    }))

    aliveTrees = aliveTrees.filter(tree => !isNull(tree));
    var deadTrees = [];
    for (let eachTree of trees) {
        var index = aliveTrees.findIndex(tree => tree._id.toString() === eachTree);
        if (index === -1) {
            deadTrees.push(eachTree);
        }
    }

    var flag = aliveTrees === trees.length ? false : true;
    return { status: flag, deadTrees: deadTrees, aliveTrees: aliveTrees, objects: [] }
}


// let aliveTrees = await db.Object.find({
//     '_id': { $in: trees },
//     'userId': ObjectId(userId),
//     "waterEndTime": {
//         "$gte": new Date()
//     }
// }).lean();


//     let deadTrees = trees.filter(treeId => !aliveTrees.find(t => t._id.toString() === treeId));
//     return { status: false, result: null, deadTrees: deadTrees }
// }

// vuong add cho nay , Hien coi lai
//use item
async function useItem({ itemId, trees, userId }) {
    //console.log('useItem');
    // const result = await checkAnyDeadTrees({ itemId, trees, userId })
    // if (result.deadTrees.length > 0) {
    //     return { status: !result.status, result: [] }
    // }
    // await checkParamAfterUseItem({ itemId, trees, userId });
    // console.log("deadTrees",deadTrees);
    if (itemId === 'I04') {
        //lấy lại cây
        console.log('test return');
        const usingItemResult = await useShovelBitaminTree({ itemId, trees, userId })
        const itemInventory = await getItemInventoryByUserId({ userId });
        return { itemInventory, ...usingItemResult }
    } else if (itemId === 'I03') {
        //tưới nước
        const usingItemResult = await useWater({ itemId, trees, userId });
        const itemInventory = await getItemInventoryByUserId({ userId });
        return { itemInventory, ...usingItemResult }
    } else if (itemId === 'I02') {
        //xóa đi
        // chỉ xài được khi for sale
        const check = await checkParamBeforeUseItem({ itemId, trees, userId });
        if (typeof check === 'undefined') {
            console.log("chekc undefined");
            return { status: false, result: [], msg: 'Error when pay item' }
        }
        if (check && !check.status) {
            console.log("chekc false");
            return check;
        }
        const usingItemResult = await useShovel({ itemId, trees, userId });
        const itemInventory = await getItemInventoryByUserId({ userId });
        return { itemInventory, ...usingItemResult }
    } else if (itemId === 'I01') {
        //dùng thuộc
        // chỉ xài được khi for sale
        const check = await checkParamBeforeUseItem({ itemId, trees, userId });
        if (typeof check === 'undefined') {
            console.log("chekc undefined");
            return { status: false, result: [], msg: 'Error when pay item' }
        }
        if (check && !check.status) {
            console.log("chekc false");
            return check;
        }
        const usingItemResult = await useNutrients({ itemId, trees, userId });
        const itemInventory = await getItemInventoryByUserId({ userId });
        return { itemInventory, ...usingItemResult }
    } else {
        return null;
    }
}
//end use item


//use useShovelBitaminTree
async function useShovelBitaminTree({ itemId, trees, userId }) {
    try {
        //get item price
        const itemI04 = await db.Item.findOne({ itemId });
        //console.log('itemI04', itemI04);
        if(!itemI04) return { status: false, receiveTree: false, result: null, errMsg: "getItemI04Fail" };

        const treeReturn = await db.Object.find({_id: {$in: trees}});
        //console.log('treeReturn', treeReturn);
        const itemInInventory = await db.Inventory.findOne({ 'userId': ObjectId(userId), itemId });
        //console.log('itemInInventory', itemInInventory);

        //update Item I04
        if(itemInInventory && itemInInventory.quantity > 0){
            const updateI04 = await db.Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), itemId }, { $inc: { 'quantity': -1 } }, { new: true });
            if(!updateI04) return { status: false, receiveTree: false, result: null, errMsg: "cantUpdateDecreaseItemI04" };
        } else {
            //use gold when !itemInInventory && itemInInventory = 0 
            await useGoldWithItem({
                userId: userId,
                price: itemI04.price,
                quantity: 1,
                itemId
            })
        }

        const addInventory = await Promise.all(treeReturn.map(tree => addItemToInventory({ itemId: tree.itemId, quantity: 1, userId, getFromCode: tree.getFromCode })))
        const removeObject = await db.Object.deleteMany({_id: {$in: trees}});
        //console.log('addInventory',addInventory);
        //console.log('removeObject', removeObject);

        if(removeObject.ok === 0) return { status: false, receiveTree: true, result: null, errMsg: "removeObjectFail" }; ///
        if(addInventory.some(addInv => addInv.status === false))  return { status: false, receiveTree: true, result: null, errMsg: "addInventoryFail" };

        //logger
        logger.useitem({
            'userId': userId,
            'itemId': itemId,
            'quantityInInventory': 0,
            'quantityUseInInventory': 0,
            'trees': trees,
            'gold': itemI04.price,
            'date': new Date()
        })
        //end logger
        return { status: true, result: null, receiveTree: true };
    } catch (error) {
        console.log('error', error);
        return { status: false, receiveTree: true, result: null, errMsg: error };
    }
}
//end use useShovelBitaminTree

//use water
async function useWater({ itemId, trees, userId }) {
    var currentDate = new Date();
    var days = 30;
    var after1MonthDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    // var after1MonthDate = new Date(Date.now() + 15 * 1000);
    try {
        // console.log("treesThatAllowToUseWater ", treesThatAllowToUseWater);
        const resultUseWater = await db.Object.updateMany(
            {
                'userId': ObjectId(userId),
                '_id': { $in: trees },
                "waterEndTime": {
                    "$gte": new Date()
                }
            },
            {
                '$set': {
                    'waterStartTime': currentDate,
                    'waterEndTime': after1MonthDate
                }
            },
            { new: true }
        );

        if (resultUseWater.nModified > 0) {
            let result = await db.Object.find({
                'userId': ObjectId(userId),
                '_id': { $in: trees },
                'deletedTree': false
            });

            //logger
            logger.useitem({
                'userId': userId,
                'itemId': itemId,
                'quantityInInventory': 0,
                'quantityUseInInventory': 0,
                'trees': trees,
                'gold': 0,
                'date': new Date()
            })
            //end logger

            return { status: true, result: result };
        }
        else {
            return { status: false, result: [] }
        }
    } catch (err) {
        return { status: false, result: result };
    }
}
//end use water



//wrapper for useGold
async function useGoldWithItem({ userId, price, quantity, itemId }) {
    //console.log('=============================start useGoldWithItem');
    try {
        //console.log('price  ', price);
        if (price <= 0) return null;
        const user = await db.User.findById(userId).lean();
        //console.log('user   ', user);
        const transferInfo = {
            userId: user._id,
            userIdReceive: null,
            goldBlood: price,
            act: ['buyInShop', 'santaReceive'],
            item: 'gold',
        };

        if (process.env.NODE_ENV === 'development') {
            // transfer using goldblood
            const transferStatus = await trades.useGoldBlood(transferInfo);
            return transferStatus;
        } else {
            let getPayApi = 'free item';
            if (price > 0) {
                let items = [{
                    sellerNid: 0,
                    name: itemId,
                    category: 'bloodland:shop',
                    quantity: quantity,
                    amount: Math.round(price * 100000),
                    quadkey: null,
                }];
                //onsole.log('item ', items);
                let dataApiTransfer = { wToken: user.wToken, nid: user.nid, items: items };
                //console.log('dataApiTransfer ', dataApiTransfer)
                getPayApi = await trades.getPay(dataApiTransfer);
                //console.log('getPayApi', getPayApi)
                if (getPayApi.successes && getPayApi.txid !== '') {
                    // transfer using goldblood
                    const transferStatus = await trades.useGoldBlood(transferInfo);
                    return transferStatus;
                }
            }
        }
    } catch (err) {
        console.log('Error:', err);
        return { status: false };
    }
}

async function checkTreeAllowToUseItem({ treeId, userId }) {
    try {
        const isTreeExist = await db.Object
            .findOne({
                '_id': ObjectId(treeId),
                'userId': ObjectId(userId),
                "waterEndTime": {
                    "$gte": new Date()
                }
            })
            .select('quadKey')
            .lean();
        if (isNull(isTreeExist)) return null;
        const isLandForSale = await db.Land23.findOne({ 'quadKey': isTreeExist.quadKey, 'forSaleStatus': false }).lean();
        if (isNull(isLandForSale)) return null;
        return treeId;
    } catch (err) {
        return null;
    }
}

async function deleteTrees({ userId, trees }) {
    let treesAfterDelete = await Promise.all(
        trees.map(treeId => db.Object.findOneAndDelete({
            '_id': ObjectId(treeId), 'userId': ObjectId(userId), 'deletedTree': false
        }))
    );
    let result = treesAfterDelete.filter(tree => !isNull(tree));
    return {
        deletedTrees: result.map(tree => tree._id),
        deletedCount: result.length
    }
}

//use shovel to many trees
async function useShovel({ itemId, trees, userId }) {
    // console.log('start useShovel');
    // var isHasMoney = await checkPriceBeforeUse({ itemId, trees, userId });
    // if (isNull(isHasMoney) || typeof isHasMoney === 'undefined') {
    //     return { status: false, result: null };
    // }
    var usingAmount = trees.length;
    var usingGoldAmount = 0;
    var treesThatAllowUseShovel = await Promise.all(trees.map(treeId => checkTreeAllowToUseItem({ treeId, userId })));
    treesThatAllowUseShovel = treesThatAllowUseShovel.filter(tree => !isNull(tree));

    try {
        //console.log('useShovel');

        const itemObj = await db.Item.findOne({ 'itemId': itemId });
        if (isNull(itemObj)) return { status: false, result: null };

        const itemInInventory = await db.Inventory.findOne({ 'userId': ObjectId(userId), 'itemId': itemId }).lean();

        let newUsingAmount = usingAmount;

        if (!isNull(itemInInventory)) {
            newUsingAmount = usingAmount - itemInInventory.quantity;
        }

        if (process.env.NODE_ENV !== 'development' && newUsingAmount > 0) {
            //hien sửa để xài đc trên local, anh em test lai trên server
            let checkUsingGoldAmount = newUsingAmount * itemObj.price;
            const user = await db.User.findById(ObjectId(userId));
            let getBalance = await trades.getBalance(user);
            if (parseInt(getBalance.balance) < checkUsingGoldAmount) {
                return { status: false, result: [] }
            }
        }

        Promise.all(treesThatAllowUseShovel.map(treeId => createDeleteTreeHistory(treeId, userId)));
        const result = await deleteTrees({ trees: treesThatAllowUseShovel, userId })
        usingAmount = result.deletedCount;

        if (isNull(itemInInventory)) {
            //nếu dùng khi chưa hề mua item đó trong inventory ????????????
            //tính tiền thẳng luôn

            usingGoldAmount = usingAmount * itemObj.price;
            // tính tiền - gọi api use gold
            //console.log('useShovel 2')
            // console.log({
            //     userId: userId,
            //     price: usingGoldAmount,
            //     quantity: usingAmount,
            //     itemId: itemId
            // })
            await useGoldWithItem({
                userId: userId,
                price: usingGoldAmount,
                quantity: usingAmount,
                itemId: itemId
            })
            //call api
            //logger
            logger.useitem({
                'userId': userId,
                'itemId': itemId,
                'quantityInInventory': 0,
                'quantityUseInInventory': 0,
                'trees': trees,
                'gold': usingGoldAmount,
                'date': new Date()
            })
            //end logger
            return { status: result.deletedCount > 0, result: result, deletedTrees: result.deletedTrees };
        } else {
            //nếu đã có trong inventory
            //neu ko còn item để sự dụng, return
            //tính số lượng sau khi trừ đi
            newQuantityOfItem = itemInInventory.quantity - usingAmount;
            //nếu số lượng sau khi xài bé hơn 0
            if (newQuantityOfItem < 0) {
                //tính số lượng cần xài còn lại để tính tiền
                usingGoldAmount = (usingAmount - itemInInventory.quantity) * itemObj.price;
                newQuantityOfItem = 0;
                //cập nhật lại số lượng
                await Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), 'itemId': itemId }, { $set: { 'quantity': newQuantityOfItem } });
                //tính tiền - gọi api use gold
                const tranfer = await useGoldWithItem({
                    userId: userId,
                    price: usingGoldAmount,
                    quantity: (usingAmount - itemInInventory.quantity),
                    itemId: itemId
                });
                //logger
                logger.useitem({
                    'userId': userId,
                    'itemId': itemId,
                    'quantityInInventory': itemInInventory.quantity,
                    'quantityUseInInventory': usingAmount,
                    'trees': trees,
                    'gold': usingGoldAmount,
                    'date': new Date()
                })
                //end logger
                //end tinh tiền
                return { status: result.deletedCount > 0, result: result, deletedTrees: result.deletedTrees };
            } else {
                //cập nhật lại số lượng
                await Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), 'itemId': itemId }, { $set: { 'quantity': newQuantityOfItem } });
            }

            //logger
            logger.useitem({
                'userId': userId,
                'itemId': itemId,
                'quantityInInventory': itemInInventory.quantity,
                'quantityUseInInventory': usingAmount,
                'trees': trees,
                'gold': 0,
                'date': new Date()
            })
            //end logger
            return { status: result.deletedCount > 0, result: result, deletedTrees: result.deletedTrees };
        }
    } catch (err) {
        return { status: false, result: err };
    }
}
//end use shovel to many trees

//use nutrient to one tree
async function useNutrientToSingleTree({ itemId, tree, userId }) {
    //itemId ở đây là id của thuốc dinh dưỡng
    //tree là id của object ( cây )
    try {
        //lấy inventory của 1 user và inventory có chứa item đó
        //lấy 1 tree của 1 user
        const treeObject = await db.Object.findOne({ '_id': tree, 'userId': ObjectId(userId) });
        //nếu cả 1 trong 2 null , return null
        if (!treeObject) {
            return null;
        } else {
            //nếu cả 2 đều có giá trị
            var currentDate = new Date();
            var days = 180;
            var after6MonthDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            // var after6MonthDate = new Date(Date.now() + 45 * 1000);
            //4 lần sử dụng thuốc của 1 tree object
            const times = [
                treeObject.nutritionalStartTime1,
                treeObject.nutritionalStartTime2,
                treeObject.nutritionalStartTime3,
                treeObject.nutritionalStartTime4
            ];
            //lấy lần sử dụng thuốc gần đây nhất  ( xài hết cả 4 lần trả về -1)
            let recentlyNutrientUseTime = getRecentlyNutrientUseTime(times)
            //nếu xài hết cả 4 lần
            if (recentlyNutrientUseTime === -1) {
                // console.log("xài hết trơn rồi");
                return null;
            }

            if (treeObject.limitUseNutritional <= 0) {
                return null;
            }
            //ko thì đi tiếp

            //tạo options update DB
            //update 2 field là thời gian hiện tại và thời gian sau 30 ngày
            // ví dụ lần 1 nutrionalStartTime1,nutrionalEndTime1 , nutrionalStartTime2,nutrionalEndTime2, nutrionalStartTime3,nutrionalEndTime3

            let options = {};
            options.$set = {};
            //set water start time, water end time with round
            //điều chỉnh thời gian bắt đầu, thời gian kết thúc mỗi khi dùng thuốc
            options.$set['nutritionalStartTime' + recentlyNutrientUseTime.toString()] = currentDate;
            options.$set['nutritionalEndTime' + recentlyNutrientUseTime.toString()] = after6MonthDate;
            // options.$set
            //set profit with round
            //điều chỉnh lợi nhuận của lần sử dụng thuốc
            options.$set['profitNutritional' + recentlyNutrientUseTime.toString()] = 0.00017;
            //set profitTotal with round
            //tăng lợi nhuận tổng lên, giảm giới hạn số lần dử dụng thuộc xuống
            options.$inc = { 'profitTotal': 0.00017, 'limitUseNutritional': -1 }
            //trả về kết quả của 1 tree sau khi update
            // return  options;
            try {
                return await db.Object.findOneAndUpdate({ '_id': ObjectId(tree), 'userId': ObjectId(userId), 'deletedTree': false }, options, { new: true });
            } catch (err) {
                return err;
            }

            // return await db.Object.findOne({'_id':ObjectId(tree),'userId': ObjectId(userId)});

        }
    } catch (err) {
        return null;
    }
}
//end use nutrient to one tree


//use nutrient to many trees
async function useNutrients({ itemId, trees, userId }) {
    //console.log('start useNutrients');
    // var isHasMoney = await checkPriceBeforeUse({ itemId, trees, userId });
    // if (isNull(isHasMoney) || typeof isHasMoney === 'undefined') {
    //     return { status: false, result: null };
    // }

    var usingAmount = trees.length;
    var usingGoldAmount = 0;
    var treesThatAllowToUseNutrient = await Promise.all(trees.map(treeId => checkTreeAllowToUseItem({ treeId, userId })));
    treesThatAllowToUseNutrient = treesThatAllowToUseNutrient.filter(tree => !isNull(tree));

    // if (treesThatAllowToUseNutrient.length < usingAmount) {
    //     let aliveTrees = await db.Object.find({
    //         '_id': { $in: trees },
    //         'userId': ObjectId(userId),
    //         "waterEndTime": {
    //             "$gte": new Date()
    //         }
    //     }).lean();
    //     let deadTrees = trees.filter(treeId => !aliveTrees.find(t => t._id.toString() === treeId));
    //     return { status: false, result: null, deadTrees: deadTrees }
    // }
    try {

        const itemObj = await db.Item.findOne({ 'itemId': itemId });
        if (isNull(itemObj)) return { status: false, result: null };

        const itemInInventory = await db.Inventory.findOne({ 'userId': ObjectId(userId), 'itemId': itemId }).lean();

        let newUsingAmount = treesThatAllowToUseNutrient.length;

        if (!isNull(itemInInventory)) {
            newUsingAmount = treesThatAllowToUseNutrient.length - itemInInventory.quantity;
        }

        // neu la server
        // kiem tra so luong > 0

        if (process.env.NODE_ENV !== 'development' && newUsingAmount > 0) {
            let checkUsingGoldAmount = newUsingAmount * itemObj.price;
            const user = await db.User.findById(ObjectId(userId));
            let getBalance = await trades.getBalance(user);
            if (parseInt(getBalance.balance) < checkUsingGoldAmount) {
                return { status: false, result: [] }
            }
        }

        const result = await Promise.all(
            treesThatAllowToUseNutrient.map(tree => useNutrientToSingleTree({ itemId, tree, userId }))
        );
        //chỉ tính là đã xài khi xài thành công
        usingAmount = result.filter(rs => !isNull(rs)).length;
        if (isNull(itemInInventory)) {
            //nếu dùng khi chưa hề mua item đó trong inventory ????????????
            //tính tiền thẳng luôn

            usingGoldAmount = usingAmount * itemObj.price
            // tính tiền - gọi api use gold
            const tranfer = await useGoldWithItem({
                userId: userId,
                price: usingGoldAmount,
                quantity: usingAmount,
                itemId: itemId
            });

            //call api
            var successUseTree = result.filter(rs => !isNull(rs))
            //logger
            logger.useitem({
                'userId': userId,
                'itemId': itemId,
                'quantityInInventory': 0,
                'quantityUseInInventory': 0,
                'trees': trees,
                'gold': usingGoldAmount,
                'date': new Date()
            })
            //end logger

            return { status: successUseTree.length > 0, result: successUseTree };
        } else {
            //nếu đã có trong inventory
            //neu ko còn item để sự dụng, return
            //tính số lượng sau khi trừ đi
            newQuantityOfItem = itemInInventory.quantity - usingAmount;
            //nếu số lượng sau khi xài bé hơn 0
            if (newQuantityOfItem < 0) {
                //tính số lượng cần xài còn lại để tính tiền
                usingGoldAmount = (usingAmount - itemInInventory.quantity) * itemObj.price;
                newQuantityOfItem = 0;
                //cập nhật lại số lượng
                await Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), 'itemId': itemId }, { $set: { 'quantity': newQuantityOfItem } });
                //tính tiền - gọi api use gold
                await useGoldWithItem({
                    userId: userId,
                    price: usingGoldAmount,
                    quantity: (usingAmount - itemInInventory.quantity),
                    itemId: itemId
                })
                //end tinh tiền

                //logger
                logger.useitem({
                    'userId': userId,
                    'itemId': itemId,
                    'quantityInInventory': itemInInventory.quantity,
                    'quantityUseInInventory': usingAmount,
                    'trees': trees,
                    'gold': usingGoldAmount,
                    'date': new Date()
                })
                //end logger

                var successUseTree = result.filter(rs => !isNull(rs))
                return { status: successUseTree.length > 0, result: successUseTree };
            } else {
                //cập nhật lại số lượng
                await Inventory.findOneAndUpdate({ 'userId': ObjectId(userId), 'itemId': itemId }, { $set: { 'quantity': newQuantityOfItem } })

            }

            //logger
            logger.useitem({
                'userId': userId,
                'itemId': itemId,
                'quantityInInventory': itemInInventory.quantity,
                'quantityUseInInventory': usingAmount,
                'trees': trees,
                'gold': 0,
                'date': new Date()
            })
            //end logger

            var successUseTree = result.filter(rs => !isNull(rs))
            return { status: successUseTree.length > 0, result: successUseTree };
        }
    } catch (err) {
        console.log("err", err);
        return { status: false, result: err };
    }

}
//use nutrient to many trees

//get latest time use nutrient
function getRecentlyNutrientUseTime(useNutrientTimes) {
    if (!useNutrientTimes[0]) {
        return 1;
    } else if (!useNutrientTimes[1]) {
        return 2;
    } else if (!useNutrientTimes[2]) {
        return 3;
    } else if (!useNutrientTimes[3]) {
        return 4;
    } else {
        return -1;
    }
}
//end get latest time use nutrient>>>>>>> .r252
