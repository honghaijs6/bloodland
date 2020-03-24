require('rootpath')();
const express = require('express');
const app = express();

var debug = require('debug')('api-app:server');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');

const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();

const {scheduler} = require('./cron');
scheduler();

app.use(logger('dev'));
app.use(cookieParser());
// app.use(jwt());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
let port;
if (process.env.NODE_ENV === 'development') port = 5004;
else if(process.env.NODE_ENV === 'staging') port = 6001;
else  if(process.env.NODE_ENV === 'production') port = 5001;
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
