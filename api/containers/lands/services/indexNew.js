// process.env.NODE_ENV = 'development';

const isNil = require('lodash.isnil');
const isNull = require('lodash.isnull');
const bCrypt = require('bcryptjs');
const groupBy = require('lodash.groupby');
const db = require('../../../db/db');
const Land = db.Land;
const Objects = db.Object;
const Land23 = db.Land23;
const LandPending = db.LandPending;
const LandCategory = db.LandCategory;
const LandCharacter = db.LandCharacter;
const LandConfig = db.LandConfig;
const LandHistory = db.LandHistory;
const AdminLandHistory = db.AdminLandHistory;
const ObjectId = require('mongoose').Types.ObjectId;
const uuid4 = require('uuid4');
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const moment = require('moment');

const gameService = require('../../game');
const gameTreeService = require('../../game/changeOwnerTree');
const config = require('../../../db/config');

const usersService = require('./../../users/services/index');
const mailsSerivice = require('./../../users/services/mails');
const landLogService = require('../../../containers/lands/services/landLog');

const DEFAULT_LAND_OFFSET = 1;
const PARENT_1_RANGE = 4; //lv19
const PARENT_2_RANGE = 5; //lv18

const landCollections = {
    1: db.Land01,
    2: db.Land02,
    3: db.Land03,
    4: db.Land04,
    5: db.Land05,
    6: db.Land06,
    7: db.Land07,
    8: db.Land08,
    9: db.Land09,
    10: db.Land10,
    11: db.Land11,
    12: db.Land12,
    13: db.Land13,
    14: db.Land14,
    15: db.Land15,
    16: db.Land16,
    17: db.Land17,
    18: db.Land18,
    19: db.Land19,
    20: db.Land20,
    21: db.Land21,
    22: db.Land22
};

const {
    QuadKeyToTileXY,
    TileXYToLatLong,
    LatLongToTileXY,
    TileXYToQuadKey,
    QuadKeyToLatLong,
} = require("../../../helpers/custom/quadKeyConvert");

module.exports = {
    getLandInfo,
    getLandByQuadKeys,
    getAreaLand,
    getOpenCountry,
    getAllLandMarkCategoryInMap,
    addCenterCategory,
    getAllLandById,
    forbidLandDirect,
    purchaseLand23,
    getAllHistoryTradingLandById,
    removeHistory,
    getAllCategory,

    addCategory,
    editCategory,
    transferLandCategory,
    getAllLand,
    getAllLandByUserId,
    updateLandsState,
    deleteLandCategory,
    editLand,

    getAllLandCategory,
    getAllLandMarkCategory,
    getLandByCategory,

    updateLandMarksState
};



/*
    controler: /lands/getLandByQuadKeys
    getLandByQuadKeys({ userId, itemQuadKeys })
    userId: userID
    itemQuadKeys: [{ quadKey, userId }];
*/
async function getLandByQuadKeys({ userId, itemQuadKeys }){
    const landConfig = await LandConfig.findOne({});
    //landConfig.landPrice
    if(!landConfig) return { status: true, buyLandInfos: [] };
    const [buyFromSanta, buyFromOtherUser] = _.partition(itemQuadKeys, { userId: null });
    // console.log('[buyFromSanta, buyFromOtherUser]',[buyFromSanta, buyFromOtherUser]);
    const arrBuyFromSanta = buyFromSanta.map(itemQk => ({ quadKey: itemQk.quadKey, sellPrice: landConfig.landPrice, initialPrice: landConfig.landPrice }));
    //console.log('arrBuyFromSanta', arrBuyFromSanta);

    const arrBuyFromOtherUser = await db.Land23.find({ quadKey: { $in: buyFromOtherUser.map(itemQk => itemQk.quadKey) }, 'user._id': { $ne: userId }, forSaleStatus: true, forbidStatus: false }).select('quadKey sellPrice initialPrice -_id');
    //console.log('arrBuyFromOtherUser', arrBuyFromOtherUser);
    // console.log('getLandByQuadKeys',[...arrBuyFromSanta, ...arrBuyFromOtherUser]);
    return { status: true, buyLandInfos: [...arrBuyFromSanta, ...arrBuyFromOtherUser] };
}

