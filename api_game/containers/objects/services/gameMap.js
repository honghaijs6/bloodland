const db = require('../../../db/db');
const GameObject = db.Object;
const ObjectId = require('mongoose').Types.ObjectId;
const Inventory = db.Inventory;
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');

module.exports = {
    getAreaObjects,
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId
};

// (async () => {
//     var result = await getAreaObjects({ quadKeyParent1: "13211032010233331013" });
//     console.log('result', result);

// })()


//get area object by quadKeyParent1
/*
    level: level of Land
    quadKeyParent1: array quadKeys level20
    quadKeyParent2: array quadKeys level19
*/
async function getAreaObjects({ quadKeyParent1 }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi (khác cây bitamin)
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        //lấy danh sách cây có cùng quadKeyParent1
        return db.Object.find({
            deletedTree: false,
            quadKeyParent1: { $in: quadKeyParent1 },
            $or: [{"waterEndTime": { "$gte": new Date()}}, {"waterEndTime": null}], //cây chưa chết do thiếu nước hoặc là cây Bitamin
        }).select('bigTreeQuadKeys userId quadKey item itemId category waterStartTime waterEndTime createdDateWater createdDate').lean();
    } catch (e) {
        console.log('Error: ', e);
        return;
    }
}

async function getAllObjects({ quadKeyParent1 }) {
    //console.log('getAllObjects start', quadKeyParent1);
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi (khác cây bitamin)
        //console.log("before deletedTree");
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        //console.log("after deletedTree");
        //lấy danh sách cây có cùng quadKeyParent1
        let objs = await db.Object.find({
            deletedTree: false,
            quadKeyParent1: { $in: quadKeyParent1 },
            $or: [{"waterEndTime": { "$gte": new Date()}}, {"waterEndTime": null}], //cây chưa chết do thiếu nước hoặc là cây Bitamin
        }).select('-nid').lean();
        //console.log('objs', objs);
        return objs;
    } catch (e) {
        console.log('Error: ', e);
        return [];
    }
}



//get all object by user id
async function getAllObjectsByUserId({ userId }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        return db.Object.find({
            deletedTree: false,
            userId: ObjectId(userId),
            $or: [{"waterEndTime": { "$gte": new Date()}}, {waterEndTime: null}],  //cây chưa chết do thiếu nước hoặc là cây Bitamin
        }).populate('item').select('-nid').lean();
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
        var treeDetail = await db.Object.findOne({ userId: ObjectId(userId), _id: ObjectId(objectId) }).populate('item').select('-nid').lean();
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
