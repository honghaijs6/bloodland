const { bloodDB, landLogDB, bloodGameDB } = require('./../db');
const { connectHost, connectDbLandLog, connectDbGame } = require('./config');

connectDB(bloodDB, connectHost);
connectDB(landLogDB, connectDbLandLog);
connectDB(bloodGameDB, connectDbGame);

function connectDB(db, connectUrl) {
    // When successfully connected
    db.on('connected', function () {
        console.log('connection open to ' + connectUrl);
    });

    // If the connection throws an error
    db.on('error', function (err) {
        console.log('connection error: ' + err);
    });

    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('connection disconnected');
    });

    // If the Node process ends, close the bloodDB connection
    process.on('SIGINT', function () {
        db.close(function () {
            console.log('connection disconnected through app termination');
            process.exit(0);
        });
    });

    db.Promise = global.Promise;
}

module.exports = {
    //===========================================================Land DB===================================================================
    User: bloodDB.model('User', require('../containers/users/models/user')),
    UserTrade: bloodDB.model('UserTrade', require('../containers/users/models/userTrade')),
    UserMail: bloodDB.model('UserMail', require('../containers/users/models/userMail')),
    UserFriend: bloodDB.model('UserFriend', require('../containers/users/models/userFriend')),
    UserSetting: bloodDB.model('UserSetting', require('../containers/users/models/userSetting')),
    UserHarvest: bloodDB.model('UserHarvest', require('../containers/users/models/userHarvest')),
    Notify: bloodDB.model('Notify', require('../containers/notifies/models/notify')),
    AdminNotify: bloodDB.model('AdminNotify', require('../containers/notifies/models/notifyAdmin')),
    LandNpc: bloodDB.model('LandNpc', require('../containers/lands/models/landNpc')),
    LandGroup: bloodDB.model('LandGroup', require('../containers/lands/models/landGroup')),
    LandGroupCategory: bloodDB.model('LandGroupCategory', require('../containers/lands/models/landGroupCategory')),
    LandConfig: bloodDB.model('LandConfig', require('../containers/lands/models/LandConfig')),
    LandCategory: bloodDB.model('LandCategory', require('../containers/lands/models/landCategory')),
    LandHistory: bloodDB.model('LandHistory', require('../containers/lands/models/landHistory')),
    LandPending: bloodDB.model('LandPending', require('../containers/lands/models/landPending')),

    //land
    Land01: bloodDB.model('Land01', require('../containers/lands/models/land01')),
    Land02: bloodDB.model('Land02', require('../containers/lands/models/land02')),
    Land03: bloodDB.model('Land03', require('../containers/lands/models/land03')),
    Land04: bloodDB.model('Land04', require('../containers/lands/models/land04')),
    Land05: bloodDB.model('Land05', require('../containers/lands/models/land05')),
    Land06: bloodDB.model('Land06', require('../containers/lands/models/land06')),
    Land07: bloodDB.model('Land07', require('../containers/lands/models/land07')),
    Land08: bloodDB.model('Land08', require('../containers/lands/models/land08')),
    Land09: bloodDB.model('Land09', require('../containers/lands/models/land09')),
    Land10: bloodDB.model('Land10', require('../containers/lands/models/land10')),
    Land11: bloodDB.model('Land11', require('../containers/lands/models/land11')),
    Land12: bloodDB.model('Land12', require('../containers/lands/models/land12')),
    Land13: bloodDB.model('Land13', require('../containers/lands/models/land13')),
    Land14: bloodDB.model('Land14', require('../containers/lands/models/land14')),
    Land15: bloodDB.model('Land15', require('../containers/lands/models/land15')),
    Land16: bloodDB.model('Land16', require('../containers/lands/models/land16')),
    Land17: bloodDB.model('Land17', require('../containers/lands/models/land17')),
    Land18: bloodDB.model('Land18', require('../containers/lands/models/land18')),
    Land19: bloodDB.model('Land19', require('../containers/lands/models/land19')),
    Land20: bloodDB.model('Land20', require('../containers/lands/models/land20')),
    Land21: bloodDB.model('Land21', require('../containers/lands/models/land21')),
    Land22: bloodDB.model('Land22', require('../containers/lands/models/land22')),
    Land23: bloodDB.model('Land23', require('../containers/lands/models/land23')),

    //Blood Pending
    BloodPending: bloodDB.model('BloodPending', require('../containers/bloods/models/bloodPending')),
    BloodUseSuccess: bloodDB.model('BloodUseSuccess', require('../containers/bloods/models/bloodUseSuccess')),
    BloodUseFailure: bloodDB.model('BloodUseFailure', require('../containers/bloods/models/bloodUseFailure')),
    //========================================================End Land DB======================================================================


    //==========================================================Game DB=======================================================================
    Item: bloodGameDB.model('Item', require('../containers/item/models/item')),
    ItemPending: bloodGameDB.model('ItemPending', require('../containers/item/models/itemPending')),
    Object: bloodGameDB.model('Object', require('../containers/objects/models/object')),
    ObjectHistory: bloodGameDB.model('ObjectHistory', require('../containers/objects/models/objectHistory')),
    Inventory: bloodGameDB.model('Inventory', require('../containers/inventory/models/inventory')),
    RandomBox: bloodGameDB.model('RandomBox', require('../containers/randombox/models/randomBox')),
    RandomBoxInventory: bloodGameDB.model('RandomBoxInventory', require('../containers/randomBoxInventory/models/randomBoxInventory')),
    //BitaminHistory: bloodGameDB.model('BitaminHistory', require('../containers/history/models/bitaminHistory')),
    //========================================================End Game DB=======================================================================


    //==========================================================Log DB=======================================================================
    MergeHistory: landLogDB.model('MergeHistory', require('../containers/logs/models/mergeHistory')),
    AdminLandHistory: landLogDB.model('AdminLandHistory', require('../containers/lands/models/adminlLandHistory')),
    LandPendingHistory: landLogDB.model('LandPendingHistory', require('../containers/lands/models/landPendingHistory')),
    LandBuySuccessHistory: landLogDB.model('landBuySuccessHistory', require('../containers/lands/models/landBuySuccessHistory')),
    LandBuyFailureHistory: landLogDB.model('landBuyFailureHistory', require('../containers/lands/models/landBuyFailureHistory')),
    LandSellHistory: landLogDB.model('landSellHistory', require('../containers/lands/models/landSellHistory')),
    LandRemoveSellHistory: landLogDB.model('landRemoveSellHistory', require('../containers/lands/models/landRemoveSellHistory')),
    LandChangePriceHistory: landLogDB.model('landChangePriceHistory', require('../containers/lands/models/landChangePriceHistory')),
    //land default price
    LandDefaultPriceHistory: landLogDB.model('landDefaultHistory', require('../containers/lands/models/landDefaultHistory')),
    BuyInShopFailHistory: landLogDB.model('buyInShopFailHistory', require('../containers/lands/models/landBuyInShopFailureHistory')),
    //========================================================End Log DB=======================================================================

};
