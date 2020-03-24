const db = require('../../../db/db');
const GameObject = db.Object;
const ObjectId = require('mongoose').Types.ObjectId;
const Inventory = db.Inventory;
const isNull = require('lodash.isnull');
const landsServices = require('../../lands/services/')
const DEFAULT_LAND_OFFSET = 1;
const groupBy = require('lodash.groupby');

//exist buyer,seller,quadKey in landpendinghistory and exist in buyFailureLandLog

module.exports = {
    // getAllObjectsByUserId,
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId
};

// (async () => {
//     var result = await getAllObjects({ quadKeyParent1: "13211032012010313232", level: 23 });
//     console.log('result', result);

// })()


//get all object by user id
async function getAllObjects({ quadKeyParent1, quadKeyParent2, level }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi
        db.Object.deleteMany(
            {
                "waterEndTime": {
                    "$lte": new Date()
                }
            }
        );
        return db.Object.find({
            deletedTree: false,
            quadKeyParent1: { $in: quadKeyParent1 },
            "waterEndTime": {
                "$gte": new Date()
            }
        }).lean();
    } catch (e) {
        return null
    }
}


//get all object by user id
async function getAllObjectsByUserId({ userId }) {
    console.log("cc");
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi
        db.Object.deleteMany(
            {
                "waterEndTime": {
                    "$lte": new Date()
                }
            }
        );
        return db.Object.find({
            deletedTree: false,
            userId: ObjectId(userId),
            "waterEndTime": {
                "$gte": new Date()
            }
        }).populate('item').lean();
    } catch (e) {
        return [];
    }
}

//get all object by user id - group 
async function getOnLandObjectsByUserId({ userId }) {
    try {
        const onLandObjects = await db.Object.find({ deletedTree: false, userId: ObjectId(userId) }).populate('item').lean();
        var grpOnLandObjects = groupBy(onLandObjects, 'itemId');
        var result = [];
        for (var olObject in grpOnLandObjects) {
            var grpTrees = grpOnLandObjects[olObject];
            result.push({
                itemId: olObject,
                itemDetail : grpTrees[0].item,
                trees : grpTrees.map(t => t._id),
                quantity : grpTrees.length
            });
        }
        return result;
    }

    catch (e) {
        return [];
    }
}

async function getDetailObject({ userId, objectId }) {
    try {
        var treeDetail = await db.Object.findOne({ userId: ObjectId(userId), _id: ObjectId(objectId) }).populate('item').lean();
        var profit = treeDetail.profit;
        for (let i = 1; i <= 4; i++) {
            var current = new Date();
            var nutritionalEndTime = new Date(treeDetail['nutritionalEndTime' + i.toString()]);
            if (treeDetail['profitNutritional' + i.toString()] !== 0 && nutritionalEndTime >= current) {
                profit += treeDetail['profitNutritional' + i.toString()];
            }
        }
        treeDetail.profitTotal = profit;
        return treeDetail;
    } catch (e) {
        return [];
    }
}