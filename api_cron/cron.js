const cron = require("node-cron");
const rp = require('request-promise');
const _ = require('lodash');
const db = require('./db/db');
const config = require('./db/config');
const ObjectId = require('mongoose').Types.ObjectId;
const logger = require('./logger');
//service
const { createBitaminHistory, updateBitaminHistory } = require('./containers/bitamin/services/bitaminHistory');
const { rewardInterestBitamin } = require('./containers/bitamin/services/bitamin');

async function scheduler(){
    //development
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging'){
        console.log('====> Cron schedule start at', process.env.NODE_ENV);
        await profitTrees();

        cron.schedule("*/2 * * * *", async () => {
            console.log("Start profitTrees!!!");
            profitTrees();
        });

        cron.schedule("*/2 * * * *", () => {
            //check tree die every 5 mins
            checkTreeDies()
                .then(res => {
                    console.log('TEST: Check Trees Die!!!');
                })
                .catch(err => console.log({ err }));
        })
    } else if(process.env.NODE_ENV === 'production'){
        console.log('Cron schedule start at', process.env.NODE_ENV);
        //console.log('cron schedule start');
        cron.schedule("0 16 * * *", async () => {
            //profit
            console.log("Start profitTrees!!!");
            profitTrees();
        });

        cron.schedule("*/5 * * * *", () => {
            //check tree die every 5 mins
            checkTreeDies()
                .then(res => {
                    console.log('Check Trees Die!!!');
                })
                .catch(err => console.log({ err }));
        })
    }
}


function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };

async function updateProfitHistory({ items, historyId, txid, successes }, action) {
    try {
        let update;
        switch(action) {
            case 'create':
                update = await (new db.ProfitHistory({ items })).save();
                //console.log('update', action, update);
                break;
            case 'updateAfterPay':
                update = await db.ProfitHistory.updateOne(
                    { _id: historyId },
                    { $set: { txid, successes } },
                );
                break;
        }
        return update;
    } catch (e){
        console.log('Error createProfitHistory:', e);
        return;
    }
}

async function profitTrees(){
    //console.log('ProfitTrees start...');
    console.log('===========================================START===========================================');
    let curNid = -1;
    const MAX_NUMBER_NID = 1000;
    let arrPay = [];
    while(curNid){
        //nếu số lượng nid < số lượng lớn nhất => thêm
        if(arrPay.length < MAX_NUMBER_NID){
            //console.log('nid=', curNid);
            try {
                const findTree = await db.Object.findOne({nid: {$gt: curNid}, plantedTree: true, deletedTree: false, $or: [{"waterEndTime": {$gte: new Date()}}, {itemId: 'T10'}] }).sort({nid: 1});
                if(findTree && findTree.nid && findTree.nid > 0){
                    try {
                        let allTree = await db.Object.find({nid: findTree.nid, plantedTree: true, deletedTree: false, "waterEndTime": {$gte: new Date()} }).populate('item');
                        let objProfit = await calculatorProfitForOneUser({ nid: findTree.nid, findTrees: allTree });
                        arrPay.push(objProfit);
                        curNid = findTree.nid;
                    }catch(err){
                        console.log('BREAK: ', curNid);
                        curNid = null;
                        console.log({err});
                    }
                } else {
                    curNid = null;
                }
            } catch(e) {
                console.log('ERR: ', e);
                curNid = null;
            }
        } else {
            console.log('============> enoungh MAX_NUMBER_NID '+ MAX_NUMBER_NID +' <============');
            console.timeEnd('calculator 1000 user');

            await sentProfit(arrPay);
            //break;
            console.log('wait 2 seconds!!!')
            await sleep(2000);
            arrPay = [];
        }
    }
    if(arrPay.length > 0){
        console.log("============> not enoungh MAX_NUMBER_NID but can't found more nid<============");
        await sentProfit(arrPay);
        arrPay = [];
    }
    console.log('===========================================END===========================================');

}

async function adminSendMail({ fromName, toName, toId, title, content }) {
    let mail = { fromName, toName, toId, title, content, status: 0 };
    //
    let receiver = await db.UserMail.findOne({ userId: ObjectId(toId) });
    if (_.isNull(receiver)) {
        return (new db.UserMail({
            userId: ObjectId(toId),
            receivedList: [mail],
        })).save();
    } else {
        return db.UserMail.findOneAndUpdate({ userId: toId }, { $push: { receivedList: mail } }, { new: true });
    }
}

