// process.env.NODE_ENV = 'development';
const db = require('../../../db/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const sortBy = require('lodash.sortby');

const UserFriend = db.UserFriend;
const UserMail = db.UserMail;

module.exports = {
    send,
    read,
    readManyMail,
    deleteSentMail,
    deleteReceivedMail,
    getAll,
    adminSendMail,
    haveNewMails
};

const MAIL_STATUS = {
    unread: 0,
    read: 1,
    deleted: 2,
    blocked: 3
};


// (async () => {
//     const userId = ObjectId("5d10547db6b0b21414e97e40");
//     const mailIds = [ObjectId("5d10a4a4b363ca122c44d07d"), ObjectId("5d10a4b5341cb539a4915d81"), ObjectId("5d10a4c0341cb539a4915d85")]
//     let k = await readManyMail({ userId, mailIds });
//     console.log('k', k);
// })()


/**
 * 2019.3.29 Xuân Giao
 * hàm này gửi mail cho bạn  // 친구에게 이매일 보냄
 * @param { fromId, fromName, toId, toName, title, content }
 */
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
            await UserMail.findOneAndUpdate({ userId: fromId }, { $push: { sentList: mail } }).lean();

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

/**
 * 2019.3.29 Xuân Giao
 * hàm này đọc mail  // 이메일 읽었는 상태
 * @param { userId }
 */
async function read({ userId, mailId }) {
    let success = true;
    const updating = await UserMail.findOneAndUpdate(
        { "userId": userId, "receivedList._id": mailId },
        { $set: { "receivedList.$.status": MAIL_STATUS.read } }, 
        { new: true }).lean();
    const data = getMails(updating);
    return { readStatus: success,...data};
}


/**
* /users/mails/readManyMail
* Đọc nhiều mail
* @param { userId, mailIds }
* userId
* mailIds: danh sách mail Id dạng [mailId1, mailId2]
*/
async function readManyMail({ userId, mailIds }) {
    const updating = await db.UserMail.findOneAndUpdate(
        { userId },
        { $set: { "receivedList.$[mail].status": MAIL_STATUS.read } },
        {
            arrayFilters: [{ "mail._id": { $in: mailIds } }],
            new: true
        }
    )
    //console.log('updating',updating);
    const data = getMails(updating);
    return { readStatus: true, ...data };
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này xóa mail đã gửi  // 보낸 이메일 삭제
 * @param { userId }
 */
async function deleteSentMail(param) {
    try{
        let emailIdArr = param.emailIdArr;
        let userId = new ObjectId(param.userId);
    
        const userMail = await UserMail.findOne({ "userId": userId })
            .select("sentList -_id");
    
        let {sentList} = userMail;
    
        sentList = sentList.map(m => {
            if (emailIdArr.includes(m._id.toString())) {
                m.status = MAIL_STATUS.deleted;
            }
            return m;
        });

        let success = true;
        const updating = await UserMail.findOneAndUpdate({ "userId": userId }, { $set: { sentList: sentList } }, { new: true },(err, doc) => {
            if (err) {
                success = false;
                console.log("Something wrong when updating data!");
            }
        }).lean();
        const data = getMails(updating);
        return { deleteMailStatus: success,...data};
    }catch(err){
        const data = await getAll(param);
        return { deleteMailStatus: false,...data};
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này xóa mail đã nhận  // 받은 이메일 삭제
 * @param { userId }
 */
async function deleteReceivedMail(param) {
    try{
        let userId = new ObjectId(param.userId);
        let emailIdArr = param.emailIdArr;
        console.log('emailIdArr',emailIdArr);

        const userMail = await UserMail.findOne({ "userId": userId })
            .select("receivedList -_id");

        let {receivedList} = userMail;

        receivedList = receivedList.map(m => {
            if (emailIdArr.includes(m._id.toString())) {
                m.status = MAIL_STATUS.deleted;
            }
            return m;
        });

        let success = true;
        const updating = await UserMail.findOneAndUpdate({ "userId": userId }, { $set: { receivedList: receivedList } }, { new: true },(err, doc) => {
            if (err) {
                success = false;
                console.log("Something wrong when updating data!");
            }
        }).lean();
        const data = getMails(updating);
        return { deleteMailStatus: success,...data};
    }
    catch(err){
        const data = await getAll(param);
        return { deleteMailStatus: false,...data};
    }
}

function getMails(userMail) {
    try{
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
    }catch(err){
        return {status:false,error:err,sentList:[],receivedList:[]};
    }
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy tất cả thông tin email  // 이메일의 무든 정보 가져옴
 * @param { userId }
 */
async function getAll(param) {
    try{
        let userId = new ObjectId(param.userId);
        const userMail = await UserMail.findOne({ "userId": userId })
            .select("sentList receivedList -_id").lean();
        return getMails(userMail);
    }catch(err){
        return {status:false,error:err,sentList:[],receivedList:[]};
    }
}

// (async () => {
//     console.log("vao day");
//     const result = await haveNewMails({userId:"5cff2234042c7f20286bb89c"});
//     console.log('test vao day',result);
// })();
//vuonglt Quan add check new mails 
async function haveNewMails({userId}) {
    try{
        const result = await UserMail.aggregate([
            { $match: { userId: ObjectId(userId) } },
            { $project: {
                    unreads: {
                        $size: {
                            $filter: { 
                                input: "$receivedList",
                                as: "mail",
                                cond: { $eq: ["$$mail.status", 0] }
                            }
                        }
                    }
                } 
            }
        ]);
        return  {status:true, unreads: result[0].unreads};
    }catch(err){
        return {status:false,error:err};
    }
}


/**
 * 2019.3.29 Xuân Giao
 * hàm này admin gửi email  // 관리자가 이메일 보냄
 * @param { fromName, toName, toId, title, content }
 */
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
    };

    let receiver = await UserMail.findOne({ userId: ObjectId(param.toId) });

    if (isNull(receiver)) {
        const receiverMail = new UserMail();
        receiverMail.userId = new ObjectId(param.toId);
        receiverMail.receivedList = [mail];
        return await receiverMail.save();
    } else {
        return await UserMail.findOneAndUpdate({ userId: param.toId }, { $push: { receivedList: mail } }, { new: true }).lean();
    }

}
