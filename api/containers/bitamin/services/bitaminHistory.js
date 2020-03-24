const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

module.exports = {
    createBitaminHistory,
    getBitaminHistory,
    updateBitaminHistory
};

//createBitaminHistory
async function createBitaminHistory({ category, categoryDetail, userId=null, nid=null, amount=null, items=null, status=false, txid=null, error=null }) {
    //console.log('createBitaminHistory', { category, categoryDetail, userId, nid, amount, items, status, error });
    try {
        const newBitaminHistory = await db.BitaminHistory.create({ category, categoryDetail, userId, nid, amount, items, status, txid, error });
        //console.log('newBitaminHistory', newBitaminHistory);
        return newBitaminHistory;
    } catch (e) {
        console.log('Error: ', e);
        return null;
    }
}


//createBitaminHistory
async function updateBitaminHistory({ action, historyId, userId, txid, nid, status=false, error="" }) {
    //console.log('updateBitaminHistory', { userId, nid, txid, status, error });
    try {
        switch (action) {
            case 'afterRewardSuccess':
                //{ action: "afterWithdrawSuccess", historyId: history._id, txid }
                const updateBitaminHistoryAfterRewardSuccess = await db.BitaminHistory.findOneAndUpdate({ _id: historyId },{ $set: { txid, status } }, { new: true });
                //console.log('updateBitaminHistoryAfterRewardSuccess', updateBitaminHistoryAfterRewardSuccess);
                return updateBitaminHistoryAfterRewardSuccess;
                break;
            case 'afterWithdrawSuccess':
                //{ action: "afterWithdrawSuccess", historyId: history._id, txid }
                const updateBitaminHistoryAfterWithdrawSuccess = await db.BitaminHistory.findOneAndUpdate({ _id: historyId },{ $set: { userId, nid, txid, status } }, { new: true });
                //console.log('updateBitaminHistoryAfterWithdrawSuccess', updateBitaminHistoryAfterWithdrawSuccess);
                return updateBitaminHistoryAfterWithdrawSuccess;
                break;
            default: //first create
                const updateBitaminHistory = await db.BitaminHistory.findOneAndUpdate({ _id: historyId },{ $set: { userId, nid, error } }, { new: true });
                //console.log('updateBitaminHistory', updateBitaminHistory);
                return updateBitaminHistory;
                break;
        }
    } catch (e) {
        console.log('Error: ', e);
        return null;
    }
}


async function getBitaminHistory({ userId, category,offsetNumber }) {
    try {
        const offset = offsetNumber * 50;
        // const bitaminHistories = await db.BitaminHistory.find({ userId, category }).sort({"createdAt" : -1}).skip(offset).limit(50).lean();
        const bitaminHistories = await db.BitaminHistory.find({ userId, category }).sort({"createdAt" : -1}).skip(offset).limit(50).lean();
        return bitaminHistories;
    } catch (e) {
        console.log('Error: ', e);
        return null;
    }
}