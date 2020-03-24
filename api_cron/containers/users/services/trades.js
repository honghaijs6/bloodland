const rp = require('request-promise');
const db = require('../../../db/db');
const config = require('../../../db/config');
const ObjectId = require('mongoose').Types.ObjectId;
const isEmpty = require('lodash.isempty');
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');
const Land23 = db.Land23;
const itemService = require('../../inventories/services/items');
const characterService = require('../../inventories/services/characters');
const User = db.User;
const UserTrade = db.UserTrade;
const LandPending = db.LandPending;
const LandPendingHistory = db.LandPendingHistory;
const mailsSerivice = require('../../users/services/mails');

const land23Service = require('../../lands/services/indexNew');
const landLogService = require('../../lands/services/landLog');

module.exports = {
    getGoldBlood,
    addGoldBlood,
    useGoldBlood,
    coinToWallet,
    walletToCoin,
    checkWToken,
    buyCharacterItemInShop,
    getBalance,
    getWithdraw,
    getPay,
    getRewardInterest,
    getWalletInfo,
    transferBlood,
    purchaseLands,
    removeLandPending
};

async function updateToken(wToken) {
    let email = await rp({
        method: 'POST',
        uri: 'https://api.wallet.blood.land/api/me',
        body: {
            appId: config.bloodAppId,
            token: wToken,
        },
        json: true
    })
        .then(function (parsedBody) {
            return typeof parsedBody.user.email !== 'undefined' ? parsedBody.user.email : '';
        }, error => {
            console.error('Api Profile Error: ' + error.message);
            return '';
        });

    if (email !== '') {
        await User.findOneAndUpdate({ email: email }, { $set: { updatedDate: new Date() } }, { new: true });
    }
}

