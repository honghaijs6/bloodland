const express = require('express');
const router = express.Router();
const services = require('../services/bitamin');
const historyServices = require('../services/bitaminHistory');

const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');


router.post('/getMyBitamin', getMyBitamin);
router.post('/exchangeBitamin', exchangeBitamin);
router.post('/getBitaminHistory', getBitaminHistory);


module.exports = router;


function getMyBitamin(req, res, next) {
    services.getMyBitamin(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function exchangeBitamin(req, res, next) {
    services.convertBitaminToGoldBlood(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}


function getBitaminHistory(req, res, next) {
    historyServices.getBitaminHistory(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}
