const mongoose = require('mongoose');
console.log('node', process.env.NODE_ENV);
const config = require('./config');

let { connectHost, connectDbLandLog, connectDbGame } = config;
console.log({ connectHost, connectDbLandLog, connectDbGame })
var mongoConfig = {};
mongoose.set('useCreateIndex', true);

if (connectHost === 'mongodb://localhost/land-db') {
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
