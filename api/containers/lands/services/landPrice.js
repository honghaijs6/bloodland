const rp = require("request-promise");
const db = require('../../../db/db');
const cheerio = require('cheerio');
const MIN_ONE_LAND = 43582;

// (async () => {
//     console.log('getPriceOneLand', await getPriceOneLand())
// })()

async function getDefaultPrice() {
    let { landPrice } = await db.LandConfig.findOne({});
    const landFee = 0;
    landPrice = Math.max(landPrice || MIN_ONE_LAND);
    //console.log('{ landPrice }', { landPrice }, landFee);
    return { defaultLandPrice: landPrice, defaultLandFee: landFee };
}

async function setLandPrice(){
    const landFee = 0;
    let landPrice = await getPriceOneLand();
    landPrice = parseFloat(landPrice).toFixed(0) || 0;

    let insertOne = await (new db.LandDefaultPriceHistory({ landPrice }).save());
    console.log('insertOne', insertOne);

    return (new db.LandConfig({ landPrice, landFee })).save();
}

async function updateLandPrice(){
    const landFee = 0;
    let landPrice = await getPriceOneLand();
    landPrice = parseFloat(landPrice).toFixed(0) || 0;

    let insertOne = await (new db.LandDefaultPriceHistory({ landPrice }).save());
    console.log('updateLandPrice', insertOne);

    return db.LandConfig.findOneAndUpdate({ landPrice: { $gt: 0 } }, { $set: { landPrice, landFee } });
}

async function getPriceOneLand() {
    //const [oneUSD, oneBlood] = await Promise.all([getUSD(), getBlood()]);
    const [oneUSD, oneBlood] = await Promise.all([getUSD(), getPriceNew()]);
    const tenUSD = 10*parseFloat(oneUSD);
    let oneLandPrice = parseFloat(tenUSD/parseFloat(oneBlood)) || MIN_ONE_LAND;
    return Math.max(oneLandPrice, MIN_ONE_LAND);
}

function getUSD() {
    return rp('http://free.currencyconverterapi.com/api/v6/convert?q=USD_KRW&compact=ultra&apiKey=3d04b633401cb81a91cf')
        .then(function (body) {
            let json = JSON.parse(body);
            return json.USD_KRW || 0;
        })
        .catch(function (err) {
            return -1;
        });
}

function getBlood() {
    return rp({
        uri: 'https://behind.io/orders/new?coin=BLOOD&order_type=buy',
        transform: function (body) {
            return cheerio.load(body);
        }
    })
        .then(function ($) {
            let bloodPrice = $('body').find('.price ins').html();
            //console.log('bloodPrice', bloodPrice);
            return bloodPrice;
        })
        .catch(function (err) {
            return -1;
        });
}

module.exports = {
    getDefaultPrice,
    setLandPrice,
    updateLandPrice,
}