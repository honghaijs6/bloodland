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

(async () => {

    const string = `U2FsdGVkX19fzD6DKvtDhKpr4LPfNXoMTw+7EpigqA19KslDp7Z7Duvz4+k4nhG4I4pZ4+enhpqWXGYHwZo0gmwjrTnqKweFRruR9Mz/ssQl6SqPT0oGO3G2eG/UwPj71QcsOUJ+uRhxqeSvOk9X5bINLhDPnMxcSt+ppzPB5l5gvK989mjNV5kHXsV6psp/5m9tdx20pfmzyq2Z09FAfR6L7HmJ8crVNZSZgew3PLDclcTpPGMRchTk1YljflwZsJVBH$2039$304U2FsdGVkX18r8HKbMqQQ/KxN5V3IzCvJFSYzPUxQ0ls=$2039$304YU31+Ztjg6CfRDc1f9Zn3nPb9huYRrv1vh36z5642etLjb7qRXqbLbdWSTZMT28yBHULAo7tXKzBz9bYU5ssLmJN3wTFnwCVnOiZ7xKvFwXOU5R4LEPYKtCCmagw7TVmHYrT5cNXv2kxvun4g==`;
    const naturalString = decryptAES(string);
    console.log('naturalString', JSON.parse(naturalString));

})()



module.exports = {
    encryptAES,
    decryptAES,
    parsedObj
};




