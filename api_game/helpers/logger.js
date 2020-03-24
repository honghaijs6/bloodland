const winston = require('winston');
require('winston-daily-rotate-file');

var api_transport = new (winston.transports.DailyRotateFile)({
  filename: './../game_logs/api-log-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  level: 'debug',
});

const receiveitem_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../game_logs/receiveitem-info.log', level: 'info' })
  ]
});


const useitem_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../game_logs/useitem-info.log', level: 'info' }),
  ]
});

const profit_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../game_logs/profit-info.log', level: 'info' })
  ]
});

const plantTree_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../game_logs/plantTree-info.log', level: 'info' })
  ]
})

const deadTrees_logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: '../game_logs/deadTree-info.log', level: 'info' })
  ]
})

const payblood_logger = winston.createLogger({
  transports: [
    new winston.transports.File({filename: './../game_logs/payblood.log',level: 'info'})
  ]
})


var api_logger = winston.createLogger({
  transports: [
    api_transport
  ]
})

module.exports = {
  useitem: function (param) {
    useitem_logger.info(param)
  },
  receiveitem: function (param) {
    receiveitem_logger.info(param)
  },
  profit: function (param) {
    profit_logger.info(param)
  },
  plantTree: function (param) {
    plantTree_logger.info(param)
  },
  deadTrees: function (param) {
    deadTrees_logger.info(param)
  },
  apirequest: function (param) {
    api_logger.debug({ type: 'Request', ...param })
  },
  apiresult: function (param) {
    api_logger.debug({ type: 'Response', ...param })
  },
  payblood: function(param){
    payblood_logger.info(param)
  }
}