const db = require('../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');
const logger = require('./../../helpers/logger');
module.exports = {
    createRandomBoxAndAddToInventory,
    createRandomBoxs,
    addRandomBoxToInventory,
}

//R01, R02, R03
//arrBoxWithQuantity.map(box => addRandomBoxToInventory({ randomBoxId: box.randomBoxId, quantity: box.quantity, userId, getFromCode: 'E' }))

async function createRandomBoxAndAddToInventory({ userId, quantity }) {
    try {
        if (quantity === 0) return;
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

        for (let box of reMapWithQuantityBox) {
            logger.receiveitem({
                'userId': userId,
                'randomBoxId': box.randomBoxId,
                'quantity': box.quantity,
                'getFromCode': 'E',
                'date': new Date()
            })
        }

        const status = reMapWithQuantityBox.length > 0 ? true : false;
        return { status, result: reMapWithQuantityBox };
    } catch (e) {
        return;
    }
}

async function createRandomBoxs({ quantity }) {
    try {
        let arrBox = await db.RandomBox.find().lean();
        return getRandom({ quantity, arrBox, percentProperty: 'receivingBoxRatio' });
    } catch (e) {
        return;
    }
}

async function addRandomBoxToInventory({ randomBoxId, quantity, userId, getFromCode }) {
    try {
        const inventoryOfUser = await db.RandomBoxInventory.findOne({ 'userId': ObjectId(userId), randomBoxId });
        if (isNull(inventoryOfUser)) {
            //nếu chưa có item này trong kho hàng của user , tạo mới
            const randomBoxObj = await db.RandomBox.findOne({ 'randomBoxId': randomBoxId }).lean();
            if (isNull(randomBoxObj)) {
                return { status: false, result: null }
            }
            const { _id, itemlist } = randomBoxObj;
            const newRandomBoxInventory = new db.RandomBoxInventory({
                'userId': new ObjectId(userId),
                'randomBoxId': randomBoxId,
                'quantity': quantity,
                'getFromCode': getFromCode,
                'randomBox': _id,
                'item': _id,
                'itemlist': itemlist
            });
            const result = await newRandomBoxInventory.save();
            return { status: true, result: result };
        } else {
            //nếu có rồi, update số lượng
            const result = await db.RandomBoxInventory.findOneAndUpdate({ 'userId': ObjectId(userId), randomBoxId }, {
                '$inc': {
                    'quantity': quantity
                }
            }, { new: true });
            return { status: true, result: result }
        }
    } catch (err) {
        return { status: false, result: null, err }
    }
}


//====================================================================GET========================================================================
function findItem(arrBox, ranNumber){
    let iStart = 0;
    for(let box of arrBox){
        iStart += box.receivingBoxRatio;
        if(iStart > ranNumber) return box;
    }
    return arrBox[0];
}

function getRandom({ quantity, arrBox, percentProperty }) {
    let arrItem = [];
    // shuffle()
    for (let i = 0; i < quantity; i++) {
        let item = findItem(arrBox, random(0, 100));
        arrItem.push(item);
    }
    return arrItem;
}

function createPercentArray(arrPercent, percentProperty) {
    return arrPercent.reduce((arrayPercent, aType, key) => arrayPercent.concat(Array(aType[percentProperty]).fill(key)), []);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//=====================================================================GET=======================================================================