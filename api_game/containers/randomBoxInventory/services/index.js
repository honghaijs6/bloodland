const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isEmpty = require('lodash.isempty');
const groupBy = require('lodash.groupby');
const logger = require('./../../../helpers/logger');
const RandomBoxInventory = db.RandomBoxInventory;
const RandomBox = db.RandomBox;
const {
    createPercentArray,
    shuffle,
    random,
} = require('../../../helpers/function');
const inventoryService = require('../../inventory/services');

module.exports = {
    getRandomBoxInventory,
    createRandomBoxAndAddToInventory,
    openBoxCreateItemAndAddToInventory,
    addRandomBoxToInventory
};



// (async () => {

//     const userAA = await db.User.findOne({ userName: 'aa' });
//     //console.log('userAA', userAA);

//     const quantity = 100;
//     let updateRandomBox = await createRandomBoxAndAddToInventory({ userId: userAA._id, quantity });
//     console.log('updateRandomBox', updateRandomBox);

//     const randomBoxId = 'R01';
//     const createItems = await openBoxCreateItemAndAddToInventory({ userId: userAA._id, randomBoxId, openAll: true });
//     console.log('createItems ', createItems);

// })();

function findItem(arrBox, ranNumber){
    let iStart = 0;
    for(let box of arrBox){
        iStart += box.ratioRound;
        if(iStart > ranNumber) return box;
    }
    return arrBox[0];
}

function getRandom({ quantity, arrBox, percentProperty }) {
    let arrItem = [];
    // shuffle()
    for (let i = 0; i < quantity; i++) {
        let item = findItem(arrBox, random(0, 100000));
        arrItem.push(item);
    }
    return arrItem;
}

async function createRandomBoxs({ quantity }) {
    try {
        let arrBox = await db.RandomBox.find().lean();
        return getRandom({ quantity, arrBox, percentProperty: 'receivingBoxRatio' });
    } catch (e) {
        return;
    }
}

async function validCreateRandomBox ({userId, quantity}){
    let user = await db.User.findById(userId).lean();
    if (isNull(user)) {
        return { status: false, result: [], msg: 'user no exist' }
    }
    const parsedQuantity = parseInt(quantity);

    if(parsedQuantity <= 0) return { status: false, result: [], msg: 'quantity is error' }
    return {status: true}
}

async function createRandomBoxAndAddToInventory({ userId, quantity }) {
    const rbBoxChecking = await validCreateRandomBox({ userId, quantity });
    if(rbBoxChecking.status === false) return rbBoxChecking;
    try {
        let arrBox = await createRandomBoxs({ quantity });
        //console.log('arrBox', arrBox);

        let arrBoxWithQuantity = Object.values(groupBy(arrBox, 'randomBoxId')).map(group => {
            let newItem = group[0];
            newItem.quantity = group.length;
            return newItem;
        });
        //console.log('arrBoxWithQuantity', arrBoxWithQuantity);

        let pmArrBox = await Promise.all(
            arrBoxWithQuantity.map(box => addRandomBoxToInventory({ randomBoxId: box.randomBoxId, quantity: box.quantity, userId, getFromCode: 'R' }))
        )

        let reMapWithQuantityBox = arrBoxWithQuantity.map(bwq => {
            //console.log('bwq', bwq);
            let fBox = pmArrBox.find(box => box.result.randomBoxId === bwq.randomBoxId);
            //console.log('fBox', fBox);
            if (fBox) {
                fBox = fBox.result;
                fBox.quantity = bwq.quantity;

                return fBox;
            }
        });
        //console.log('reMapWithQuantityBox', reMapWithQuantityBox);
        const status = reMapWithQuantityBox.length > 0 ? true : false;
        return { status, result: reMapWithQuantityBox };
    } catch (e) {
        return;
    }
}