/*
controler: /lands/getLandInfo
getLandInfo({ quadKey })
quadKey: "132110320123013000331112"
result success: { status: true, landInfo }
result error: { status: false, landInfo: null }
*/
async function getLandInfo({ quadKey }){
    // console.log('quadKey',quadKey);
    const info = await db.Land23.findOne({ quadKey }).select('user.name user.wId quadKey initialPrice sellPrice purchasePrice purchaseDate txid -_id').lean();
    if(!info) return { status: false, info: null };
    info.latlng = QuadKeyToLatLong(info.quadKey);
    info.purchaseDateFormat = moment(info.purchaseDate).format('DD/MM/YYYY');
    // console.log('info', info);
    return { status: true, info };
}



// (async () => {

//     let k = await getLandInfo({ quadKey: "132110320123013000331112" });
//     console.log('k', k);


//     // const userId = ObjectId("5cee5990e5003b3a0c2eb2c6");
//     // const itemQuadKeys = [
//     //     { quadKey: "132110320123013000331112", userId: ObjectId("5cee59b0e5003b3a0c2f282f") },
//     //     { quadKey: "132110320120230230132233", userId: ObjectId("5cee59b0e5003b3a0c2f282f") },
//     //     { quadKey: "132110320120230230132234", userId: null },
//     // ];
//     // let k = await getLandByQuadKeys({ userId, itemQuadKeys });


//     // // const parents1 = ["13211032012312013203", "13211032012312013221", "13211032012312013212", "13211032012312013230"];
//     // // const level = 24;
//     // // let k = await getAreaLand({ parents1: ["13211032012312013203"], level });
//     // console.log('k', k);
// })();



async function createAdminLandHistory({ type, quadKey, price, seller, buyer, nid }) {
    const newAdminHistory = new AdminLandHistory({ type, quadKey, price, seller, buyer, nid });
    return newAdminHistory.save();
}

async function getAllLandMarkCategoryInMap() {
    let allLandMark = await LandCategory.find({ typeOfCate: 'landmark' }).lean();
    let landmarkWithLocation = allLandMark.filter(lm => lm && lm.center && lm.center.lat && lm.center.lng);
    let allLandMarkWithLocation = landmarkWithLocation.map(lmwl => {
        let { x, y } = LatLongToTileXY(lmwl.center.lat, lmwl.center.lng, 24);
        let centerQuadKey = TileXYToQuadKey(x, y, 24);
        lmwl.centerQuadKey = centerQuadKey;
        return lmwl;
    });
    return allLandMarkWithLocation;
}

async function addCenterCategory(param) {
    const { cateId, center } = param;
    const update = await LandCategory.findOneAndUpdate({ _id: ObjectId(cateId) }, { center: center }, { new: true });
    return { update, success: update ? true : false };
}

async function getLandByCategory({ cateId, userId }) {
    let lands = [];
    let objects = [];
    try {
        if (!cateId || typeof cateId === 'undefined') {
            lands = await Land23.find({ categoryId: null, 'user._id': ObjectId(userId) });
            let mappedLands = lands.map(q => q.quadKey);
            objects = await db.Object.find({ 'userId': ObjectId(userId), 'quadKey': { $in: mappedLands } });
        } else {
            lands = await Land23.find({ categoryId: ObjectId(cateId), 'user._id': ObjectId(userId) });
            let mappedLands = lands.map(q => q.quadKey);
            objects = await db.Object.find({ 'userId': ObjectId(userId), 'quadKey': { $in: mappedLands } });
        }
    } catch (err) {

    }

    return {
        cateId,
        lands,
        objects
    }
}

function getOpenCountry() {
    return db.OpenCountry.find({ releaseDate: { $lte: new Date() } });
}

async function getAllLand({ parents1, level }) {
    let allLands = [];
    if (level) {
        const landLevel = level - DEFAULT_LAND_OFFSET;
        if (landLevel === 23) {
            allLands = await Land23.find({ quadKeyParent1: { $in: parents1 } }).select('-user.nid -__v').lean();
        } else {
            allLands = await landCollections[landLevel].find({ quadKeyParent1: { $in: parents1 } }).select('-user.nid  -__v').lean();
        }
    }
    return { allLands };
}


