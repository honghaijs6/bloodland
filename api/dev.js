const mongoose = require('mongoose');
const groupBy = require('lodash.groupby');
const isEqual = require('lodash.isequal');
const uniq = require('lodash.uniq');
const differenceWith = require('lodash.differencewith');
const cloneDeep = require('lodash.clonedeep');
const isNull = require('lodash.isnull');
const cheerio = require('cheerio');
const rp = require('request-promise');
const ObjectId = require('mongoose').Types.ObjectId;
const dotenv = require('dotenv').config();

const { bloodDB, landLogDB, bloodGameDB } = require('./db');
const db = require('./db/db');
const config = require('./db/config');

const { QuadKeyToTileXY, TileXYToLatLong, QuadKeyToLatLong } = require('./helpers/custom/quadKeyConvert');
const { forbidLandDirect } = require("./containers/lands/services/indexNew");
const landCollections = {
    1: db.Land01,
    2: db.Land02,
    3: db.Land03,
    4: db.Land04,
    5: db.Land05,
    6: db.Land06,
    7: db.Land07,
    8: db.Land08,
    9: db.Land09,
    10: db.Land10,
    11: db.Land11,
    12: db.Land12,
    13: db.Land13,
    14: db.Land14,
    15: db.Land15,
    16: db.Land16,
    17: db.Land17,
    18: db.Land18,
    19: db.Land19,
    20: db.Land20,
    21: db.Land21,
    22: db.Land22
};