async function getGoldBlood(param) {
    const user = await User.findOne(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

//param = { goldBlood, userId }
async function addGoldBlood(param) {
    if (typeof param.goldBlood !== 'undefined' && parseFloat(param.goldBlood) > 0 && typeof param.userId !== 'undefined' && param.userId) {
        let userUpdate = await User.findById(ObjectId(param.userId));
        if (!isNull(userUpdate)) {
            userUpdate.goldBlood += parseFloat(param.goldBlood);
            await userUpdate.save();
        }
    }
    const user = await User.findById(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }

    return false;
}

//param = { userId, userIdReceive, goldBlood }
async function useGoldBlood(param) {
    if (typeof param.goldBlood !== 'undefined' && parseFloat(param.goldBlood) > 0 && typeof param.userId !== 'undefined' && param.userId) {
        let userUpdate = await User.findById(ObjectId(param.userId));
        if (!isNull(userUpdate)) {
            userUpdate.goldBlood -= parseFloat(param.goldBlood);
            await userUpdate.save();

            if (param.userIdReceive) {
                let userReceive = await User.findById(ObjectId(param.userIdReceive));
                if (!isNull(userReceive)) {
                    userReceive.goldBlood += parseFloat(param.goldBlood);
                    await userReceive.save();
                }
            }
        }
    }

    const user = await User.findById(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

// transferInfo = { userId, receiver, goldBlood, item, act };
async function saveHistoryUser(transferInfo, transferResponse) {
    //act: buy, sell, transfer, receive, buyInShop, recieveInShop
    const { userId, userIdReceive, goldBlood, item, act } = transferInfo;
    if (!transferResponse) {
        const newUserTransferError = new UserTrade({
            userId: userId,
            traderId: userIdReceive,
            amount: parseFloat(goldBlood),
            act: act[0],
            item,
            status: false,
        });
        return await newUserTransferError.save();
    }
    const newUserTransfer = new UserTrade({
        userId: userId,
        traderId: userIdReceive,
        amount: parseFloat(goldBlood),
        act: act[0],
        item,
        status: true
    });

    //buy in Shop
    if (userIdReceive) {
        const newUserReceive = new UserTrade({
            userId: userIdReceive,
            traderId: userId,
            amount: parseFloat(goldBlood),
            act: act[1],
            item,
            status: true
        });
        const arrPm = await Promise.all([newUserReceive.save(), newUserTransfer.save()]);
        return arrPm[0].toObject();
    }
    return (await newUserTransfer.save()).toObject();
}

async function coinToWallet(param) {
    if (typeof param.goldBlood !== 'undefined' && parseFloat(param.goldBlood) > 0 && typeof param.email !== 'undefined' && param.email) {
        let userUpdate = await User.findById(ObjectId(param.userId));
        if (!isNull(userUpdate)) {
            userUpdate.goldBlood -= parseFloat(param.goldBlood);
            await userUpdate.save();
        }
    }

    const user = await User.findById(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

async function walletToCoin(param) {
    if (typeof param.goldBlood !== 'undefined' && parseFloat(param.goldBlood) > 0 && typeof param.email !== 'undefined' && param.email) {
        let userUpdate = await User.findById(ObjectId(param.userId));
        if (!isNull(userUpdate)) {
            userUpdate.goldBlood += parseFloat(param.goldBlood);
            await userUpdate.save();
        }
    }

    const user = await User.findById(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

async function buyCharacterItemInShop(dataBuy) {
    const paramName = typeof dataBuy['items'] !== 'undefined' ? 'items' : 'characters';
    const { typeCode, amount, price } = dataBuy[paramName][0];
    let transferResponse = {};
    const transferInfo = {
        userId: dataBuy.user._id,
        userIdReceive: null,
        goldBlood: amount * price,
        act: ['buyInShop', 'santaReceive'],
        item: 'gold',
    };
    if (config.devPlace !== 'localhost') {
        let getPayApi = 'free item';
        if (price > 0) {
            let items = [{
                sellerNid: 0,
                name: typeCode,
                category: 'bloodland:shop',
                quantity: amount,
                amount: Math.round(amount * price * 100000),
                quadkey: null,
            }];

            let dataApiTransfer = { wToken: dataBuy.user.wToken, nid: dataBuy.user.nid, items: items };
            getPayApi = await getPay(dataApiTransfer);
        }

        if (getPayApi === 'free item' || (typeof getPayApi !== 'undefined' && getPayApi.successes && getPayApi.txid !== '')) {
            transferResponse = await useGoldBlood(transferInfo);
        }
    } else {
        transferResponse = await useGoldBlood(transferInfo);
    }

    if (!isEmpty(transferResponse)) {
        const saveHistory = await saveHistoryUser(transferInfo, transferResponse);
        if (!saveHistory.status) return saveHistory;

        const addObject = dataBuy.category === 'characters' ? await characterService.add(dataBuy) : await itemService.add(dataBuy);
        return addObject ? { status: true, inventory: addObject, walletInfo: transferResponse } : { status: false, error: "데이터베이스에 가게를 살 수 없다!!!" };
    }
    return { status: false, error: "데이터베이스에 가게를 살 수 없다!!!" };
}

async function purchaseLands(param) {
    let { transferBloods, buyLands } = param;
    if (!Array.isArray(transferBloods)) return { success: false };
    var buyerNid = buyLands.nid;
    let grpTransferBloods = Object.values(groupBy(transferBloods, 'receiver')).map(grpTransfer => {
        let transfer = { ...grpTransfer[0] };
        transfer.amount = grpTransfer.reduce((sumAmount, transfer) => sumAmount + transfer.amount, 0);
        transfer.quadKeys = grpTransfer.reduce((arrQK, transfer) => arrQK.concat({ landPrice: transfer.amount, quadKey: transfer.quadKey }), []);
        if (transfer.quadKey) delete transfer.quadKey;
        return transfer;
    });
    if (config.devPlace !== 'localhost') {
        if (buyLands.userRole === 'manager') {
            var sellers = [buyLands.userId];
            var acceptQuadKeys = [];
            var noAcceptQuadKeys = [];

            for (let objTransfer of grpTransferBloods) {
                for (let item of objTransfer.quadKeys) {
                    var checkLandSold = await Land23.findOne({ 'quadKey': item.quadKey, 'forSaleStatus': false });
                    if (!isNull(checkLandSold)) {
                        noAcceptQuadKeys.push(item.quadKey);
                    } else {
                        acceptQuadKeys.push(item.quadKey);
                    }
                }
            }

            if (acceptQuadKeys.length > 0) {
                var totalNoAcceptBuyLands = [];
                var arrBuyLand = [];
                for (let objTransfer of grpTransferBloods) {
                    var objBuyLand = {
                        userRole: buyLands.userRole,
                        userId: buyLands.userId,
                        nid: buyLands.nid,
                        wId: buyLands.wId,
                        name: buyLands.name,
                        quadKeys: objTransfer.quadKeys,
                        categoryName: buyLands.categoryName,
                        buyMode: buyLands.buyMode,
                    };
                    objBuyLand.quadKeys = objBuyLand.quadKeys.filter(q => acceptQuadKeys.includes(q.quadKey));
                    if (objBuyLand.quadKeys.length > 0) {
                        let saveHistory = {
                            state: false,
                            status: false
                        };
                        let purchaseResult = await land23Service.purchaseLand23(objBuyLand);

                        if (purchaseResult.updates.length > 0) {
                            let totalGoldBlood = purchaseResult.updates.reduce((accu, curr) => {
                                let _landPrice = objBuyLand.quadKeys.find(q => q.quadKey === curr.quadKey).landPrice;
                                return accu + _landPrice
                            }, 0);

                            let transferInfo = {
                                userId: objTransfer.sender,
                                userIdReceive: objTransfer.receiver,
                                goldBlood: totalGoldBlood,
                                act: ['buy', 'sell'],
                                item: 'gold',
                            };

                            let transferResponse = await useGoldBlood(transferInfo);
                            saveHistory = await saveHistoryUser(transferInfo, transferResponse);
                            if (typeof saveHistory === 'undefined' || !saveHistory.status) {
                                arrBuyLand.push({ ...saveHistory, ...{ success: saveHistory.state, updates: [] } });
                            } else {
                                arrBuyLand.push(purchaseResult);
                            }
                        }
                    }

                    totalNoAcceptBuyLands = totalNoAcceptBuyLands.concat(noAcceptQuadKeys);
                }

                let updates = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.updates), []);

                let buyFailure = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.buyFailure), []);
                let walletInfos = await Promise.all(sellers.map(seller => getGoldBlood({ userId: seller })));
                let buyFromSystemGiveAGift = arrBuyLand.reduce((arrGiveAGift, buyLand) => arrGiveAGift.concat(buyLand.buyFromSystem), []);

                buyFailure = buyFailure.concat(totalNoAcceptBuyLands);
                return { success: updates.length > 0, updates, walletInfos, buyFailure, buyFromSystemGiveAGift };
            }

            const walletInfo = await getGoldBlood({ userId: buyLands.userId });
            return { success: false, updates: [], walletInfos: walletInfo, buyFailure: [], buyFromSystemGiveAGift: [] }
        }
        
        var items = [];
        var sellers = [buyLands.userId];
        var acceptQuadKeys = [];
        var noAcceptQuadKeys = [];

        for (let objTransfer of grpTransferBloods) {
            var sellerNid = objTransfer.receivernId || 0;
            for (let item of objTransfer.quadKeys) {
                let landPending = await LandPending.findOne({ quadKey: item.quadKey });
                if (isNull(landPending)) {







                    // let newLandPendingHistory = new LandPendingHistory({
                    //     buyerNid: buyLands.nid,
                    //     sellerNid: objTransfer.receivernId,
                    //     name: 'land',
                    //     category: 'bloodland:land',
                    //     quantity: 1,
                    //     amount: Math.round(item.landPrice * 100000),
                    //     quadKey: item.quadKey,
                        
                    // });
                    // await newLandPending.save();
                    // await newLandPendingHistory.save();

                    // //những quadkey được phép mua
                    // acceptQuadKeys.push(item.quadKey);




                    var newLandPending = new LandPending({
                        buyerNid: buyerNid,
                        sellerNid: sellerNid,
                        name: 'land',
                        category: 'bloodland:land',
                        quantity: 1,
                        amount: Math.round(item.landPrice * 100000),
                        quadKey: item.quadKey
                    });
                    try {
                        let newLandPendingHistory = new LandPendingHistory({
                            buyerNid: buyerNid,
                            sellerNid: sellerNid,
                            name: 'land',
                            category: 'bloodland:land',
                            quantity: 1,
                            amount: Math.round(item.landPrice * 100000),
                            quadKey: item.quadKey,
                            txid: getPayApi.txid
                        });
                        await newLandPending.save();
                        await newLandPendingHistory.save();

                        let getLandPending = await LandPending.findOne({ quadKey: item.quadKey, buyerNid: buyerNid, sellerNid: sellerNid });

                        if (!isNull(getLandPending) && item.landPrice > 0) {
                            var checkLandSold = await Land23.findOne({ 'quadKey': item.quadKey, 'forSaleStatus': false });
                            if (!isNull(checkLandSold)) {
                                noAcceptQuadKeys.push(item.quadKey);
                                await LandPending.findOneAndRemove({ quadKey: item.quadKey, buyerNid: buyerNid });
                            }
                            else if(sellerNid === 0)
                            {
                                items.push({
                                    sellerNid: sellerNid,
                                    name: 'land',
                                    category: 'bloodland:land',
                                    quantity: 1,
                                    amount: Math.round(item.landPrice * 100000),
                                    quadkey: item.quadKey
                                });
                                acceptQuadKeys.push(item.quadKey);
                            }
                            else
                            {
                                var checkLandSoldChangePrice = await Land23.findOne({ 'quadKey': item.quadKey, 'forSaleStatus': true, 'sellPrice': item.landPrice });
                                if (!isNull(checkLandSoldChangePrice)) {
                                    items.push({
                                        sellerNid: sellerNid,
                                        name: 'land',
                                        category: 'bloodland:land',
                                        quantity: 1,
                                        amount: Math.round(item.landPrice * 100000),
                                        quadkey: item.quadKey
                                    });
                                    acceptQuadKeys.push(item.quadKey);
                                } else {
                                    noAcceptQuadKeys.push(item.quadKey);
                                    await LandPending.findOneAndRemove({ quadKey: item.quadKey, buyerNid: buyerNid });
                                }
                            }
                        }

                    } catch (err) {
                        console.log('err', err);
                        noAcceptQuadKeys.push(item.quadKey);
                    }
                } else {
                    noAcceptQuadKeys.push(item.quadKey);
                }
            }
        }
        var getPayApi = '';
        if (acceptQuadKeys.length > 0) {
            let dataApiTransfer = { wToken: buyLands.wToken, nid: buyLands.nid, items: items };
            getPayApi = await getPay(dataApiTransfer);

            if ((typeof getPayApi !== 'undefined' && getPayApi !== '' && getPayApi.successes && getPayApi.txid !== '')) {
                var totalNoAcceptBuyLands = [];
                var arrBuyLand = [];
                var allPendingLands = [];
                for (let objTransfer of grpTransferBloods) {
                    var objBuyLand = {
                        userRole: buyLands.userRole,
                        userId: buyLands.userId,
                        nid: buyLands.nid,
                        wId: buyLands.wId,
                        name: buyLands.name,
                        quadKeys: objTransfer.quadKeys,
                        categoryName: buyLands.categoryName,
                        buyMode: buyLands.buyMode,
                        txid: getPayApi.txid,
                        sellerNid: objTransfer.receivernId,
                    };
                    objBuyLand.quadKeys = objBuyLand.quadKeys.filter(q => acceptQuadKeys.includes(q.quadKey));
                    let acceptBuyQkeys = objBuyLand.quadKeys.map(q => q.quadKey);
                    allPendingLands = allPendingLands.concat(acceptBuyQkeys);
                    if (objBuyLand.quadKeys.length > 0) {
                        let saveHistory = {
                            state: false,
                            status: false
                        };
                        let purchaseResult = await land23Service.purchaseLand23(objBuyLand);

                        if (purchaseResult.updates.length > 0) {
                            //mua thanh cong xong cung~ xoa'
                            allPendingLands = allPendingLands.concat(purchaseResult.updates.map(q => q.quadKey));

                            let totalGoldBlood = purchaseResult.updates.reduce((accu, curr) => {
                                let _landPrice = objBuyLand.quadKeys.find(q => q.quadKey === curr.quadKey).landPrice;
                                return accu + _landPrice
                            }, 0);

                            let transferInfo = {
                                userId: objTransfer.sender,
                                userIdReceive: objTransfer.receiver,
                                goldBlood: totalGoldBlood,
                                act: ['buy', 'sell'],
                                item: 'gold',
                            };

                            let transferResponse = await useGoldBlood(transferInfo);
                            saveHistory = await saveHistoryUser(transferInfo, transferResponse);

                            if (typeof objTransfer.receiver !== 'undefined' && objTransfer.receiver && objTransfer.receiver !== null) {
                                const toUserName = await User.findById(objTransfer.receiver).lean();
                                await mailsSerivice.adminSendMail({
                                    fromName: 'Blood land',
                                    toName: toUserName.userName,
                                    toId: objTransfer.receiver,
                                    title: '판매 알림',
                                    content: `<p>${purchaseResult.updates.length} 개의 랜드가 판매되어 ${totalGoldBlood} 블러드가 지급되었습니다.</p>`
                                });
                            }


                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });

                            if (typeof saveHistory === 'undefined' || !saveHistory.status) {
                                arrBuyLand.push({ ...saveHistory, ...{ success: saveHistory.state, updates: [] } });
                            } else {
                                arrBuyLand.push(purchaseResult);
                            }

                        } else {
                            //mua fail cung~ xoa'
                            allPendingLands = allPendingLands.concat(purchaseResult.buyFailure.map(q => q.quadKey));
                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });
                        }
                    }

                    totalNoAcceptBuyLands = totalNoAcceptBuyLands.concat(noAcceptQuadKeys);
                    await Land23.updateMany({ quadKey: { $in: acceptQuadKeys } }, { $set: { txid: getPayApi.txid } });
                }

                let updates = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.updates), []);
                let buyFailure = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.buyFailure), []);
                let walletInfos = await Promise.all(sellers.map(seller => getGoldBlood({ userId: seller })));
                let buyFromSystemGiveAGift = arrBuyLand.reduce((arrGiveAGift, buyLand) => arrGiveAGift.concat(buyLand.buyFromSystem), []);

                //ghép lại những land mua thất bại và những land đang pending
                buyFailure = buyFailure.concat(totalNoAcceptBuyLands);
                return { success: updates.length > 0, updates, walletInfos, buyFailure, buyFromSystemGiveAGift };
            } else {
                //xoa pending neu mua that bai
                await LandPending.deleteMany({ quadKey: { $in: acceptQuadKeys } });
            }
        }
        const walletInfo = await getGoldBlood({ userId: buyLands.userId });
        return { success: false, updates: [], walletInfos: walletInfo, buyFailure: [], buyFromSystemGiveAGift: [] }
    } else { //==================================================================================================================================LOCALHOST==============================
        //console.log('localhost')
        let getPayApi = { txid: "txid in localhost", successes: true };
        let sellers = [buyLands.userId];
        let acceptQuadKeys = [];
        let noAcceptQuadKeys = [];
        for (let objTransfer of grpTransferBloods) {
            for (let item of objTransfer.quadKeys) {
                let landPending = await LandPending.findOne({ quadKey: item.quadKey });
                if (isNull(landPending)) {
                    //console.log('buyLands.nid', buyLands.nid);
                    //console.log('objTransfer.receivernId', objTransfer.receivernId);
                    let newLandPending = new LandPending({
                        buyerNid: buyLands.nid,
                        sellerNid: objTransfer.receivernId,
                        name: 'land',
                        category: 'bloodland:land',
                        quantity: 1,
                        amount: Math.round(item.landPrice * 100000),
                        quadKey: item.quadKey,
                    });

                    let newLandPendingHistory = new LandPendingHistory({
                        buyerNid: buyLands.nid,
                        sellerNid: objTransfer.receivernId,
                        name: 'land',
                        category: 'bloodland:land',
                        quantity: 1,
                        amount: Math.round(item.landPrice * 100000),
                        quadKey: item.quadKey,
                        txid: getPayApi.txid
                    });
                    await newLandPending.save();
                    await newLandPendingHistory.save();

                    //những quadkey được phép mua
                    acceptQuadKeys.push(item.quadKey);
                } else {
                    //những quadkey ko đc phép mua ( đang pending)
                    noAcceptQuadKeys.push(item.quadKey);
                    landLogService.createLandBuyFailureHistory({ buyerNid: buyLands.nid, sellerNid: objTransfer.receivernId, quantity: 1, price: item.landPrice, quadKey: item.quadKey });
                }
            }
        }
        if (acceptQuadKeys.length > 0) {
            // let dataApiTransfer = { wToken: buyLands.wToken, nid: buyLands.nid, items: items };
            // getPayApi = await getPay(dataApiTransfer);
            
            if ((typeof getPayApi !== 'undefined' && getPayApi !== '' && getPayApi.successes && getPayApi.txid !== '')) {
                var totalNoAcceptBuyLands = [];
                var arrBuyLand = [];
                var allPendingLands = [];
                for (let objTransfer of grpTransferBloods) {

                    var objBuyLand = {
                        userRole: buyLands.userRole,
                        userId: buyLands.userId,
                        nid: buyLands.nid,
                        wId: buyLands.wId,
                        name: buyLands.name,
                        quadKeys: objTransfer.quadKeys,
                        categoryName: buyLands.categoryName,
                        buyMode: buyLands.buyMode,
                        txid: getPayApi.txid,
                        sellerNid: objTransfer.receivernId,
                    };

                    //lọc ra những land được phép mua
                    objBuyLand.quadKeys = objBuyLand.quadKeys.filter(q => acceptQuadKeys.includes(q.quadKey));

                    let acceptBuyQkeys = objBuyLand.quadKeys.map(q => q.quadKey);
                    allPendingLands = allPendingLands.concat(acceptBuyQkeys);

                    if (objBuyLand.quadKeys.length > 0) {
                        let saveHistory = {
                            state: false,
                            status: false
                        };
                        let purchaseResult = await land23Service.purchaseLand23(objBuyLand);
                        if (purchaseResult.updates.length > 0) {
                            //mua thanh cong xong cung~ xoa'
                            allPendingLands = allPendingLands.concat(purchaseResult.updates.map(q => q.quadKey));

                            // let effectQkeys = purchaseResult.update

                            let totalGoldBlood = purchaseResult.updates.reduce((accu, curr) => {
                                let _landPrice = objBuyLand.quadKeys.find(q => q.quadKey === curr.quadKey).landPrice;
                                return accu + _landPrice
                            }, 0);

                            let transferInfo = {
                                userId: objTransfer.sender,
                                userIdReceive: objTransfer.receiver,
                                goldBlood: totalGoldBlood,
                                act: ['buy', 'sell'],
                                item: 'gold',
                            };

                            // console.log("taotalGoldBlood -> ",totalGoldBlood);
                            let transferResponse = await useGoldBlood(transferInfo);
                            saveHistory = await saveHistoryUser(transferInfo, transferResponse);

                            if (typeof objTransfer.receiver !== 'undefined' && objTransfer.receiver && objTransfer.receiver !== null) {
                                const toUserName = await User.findById(objTransfer.receiver).lean();
                                await mailsSerivice.adminSendMail({
                                    fromName: 'Blood land',
                                    toName: toUserName.userName,
                                    toId: objTransfer.receiver,
                                    title: '판매 알림',
                                    content: `<p>${purchaseResult.updates.length} 개의 랜드가 판매되어 ${totalGoldBlood} 블러드가 지급되었습니다.</p>`
                                });
                            }

                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });

                            if (typeof saveHistory === 'undefined' || !saveHistory.status) {
                                arrBuyLand.push({ ...saveHistory, ...{ success: saveHistory.state, updates: [] } });
                            } else {
                                arrBuyLand.push(purchaseResult);
                            }

                        } else {
                            //mua fail cung~ xoa'
                            allPendingLands = allPendingLands.concat(purchaseResult.buyFailure.map(q => q.quadKey));
                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });
                        }
                    }

                    totalNoAcceptBuyLands = totalNoAcceptBuyLands.concat(noAcceptQuadKeys);
                    await Land23.updateMany({ quadKey: { $in: acceptQuadKeys } }, { $set: { txid: getPayApi.txid } });
                }

                let updates = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.updates), []);
                //console.log('updates', updates);
                let buyFailure = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.buyFailure), []);
                let walletInfos = await Promise.all(sellers.map(seller => getGoldBlood({ userId: seller })));
                let buyFromSystemGiveAGift = arrBuyLand.reduce((arrGiveAGift, buyLand) => arrGiveAGift.concat(buyLand.buyFromSystem), []);

                //ghép lại những land mua thất bại và những land đang pending
                buyFailure = buyFailure.concat(totalNoAcceptBuyLands);
                //console.log('buyFailure', buyFailure);
                return { success: updates.length > 0, updates, walletInfos, buyFailure, buyFromSystemGiveAGift };
            } else {
                //xoa pending neu mua that bai
                await LandPending.deleteMany({ quadKey: { $in: acceptQuadKeys } });
            }
        }

        const walletInfo = await getGoldBlood({ userId: buyLands.userId });
        return { success: false, updates: [], walletInfos: walletInfo, buyFailure: [], buyFromSystemGiveAGift: [] }
    }
}