async function getAreaLand({ parents1, level }) {
    let allLands = [];
    if (level) {
        const landLevel = level - DEFAULT_LAND_OFFSET;
        if (landLevel === 23) {
            allLands = await Land23.find({ quadKeyParent1: { $in: parents1 } }).select('user._id user.role forbidStatus forSaleStatus quadKey').lean();
        } else {
            allLands = await landCollections[landLevel].find({ quadKeyParent1: { $in: parents1 } }).select('-user.nid  -__v').lean();
        }
    }
    return { allLands };
}

async function getAllLandById({ userId }) {
    let myLand = await Land23.find({ 'user._id': userId }).lean();
    return { myLand: myLand };
}

//sellLand + remove sell land + change price sell land
//param = { userId, forSaleStatus, quadKeys, mode }
async function updateLandsState({ userId, forSaleStatus, quadKeys, mode, nid }) {

    var mappedQuadkeys = quadKeys.map(q => q.quadKey);
    var pendingLandQuadKeys = await LandPending.find({ 'quadKey': { $in: mappedQuadkeys } }).lean();

    if (pendingLandQuadKeys.length > 0 && mode === 're_selling') {
        quadKeys.map(itemQK => landLogService.createLandChangePriceHistory({ success: false, sellerId: userId, quadKey: itemQK.quadKey, price: itemQK.landPrice, sellerNid: nid }));
        return { updates: [], success: false, mode: mode };
    }

    const mappedPendingLandQuadkeys = pendingLandQuadKeys.map(q => q.quadKey);
    const notPendingLandQuadKeys = quadKeys.filter(q => !mappedPendingLandQuadkeys.includes(q.quadKey));
    //console.log('notPendingLandQuadKeys', notPendingLandQuadKeys);

    //check sellLand in Big QuadKey?
    let myObjects = await db.Object.find({ userId, bigTreeQuadKeys: { $exists: true } }).lean();
    let allBigTreeQuadKey = myObjects.length > 0 ? myObjects.reduce((totalQK, obj) => totalQK.concat(obj.bigTreeQuadKeys), []) : [];
    if(allBigTreeQuadKey.length > 0 && notPendingLandQuadKeys.length > 0){
        const allowQuadKeys = notPendingLandQuadKeys.map(npQK => npQK.quadKey);
        const includeQuaKeys = _.intersection(allowQuadKeys, allBigTreeQuadKey);
        if(includeQuaKeys.length > 0){
            //console.log('BigTree');
            return { updates: [], success: false, mode: mode };
        }
    }


    let sellUpdates = await Promise.all(notPendingLandQuadKeys.map(itemQK =>
        Land23.findOneAndUpdate(
            { quadKey: itemQK.quadKey, 'user._id': ObjectId(userId) },
            { forSaleStatus, sellPrice: itemQK.landPrice },
            { new: true }
        ).exec()
    ));

    //filter
    sellUpdates = sellUpdates.filter(l => l !== null);
    if (quadKeys && quadKeys.length > 0) {
        let updateFailure = quadKeys.filter(itemQK => !sellUpdates.some(sUpdate => sUpdate.quadKey === itemQK.quadKey));
        if (updateFailure && updateFailure.length > 0) {
            if (mode === 'remove_sell') {
                updateFailure.map(itemQKFail => landLogService.createLandRemoveSellHistory({ success: false, sellerId: userId, quadKey: itemQKFail.quadKey, price: itemQKFail.landPrice, sellerNid: nid }));
            } else if (mode === "sell") {
                updateFailure.map(itemQKFail => landLogService.createLandSellHistory({ success: false, sellerId: userId, quadKey: itemQKFail.quadKey, price: itemQKFail.sellPrice, sellerNid: nid }));
            }
        }
    }

    // //await updateParent(updates);
    if (mode === "sell") {
        try {
            sellUpdates.map(landS => createAdminLandHistory({ type: 'sell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
            sellUpdates.map(landS => landLogService.createLandSellHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        } catch (e) { console.log('Error: ', e) }

        await updateParent(sellUpdates, 'sell');
    } else if (mode === "re_selling") {
        try {
            sellUpdates.map(landS => createAdminLandHistory({ type: 'resell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
            sellUpdates.map(landS => landLogService.createLandChangePriceHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        } catch (e) { console.log('Error: ', e) }
        //do not update Parent
    } else if (mode === 'remove_sell') {
        try {
            sellUpdates.map(landS => createAdminLandHistory({ type: 'remove sell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
            sellUpdates.map(landS => landLogService.createLandRemoveSellHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        } catch (e) { console.log('Error: ', e) }

        await updateParent(sellUpdates, 'buy');
    }

    return { updates: sellUpdates, success: sellUpdates.length > 0, mode: mode }
}

//=================================================================PUSCHASE LAND==================================================================================
//Puschase Land
async function buyFromWho(quadKeys, buyMode, userId) {

    const arrPM = await Promise.all(quadKeys.map(itemQK => checkExistQuadkey(itemQK.quadKey)));
    if (typeof buyMode !== 'undefined' && buyMode === 'forbid') {
        let result = quadKeys.reduce((splitLand, itemQK, i) => {
            if (arrPM[i]) {
                if (arrPM[i].forSaleStatus === true) {
                    itemQK.seller = arrPM[i].user._id;
                    itemQK.sellerNid = arrPM[i].user.nid;
                    itemQK.userRole = arrPM[i].user.role;
                    splitLand.buyFromOtherUserSale.push(itemQK);
                } else {
                    splitLand.buyFromOtherUserNoSale.push(itemQK);
                }
            } else {
                splitLand.buyFromSystem.push(itemQK);
            }
            return splitLand;
        }, { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] });
        return result;
    }
    else {
        const qkeys = quadKeys.map(itemQk => itemQk.quadKey);
        const pendings = await LandPending.find({ 'quadKey': { $in: qkeys } });
        if (pendings.length !== qkeys.length) {
            return { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] };
        } else {
            let result = quadKeys.reduce((splitLand, itemQK, i) => {
                if (arrPM[i]) {
                    if (arrPM[i].forSaleStatus === true) {
                        itemQK.seller = arrPM[i].user._id;
                        itemQK.sellerNid = arrPM[i].user.nid;
                        itemQK.userRole = arrPM[i].user.role;
                        splitLand.buyFromOtherUserSale.push(itemQK);
                    } else {
                        splitLand.buyFromOtherUserNoSale.push(itemQK);
                    }
                } else {
                    splitLand.buyFromSystem.push(itemQK);
                }
                return splitLand;
            }, { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] });
            //console.log('result', result);
            return result;
        }
    }
}

//param = { categoryName userRole, userId, nid, quadKeys: [{ quadKey,  }]}
async function purchaseLand23(param) {
    const { userId, nid, name, wId, categoryName, userRole, quadKeys, buyMode, txid, sellerNid } = param;
    const landConfig = await LandConfig.findOne({});
    //create category
    // let typeOfCate = buyMode && buyMode === "forbid" ? "landmark" : "normal";
    // let category = categoryName.trim() ? await (new LandCategory({ typeOfCate: typeOfCate, name: categoryName, userId: new ObjectId(userId) })).save() : null;

    if (buyMode === "forbid") {
        let updateMany = await puschaseNewLandFromSystem_New({
            user: { _id: new Object(userId), nid, role: userRole, name, wId },
            quadKeys: quadKeys,
            initialPrice: buyMode && buyMode === "forbid" ? landConfig.landPrice : 0,
            // categoryId: category ? category._id : null,
            categoryId: null,
            buyMode,
            txid
        });
        let pmBuyFromSystem = await Promise.all(updateMany.map(update => Land23.findOne({ quadKey: update.quadKey }).lean()));
        return { updates: pmBuyFromSystem, success: quadKeys.length === updateMany.length };
    }

    let { buyFromSystem, buyFromOtherUserSale, buyFromOtherUserNoSale } = await buyFromWho(quadKeys, buyMode, userId);
    //console.log({ buyFromSystem, buyFromOtherUserSale, buyFromOtherUserNoSale });

    //puschase land from system
    let updateMany = await puschaseNewLandFromSystem_New({
        user: { _id: new Object(userId), nid, role: userRole, name, wId },
        quadKeys: buyFromSystem,
        initialPrice: buyMode && buyMode === "forbid" ? landConfig.landPrice : 0,
        categoryId: null,
        buyMode,
        txid
    });

    let pmBuyFromSystem = [];
    if (buyMode && buyMode === 'forbid') {
    } else {
        //add history buy from system
        try {
            updateMany.map(update => createLandHistory({ landId: update._id, soldPrice: update.sellPrice, buyer: update.user._id }));
        } catch (e) {
            console.log('Error add history land buy from system:', e);
        }
        pmBuyFromSystem = await Promise.all(updateMany.map(update => Land23.findOne({ quadKey: update.quadKey }).lean()));
    }

    //buy from other user
    let pmBuyFromOtherUser = await Promise.all(
        buyFromOtherUserSale.map(itemQK => {
            return Land23.findOneAndUpdate(
                { quadKey: itemQK.quadKey, sellPrice: itemQK.landPrice },
                {
                    forSaleStatus: false,
                    user: { _id: Object(userId), nid, role: userRole, name, wId },
                    isPlant: false,
                    categoryId: null,
                    purchasePrice: itemQK.landPrice,
                    purchaseDate: new Date(),
                    txid,
                },
                { new: true }
            ).lean()
        })
    );

    pmBuyFromOtherUser = pmBuyFromOtherUser.filter(rs => !isNull(rs));
    buyFromOtherUserNoSale = [...buyFromOtherUserNoSale, ...pmBuyFromOtherUser.filter(rs => isNull(rs))]

    await updateParent(buyFromOtherUserSale, 'buy');


    //updateLandmarkCount(landUpdate, mode)

    //add history land by from other user
    try {
        //======================================================================================================GAME=======================================================================================================
        //let k = await Promise.all(
        buyFromOtherUserSale.map(landUserSale => gameTreeService.changeTreeOwner({ quadKey: landUserSale.quadKey, sellerId: landUserSale.seller, buyerId: userId, historyPrice: landUserSale.landPrice }))
        //)
        //====================================================================================================GAME CHANGE=======================================================================================================

        pmBuyFromOtherUser.map((update, i) => createLandHistory({ landId: update._id, soldPrice: update.sellPrice, buyer: update.user._id, seller: buyFromOtherUserSale[0].seller }));
        buyFromOtherUserSale.map(landUserSale => landLogService.createLandBuySuccessHistory({ buyerNid: nid, sellerNid: landUserSale.sellerNid, quantity: 1, price: landUserSale.landPrice, quadKey: landUserSale.quadKey, txid }));
    } catch (e) {
        console.log('Error add history land by from other user:', e);
    }

    //add to Admin
    try {
        pmBuyFromOtherUser.map(landU => createAdminLandHistory({ type: "buy", quadKey: landU.quadKey, price: landU.purchasePrice, buyer: userId, seller: buyFromOtherUserSale[0].seller, nid }));
    } catch (e) {
        console.log('Error: ', e);
    }
    
    let totalBuyLand = pmBuyFromOtherUser.concat(pmBuyFromSystem);
    const isSuccess = quadKeys.length === totalBuyLand.length;

    let qks = quadKeys.map(q => q.quadKey);
    await LandPending.deleteMany({ quadKey: { $in: qks } });

    buyFromOtherUserNoSale.map(itemQK => landLogService.createLandBuyFailureHistory({ buyerNid: nid, sellerNid, quantity: 1, price: itemQK.landPrice, quadKey: itemQK.quadKey }));

    return { updates: totalBuyLand, success: isSuccess, buyFailure: buyFromOtherUserNoSale, buyFromSystem: pmBuyFromSystem }
}

async function checkExistQuadkey(quadKey) {
    return Land23.findOne({ quadKey });
}

async function getAllLandMarkCategory({ userId }) {
    let LandMarkCates = await LandCategory.find({ userId: userId, typeOfCate: 'landmark' }).lean();
    let _result = LandMarkCates.map(l => {
        return {
            checked: false,
            category: {
                name: l.name,
                lands: [],
                _id: l._id,
                center: l.center,
            },
            _id: l._id,
            type: 'landmark'
        }
    });
    return _result;
}

//vuonglt fix load category without land []
async function getAllLandCategory({ userId }) {
    let LandCates = await LandCategory.find({ userId: userId, typeOfCate: 'normal' }).lean();
    let _result = LandCates.map(l => {
        return {
            checked: false,
            category: {
                name: l.name,
                lands: null,
                _id: l._id,
                center: l.center,
            },
            _id: l._id,
            type: 'normal'
        }
    });
    _result.push(
        {
            checked: false,
            category: {
                name: 'empty',
                lands: null,
                _id: null,
                center: null,
            },
            _id: null,
            type: 'normal'
        }
    )

    return _result;
}

async function puschaseNewLandFromSystem_New(param) {
    const { user, quadKeys, initialPrice, categoryId, buyMode, txid } = param;
    let newLandInsert = quadKeys.map(land => {
        const { landPrice, quadKey } = land;
        return {
            user,
            categoryId: null,
            quadKey,
            sellPrice: landPrice,
            initialPrice: landPrice,
            purchasePrice: landPrice,
            forbidStatus: user.role === "manager",
            puschaseDate: new Date(),
            quadKeyParent1: quadKey.substr(0, 24 - PARENT_1_RANGE),
            quadKeyParent2: quadKey.substr(0, 24 - PARENT_2_RANGE),
            txid
        }
    });

    const landUpdate = await Land23.insertMany(newLandInsert);
    try {
        //create log history admin
        landUpdate.map(landU => createAdminLandHistory({ type: "buy", quadKey: landU.quadKey, price: landU.purchasePrice, seller: null, buyer: user._id, nid: user.nid }));
        //add log history buy land success
        landUpdate.map(landU => landLogService.createLandBuySuccessHistory({ buyerNid: user.nid, sellerNid: 0, quantity: 1, price: landU.purchasePrice, quadKey: landU.quadKey, txid }));

    } catch (e) {
        console.log('Error: ', e);
    }

    await updateParent(landUpdate, 'buy');
    return landUpdate;
}

async function forbidLandDirect({ user, quadKeys, categoryId }) {
    const { _id, role, nid, wId, name } = user;
    let newLandInsert = quadKeys.map(quadKey => {
        const landPrice = 80000;
        const forSaleStatus = true;
        const forbidStatus = false;
        return {
            user: { _id, nid, role, name, wId },
            categoryId,
            quadKey,
            sellPrice: landPrice,
            initialPrice: landPrice,
            purchasePrice: landPrice,
            forbidStatus: forbidStatus,
            forSaleStatus: forSaleStatus,
            isPlant: false,
            puschaseDate: new Date(),
            quadKeyParent1: quadKey.substr(0, 24 - PARENT_1_RANGE),
            quadKeyParent2: quadKey.substr(0, 24 - PARENT_2_RANGE),
        }
    });
    let landUpdate = [];
    try {
        landUpdate = await Land23.insertMany(newLandInsert);
        await updateParent(landUpdate, 'buy', true);
    } catch (e) {
        throw e;
        console.log(e);
    }
    return landUpdate;
}

async function updateParent(landUpdate, mode, managerCreateLandmark=null) {
    for (let landLevel = 22; landLevel > 0; landLevel--) {
        let counts = countParentCell(landUpdate, landLevel); // quadkey length = landLevel + 1
        if (counts) {
            await Promise.all(
                Object.entries(counts).map(([qk, count]) => {
                    const tmpCount = mode === 'buy' ? count : -count;
                    let update = null;
                    if(landUpdate[0].userRole === 'manager'){
                        update = { $inc: { count: tmpCount, landmarkCount: -tmpCount } };
                    } else {
                        if(managerCreateLandmark){
                            update = { $inc: { count: tmpCount, landmarkCount: tmpCount } };
                        } else {
                            update = { $inc: { count: tmpCount } }
                        }
                    }
                    if (qk.length > 5) {
                        update.quadKeyParent1 = qk.substr(0, (landLevel + 1) - PARENT_1_RANGE);
                        update.quadKeyParent2 = qk.substr(0, (landLevel + 1) - PARENT_2_RANGE);
                    }
                    return landCollections[landLevel].update({ quadKey: qk }, update, { upsert: true });
                })
            );
        }
    }
}

function getNewParents(lands, level) {
    var count = lands.length || 0;
    var parents = [];

    var quadKey;
    for (var i = 0; i < count; i++) {
        quadKey = lands[i].quadKey;
        quadKey = quadKey.substr(0, level + 1);

        parents.push({ quadKey: quadKey, count: 0 });
    }
    return parents;
}

function countParentCell(lands, level) {

    var count = lands.length || 0;
    var landCounts = {};

    var quadKey;
    for (var i = 0; i < count; i++) {
        quadKey = lands[i].quadKey;
        quadKey = quadKey.substr(0, level + 1);
        landCounts[quadKey] = (landCounts[quadKey] || 0) + 1;
    }

    return landCounts;
}
//=================================================================PUSCHASE LAND END==================================================================================

async function createLandHistory({ landId, soldPrice, seller, buyer }) {
    const newHistory = new LandHistory({ landId, soldPrice, seller, buyer });
    return newHistory.save();
}

async function getAllHistoryTradingLandById({ userId }) {
    try {
        return db.LandHistory.aggregate([
           {
              $match: {
                   $or: [
                        { 'buyer': ObjectId(userId), buyerDeleted: false },
                        { 'seller': ObjectId(userId), sellerDeleted: false }
                    ]
              }
           }
           ,{
             $lookup:
               {
                 from: "land23",
                 localField: "landId",
                 foreignField: "_id",
                 as: "land"
               }
           },
           {$unwind: '$land'},
           {
                $project: {
                    "status": true,
                    "seller": true,
                    "sellerDeleted": true,
                    "buyer": true,
                    "buyerDeleted": true,
                    "soldPrice": true,
                    "dateTrading": true,
                    "landId": "$land._id",
                    "quadKey": "$land.quadKey",
                }
           },{$sort: { dateTrading: -1 }}
        ]);
    } catch (e) {
        console.log('Error', e);
        return [];
    }
}

async function removeHistory(histories) {

    let removeBuyLands = histories.filter(h => h.buyerDeleted).map(h => new ObjectId(h.historyId));
    let removeSellLands = histories.filter(h => h.sellerDeleted).map(h => new ObjectId(h.historyId));
    if (removeBuyLands.length > 0) {
        await LandHistory.updateMany({ _id: { $in: removeBuyLands } }, { $set: { buyerDeleted: true } });
    }
    if (removeSellLands.length > 0) {
        await LandHistory.updateMany({ _id: { $in: removeSellLands } }, { $set: { sellerDeleted: true } });
    }
}

async function getAllLandByUserId(id) {
    return await Land.find({ userId: new ObjectId(id) });
}

async function getAllCategory({ userId, movedLands }) {

    let Cates = await LandCategory.find({ userId: userId }).lean();
    let effectedLands = typeof movedLands === 'undefined' ? [] : movedLands;
    //lấy tất cả lands
    let AllLands = await Land23
        .find({ "user._id": userId })
        .populate({
            path: 'categoryId',
            Model: 'LandCategory'
        })
        .lean();

    //chọn ra những land thuộc empty
    let empty = AllLands.filter(l => isNull(l.categoryId));
    //chọn ra những land khác empty
    let anotherCates = AllLands.filter(l => !isNull(l.categoryId));

    //group empty lại thành 1 object ( theo cấu trúc cũ )
    let groupEmptyCate = {
        checked: false,
        category: {
            name: "empty",
            lands: empty.map(l => {
                let land = l;
                delete land.categoryId;
                let checked = effectedLands.findIndex(eL => eL === land._id.toString()) !== -1 && !land.forSaleStatus ? true : false;
                return { land: land, checked: checked }
            })
        }
    }

    //group các land khác thành nhiều object ( theo cấu trúc cũ )
    let groupAnotherCates = anotherCates.map(cate => {
        cate.cateId = cate.categoryId._id;
        cate.cateName = cate.categoryId.name;
        cate.typeOfCate = cate.categoryId.typeOfCate;
        cate.center = cate.categoryId.center;
        delete cate.categoryId;
        return cate;

    });
    groupAnotherCates = groupBy(groupAnotherCates, 'cateId');
    let tempGroupAnotherCates = [];
    let tempGroupForbidLands = [];

    for (let cate of Cates) {
        let anotherCateName = Object.keys(groupAnotherCates);
        let index = anotherCateName.findIndex(c => c.toString() === cate._id.toString());
        if (index !== -1) {
            //nếu cate này có chứa land

            let type = cate.typeOfCate;


            let otherCate = {
                checked: false,
                type: type,
                category: {
                    _id: cate._id,
                    name: cate.name,
                    center: cate.center,
                    lands: groupAnotherCates[cate._id.toString()].map(l => {
                        let land = l;
                        delete land.categoryId;
                        let checked = effectedLands.findIndex(eL => eL === land._id.toString()) !== -1 && !land.forSaleStatus ? true : false;
                        return { land: land, checked: checked }
                    })
                }
            };
            tempGroupAnotherCates = [...tempGroupAnotherCates, otherCate];
        } else {
            //nếu cate rỗng
            let type = cate.typeOfCate;
            let otherCate = {
                checked: false,
                type: type,
                category: {
                    _id: cate._id,
                    name: cate.name,
                    lands: [],
                    center: { lat: 0, lng: 0 }
                },
            };
            tempGroupAnotherCates = [...tempGroupAnotherCates, otherCate];
        }
    }
    let allCates = [groupEmptyCate, ...tempGroupAnotherCates];
    return allCates;

}
async function transferLandCategory(param) {
    // return param;
    const oldCateId = param.oldCateId;
    const newCateId = param.newCateId;
    const userId = param.userId;
    const movedLands = param.lands.map(l => { return l.land });

    const landIds = param.lands.map(l => l.land._id);

    if (isNil(oldCateId)) {
        await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: ObjectId(newCateId) } });
        return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
    } else {
        if (isNil(newCateId)) {
            await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: null } });
            return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
        } else {
            await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: ObjectId(newCateId) } });
            return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
        }
    }
}

