const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');

const crypto = require('../../../helpers/crypto');

router.post('/combineTrees', combineTrees);
router.post('/getCharacterInventoryByUserId', getCharacterInventoryByUserId);
router.post('/getItemInventoryByUserId', getItemInventoryByUserId);
router.post('/moveTreeToMap', moveTreeToMap);
router.post('/useItem', useItem);
router.post('/checkAnyDeadTrees', checkAnyDeadTrees);
router.post('/moveCharacterToMap', moveCharacterToMap);
router.post('/getAllTreesByUserId', getAllTreesByUserId);

function combineTrees(req, res, next) {
    services.combineTrees(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

function moveCharacterToMap(req, res, next) {
    services.moveCharacterToMap(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getAllTreesByUserId(req, res, next) {
    services.getAllTreesByUserId(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

// Vuongcode
//get character inventory
function getCharacterInventoryByUserId(req, res, next) {
    services.getCharacterInventoryByUserId(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

// Vuongcode
//get item inventory
function getItemInventoryByUserId(req, res, next) {
    services.getItemInventoryByUserId(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}


// Hiencode
// move tree from inventory to map
function moveTreeToMap(req, res, next) {
    services.moveTreeToMap(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

function useItem(req, res, next) {
    services.useItem(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}

function checkAnyDeadTrees(req, res, next) {
    services.checkAnyDeadTrees(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req,res,true,result))
        .catch(err => response.handleErrorResponse(res, err));
}
module.exports = router;