async function removeLandPending() {
    const LandPending = db.LandPending;
    await LandPending.deleteMany();
}

async function transferBlood(param) {
    const transferInfo = {
        token: param.token,
        sender: param.sender,
        receiver: param.receiver,
        amount: param.amount,
        item: 'blood',
        act: ['transfer', 'receive'],
    };
    const transferResponse = await transferBloodWallet(transferInfo);
    return await saveHistoryTransferBlood(transferInfo, transferResponse);
}

// param: nid ==> response: { successes: true, balance: 0, message: 'successes' }
async function getBalance(param) {
    await updateToken(param.wToken);
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/balance',
        body: {
            apikey: config.bloodAppId,
            token: param.wToken,
            nid: param.nid,
        },
        json: true
    })
        .then(function (parsedBody) {
            // console.log('Balance API =====> ', parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Balance Error: ' + error.message);
        });
}

// param: nid, amount ==> response: { successes: true, balance: 0, txid: '#####################' }
async function getWithdraw(param) {
    // console.log('param',param);
    await updateToken(param.wToken);
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/withdraw',
        body: {
            apikey: config.bloodAppId,
            token: param.wToken,
            nid: param.nid,
            address: param.mainWalletAddress,
            amount: Math.round(param.amount * 100000),
        },
        json: true
    })
        .then(function (parsedBody) {
            // console.log('Withdraw API =====> ',parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Withdraw Error: ' + error.message);
        });
}