async function setOpenCountry() {
    // let arrCountryOld = [
    //     {
    //         name: "South Korean",
    //         releaseDate: new Date('03-01-2019 00:00:00'),
    //         minLat: 33.89920184961851,
    //         minLng: 125.07659912109375,
    //         maxLat: 38.54816542304657,
    //         maxLng: 130.94038009643555,
    //         ranges: [
    //             {
    //                 description: "Ulleungdo Island",
    //                 lat: [37.453330018291204, 37.579412513438385],
    //                 lng: [130.78125, 130.94038009643555]
    //             },
    //             {
    //                 description: "South Korean Land - North East",
    //                 lat: [37.683820326693805, 38.54816542304657],
    //                 lng: [128.3203125, 129.58470582962036]
    //             },
    //             {
    //                 description: "South Korean Land - North West 5",
    //                 lat: [37.683820326693805, 38.278752774873055],
    //                 lng: [127.079758644104, 128.3203125]
    //             },
    //             {
    //                 description: "South Korean Land - North West 4",
    //                 lat: [37.765914447901, 38.13455657705411],
    //                 lng: [126.9580078125, 127.12297439575195]
    //             },
    //             {
    //                 description: "South Korean Land - North West 3",
    //                 lat: [37.765914447901, 37.996162679728116],
    //                 lng: [126.79364204406738, 127.12297439575195]
    //             },
    //             {
    //                 description: "South Korean Land - North West 2",
    //                 lat: [37.765914447901, 37.954434437076124],
    //                 lng: [126.6894006729126, 127.12297439575195]
    //             },
    //             {
    //                 description: "South Korean Land - North West 1",
    //                 lat: [37.683820326693805, 37.765914447901],
    //                 lng: [126.1982774734497, 127.12297439575195]
    //             },
    //             {
    //                 description: "South Korean Land - Main",
    //                 lat: [34.994003757575754, 37.683820326693805],
    //                 lng: [125.07659912109375, 129.58470582962036]
    //             },
    //             {
    //                 description: "South Korean Land - South",
    //                 lat: [33.89920184961851, 34.994003757575754],
    //                 lng: [125.07659912109375, 128.75648260116577]
    //             },

    //             // {
    //             //     description: "South Korean Land",
    //             //     lat: [34.30714385628803, 38.54816542304657],
    //             //     lng: [128.3203125, 128.49609375]
    //             // },
    //             // {
    //             //     description: "South Korean Land",
    //             //     lat: [34.16181816123038, 34.30714385628803],
    //             //     lng: [125.859375, 127.529296875]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [34.30714385628803, 34.74161249883172],
    //             //     lng: [125.859375, 127.880859375]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [34.74161249883172, 35.10193405724607],
    //             //     lng: [125.859375, 128.7158203125]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [35.10193405724607, 37.5097258429375],
    //             //     lng: [126.03515625, 129.58648681640625]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [37.5097258429375, 37.75334401310657],
    //             //     lng: [126.2109375, 129.375]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [37.75334401310657, 37.996162679728116],
    //             //     lng: [126.826171875, 129.375]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [37.71859032558814, 37.996162679728116],
    //             //     lng: [126.826171875, 129.375]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [37.996162679728116, 38.13455657705411],
    //             //     lng: [126.9580078125, 128.84765625]
    //             // },{
    //             //     description: "South Korean Land",
    //             //     lat: [38.13455657705411, 38.272688535980954],
    //             //     lng: [127.08984375, 128.84765625]
    //             // },
    //         ]
    //     }
    // ]

    let arrCountryNew = [
        {
            name: "South Korean",
            releaseDate: new Date('03-01-2019 00:00:00'),
            minLat: 33.89920184961851,
            minLng: 125.07659912109375,
            maxLat: 38.54816542304657,
            maxLng: 130.94038009643555,
            ranges: [
                {
                    description: "Ulleungdo Island",
                    lat: [37.453330018291204, 37.579412513438385],
                    lng: [130.78125, 130.94038009643555]
                },
                {
                    description: "South Korean Land - North East",
                    lat: [37.683820326693805, 38.54816542304657],
                    lng: [128.3203125, 129.58470582962036]
                },
                {
                    description: "South Korean Land - North West 5",
                    lat: [37.683820326693805, 38.278752774873055],
                    lng: [127.079758644104, 128.3203125]
                },
                {
                    description: "South Korean Land - North West 4",
                    lat: [37.765914447901, 38.13455657705411],
                    lng: [126.9580078125, 127.12297439575195]
                },
                {
                    description: "South Korean Land - North West 3",
                    lat: [37.765914447901, 37.996162679728116],
                    lng: [126.79364204406738, 127.12297439575195]
                },
                {
                    description: "South Korean Land - North West 2",
                    lat: [37.765914447901, 37.954434437076124],
                    lng: [126.6894006729126, 127.12297439575195]
                },
                {
                    description: "South Korean Land - North West 1",
                    lat: [37.683820326693805, 37.765914447901],
                    lng: [126.1982774734497, 127.12297439575195]
                },
                {
                    description: "South Korean Land - Main",
                    lat: [34.994003757575754, 37.683820326693805],
                    lng: [125.07659912109375, 129.58470582962036]
                },
                {
                    description: "South Korean Land - South",
                    lat: [33.89920184961851, 34.994003757575754],
                    lng: [125.07659912109375, 128.75648260116577]
                },
            ]
        },
        {
            name: "China",
            releaseDate: new Date('05-01-2019 00:00:00'),
            minLat: 18.15761670201873,
            minLng: 73.49939346313477,
            maxLat: 53.560985069171494,
            maxLng: 131.3525390625,
            ranges: [
                {
                    description: "North East China 1",
                    lat: [42.724648090250646, 45.09373164517781],
                    lng: [111.41132354736328, 116.71402931213379]
                },
                {
                    description: "North East China 2",
                    lat: [41.83682786072713, 53.560985069171494],
                    lng: [116.71402931213379, 127.3095703125]
                },
                {
                    description: "North East China 3",
                    lat: [42.724648090250646, 47.989921667414166],
                    lng: [127.3095703125, 131.3525390625]
                },
                {
                    description: "China Land - main",
                    lat: [30.00742257560872, 42.724648090250646],
                    lng: [80.1744031906128, 124.1455078125]
                },
                {
                    description: "North West China",
                    lat: [42.724648090250646, 47.989921667414166],
                    lng: [80.771484375, 96.3720703125]
                },
                {
                    description: "West China",
                    lat: [35.98788594104261, 41.0130657870063],
                    lng: [73.49939346313477, 80.1744031906128]
                },
                {
                    description: "South China - Left",
                    lat: [28.246989557039406, 30.00742257560872],
                    lng: [85.7481837272644, 92.9318904876709]
                },
                {
                    description: "South China - Right 1",
                    lat: [22.948672045343997, 30.00742257560872],
                    lng: [98.76760482788086, 122.71003246307373]
                },
                {
                    description: "South China - Right 2",
                    lat: [18.15761670201873, 22.948672045343997],
                    lng: [108.05600881576538, 121.47670984268188]
                },
            ]
        },
        {
            name: "USA 1",
            releaseDate: new Date('05-01-2019 00:00:00'),
            minLat: 31.33336813338014,
            minLng: -180,
            maxLat: 71.39916455383504,
            maxLng: 180,
            ranges: [
                {
                    description: "USA - Alasca Middle",
                    lat: [51.23440735163458, 71.39916455383504],
                    lng: [-168.12103271484375, -141.0013246536255]
                },
                {
                    description: "USA - Alasca West 1",
                    lat: [51.23440735163458, 63.78795521440015],
                    lng: [-180, -141.0013246536255]
                },
                {
                    description: "USA - Alasca East",
                    lat: [51.91716758909014, 60.35247454030531],
                    lng: [-141.0013246536255, -129.9943971633911]
                },
                {
                    description: "USA Land - North",
                    lat: [41.67656606888066, 49.00056289647359],
                    lng: [-124.78576183319092, -83.14970254898071]
                },
                {
                    description: "USA Land - North East",
                    lat: [41.67656606888066, 47.4598396449717],
                    lng: [-83.14970254898071, -66.97265625]
                },
                {
                    description: "USA Land - Middle",
                    lat: [31.33336813338014, 41.67656606888066],
                    lng: [-124.78576183319092, -66.97265625]
                },
            ]
        },
        {
            name: "USA 2 - Alasca West",
            releaseDate: new Date('05-01-2019 00:00:00'),
            minLat: 51.23440735163458,
            minLng: 172.44140625,
            maxLat: 57.25528054528888,
            maxLng: 180,
            ranges: [
                {
                    description: "USA - Alasca West 2",
                    lat: [51.23440735163458, 57.25528054528888],
                    lng: [172.44140625, 180]
                },
            ]
        },
        {
            name: "Indonesia",
            releaseDate: new Date('05-15-2019 00:00:00'),
            //releaseDate: new Date('05-01-2019 00:00:00'),
            minLat: -11.007568432924145,
            minLng: 95.00967979431152,
            maxLat: 5.907168239517034,
            maxLng: 140.99997282028198,
            ranges: [
                {
                    description: "Indonesia - North West - Medan",
                    lat: [1.274308991845217, 5.907168239517034],
                    lng: [95.00967979431152, 100.17634391784668]
                },
                {
                    description: "Indonesia - North West - Dumai",
                    lat: [1.274308991845217, 2.1733982697220995],
                    lng: [100.17634391784668, 102.28271484375]
                },
                {
                    description: "Indonesia - North - Manado",
                    lat: [1.274308991845217, 4.346411275333168],
                    lng: [115.3125, 140.99997282028198]
                },
                {
                    description: "Indonesia - Main",
                    lat: [-11.007568432924145, 1.274308991845217],
                    lng: [95.00967979431152, 140.99997282028198]
                }
            ]
        },{
            name: "Thailand",
            releaseDate: new Date('05-15-2019 00:00:00'),
            //releaseDate: new Date('05-01-2019 00:00:00'),
            minLat: 6.271618064314865,
            minLng: 97.646484375,
            maxLat: 20.26219712424654,
            maxLng: 104.58984375,
            ranges: [
                {
                    description: "Thailand - North West",
                    lat: [17.81145608856447, 20.26219712424654],
                    lng: [97.646484375, 101.07421875]
                },
                {
                    description: "Thailand - Main",
                    lat: [14.365512629178596, 17.81145608856447],
                    lng: [98.525390625, 104.58984375]
                },
                {
                    description: "Thailand - South",
                    lat: [10.617418067950297, 14.365512629178596],
                    lng: [99.140625, 102.392578125]
                },
                {
                    description: "Thailand - South",
                    lat: [6.271618064314865, 10.617418067950297],
                    lng: [98.173828125, 102.392578125]
                },
            ]
        },{
            name: "Vietnam",
            releaseDate: new Date('05-15-2019 00:00:00'),
            minLat: 8.320212289522942,
            minLng: 102.3046875,
            maxLat: 23.322080011378432,
            maxLng: 110.7421875,
            ranges: [
                {
                    description: "Vietnam - North",
                    lat: [22.948672045343997, 23.322080011378432], //chang min lat 
                    lng: [104.677734375, 108.05598735809326]
                },
                {
                    description: "Vietnam - North",
                    lat: [21.616579336740585, 22.948672045343997],  //chang max lat 
                    lng: [102.3046875, 108.05598735809326]
                },{
                    description: "Vietnam - North",
                    lat: [20.632784250388013, 21.616579336740585],
                    lng: [103.0078125, 108.05598735809326]
                },
                {
                    description: "Vietnam - North",
                    lat: [18.89589255941503, 20.632784250388013],
                    lng: [104.0625, 108.017578125]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [18.229351338386678, 18.89589255941503],
                    lng: [105.1171875, 108.017578125]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [17.64402202787271, 18.229351338386678],
                    lng: [105.46875, 110.7421875]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [17.05678460994254, 17.64402202787271],
                    lng: [105.99609375, 110.7421875]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [16.38339112360839, 17.05678460994254],
                    lng: [106.5234375, 110.7421875]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [12.382928338487389, 16.38339112360839],
                    lng: [107.2705078125, 110.7421875]
                },
                {
                    description: "Vietnam - Middle",
                    lat: [11.738302371436845, 12.382928338487389],
                    lng: [106.34765625, 110.7421875]
                },
                {
                    description: "Vietnam - South",
                    lat: [11.092165893501985, 11.738302371436845],
                    lng: [105.8203125, 110.7421875]
                },
                {
                    description: "Vietnam - South",
                    lat: [10.141931686131016, 11.092165893501985],
                    lng: [104.4140625, 109.072265625]
                },
                {
                    description: "Vietnam - South",
                    lat: [10.471143071171454, 10.141931686131016],
                    lng: [104.4140625, 109.072265625]
                },
                //difference
                {
                    description: "Vietnam - Phu Quoc",
                    lat: [8.320212289522942, 10.471143071171454],
                    lng: [103.809814453125, 109.072265625]
                },
            ]
        }
    ];

    try {
        await Promise.all(arrCountryNew.map(country => (new db.OpenCountry(country)).save()));
    } catch (e) {
        console.log('e ', e);
    }
}

