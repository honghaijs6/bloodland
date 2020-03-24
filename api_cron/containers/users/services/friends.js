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

async function add(param) {
    let userId = param.userId;
    let friendList = param.friendList;
    friendList = friendList.filter(f => f.userId.toString() !== userId.toString());
    const isUserExist = await UserFriend.findOne({ userId: userId });
    if (isNull(isUserExist)) {
        const foundUser = await User.findById(userId).select('userName');
        const newUserFriend = new UserFriend();
        let newUserFriendList = friendList.map(f => {
            return { userId: new ObjectId(f.userId), name: f.name }
        });

        newUserFriend.userId = new ObjectId(userId);
        newUserFriend.friendList.list = newUserFriendList;
        newUserFriend.userName = foundUser.userName;

        await newUserFriend.save();

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
                opts
            );
        }
    }

    return getFriendListBlockList({ userId: userId });
}

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

async function block(param) {
    let userId = param.userId;
    let blockList = param.blockList;

    for(let i=0;i<blockList.length;i++){
        if(isArray(blockList[i])){
            blockList.splice(i,1);
            break;
        }
    }
    const isUserExist = await UserFriend.findOne({ userId: userId }).lean().select('friendList blockList');
    if (isNull(isUserExist)) {
        const foundUser = await User.findById(userId).select('userName');
        const newUserFriend = new UserFriend();
        let newUserBlockList = blockList.map(f => {
            return { userId: new ObjectId(f.userId), name: f.name }
        });
        newUserFriend.userId = new ObjectId(userId);
        newUserFriend.blockList.list = newUserBlockList;
        newUserFriend.userName = foundUser.userName;

        await newUserFriend.save();
    }
    else {

        let updateBlockList = [...isUserExist.blockList.list, ...blockList];
        let updateFriendList = isUserExist.friendList.list.filter(f => !blockList.find(blockUser => blockUser.userId === f.userId.toString()));

        await UserFriend.findOneAndUpdate(
            { "userId": userId },
            {
                "$set": {
                    "blockList.list" : updateBlockList,
                    "friendList.list" : updateFriendList
                }
            });

    }
    return getFriendListBlockList({ userId: userId });
}

async function unFriend(param) {
    let userId = param.userId;
    let friendList = param.friendList;
    let result = await UserFriend.findOne({ userId: userId }).select("friendList.list");
    let updateList = result.friendList.list.filter(u => {
        return !friendList.some(f => f.name === u.name);
    });

    await UserFriend.findOneAndUpdate(
        {
            userId: userId
        },
        { $set: { "friendList.list": updateList } }
    );

    return getFriendListBlockList({ userId: userId });
}

async function unBlock(param) {
    let userId = param.userId;
    let unblockFriends = param.unblockFriends;
    //let blockFriends = param.blockFriends;

    let result = await UserFriend.findOne({ userId: userId }).select("blockList.list");

    let updateList = result.blockList.list.filter(u => {
        return !unblockFriends.some(f => f.name === u.name);
    });

    await UserFriend.findOneAndUpdate(
        {
            userId: userId
        },
        { $set: { "blockList.list": updateList } }
    );
    return getFriendListBlockList({ userId: userId });
}

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

async function getFriendListBlockList(param) {
    let friendList = [];
    let blockList = [];

    let lists = await UserFriend.findOne(param);
    if (!isNull(lists)) {
        friendList = lists.friendList.list.map(friend => ({ checked: false, friend: friend }));
        blockList = lists.blockList.list.map(friend => ({ checked: false, friend: friend }));
    }

    return { friendList: friendList, blockList: blockList };
}
