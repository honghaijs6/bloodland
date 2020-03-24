const express = require('express');
const router = express.Router();
const services = require('../services/settings');

const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');
const requestIp = require('request-ip');

router.post('/get', get);
// router.post('/set', set); // Don't need, Vuong
router.post('/setLandShowInfo', setLandShowInfo);
router.post('/setBgMusic', setBgMusic);
router.post('/setEffMusic', setEffMusic);
router.post('/setLanguage', setLanguage);

module.exports = router;

function get(req, res, next) {
    // console.log("==========================>req.body",typeof req.body);
    const clientIp = requestIp.getClientIp(req); 
    // console.log("clientIp",clientIp);
    services.get(crypto.parsedObj(req.body),clientIp)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function set(req, res, next) {
    const clientIp = requestIp.getClientIp(req); 
    services.set(crypto.parsedObj(req.body),clientIp)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function setLandShowInfo(req, res, next) {
    services.setLandShowInfo(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function setBgMusic(req, res, next) {
    services.setBgMusic(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function setEffMusic(req, res, next) {
    services.setEffMusic(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function setLanguage(req, res, next) {
    services.setLanguage(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}