// check randombox quantity
async function validRandomBoxQuantity ({userId, randomBoxId}){
    let box = await db.RandomBoxInventory.findOne({ userId, randomBoxId }).lean();
    // check quantity box <= 0
    if (!box || box.quantity <= 0) {
        await db.RandomBoxInventory.findOneAndRemove({ userId, randomBoxId }).lean();
        return { status: false, error: "Can't found box!!!" };
    }
    return  { status: true };
}

async function openBoxCreateItemAndAddToInventory({ userId, randomBoxId, openAll }) {
    //get box from db
    // check quantity box 
    const rbBoxChecking = validRandomBoxQuantity({userId, randomBoxId});
    if(rbBoxChecking.status === false) return rbBoxChecking;

    let arrBox = await db.RandomBoxInventory.findOne({ userId, randomBoxId }).lean();
    //console.log('arrBox', arrBox)
    //const { quantity } = arrBox;
    //console.log('arrBox.length', arrBox.length);
    const quantity = openAll === true ? arrBox.quantity : 1;
    //console.log('quantity', quantity);
    const itemlist = arrBox.itemlist.map(item => {
        item.ratioRound = item.ratio * 1000;
        return item;
    });
    //get random items
    let arrItem = getRandom({ quantity, arrBox: itemlist, percentProperty: 'ratioRound' });

    //group item with quantity in object
    let arrItemWithQuantity = Object.values(groupBy(arrItem, 'itemId')).map(group => {
        let newItem = group[0];
        newItem.quantity = group.length;
        return newItem;
    });
    //console.log('arrItemWithQuantity', arrItemWithQuantity);

    //remove all Box type 
    if (quantity === arrBox.quantity) {
        await db.RandomBoxInventory.deleteOne({ userId, randomBoxId }).lean();
        logger.useitem({
            'userId': userId,
            'randomBoxId': randomBoxId,
            'quantityInInventory': arrBox.quantity,
            'quantityUseInInventory': openAll === true ? arrBox.quantity : 1,
            'trees': [],
            'gold': 0,
            'date': new Date()
        })
    } else {
        await db.RandomBoxInventory.findOneAndUpdate({ userId, randomBoxId }, { $set: { quantity: arrBox.quantity - 1 } }).lean();
        logger.useitem({
            'userId': userId,
            'randomBoxId': randomBoxId,
            'quantityInInventory': arrBox.quantity,
            'quantityUseInInventory': openAll === true ? arrBox.quantity : 1,
            'trees': [],
            'gold': 0,
            'date': new Date()
        })
    }


    //add to inventory - return total quantity in inventory
    let arrItemSave = await Promise.all(arrItemWithQuantity.map(item => inventoryService.addItemToInventory({ itemId: item.itemId, quantity: item.quantity, userId, getFromCode: randomBoxId })));
    //console.log('arrItemSave', arrItemSave);

    //re map save Item with open quantity item
    let reMapWithQuantityOpenBox = arrItemWithQuantity.map(arrItemQuantity => {
        let fItemSave = arrItemSave.find(itemSave => itemSave.result.itemId === arrItemQuantity.itemId);
        if (fItemSave) {
            fItemSave = fItemSave.result;
            fItemSave.quantity = arrItemQuantity.quantity;
            //return { ...fItemSave.result, quantity: arrItemQuantity.quantity }
            return fItemSave;
        }
    });

   
    //console.log('reMapWithQuantityOpenBox', reMapWithQuantityOpenBox);
    return { status: reMapWithQuantityOpenBox.length > 0, result: reMapWithQuantityOpenBox };
}

//RandomBox
async function getRandomBoxInventory({ userId }) {
    try {
        var items = await RandomBoxInventory.find({ "userId": userId }).populate('randomBox', '-itemlist -price -_id -randomBoxId -receivingBoxRatio -__v').lean();
        items = items.map(i => {
            i = { ...i, ...i.randomBox };
            delete i.randomBox;
            return i
        });
        return items;
    } catch (e) {
        return [];
    }
}

