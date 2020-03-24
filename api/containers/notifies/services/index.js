const db = require('../../../db/db');
const Notify = db.Notify;
const userMailService = require('../../users/services/mails');
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    getById,
    updateStatus,
    send
};

async function getById(param) {
    return await Notify
        .find({ userId: new ObjectId(param.id) })
        .sort({ status: false, _id: -1 });
}

async function updateStatus(param) {
    return await Notify.findByIdAndUpdate(param.id, { $set: { status: true } });
}

async function send(param) {
    // const newNotify = new Notify(param);
    // return await newNotify.save();
    return await userMailService.adminSendMail({
        fromName: 'Blood land',
        toName: typeof param.userName !== 'undefined' ? param.userName : '',
        toId: param.userId,
        title: param.title,
        content: param.content
    });
}