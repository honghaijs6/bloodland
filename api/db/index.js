const mongoose = require('mongoose');
const config = require('../db/config');
const { connectHost, connectDbLandLog, connectDbGame } = config;

//To fix all deprecation warnings
//Read at https://mongoosejs.com/docs/deprecations.html for more a more detailed description of each deprecation warning
let mongoConfig = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

if (process.env.NODE_ENV === "production") {
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

module.exports = {
    bloodDB: mongoose.createConnection(connectHost, mongoConfig),
    landLogDB: mongoose.createConnection(connectDbLandLog, mongoConfig),
    bloodGameDB: mongoose.createConnection(connectDbGame, mongoConfig)
};
