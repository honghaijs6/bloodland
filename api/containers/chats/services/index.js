const db = require('../../../db/db');
const Chat = db.Chat;
const omit = require('lodash.omit');
const isNil = require('lodash.isnil');
const UserFriend = db.UserFriend
const ObjectId = require('mongoose').Types.ObjectId;
const UserFriendService = require('./../../users/services/friends');

module.exports = {
    getAll,
    create,
    createMess,
    getAllMessInRoom,
    getMessInRoomByOffset
};

async function getAll() {
    return await Chat.find();
}

async function create(param, files) {
    if (await Chat.findOne({ name: param.name })) {
        throw 'ChatroomName "' + param.name + '" is already taken';
    }

    const newChat = new Chat();
    newChat.name = param.name;

    if (files && files.imageFile) {
        newChat.image.contentType = 'image/jpeg';
        newChat.image.data = files.imageFile.data;
    }

    await newChat.save();
}



async function createMess(param) {

    let userId = param.user.userId;

    let name = param.room;
    let message = omit(param, 'room');

    delete message.user.userId;

    let uniqueUserName = await UserFriendService.getBeBlockedUser({userId});

    message.noDisplayUsers = uniqueUserName;

    let updatedChat = await Chat.findOneAndUpdate({ name: name }, { $push: { messages: message } }, { new: true });

    let lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    return lastMessage;
}

async function getAllMessInRoom({ roomName, user }) {

    let isExist = await Chat.findOne({ name: roomName }).lean().select('messages');

    if (!isNil(isExist)) {
        let messages = isExist.messages.filter(m => !m.noDisplayUsers.includes(user.userName));
        let startIndex = messages.length <= 20 ? 0 : messages.length - 20;
        return messages.splice(startIndex, 20);
    } else {
        let newRoom = new Chat();
        newRoom.messages = [];
        newRoom.name = roomName;
        await newRoom.save();
        return [];
    }
}

async function getMessInRoomByOffset(param) {
    let roomName = param.roomName;
    let n = param.n;
    let topMessIndex = param.topMessIndex;

    let MessageList = await Chat.findOne({ name: roomName }).lean().select('messages');
    let messages = MessageList.messages
    // let messages = MessageList.messages.filter(mess => {
    //     return !mess.block.includes(userName);
    // });

    topMessIndex = messages.length - 1 - topMessIndex;


    if (!isNil(MessageList)) {
        if (topMessIndex >= 0) {

            let endIndex = topMessIndex - 1;
            let startIndex = endIndex - 20 < 0 ? 0 : endIndex - 20;

            let MessageByOffset = MessageList.messages.slice(startIndex, endIndex + 1);

            let nextN = startIndex === 0 ? -1 : n + 1;
            return {
                nextN: nextN,
                messages: MessageByOffset.length > 0 ? MessageByOffset : []
            }
        }
    }
    return {
        nextN: -1,
        messages: []
    }
}