async function calculatorProfitForOneUser({ nid, findTrees }) {
    //tính lợi nhuận của từng cây
    let profitOfAllTrees = await Promise.all(findTrees.map(tree => checkAndGetProfitGold(tree)));
    //console.log('profitOfAllTrees', profitOfAllTrees);
    let profitEveryTree = profitOfAllTrees.map(profit => ({ _id: profit._id, gold: profit.gold }));
    //console.log('profitOfAllTrees', profitOfAllTrees);

    //tính tổng lãi suất của từng loại cây
    let sumGoldEveryTrees = Object.values(_.groupBy(profitOfAllTrees, 'itemId')).map(grpItem => {
        //console.log('grpItem', grpItem);
        return {
            'itemId': grpItem[0].itemId,
            'name_ko': grpItem[0].name_ko,
            'gold': grpItem.reduce((total, curItem) => total + curItem.gold, 0),
            'quantity': grpItem.length
        };
    });
    //console.log('sumGoldEveryTrees', sumGoldEveryTrees);
    let totalPrice = sumGoldEveryTrees.reduce((total, tree) => total + tree.gold, 0);

    //create mail content
    let mailContent = sumGoldEveryTrees.reduce((total, tree) => total + `<p>${tree.name_ko} x ${tree.quantity} : ${tree.gold.toFixed(5)}</p>`, '');
    mailContent += `<p>Total: ${totalPrice.toFixed(5)}</p>`;

    
    //============================bitamin==============================
    // bitamin
    const today_0h_0m_0s_0ms = parseInt(Date.now() / 1000 / 60 / 60 / 24) * 24 * 60 * 60 * 1000; // timestamp for only date. == new Date('YYYY-MM-DD').getTime();
    let groupBitamin = await db.Object.aggregate([
        {   $match: { itemId: 'T10', nid, plantedDate: {$lt: new Date(today_0h_0m_0s_0ms) } } },
            { $project: {
                _id: true,
                userId: true,
                itemId: true,
            }
        },{
            $lookup: {
                from: "items",
                localField: "itemId",
                foreignField: "itemId",
                as: "item",
            }
        },{
            $group: {
                _id: { userId: "$userId", itemId: "$itemId" },
                quantity: { $sum: 1 },
                totalBitamin: { $sum: 200 },
                item: { $first: { $arrayElemAt: ["$item", 0] } },
                treeIds: { $push: "$_id" }
            }
        }
    ]);
    //console.log('groupBitamin', groupBitamin[0] && groupBitamin[0]);
    const { _id, quantity, totalBitamin, item, treeIds } = groupBitamin[0] ? groupBitamin[0] : {};
    const checkHasBitaminTree = groupBitamin && groupBitamin[0] && _id && _id.userId && _id.itemId && quantity && totalBitamin && item && item.name_ko && treeIds;
    //console.log('checkHasBitaminTree', checkHasBitaminTree);
    mailContent += checkHasBitaminTree ? `<p>${item.name_ko} x ${quantity} : ${totalBitamin}</p>`+ `<p>Total Bitamin: ${parseFloat(totalBitamin.toFixed(5))}</p>` : '';
    //============================end bitamin==============================
    let objProfit = {
        sentAPI: { nid, amount: totalPrice*100000 },
        trees: sumGoldEveryTrees,
        mailContent,
        profitEveryTree,
        //Bitamin
        sendBitaminAPI: checkHasBitaminTree ? {nid, amount: totalBitamin, userId: _id.userId} : null,
        treeIds: treeIds || []
    };

    return objProfit;
}

