const rp = require('request-promise');
const db = require('../../../db/db');
const config = require('../../../db/config');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const User = db.User;
const { createBitaminHistory, getBitaminHistory, updateBitaminHistory } = require('./bitaminHistory');

module.exports = {
    getMyBitamin,
    convertBitaminToGoldBlood,
    rewardInterestBitamin,
};

async function getMyBitamin({ wToken }){
        try {
            if (process.env.NODE_ENV === 'development') {
                const user = await db.User.findOne({ wToken }).select('bitamin nid').lean();
                if(!user) return { status: false, errCode: 'InvalidUser' };
                return { status: true, bitamin: user.bitamin };
            } else {
                //console.log('Chờ API!!!');
                //console.log()
                const user = await db.User.findOne({ wToken }).select('bitamin nid').lean();
                //console.log('user', user, wToken);
                if(!user) return { status: false, errCode: 'InvalidUser' };

                const infoBitamin = await getInfoBitamin({ nid: Number(user.nid), wToken });
                //console.log('infoBitamin', infoBitamin)
                //cant get 
                if(!infoBitamin || !infoBitamin.successes) return { status: false, bitamin: 0, errCode: 'cantGetBitamin' };

                //update Bitamin un User
                let updateUser = await db.User.findOneAndUpdate({ wToken }, { $set: { bitamin: infoBitamin.balanceSave } }, { new: true }).select('bitamin goldBlood');
                if(!updateUser || !updateUser.bitamin) return { status: false, errCode: "cantUpdateBitamin", goldBlood: 0, bitamin: 0 };

                return { status: true, bitamin: updateUser.bitamin }; 
            }
        } catch (err) {
            console.log('err', err);
            return;
        }
}

async function convertBitaminToGoldBlood({ wToken, amountBitamin }){
    try {
        if (process.env.NODE_ENV === 'development') {
            const history = await createBitaminHistory({ userId: null, nid: null, category: "CONVERT", categoryDetail: "", amount: amountBitamin });
            // console.log('history', history);
            const user = await db.User.findOne({ wToken }).lean();
            //console.log('')
            //error cannot found user
            if(!user){
                updateBitaminHistory({ historyId: history._id, userId: null, nid: -1, error: "InvalidUser" });
                return { status: false, errCode:'InvalidUser', goldBlood: 0, bitamin: 0 };
            }

            //error not enough bitamin
            const { _id, nid, bitamin } = user;
            if(bitamin < amountBitamin){
                updateBitaminHistory({ historyId: history._id, userId: _id, nid: Number(nid), error: "NotEnoughtBitamin" });
                return { status: false, errCode: 'notEnoughBitamin', goldBlood: 0, bitamin: 0 };
            }

            //update Bitamin
            let updateUser = await db.User.findOneAndUpdate({ wToken }, { $inc: { bitamin: -amountBitamin, goldBlood: amountBitamin } }, { new: true });
            //console.log('updateUser', updateUser)
            if(!updateUser){
                updateBitaminHistory({ historyId: history._id, userId: _id, nid: Number(nid), error: "CannotUpdateBitamin" });
                return { status: false, errCode:'InvalidUser', goldBlood: 0, bitamin: 0 };
            }
            
            updateBitaminHistory({ historyId: history._id, userId: _id, nid: Number(nid), status: true });
            return { status: true, goldBlood: updateUser.goldBlood, bitamin: updateUser.bitamin };

        } else {
            //console.log('Chờ API!!!');
            const history = await createBitaminHistory({ userId: null, nid: null, category: "CONVERT", categoryDetail: "", amount: amountBitamin });
            //find user
            const user = await db.User.findOne({ wToken }).lean();
            if(!user){
                updateBitaminHistory({ historyId: history._id, userId: null, nid: -1, error: "InvalidUser" });
                return { status: false, errCode:'InvalidUser', goldBlood: 0, bitamin: 0 };
            }

            //error not enough bitamin
            const { _id, nid, bitamin } = user;
            // console.log('bitamin', bitamin);
            // console.log('amountBitamin', amountBitamin);
            if(bitamin < amountBitamin || amountBitamin < 100000){
                updateBitaminHistory({ historyId: history._id, userId: _id, nid: Number(nid), error: "NotEnoughtBitamin" });
                return { status: false, errCode: 'notEnoughBitamin', goldBlood: 0, bitamin: 0 };
            }

            //sent to withdraw API - error can't Withdraw
            const withdraw = await withdrawBitamin({ nid: Number(nid), wToken, amount: amountBitamin });
            if(!withdraw || !withdraw.successes){
                updateBitaminHistory({ historyId: history._id, userId: _id, nid: Number(nid), error: withdraw.message || "cantWithdraw" });
                return { status: false, errCode: withdraw.message || "cantWithdraw", goldBlood: 0, bitamin: 0 };
            }

            //withdraw success
            updateBitaminHistory({ action: "afterWithdrawSuccess", userId: _id, nid: Number(nid), historyId: history._id, txid: withdraw.txid, status: true });
            //get new info bitamin
            let infoBitamin = await getInfoBitamin({ nid: Number(nid), wToken });
            //error can't get bitamin
            if(!infoBitamin || !infoBitamin.successes) return { status: false, errCode: "cantGetBitamin", goldBlood: 0, bitamin: 0 };

            //update Bitamin un User
            let updateUser = await db.User.findOneAndUpdate({ wToken }, { $set: { bitamin: infoBitamin.balanceSave } }, { new: true }).select('bitamin goldBlood');
            if(!updateUser || !updateUser.bitamin) return { status: false, errCode: "cantUpdateBitamin", goldBlood: 0, bitamin: 0 };

            return { status: true, goldBlood: updateUser.goldBlood, bitamin: updateUser.bitamin };

        }
    } catch (err) {
        console.log('err', err);
        return { status: false, bitamin: null };
    }
}



