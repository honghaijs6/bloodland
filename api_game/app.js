require('rootpath')();
const express = require('express');
const app = express();
var debug = require('debug')('api-app:server');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const io = module.exports.io = socketIO(server);
const dotenv = require('dotenv');
dotenv.config();
const config = require('./db/config');
//const socketManager = require('./helpers/socket').socketHandle;
//io.on('connection', socketManager);
const tokenMiddleware = require('./helpers/tokenMiddleware');

const chalk = require('chalk');
const morganHelper = require('./helpers/morganHelper');
const winstonLogger = require('./helpers/logger');


logger.token('customMethod', morganHelper.customMethod);
logger.token('timeFormat', morganHelper.timeFormat);
logger.token('customStatus', morganHelper.customStatus);
logger.token('customResponse', morganHelper.customResponse);
logger.token('customLength', morganHelper.customLength);
logger.token('customReferral', morganHelper.customReferral);

const morganLogger = logger(function (tokens, req, res) {
    return [
        tokens['customMethod'](req, res, chalk),
        tokens['customStatus'](req, res, chalk),
        chalk.white(tokens.url(req, res)),
        tokens['customResponse'](req, res, chalk),
        tokens['customLength'](req, res, chalk),
        chalk.white(tokens['timeFormat'](req, res)),
        'from ' + tokens['customReferral'](req, res, chalk)
    ].join(' ');
});

// app.use(logger('dev'));
app.use(morganLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(fileUpload());
// app.use(jwt());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// if (process.env.NODE_ENV !== 'development' && (config.clientHost === 'http://178.128.109.233' || config.clientHost === 'https://blood.land')) {
//     let allowedOrigins = [config.clientHost, 'https://wallet.blood.land'];
//     app.use(cors({
//         origin: function (origin, callback) {
//             if (!origin) return callback(null, true);
//             if (allowedOrigins.indexOf(origin) === -1) {
//                 let msg = 'The CORS policy for this site does not ' +
//                     'allow access from the specified Origin.';
//                 return callback(new Error(msg), false);
//             }
//             return callback(null, true);
//         }
//     }));


//     var secureRouter = express.Router();
//     secureRouter.use('*', function (req, res, next) {
//         // if you don't call next() you interrupt the request automaticly
//         // if(isAdmin()) next();
//         if (typeof req.headers.referer === 'undefined') {
//             res.end();
//         }

//         if (req.headers.referer.includes(config.clientHost) && (req.rawHeaders.indexOf('Origin') !== -1) && (req.rawHeaders.indexOf(config.clientHost) !== -1)) {
//             next();
//         }
//     });

//     secureRouter.all('*', tokenMiddleware);

//     secureRouter.use('/game/object', require('./containers/objects/controllers'));
//     secureRouter.use('/game/shop', require('./containers/shop/controllers'));
//     secureRouter.use('/game/inventory', require('./containers/inventory/controllers'));
//     secureRouter.use('/game/randomBoxInventory', require('./containers/randomBoxInventory/controllers'));

//     // secureRouter.use('/notifies/admin', require('./containers/notifies/admin/controllers'));
//     secureRouter.use('/notifies', require('./containers/notifies/controllers'));

//     app.use(secureRouter);
// } else {
//     app.use(cors());
//     app.use((req, res, next) => {
//         let logData = {
//             url: req.originalUrl,
//             time: new Date(),
//             ip_client: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
//             params: null
//         };
//         if (req.method == 'POST') {
//             logData.params = req.body;
//         } else {
//             logData.params = [];
//         }
//         winstonLogger.apirequest(logData);
//         next();
//     })

app.use(cors({ origin: true, credentials: true }));
app.all('*', tokenMiddleware);

app.use('/game/object', require('./containers/objects/controllers'));
app.use('/game/shop', require('./containers/shop/controllers'));
app.use('/game/inventory', require('./containers/inventory/controllers'));
app.use('/game/randomBoxInventory', require('./containers/randomBoxInventory/controllers'));
app.use('/notifies', require('./containers/notifies/controllers'));

//}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	if (req.originalUrl === '/users/loginWallet') {	
        try {
            res.redirect(302, config.loginWalletHost);
        } catch(e) {}
		return; // Cannot set headers after they are sent to the client
	}


    // render the error page
    //res.status(err.status || 500);
    //res.render('error');

    if (typeof (err) === 'string') {
        // custom application error
        console.log('Error:', err);
        return res.status(400).json({
            status: 400,
            message: err
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        console.log('Error:', err.message);
        return res.status(400).json({
            status: 400,
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.log('Error:', err.message);
        return res.status(401).json({
            status: 401,
            message: err.message
        });
    }

    // default to 500 server error
    console.log('Error:', err.message);
    return res.status(500).json({
        status: 500,
        message: err.message
    });
});

// var redisConnect = redis.createClient();
// redisConnect.on('connect', function () {
//     console.log('Redis default connection open to 127.0.0.1:6379');
// });
// redisConnect.on('error', function (err) {
//     console.log('Redis ' + err);
// });


console.log('process.env.NODE_ENV', process.env.NODE_ENV);
let port;
if (process.env.NODE_ENV === 'development') port = 5002;
else if (process.env.NODE_ENV === 'production') port = 4001;
else port = 4001;
server.listen(port, function () {
    console.log('Server listening on port ' + port);
});

server.on('error', function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});