async function getLandByMultyCategory(cate_1, cate_2, userId, movedLands) {
    let results = await Promise.all(
        [
            getLandByCategory({ cateId: cate_1, userId: userId }),
            getLandByCategory({ cateId: cate_2, userId: userId }),
        ]
    );
    let oldCate = results[0];
    let newCate = results[1];

    oldCate.lands = oldCate.lands.map(land => {
        return {
            checked: false,
            land: land
        };
    });
    newCate.lands = newCate.lands.map(land => {
        return {
            checked: false,
            land: land
        };
    });

    return {
        oldCategory: oldCate,
        newCategory: newCate,
        newCategoryLands: movedLands
    }
}

async function editLand({ landId, userId, name }) {
    return await Land23.findOneAndUpdate({ _id: landId, 'user._id': userId }, { $set: { name: name } }, { new: true });
}

async function editCategory({ name, userId, cateId }) {
    return await LandCategory.findOneAndUpdate({ _id: ObjectId(cateId)}, { $set: { name: name } }, { new: true });
}

async function addCategory(param) {
    const category = new LandCategory({
        name: param.name,
        userId: new ObjectId(param.userId)
    });
    // console.log('param.userId',param.userId);
    await category.save();
    //nếu cate rỗng
    // let type = cate.typeOfCate;
    // let otherCate = {
    //             checked: false,
    //             type: type,
    //             _id: cate._id,
    //             category: {
    //                 _id: cate._id,
    //                 name: cate.name,
    //                 lands: [],
    //                 center: { lat: 0, lng: 0 },
    //                 type: type
    //             },
    //         };
    // return otherCate;
    return getAllLandCategory({ userId: param.userId });
}

async function deleteLandCategory(param) {
    const { cateId, userId } = param;
    await Land23.updateMany(
        { categoryId: ObjectId(cateId) },
        { $set: { categoryId: null/*, updatedDate: new Date()*/ } }
    );

    await LandCategory.findByIdAndRemove(cateId);
    let emptyCateLands = await Land23.find({ categoryId: null, "user._id": ObjectId(userId) });
    emptyCateLands = emptyCateLands.map(land => {
        return {
            checked: false,
            land: land
        };
    });
    return { cateId, emptyCateLands };
}


async function updateLandMarksState({ token, userId, quadKeys, forSaleStatus }) {
    try {
        let user = db.User.findOne({ 'wToken': token, 'userId': ObjectId(userId) });
        if (!isNull(user)) {
            let updatedLands = await Promise.all(quadKeys.map(q => {
                return db.Land23.findOneAndUpdate({ 'quadKey': q }, { $set: { 'forSaleStatus': forSaleStatus } });
            }))
            updatedLands = updatedLands.map(uL => uL.quadKey);
            return { updates: updatedLands, forSaleStatus, success: updatedLands.length > 0 };
        }
    } catch (err) {
        return { updates: [], forSaleStatus, success: false }
    }
}