//Sử dụng Schedule lợi nhuận Bitamin mỗi ngày
/*
// get reward Interest Bitamin
wToken (String): wallet token
key (ObjectId): id of History
items: [{  
    nid, (Number: nid of user )
    amount (amount Bitamin: *10000 before send API )
}]
===============respose================
successes (Boolean)
message (String)
txid (String (withdraw tx id))
*/
function rewardInterestBitamin({ key, items }) {
    let { apiBitamin, bloodAppId } = config;
    //const apiBitamin = 'http://134.209.99.241:7788';
    //const bloodAppId = 'HXW2IzgNGJe3I0Z1';
    try {
        return rp({
            method: 'POST',
            uri: apiBitamin +'/api/reward-interest',
            body: {
                apikey: bloodAppId,
                key,
                items
            },
            json: true
        })
        .then(data => data)
        .catch(err => {
            console.log('Err: ', err);
            return { successes: false, message: err };
        });
    } catch(err){
        console.log('Catch Err: ', err);
        return { successes: false, message: err };
    }
}


/*
// get withdraw Bitamin
nid (Number): nid of user
wToken (String): wallet token
amount (Number) *10000 before send API
===============respose================
successes (Boolean)
message (String)
txid (String (withdraw tx id))
*/
function withdrawBitamin({ nid, wToken, amount }) {
    let { apiBitamin, bloodAppId } = config;
    //const apiBitamin = 'http://134.209.99.241:7788';
    //const bloodAppId = 'HXW2IzgNGJe3I0Z1';
    try {
        return rp({
            method: 'POST',
            uri: apiBitamin +'/api/withdraw',
            body: {
                apikey: bloodAppId,
                token: wToken,
                nid,
                amount
            },
            json: true
        })
        .then(data => data)
        .catch(err => {
            console.log('Err: ', err);
            return { successes: false, message: err };
        });
    } catch(err){
        console.log('Catch Err: ', err);
        return { successes: false, message: err };
    }
}

/*
// get info Bitamin
nid (Number),
wToken (String)
amount (Number) *10000 before send API
===============respose================
successes (Boolean)
message (String)
balance (Number (btamin))
*/
function getInfoBitamin({ nid, wToken }) {
    let { apiBitamin, bloodAppId } = config;
    //const apiBitamin = 'http://134.209.99.241:7788';
    //const bloodAppId = 'HXW2IzgNGJe3I0Z1';
    try {
        return rp({
            method: 'POST',
            uri: apiBitamin +'/api/balance',
            body: {
                apikey: bloodAppId,
                token: wToken,
                nid
            },
            json: true
        })
        .then(data => {
            //console.log('data', data)
            if(!data || !data.successes) return { successes: false, message: "cantFoundInfoBitamin" };
            data.balanceSave = parseFloat(data.balance);
            return data;
        })
        .catch(err => {
            console.log('Err: ', err);
            return { successes: false, message: err };
        });
    } catch(err) {
        console.log('Catch Err: ', err);
        return { successes: false, message: err };
    }
}