async function convertOrphanLandToNull(){
    const MAX_NUMBER_NID = 1000;
    let arrPay = [];

    let allUser = await db.User.find({}).select('_id nid role');
    //console.log('allUser', allUser);
    const parseUser = allUser.map(user => ({ userId: user._id, nid: Number(user.nid) })).sort((a, b) => a.nid - b.nid);
    //console.log('parseUser', parseUser);

    let arrUpdateNull = [];
    let arrUpdateFail = [];
    let errorCatch = [];
    for(let user of parseUser){
        //const { userId, nid } = user;
        console.log('nid=', user.nid);
        const arrLandOfUser = await db.Land23.find({ 'user._id': user.userId, 'user.role': 'user', categoryId: { $ne: null } });
        for(let land of arrLandOfUser){
            try{
                const { categoryId, quadKey } = land;
                const isExist = await db.LandCategory.findOne({ _id: categoryId });
                if(!isExist){
                    const update = await db.Land23.findOneAndUpdate({ quadKey }, { categoryId: null });
                    if(update){
                        arrUpdateNull.push(update.quadKey);
                    } else {
                        arrUpdateFail.push(land.quadKey);
                    }
                }
            } catch(e){
                console.log('Error: ', e);
                errorCatch.push(land.quadKey);
            }
        }
    }
    console.log('arrUpdateNull', arrUpdateNull);
    console.log('arrUpdateFail', arrUpdateFail);
    console.log('errorCatch', errorCatch);
}