async function addRandomBoxToInventory({ randomBoxId, quantity, userId, getFromCode }) {
    try {
        const inventoryOfUser = await RandomBoxInventory.findOne({ 'userId': ObjectId(userId), randomBoxId });
        if (isNull(inventoryOfUser)) {
            //nếu chưa có item này trong kho hàng của user , tạo mới
            const randomBoxObj = await RandomBox.findOne({ 'randomBoxId': randomBoxId }).lean();
            if (isNull(randomBoxObj)) {
                return { status: false, result: null }
            }
            const { _id, itemlist } = randomBoxObj;
            const newRandomBoxInventory = new RandomBoxInventory({
                'userId': new ObjectId(userId),
                'randomBoxId': randomBoxId,
                'quantity': quantity,
                'getFromCode': getFromCode,
                'randomBox': _id,
                'item': _id,
                'itemlist': itemlist,
                'updateDate': [new Date()]
            });
            const result = await newRandomBoxInventory.save();
            logger.receiveitem({ 'userId': userId, 'randomBoxId': randomBoxId, 'quantity': quantity, 'getFromCode': getFromCode, 'date': new Date() })
            return { status: true, result: result };
        } else {
            //nếu có rồi, update số lượng
            const result = await RandomBoxInventory.findOneAndUpdate({ 'userId': ObjectId(userId), randomBoxId }, {
                '$inc': {
                    'quantity': quantity
                },
                '$push': {
                    'updateDate': new Date()
                }
            }, { new: true });

            logger.receiveitem({ 'userId': userId, 'randomBoxId': randomBoxId, 'quantity': quantity, 'getFromCode': getFromCode, 'date': new Date() })
            return { status: true, result: result }
        }
    } catch (err) {
        return { status: false, result: null, err }
    }
}



// receiveRandomBoxGift()
// // //console.log('receiveRandomBoxGift() ', receiveRandomBoxGift());
// function receiveRandomBoxGift(){
//     const sfItems = shuffle(createPercentArray(BOX_PERCENT));
//     const iRandom = random(0, sfItems.length-1);
//     //console.log('iRandom ', iRandom)
//     return BOX_DATA[sfItems[iRandom]];
// }

// //console.log('receiveRandomBoxGift() ', receiveRandomBoxGift());
// function receiveRandomBoxGift(){
//     const sfItems = shuffle(createPercentArray(BOX_PERCENT));
//     const iRandom = random(0, sfItems.length-1);
//     console.log('iRandom ', iRandom)
//     return BOX_DATA[sfItems[iRandom]];
// }

// for(let i = 0; i < 12; i++){
//     console.log( receiveGiftFromBox('normal') );
// }

// console.log( receiveGiftFromBox('normal') );
// typePercent = 'normal' | 'rare' | 'legend'
// function receiveGiftFromBox(typePercent){
//     if(typePercent === 'normal'){
//         let sfItems = shuffle(createPercentArray(NORMAL_GIFT_PERCENT));
//         let iRandom = random(0, sfItems.length-1);
//         return NORMAL_GIFT_DATA[sfItems[iRandom]];
//     } else if(typePercent === 'rare'){
//         let sfItems = shuffle(createPercentArray(RARE_GIFT_PERCENT));
//         let iRandom = random(0, sfItems.length-1);
//         return RARE_GIFT_DATA[sfItems[iRandom]];
//     } else if(typePercent === 'legend'){
//         let sfItems = shuffle(createPercentArray(LEGEND_GIFT_PERCENT));
//         let iRandom = random(0, sfItems.length-1);
//         return LEGEND_GIFT_DATA[sfItems[iRandom]];
//     }
//     return;
// }

// function createPercentArray(arrPercent){
//     return arrPercent.reduce((arrayPercent, aType) => arrayPercent.concat(Array(aType.percent).fill(aType.type)), []);
// }

// function shuffle(a) {
//     for (let i = a.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [a[i], a[j]] = [a[j], a[i]];
//     }
//     return a;
// }

// function random(min, max){
//     return Math.floor(Math.random()*(max-min+1)+min);
// }