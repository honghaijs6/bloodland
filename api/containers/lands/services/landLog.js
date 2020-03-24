const db = require('../../../db/db');

module.exports = {
    updatePendingHistory,
    createLandChangePriceHistory,
    createLandRemoveSellHistory,
    createLandSellHistory,
    createLandBuyFailureHistory,
    createLandBuyFailureSystemHistory,
    createLandBuySuccessHistory,
    createLandPendingHistory,
    createAdminLandHistory,
};

async function updatePendingHistory({ quadKey, txid, payed, landPrice, buyerNid, sellerNid, refunded, selled, failed, error }, action) {
    const amount = Math.round(landPrice * 100000);
    //console.log('action', action, { quadKey, txid, payed, amount, buyerNid, sellerNid, refunded, selled, failed, error });
    try {
        let update;
        switch(action) {
            case 'create':
                update = await (new db.PendingHistory({ sellerNid, buyerNid, quadKey, amount })).save();
                //console.log('update', action, update);
                break;
            case 'updateAfterPay':
                update = await db.PendingHistory.findOneAndUpdate({ quadKey, buyerNid, sellerNid }, { '$set': { txid, payed, error } },{ new: true });
                //console.log('update', action, update);
                break;
            case 'updateAfterRefund':
                update = await db.PendingHistory.findOneAndUpdate({ quadKey, buyerNid, sellerNid },{ '$set': { refunded } },{ new: true });
                //console.log('update', action, update);
                break;
            case 'updateAfterFailed':
                update = await db.PendingHistory.findOneAndUpdate({ quadKey, buyerNid, sellerNid }, { '$set': { failed } },{ new: true });
                //console.log('update', action, update);
                break;
        }
        return update;
    } catch (e){
        console.log("updatePendingHistory failed!!", e);
        return;
    }
    return;
    //return (new db.LandChangePriceHistory({ success, sellerId, sellerNid, quadKey, price, amount })).save();
}

function createLandChangePriceHistory({ success, sellerId, sellerNid, quadKey, price }) {
    // console.log('createLandChangePriceHistory', { success, sellerId, sellerNid, quadKey, price });
    const amount = Math.round(price * 100000)
    return (new db.LandChangePriceHistory({ success, sellerId, sellerNid, quadKey, price, amount })).save();
}

function createLandRemoveSellHistory({ success, sellerId, sellerNid, quadKey, price }) {
    //console.log('createLandRemoveSellHistory', { success, sellerId, sellerNid, quadKey, price });
    const amount = Math.round(price * 100000)
    return (new db.LandRemoveSellHistory({ success, sellerId, sellerNid, quadKey, price, amount })).save();
}

function createLandSellHistory({ success, sellerId, sellerNid, quadKey, price }) {
    //console.log('createLandSellHistory', { success, sellerId, sellerNid, quadKey, price });
    //console.log("price",price);
    const amount = Math.round(price * 100000)
    //console.log("amount",amount);
    return (new db.LandSellHistory({ success, sellerId, sellerNid, quadKey, price, amount })).save();
}


function createLandBuyFailureHistory({ buyerNid, sellerNid, quantity, price, quadKey }){
    sellerNid = parseInt(sellerNid);
    //console.log('createLandBuyFailureHistory', { buyerNid, sellerNid, quantity, price, quadKey });
    const amount = Math.round(price * 100000)

    return (new db.LandBuyFailureHistory({ buyerNid, sellerNid, quantity, price, amount, quadKey })).save();
}

function createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity, price, quadKey, reason }){
    sellerNid = parseInt(sellerNid);
    //console.log('createLandBuyFailureHistory', { buyerNid, sellerNid, quantity, price, quadKey });
    const amount = Math.round(price * 100000)

    return (new db.LandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity, price, amount, quadKey, reason })).save();
}



function createLandBuySuccessHistory({ buyerNid, sellerNid, quantity, price, quadKey, txid }){
    //console.log('createLandBuySuccessHistory', { buyerNid, sellerNid, quantity, price, quadKey, txid });
    const amount = Math.round(price * 100000)
    return (new db.LandBuySuccessHistory({ buyerNid, sellerNid, quantity, price, amount, quadKey, txid })).save();
}

function createLandPendingHistory({ buyerNid, sellerNid, quantity, amount, quadKey, txid }){
    //console.log('createLandPendingHistory', { buyerNid, sellerNid, quantity, amount, quadKey });
    let newLandPendingHistory = new db.LandPendingHistory({ buyerNid, sellerNid, quantity, amount, quadKey });
    return newLandPendingHistory.save();
}

async function createAdminLandHistory({ type, quadKey, price, seller, buyer, nid }) {
    //console.log('createAdminLandHistory', type, quadKey, price, seller, buyer, nid );
    const newAdminHistory = new db.AdminLandHistory({ type, quadKey, price, seller, buyer, nid });
    return newAdminHistory.save();
}