const { createBitaminHistory, getBitaminHistory } = require('./containers/bitamin/services/bitaminHistory');    
async function createBitaminHistoryData(){
    let userAA = await db.User.findOne({ userName: 'aa' });
    if(userAA){
        for(let i = 1; i <= 150; i++){
            console.log(i);
            let status = i%5===0 ? false : true;
            let error = i%5===0 ? "CannotUpdateBitamin" : "";
            await Promise.all([
                createBitaminHistory({ userId: userAA._id, nid: Number(userAA.nid), category: "RECEIVE", categoryDetail: "PROFIT", amount: i*100, status, error }),
                createBitaminHistory({ userId: userAA._id, nid: Number(userAA.nid), category: "USE", categoryDetail: "BUYTREE", amount: (i*2)*100, status, error }),
                createBitaminHistory({ userId: userAA._id, nid: Number(userAA.nid), category: "CONVERT", categoryDetail: null, amount: (i*3)*100, status, error }),
            ]);
        }
    }
}

let { list } = require('./listup-landmarks-result');
(async () => {
    
    console.log('process.env.NODE_ENV=', process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development'){
        console.log('remove DB');
        bloodDB.dropDatabase();
        landLogDB.dropDatabase();

        console.log('create User aa bb cc dd ee');
        await createUser();

        console.log('set open country');
        await setOpenCountry();

        console.log('set landPrice');
        await db.LandConfig.create({ landPrice: 50000, landFee: 0 });

        // //for test
        console.log('create Bitamin for Test')
        await createBitaminHistoryData();

        // //land mark wrong at present
        console.log('addUserManagerAndAddLandMark');
        list.length = 20000;
        await addUserManagerAndAddLandMark(list);

        console.log('set open country and landPrice is completed!');
        process.exit(0);
    } else if(process.env.NODE_ENV === 'staging'){
        console.log('remove DB');
        bloodDB.dropDatabase();
        landLogDB.dropDatabase();

        console.log('create User aa bb cc dd ee');
        await createUser();

        console.log('set open country');
        await setOpenCountry();

        console.log('set landPrice');
        await db.LandConfig.create({ landPrice: 60000, landFee: 0 });

        list.length = 15000;
        console.log('addUserManagerAndAddLandMark',  list.length);
        await addUserManagerAndAddLandMark(list);
        //re-sell land mark vitual for fix info land

        console.log('set open country and landPrice is completed!');
        process.exit(0);
    }  else if(process.env.NODE_ENV === 'production'){
    }





    //re-sell land mark vitual for fix info land
    //await sellLandMarkVirtual(list);
    //set landmark count
    //await addLandmarkCount(list);
})();

