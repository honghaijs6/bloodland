const rp = require('request-promise');
const db = require('../../../db/db');
const config = require('../../../db/config');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const Land23 = db.Land23;
const User = db.User;
const UserTrade = db.UserTrade;
const LandPending = db.LandPending;
const LandCategory = db.LandCategory;
const mailsSerivice = require('../../users/services/mails');
const land23Service = require('../../lands/services/indexNew');
const landLogService = require('../../lands/services/landLog');
const isEqual = require('lodash.isequal');

const logger = require('../../../helpers/logger');
const { getDefaultPrice } = require('../../lands/services/landPrice');
const gameService = require('../../game');
const {
    QuadKeyToLatLong,
} = require("../../../helpers/custom/quadKeyConvert");

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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để cập nhật token  // 토큰의 정보 업데이트함
 * @param {*} wToken
 */
async function updateToken(wToken) {
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
            return typeof parsedBody.user.id !== 'undefined' ? parsedBody.user.id : '';
        }, error => {
            console.error('Api Profile Error: ' + error.message);
            return '';
        });

    if (nid !== '' && typeof nid !== 'undefined') {
        return User.findOneAndUpdate({ nid: nid.toString(), wToken: wToken }, { $set: { updatedDate: new Date() } }, { new: true })
            .then(updatedUser => {
                if (updatedUser) {
                    return updatedUser
                } else {
                    return null
                }
            })
            .catch(err => {
                console.log('err', err)
            });
    }
}

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để sử dụng tiền game // 게임에서 블러드 사용
 * @param {*} userId
 */
async function getGoldBlood(wToken) {
    const user = await User.findOne({ wToken: wToken });
    if (typeof user !== 'undefined' && (user)) {
        const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        return { ...walletInfo };
    }
    return false;
}

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để thêm tiền game  // 블러드랜드게 블러드를 주가
 * @param {*} userId, goldBlood
 */
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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để sử dụng tiền game // 게임에서 블러드 사용
 * @param {*} userId, userIdReceive, goldBlood
 */
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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để lưu lịch sử thành viên  // 회원 내역 저장
 * @param {*} transferInfo, transferResponse
 */