// param: nid, items ==> response: { successes: true, balance: 0, txid: '#####################' }
async function getPay(param) {
    // console.log(' -------------------> Pay API Request =====> ',JSON.stringify({
    //     method: 'POST',
    //     uri: config.apiHost + '/api/pay',
    //     body: {
    //         apikey: config.bloodAppId,
    //         token: param.wToken,
    //         nid: param.nid,
    //         items: param.items
    //     },
    //     json: true
    // }));
    await updateToken(param.wToken);
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/pay',
        body: {
            apikey: config.bloodAppId,
            token: param.wToken,
            nid: param.nid,
            items: param.items
        },
        json: true
    })
        .then(function (parsedBody) {
            // console.log(' -------------------> Pay API Response =====> ',parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Pay Error: ' + error.message);
        });
}

// items: array (nid, amount)
// param: nid, items ==> response: { successes: true, balance: 0, txid: '#####################' }
async function getRewardInterest(param) {
    // console.log('----------------------> Reward Interest API Request =====> ', JSON.stringify({
    //     method: 'POST',
    //     uri: config.apiHost + '/api/reward-interest',
    //     body: {
    //         apikey: config.bloodAppId,
    //         key: param.key,
    //         items: param.items
    //     },
    //     json: true
    // }));
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/reward-interest',
        body: {
            apikey: config.bloodAppId,
            key: param.key,
            items: param.items
        },
        json: true
    })
        .then(function (parsedBody) {
            console.log('----------------------> Reward Interest API Response =====> ', parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Reward Interest Error: ' + error.message);
        });
}

