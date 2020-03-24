const express = require('express');
const router = express.Router();
const services = require('../services/trades');
const userService = require('../services');

const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/getBalance', getBalance);
router.post('/getWithdraw', getWithdraw);
// router.post('/getPay', getPay); // Don't need
// router.post('/getRewardInterest', getRewardInterest); // Dangerous, Don't need
// router.post('/getGoldBlood', getGoldBlood); // Don't need on running server
// router.post('/addGoldBlood', addGoldBlood); // Don't need on running server
// router.post('/useGoldBlood', useGoldBlood); // Don't need on running server
// router.post('/coinToWallet', coinToWallet); // Don't need
// router.post('/walletToCoin', walletToCoin); // Don't need
router.post('/getWalletInfo', getWalletInfo);
// router.post('/transferBlood', transferBlood); // Don't need
router.post('/purchaseLands', purchaseLands);

module.exports = router;

function getBalance(req, res, next) {
    services.getBalance(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getWithdraw(req, res) {
    services.getWithdraw(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getPay(req, res, next) {
    services.getPay(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getRewardInterest(req, res, next) {
    services.getRewardInterest(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getGoldBlood(req, res, next) {
    services.getGoldBlood(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function addGoldBlood(req, res, next) {
    services.addGoldBlood(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function useGoldBlood(req, res, next) {
    //const authToken = await usersService.getByToken({ token: token });
    services.useGoldBlood(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function coinToWallet(req, res, next) {
    services.coinToWallet(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function walletToCoin(req, res, next) {
    services.walletToCoin(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function transferBlood(req, res, next) {
    services.transferBlood(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function purchaseLands(req, res, next) {
    services.purchaseLands(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getWalletInfo(req, res, next) {
    services.getWalletInfo(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}
