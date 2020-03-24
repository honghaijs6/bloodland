const db = require('../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');

module.exports = {
    changeTreeOwner
}

// async function changeTreeOwner({ quadKey, sellerId, buyerId, historyPrice }) {
//     console.log('changeTreeOwner', { quadKey, sellerId, buyerId, historyPrice });
//     try {
//         return await db.Object.findOneAndUpdate(
//             {   'quadKey': quadKey, 'userId': ObjectId(sellerId) },
//             {   '$set': {
//                     'userId': ObjectId(buyerId),
//                     'historyPrice': historyPrice
//                 }
//             },
//             { new: true }
//         );
//     } catch (err) {
//         return { err: err };
//     }
// }


async function changeTreeOwner({ quadKey, sellerId, buyerId, historyPrice }) {
    // console.log("quadKey, sellerId, buyerId, historyPrice",{quadKey, sellerId, buyerId, historyPrice});
    var currentDate = new Date();
    var days = 30;
    var after1MonthDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    try {
        const userInfo = await db.User.findById(buyerId).lean();
        // console.log("userInfo",userInfo);
        return db.Object
            .findOne({ 'quadKey': quadKey, 'userId': ObjectId(sellerId) })
            .then(tree => {
                // console.log("tree",tree);
                if(tree){
                    tree.userId = ObjectId(buyerId);
                    tree.nid = parseInt(userInfo.nid);
    
                    tree.distributedPrice = 0;
                    tree.historyPrice = historyPrice;
                   
                    tree.nutritionalStartTime1 = null;
                    tree.nutritionalStartTime2 = null;
                    tree.nutritionalStartTime3 = null;
                    tree.nutritionalStartTime4 = null;
                    tree.nutritionalEndTime1 = null;
                    tree.nutritionalEndTime2 = null;
                    tree.nutritionalEndTime3 = null;
                    tree.nutritionalEndTime4 = null;
                   
                    tree.profitNutritional1 = 0;
                    tree.profitNutritional2 = 0;
                    tree.profitNutritional3 = 0;
                    tree.profitNutritional4 = 0;
                    tree.profitTotal = tree.profit;
                    tree.limitUseNutritional = 2;
                   
                    tree.waterStartTime = currentDate;
                    tree.waterEndTime = after1MonthDate;
                    tree.createDateWater = currentDate;
                    
                    tree.save()
                        .then(res => { return res })
                        .catch(err => { return { err: err } })
                }else{
                    // console.log("no tree");
                }
               
            })
            .catch(err => {
                console.log("err",err);
                return { err: err }
             });
    } catch (err) {
        return { err: err };
    }
}