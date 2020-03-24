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

const land23Service = require('../../lands/services/indexNew');

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
    // purchaseLands: purchaseLandsLocal,
    removeLandPending
};

//param = { userId }
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
        //return null;
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
    const { typeCode, amount, price } = dataBuy[dataBuy.category][0];
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

// async function createPendings(quadKeys) {
//     for ()
//         let items = [];
//     let landPending = await LandPending.findOne({ quadKey: item.quadKey });
//     if (isNull(landPending)) {
//         const newLandPending = new LandPending({
//             sellerNid: sellerNid,
//             name: 'land',
//             category: 'bloodland:land',
//             quantity: 1,
//             amount: Math.round(item.landPrice * 100000),
//             quadKey: item.quadKey
//         });
//         await newLandPending.save();

//         if (!isNull(newLandPending)) {
//             items.push({
//                 sellerNid: sellerNid,
//                 name: 'land',
//                 category: 'bloodland:land',
//                 quantity: 1,
//                 amount: Math.round(item.landPrice * 100000),
//                 quadkey: item.quadKey
//             });
//         }
//     }
// }




// async function purchaseLandsLocal(param) {
//     // console.log("param ->",param);
//     const LandPending = db.LandPending;
//     var { transferBloods, buyLands } = param;
//     if (!Array.isArray(transferBloods)) return { success: false };

//     //group lands theo user
//     var buyerNid = buyLands.nid;
//     var grpTransferBloods = Object.values(groupBy(transferBloods, 'receiver')).map(grpTransfer => {
//         var transfer = { ...grpTransfer[0] };
//         transfer.amount = grpTransfer.reduce((sumAmount, transfer) => sumAmount + transfer.amount, 0);
//         transfer.quadKeys = grpTransfer.reduce((arrQK, transfer) => arrQK.concat({ landPrice: transfer.amount, quadKey: transfer.quadKey }), []);
//         if (transfer.quadKey) delete transfer.quadKey;
//         return transfer;
//     });

//     for (var objTransfer of grpTransferBloods) {
//         var { sender, receiver } = objTransfer;
//         var sellerNid = objTransfer.receivernId || 0;
//         // console.log("sellerNid",sellerNid);
//         for (var item of objTransfer.quadKeys) {

//             //tạo pending từng land
//             var landPending = await LandPending.findOne({ quadKey: item.quadKey });
//             if (isNull(landPending)) {
//                 const newLandPending = new LandPending({
//                     name: 'land',
//                     category: 'bloodland:land',
//                     quantity: 1,
//                     amount: Math.round(item.landPrice * 100000),
//                     quadKey: item.quadKey,
//                     //production option

//                     // sellerNid: sellerNid,
//                     // buyerNid: buyerNid

//                         await LandPending.findOne({ quadKey: item.quadKey, buyerNid: buyerNid, sellerNid: sellerNid }, async (err, result) => {
//                             if(!isNull(err))
//                                 return;
//                             else if(!isNull(result)&&(item.landPrice>0))
//                             {
//                                 items.push({
//                                     sellerNid: sellerNid,
//                                     name: 'land',
//                                     category: 'bloodland:land',
//                                     quantity: 1,
//                                     amount: Math.round(item.landPrice * 100000),
//                                     quadkey: item.quadKey
//                                 });
//                                 acceptQuadKeys.push(item.quadKey);
//                             }
//                         });
//                     } catch(err) {
//                         console.log('err',err);
//                         noAcceptQuadKeys.push(item.quadKey);
//                     }
//                 } else {
//                     noAcceptQuadKeys.push(item.quadKey);
//                 }
//             }
//             //--------------------------------------
//         }

//         //==================================================================

//         var objBuyLand = {
//             userRole: buyLands.userRole,
//             userId: buyLands.userId,
//             nid: buyLands.nid,
//             wId: buyLands.wId,
//             name: buyLands.name,
//             quadKeys: objTransfer.quadKeys,
//             categoryName: buyLands.categoryName,
//             buyMode: buyLands.buyMode,
//         };


//         var mappedQuadKeys = objBuyLand.quadKeys.map(q => q.quadKey);
//         var currentLandAimToOfBuyer = await Land23.find({ quadKey: { $in: mappedQuadKeys } });
//         var currentLandPendingOfBuyer = await LandPending.find({ buyer: ObjectId(sender) }).lean().select('quadKey seller buyer sellerNid buyerNid');

//         var acceptBuyQuadkeys = objBuyLand.quadKeys.filter(elm => {
//             var index = currentLandPendingOfBuyer.findIndex(lp => lp.quadKey === elm.quadKey);
//             return index !== -1 ? true : false;
//         })

