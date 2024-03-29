﻿const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const sortBy = require('lodash.sortby');

const UserFriend = db.UserFriend;
const UserMail = db.UserMail;

module.exports = {
    send,
    read,
    deleteSentMail,
    deleteReceivedMail,
    getAll,
    adminSendMail
};

const MAIL_STATUS = {
    unread: 0,
    read: 1,
    deleted: 2,
    blocked: 3
};


async function send(param) {

    for (let eachMail of param) {
        let fromId = new ObjectId(eachMail.fromId);
        let fromName = eachMail.fromName;
        let toId = new ObjectId(eachMail.toId);
        let toName = eachMail.toName;

        let mail = {
            title: eachMail.title,
            content: eachMail.content,
            fromId: fromId,
            fromName: fromName,
            toId: toId,
            toName: toName,
        };

        const sentMailsUser = await UserMail.findOne({ userId: fromId });
        if (isNull(sentMailsUser)) {
            const senderMail = new UserMail();
            senderMail.userId = fromId;
            senderMail.sentList = [mail];
            await senderMail.save();
        } else
            await UserMail.findOneAndUpdate({ userId: fromId }, { $push: { sentList: mail } });

        const checkBlock = await UserFriend.findOne({ $and: [{ "userId": fromId }, { "blockList.list.userId": toId }] });
        const checkBlock_2 = await UserFriend.findOne({ $and: [{ "userId": toId }, { "blockList.list.userId": fromId }] });

        mail = {
            title: eachMail.title,
            content: eachMail.content,
            fromId: fromId,
            fromName: fromName,
            toId: toId,
            toName: toName,
            status: isNull(checkBlock) ? MAIL_STATUS.unread : MAIL_STATUS.blocked
        };

        if (isNull(checkBlock) && isNull(checkBlock_2)) {
            const receivedMailsUser = await UserMail.findOne({ userId: toId });
            if (isNull(receivedMailsUser)) {
                const receivedMail = new UserMail();
                receivedMail.userId = toId;
                receivedMail.receivedList = [mail];
                await receivedMail.save();
            } else
                await UserMail.findOneAndUpdate({ userId: toId }, { $push: { receivedList: mail } });
        }
    }
    let data = await getAll({userId: param[0].fromId});
    return data;
}

async function read(param) {
    let userId = new ObjectId(param.userId);
    let mailId = new ObjectId(param.mailId);
    await UserMail.findOneAndUpdate(
        { "userId": userId, "receivedList._id": mailId },
        { $set: { "receivedList.$.status": MAIL_STATUS.read } });

    return getAll(param);
}

async function deleteSentMail(param) {
    let emailIdArr = param.emailIdArr;
    let userId = new ObjectId(param.userId);

    const userMail = await UserMail.findOne({ "userId": userId })
        .select("sentList -_id");

    let sentList = userMail.sentList;

    sentList = sentList.map(m => {
        if (emailIdArr.includes(m._id.toString())) {
            m.status = MAIL_STATUS.deleted;
        }
        return m;
    });

    await UserMail.findOneAndUpdate({ "userId": userId }, { $set: { sentList: sentList } });
    return getAll(param);
}

async function deleteReceivedMail(param) {
    let userId = new ObjectId(param.userId);
    let emailIdArr = param.emailIdArr;

    const userMail = await UserMail.findOne({ "userId": userId })
        .select("receivedList -_id");

    let receivedList = userMail.receivedList;

    receivedList = receivedList.map(m => {
        if (emailIdArr.includes(m._id.toString())) {
            m.status = MAIL_STATUS.deleted;
        }
        return m;
    });

    await UserMail.findOneAndUpdate({ "userId": userId }, { $set: { receivedList: receivedList } });
    return getAll(param);
}

async function getAll(param) {
    let userId = new ObjectId(param.userId);
    const userMail = await UserMail.findOne({ "userId": userId })
        .select("sentList receivedList -_id");

    let sentList = userMail ? userMail.sentList : [];
    let receivedList = userMail ? userMail.receivedList : [];

    if (Array.isArray(sentList)) {
        sentList = sentList.filter(m => m.status !== MAIL_STATUS.deleted);
    }
    if (Array.isArray(receivedList)) {
        receivedList = receivedList.filter(m => m.status !== MAIL_STATUS.deleted && m.status !== MAIL_STATUS.blocked);
    }

    sentList = sentList.map(mail => ({ checked: false, mail: mail }));
    receivedList = receivedList.map(mail => ({ checked: false, mail: mail }));
    sentList = sortBy(sentList, 'createdDate').reverse();
    receivedList = sortBy(receivedList, 'createdDate').reverse();
    return {
        sentList,
        receivedList
    }
}

// {fromName,toName,title,content}
async function adminSendMail(param) {
    //console.log("param ->",param);
    //admin nè
    // let fromName = param.fromName;
    // let toName = param.toName
    let mail = {
        fromName: param.fromName,
        toName: param.toName,
        toId: param.toId,
        title: param.title,
        content: param.content,
        status: 0
    }

    let receiver = await UserMail.findOne({ userId: ObjectId(param.toId) });


    if (isNull(receiver)) {
        const receiverMail = new UserMail();
        receiverMail.userId = new ObjectId(param.toId);
        receiverMail.receivedList = [mail];
        return await receiverMail.save();
    } else {
        return await UserMail.findOneAndUpdate({ userId: param.toId }, { $push: { receivedList: mail } }, { new: true });
    }

}