async function addUserManagerAndAddLandMark(list) {
    let userEE = await db.User.findOne({ userName: 'ee' });
    let user = {
        _id: userEE._id,
        role: userEE.role,
        name: userEE.name,
        nid: userEE.nid,
        wId: userEE.wId,
    }
    //console.log('user', user);
    //list.length = 10000;
    list = list.sort();
    while (list && list.length !== 0) {
        console.log('list.length', list.length);
        let quadKeys = list.splice(0, 10000);
        //console.log('quadKeys', quadKeys);
        let arrLandMark = [
            {
                category: {
                    userId: userEE._id,
                    "center": QuadKeyToLatLong(quadKeys[0]),// { "lat": 37.566572333569326, "lng": 126.97798490524292 },
                    "name": quadKeys[0],
                    "typeOfCate": "landmark",
                    "createdDate": new Date(),
                },
                quadKeys
            },
        ]

        for(landmark of arrLandMark){
            console.log('create category landmark '+ landmark.category.name);
            const category = await db.LandCategory.create(landmark.category);

            //console.log('create landmark '+ landmark.category.name);
            await forbidLandDirect({ user, quadKeys: landmark.quadKeys, categoryId: category._id });
        }

    }
}

//================================================================================================ADD LAND MARK================================================================================================

async function createUser(){
    let userAA = {};
    let userBB = {};
    let userCC = {};
    let userDD = {};
    let userEE = {};
    try {
        userAA = await db.User.create({
            "wSns" : [],
            "wBlood" : 0,
            "goldBlood" : 777777777,
            "bitamin" : 700000,
            "role" : "user",
            "updatedDate" : new Date(),
            "createdDate" : new Date(),
            "userName" : "aa",
            "firstName" : "aa",
            "lastName" : "aa",
            "nid": getRandomInt(0, 999999),
            "wId": "wId" + getRandomInt(0, 999999999999),
            "wToken": "wTk" + getRandomInt(0, 999999999999),
            "email" : "aa@gmail.com",
            "hash" : "$2a$10$BHNebtJLbvkbc5njZG9A6er7vkjEiOpGUpkZSJg.Z0iIRietPOO3G",
        });
        console.log('Insert user aa');
        db.UserSetting.create({
            "land" : { "showInfo" : true },
            "bgMusic" : { "turnOn" : true, "volume" : 30 },
            "effMusic" : { "turnOn" : false, "volume" : 100 },
            "userId" : ObjectId(userAA._id),
        });
        //console.log('Insert setting user aa');
    } catch (e){ console.log(e) }

    try {
        userBB = await db.User.create({
            "wSns" : [],
            "wBlood" : 0,
            "goldBlood" : 888888888,
            "bitamin" : 800000,
            "role" : "user",
            "updatedDate" : new Date(),
            "createdDate" : new Date(),
            "userName" : "bb",
            "firstName" : "bb",
            "lastName" : "bb",
            "nid": getRandomInt(0, 999999),
            "wId": "wId" + getRandomInt(0, 999999999999),
            "wToken": "wToken" + getRandomInt(0, 999999999999),
            "email" : "bb@gmail.com",
            "hash" : "$2a$10$Wids7NYKTrv75ygMQvSLP.GJXjVAdsW3jxXMJ1eVQMTt59zhXmXe.",
        });
        console.log('Insert user bb');
        db.UserSetting.create({
            //"_id" : ObjectId(userBB._id),
            "land" : { "showInfo" : true },
            "bgMusic" : { "turnOn" : true, "volume" : 30 },
            "effMusic" : { "turnOn" : false, "volume" : 100 },
            "userId" : ObjectId(userBB._id),
        });
        //console.log('Insert setting user bb');
        //return userBB;
    } catch (e){ console.log(e) }

    try{
        userCC = await db.User.create({
            "wSns" : [],
            "wBlood" : 0,
            "goldBlood" : 999999999,
            "bitamin" : 900000,
            "role" : "user",
            "updatedDate" : new Date(),
            "createdDate" : new Date(),
            "userName" : "cc",
            "firstName" : "cc",
            "lastName" : "cc",
            "nid": getRandomInt(0, 999999),
            "wId": "wId" + getRandomInt(0, 999999999999),
            "wToken": "wToken" + getRandomInt(0, 999999999999),
            "email" : "cc@gmail.com",
            "hash" : "$2a$10$Oy3NerFiZt8V099NxDvDlek7EphwccosOC5uvHtSxq52sMN5H.pwG",
        });
        console.log('Insert manager cc');
        db.UserSetting.create({
            //"_id" : ObjectId(userAA._id),
            "land" : { "showInfo" : true },
            "bgMusic" : { "turnOn" : true, "volume" : 30 },
            "effMusic" : { "turnOn" : false, "volume" : 100 },
            "userId" : ObjectId(userCC._id),
        });
        //console.log('Insert setting manager cc');
    } catch (e){ console.log(e) }

    try{
        userDD = await db.User.create({
            "wSns" : [],
            "wBlood" : 0,
            "goldBlood" : 666666666,
            "bitamin" : 600000,
            "role" : "user",
            "updatedDate" : new Date(),
            "createdDate" : new Date(),
            "userName" : "dd",
            "firstName" : "dd",
            "lastName" : "dd",
            "nid": getRandomInt(0, 999999),
            "wId": "wId" + getRandomInt(0, 999999999999),
            "wToken": "wToken" + getRandomInt(0, 999999999999),
            "email" : "dd@gmail.com",
            "hash" : "$2a$10$craUtOeuNQNwZ9Wc5q7y7OXSwuBC7053btUx3KaVfgoF79QwyeT0u",
        });
        console.log('Insert manager dd');
        db.UserSetting.create({
            //"_id" : ObjectId(userAA._id),
            "land" : { "showInfo" : true },
            "bgMusic" : { "turnOn" : true, "volume" : 30 },
            "effMusic" : { "turnOn" : false, "volume" : 100 },
            "userId" : ObjectId(userDD._id),
        });
    } catch (e){ console.log(e) }

    try{
        userEE = await db.User.create({
            "wSns": [],
            "wBlood": 0,
            "goldBlood": 555555555,
            "bitamin" : 500000,
            "role": "manager",
            "updatedDate": new Date(),
            "createdDate": new Date(),
            "userName": "ee",
            "firstName": "ee",
            "lastName": "ee",
            "nid": getRandomInt(0, 999999),
            "wId": "wId" + getRandomInt(0, 999999999999),
            "wToken": "wToken" + getRandomInt(0, 999999999999),
            "email": "ee@gmail.com",
            "hash": "$2a$10$1erbRC4NySMV6rQCMHeY7.mu4HsBdQfBOQ7./7rESednITzuAnzRO",
        });
        console.log('Insert manager ee');
        db.UserSetting.create({
            //"_id": ObjectId(userAA._id),
            "land": { "showInfo": true },
            "bgMusic": { "turnOn": true, "volume": 30 },
            "effMusic": { "turnOn": false, "volume": 100 },
            "userId": ObjectId(userEE._id),
        });
    } catch (e){ console.log(e) }

    return { userAA, userBB, userCC, userDD, userEE };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//================================================================================================END ADD LAND MARK================================================================================================


//========================================================================SELL LANDMARK=====================================================================================
const PARENT_1_RANGE = 4; //lv19
const PARENT_2_RANGE = 5; //lv18
function countParentCell(quadkeys, level) {
    var landCounts = {};
    for (let quadKey of quadkeys) {
        quadKey = quadKey.substr(0, level + 1);
        landCounts[quadKey] = (landCounts[quadKey] || 0) + 1;
    }
    return landCounts;
}

function updateParent(quadkeys, mode, landLevel=null) {
    if(landLevel){
        let counts = countParentCell(quadkeys, landLevel); // quadkey length = landLevel + 1
        if (counts) {
            let parent = Object.entries(counts).map(([qk, count]) => {
                const { x, y } = QuadKeyToTileXY(qk);
                let update = {
                    quadKey: qk.substr(0, (landLevel + 1)),
                    count: mode === 'buy' ? count : -count
                };
                return update;
            });
            return parent;
        }
    }
    return [];
}

async function sellLandMarkVirtual(list){
    list = list.sort();
    let iCount = 0;
    while (list && list.length !== 0) {
        console.log("Start", iCount += 10000);
        let arrQuadKey = list.splice(0, 10000);
        for (let landLevel = 22; landLevel > 0; landLevel--){
            //console.log('landLevel', landLevel);
            let arrFloor = updateParent(arrQuadKey, 'sell', landLevel);
            let grps = Object.values(groupBy(arrFloor, 'count'));
            //console.log('grp', JSON.stringify(grps, null, 4));
            for(let grp of grps){
                //console.log('grp[0].count', grp[0].count);
                //console.log('arrQK', grp.map(g => g.quadKey));
                try {
                    const arrQuadKey = grp.map(g => g.quadKey);
                    let update = await landCollections[landLevel].updateMany({ quadKey: { $in: arrQuadKey } }, { $inc: { count: grp[0].count } }, { upsert: true } );
                } catch(e) {
                    console.log("Error: ", e);
                }
            }
        }
    }
    console.log('Done');
}
//========================================================================END SELL LANDMARK=====================================================================================



//========================================================================ADD LANDMARK COUNT=====================================================================================

//create obj update parent landmark
function updateParentLandmark(quadkeys, mode, landLevel=null) {
    if(landLevel){
        let counts = countParentCell(quadkeys, landLevel); // quadkey length = landLevel + 1
        if (counts) {
            let parent = Object.entries(counts).map(([qk, count]) => {
                const { x, y } = QuadKeyToTileXY(qk);
                let update = {
                    quadKey: qk.substr(0, (landLevel + 1)),
                    count: mode === 'buy' ? count : -count
                };
                return update;
            });
            return parent;
        }
    }
    return [];
}

async function updateLandmarkCount(landUpdate, mode) {
    for (let landLevel = 22; landLevel > 0; landLevel--) {
        let counts = countParentCell(landUpdate, landLevel); // quadkey length = landLevel + 1
        if (counts) {
            await Promise.all(
                Object.entries(counts).map(([quadKey, count]) => {
                    const { x, y } = QuadKeyToTileXY(quadKey);
                    let update = { $inc: { landmarkCount: mode === 'buy' ? count : -count } };
                    if (quadKey.length > 5) {
                        update.quadKeyParent1 = quadKey.substr(0, (landLevel + 1) - PARENT_1_RANGE);
                        update.quadKeyParent2 = quadKey.substr(0, (landLevel + 1) - PARENT_2_RANGE);
                    }
                    return landCollections[landLevel].update({ quadKey }, update);
                })
            );
        } else {

        }
    }
}

async function addLandmarkCount(list){
    list = list.sort();
    let iCount = 0;
    while (list && list.length !== 0) {
        console.log("Start addLandmarkCount", iCount += 10000);
        let arrQuadKey = list.splice(0, 10000);
        for (let landLevel = 22; landLevel > 0; landLevel--){
            //console.log('landLevel', landLevel);
            let arrFloor = updateParentLandmark(arrQuadKey, 'buy', landLevel);
            //console.log('arrFloor', arrFloor);
            let grps = Object.values(groupBy(arrFloor, 'count'));
            //console.log('grp', JSON.stringify(grps, null, 4));
            for(let grp of grps){
                //console.log('grp[0].count', grp[0].count);
                //console.log('arrQK', grp.map(g => g.quadKey));
                try {
                    const arrQuadKey = grp.map(g => g.quadKey);
                    let update = await landCollections[landLevel].updateMany({ quadKey: { $in: arrQuadKey } }, { $inc: { landmarkCount: grp[0].count } }, { upsert: true } );
                    console.log('update', update);
                    //console.log('Update Done')
                } catch(e) {
                    console.log("Error: ", e);
                }
            }
        }
    }
    console.log('addLandmarkCount Done!!!');
}
//========================================================================ADD LANDMARK COUNT=====================================================================================