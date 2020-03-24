const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, trim: true, required: true },
    hash: { type: String, trim: true, required: true},
    email: { type: String, trim: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    wId: { type: String }, // wallet Id
    wSns: [{ type: String }], // wallet Sns
    nid: { type: String,unique:true,index:true }, // wallet Id
    mainWalletAddress: { type: String }, // Main Wallet Address
    wCreatedDate: { type: String }, // Main Wallet Address
    wName: { type: String }, //wallet Name
    wToken: { type: String, trim: true}, //wallet Token
    tokenHash: { type: String, trim: true}, //wallet Token Hash
    goldBlood: { type: Number, default: 0 }, //gold blood used for BloodLand
    bitamin: { type: Number, default: 0 }, //bitamin
    avatar : { data: Buffer, contentType: String},
    role : {type : String, default: 'user'}, //role of user: user, manager
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now }
});

userSchema.set('toJSON', { virtuals: true });
module.exports =  userSchema
