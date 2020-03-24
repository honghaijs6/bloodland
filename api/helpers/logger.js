var winston = require('winston');
require('winston-daily-rotate-file');

var debug_transport = new (winston.transports.DailyRotateFile)({
  filename: './../land_logs/debug-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  level: 'debug',
});

var api_transport = new (winston.transports.DailyRotateFile)({
  filename: './../land_logs/api-log-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  level: 'debug',
});


var land_logger = winston.createLogger({
  transports: [
    debug_transport,
  ]
});



var api_logger = winston.createLogger({
  transports: [
    api_transport
  ]
})



const receiveitem_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: './../game_logs/receiveitem-info.log', level: 'info' })
  ]
});


const useitem_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: './../game_logs/useitem-info.log', level: 'info' }),
  ]
});

const payblood_logger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: './../land_logs/payblood.log',level: 'info'})
  ]
})
// const api_request_logger = winston.createLogger({
//   transports: [
//     new winston.transports.File({ filename: './../land_logs/api-request-info.log', level: 'info' }),
//   ]
// })

// const api_result_logger = winston.createLogger({
//   transports: [
//     new winston.transports.File({ filename: './../land_logs/api-result-info.log', level: 'info' }),
//   ]
// })

const landmark_buy_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: './../land_logs/landmark_buy.log', level: 'info' }),
  ]
})





var logger = {
  land: function (...param) {
    land_logger.debug(param[0], param[1]);
  },
  useitem: function (param) {
    useitem_logger.info(param)
  },
  receiveitem: function (param) {
    receiveitem_logger.info(param)
  },
  apirequest: function (param) {
    api_logger.debug({type:'Request',...param})
  },
  apiresult: function (param) {
    api_logger.debug({type:'Response',...param})
  },
  landmarkbuy: function(param){
    landmark_buy_logger.info(param)
  },
  payblood: function(param){
    payblood_logger.info(param)
  }
}

// logger

module.exports = logger;