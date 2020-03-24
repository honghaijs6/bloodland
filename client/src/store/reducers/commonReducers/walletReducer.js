import {
    UPDATE_WALLET_INFO,
    LOGIN_WALLET_SUCCESS,
    USER_LOGOUT,
    GET_GOLD_BLOOD_SUCCESS,
    GET_GOLD_BLOOD_FAILURE,
    ADD_GOLD_BLOOD_SUCCESS,
    ADD_GOLD_BLOOD_FAILURE,
    USE_GOLD_BLOOD_SUCCESS,
    USE_GOLD_BLOOD_FAILURE,
    COIN_TO_WALLET_SUCCESS,
    COIN_TO_WALLET_FAILURE,
    WALLET_TO_COIN_SUCCESS,
    WALLET_TO_COIN_FAILURE
} from '../../actions/commonActions/userActions';

export default function (state = {}, action) {
    switch (action.type) {
        case UPDATE_WALLET_INFO:
            if (typeof state.info !== 'undefined' && Array.isArray(action.res.walletInfos) && action.res.walletInfos.length > 0) {
                let {_id,userName} = state.info;
                let foundIndex = action.res.walletInfos.findIndex(wInfo => wInfo._id === _id && wInfo.userName === userName);
                return {
                    ...state,
                    info: foundIndex === -1 ? state.info : action.res.walletInfos[foundIndex]
                }
            } else {
                return {
                    ...state,
                    info: action.res.walletInfo
                };
            }

        case LOGIN_WALLET_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case GET_GOLD_BLOOD_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case GET_GOLD_BLOOD_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case ADD_GOLD_BLOOD_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case ADD_GOLD_BLOOD_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case USE_GOLD_BLOOD_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case USE_GOLD_BLOOD_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case COIN_TO_WALLET_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case COIN_TO_WALLET_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case WALLET_TO_COIN_SUCCESS:
            return {
                ...state,
                info: action.info
            };
        case WALLET_TO_COIN_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case USER_LOGOUT:
            return {};
        default:
            return state
    }
}