async function saveHistoryUser(transferInfo, transferResponse) {
    //act: buy, sell, transfer, receive, buyInShop, recieveInShop
    const { userId, userIdReceive, goldBlood, item, act } = transferInfo;
    //{ userId, userIdReceive, goldBlood, item, act:  }
    //let act = ['']
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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để chuyển tiền game đến tiền ví  //
 * @param {*} goldBlood, userId, email
 */
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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để chuyển tiền từ ví đến tiền game  // 게임에서 블러드 지갑으로 송금
 * @param {*} goldBlood, userId, email
 */
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

/**
 * 2019.3.22 Xuân Giao
 * hàm này dùng để mua đồ trong cửa hàng  // 상점에서 제품을 구매
 * @param {*} user: wToken, nId
 */
async function buyCharacterItemInShop(dataBuy) {

}

/**
 * 2019.3.29 Xuân Giao
 * hàm này dùng để lấy thông tin và land mặc định  // 랜드 구매 사용자의 종보과 랜의 이미 정한 값을 가져옴
 * => sửa lại 2019.19.04: lấy thông tin user + thông tin land mặc định + thông tin các nước mở bán
 * @param {*} wToken
 */
async function getUser_DefaultLandPrice_OpenCountries(wToken) {
    try {
        //lấy thông tin giá đất ban đầu
        const [{ defaultLandPrice }, buyer, openCountries] = await Promise.all([
            getDefaultPrice(),
            db.User.findOne({ wToken }).lean(),
            db.OpenCountry.find({ releaseDate: { $lte: new Date() } }).lean(),
        ]);

        if (defaultLandPrice && buyer && openCountries) {
            return { defaultLandPrice, buyer, openCountries };
        } else {
            return;
        }
    } catch (e) {
        return;
    }
    return;
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này mua lỗi  // 구매 버그
 * @param {*} wToken, itemQuadKeys
 */
async function buyFail({ wToken, itemQuadKeys }) {
    // console.log('buyFail');
    // itemQuadKeys.map(itemQK => {
    //     console.log('itemQK', itemQK);
    //     const { sellPrice, quadKey, buyerId, sellerId, sellerNid, buyerNid } = itemQK;
    //     landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: sellPrice, quadKey, reason: "" });
    // });
    //
    const walletInfo = await getGoldBlood(wToken);
    //console.log('walletInfo', walletInfo);
    if (!walletInfo) return [];
    return { success: false, updates: [], walletInfos: walletInfo, buyFailure: [], buyFromSystemGiveAGift: [] }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này tạo mua đất  // 셀 구매
 * @param {*} quadKeys, defaultLandPrice, buyer
 */
async function createBuyLand(quadKeys, defaultLandPrice, buyer) {
    //console.log("quadKeys", quadKeys);
    let buyLands = [];
    try {
        let sellerLands = await db.Land23.find({ quadKey: { $in: quadKeys } }); // Land Array
        var quadKeyForSell = {}; // Map<Quadkey, Land>
        var quadKey; // String

        for (var i = 0; i < sellerLands.length; i++) { // Loop with Land Array
            quadKey = sellerLands[i].quadKey;
            quadKeyForSell[quadKey] = sellerLands[i]; // Quadkey Array - because it is quadKey array, so we cannot get other info like sellPrice, sellerNid, sellerId
            // - so
        }

        // maybe quadKeys be change ?
        var sellerLand;
        for (var i = 0; i < quadKeys.length; i++) {
            quadKey = quadKeys[i];
            sellerLand = quadKeyForSell[quadKey];
            //console.log('quadKeys: ' + quadKey + ' ??? ' + (sellerLand && sellerLand.quadKey || 'Ko co seller land') + ' , ' + i);
            if (sellerLand) { //buy land from other user
                //let { user: { _id, nid }, sellPrice } = sellerLand;
                buyLands.push({
                    buyerId: buyer._id,
                    buyerNid: buyer.nid,
                    sellerId: sellerLand.user._id,
                    sellerNid: sellerLand.user.nid,
                    landPrice: sellerLand.sellPrice,
                    quadKey: sellerLand.quadKey,
                });
            } else { //buy land from system: sellerLand = null
                buyLands.push({
                    buyerId: buyer._id,
                    buyerNid: buyer.nid,
                    sellerId: null,
                    sellerNid: 0,
                    landPrice: defaultLandPrice,
                    quadKey: quadKey
                });
            }
        }
        return buyLands;
    } catch (e) {
        return buyLands;
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này chia quadKey thành quadKey có thể mua và không thể mua  // 살 수 있는 쿼드키와 살 수 없는 쿼드키 분류
 * @param {*} buyLands, itemQuadKeys
 */
async function __filterAcceptQuadKeysAndNoAcceptQuadKeys(buyLands, itemQuadKeys) {
    let acceptQuadKeys = [];
    let noAcceptQuadKeys = [];
    for (let eachLand of buyLands) {
        //console.log('eachLand', eachLand);
        const { sellerNid, buyerNid, quadKey, landPrice } = eachLand;
        await landLogService.updatePendingHistory({ buyerNid, sellerNid, landPrice, quadKey }, 'create');
        try {
            const isQuadKeyExist = await LandPending.findOne({ quadKey: eachLand.quadKey });
            if (!isNull(isQuadKeyExist)) {
                //nếu đang pending bởi người khác // 남은 펜딩할 때
                noAcceptQuadKeys.push(eachLand);
                //console.log('createLandBuyFailureSystemHistory 1')
                landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: landPrice, quadKey, reason: '' });
            } else {
                //nếu chưa có pending  // 펜딩 없을 때
                //accept
                //try create land pending
                let checkcode = Date.now() + parseInt(Math.random() * 1000);
                try {
                    const newLandPending = new LandPending({
                        buyerNid,
                        sellerNid,
                        quadKey,
                        checkcode: checkcode.toString(),
                        amount: Math.round(landPrice * 100000),
                    });
                    let saveData = await newLandPending.save();
                    if (!saveData) {
                        // Err: Quadkey of LandPending is duplicated
                        // Failed
                        noAcceptQuadKeys.push(eachLand);
                        //console.log('createLandBuyFailureSystemHistory 2')
                        landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: landPrice, quadKey, reason: '' });
                        await LandPending.findOneAndRemove({ quadKey, buyerNid });
                        //continue;
                    }

                    // Successes Save Pending
                    const getLandPending = await LandPending.findOne({ quadKey, buyerNid, sellerNid, checkcode: checkcode.toString() });

                    //nếu tạo pending thành công và lưu pending thành công // 펜딩 만들어 저장될 때
                    if (!isNull(getLandPending)) {
                        //nếu đất từ hệ thống // 시스템에서 셀 구매
                        //không cần check forSaleStatus + landPrice  체크 필요없음
                        if (sellerNid === 0 && !eachLand.sellerId) {
                            acceptQuadKeys.push(eachLand);
                        } else {
                            //nếu đất từ người khác // 남한테 셀 구매
                            //check xem đất có khớp với giá và trạng thái mua bán ? => // 셀의 값과 구매 상태 맞는지 확인
                            //
                            //console.log('landPrice ', landPrice );
                            const preLandPrice = itemQuadKeys.find(iQ => iQ.quadKey === quadKey).sellPrice;
                            const land = await Land23.findOne({ quadKey, forSaleStatus: true, sellPrice: preLandPrice });
                            if (isNull(land)) {
                                //nếu ko có, tức là ko khớp // 없으면 맞지 않음
                                noAcceptQuadKeys.push(eachLand);
                                //console.log('createLandBuyFailureSystemHistory 3')
                                landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: landPrice, quadKey, reason: '' });
                                await LandPending.findOneAndRemove({ quadKey, buyerNid });
                            } else {
                                //nếu có, tức là khớp // 있으면 맞음
                                acceptQuadKeys.push(eachLand);
                            }
                        }
                    }
                } catch (err) {
                    noAcceptQuadKeys.push(eachLand);
                    //console.log('createLandBuyFailureSystemHistory 3')
                    landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: landPrice, quadKey, reason: '' });
                    await LandPending.findOneAndRemove({ quadKey, buyerNid });
                }
            }
        } catch (e) {
            //console.log('createLandBuyFailureSystemHistory 4')
            landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: landPrice, quadKey, reason: '' });
        }
    }
    return { acceptQuadKeys, noAcceptQuadKeys };
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này thanh toán Blood  // 결제
 * @param {*} { wToken, nid, items, acceptQuadKeys, noAcceptQuadKeys }
 */
