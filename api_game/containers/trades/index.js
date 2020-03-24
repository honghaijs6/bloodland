const db = require('../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const config = require('../../db/config');
const rp = require('request-promise');
const logger = require('./../../helpers/logger');

async function useGoldBlood(param) {
    if (typeof param.goldBlood !== 'undefined' && parseFloat(param.goldBlood) > 0 && typeof param.userId !== 'undefined' && param.userId) {
        let userUpdate = await db.User.findById(ObjectId(param.userId));
        if (!isNull(userUpdate)) {
            userUpdate.goldBlood -= parseFloat(param.goldBlood);
            await userUpdate.save();

            if (param.userIdReceive) {
                let userReceive = await db.User.findById(ObjectId(param.userIdReceive));
                if (!isNull(userReceive)) {
                    userReceive.goldBlood += parseFloat(param.goldBlood);
                    await userReceive.save();
                }
            }
        }
    }

    const user = await db.User.findById(ObjectId(param.userId));
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}
//end

async function updateNIDToken(wToken) {
    let nid = await rp({
        method: 'POST',
        uri: 'https://api.wallet.blood.land/api/me',
        body: {
            appId: config.bloodAppId,
            token: wToken,
        },
        json: true
    })
        .then(function (parsedBody) {
            //console.log('parsedBody ');
            return typeof parsedBody.user.id !== 'undefined' ? parsedBody.user.id : '';
        }, error => {
            console.error('Api Profile Error: ' + error.message);
            return '';
        });

    //console.log("after")
    if (nid !== '' && typeof nid !== 'undefined') {
        await db.User.findOneAndUpdate({ nid: String(nid) }, { $set: { updatedDate: new Date() } }, { new: true });
    }
}

// chec
async function updateToken(wToken) {
    // console.log('updateToken start',{
    //     method: 'POST',
    //     uri: 'https://api.wallet.blood.land/api/me',
    //     body: {
    //         appId: config.bloodAppId,
    //         token: wToken,
    //     },
    //     json: true
    // });

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
            //console.log('parsedBody ');
            return typeof parsedBody.user.email !== 'undefined' ? parsedBody.user.email : '';
        }, error => {
            console.error('Api Profile Error: ' + error.message);
            return '';
        });

    //console.log("after")
    if (email !== '') {
        //console.log("fidn email", email);
        await db.User.findOneAndUpdate({ email: email }, { $set: { updatedDate: new Date() } }, { new: true });
        //console.log('find email after')
    }
}

// async function getPay({ wToken, nid, items }) {
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
//     // console.log({
//     //     method: 'POST',
//     //     uri: config.apiHost + '/api/pay',
//     //     body: {
//     //         apikey: config.bloodAppId,
//     //         token: wToken,
//     //         nid,
//     //         items
//     //     },
//     //     json: true
//     // })
//     await updateToken(wToken);
//     return rp({
//         method: 'POST',
//         uri: config.apiHost + '/api/pay',
//         body: {
//             apikey: config.bloodAppId,
//             token: wToken,
//             nid,
//             items
//         },
//         json: true
//     })
//     .then(function (parsedBody) {
//         //console.log(parsedBody)
//         // console.log(' -------------------> Pay API Response =====> ',parsedBody);
//         return parsedBody
//     }, error => {
//         console.error('Api Wallet Pay Error: ' + error.message);
//     });
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





async function getBalance(param) {
    await updateNIDToken(param.wToken);
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

module.exports = {
    getBalance,
    useGoldBlood,
    getPay,
    updateNIDToken
}
