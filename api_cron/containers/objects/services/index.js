const db = require('../../../db/db');

const ObjectId = require('mongoose').Types.ObjectId;


module.exports = {
    changeTreeOwner,
    setTreeDies,
    profitTrees
};

async function profitTrees() {
    return require('../../../helpers/cron')();
}


async function changeTreeOwner({ quadKey, sellerId, buyerId, historyPrice }) {
    try {
        return await db.Object.findOneAndUpdate(
            {
                'quadKey': quadKey, 'userId': ObjectId(sellerId)
            },
            {
                '$set': {
                    'userId': ObjectId(buyerId),
                    'historyPrice': historyPrice
                }
            },
            {
                new: true
            }
        );
    } catch (err) {
        return { err: err };
    }
}

async function setTreeDies(trees) {
    try {
        var result = await db.Object.updateMany(
            {
                '_id': { $in: trees }
            },
            {
                $set: { 'deletedTree': true, 'deletedDate': Date.now() }
            },
            { new: true }
        );
        return { status: true, result: result }
    } catch (err) {
        return { status: false, result: null }
    }
}