async function payBlood({ wToken, nid, items, acceptQuadKeys, noAcceptQuadKeys }) {
    try {
        // Pay
        let getPayApi = await getPay({ wToken, nid, items });
        // console.log('getPayApi', getPayApi);
        if (getPayApi && getPayApi.successes && getPayApi.txid) {
            await Promise.all(
                acceptQuadKeys.map(accQK => {
                    const { sellerNid, buyerNid, quadKey, landPrice } = accQK;
                    return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, txid: getPayApi.txid, payed: true }, 'updateAfterPay');
                })
            )
            return getPayApi;
        }
        //update pending history
        await Promise.all(
            noAcceptQuadKeys.map(naccQK => {
                const { sellerNid, buyerNid, quadKey, landPrice } = naccQK;
                return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, txid: '', payed: false, error: getPayApi.message }, 'updateAfterPay');
            })
        )
        const quadKeys = acceptQuadKeys.map(itemQK => itemQK.quadKey);
        await LandPending.deleteMany({ quadKey: { $in: quadKeys }, buyerNid: nid });
        return;
    } catch (e) {

        //update pending history
        await Promise.all(
            noAcceptQuadKeys.map(naccQK => {
                const { sellerNid, buyerNid, quadKey, landPrice } = naccQK;
                return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, txid: '', payed: false, error: e }, 'updateAfterPay');
            })
        )



        const quadKeys = acceptQuadKeys.map(itemQK => itemQK.quadKey);
        await LandPending.deleteMany({ quadKey: { $in: quadKeys }, buyerNid: nid });
        return;
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này trả lại Blood  // 블러드 돌아줌
 * @param {*} { wToken, nid, items, txid, reason }
 */
