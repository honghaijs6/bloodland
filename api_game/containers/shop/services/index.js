const db = require('../../../db/db');
const config = require('../../../db/config');

const Item = db.Item;
const Randomboxes = db.RandomBox;
const User = db.User;

const inventoryService = require('../../inventory/services');
const randomBoxInventoryServices = require('../../randomBoxInventory/services');

const ObjectId = require('mongoose').Types.ObjectId;
const rp = require('request-promise');
const isEmpty = require('lodash.isempty');
const isNull = require('lodash.isnull');
const moment = require('moment');

const itemPendingServices = require('../../item/services/itemPending');
const tradeServices = require('../../users/services/trades');

module.exports = {
    getShop,
    getRandomBoxShop,
    buyItemFromShop,
    buyRandomBoxFromShop,
};


// (async () => {
//     const param ={
//         userId:'5c9a4ddef10b002260d05d37',
//         itemId: 'I01',
//         getFromCode: 'B',
//         quantity: 5
//     };
//     // console.log('param',param);
//     console.log('buyItemFromShop', await buyItemFromShop(param));

//     const param1 ={
//         userId:'5c9a4ddef10b002260d05d37',
//         randomBoxId: 'R01',
//         getFromCode: 'B',
//         quantity: 5
//     };
//     console.log('buyRandomBoxFromShop', await buyRandomBoxFromShop(param1));
// })();


const LIMIT_ITEMS = ['T10'];
const MAX_BTAMIN_BUY_COUNT = 2000;
async function getShop() {
    try {
        const now = new Date();
        for (const itemId of LIMIT_ITEMS) {
            const item = await Item.findOne({ itemId: itemId }).lean();
            if (item && !moment(item.buyLimitDate).isSame(moment(now), 'day') && item.buyLimitAmount < MAX_BTAMIN_BUY_COUNT) {
                await Item.findOneAndUpdate({ 'itemId': itemId }, { $set: { 'buyLimitAmount': MAX_BTAMIN_BUY_COUNT, 'buyLimitDate': now } });
            }
        }
        let items = await Item.find().lean();
        //console.log(items);
        return items;
    } catch (e) {
        return [];
    }
}

async function getRandomBoxShop() {
    try {
        return await Randomboxes.find().lean();
    } catch (e) {
        return [];
    }
}

