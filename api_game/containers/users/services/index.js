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

async function authenticate({ userName, password }) {
    let user = await User.findOne({ userName });
    if (user && bCrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        user = await User.findOneAndUpdate({ userName: user.userName }, { $set: { updatedDate: new Date() } }, { new: true });
        const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 5 * 60 });

        return {
            ...userWithoutHash,
            token
        };
    }
}

async function loginWallet(req, res) {
    if (req.body.token) {
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

        if (typeof email !== 'undefined') {
            let user = await User.findOne({ email: email });
            if (user && bCrypt.compareSync('Abc123#', user.hash)) {
                const { hash, ...userWithoutHash } = user.toObject();
                user = await User.findOneAndUpdate({ userName: user.userName }, { $set: { updatedDate: new Date(), wSns: wSns } }, { new: true });
                // const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 5 * 60 });
                const token = wToken;
                if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                    res.cookie('token', token, { domain: '.blood.land'});
                } else{
                    res.cookie('token', token);
                }

                if (userWithoutHash) {
                    if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                        res.cookie('_id', JSON.stringify(userWithoutHash._id), { domain: '.blood.land'});
                    } else {
                        res.cookie('_id', JSON.stringify(userWithoutHash._id));
                    }

                    if (typeof userWithoutHash.userName !== 'undefined' && typeof wId !== 'undefined' && wId && wId != null && wId !== userWithoutHash.userName) {
                        await User.findOneAndUpdate({ email: email }, { $set: { userName: wId, wId: wId } });
                        if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                            res.cookie('userName', wId, { domain: '.blood.land'});
                            res.cookie('wId', wId, { domain: '.blood.land'});
                        } else {
                            res.cookie('userName', wId);
                            res.cookie('wId', wId);
                        }
                    }
                    else {
                        if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                            res.cookie('userName', userWithoutHash.userName, { domain: '.blood.land'});
                            res.cookie('wId', userWithoutHash.wId, { domain: '.blood.land'});
                        } else {
                            res.cookie('userName', userWithoutHash.userName);
                            res.cookie('wId', userWithoutHash.wId);
                        }
                    }

                    let tokenHash = bCrypt.hashSync(wToken, 10);
                    await User.findOneAndUpdate({ email: email }, { $set: { wToken: wToken, tokenHash: tokenHash, wName: wName } });

                    if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                        res.cookie('firstName', userWithoutHash.firstName, { domain: '.blood.land'});
                        res.cookie('lastName', userWithoutHash.lastName, { domain: '.blood.land'});
                        res.cookie('email', userWithoutHash.email, { domain: '.blood.land'});
                        res.cookie('role', userWithoutHash.role, { domain: '.blood.land'});
                        res.cookie('wToken', wToken, { domain: '.blood.land'});
                        res.cookie('wName', wName, { domain: '.blood.land'});
                        res.cookie('wSns', wSns, { domain: '.blood.land'});
                        res.cookie('nid', nid, { domain: '.blood.land'});
                        res.cookie('mainWalletAddress', mainWalletAddress, { domain: '.blood.land'});
                        res.cookie('wCreatedDate', wCreatedDate, { domain: '.blood.land'});
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

                if (savedUser && bCrypt.compareSync('Abc123#', savedUser.hash)) {
                    const { hash, ...userWithoutHash } = savedUser.toObject();
                    savedUser = await User.findOneAndUpdate({ userName: savedUser.userName }, { $set: { updatedDate: new Date() } }, { new: true });
                    // const token = jwt.sign({ sub: savedUser.id, date: savedUser.updatedDate, name: savedUser.userName }, config.secret, { expiresIn: 5 * 60 });
                    const token = wToken;
                    if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                        res.cookie('token', token, { domain: '.blood.land'});
                    }else{
                        res.cookie('token', token);
                    }

                    let userSetting = new UserSetting();
                    userSetting.userId = savedUser._id;
                    await userSetting.save();

                    if (userWithoutHash) {
                        if (config.clientHost === 'https://blood.land'||config.clientHost === 'https://working.blood.land') {
                            res.cookie('_id', JSON.stringify(userWithoutHash._id), { domain: '.blood.land'});
                            res.cookie('userName', userWithoutHash.userName, { domain: '.blood.land'});
                            res.cookie('firstName', userWithoutHash.firstName, { domain: '.blood.land'});
                            res.cookie('lastName', userWithoutHash.lastName, { domain: '.blood.land'});
                            res.cookie('email', userWithoutHash.email, { domain: '.blood.land'});
                            res.cookie('wToken', userWithoutHash.wToken, { domain: '.blood.land'});
                            res.cookie('wName', userWithoutHash.wName, { domain: '.blood.land'});
                            res.cookie('wSns', userWithoutHash.wSns, { domain: '.blood.land'});
                            res.cookie('nid', userWithoutHash.nid, { domain: '.blood.land'});
                            res.cookie('mainWalletAddress', userWithoutHash.mainWalletAddress, { domain: '.blood.land'});
                            res.cookie('wCreatedDate', userWithoutHash.wCreatedDate, { domain: '.blood.land'});
                            res.cookie('wId', userWithoutHash.wId, { domain: '.blood.land'});
                            res.cookie('role', userWithoutHash.role, { domain: '.blood.land'});
                        }
                        else{
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

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function jwtToken(param) {
    return await User.findOne(param);
}

async function getByToken(param) {
    if (typeof param.token === 'undefined' || !param.token)
        return { token: '' };

    if (process.env.NODE_ENV !== 'development') {
        var user = await User.findOne({ wToken: param.token });
        if (!isNull(user)&&(bCrypt.compareSync(param.token, user.tokenHash))) {
            let updatedDate = (user.updatedDate);
            let now = (new Date().getTime());
            let timeFromUpdateDate = now - updatedDate; //millisecond
            timeFromUpdateDate = Math.floor(timeFromUpdateDate / 1000);
            if(timeFromUpdateDate > config.tokenTime)
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
                // const token = jwt.sign({ sub: user.id, date: user.updatedDate, name: user.userName }, config.secret, { expiresIn: 5 * 60 });
                const token = user.wToken;
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

function verifyToken(param) {
    return new Promise((resolve, reject) => {
        jwt.verify(param.token, config.secret, async function (err, decoded) {
            if (err) resolve({});
            resolve(decoded);
        });
    })
}

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

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function socialLogin(user) {
    let userName = user.userName;
    const userCheck = await User.findOne({ userName: userName });
    return (userCheck) ? { result: true, user: userCheck } : { result: false, user: null };
}