async function getWalletInfo(param) {
    if (config.devPlace !== 'localhost') {
        let goldBalance = await getBalance(param);

        //let goldWithdraw = await getWithdraw({wToken: param.wToken, nid: param.nid, amount: 110});
        //console.log('Withdraw =============> ',goldWithdraw);

        if (typeof goldBalance !== 'undefined' && goldBalance && goldBalance.successes && parseFloat(goldBalance.balance) > 0 && typeof param.email !== 'undefined' && param.email) {
            let goldBalanceCost = parseFloat(goldBalance.balance / 100000);
            await User.findOneAndUpdate({ email: param.email }, { $set: { goldBlood: goldBalanceCost } }, { new: true });
        }
    }

    const user = await User.findOne({ email: param.email });

    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

async function checkWToken(wToken) {
    return rp({
        method: 'POST',
        uri: 'https://api.wallet.blood.land/api/wallet',
        body: {
            appId: config.bloodAppId,
            token: wToken,
        },
        json: true
    })
        .then(function (parsedBody) {
            return parsedBody
        }, error => {
            //console.error('Api Wallet Error: ' + error.message);
            return { successes: false, error: error };
        });
}

//return transfer Blood { successes: true/false, error: 'invalidToken' }
async function transferBloodWallet(transferInfo) {
    const { token, sender, receiver, amount, item, act } = transferInfo;
    return rp({
        method: 'POST',
        uri: 'https://api.wallet.blood.land/api/send',
        body: {
            appId: config.bloodAppId,
            token,
            sender,
            receiver,
            amount: Math.round((parseFloat(amount) + 0.01) * 100000),
            type: 'bloodland',
            item,
            oderId: 'XXX'
        },
        json: true
    })
        .then(function (parsedBody) {
            return parsedBody;
        }, error => {
            //console.error('Api transfer Blood Error: ' + error.message);
            return { successes: false, error: '504 Gateway Time-out' };
        });
}

//return null when error and return object who receive when success
async function saveHistoryTransferBlood(transferInfo, transferResponse) {
    //act: buy, sell, transfer, receive, buyInShop, recieveInShop
    const { sender, receiver, amount, item, act } = transferInfo;
    if (!transferResponse.successes) {
        const newUserTransferError = new UserTrade({
            userId: sender,
            traderId: receiver,
            amount: parseFloat(amount),
            txid: '',
            item,
            act: act[0],
            status: false,
            error: transferResponse.error,
        });
        return await newUserTransferError.save();
    }
    const newUserTransfer = new UserTrade({
        userId: sender,
        traderId: receiver,
        amount: parseFloat(amount),
        txid: transferResponse.txid,
        item,
        act: act[0],
        status: true,
        error: "",
    });
    const newUserReceive = new UserTrade({
        userId: receiver,
        traderId: sender,
        amount: parseFloat(amount) - 0.01,
        txid: transferResponse.txid,
        fee: parseFloat('0.01'),
        item,
        act: act[1],
        status: true,
        error: "",
    });

    const arrPm = await Promise.all([newUserReceive.save(), newUserTransfer.save()]);
    return arrPm[0].toObject();
}
