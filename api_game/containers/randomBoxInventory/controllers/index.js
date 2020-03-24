const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/getRandomBoxInventory', getRandomBoxInventory);
router.post('/openBoxCreateItemAndAddToInventory', openBoxCreateItemAndAddToInventory);

// Vuongcode
function openBoxCreateItemAndAddToInventory(req, res, next) {
    services.openBoxCreateItemAndAddToInventory(crypto.parsedObj(req.body))
    .then(result => response.handleResponseWithLogs(req,res,true,result))
    .catch(err => response.handleErrorResponse(res ,err));
}

// Vuongcode
function getRandomBoxInventory(req, res, next) {
    services.getRandomBoxInventory(crypto.parsedObj(req.body))
    .then(result => response.handleResponseWithLogs(req,res,true,result))
    .catch(err => response.handleErrorResponse(res ,err));
}

module.exports = router;