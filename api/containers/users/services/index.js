const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');
const db = require('../../../db/db');
const config = require('../../../db/config');
const isNull = require('lodash.isnull');

var rp = require('request-promise');
const User = db.User;
const UserSetting = db.UserSetting;

module.exports = {
    authenticate,
    loginWallet,
    getAll,
    getById,
    jwtToken,
    getByToken,
    register,
    update,
    delete: _delete,
    socialLogin
};

/**
 * 2019.3.29 Xuân Giao
 * hàm này xác nhân tài khoản // 계정 인증
 * @param { userName, password }
 */
async function authenticate({ userName, password }) {
    let user = await User.findOne({ userName });
    if (user && bCrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        user = await User.findOneAndUpdate({ userName: user.userName }, { $set: { updatedDate: new Date() } }, { new: true });
        const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 4320000 });

        return {
            ...userWithoutHash,
            token
        };
    }
}


//login wallet function waiting review from mr.ko - mr.lee
/**
 * 2019.3.29 Xuân Giao
 * hàm này đăng nhập tài khoản Wallet  // 지갑 계정 그로인
 * @param { req.body.token }
 */
async function loginWallet(req, res) {
    if (req.body.token) {
        //clear thong tin user luu trong cookie
        res.clearCookie("_id", { httpOnly: true });
        res.clearCookie("userName", { httpOnly: true });
        res.clearCookie("firstName", { httpOnly: true });
        res.clearCookie("lastName", { httpOnly: true });
        res.clearCookie("email", { httpOnly: true });
        res.clearCookie("wToken", { httpOnly: true });
        res.clearCookie("wName", { httpOnly: true });
        res.clearCookie("wId", { httpOnly: true });
        res.clearCookie("wSns", { httpOnly: true });
        res.clearCookie("nid", { httpOnly: true });
        res.clearCookie("mainWalletAddress", { httpOnly: true });
        res.clearCookie("wCreatedDate", { httpOnly: true });
        res.clearCookie("token", { httpOnly: true });
        res.clearCookie("role", { httpOnly: true });

        var wToken = req.body.token;
        var email = '';
        var wName = '';
        var wId = '';
        var wSns = '';
        var nid = '';
        var mainWalletAddress = '';
        var wCreatedDate = '';

        await rp({
            method: 'POST',
            uri: 'https://api.wallet.blood.land/api/me',
            body: {
                appId: config.bloodAppId,
                token: wToken,
            },
            json: true
        })
            .then(function (parsedBody) {
                // console.log("parsedBody ------------------->",parsedBody);
                email = typeof parsedBody.user.email !== 'undefined' ? parsedBody.user.email : '';
                wName = typeof parsedBody.user.name !== 'undefined' ? parsedBody.user.name : '';
                wId = typeof parsedBody.user.sid !== 'undefined' ? parsedBody.user.sid : '';
                wSns = typeof parsedBody.user.sns !== 'undefined' ? parsedBody.user.sns : '';
                nid = typeof parsedBody.user.id !== 'undefined' ? parsedBody.user.id : '';
                mainWalletAddress = typeof parsedBody.user.mainWalletAddress !== 'undefined' ? parsedBody.user.mainWalletAddress : '';
                wCreatedDate = typeof parsedBody.user.createdDate !== 'undefined' ? parsedBody.user.createdDate : '';
            }, error => {
                console.error('Api Profile Error: ' + error.message);
            });

        if (typeof nid !== 'undefined') {
            let user = await User.findOne({ nid: nid });
            if (user && bCrypt.compareSync('Abc123#', user.hash)) {
                const { hash, ...userWithoutHash } = user.toObject();
                user = await User.findOneAndUpdate({ userName: user.userName, nid: nid }, { $set: { updatedDate: new Date(), wSns: wSns } }, { new: true })
                // const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 4320000 });
                const token = wToken;
                if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                    res.cookie('token', token, { domain: '.blood.land' });
                } else {
                    res.cookie('token', token);
                }

                // console.log("userWithoutHash-------------->",userWithoutHash);

                if (userWithoutHash) {
                    if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                        res.cookie('_id', JSON.stringify(userWithoutHash._id), { domain: '.blood.land' });
                    } else {
                        res.cookie('_id', JSON.stringify(userWithoutHash._id));
                    }

                    if (typeof userWithoutHash.userName !== 'undefined' && typeof wId !== 'undefined' && wId && wId != null && wId !== userWithoutHash.userName) {
                        await User.findOneAndUpdate({ nid: nid }, { $set: { userName: wId, wId: wId } });
                        if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                            res.cookie('userName', wId, { domain: '.blood.land' });
                            res.cookie('wId', wId, { domain: '.blood.land' });
                        } else {
                            res.cookie('userName', wId);
                            res.cookie('wId', wId);
                        }
                    }
                    else {
                        if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                            res.cookie('userName', userWithoutHash.userName, { domain: '.blood.land' });
                            res.cookie('wId', userWithoutHash.wId, { domain: '.blood.land' });
                        } else {
                            res.cookie('userName', userWithoutHash.userName);
                            res.cookie('wId', userWithoutHash.wId);
                        }
                    }

                    let tokenHash = bCrypt.hashSync(wToken, 10);
                    await User.findOneAndUpdate({ nid: nid }, { $set: { wToken: wToken, tokenHash: tokenHash, wName: wName } });

                    if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                        res.cookie('firstName', userWithoutHash.firstName, { domain: '.blood.land' });
                        res.cookie('lastName', userWithoutHash.lastName, { domain: '.blood.land' });
                        res.cookie('email', userWithoutHash.email, { domain: '.blood.land' });
                        res.cookie('role', userWithoutHash.role, { domain: '.blood.land' });
                        res.cookie('wToken', wToken, { domain: '.blood.land' });
                        res.cookie('wName', wName, { domain: '.blood.land' });
                        res.cookie('wSns', wSns, { domain: '.blood.land' });
                        res.cookie('nid', nid, { domain: '.blood.land' });
                        res.cookie('mainWalletAddress', mainWalletAddress, { domain: '.blood.land' });
                        res.cookie('wCreatedDate', wCreatedDate, { domain: '.blood.land' });
                    } else {
                        res.cookie('firstName', userWithoutHash.firstName);
                        res.cookie('lastName', userWithoutHash.lastName);
                        res.cookie('email', userWithoutHash.email);
                        res.cookie('role', userWithoutHash.role);
                        res.cookie('wToken', wToken);
                        res.cookie('wName', wName);
                        res.cookie('wSns', wSns);
                        res.cookie('nid', nid);
                        res.cookie('mainWalletAddress', mainWalletAddress);
                        res.cookie('wCreatedDate', wCreatedDate);
                    }
                }
                return {
                    ...userWithoutHash,
                    token
                };
            } else {
                //create new user if no exist
                const newUser = new User();
                newUser.email = email;
                newUser.userName = typeof wId !== 'undefined' && wId ? wId : email;
                newUser.lastName = wName;
                newUser.firstName = wName;
                newUser.wName = wName;
                newUser.wSns = wSns;
                newUser.nid = nid;
                newUser.mainWalletAddress = mainWalletAddress;
                newUser.wCreatedDate = wCreatedDate;
                newUser.wId = typeof wId !== 'undefined' && wId && wId != null ? wId : '';
                newUser.wToken = wToken;
                newUser.tokenHash = bCrypt.hashSync(wToken, 10);
                newUser.hash = bCrypt.hashSync('Abc123#', 10);
                let savedUser = await newUser.save();

                // console.log("savedUser----------------->",savedUser);

                if (savedUser && bCrypt.compareSync('Abc123#', savedUser.hash)) {
                    const { hash, ...userWithoutHash } = savedUser.toObject();
                    savedUser = await User.findOneAndUpdate({ userName: savedUser.userName }, { $set: { updatedDate: new Date() } }, { new: true });
                    // const token = jwt.sign({ sub: savedUser.id, date: savedUser.updatedDate, name: savedUser.userName }, config.secret, { expiresIn: 4320000 });
                    const token = wToken;
                    if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                        res.cookie('token', token, { domain: '.blood.land' });
                    } else {
                        res.cookie('token', token);
                    }

                    let userSetting = new UserSetting();
                    userSetting.userId = savedUser._id;
                    await userSetting.save();

                    if (userWithoutHash) {
                        if (config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land') {
                            res.cookie('_id', JSON.stringify(userWithoutHash._id), { domain: '.blood.land' });
                            res.cookie('userName', userWithoutHash.userName, { domain: '.blood.land' });
                            res.cookie('firstName', userWithoutHash.firstName, { domain: '.blood.land' });
                            res.cookie('lastName', userWithoutHash.lastName, { domain: '.blood.land' });
                            res.cookie('email', userWithoutHash.email, { domain: '.blood.land' });
                            res.cookie('wToken', userWithoutHash.wToken, { domain: '.blood.land' });
                            res.cookie('wName', userWithoutHash.wName, { domain: '.blood.land' });
                            res.cookie('wSns', userWithoutHash.wSns, { domain: '.blood.land' });
                            res.cookie('nid', userWithoutHash.nid, { domain: '.blood.land' });
                            res.cookie('mainWalletAddress', userWithoutHash.mainWalletAddress, { domain: '.blood.land' });
                            res.cookie('wCreatedDate', userWithoutHash.wCreatedDate, { domain: '.blood.land' });
                            res.cookie('wId', userWithoutHash.wId, { domain: '.blood.land' });
                            res.cookie('role', userWithoutHash.role, { domain: '.blood.land' });
                        }
                        else {
                            res.cookie('_id', JSON.stringify(userWithoutHash._id));
                            res.cookie('userName', userWithoutHash.userName);
                            res.cookie('firstName', userWithoutHash.firstName);
                            res.cookie('lastName', userWithoutHash.lastName);
                            res.cookie('email', userWithoutHash.email);
                            res.cookie('wToken', userWithoutHash.wToken);
                            res.cookie('wName', userWithoutHash.wName);
                            res.cookie('wSns', userWithoutHash.wSns);
                            res.cookie('nid', userWithoutHash.nid);
                            res.cookie('mainWalletAddress', userWithoutHash.mainWalletAddress);
                            res.cookie('wCreatedDate', userWithoutHash.wCreatedDate);
                            res.cookie('wId', userWithoutHash.wId);
                            res.cookie('role', userWithoutHash.role);
                        }
                    }
                    return {
                        ...userWithoutHash,
                        token
                    };
                }
                else
                    throw new Error("Error to login Wallet");
            }
        }
        else
            throw new Error("Error to login Wallet");
    }
    return false
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy tất cả thông tin thành viên  // 사용자의 모든 정보 가져옴
 * @param { req.body.token }
 */
