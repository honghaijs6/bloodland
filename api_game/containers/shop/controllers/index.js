const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.get('/getShop', getShop);
router.get('/getRandomBoxShop', getRandomBoxShop);
router.post('/buyItemFromShop', buyItemFromShop);
router.post('/buyRandomBoxFromShop', buyRandomBoxFromShop);

// Vuongcode
function getShop(req, res, next) {
    services.getShop(req.body)
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => next(err));
}

// Vuongcode
function getRandomBoxShop(req, res, next) {
    services.getRandomBoxShop(req.body)
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => next(err));

}

function buyRandomBoxFromShop(req, res, next) {
    services.buyRandomBoxFromShop(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res ,err));

}

function buyItemFromShop(req, res, next) {
    services.buyItemFromShop(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res ,err));
}


module.exports = router;