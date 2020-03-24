const rp = require('request-promise');
const db = require('../../../db/db');
const config = require('../../../db/config');
const ObjectId = require('mongoose').Types.ObjectId;
const isEmpty = require('lodash.isempty');
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');
const Land23 = db.Land23;
const User = db.User;
const Item = db.Item;
const RandomBox = db.RandomBox;
const UserTrade = db.UserTrade;
const LandPending = db.LandPending;
const LandPendingHistory = db.LandPendingHistory;
const logger = require('./../../../helpers/logger');


const inventoryService = require('../../inventory/services');
const randomBoxInventoryServices = require('../../randomBoxInventory/services');

module.exports = {
    getGoldBlood,
    addGoldBlood,
    useGoldBlood,
    coinToWallet,
    walletToCoin,
    checkWToken,
    getBalance,
    getWithdraw,
    getPay,
    getRewardInterest,
    getWalletInfo,
    transferBlood,
    exchangeBitamin
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

// get
async function exchangeBitamin(param) {
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
// async function getPay(param) {
//     // console.log(' -------------------> Pay API Request =====> ',JSON.stringify({
//     //     method: 'POST',
//     //     uri: config.apiHost + '/api/pay',
//     //     body: {
//     //         apikey: config.bloodAppId,
//     //         token: param.wToken,
//     //         nid: param.nid,
//     //         items: param.items
//     //     },
//     //     json: true
//     // }));
//     await updateToken(param.wToken);
//     return await rp({
//         method: 'POST',
//         uri: config.apiHost + '/api/pay',
//         body: {
//             apikey: config.bloodAppId,
//             token: param.wToken,
//             nid: param.nid,
//             items: param.items
//         },
//         json: true
//     })
//         .then(function (parsedBody) {
//             // console.log(' -------------------> Pay API Response =====> ',parsedBody);
//             return parsedBody
//         }, error => {
//             console.error('Api Wallet Pay Error: ' + error.message);
//         });
// }



//=======================================================EDIT BY HIEN====================================================
async function getPay({ wToken, nid, items }) {
    try {
        const getUserByNid = await db.User.findOne({ nid: nid });
        if (isNull(getUserByNid)) { // nếu thông tin user sai
            logger.payblood({
                data: new Date(),
                type: "failure",
                nid, items,
                reason: 'User info error or no exist'
            })
            return false;
        }
        let userId = getUserByNid._id;

        const isBloodPendingExist = await db.BloodPending.findOne({ nid: nid, userId: ObjectId(userId) });
        if (!isNull(isBloodPendingExist)) { // nếu có giao dịch đang xảy ra ( pending )
            //create fail logger
            logger.payblood({
                data: new Date(),
                type: "failure",
                nid, userId, items,
                reason: 'Another blood service processing'
            })
            return false;
            //end create logger
        }
        //tạo pending
        const newBloodPending = new db.BloodPending({
            nid: nid,
            userId: ObjectId(userId),
            items: items,
        });
        const result = await newBloodPending.save();

        if (!isNull(result)) { //nếu tạo pending thành công
            //giao dịch
            let parsedBody = await rp({
                method: 'POST',
                uri: config.apiHost + '/api/pay',
                body: {
                    apikey: config.bloodAppId,
                    token: wToken,
                    nid,
                    items
                },
                json: true
            });

            if (!isNull(parsedBody) && parsedBody.successes && parsedBody.txid) {
                //giao dịch thành công
                // xóa pending
                await db.BloodPending.findOneAndRemove({ nid: nid, userId: ObjectId(userId) });
                // tạo lịch sử giao dịch thành công
                logger.payblood({
                    data: new Date(),
                    type: "success",
                    nid, userId, items,
                    body: parsedBody,
                })
                return parsedBody;
            } else {
                //nếu giao dịch thất bại
                //tại lịch sử giao dịch và xóa pending ( vì trước khi giao dịch đã tạo pending thành công )
                await db.BloodPending.findOneAndRemove({ nid: nid, userId: ObjectId(userId) });
                logger.payblood({
                    data: new Date(),
                    type: "failure",
                    nid, userId, items,
                    reason: 'Error when pay blood'
                })
                return false;
            }
        } else { //nếu save pending thất bại
            //tạo lịch sử giao dịch thất bại
            logger.payblood({
                data: new Date(),
                type: "failure",
                nid, userId, items,
                reason: 'Error when create blood pending'
            })
            return false;
        }

    } catch (err) {
        console.log({ err });
        //nếu lỡi bất kì, tạo lịch sử giao dịch thất bại
        const getUserByNid = await db.User.findOne({ nid: nid });
        if (isNull(getUserByNid)) { // nếu thông tin user sai
            logger.payblood({
                data: new Date(),
                type: "failure",
                nid, items,
                reason: 'User info error or no exist'
            })
            return false;
        } else {
            logger.payblood({
                data: new Date(),
                type: "failure",
                nid, userId: getUserByNid._id, items,
                reason: 'Other reason: ' + err.toString()
            });
            return false;
        }
    }
}
//====================================================END EDIT BY HIEN====================================================



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
    if (process.env.NODE_ENV !== 'development') {
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
