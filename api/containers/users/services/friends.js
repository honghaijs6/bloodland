const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isArray = require('lodash.isarray');
const User = db.User;
const UserFriend = db.UserFriend;
//var rp = require('request-promise');

module.exports = {
    add,
    find,
    unFriend,
    block,
    unBlock,
    checkStatusByUserName,
    getFriendListBlockList,
    getBeBlockedUser
};

/**
 * 2019.3.22 Xuân Giao
 * hàm này tìm bạn bè // 친구 찾음
 * @param { userName, currentUserId}
 */
async function find(param) {
    let foundUser = await User.find({ userName: param.userName }).select('userName');
    if(foundUser.length > 0)
    {
        let status = 'normal';
        let checkBlock = await UserFriend.findOne({ $and: [ { "userId": param.currentUserId }, { "blockList.list.userId": foundUser[0]._id }] });
        if(!isNull(checkBlock))
            status = 'block';
        let checkFriend = await UserFriend.findOne({ $and: [ { "userId": param.currentUserId }, { "friendList.list.userId": foundUser[0]._id }] });
        if(!isNull(checkFriend))
            status = 'friend';

        if(param.currentUserId === foundUser[0]._id.toString())
            status = 'self';
        return {foundUser, status}
    }
    return {foundUser, status:'empty'};
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này thêm bạn bè  // 친구 추가
 * @param { userId, friendList}
 */
async function add(param) {
    const {userId} = param;
    let {friendList} = param;
    try {
        friendList = friendList.filter(f => f.userId.toString() !== userId.toString());
        const isUserExist = await UserFriend.findOne({ userId: userId });
        let success = true;
        if (isNull(isUserExist)) {
            const foundUser = await User.findById(userId).select('userName');
            const newUserFriend = new UserFriend();
            let newUserFriendList = friendList.map(f => {
                return { userId: new ObjectId(f.userId), name: f.name }
            });
            newUserFriend.userId = new ObjectId(userId);
            newUserFriend.friendList.list = newUserFriendList;
            newUserFriend.userName = foundUser.userName;
            await newUserFriend.save((err) =>{
                if (err) { 
                    success = false;
                }
            });
        }
        else {
            for (let i = 0; i < friendList.length; i++) {
                let friend = {
                    userId: new ObjectId(friendList[i].userId),
                    name: friendList[i].name
                };
                let opts = {
                    "$addToSet": { "friendList.list": friend },
                    "$pull": { "blockList.list": friend }
                };
                await UserFriend.findOneAndUpdate(
                    { "userId": userId },
                    opts,
                    { new: true },
                    (err, doc) => {
                        if (err) {
                            success = false;
                            console.log("Something wrong when updating data!");
                        }
                    }
                ).lean();
            }
        }
        const data = await getFriendListBlockList({userId});
        return { addStatus: success,...data};
    } catch (err) {
        console.log("err",err);
        const data = await getFriendListBlockList({userId});
        return { addStatus: false,...data};
    }
  
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy thông tin User Bloock //  차단 된 사용자의 정보 받음
 * @param { userId }
 */
async function getBeBlockedUser(param){
    let userId = param.userId;
    let userFriend = await UserFriend.find({ "blockList.list.userId": userId }).lean().select('userName');

    if(userFriend.length > 0){
        let uniqueUserName = getUniqueValueWithKey(userFriend,'userName');
        return uniqueUserName;
    }else{
        return [];
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy giá trị duy nhất với Key // 키의 유일 겂 받음
 * @param { array, key }
 */
function getUniqueValueWithKey(array,key) {
    var unique = {};
    var distinct = [];
    for (var i in array) {
        if (typeof (unique[array[i][key]]) == "undefined") {
            distinct.push(array[i][key]);
        }
        unique[array[i][key]] = 0;
    }
    return distinct;
}

async function addBlockFriends (blockList,userId) {
    try {
        const foundUser = await User.findById(userId).select('userName');
        let newUserFriend = new UserFriend();
        let newUserBlockList = blockList.map(f => {
            return { userId: new ObjectId(f.userId), name: f.name }
        });
        newUserFriend.userId = new ObjectId(userId);
        newUserFriend.blockList.list = newUserBlockList;
        newUserFriend.userName = foundUser.userName;
        let success = true;
        await newUserFriend.save((err) =>{
            if (err) { 
                success = false;
            }
        });
        const data = await getFriendListBlockList({userId });
        return { blockStatus: success,...data};
    } catch (error) {
        console.log("err",err);
        const data = await getFriendListBlockList({userId});
        return { blockStatus: false,...data};
    }
   
}

async function updateBlockFriend(isUserExist,blockList,userId){
    try {
        let updateBlockList = [...isUserExist.blockList.list, ...blockList];
        let updateFriendList = isUserExist.friendList.list.filter(f => !blockList.find(blockUser => blockUser.userId === f.userId.toString()));
        let success = true;
        const updating = await UserFriend.findOneAndUpdate(
            { "userId": userId },
            { "$set": {
                    "blockList.list" : updateBlockList,
                    "friendList.list" : updateFriendList
                }},
            { new: true },
            (err, doc) => {
                if (err) {
                    success = false;
                }
            }
        ).lean();
        const data = getFriends(updating);
        return { blockStatus: success,...data};
    }
    catch(err){
        const data = await getFriendListBlockList({userId});
        return { blockStatus: false,...data};
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy giá trị bạn đã chặn cc
 * @param { userId, blockList }
 */
async function block(param) {
    const {userId} = param;
    let {blockList} = param;
    try {
        for(let i=0;i<blockList.length;i++){
            if(isArray(blockList[i])){
                blockList.splice(i,1);
                break;
            }
        }

        const isUserExist = await UserFriend.findOne({ userId: userId }).lean().select('friendList blockList');
        if (isNull(isUserExist)) {
            return addBlockFriends(blockList,userId);
        }
        else {
            return updateBlockFriend(isUserExist,blockList,userId);
        }
    } catch (err) {
        console.log("err",err);
        const data = await getFriendListBlockList({userId});
        return { blockStatus: false,...data};
    }
    
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này để bỏ bạn  // 친구 삭제
 * @param { userId, friendList }
 */
async function unFriend(param) {
    const {userId,friendList} = param;
    try{
        let result = await UserFriend.findOne({ userId: userId }).select("friendList.list");
        const updateList = result.friendList.list.filter(u => {
            return !friendList.some(f => f.name === u.name);
        });
        let success = true;
        const updating = await UserFriend.findOneAndUpdate(
            { userId: userId },
            { $set: { "friendList.list": updateList } }, 
            { new: true },
            (err, doc) => {
                if (err) {
                    success = false;
                    console.log("err",err); 
                }
            }
        ).lean();
        console.log("updating",updating);
        const data = getFriends(updating);
        return { unFriendStatus: success,...data};
    }
    catch(err){
        console.log("err",err);
        const data = await getFriendListBlockList({userId });
        return { unFriendStatus: false,...data};
    }
}

/**
 * 2019.3.29 ngày tạo
 * hàm này để bỏ chặn bạn
 * @param { userId, unblockFriends }
 */
async function unBlock(param) {
    const{userId,unblockFriends}  = param;
    try{
        let result = await UserFriend.findOne({ userId: userId }).select("blockList.list");
        let updateList = result.blockList.list.filter(u => {
            return !unblockFriends.some(f => f.name === u.name);
        });
        let success = true;
        const updating = await UserFriend.findOneAndUpdate(
            {userId: userId},
            { $set: { "blockList.list": updateList } }, 
            { new: true },
            (err, doc) => {
                if (err) {
                    success = false;
                    console.log("Something wrong when updating data!");
                }
            }
        ).lean();
        const data = getFriends(updating);
        return { unBlockStatus: success,...data};
    }
    catch(err){
        console.log("err",err);
        const data = await getFriendListBlockList({userId});
        return { unBlockStatus: false,...data};
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này để kiểm tra trang thái bạn bởi username  // 사용자 이름으로  친구 형태 확인
 * @param {*} userId, friendName
 * @param { userId, friendName }
 */
async function checkStatusByUserName(param) {
    let statusFriend = false;
    let statusBlock = false;
    let friendId = null;
    const friend = await User.findOne({ userName: param.friendName });
    if (friend) {
        friendId = friend._id;
        const userFriend = await UserFriend.findOne({ userId: param.userId });
        if (userFriend) {
            userFriend.friendList.list.map(friend => {
                if (param.friendName === friend.name)
                    statusFriend = true;
                return null;
            });
            userFriend.blockList.list.map(block => {
                if (param.friendName === block.name)
                    statusBlock = true;
                return null;
            });
        }
    }

    return {
        userId: param.userId,
        friendId: friendId,
        friendName: param.friendName,
        statusFriend: statusFriend,
        statusBlock: statusBlock
    };
}

function getFriends(lists){
    let friendList = [];
    let blockList = [];
    if (!isNull(lists)) {
        friendList = lists.friendList.list.map(friend => ({ checked: false, friend }));
        blockList = lists.blockList.list.map(friend => ({ checked: false, friend }));
    }
    return { friendList, blockList };
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này để lấy danh sách bạn và danh sách chặn  // 친구 목록과 친구 차단 목록 받음
 * @param { userId, friendName }
 */
async function getFriendListBlockList(userId) {
    try {
        const lists = await UserFriend.findOne(userId).lean();
        return getFriends(lists);
    } catch (error) {
        console.log(error);
    }
}
