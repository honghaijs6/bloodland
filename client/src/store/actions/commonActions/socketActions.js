export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';
export const USER_CONNECTED = 'USER_CONNECTED';
export const USER_DISCONNECTED = 'USER_DISCONNECTED';
export const EVENT_USERS_COUNT = 'EVENT_USERS_COUNT';
export const EVENT_INITIAL = 'EVENT_INITIAL';
export const GET_EVENT_USERS_REQUEST = 'GET_EVENT_USERS_REQUEST';

//=======RE-PERFORMENT SOCKET=======
export const TRANSFER_BLOOD_SOCKET = 'TRANSFER_BLOOD_SOCKET';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET = 'REMOVE_HISTORY_TRADING_LAND_SOCKET';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS = 'REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS';
export const REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE = 'REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE';
export const CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET = 'CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET';
export const GET_ALL_LAND_SOCKET = 'GET_ALL_LAND_SOCKET';
export const GET_ALL_LAND_SOCKET_SUCCESS = 'GET_ALL_LAND_SOCKET_SUCCESS';
export const GET_ALL_LAND_SOCKET_FAILURE = 'GET_ALL_LAND_SOCKET_FAILURE';
export const PURCHASE_LAND = 'PURCHASE_LAND';
export const PURCHASE_LAND_SUCCESS = 'LANDS_PURCHASE_SUCCESS';
export const PURCHASE_LAND_FAILURE = 'LANDS_PURCHASE_FAILURE';
export const RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS = 'RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS';
export const RESPONSE_PURCHASE_LAND_SOCKET_FAILURE = 'RESPONSE_PURCHASE_LAND_SOCKET_FAILURE';
export const UPDATE_LANDS_OF_OTHER_USER = 'UPDATE_LANDS_OF_OTHER_USER';
export const UPDATE_LANDS_IN_STORAGE = 'UPDATE_LANDS_OF_OTHER_USER';
export const CLEAR_SOCKET_ACTION = 'CLEAR_SOCKET_ACTION';
export const SELL_LAND_SOCKET = 'SELL_LAND_SOCKET';
export const CLEAR_SELL_LAND_STATUS_SOCKET = 'CLEAR_SELL_LAND_STATUS_SOCKET';
export const RESPONSE_SELL_LAND_SOCKET_SUCCESS = 'RESPONSE_SELL_LAND_SOCKET_SUCCESS';
export const RESPONSE_SELL_LAND_SOCKET_FAILURE = 'RESPONSE_SELL_LAND_SOCKET_FAILURE';
export const TRANSFER_BLOOD_TRADING_LAND = 'TRANSFER_BLOOD_TRADING_LAND';

export const socketActions = {
    //======LAND SOCKET======
    transferBloodTradingLand,
    clearRemoveHistoryTradingLandStatus,
    responseRemoveHistoryTradingLand,
    removeHistoryTradingLand,
    clearForSaleStatusSocket,
    sellLandSocket,
    responseSellLandSocket,
    responsePurchaseLand,
    responsePurchaseLandSocket,
    responseGetAllLandSocket,
    //======END LAND SOCKET======
    sendMessage,
    userConnected,
    userDisconnected,
};


//============================================SOCKET EDIT==========================================

function transferBloodTradingLand(data){
    return { type: TRANSFER_BLOOD_TRADING_LAND, data };
}

function clearRemoveHistoryTradingLandStatus(){
    return { type : CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET };
}

function removeHistoryTradingLand(data){
    return { type : REMOVE_HISTORY_TRADING_LAND_SOCKET, data };
}

function responseRemoveHistoryTradingLand(res){
    return res.success ? { type: REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS, res } : { type: REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE, res };
}

function clearForSaleStatusSocket(){ return { type : CLEAR_SELL_LAND_STATUS_SOCKET } };

function sellLandSocket(lands){
    return { type : SELL_LAND_SOCKET, lands: lands };
}

function responseSellLandSocket(res) {
    return res.success ? { type: RESPONSE_SELL_LAND_SOCKET_SUCCESS, res } : { type: RESPONSE_SELL_LAND_SOCKET_FAILURE, res }
}

function responsePurchaseLand(resPurchase){
    return resPurchase.success ?
        { type: PURCHASE_LAND_SUCCESS, resPurchase } :
        { type: PURCHASE_LAND_FAILURE, resPurchase }
}

function responseGetAllLandSocket(res){
    return res.lands ? { type: GET_ALL_LAND_SOCKET_SUCCESS, res } : { type: GET_ALL_LAND_SOCKET_FAILURE, res }
}

function responsePurchaseLandSocket(res){
    return res.success ? { type: RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS, res } : { type: RESPONSE_PURCHASE_LAND_SOCKET_FAILURE, res }
}

//=============================================END SOCKET EDIT=======================================

function userDisconnected(user){
    return { type : USER_DISCONNECTED, user : user }
}

function userConnected(user) {
    return {
        type: USER_CONNECTED,
        user: user
    }
}

// function updateUserStatus(onlineUsers) {
//     return {
//         type: UPDATE_USER_STATUS,
//         onlineUsers: onlineUsers
//     }
// }
//
// function fetchMessages(messages) {
//     return {
//         type: FETCH_MESSAGES,
//         messages: messages
//     }
// }

function sendMessage(message) {
    return {
        type: SEND_MESSAGE,
        message: message
    }
}
