const express = require('express');
const router = express.Router();
const services = require('../services/indexNew');
const { getDefaultPrice } = require('../services/landPrice');
const response = require('../../../helpers/response');


router.post('/getLandInfo', getLandInfo);
router.post('/getLandByQuadKeys', getLandByQuadKeys);
router.post('/getAreaLand', getAreaLand);
router.post('/getAllLandMarkCategoryInMap', getAllLandMarkCategoryInMap);
router.post('/addCenterCategory', addCenterCategory);
router.post('/getDefault', getDefault);
router.post('/getAllLandById', getAllLandById);
router.post('/updateLandsState', updateLandsState);
router.post('/getAllLand', getAllLand);
router.post('/getAllCategory', getAllCategory);
router.post('/transferLandCategory', transferLandCategory);
router.post('/addCategory', addCategory);
router.post('/editCategory', editCategory);
router.post('/deleteLandCategory', deleteLandCategory);
router.post('/editLand', editLand);
router.post('/getAllHistoryTradingLandById', getAllHistoryTradingLandById);
router.post('/removeHistory', removeHistory);

router.post('/getAllLandCategory', getAllLandCategory);
router.post('/getAllLandMarkCategory', getAllLandMarkCategory);
router.post('/getLandByCategory', getLandByCategory);


router.post('/updateLandMarksState', updateLandMarksState);

module.exports = router;

function getLandInfo(req, res, next) {
    //{ quadKey:'132110320120230230132212' }
    services.getLandInfo(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function getLandByQuadKeys(req, res, next) {
    services.getLandByQuadKeys(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function getAreaLand(req, res, next) {
    services.getAreaLand(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function updateLandMarksState(req, res, next) {
    services.updateLandMarksState(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}


function getOpenCountry(req, res, next) {
    services.getAllLandMarkCategoryInMap()
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getAllLandMarkCategoryInMap(req, res, next) {
    services.getAllLandMarkCategoryInMap()
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addCenterCategory(req, res, next) {
    services.addCenterCategory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getDefault(req, res, next) {
    Promise.all([
        getDefaultPrice(),
        services.getOpenCountry()
    ]).then(result => {
        if (result) response.handleResponseWithLogs(req, res, false, result);
        else {
            console.log('Object Return Failed: (', result, ')');
            res.sendStatus(500);
        }
    })
        .catch(err => next(err));
}

function getAllLandById(req, res, next) {
    services.getAllLandById(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function getAllLand(req, res, next) {
    services.getAllLand(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function updateLandsState(req, res, next) {
    services.updateLandsState(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getAllCategory(req, res, next) {
    services.getAllCategory(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function transferLandCategory(req, res, next) {
    services.transferLandCategory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addCategory(req, res, next) {
    services.addCategory(req.body)
        .then(result => response.handleResponseWithLogs(req, res, false, result))
        .catch(err => next(err));
}

function editCategory(req, res, next) {
    services.editCategory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function deleteLandCategory(req, res, next) {
    services.deleteLandCategory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function editLand(req, res, next) {
    services.editLand(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getAllLandMarkCategory(req, res, next) {
    services.getAllLandMarkCategory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}



function getAllLandCategory(req, res, next) {
    services.getAllLandCategory(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}


function getLandByCategory(req, res, next) {
    services.getLandByCategory(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function getAllHistoryTradingLandById(req, res, next) {
    services.getAllHistoryTradingLandById(req.body)
        .then(result => response.handleResponseWithLogs(req, res, true, result))
        .catch(err => next(err));
}

function removeHistory(req, res, next) {
    services.removeHistory(req.body)
        .then(result => {
            if (result) response.handleResponseWithLogs(req, res, false, result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

