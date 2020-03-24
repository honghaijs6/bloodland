const CryptoJS = require('crypto-js');

const tempkey = {text:'minh',key:'vuong'}
const separate = "$2039$304";

function createKey(){
    const {text,key} = tempkey;
    var result = CryptoJS.AES.encrypt(text,key).toString();
    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function addKeyToCrypto(crypto,passKey){
    var newindex = getRandomInt(crypto.length);
    var modi1 = crypto.substring(0, newindex);
    var modi2 = crypto.substring(newindex, crypto.length)
    var newstring = modi1 + separate + passKey + separate +modi2;
    return newstring;
}

// response
function encryptAES(textString){
    var passKey = createKey();
    var result = CryptoJS.AES.encrypt(textString, passKey).toString();
    // console.log(result);
    return addKeyToCrypto(result,passKey);
}

function parseText(test){
    var arr = test.split(separate);
    return [arr[0]+arr[2],arr[1]];
}

//request
function decryptAES(test){
    // console.log('test',test);
    var text = parseText(test);
    var result  = CryptoJS.AES.decrypt(text[0], text[1]);
    return result.toString(CryptoJS.enc.Utf8);
}

function parsedObj(body){
    return JSON.parse(decryptAES(body.key));
    //return process.env.NODE_ENV !== "development" ? JSON.parse(decryptAES(body.key)) : body ;
}

module.exports = {
    encryptAES,
    decryptAES,
    parsedObj
};
