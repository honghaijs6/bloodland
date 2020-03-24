const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient();

module.exports = {
    client,
    ...client,
    createClient,
    setRedis,
    deleteKey,
    deleteAllKey,
    getAwait,
    checkExist,
    setExpire,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    keysAsync: promisify(client.keys).bind(client)
};

function createClient(redisHost, redisPort) {
    const redisConnect = redis.createClient({
        host: redisHost,
        port: redisPort
    });

    redisConnect.on('connect', function() {
        console.log('Redis default connection open to: ' + redisHost + ':' + redisPort);
    });
    redisConnect.on('error', function (err) {
        console.log('Redis ' + err);
    });
}

function setRedis(key,value)
{
    client.set(key, JSON.stringify(value));
}

function deleteKey(key)
{
    client.del(key);
}

function deleteAllKey()
{
    client.keys("*", function (err, keys) {
        keys.forEach(function (key, pos) {
            client.del(key);
        });
    });
}

function getAwait(key)
{
    const getAsync = promisify(client.get).bind(client);
    return getAsync(key).then(function(res) {
        return JSON.parse(res);
    });
}

function checkExist(key){
    const ckExist = promisify(client.exists).bind(client);
    return ckExist(key).then((err, reply) => {
        return reply === 1;
    });
}

function setExpire(key, seconds)
{
    client.expire(key, seconds);
}

// var client = require("../../../helpers/redis");
// client.setRedis("DndComponent key", 'value DndComponent');
// client.setExpire("DndComponent key",60);
// client.checkExist("DndComponent key");
// client.deleteAllKey();
// const getAwait = await client.getAwait("DndComponent key");
// console.log('getAwait',getAwait);