//add I04 for function Buy Item in Shop - Mr. Quan
var SHOP_ITEMS = ['T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T10', 'R01', 'R02', 'R03', 'I01', 'I02', 'I04'];
async function buyItemFromShop({ itemId, quantity, userId, getFromCode }) {
    //console.log('buyItemFromShop', quantity, userId)
    let canBuyAmount = -1;
    // try {
    //throw 500;
    //console.log("buyItemFromShop", { itemId, quantity, userId, getFromCode });
    // console.log("SHOP_ITEMS.indexOf(itemId)",SHOP_ITEMS.indexOf(itemId));
    if (SHOP_ITEMS.indexOf(itemId) == -1) {
        console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, result: [], msg: "error item", errCode: "invalidItemArr", l: '80' };
    }

    // check itemId undefined
    if (typeof itemId === 'undefined' || isEmpty(itemId))
        return { status: false, result: [], msg: "item undefined", errCode: "invalidItemId", l: '86' };


    if (typeof quantity === 'undefined' || isNull(quantity)) { // == if (user || parsedQuantity);
        //console.log('parsedQuantity === undefined');
        return { status: false, result: [], msg: "parsedQuantity and price  < 0 =>kill this", errCode: "invalidQuantity", l: '91' };
    }

    var parsedQuantity = parseInt(quantity);

    if (typeof quantity === 'undefined' || parsedQuantity <= 0 || parsedQuantity != quantity) {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, result: [], msg: "error quantity", errCode: "invalidQuantity", l: '98' };
    }

    if (getFromCode != 'B') {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, result: [], msg: "error quantity", errCode: "invalidFromCode", l: '103' };
    }

    let item = await Item.findOne({ itemId: itemId }).lean();

    if (isNull(item))
        return { status: false, result: [], msg: "item null", errCode: "invalidItem", l: '109' };

    var price = parseInt(item.price);

    // check quantity and price  < 0
    if (typeof price === 'undefined' || isNull(price) || price <= 0) { // == if (user || parsedQuantity);
        //console.log('parsedQuantity and price  < 0   xxxxyyyyyyy  => kill this');
        return { status: false, result: [], msg: "parsedQuantity and price  < 0 =>kill this", errCode: "invalidPrice", l: '116' };
    }

    const user = await User.findById(userId);

    // check quantity and price  < 0
    if (isNull(user) || typeof parsedQuantity === 'undefined' || parsedQuantity <= 0 || price <= 0) { // == if (user || parsedQuantity);
        //console.log('parsedQuantity and price  < 0   xxxxyyyyyyy  => kill this');
        return { status: false, result: [], msg: "parsedQuantity and price  < 0 =>kill this", errCode: "invalidUser", l: '124' };
    }

    if (process.env.NODE_ENV === 'development') {
        const goldBlood = user.goldBlood;

        ///user has totalprice <= 0 => kill this
        if (parseInt(price * parsedQuantity) <= 0) {
            return { status: false, result: [], msg: 'user has totalprice <= 0 => kill this', errCode: "invalidTotalPrice", l: '132' }
        }
        ///user has wallet < totalprice => kill this
        if (goldBlood <= 0 || goldBlood - (price * parsedQuantity) < 0) {
            return { status: false, result: [], msg: 'user has wallet < totalprice  => kill this', errCode: "invalidGoldBlood", l: '136' }
        }
    }
    else {
        try {
            const wallet = await tradeServices.getBalance(user);
            const goldBlood = parseInt(wallet.balance);
            ///user has totalprice <= 0 => kill this
            if (parseInt(price * parsedQuantity) <= 0) {
                return { status: false, result: [], msg: 'user has totalprice <= => kill this', errCode: "invalidTotalPrice", l: '145' }
            }
            ///user has wallet < totalprice => kill this
            if (goldBlood <= 0 || goldBlood - (price * parsedQuantity) < 0) {
                return { status: false, result: [], msg: 'user has totalprice <= 0  => kill this', errCode: "invalidGoldBlood", l: '149' }
            }
        } catch (err) {
            return { status: false, result: [], msg: 'Error when pay item', errCode: "999", l: '152' }
        }
    }
    /////// check item LIMIT /////////////////////////////////
    if (item.status === 'LIMIT') {
        //console.log("LIMIT", userId);
        item = await Item.findOne({ itemId: itemId }).lean();
        if (item.buyLimitAmount < parsedQuantity) {
            return { status: false, result: [], msg: "buyLimitAmount < parsedQuantity", errCode: "limitBuyItem", l: '164' };
        }

        //get pendingbuying and check amount
        const pending = await itemPendingServices.getBuyItemPending(itemId, 'BUY_LIMIT_TREE');
        if (pending) {
            //console.log("Có Pending", userId);
            //console.log('pending', userId, pending);
            if (pending.quantity + parsedQuantity > item.buyLimitAmount) {
                //console.log('pending.quantity + parsedQuantity > item.buyLimitAmount', userId);
                canBuyAmount = item.buyLimitAmount - pending.quantity;
                //console.log('canBuyAmount', userId, canBuyAmount);
                if (canBuyAmount > 0) {
                    //console.log('Where Yố');
                    //return {status: false, result: {canBuyAmount,buyQuantity:parsedQuantity},code:'buyAllAmount'};
                    return { status: false };
                } else {
                    //console.log("can");
                    //console.log('Số lượng vượt quá số lượng cây có thể mua!');
                    return { status: false, result: { canBuyAmount }, errCode: "limitBuyItem2", l: '178' }
                }
                // console.log("can not buy Amount -> ", canNotBuyAmount);
                // return { status: false, result: [], msg: "pending.quantity + parsedQuantity > item.buyLimitAmount", errCode: "limitBuyItem2", l: '164' };
            }
        }

        // create pendingbuying
        // console.log("=====> create pendingbuying");
        let pendingQty = canBuyAmount > 0 ? canBuyAmount : parsedQuantity;
        //console.log('pendingQty createBuyItemPending', userId, pendingQty);
        await itemPendingServices.createBuyItemPending(itemId, 'BUY_LIMIT_TREE', pendingQty);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let transferResponse = null;

    // transferBlood
    // create transferResponse
    const transferInfo = {
        userId: user._id,
        userIdReceive: null,
        goldBlood: quantity * price,
        act: ['buyInShop', 'santaReceive'],
        item: 'gold',
    };
    if (process.env.NODE_ENV !== 'development') {
        let getPayApi = 'free item';
        if (price > 0) {
            let items = [{
                sellerNid: 0,
                name: itemId,
                category: 'bloodland:shop',
                quantity: quantity,
                amount: Math.round(quantity * price * 100000),
                quadkey: null,
            }];

            let dataApiTransfer = { wToken: user.wToken, nid: user.nid, items: items };
            getPayApi = await tradeServices.getPay(dataApiTransfer);
        }

        if (getPayApi === 'free item' || (typeof getPayApi !== 'undefined' && getPayApi.successes && getPayApi.txid !== '')) {
            //get wallet api success
            const qtt = itemId === 'T10' && canBuyAmount && canBuyAmount > 0 ? canBuyAmount : quantity;
            //console.log('canBuyAmount', canBuyAmount, userId);
            //console.log('quantity', quantity, userId);
            const addObjects = await inventoryService.addItemToInventory({ itemId, quantity: qtt, userId, getFromCode });

            if (addObjects && addObjects.status) {
                //buy item success
                transferResponse = tradeServices.getWalletInfo(user);
                if (isNull(transferResponse)) {
                    // const saveHistory = await saveHistoryUser(transferInfo, transferResponse);
                    // if (!saveHistory.status) return saveHistory;
                    return { ...addObjects, transferResponse: false };
                }

                if (item.status === 'LIMIT') {
                    //console.log('Update Amount Quantity', userId);
                    /// update item amount
                    let pendingQty = canBuyAmount > 0 ? canBuyAmount : parsedQuantity;
                    //console.log('pendingQty', userId, pendingQty);
                    const updateQuantity = await Item.findOneAndUpdate({ 'itemId': itemId }, { $inc: { 'buyLimitAmount': -pendingQty }, $set: { buyLimitDate: new Date() } }, { new: true });
                    //console.log('after updateQuantity', userId, pendingQty);
                    await itemPendingServices.deleteBuyItemPending(itemId, 'BUY_LIMIT_TREE', pendingQty);
                    //console.log('after deleteBuyItemPending', userId);
                    if (canBuyAmount > 0) {
                        //console.log('canBuyAmount > 0', userId, canBuyAmount);
                        return { status: false, result: { canBuyAmount, buyQuantity: parsedQuantity }, code: 'buyAllAmount' };
                    }
                    //console.log("Bỏ qua: canBuyAmount > 0", userId);
                }


                return { ...addObjects, transferResponse };
            } else {
                // buy item fail
                //console.log('Buy Fail', userId);
                let buyFail = new db.BuyInShopFailHistory();
                buyFail.nid = parseInt(user.nid);
                buyFail.itemId = itemId;
                buyFail.userId = ObjectId(user._id);
                buyFail.quantity = quantity;
                buyFail.price = price;
                buyFail.amount = Math.round(quantity * price * 100000);
                await buyFail.save();

                // return { status:false}
                //end buy item fail
                return { status: false, result: [], msg: 'Error when pay item', errCode: "invalidBuying", l: '258' };
            }
        } else {
            //console.log('getPayApi = false');
            //get wallet api fail
            let buyFail = new db.BuyInShopFailHistory();
            buyFail.nid = parseInt(user.nid);
            buyFail.itemId = itemId;
            buyFail.userId = ObjectId(user._id);
            buyFail.quantity = quantity;
            buyFail.price = price;
            buyFail.amount = Math.round(quantity * price * 100000);
            await buyFail.save();

            //end //get wallet api fail
            return { status: false, result: [], msg: 'Error when pay item', errCode: "invalidBuying", l: '273' };
        }
    } else {
        const qtt = itemId === 'T10' && canBuyAmount && canBuyAmount > 0 ? canBuyAmount : quantity;
        const addObjects = await inventoryService.addItemToInventory({ itemId, quantity, userId, getFromCode });

        if (addObjects && addObjects.status) {
            transferResponse = await tradeServices.useGoldBlood(transferInfo);
            if (isNull(transferResponse)) {
                // const saveHistory = await saveHistoryUser(transferInfo, transferResponse);
                // if (!saveHistory.status) return saveHistory;
                return { ...addObjects, transferResponse: false };
            }

            if (item.status === 'LIMIT') {
                /// update item amount
                let pendingQty = canBuyAmount > 0 ? canBuyAmount : parsedQuantity;
                const updateQuantity = await Item.findOneAndUpdate({ 'itemId': itemId }, { $inc: { 'buyLimitAmount': -pendingQty }, $set: { buyLimitDate: new Date() } }, { new: true });
                await itemPendingServices.deleteBuyItemPending(itemId, 'BUY_LIMIT_TREE', pendingQty);

                if (canBuyAmount > 0) {
                    return { status: false, result: { canBuyAmount, buyQuantity: parsedQuantity }, code: 'buyAllAmount' };
                }

            }

            return { ...addObjects, transferResponse };
        }
    }

    return { status: false, result: [], msg: 'Error when pay item', errCode: "invalidBuying", l: '300' };
    // } catch (error) {
    //     console.log(error);
    //     return { status: false, result: [], msg:error, errCode:"999",l:'287' };
    // }

}

