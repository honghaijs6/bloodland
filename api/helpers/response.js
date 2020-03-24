const crypto = require('./crypto');
const winstonLogger = require('./logger');

function handleResponseWithLogs(req, res, isEncrypt, result) {
    if (result) {
        let logData = {
            url: req.originalUrl,
            time: new Date(),
            ip_client: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            result: result
        };
        winstonLogger.apiresult(logData);
        // if (isEncrypt && process.env.NODE_ENV !== "development") {
        if (isEncrypt) {

            var jsonString = JSON.stringify(result);
            var encoded = crypto.encryptAES(jsonString);
            res.send(encoded);
        }
        else {
            res.json(result);
        }
    }
    else {
        console.log('Object Return Failed: (', result, ')');
        var jsonString = JSON.stringify({ status: false, error: "errors" });
        var encoded = crypto.encryptAES(jsonString);
        res.send(encoded);
        // res.sendStatus(500);
    }
}

function handleResponse(res, result) {
    if (result) {
        //if (process.env.NODE_ENV !== "development") {
            var jsonString = JSON.stringify(result);
            var encoded = crypto.encryptAES(jsonString);
            res.send(encoded);
        // }
        // else {
        //     res.json(result);
        // }
    }
    else {
        console.log('Object Return Failed: (', result, ')');
        var jsonString = JSON.stringify({ status: false, error: "errors" });
        var encoded = crypto.encryptAES(jsonString);
        res.send(encoded);
        // res.sendStatus(500);
    }
}

function handleErrorResponse(res, err) {
    if(res.status(500)){
        // console.log('loi vao day',err.toString());
        //if(process.env.NODE_ENV !== "development"){
            var jsonString = JSON.stringify({status:false,error:err.toString()});
            var encoded = crypto.encryptAES(jsonString);
            res.send(encoded);
        // }else{
        //     res.json({status:false,error:err.toString()});
        // }
    }
}

module.exports = {
    handleResponse,
    handleErrorResponse,
    handleResponseWithLogs
};
