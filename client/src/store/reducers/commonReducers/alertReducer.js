import {
    // CLEAR_UPDATE,
    // UPDATE_SUCCESS,
    // UPDATE_FAILURE,
    SUCCESS,
    ERROR,
    CLEAR,
    POPUP,
    CLOSE_POPUP,
    SET_CURRENT_COMPONENT, TOKEN_EXPIRED
} from '../../actions/commonActions/alertActions';
import {LOGIN_REQUEST, REGISTER_REQUEST} from '../../actions/commonActions/userActions';

export default function (state = {screen: -1}, action) {
    switch (action.type) {
        case SET_CURRENT_COMPONENT:
            return {
                ...state,
                component: action.component
            }
        case LOGIN_REQUEST:
            return {
                ...state,
                type: '',
                message: ''
            };
        case REGISTER_REQUEST:
            return {
                ...state,
                type: '',
                message: ''
            };
        case SUCCESS:
            return {
                ...state,
                type: 'success',
                message: action.message,
                success: action.success
            };
        case ERROR:
            return {
                ...state,
                type: 'danger',
                message: action.message,
                success: action.success
            };
        case CLEAR:
            return {};
        case POPUP:
            return {
                ...state,
                screen: action.screen
            }
        case CLOSE_POPUP: {
            return {
                ...state,
                screen: action.screen
            }
        }
        case TOKEN_EXPIRED:
            return {
                ...state,
                tokenError : action.tokenError
            };
        default:
            return state
    }
}
