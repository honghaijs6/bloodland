const express = require('express');
const router = express.Router();
const services = require('../services/trades');

router.post('/getBalance', getBalance);
router.post('/getWithdraw', getWithdraw);
router.post('/getPay', getPay);
router.post('/getRewardInterest', getRewardInterest);
router.post('/getGoldBlood', getGoldBlood);
router.post('/addGoldBlood', addGoldBlood);
router.post('/useGoldBlood', useGoldBlood);
router.post('/coinToWallet', coinToWallet);
router.post('/walletToCoin', walletToCoin);
router.post('/getWalletInfo', getWalletInfo);
router.post('/transferBlood', transferBlood);
router.post('/exchangeBitamin', exchangeBitamin);

module.exports = router;

function getBalance(req, res, next) {
    services.getBalance(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getWithdraw(req, res, next) {
    services.getWithdraw(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function exchangeBitamin(req, res, next) {
    services.exchangeBitamin(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getPay(req, res, next) {
    services.getPay(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getRewardInterest(req, res, next) {
    services.getRewardInterest(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getGoldBlood(req, res, next) {
    services.getGoldBlood(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addGoldBlood(req, res, next) {
    services.addGoldBlood(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function useGoldBlood(req, res, next) {
    services.useGoldBlood(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function coinToWallet(req, res, next) {
    services.coinToWallet(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function walletToCoin(req, res, next) {
    services.walletToCoin(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function transferBlood(req, res, next) {
    services.transferBlood(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}


function getWalletInfo(req, res, next) {
    services.getWalletInfo(req.body)
        .then(result => {
            // res.status(401).json({error:result});
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}