async function checkAndGetProfitGold(treeObj) {
    const tree = treeObj;
    const nutrionalEndTimeLines = [];
    const profitNutritionals = [];

    for (let i = 1; i <= 4; i++) {
        //tạo 4 biến nutrionalEndTime vào param
        //tạo 4 biến profitNutrional vào param
        nutrionalEndTimeLines.push(tree['nutritionalEndTime' + i.toString()]);
        profitNutritionals.push(tree['profitNutritional' + i.toString()]);
    }

    let treeAfterCheckProfit = treeObj;
    let updateObj = getUpdateOptions(nutrionalEndTimeLines, profitNutritionals, tree.profitTotal);
    //console.log('updateObj', updateObj);
    if (updateObj.needUpdate && updateObj.updateOptions) {
        treeAfterCheckProfit = await db.Object.findByIdAndUpdate(tree._id, updateObj.updateOptions, { new: true });
    }

    //tree sau khi check profit
    let { profitTotal, landPrice, _id, userId } = treeAfterCheckProfit;
    // /console.log('treeObj', treeObj);
    let { name_ko, itemId } = treeObj.item;
    let gold = ((landPrice * profitTotal) / 100);
    //console.log('gold', gold);
    return { gold, _id, userId, name_ko, itemId, nid: treeObj.nid };
}

//local host test profit Bitamin
async function developmentSendBitamin({ bitaminItems }){
    let k = await Promise.all(bitaminItems.map(bItem => db.User.findOneAndUpdate({ nid: String(bItem.nid) }, { $inc: { bitamin: bItem.amount } }, { new: true })));
    return { successes: true, txid: "txid bitamin test in development!!!" };
}

//profitTrees
/*
arrPay = [{ sentAPI, trees }]
sentAPI = { nid, amount }
mailContent
*/
async function sentProfit(arrPay) {
    //console.log('arrPay', arrPay.map(pay => pay.mailContent));

    const items = arrPay.map(pay => pay.sentAPI);
    // console.log('items', items);

    console.time('sent API');
    // //console.log('create profit history');
    const profitHistory = await updateProfitHistory({ items }, 'create');
    //add history fail
    if(!profitHistory) return { status: false, result: null };
    console.log('1. create history success'/*, profitHistory*/);

    //sent profit
    console.log('items', items);
    const fItems = items.filter(item => item.amount > 0);
    const profit = process.env.NODE_ENV !== "development" ? await getProfitAPI({ items: fItems, key: profitHistory._id }) : { successes: true, txid: "txid test in development!!!" };
    //sent profit fail 
    if(!profit || !profit.successes || !profit.txid) return { status: false, result: null };
    console.log('2. pay profit success');
    
    await updateProfitHistory({ historyId: profitHistory._id, successes: profit.successes, txid: profit.txid }, 'updateAfterPay');
    


    console.log('3. update history after pay success!!!');
    console.timeEnd('sent API');


    // //==========================================================================Bitamin Process==========================================================================
    console.time('sent Bitamin API');
    const bitaminItems = arrPay.map(pay => pay.sendBitaminAPI).filter(payBitamin => payBitamin);
    //console.log('bitaminItems', bitaminItems);
    //create history SYSTEM_LOG with item will reward interest 
    const historyBitamin = await createBitaminHistory({ category: "SYSTEM_LOG", categoryDetail: "PROFIT", items: bitaminItems });
    if(!historyBitamin && !historyBitamin._id) return { status: false, result: null };
    console.log('4. create history bitamin SYSTEM_LOG');
    //rewardInterestBitamin sent to bitamin API
    //cr
    // const bitaminItemsX100000 = _.cloneDeep(bitaminItems).map(bItem => {
    //     bItem.amount = bItem.amount * 100000;
    //     return bItem;
    // });
    console.log('bitaminItems', bitaminItems);
    const profitBitamin = process.env.NODE_ENV !== "development" ? await rewardInterestBitamin({ items: bitaminItems, key: historyBitamin._id }) : await developmentSendBitamin({ bitaminItems });
    if(!profitBitamin || !profitBitamin.successes || !profitBitamin.txid) return { status: false, result: null };
    console.log('5. profit bitamin success');
    //updadate history SYSTEM_LOG with item will reward interest 
    await updateBitaminHistory({ action: 'afterRewardSuccess', historyId: historyBitamin._id, txid: profitBitamin.txid, status: true });
    console.log('6. update history bitamin SYSTEM_LOG success');
    console.timeEnd('sent Bitamin API');

    //create history for every user
    await Promise.all( bitaminItems.map(grpB => createBitaminHistory({ category: 'RECEIVE', categoryDetail: 'PROFIT', userId: grpB.userId, nid: grpB.nid, amount: grpB.amount, txid: profitBitamin.txid, status: true })) );
    console.log('7. update history bitamin for every user success');

    const arrTreeId1000User = arrPay.reduce((treeId1000, pay) => treeId1000.concat(pay.treeIds), []);
    //console.log('arrTreeId1000User', arrTreeId1000User);
    await db.Object.updateMany({ _id: { $in: arrTreeId1000User } }, { $inc: { distributedPrice: 200 }}, { new: true });
    console.log('7.2 update distributed price');
    //==========================================================================Bitamin Process==========================================================================


    //sent profit success
    try {
        
        //Gửi gold cho tất cả user
        //const sendGoldPromise = await Promise.all(arrPay.map(pay => addGoldBlood({ goldBlood: pay.sentAPI.amount/100000, nid: pay.sentAPI.nid }) ));
        //console.log('7. send Gold local success!!!'/*, await sendGoldPromise*/);
            
        //update distributeLastDate after buy
        console.time('update distributeLastDate');
        const arrNid = arrPay.map(pay => pay.sentAPI.nid);
        const updateDistributeLastDate = await db.Object.updateMany({ nid: { $in: arrNid } }, { $set: { distributeLastDate: new Date() }}, { new: true });
        console.log('8. update distributeLastDate success!!!');
        console.timeEnd('update distributeLastDate');


        //update distributedPrice
        console.time('update distributedPrice');
        let allProfitEveryTree = arrPay.reduce((totalTree, pay) => totalTree.concat(pay.profitEveryTree), []);
        console.log('9. allProfitEveryTree', allProfitEveryTree.length);
        let grpGold = Object.values(_.groupBy(allProfitEveryTree, 'gold'));
        let updateDistributedPriceOfTreePromise = await Promise.all(grpGold.map(grpG => {
            let gold = grpG[0].gold;
            let arrTreeId = grpG.map(gg => gg._id);
            return db.Object.updateMany({ _id: { $in: arrTreeId } }, { $inc: { distributedPrice: gold }}, { new: true });
        }));
        console.log('10. update distributedPrice success!!!');
        console.timeEnd('update distributedPrice');


        //send mail cho tất cả user
        console.time('send mail');
        const sendMailPromise = await Promise.all(arrPay.map(async pay => {
            try{
                const toUserName = await db.User.findOne({ nid: pay.sentAPI.nid }).lean();
                if(toUserName){
                    return await adminSendMail({
                        fromName: 'BLOODLAND',
                        toName: (typeof toUserName !=='undefined' && toUserName) ? toUserName.userName : '',
                        toId: toUserName._id,
                        title: '수확 알림',
                        content: pay.mailContent,
                    });
                }
            } catch (e){
                console.log(e);
            }
        }));
        console.log('11. send mail successes!!!'/*, await sendMailPromise*/);
        console.timeEnd('send mail');


        console.time('logged');
        var logData = { ...arrPay, date: new Date() };
        console.log("12. logged");
        logger.profit({ 'profit info': logData });
        console.timeEnd('logged');

    } catch(e){
        console.log(e);
        return { status: false, result: null };
    }
}

