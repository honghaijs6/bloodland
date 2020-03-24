export const SUCCESS = 'ALERT_SUCCESS';
export const ERROR = 'ALERT_ERROR';
export const CLEAR = 'ALERT_CLEAR';
export const POPUP = 'POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';
export const SET_CURRENT_COMPONENT = 'SET_CURRENT_COMPONENT';
export const TOKEN_EXPIRED = 'TOKEN_EPIRED'
export const alertActions = {
    success,
    error,
    clear,
    popup,
    closePopup,
    setCurrentComponent, tokenExpiredPopup

};

function setCurrentComponent(component) {
    return {type: SET_CURRENT_COMPONENT, component}
}

function success(message) {
    return {type: SUCCESS, success: true, message};
}

function error(message) {
    return {type: ERROR, message, success: false};
}

function clear() {
    return {type: CLEAR};
}

function popup(screen) {
    return {
        type: POPUP,
        screen
    }
}

function closePopup() {
    return {
        type: CLOSE_POPUP,
        screen: -1
    }
}

function tokenExpiredPopup(err){
    return dispatch => {
        dispatch( {
            type: TOKEN_EXPIRED,
            tokenError: err
        })
    }
}




export default alertActions;
