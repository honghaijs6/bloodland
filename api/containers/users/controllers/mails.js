const express = require('express');
const router = express.Router();
const services = require('../services/mails');
const response = require('../../../helpers/response');
const crypto = require('../../../helpers/crypto');

router.post('/send', send);
router.post('/read', read);
router.post('/readManyMail', readManyMail);
router.post('/deleteSentMail', deleteSentMail);
router.post('/deleteReceivedMail', deleteReceivedMail);
router.post('/getAll', getAll);
router.post('/haveNewMails', haveNewMails);

module.exports = router;

function send(req, res, next) {
    services.send(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function read(req, res, next) {
    services.read(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function readManyMail(req, res, next) {
    services.readManyMail(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function deleteSentMail(req, res, next) {
    services.deleteSentMail(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function deleteReceivedMail(req, res, next) {
    services.deleteReceivedMail(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function getAll(req, res, next) {
    services.getAll(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}

function haveNewMails(req, res, next) {
    services.haveNewMails(crypto.parsedObj(req.body))
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => response.handleErrorResponse(res, err));
}