//         var noAceptBuyQuadkeys = objBuyLand.quadKeys.filter(elm => {
//             var index = currentLandPendingOfBuyer.findIndex(lp => lp.quadKey === elm.quadKey);
//             return index === -1 ? true : false;
//         })








//         // console.log("allQuadKeys", objBuyLand.quadKeys);

//         // console.log("acceptBuyQuadKeys", acceptBuyQuadkeys);


//         // console.log("currentLandAimToOfBuyer",currentLandAimToOfBuyer);

//         // console.log("noAceptBuyQuadkeys", noAceptBuyQuadkeys);




//         // if (acceptBuyQuadkeys.length > 0) {
//         //     //nếu tồn tại ít nhất 1 land được phép mua
//         //     objBuyLand.quadKeys = acceptBuyQuadkeys;
//         //     let purchaseResult = await land23Service.purchaseLand23(objBuyLand);

//         //     if (purchaseResult && Array.isArray(purchaseResult.updates) && Array.isArray(purchaseResult.buyFailure)) {
//         //         if(purchaseResult.updates.length > 0){

//         //             let totalGoldBlood = acceptBuyQuadkeys.reduce((accu, curr) => {
//         //                 return accu + curr.landPrice
//         //             }, 0);


//         //             console.log("totalGoldBlood",totalGoldBlood);



//         //         }
//         //     }



//         // } else {

//         // }





//         // var aceeptBuyLands = objBuyLand.quadKeys.filter

//         // console.log("objBuyLand", objBuyLand);









//     }
//     // console.log("this grpTransferBloods",grpTransferBloods);
//     // console.log("this buyerNid",buyerNid);
// }

async function removeLandPending() {
    const LandPending = db.LandPending;
    await LandPending.deleteMany();
}


// let getPayApi = '';
// if (acceptQuadKeys.length > 0) {
//     let dataApiTransfer = { wToken: buyLands.wToken, nid: buyLands.nid, items: items };
//     getPayApi = await getPay(dataApiTransfer);











































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
            // console.log('Balance API =====> ',parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Balance Error: ' + error.message);
        });
}

// param: nid, amount ==> response: { successes: true, balance: 0, txid: '#####################' }
async function getWithdraw(param) {
    // console.log('param',param);
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/withdraw',
        body: {
            apikey: config.bloodAppId,
            token: param.wToken,
            nid: param.nid,
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
            console.log(' -------------------> Pay API Response =====> ', parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Pay Error: ' + error.message);
        });
}

// items: array (nid, amount)
// param: nid, items ==> response: { successes: true, balance: 0, txid: '#####################' }
async function getRewardInterest(param) {
    // console.log('----------------------> Reward Interest API Request =====> ',JSON.stringify({
    //     method: 'POST',
    //     uri: config.apiHost + '/api/reward-interest',
    //     body: {
    //         apikey: config.bloodAppId,
    //         key: param.key,
    //         items: [ param.items ]
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
            // console.log('----------------------> Reward Interest API Response =====> ',parsedBody);
            return parsedBody
        }, error => {
            console.error('Api Wallet Reward Interest Error: ' + error.message);
        });
}

