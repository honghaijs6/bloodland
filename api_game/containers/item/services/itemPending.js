const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isEmpty = require('lodash.isempty');
const Item = db.Item;

module.exports = {
    createItemPending,
    getItemPending,
    deleteItemPending,
    createBuyItemPending,
    getBuyItemPending,
    deleteBuyItemPending
};

async function createBuyItemPending( itemId, type, quantity) {
    try {
        // console.log("itemId, type, quantity",itemId, type, quantity);
        let result = await db.ItemPending.updateOne({ itemId:itemId.toString(), type: type }, {$inc: { quantity: quantity}}, { upsert: true, new: true });
        console.log('createBuyItemPending', result)
        return result;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}

async function getBuyItemPending( itemId, type ) {
    try {
        // console.log('===>>>>>getItemPending',itemId, type);
        let item = await db.ItemPending.findOne({ itemId, type });
        console.log('getBuyItemPending', item);
        return item;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}

async function deleteBuyItemPending( itemId, type, quantity ) {
    try {
        let delPending = await db.ItemPending.findOneAndUpdate({ itemId, type }, {$inc: {quantity: -quantity}}, { new: true } );
        //console.log('delPending', delPending);
        if(delPending.quantity === 0){
        	//console.log('deleted last');
        	delPending = await db.ItemPending.findOneAndDelete({ itemId, type });

        }
        console.log('deleteItemPending', delPending);
        return delPending;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}


//===========================================================================================================================
async function createItemPending({ itemId, nid, type, quantity=1 }) {
    try {
        let result = await db.ItemPending.updateOne({ itemId, nid, type }, {$inc: {quantity: quantity}}, { upsert: true });
        //console.log('createItemPending', result);
        return result;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}

async function getItemPending({ itemId, nid, type }) {
    try {
        let item = await db.ItemPending.findOne({ itemId, nid, type });
        //console.log('getItemPending', item);
        return item;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}

async function deleteItemPending({ itemId, nid, type, quantity=1 }) {
	//console.log('deleteItemPending', {itemId, nid, type, quantity})
    try {
        let delPending = await db.ItemPending.findOneAndUpdate({ itemId, nid, type }, {$inc: {quantity: -quantity}}, { new: true } );
        //console.log('delPending', delPending);
        if(delPending.quantity === 0){
        	//console.log('deleted last');
        	delPending = await db.ItemPending.findOneAndDelete({ itemId, nid, type });
        }
        //console.log('deleteItemPending', result);
        return delPending;
    } catch (e) {
    	console.log('Error: ', e);
        return;
    }
}