function refundBlood({ wToken, nid, items, txid, reason }) {
    if (process.env.NODE_ENV === 'development') return { successes: true, txid: 'Refund in localhost!!!', message: 'Refund response message!!!' };
    try {
        return rp({
            method: 'POST',
            uri: config.apiHost + '/api/refund',
            body: {
                apikey: config.bloodAppId,
                token: wToken,
                nid,
                items,
                txid,
                reason,
            },
            json: true
        })
            .then(parsedBody => {
                return parsedBody
            }, error => {
                console.error('Api Wallet Refund Error: ' + error.message);
                return;
            });
    } catch (e) {
        return;
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này mua QuadKey được chấp nhận  // 동의된 쿼드키 구매
 * @param {*} acceptQuadKeys, buyer, getPayApi, categoryName
 */
async function puschaseAcceptQuadKeys(acceptQuadKeys, buyer, getPayApi, categoryName) {
    let arrBuyLand = [];
    let buyFailureFromAcceptQuadKeys = [];
    for (let acceptQuadKey of acceptQuadKeys) {
        //console.log('acceptQuadKey', acceptQuadKey);
        const { buyerId, buyerNid, sellerId, sellerNid, landPrice, quadKey } = acceptQuadKey;
        const { role, _id, nid, wId, userName } = buyer;
        try {
            var objBuyLand = {
                userRole: role,
                userId: _id,
                nid,
                wId,
                name: userName,
                quadKeys: [{ quadKey, landPrice }],
                categoryName: categoryName,
                buyMode: null,
                txid: getPayApi.txid,
                sellerNid: sellerNid,
            };
            //===========================================test==================================================
            // // start buy land
            // let purchaseResult;
            // if(count === 1){
            //     purchaseResult = { updates: [], success: false, buyFailure: [acceptQuadKey], buyFromSystem: [] }; //test fail
            // } else {
            //     purchaseResult = await land23Service.purchaseLand23(objBuyLand);
            // }
            // count++;
            //============================================end test=================================================
            let purchaseResult = await land23Service.purchaseLand23(objBuyLand);
            if (purchaseResult) {
                if (purchaseResult.buyFailure && purchaseResult.buyFailure.length > 0) {
                    //console.log("Buy failed!!!");
                    buyFailureFromAcceptQuadKeys.push(acceptQuadKey);
                } else if (purchaseResult.updates && purchaseResult.updates.length > 0) { //error buy land
                    //console.log("Buy Success!!!");
                    arrBuyLand.push(purchaseResult);
                } else {
                    buyFailureFromAcceptQuadKeys.push(acceptQuadKey);
                }
            } else {
                buyFailureFromAcceptQuadKeys.push(acceptQuadKey);
            }
        } catch (err) {
            console.log('err', err);
            buyFailureFromAcceptQuadKeys.push(acceptQuadKey);
            //landLogService.createLandBuyFailureSystemHistory({ buyerNid: nid, sellerNid: sellerNid, quantity: 1, price: landPrice, quadKey, reason: err.toString() });
        }
        //totalNoAcceptBuyLands.push(noAcceptQuadKeys);
        //console.log('totalNoAcceptBuyLands', totalNoAcceptBuyLands)
    } //END FOR
    return { buyFailureFromAcceptQuadKeys, arrBuyLand };
}

//Kiểm tra ô đất đang mua có đang nằm trong quốc gia đang mở bán không?
function checkInCountry({ lat, lng, openCountries }) {
    return openCountries.some(limitMap => {
        if (lat >= limitMap.minLat && lat <= limitMap.maxLat && lng >= limitMap.minLng && lng <= limitMap.maxLng) {
            if (limitMap.ranges) {
                return limitMap.ranges.some(range => lat >= range.lat[0] && lat <= range.lat[1] && lng >= range.lng[0] && lng <= range.lng[1]);
            }
        }
        return false;
    });
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này mua Lands  //  랜드 구매
 * @param {*} categoryName, wToken, itemQuadKeys, buyMode, user
 */
async function purchaseLands({ categoryId, categoryName, wToken, itemQuadKeys, buyMode, user }) {
    const quadKeys = itemQuadKeys.map(itemQK => itemQK.quadKey);
    var logData = {
        'buyer': null,
        'buyLands': null,
        'acceptQuadKeys': null,
        'noAcceptQuadKeys': null,
        'purchaseResult': null
    }

    //get data user and default land price { defaultLandPrice, buyer }
    let objBuy = await getUser_DefaultLandPrice_OpenCountries(wToken);
    //console.log('objBuy', objBuy);
    if (!objBuy) {
        itemQuadKeys.map(itemQK => {
            //console.log('itemQK', itemQK);
            const { sellPrice, quadKey, buyerId, sellerId, sellerNid, buyerNid } = itemQK;
            landLogService.createLandBuyFailureSystemHistory({ buyerNid, sellerNid, quantity: 1, price: sellPrice, quadKey, reason: "" });
        });
        return buyFail({ wToken, itemQuadKeys });
    }

    let { defaultLandPrice, buyer, openCountries } = objBuy;
    //
    logData.buyer = buyer;

    // TODO:
    //var timems = new Date();
    //console.log(timems, 'BEFORE CREATE BUY LAND');
    let buyLands = await createBuyLand(quadKeys, defaultLandPrice, buyer);
    //logger
    logData.buyLands = buyLands;
    //end logger
    // let buyLands = await createBuyLand2(quadKeys, defaultLandPrice, buyer);
    //console.log(new Date(), 'AFTER CREATE BUY LAND', 'Elapsed timems: ' + (Date.now() - timems));
    //console.log('buyLands', buyLands)
    if (!buyLands || buyLands.length === 0) return buyFail({ wToken, itemQuadKeys });

    let splitPendingQuadkey = await __filterAcceptQuadKeysAndNoAcceptQuadKeys(buyLands, itemQuadKeys);
    // /console.log('splitPendingQuadkey', splitPendingQuadkey);
    let { acceptQuadKeys, noAcceptQuadKeys } = splitPendingQuadkey;


    //check acceptQK in openCountries
    const totalQK = acceptQuadKeys.reduce((totalQK, accQK) => {
        const { lat, lng } = QuadKeyToLatLong(accQK.quadKey);
        const inOpenCountry = checkInCountry({ lat, lng, openCountries });
        //console.log(inOpenCountry);
        if (inOpenCountry) {
            totalQK.acceptQuadKeys.push(accQK);
        } else {
            totalQK.noAcceptQuadKeys.push(accQK);
        }
        return totalQK;
    }, { acceptQuadKeys: [], noAcceptQuadKeys: [] });
    //console.log('totalQK', totalQK);

    if (totalQK.noAcceptQuadKeys.length > 0) {
        //console.log('buy out country', totalQK.noAcceptQuadKeys);
        acceptQuadKeys = totalQK.acceptQuadKeys;
        noAcceptQuadKeys = noAcceptQuadKeys.concat(totalQK.noAcceptQuadKeys);
    }


    //logger
    logData.acceptQuadKeys = acceptQuadKeys;
    logData.noAcceptQuadKeys = noAcceptQuadKeys;
    //end logger
    if (!acceptQuadKeys || acceptQuadKeys.length === 0) return buyFail({ wToken, itemQuadKeys });
    //console.log('acceptQuadKeys', acceptQuadKeys);

    //Pay blood
    const items = acceptQuadKeys.map(item => ({
        sellerNid: item.sellerNid,
        name: 'land',
        category: 'bloodland:land',
        quantity: 1,
        amount: Math.round(item.landPrice * 100000),
        //quadkey => send to API to Mr.Ko => all lower key
        quadkey: item.quadKey,
    }));
    //console.log('buyer.wToken', buyer.wToken);
    //console.log('Pay!');
    let getPayApi = process.env.NODE_ENV === 'development'
        ? { txid: "development txid", successes: true }
        : await payBlood({ wToken: buyer.wToken, nid: buyer.nid, items, acceptQuadKeys, noAcceptQuadKeys });

    if (!getPayApi || !getPayApi.successes) return buyFail({ wToken, itemQuadKeys });

    // // Change Land Owner
    var buyFailureFromAcceptQuadKeys = [];
    //let totalNoAcceptBuyLands = [];
    var arrBuyLand = [];

    //buy fisrt time
    //{ buyFailureFromAcceptQuadKeys, arrBuyLand }
    let buyFisrtTime = await puschaseAcceptQuadKeys(acceptQuadKeys, buyer, getPayApi, categoryName);
    //console.log('buyFisrtTime', buyFisrtTime);
    if (buyFisrtTime.buyFailureFromAcceptQuadKeys && buyFisrtTime.buyFailureFromAcceptQuadKeys.length > 0) { //buy fail 1 time
        //console.log('buyFisrtTime fail', buyFisrtTime.buyFailureFromAcceptQuadKeys);
        //start buy land second time
        let buySecondTime = await puschaseAcceptQuadKeys(buyFisrtTime.buyFailureFromAcceptQuadKeys, buyer, getPayApi, categoryName);
        //console.log('buySecondTime', buySecondTime);
        if (buySecondTime && buySecondTime.buyFailureFromAcceptQuadKeys && buySecondTime.buyFailureFromAcceptQuadKeys.length > 0) { //buy fail 2 time
            //console.log('buySecondTime fail', buyFisrtTime);
            //filter items buy failure
            //item.quadkey => send to API to Mr.Ko => all lower key
            let refundItems = buySecondTime.buyFailureFromAcceptQuadKeys.map(acQK => items.find(item => item.quadkey === acQK.quadKey));
            //console.log('refundItems', refundItems);
            //console.log({ wToken: buyer.wToken, nid: buyer.nid, items: refundItems, txid: getPayApi.txid, reason: "Buy land 2 time failure!!!" });
            let refund = await refundBlood({ wToken: buyer.wToken, nid: buyer.nid, items: refundItems, txid: getPayApi.txid, reason: "Buy land 2 time failure!!!" });
            //console.log('refund', refund);
            if (refund && refund.successes) { //refund failure
                //console.log("refund success");
                await Promise.all(
                    buySecondTime.buyFailureFromAcceptQuadKeys.map(accQK => {
                        const { sellerNid, buyerNid, quadKey, landPrice } = accQK;
                        return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, refunded: true }, 'updateAfterRefund');
                    })
                )
            } else { //refund success
                //console.log("Refund failed");
                await Promise.all(
                    buySecondTime.buyFailureFromAcceptQuadKeys.map(accQK => {
                        const { sellerNid, buyerNid, quadKey, landPrice } = accQK;
                        return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, refunded: false, error: refund.message }, 'updateAfterRefund');
                    })
                )
            }
            buyFailureFromAcceptQuadKeys = buyFailureFromAcceptQuadKeys.concat(buySecondTime.buyFailureFromAcceptQuadKeys);
        } else { // buy second time success
            //console.log('buySecondTime success', buySecondTime);
            arrBuyLand = arrBuyLand.concat(buySecondTime.arrBuyLand);
        }
    } else { // buy first time success
        //console.log('buyFisrtTime success', buyFisrtTime);
        arrBuyLand = arrBuyLand.concat(buyFisrtTime.arrBuyLand);
    }

    // /landLogService.createLandBuyFailureSystemHistory({ buyerNid: nid, sellerNid: sellerNid, quantity: 1, price: landPrice, quadKey, reason: err.toString() });

    //tổng số đất mua thành công 구매 서공된 충 셀
    let updates = arrBuyLand.reduce((arrUpdate, buyLand) => arrUpdate.concat(buyLand.updates), []);

    var lengthOfLandsFromSystem = items.filter(item => item.sellerNid === 0).length;
    if (lengthOfLandsFromSystem > 0) {
        //add Box to Inventory
        await gameService.createRandomBoxAndAddToInventory({ userId: buyer._id, quantity: lengthOfLandsFromSystem });
    }

    // console.log("items",items);
    // console.log("randomBOx");

    //console.log('updates', updates);
    //Tổng các miếng đất mua fail = số đất fail khi mua + số đất người khác mua trước (trong pending)  // 구매 실패된 충 셀 = 구매 실패된 충 셀 + 남은 이미 구매한 셀 (펜딩 안에 )
    let buyFailure = buyFailureFromAcceptQuadKeys.concat(noAcceptQuadKeys);

    await Promise.all(
        buyFailure.map(accQK => {
            const { sellerNid, buyerNid, quadKey, landPrice } = accQK;
            return landLogService.updatePendingHistory({ quadKey, buyerNid, sellerNid, failed: true, error: 'Buy Failed' }, 'updateAfterFailed');
        })
    );
    //console.log('buyFailure', buyFailure);
    //lấy số tiền của user sau khi mua đất
    const walletInfo = await getGoldBlood(wToken);
    //group người bán
    var grpSellers = groupSellerByPurchaseResult(updates, acceptQuadKeys);
    //console.log('grpSellers', grpSellers);
    //Trả tiền cho người bán + lưu lịch sử mua bán đất của user + gửi thư thông báo cho người bán + tính tổng số tiền gửi cho từng người
    // 판매자에게 블러드 줌 + 사용자의 셀 매매 내역 저장 + 판매자에게 통보 보냄 + 각각 사람에게 보낼 블러드 계산
    var saveHistorySuccess = await useGoldBloodAfterBuySuccessAndSendMail(buyer._id, grpSellers);
    // console.log("saveHistorySuccess",saveHistorySuccess);

    //tạo thư mục cho land sau khi mua
    let typeOfCate = buyMode && buyMode === "forbid" ? "landmark" : "normal";
    if (updates.length > 0) { //nếu mua thành công ít nhất 1 ô đất
        //categoryId
        // /categoryId = ObjectId("5ce7cc2c9e31481a80fd1a90");
        let category = null;
        if(categoryId){
            let fCate = await db.LandCategory.findOne({ _id: categoryId, userId: ObjectId(buyer._id) });
            if(fCate){
                category = fCate;
            }
        } else {
            //tạo Category
            category = categoryName.trim() ? await LandCategory.create({ typeOfCate, name: categoryName, userId: ObjectId(buyer._id) }) : null;
        }
        await Land23.updateMany({ 'quadKey': { $in: updates.map(u => u.quadKey) }, 'user._id': ObjectId(buyer._id) }, { $set: { categoryId: category ? category._id : null } });
    }

    //Xóa Land Pending sau khi hoàn thành giao dịch   // 거래 완료 후 랜드의 펜딩 삭제
    LandPending.deleteMany({ 'quadKey': { $in: quadKeys }, 'buyerNid': buyer.nid });
    //thêm log mua đất
    logData.purchaseResult = { success: updates.length > 0, updates, walletInfos: walletInfo, buyFailure, buyFromSystemGiveAGift: [] };
    logger.land('LANDLOG', logData);
    //trả về giá trị cho client
    return { success: updates.length > 0, updates, walletInfos: walletInfo, buyFailure, buyFromSystemGiveAGift: [] };
}

