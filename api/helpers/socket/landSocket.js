const config = require('./../../db/config');
const landService = require('./../../containers/lands/services/indexNew');
const tradeService = require('./../../containers/users/services/trades');
const usersService = require('./../../containers/users/services/index');

let userLogins = [];

async function pushCharacterToList(socketId, dataUser, userNid) {
    let index = -1;
    for (let i = 0; i < userLogins.length; i++) {
        if (userLogins[i].userNid === userNid) {
            index = i;
            break;
        }
    }

    var isExist = false;
    if (index === -1) {
        userLogins.push({
            id: socketId,
            dataUser: dataUser,
            userNid: userNid
        });
    } else {
        for (let i = 0; i < userLogins.length; i++) {
            if (userLogins[i].userNid === userNid) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            userLogins.push({
                id: socketId,
                dataUser: dataUser,
                userNid: userNid
            });
        }
    }
    return isExist;
}

async function removeUserFromList(roomName, socketId) {
    let index = -1;
    for (let i = 0; i < userLogins.length; i++) {
        if (userLogins[i].dataUser === roomName) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        if (userLogins[index].id === socketId) {
            userLogins.splice(index, 1);
        }
    }
}

module.exports = function (io, socket) {
    socket.on('NEW_USER_CONNECTED', async (data) => {
        // console.log('data', data.user.user);
        if (typeof data !== 'undefined' && data && typeof data.user !== 'undefined' && data.user) {
            socket.join('user_' + data.user.user);
            socket.room = 'user_' + data.user.user;

            let userConnected = await pushCharacterToList(data.socketId, 'user_' + data.user.user, data.user.user);
            // if (userConnected) {
            socket.broadcast.to(socket.room).emit('OTHER_USER_CONNECTED', socket.id);
            //}
        }
    });

    //socket.on('USER_DICCONNECTED', async (data) => {
    //    await removeUserFromList(socket.room, socket.id);
    //});

    socket.on('disconnect', async function () {
        await removeUserFromList(socket.room, socket.id);
    });

    socket.on('BUY_CHARACTER_ITEM_IN_SHOP', async (socketData) => {
        const {socketId, dataBuy} = socketData;
        const paramName = typeof dataBuy['items'] !== 'undefined' ? 'items' : 'characters';
        // const { amount, price, name } = dataBuy[paramName][0];
        const {category} = dataBuy;
        let resBuy = await tradeService.buyCharacterItemInShop(dataBuy);
        if (resBuy && resBuy.status) {
            io.to(socketId).emit('RES_BUY_CHARACTER_ITEM_IN_SHOP', Object.assign(resBuy, {category}));
        } else {
            io.to(socketId).emit('RES_BUY_CHARACTER_ITEM_IN_SHOP', Object.assign(resBuy, {category}));
        }
    });

    socket.on('TRANSFER_BLOOD_TRADING_LAND', async (socketData) => {
        const {socketId, buyLands, token} = socketData;
        const authToken = await usersService.getByToken({token: token});
        if ((config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land' || config.clientHost === 'http://178.128.109.233') && typeof authToken.token === 'undefined') {
            //else emit a invalid token
            io.to(socketId).emit('INVALID_TOKEN');
        } else {
            //if authenticate token success
            buyLands.wToken = authToken.wToken;
            //console.log('buyLands', buyLands)
            let resPurchase = await tradeService.purchaseLands(buyLands);
            if (resPurchase.success) {
                //console.log('resPurchase', resPurchase);
                // if (buyLands.user.role === 'user') {
                //     const { buyFromSystemGiveAGift } = resPurchase;
                //     if (buyFromSystemGiveAGift && buyFromSystemGiveAGift.length > 0) {
                //         await addFreeBox({
                //             userId: buyLands.userId,
                //             quadKeys: buyFromSystemGiveAGift.map(({ quadKey }) => ({ quadKey })),
                //         });
                //     }
                // }
                io.to(socketId).emit('RES_TRANSFER_BLOOD_TRADING_LAND', {
                    socketId, ...resPurchase,
                    updatedLandCharacter: []
                });
            } else {
                io.to(socketId).emit('RES_TRANSFER_BLOOD_TRADING_LAND', {socketId, success: false});
            }
        }

    });

    socket.on('REMOVE_HISTORY_TRADING_LAND_SOCKET', async (data) => {
        const {histories, socketId, token} = data;
        const authToken = await usersService.getByToken({token: token});
        if ((config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land' || config.clientHost === 'http://178.128.109.233') && typeof authToken.token === 'undefined') {
            //else emit a invalid token
            io.to(socketId).emit('INVALID_TOKEN');
        } else {
            landService.removeHistory(histories)
                .then(res => {
                    io.to(socketId).emit('RES_REMOVE_HISTORY_TRADING_LAND_SOCKET', {socketId, ...res});
                })
                .catch(err => console.log(err))
        }
    });

    socket.on('SELL_LAND_SOCKET', async (data) => {
        const {socketId, lands, token} = data;
        const authToken = await usersService.getByToken({token: token});
        //console.log("config",config.clientHost);
        if ((config.clientHost === 'https://blood.land' || config.clientHost === 'https://working.blood.land' || config.clientHost === 'http://178.128.109.233') && typeof authToken.token === 'undefined') {
            //else emit a invalid token
            io.to(socketId).emit('INVALID_TOKEN');
        } else {
            landService.updateLandsState(lands)
                .then(success => {
                    io.to(socketId).emit('RES_SELL_LAND_SOCKET', {socketId, ...success});
                });
        }

    });
    //===================================================END SOCKET EDIT============================================================

};
