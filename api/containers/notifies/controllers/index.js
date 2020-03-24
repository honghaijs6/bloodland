const express = require('express');
const router = express.Router();
const services = require('../services');
const response = require('../../../helpers/response');

router.post('/getById', getById);
router.post('/updateStatus', updateStatus);
// router.post('/send', send); // Don't need, Tri

module.exports = router;

function getById(req, res, next) {
    services.getById(req.body)
        .then(result => {
            if(result) response.handleResponseWithLogs(req,res,false,result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function updateStatus(req, res, next) {
    services.updateStatus(req.body)
        .then(result => {
            if(result) response.handleResponseWithLogs(req,res,false,result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function send(req, res, next) {
    services.send(req.body)
        .then(result => {
            if(result) response.handleResponseWithLogs(req,res,false,result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}