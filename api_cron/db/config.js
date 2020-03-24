const nodeMailer = require('nodemailer');
const environment = {
    development: {
        secret: 'THIS IS USED TO SIGN AND VERIFY BLOOD LAND JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING. AAA!',
        devPlace: 'localhost',
        connectHost: 'mongodb://localhost/land-db',
        connectDbLandLog: 'mongodb://localhost/log-db',
        connectDbGame: 'mongodb://localhost/game-db',
        devMode: true,
    },
    staging: {
        clientHost: 'http://178.128.109.233',
        apiHost: 'http://206.189.150.145:7777',
        apiBitamin: 'http://206.189.150.145:7788',
        loginWalletHost: 'https://wallet.blood.land/sns/login/ext?appId=dX2zg30eNH2oJe3x', // for login test 1
        bloodAppId: 'dX2zg30eNH2oJe3x',
        connectHost: 'mongodb://localhost/land-db',
        connectDbLandLog: 'mongodb://localhost/log-db',
        connectDbGame: 'mongodb://localhost/game-db',
        devMode: true,
    },
    production: {
        clientHost: 'https://blood.land',
        apiHost: 'http://68.183.177.23:7777',
        apiBitamin: 'http://134.209.99.241:7788',
        loginWalletHost: 'https://wallet.blood.land/sns/login/ext?appId=HXW2IzgNGJe3I0Z1',
        bloodAppId: 'HXW2IzgNGJe3I0Z1',
        connectHost: 'mongodb://land:qmffjEMFOSEMx70whro%21rkwmDK%21@10.130.97.233:55555,10.130.103.171:55555,10.130.100.133:55555,10.130.3.44:55555,10.130.11.136:55555,10.130.63.210:55555,10.130.128.60:55555/land?replicaSet=land',
        connectDbLandLog: 'mongodb://log:qmffjEMFOSEMx70whro%21rkwmDK%21@10.130.117.166:55555,10.130.118.184:55555,10.130.119.199:55555/log?replicaSet=log',
        connectDbGame: 'mongodb://game:qmffjEMFOSEMx70whro%21rkwmDK%21@10.130.68.72:55555,10.130.119.175:55555,10.130.119.183:55555,10.130.134.150:55555,10.130.134.146:55555,10.130.134.179:55555,10.130.124.167:55555/game?replicaSet=game',
        devMode: true,
    }

}

module.exports = {
    ...(environment[process.env.NODE_ENV]),
    tokenTime: (5*60*60),
    sendEmail,
};

function sendEmail(message) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'hienviluong125@gmail.com',
            clientId: '343022202252-oagtg55hvlopr46l46jalleu46nd003t.apps.googleusercontent.com',
            clientSecret: 'Fceguvgx_y6e2Y06i4bXYCuC',
            accessToken: 'ya29.GltBBn8Gymch6bXycJH2soOER3m30bH0jvM0OycetAnEi6T1-F8gJ3swv7VX-UpaRPhxr8hBcyERujobCp6_0mhOTXskJeWB-QyUWrtVQGAaM6zlGxMViSslOncI',
            refreshToken: '1/71wZwtIHhvqMBj0ahRTONwCw34JCgfA4tfOmYF8pfPg',
        }
    });

    transporter.sendMail(message, (error, info) => {
        console.log(error?error:'Email sent: ' + info.response);
    });
}
