
const testEnvironment = require('crypto-js');
const testStrings = require('./constants');

let testKey = '';
function parseText(test){
    const {str10} = testStrings;
    const arr = test.split(str10);
    testKey = arr[1];
    return [arr[0]+arr[2],arr[1]];
    // const _$_8123=["|","split"];const arr=test[_$_8123[1]](_$_8123[0]);testKey= arr[1];return [arr[0]+ arr[2],arr[1]];
}


export function gm(test){
    // const text = parseText(test);
    // const result  = testEnvironment.AES.decrypt(text[0], text[1]);
    // return result.toString(testEnvironment.enc.Utf8);
    const {str1,str2,str3,str4,str5} = testStrings;
    const _$_1403=[str1,str2,str3,str4,str5];
    const text=parseText(test);
    const result=testEnvironment[_$_1403[1]][_$_1403[0]](text[0],text[1]);
    return result[_$_1403[4]](testEnvironment[_$_1403[3]][_$_1403[2]]);
}

export function km(test){
    // const crypto = testEnvironment.AES.encrypt(test, testKey).toString();
    // const newindex = Math.floor(Math.random() * Math.floor(crypto.length));
    // const modi1 = crypto.substring(0, newindex);
    // const modi2 = crypto.substring(newindex, crypto.length)
    // return modi1 + testStrings.str10 + testKey + testStrings.str10 + modi2;
    
    const {str5,str0,str2,str6,str7,str8,str9,str10} = testStrings;
    const _$_bec7=[str5,str0,str2,str6,str7,str8,str9];
    const env=testEnvironment[_$_bec7[2]][_$_bec7[1]](test,testKey)[_$_bec7[0]]();
    const newindex=Math[_$_bec7[5]](Math[_$_bec7[3]]()* Math[_$_bec7[5]](env[_$_bec7[4]]));
    const modi1=env[_$_bec7[6]](0,newindex);
    const modi2=env[_$_bec7[6]](newindex,env[_$_bec7[4]]);
    return modi1+ str10 + testKey+ str10 + modi2
}
export function body(param){
    // console.log("====>body param -------- process.env.NODE_ENV", process.env.NODE_ENV );
    return JSON.stringify({key: km(JSON.stringify(param))});
    //return process.env.NODE_ENV !== "development" ? JSON.stringify({key: km(JSON.stringify(param))}) : JSON.stringify(param);
}