const userService = require('../containers/users/services');

// var applyTokenMiddlewareRoutes = [
//     '/users/trades/getWalletInfo',
//     '/users/trades/getBalance',
//     '/users/trades/buyCharacterItemInShop',
//     '/users/trades/getWithdraw',
// ];

var noApplyTokenMiddlewareRoutes = [
    '/users/authenticate',
    '/users/register',
    '/users/loginWallet',
    '/users/getByToken',
    '/users/socialLogin',
    '/lands/getAllLand',
    '/lands/getDefaultLandPrice',
    '/lands/getAllLandMarkCategoryInMap',
    '/users/settings/get'
];

async function tokenMiddleware(req, res, next) {
    var body = req.body;
    var endpointPath = req.path;
    var param = {
        token: req.headers.authorization
    };
    var noNeedToken = noApplyTokenMiddlewareRoutes.findIndex(routes => routes.includes(endpointPath));
    if (noNeedToken === -1) {
        if (typeof param.token !== 'undefined' && param.token !== '') {
            param.token = param.token.replace('Bearer', '').replace(/\s/g, '');
            
            const rs = await userService.getByToken(param);
            if (typeof rs === 'object') {
                if (rs.token === '') {
                    //token fail
                    return res.status(401).json({"successes": true, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16)});
                } else {
                    //token success
                    if (typeof body !== 'undefined' && typeof body.userId !== 'undefined') {
                        if (rs._id.toString() === body.userId) {
                            //user of token and user from request is same
                            return next();
                        } else {
                            // return next();
                            return res.status(401).json({"successes": true, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16)});
                        }
                    }else{
                        return next();
                    }
                }
            }
        }else{
            return res.status(401).json({"successes": true, "code": '0x' + parseInt(Math.random() * 0xFFFFFFFF).toString(16)});
        }
    } else {
        // console.log("dont need middle");
        return next();
    }
}

module.exports = tokenMiddleware;