async function buyRandomBoxFromShop({ randomBoxId, quantity, userId, getFromCode }) {
    if (SHOP_ITEMS.indexOf(randomBoxId) == -1) {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, error: "error item" };
    }

    var quantityInt = parseInt(quantity);
    if (quantityInt != quantity) {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, error: "error quantity" };
    }

    if (quantity <= 0 || quantity > 1000) {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, error: "error quantity" };
    }

    if (getFromCode != 'B') {
        //console.log('INVALID REQUEST: buyItemFromShop: ' + userId, arguments);
        return { status: false, error: "error quantity" };
    }
    // console.log(randomBoxId,quantity,userId,getFromCode);
    //get user to action
    const user = await User.findById(userId);

    // check randomBoxId undefined
    if (typeof randomBoxId === 'undefined' || isEmpty(randomBoxId))
        return { status: false, error: "rb undefined" };

    // get Item in shop (template)
    const randomBox = await Randomboxes.findOne({ randomBoxId: randomBoxId }).lean();

    let transferResponse = null;
    // check item null
    if (isNull(randomBox))
        return { status: false, error: "is null" };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let box = await db.RandomBoxInventory.findOne({ userId, randomBoxId }).lean();
    // check quantity box <= 0
    if (!box || box.quantity <= 0) {
        await db.RandomBoxInventory.findOneAndRemove({ userId, randomBoxId }).lean();
        //return { status: false, error: "your inventory has some errors" };
    }

    // get price item
    var price = parseInt(randomBox.price);
    var parsedQuantity = parseInt(quantity);

    // check quantity and price  < 0
    if (isNull(user) || typeof parsedQuantity === 'undefined' || parsedQuantity <= 0 || price <= 0) {

        return { status: false, error: "parsedQuantity and price  < 0 => kill this" };
    }

    if (process.env.NODE_ENV === 'development') {

        const goldBlood = user.goldBlood;
        ///user has totalprice <= 0 => kill this
        if (parseInt(price * parsedQuantity) <= 0) {

            return { status: false, result: [], msg: 'user has totalprice <= 0 => kill this' }
        }
        ///user has wallet < totalprice => kill this
        if (goldBlood <= 0 || goldBlood - (price * parsedQuantity) < 0) {

            return { status: false, result: [], msg: 'user has wallet < totalprice => kill this' }
        }
    }
    else {
        try {
            const wallet = await tradeServices.getBalance(user);
            const goldBlood = parseInt(wallet.balance);
            // console.log('pass price', price);
            ///user has totalprice <= 0 => kill this
            if (parseInt(price * parsedQuantity) <= 0) {

                return { status: false, result: [], msg: 'user has totalprice <= 0 => kill this' }
            }
            ///user has wallet < totalprice => kill this
            if (goldBlood <= 0 || goldBlood - (price * parsedQuantity) < 0) {

                return { status: false, result: [], msg: 'user has wallet < totalprice => kill this' }
            }
        } catch (err) {
            return { status: false, result: [], msg: 'Error when pay item' }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var price = parseInt(randomBox.price);

    if (isNull(user) || typeof quantity === 'undefined' || quantity < 0 || price < 0)
        return { status: false, error: "system error" };

    // transferBlood
    // create transferResponse
    const transferInfo = {
        userId: user._id,
        userIdReceive: null,
        goldBlood: quantity * price,
        act: ['buyInShop', 'santaReceive'],
        item: 'gold',
    };
    if (process.env.NODE_ENV !== 'development') {
        let getPayApi = 'free item';
        if (price > 0) {
            let items = [{
                sellerNid: 0,
                name: randomBoxId,
                category: 'bloodland:shop',
                quantity: quantity,
                amount: Math.round(quantity * price * 100000),
                quadkey: null,
            }];

            let dataApiTransfer = { wToken: user.wToken, nid: user.nid, items: items };
            getPayApi = await tradeServices.getPay(dataApiTransfer);
        }

        if (getPayApi === 'free item' || (typeof getPayApi !== 'undefined' && getPayApi.successes && getPayApi.txid !== '')) {
            //get wallet api success , add object then get payment
            const addObjects = await randomBoxInventoryServices.addRandomBoxToInventory({ randomBoxId, quantity, userId, getFromCode });
            if (addObjects && addObjects.status) {
                //buy random box success
                transferResponse = tradeServices.getWalletInfo(user);
                if (isNull(transferResponse)) {
                    // const saveHistory = await saveHistoryUser(transferInfo, transferResponse);
                    // if (!saveHistory.status) return saveHistory;
                    // error: "system error"
                    return { ...addObjects, transferResponse: false };
                }
                return { ...addObjects, transferResponse: transferResponse };
            } else {
                //buy random box fail

                let buyFail = new db.BuyInShopFailHistory();
                buyFail.nid = parseInt(user.nid);
                buyFail.itemId = randomBoxId;
                buyFail.userId = ObjectId(user._id);
                buyFail.quantity = quantity;
                buyFail.price = price;
                buyFail.amount = Math.round(quantity * price * 100000);
                await buyFail.save();
                // return { status:false}
                return { status: false, error: "error buyFail" };

                //end buy random box fail
            }
        } else {
            //get wallet api fail
            let buyFail = new db.BuyInShopFailHistory();
            buyFail.nid = parseInt(user.nid);
            buyFail.itemId = randomBoxId;
            buyFail.userId = ObjectId(user._id);
            buyFail.quantity = quantity;
            buyFail.price = price;
            buyFail.amount = Math.round(quantity * price * 100000);
            await buyFail.save();
            // return { status:false}
            return { status: false, error: "error buyFail" };
        }
    }
    else {
        const addObjects = await randomBoxInventoryServices.addRandomBoxToInventory({ randomBoxId, quantity, userId, getFromCode });
        if (addObjects && addObjects.status) {
            transferResponse = await tradeServices.useGoldBlood(transferInfo);
            if (isNull(transferResponse)) {
                // const saveHistory = await saveHistoryUser(transferInfo, transferResponse);
                // if (!saveHistory.status) return saveHistory;
                // error: "system error"
                return { ...addObjects, transferResponse: false };
            }
            return { ...addObjects, transferResponse: transferResponse };
        }
    }
    return { status: false, error: "system error" };
}