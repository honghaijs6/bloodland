import { userActions} from '../../store/actions/commonActions/userActions';
import alertActions from '../../store/actions/commonActions/alertActions';
import { socketActions } from '../../store/actions/commonActions/socketActions';
import {bloodAppId} from "../config";

const landEvent = {
    TRANSFER_BLOOD_SOCKET: (socket, action) => {
        const token = localStorage.getItem('token');
        const socketId = socket.land.id;
        // console.log('action', action.dataTransfer)
        socket.land.emit('TRANSFER_BLOOD_SOCKET', { socketId, dataTransfer: action.dataTransfer, token });
    },

    REMOVE_HISTORY_TRADING_LAND_SOCKET: (socket, action) => {
        const token = localStorage.getItem('token');
        const socketId = socket.land.id;
        socket.land.emit('REMOVE_HISTORY_TRADING_LAND_SOCKET', { socketId, ...action.data, token });
    },
    TRANSFER_BLOOD_TRADING_LAND: (socket, action) => {
        const token = localStorage.getItem('token');
        const socketId = socket.land.id;
        socket.land.emit('TRANSFER_BLOOD_TRADING_LAND', { socketId, ...action.data, token });
    },
    SELL_LAND_SOCKET: (socket, action) => {
        const token = localStorage.getItem('token');
        const socketId = socket.land.id;
        socket.land.emit('SELL_LAND_SOCKET', { socketId, lands: action.lands, token });
    },

    NEW_USER_CONNECTED: (socket, action) => {
        if (typeof action !== 'undefined' && action && typeof action.user !== 'undefined' && action.user) {
            socket.land.emit('NEW_USER_CONNECTED', { socketId: socket.land.id, user: action.user });
        }
    },
};





const landSocket = (dispatch, socket) => {
    socket.land.on('INVALID_TOKEN', (res) => {
        dispatch(alertActions.tokenExpiredPopup('authentication failed'));
    });

    socket.land.on('OTHER_USER_CONNECTED', async (res) => {
        window.location.replace('https://wallet.blood.land/sns/logout/ext?appId='+bloodAppId);
    });

    socket.land.on('RES_TRANSFER_BLOOD_SOCKET', (res) => {
        res.isOwn = res.socketId === socket.land.id;
        //console.log('RES_TRANSFER_BLOOD_SOCKET ', res)
        dispatch(userActions.responseTransferBloodSocket(res));
    });

    socket.land.on('RES_TRANSFER_BLOOD_TRADING_LAND', (res) => {
        res.isOwn = res.socketId === socket.land.id;
        // event to load garbage Tress
        // dispatch(landCharacterActions.addCharacterSucccess(res.garbageTrees));

        dispatch(socketActions.responsePurchaseLandSocket(res));
        dispatch(userActions.updateWalletInfo(res));

        //reload trees
        // dispatch(landCharacterActions.reloadCharacters(res.updatedLandCharacter));

    });

    socket.land.on('RES_REMOVE_HISTORY_TRADING_LAND_SOCKET', (res) => {
        res.isOwnDeleteHistory = res.socketId === socket.land.id;
        dispatch(socketActions.responseRemoveHistoryTradingLand(res));
    });
    socket.land.on('RES_SELL_LAND_SOCKET', (res) => {
        res.isOwn = res.socketId === socket.land.id;
        dispatch(socketActions.responseSellLandSocket(res));
    });
    socket.land.on('RES_PURCHASE_LAND_SOCKET', (res) => {
        res.isOwn = res.socketId === socket.land.id;
        //console.log("resresresres",res);
        //console.log('RES_PURCHASE_LAND_SOCKET', res);
        dispatch(socketActions.responsePurchaseLandSocket(res));
    });
    socket.land.on('RES_GET_ALL_LAND_SOCKET', (res) => {
        dispatch(socketActions.responseGetAllLandSocket(res));
    });
};

export {
    landSocket,
    landEvent
}