//update gold blood in 
async function addGoldBlood({ goldBlood, nid }) {
    if (typeof goldBlood !== 'undefined' && parseFloat(goldBlood) > 0 && typeof nid !== 'undefined' && nid) {
        let userUpdate = await db.User.findOne({ nid: String(nid) });
        if (!_.isNull(userUpdate)) {
            userUpdate.goldBlood += parseFloat(goldBlood);
            await userUpdate.save();
        }
    }
    const user = await db.User.findOne({nid: String(nid)});
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }

    return false;
}

async function getProfitAPI({ items, key }) {
    //console.log('items', items);
    //console.log('config', config);
    try {
        return rp({
            method: 'POST',
            uri: config.apiHost + '/api/reward-interest',
            body: {
                apikey: config.bloodAppId,
                items,
                key,
            },
            json: true
        })
        .then((parsedBody) => {
            console.log('getProfitAPI =>', parsedBody.successes);
            // console.log('Withdraw API =====> ', parsedBody);
            return parsedBody;
        }, error => console.error('Api Wallet Withdraw Error: ' + error.message));
    } catch(e) {
        console.log("getProfitFromServer", e);
    }
}

function checkTreeDies() {
    return db.Object.find({"waterEndTime": {"$lte": new Date()} }).lean()
        .then(trees => {
            for (let tree of trees) {
                logger.deadTrees({ ...tree, 'deadDate': new Date() });
            }
            return db.Object.deleteMany({
                "waterEndTime": {
                    "$lte": new Date()
                }
            })
        })
}