async function getAll() {
    return await User.find().select('-hash');
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này lấy thông tin thành viên bởi Id  // 아이디로 사용자의 모든 정보 가져옴
 * @param { id }
 */
async function getById(id) {
    return await User.findById(id).select('-hash');
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này kiểm tra thông tin jwt token  // JWT  토튼의 정보 확인
 * @param { token }
 */
async function jwtToken(param) {
    return await User.findOne(param);
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này kiểm tra lấy thông tin thành viên  bởi token  // 토큰으로 회원의 정보 가져옴
 * @param { token }
 */
async function getByToken(param) {
    // console.log("---------------------- > client get token in this function ------------------------- >");
    if (typeof param.token === 'undefined' || !param.token)
        return { token: '' };

    if (process.env.NODE_ENV !== 'development') {
        var user = await User.findOne({ wToken: param.token });
        if (!isNull(user) && (bCrypt.compareSync(param.token, user.tokenHash))) {
            let updatedDate = (user.updatedDate);
            let now = (new Date().getTime());
            let timeFromUpdateDate = now - updatedDate; //millisecond
            timeFromUpdateDate = Math.floor(timeFromUpdateDate / 1000);
            if (timeFromUpdateDate > config.tokenTime)
                return { token: '' };
            const token = user.wToken;
            const { hash, ...userWithoutHash } = user.toObject();
            return {
                ...userWithoutHash,
                token
            };
        }
        else
            return { token: '' };
    } else {
        let decoded = await verifyToken(param);

        if (typeof decoded.sub !== 'undefined' && decoded.sub !== '' && decoded.sub && typeof decoded.name !== 'undefined' && decoded.name !== '' && decoded.name) {
            let user = await User.findOneAndUpdate({ _id: decoded.sub, userName: decoded.name }, { $set: { updatedDate: new Date() } }, { new: true });
            if (user) {
                const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 4320000 });
                const { hash, ...userWithoutHash } = user.toObject();
                return {
                    ...userWithoutHash,
                    token
                };
            }
            else
                return { token: '' };
        }
    }

    return { token: '' };
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này giả mã token   //  토큰 복호화
 * @param { token }
 */
function verifyToken(param) {
    return new Promise((resolve, reject) => {
        jwt.verify(param.token, config.secret, async function (err, decoded) {
            if (err) resolve({});
            resolve(decoded);
        });
    })
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này đăng ký thành viên mới  // 회원 가입
 * @param { userName, email, firstName, lastName, password }
 */
async function register(param) {
    if (param.userName !== '' && await User.findOne({ userName: param.userName })) {
        throw new Error('Username "' + param.userName + '" is already taken');
    }
    if (param.email !== '' && await User.findOne({ email: param.email })) {
        throw new Error('Email "' + param.email + '" is already taken');
    }

    const user = new User();
    user.userName = param.userName;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.email = param.email;

    // if (param.email.length > 0) {    //
    //     const message = {
    //         from: 'Blood Land',
    //         to: param.email,
    //         subject: 'Blood land notification',
    //         text: 'thanks for use our app',
    //     };
    //     config.sendEmail(message);
    // }

    if (param.password)
        user.hash = bCrypt.hashSync(param.password, 10);

    let savedUser = await user.save();
    if (savedUser) {
        let userSetting = new UserSetting();
        userSetting.userId = savedUser._id;
        await userSetting.save();
    }
    return savedUser;
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này cập nhật dữ liệu thành viên  // 회원 데이터 업데이터
 * @param { userName, password, image data }
 */
async function update(param, files) {
    const user = await User.findById(param.id);
    if (!user) throw new Error('User not found');
    if (user.userName !== param.userName && await User.findOne({ userName: param.userName })) {
        throw new Error('Username "' + param.userName + '" is already taken');
    }

    if (param.password)
        param.hash = bCrypt.hashSync(param.password, 10);

    Object.assign(user, param);
    user.avatar.contentType = 'image/jpeg';
    user.avatar.data = files.imageUser.data;

    return await user.save();
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này xóa thành viên  // 회원 삭제
 * @param { id }
 */
async function _delete(id) {
    await User.findByIdAndRemove(id);
}

/**
 * 2019.3.29 Xuân Giao
 * hàm này đăng nhập mạng xã hội  // 소셜 네트워크 계정로 그로인
 * @param { id }
 */
async function socialLogin(user) {
    let userName = user.userName;
    const userCheck = await User.findOne({ userName: userName });
    return (userCheck) ? { result: true, user: userCheck } : { result: false, user: null };
}
