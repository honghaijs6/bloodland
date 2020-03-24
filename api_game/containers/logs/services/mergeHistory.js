const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isEmpty = require('lodash.isempty');
const Item = db.Item;

module.exports = {
    createMergeHistory,
    updateMergeHistory
};

//RandomBox
async function createMergeHistory({ nid, items }) {
    try {
        let insertData = await (new db.MergeHistory({ nid, items })).save();
        console.log('createMergeHistories', insertData);
        return insertData;
    } catch (e) {
        return;
    }
}

async function updateMergeHistory({ _id, nid, mergeItems }) {
    try {
        let updateData = await db.MergeHistory.findOneAndUpdate({ _id, nid }, { mergeItems, rspDate: new Date() }, { new: true });
        //console.log('updateMergeHistory', updateData);
        return updateData;
    } catch (e) {
        return;
    }
}