async function updateDistributedPriceOfTree({ gold, _id }) {
    try {
        return db.Object.updateMany({ _id }, {
            '$inc': {
                'distributedPrice': gold
            }
        }, { new: true })
    } catch (err) {
        return { err: err }
    }

}

//trả về obj để check xem tree này cần update và lấy ra options update
//nutrionalEndTimeLines - các thời gian kết thúc từng giai đoạn
//nutrionalProfits - lợi nhuận đã tăng của từng giai đoạn
//profitTotal, tổng lợi nhuận ( tính luôn thuốc )
function getUpdateOptions(nutrionalEndTimeLines, profitNutritionals, profitTotal) {

    var needUpdate = false;
    var updateOptions = {};
    var $set = {};
    var totalMinusProfit = 0;
    if (!_.isNull(nutrionalEndTimeLines[0])) {
        //nếu có thời gian kết thúc lần 1 khác null - tất có giá trị
        var nutritionalEndTime1 = new Date(nutrionalEndTimeLines[0]);
        var current = new Date();
        // console.log("current.getTime()", current.getTime());

        if (current.getTime() > nutritionalEndTime1.getTime() && profitNutritionals[0] !== 0) {
            //nếu lần 1 hết hạn 
            //trừ profit đi
            //chỉnh lại lợi nhuận lần 1 = 0;
            needUpdate = true;
            totalMinusProfit += profitNutritionals[0];
            $set['profitNutritional1'] = 0;
        }
    }
    if (!_.isNull(nutrionalEndTimeLines[1])) {
        //nếu có thời gian kết thúc lần 2 khác null - tất có giá trị
        var nutritionalEndTime2 = new Date(nutrionalEndTimeLines[1]);
        var current = new Date();

        if (current.getTime() > nutritionalEndTime2.getTime() && profitNutritionals[1] !== 0) {
            //nếu lần 2 hết hạn 
            //trừ profit đi
            //chỉnh lại lợi nhuận lần 2 = 0;
            needUpdate = true;
            totalMinusProfit += profitNutritionals[1];
            $set['profitNutritional2'] = 0;
        }
    }
    if (!_.isNull(nutrionalEndTimeLines[2])) {
        //nếu có thời gian kết thúc lần 3 khác null - tất có giá trị
        var nutritionalEndTime3 = new Date(nutrionalEndTimeLines[2]);
        var current = new Date();

        if (current.getTime() > nutritionalEndTime3.getTime()) {
            //nếu lần 3 hết hạn 
            //trừ profit đi
            //chỉnh lại lợi nhuận lần 3 = 0;
            needUpdate = true;
            totalMinusProfit += profitNutritionals[2];
            $set['profitNutritional3'] = 0;
        }
    }
    if (!_.isNull(nutrionalEndTimeLines[3]) && profitNutritionals[3] !== 0) {
        //nếu có thời gian kết thúc lần 4 khác null - tất có giá trị
        var nutritionalEndTime4 = new Date(nutrionalEndTimeLines[3]);
        var current = new Date();

        if (current.getTime() > nutritionalEndTime4.getTime()) {
            //nếu lần 4 hết hạn 
            //trừ profit đi
            //chỉnh lại lợi nhuận lần 4 = 0;
            needUpdate = true;
            totalMinusProfit += profitNutritionals[3];
            $set['profitNutritional4'] = 0;
        }
    }

    if (
        (_.isNull(nutrionalEndTimeLines[0]) && _.isNull(nutrionalEndTimeLines[1]) && _.isNull(nutrionalEndTimeLines[2]) && _.isNull(nutrionalEndTimeLines[3]))
        || (profitNutritionals[0] === 0 && profitNutritionals[1] === 0 && profitNutritionals[2] === 0 && profitNutritionals[3] === 0)
    ) {
        needUpdate = false;
        updateOptions = null;
        return { needUpdate, updateOptions };
    }


    updateOptions.$inc = { 'profitTotal': -1 * totalMinusProfit };
    updateOptions.$set = $set;

    return { needUpdate, updateOptions };
}


module.exports = {
    scheduler,
    developmentSendBitamin,
}