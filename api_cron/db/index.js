const mongoose = require('mongoose');
const config = require('../db/config');

// let { connectHost, connectDbLandLog, connectDbGame } = config;
let { connectHost, connectDbLandLog,connectDbGame } = config;
var mongoConfig = {};
mongoose.set('useCreateIndex', true);

if (connectHost === 'mongodb://localhost/blood-db') {
    mongoConfig = {
        useNewUrlParser: true,
    };
} else {
    mongoConfig = {
        useNewUrlParser: true,
        useCreateIndex: true,
        auto_reconnect: true,
        connectTimeoutMS: 3600000,
        keepAlive: 3600000,
        socketTimeoutMS: 3600000,
        numberOfRetries: 10,
        readPreference: 'primaryPreferred'
    };
}

var bloodDB = mongoose.createConnection(connectHost, mongoConfig);
var landLogDB = mongoose.createConnection(connectDbLandLog, mongoConfig);
var bloodGameDB = mongoose.createConnection(connectDbGame,mongoConfig);

module.exports = {
    bloodDB,
    landLogDB,
    bloodGameDB
};
