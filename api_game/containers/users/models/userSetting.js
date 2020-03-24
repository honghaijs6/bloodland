const mongoose = require('mongoose');

const userSettingSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId },
    land:{ //show information land
        showInfo: { type: Boolean, default: true },
        _id : false,
    },
    bgMusic :{ // music on background
        turnOn: { type: Boolean, default: true },
        volume :{ type : Number, default : 100 },
        _id : false,
    },
    effMusic : { // music on click
        turnOn: { type: Boolean, default: false },
        volume :{ type : Number, default : 100 },
        _id : false,
    },
    language:{ type: String, default: 'kr'},
    id : false,
});

userSettingSchema.set('toJSON', { virtuals: true });
module.exports = userSettingSchema;