/**
 * 2019.3.29 Xuân Gia
 * hàm này nhóm bán hàng bởi kết quả mua  // 구매 결과 통해 판매 모임
 * @param {*} updateLands, acceptQuadKeys
 */
function groupSellerByPurchaseResult(updateLands, acceptQuadKeys) {
    //console.log("acceptQuadKeys",acceptQuadKeys);
    var sellers = [];
    sellers = acceptQuadKeys.filter(aQ => updateLands.find(uL => aQ.quadKey === uL.quadKey));

    var grpSellers = [];

    for (let seller of sellers) {
        var index = grpSellers.findIndex(s => isEqual(s.sellerId, seller.sellerId) && s.sellerNid === seller.sellerNid);
        if (index === -1) {
            grpSellers.push({
                sellerId: seller.sellerId,
                sellerNid: seller.sellerNid,
                landPrice: seller.landPrice,
                quadKeys: [seller.quadKey]
            })
        } else {
            grpSellers[index].landPrice += seller.landPrice
            grpSellers[index].quadKeys = grpSellers[index].quadKeys.concat(seller.quadKey);
        }
    }

    // grpSellers = Object.values(groupBy(grpSellers, 'sellerId')).map(grpSeller => {
    //     let seller = { ...grpSeller[0] };
    //     seller.amount = grpSeller.reduce((sumAmount, seller) => sumAmount + seller.amount, 0);
    //     seller.quadKeys = grpSeller.reduce((arrQK, seller) => arrQK.concat({ landPrice: seller.amount, quadKey: seller.quadKey }), []);
    //     if (seller.quadKey) delete seller.quadKey;
    //     return seller;
    // });

    return grpSellers;
    // for(let updateLand of updateLands){
    //     var isUpdateLandExistInAcceptQuadKeys = acceptQuadKeys.find(q => q.quadKey === updateLand.quadKey);

    //     var isAlreadyInGrpSellers = grpSellers.find()


    // }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này sử dụng tiền vàng sau khi mua thành công và gửi mail  //  구매 성공 후 블러드 사용하고 이메일 보냄
 * @param {*} buyerId, sellers
 */
async function useGoldBloodAfterBuySuccessAndSendMail(buyerId, sellers) {
    return Promise.all(sellers.map(async seller => {
        if (!seller.sellerId && seller.sellerNid === 0) {
            //from system - dont need send mails
            let transferInfo = {
                userId: buyerId,
                userIdReceive: seller.sellerId,
                goldBlood: seller.landPrice,
                act: ['buy', 'sell'],
                item: 'gold',
            };

            let transferResponse = await useGoldBlood(transferInfo);
            return saveHistoryUser(transferInfo, transferResponse);
        } else {
            // from other user
            let transferInfo = {
                userId: buyerId,
                userIdReceive: seller.sellerId,
                goldBlood: seller.landPrice,
                act: ['buy', 'sell'],
                item: 'gold',
            };

            //SEND MAIL HERE
            const toUserName = await User.findById(seller.sellerId).lean();
            await mailsSerivice.adminSendMail({
                fromName: 'BLOODLAND',
                toName: toUserName.userName,
                toId: seller.sellerId,
                title: '판매 알림',
                content: `<p>${seller.quadKeys.length} 개의 랜드가 판매되어 ${seller.landPrice} 블러드가 지급되었습니다.</p>`
            });

            let transferResponse = await useGoldBlood(transferInfo);
            return saveHistoryUser(transferInfo, transferResponse);
        }
    }));
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này xóa land Pending  //  랜드 펜딩 삭제
 * @param {*}
 */
async function removeLandPending() {
    const LandPending = db.LandPending;
    await LandPending.deleteMany();
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này chuyển blood  // 블러드 송금
 * @param {token, sender, receiver, amount}
 */
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

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy kiểm tra tiền Blood  // 블러드 확인
 * @param {wToken, nid}
 */
async function getBalance({ wToken }) {
    const userInfo = await updateToken(wToken);
    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/balance',
        body: {
            apikey: config.bloodAppId,
            token: userInfo.wToken,
            nid: userInfo.nid,
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

/**
 * 2019.3.29 Xuân Giao
 * hàm này rút tiền  // 블러드 뺌
 * @param {wToken, nid, mainWalletAddress, amount}
 */
async function getWithdraw(param) {
    await updateToken(param.wToken);
    let userWalletInfo = await rp({
        method: 'POST',
        uri: 'https://api.wallet.blood.land/api/me',
        body: {
            appId: config.bloodAppId,
            token: param.wToken,
        },
        json: true
    }).then(function (parsedBody) {
        return typeof parsedBody.user !== 'undefined' ? parsedBody.user : '';
    }, error => {
        console.error('Api Profile Error: ' + error.message);
        return '';
    });

    return await rp({
        method: 'POST',
        uri: config.apiHost + '/api/withdraw',
        body: {
            apikey: config.bloodAppId,
            token: param.wToken,
            nid: userWalletInfo.id,
            address: userWalletInfo.mainWalletAddress,
            amount: Math.round(param.amount * 100000),
        },
        json: true
    })
        .then(function (parsedBody) {
            if (parsedBody && parsedBody.successes) {
                return { "successes": parsedBody.successes };
            }
            else {
                return { "successes": false, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16) }
            }
        }, error => {
            console.error('Api Wallet Withdraw Error: ' + error.message);
            return { "successes": false, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16) }
        });
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này thanh toán  // 결제
 * @param {wToken, nid, items}
 * @response { successes: true, balance: 0, txid: '#####################' }
 */
// async function getPay({ wToken, nid, items }) {
//     try {

//         return rp({
//             method: 'POST',
//             uri: config.apiHost + '/api/pay',
//             body: {
//                 apikey: config.bloodAppId,
//                 token: wToken,
//                 nid,
//                 items
//             },
//             json: true
//         })
//             .then(parsedBody => {
//                 return parsedBody
//             }, error => {
//                 console.error('Api Wallet Pay Error: ' + error.message);
//                 return;
//             });
//     } catch (e) {
//         console.log(e);
//         return;
//     }
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








/**
 * 2019.3.29 Xuân Giao
 * hàm này nhận lợi tức  // 이자 받음
 * @param items: array (nid, amount)
 * @response { successes: true, balance: 0, txid: '#####################' }
 */
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

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy thông tin ví 지갑의 정보 가져옴
 * @param array (email)
 * @response user thông tin ví (지갑의 정보)
 */
async function getWalletInfo({ wToken }) {
    try {
        if (process.env.NODE_ENV !== 'development') {
            let goldBalance = await getBalance({ wToken });

            if (typeof goldBalance !== 'undefined' && goldBalance && goldBalance.successes) {
                let goldBalanceCost = parseFloat(goldBalance.balance / 100000);
                await User.findOneAndUpdate({ wToken: wToken }, { $set: { goldBlood: goldBalanceCost } }, { new: true });
            }
        }

        const user = await User.findOne({ wToken: wToken }).select('wSns createdDate email wId goldBlood');
        if (typeof user !== 'undefined' && (user)) {
            const { wSns, createdDate, email, wId, goldBlood } = user.toObject();
            return { wSns, createdDate, email, wId, goldBlood };
        }
        return false;
    } catch (err) {
        return res.status(401).json({ "successes": true, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16) });
    }

}

/**
 * 2019.3.29 Xuân Giao
 * hàm này kiểm tra token // 토근 확인
 * @param wToken
 */
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

/**
 * 2019.3.29 Xuân Giao
 * hàm này chuyển Blood Wallet  // 지갑 블러드 송금
 * @param token, sender, receiver, amount, item, act
 * @response transfer Blood { successes: true/false, error: 'invalidToken' }
 */
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

/**
 * 2019.3.29 Xuân Giao
 * hàm này chuyển lưu lịch sử chuyển tiền  // 블러드 송금 내역 저장
 * @param transferInfo { sender, receiver, amount, item, act }, transferResponse {successes}
 * return null when error and return object who receive when success
 */
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
