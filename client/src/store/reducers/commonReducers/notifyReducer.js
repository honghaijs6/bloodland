import {
    GET_BY_ID_NOTIFY_SUCCESS,
    GET_BY_ID_NOTIFY_FAILURE,
    UPDATE_STATUS_NOTIFY_SUCCESS,
    UPDATE_STATUS_NOTIFY_FAILURE,
    SEND_NOTIFY_SUCCESS,
    SEND_NOTIFY_FAILURE, OPEN_NOTIFY
} from "../../actions/commonActions/notifyActions";

const notificationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_BY_ID_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case GET_BY_ID_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UPDATE_STATUS_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case UPDATE_STATUS_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SEND_NOTIFY_SUCCESS:
            return {
                ...state,
                notifies: action.notifies
            };
        case SEND_NOTIFY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case OPEN_NOTIFY:
            // console.log('notice', action.notice)
            return{
                ...state,
                notice: action.notice
            };
        default:
            return state
    }
};

export default notificationReducer;