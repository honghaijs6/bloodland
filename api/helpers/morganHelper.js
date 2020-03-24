const config = require('../db/config');
module.exports = {
    customMethod: (req, res, chalk) => {
        let method = req.method;
        if(method !== 'OPTIONS')
            return chalk.green(method);

        return chalk.white(method);
    },
    timeFormat: (req, res) => {
        var pad2 = function (num) {
            return String(num).padStart(2, '0');
        };
        var dateTime = new Date();
        var date = dateTime.getDate();
        var hour = dateTime.getHours();
        var mins = dateTime.getMinutes();
        var secs = dateTime.getSeconds();
        var year = dateTime.getFullYear();
        var timezoneofset = dateTime.getTimezoneOffset();
        timezoneofset = parseInt(Math.abs(timezoneofset) / 60);
        var month = dateTime.getUTCMonth() + 1;

        return pad2(date) + '/' + pad2(month) + '/' + year
            + ' ' + pad2(hour) + ':' + pad2(mins) + ':' + pad2(secs);
    },
    customStatus: (req, res, chalk) => {
        let method = req.method;
        if(method === 'OPTIONS')
            return chalk.white(res.statusCode);

        if (res.statusCode >= 200 && res.statusCode < 300) {
            return chalk.green.bold(res.statusCode);
        } else if(res.statusCode >= 300 && res.statusCode < 400){
            return chalk.cyan.bold(res.statusCode);
        } else if(res.statusCode >= 400 && res.statusCode < 500){
            return chalk.yellow.bold(res.statusCode);
        }else{
            return chalk.red.bold(res.statusCode);
        }
    },
    customLength: (req, res, chalk) => {
        let resContentLength = '';
        if ("_contentLength" in res){
            resContentLength = res['_contentLength'];
        } else if(res.hasHeader('content-length')) {
            resContentLength = res.getHeader('content-length');
        }

        return chalk.white(resContentLength);
    },
    customResponse: (req, res, chalk) => {
        if (!req._startAt || !res._startAt) {
            return
        }

        let ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
            (res._startAt[1] - req._startAt[1]) * 1e-6;

        if(ms > 1000) {
            return chalk.red(ms.toFixed(3) + ' ms');
        }

        return ms.toFixed(3) + ' ms';
    },
    customReferral: (req, res, chalk) => {
        let referer = req.headers['referer'] || req.headers['referrer'];
        if(config.clientHost !== referer)
            return chalk.red(referer);

        return referer;
    }
};