async function getWalletInfo(param) {
    if (config.devPlace !== 'localhost') {
        let goldBalance = await getBalance(param);
        console.log('balance =============> ', goldBalance);

        //let goldWithdraw = await getWithdraw({wToken: param.wToken, nid: param.nid, amount: 110});
        //console.log('Withdraw =============> ',goldWithdraw);

        if (typeof goldBalance !== 'undefined' && goldBalance && goldBalance.successes && parseFloat(goldBalance.balance) > 0 && typeof param.email !== 'undefined' && param.email) {
            let goldBalanceCost = parseFloat(goldBalance.balance / 100000);
            await User.findOneAndUpdate({ email: param.email }, { $set: { goldBlood: goldBalanceCost } });
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
        const LandPending = db.LandPending;
        // const LandPendingHistory = db.LandPendingHistory;
        var items = [];
        var sellers = [buyLands.userId];
        var acceptQuadKeys = [];
        var noAcceptQuadKeys = [];

        for (let objTransfer of grpTransferBloods) {
            var sellerNid = objTransfer.receivernId || 0;
            for (let item of objTransfer.quadKeys) {
                let landPending = await LandPending.findOne({ quadKey: item.quadKey });
                if (isNull(landPending)) {

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
                        await newLandPending.save();
                        await LandPending.findOne({ quadKey: item.quadKey, buyerNid: buyerNid, sellerNid: sellerNid }, async (err, result) => {
                            if (!isNull(err))
                                return;
                            else if (!isNull(result)) {
                                console.log("buyerNid", buyerNid);
                                if (buyerNid === 0) {
                                    //buy from system
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
                                    //buy from another user
                                    var isMatchWithLandPending = await Land23.findOne({'user.nid':sellerNid,'quadKey':item.quadKey,'forSaleStatus': true});
                                    if(!isNull(isMatchWithLandPending)){
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
                                }
                                // var isBuyFromSystem;
                                // var isBuyFromAnotherUser;
                                
                            }
                        });
                    } catch (err) {
                        console.log('err', err);
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

                //ghép lại những land mua thất bại và những land đang pending
                buyFailure = buyFailure.concat(totalNoAcceptBuyLands);

                return { success: updates.length <= 0 ? false : true, updates, walletInfos, buyFailure };
            } else {
                //xoa pending neu mua that bai
                await LandPending.deleteMany({ quadKey: { $in: acceptQuadKeys } });
            }
        }

        const walletInfo = await getGoldBlood({ userId: buyLands.userId });
        return { success: false, updates: [], walletInfos: walletInfo }
    } else {
        const LandPending = db.LandPending;
        let sellers = [buyLands.userId];

        let acceptQuadKeys = [];
        let noAcceptQuadKeys = [];

        for (let objTransfer of grpTransferBloods) {
            // var sellerNid = objTransfer.receivernId || 0;
            for (let item of objTransfer.quadKeys) {
                let landPending = await LandPending.findOne({ quadKey: item.quadKey });
                if (isNull(landPending)) {
                    try {

                        console.log("buyerNid", buyerNid);
                        if (buyerNid === 0) {
                            //buy from system
                            console.log("buy from system");
                            

                        } else {
                            //buy from another user
                            console.log("buy from another user");
                        }

                    } catch (err) {

                    }
                    
                } else {
                    //những quadkey ko đc phép mua ( đang pending)
                    noAcceptQuadKeys.push(item.quadKey);
                }
            }
        }
        let getPayApi = '';

        if (acceptQuadKeys.length > 0) {
            // let dataApiTransfer = { wToken: buyLands.wToken, nid: buyLands.nid, items: items };
            // getPayApi = await getPay(dataApiTransfer);
            getPayApi = {
                txid: "testhoimahttp://178.128.109.233/http://178.128.109.233/",
                successes: true
            }

            if ((typeof getPayApi !== 'undefined' && getPayApi !== '' && getPayApi.successes && getPayApi.txid !== '')) {
                // console.log("accept->",acceptBuyLands);
                // console.log("accept.length->",acceptBuyLands.length);
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
                    };

                    // console.log("test1",objBuyLand.quadKeys);

                    //lọc ra những land được phép mua
                    objBuyLand.quadKeys = objBuyLand.quadKeys.filter(q => acceptQuadKeys.includes(q.quadKey));


                    // console.log("tesst2",objBuyLand.quadKeys);

                    let acceptBuyQkeys = objBuyLand.quadKeys.map(q => q.quadKey);


                    // console.log(" acceptBuyQkeys", acceptBuyQkeys);

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
                            }


                            // console.log("taotalGoldBlood -> ",totalGoldBlood);
                            let transferResponse = await useGoldBlood(transferInfo);
                            saveHistory = await saveHistoryUser(transferInfo, transferResponse);


                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });

                            if (typeof saveHistory === 'undefined' || !saveHistory.status) {
                                arrBuyLand.push({ ...saveHistory, ...{ success: saveHistory.state, updates: [] } });
                            } else {
                                arrBuyLand.push(purchaseResult);
                            }

                        } else {
                            //mua fail cung~ xoa'
                            allPendingLands = allPendingLands.concat(purchaseResult.buyFailure.map(q => q.quadKey));
                            //
                            await LandPending.deleteMany({ "quadKey": { $in: allPendingLands } });
                        }

                    }

                    totalNoAcceptBuyLands = totalNoAcceptBuyLands.concat(noAcceptQuadKeys);



                    await Land23.updateMany({ quadKey: { $in: acceptQuadKeys } }, { $set: { txid: getPayApi.txid } });
                }


                let updates = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.updates), []);
                let buyFailure = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.buyFailure), []);
                let walletInfos = await Promise.all(sellers.map(seller => getGoldBlood({ userId: seller })));

                //ghép lại những land mua thất bại và những land đang pending
                buyFailure = buyFailure.concat(totalNoAcceptBuyLands);

                return { success: updates.length <= 0 ? false : true, updates, walletInfos, buyFailure };

            } else {
                //xoa pending neu mua that bai
                await LandPending.deleteMany({ quadKey: { $in: acceptQuadKeys } });
            }
        }

        const walletInfo = await getGoldBlood({ userId: buyLands.userId });
        return { success: false, updates: [], walletInfos: walletInfo }
        //---END------------

    }
}