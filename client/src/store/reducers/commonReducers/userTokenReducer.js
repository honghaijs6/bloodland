import {
    LOGIN_SUCCESS,
    GETUSERBYTOKEN_SUCCESS,
    USER_LOGOUT
} from '../../actions/commonActions/userActions';
import { apiLand } from '../../../helpers/config';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: (apiLand==='http://127.0.0.1:5001'||apiLand==='http://127.0.0.1:5002'||apiLand==='http://127.0.0.1:5003')?action.user.token:action.user.wToken
            };
        case USER_LOGOUT:
            return {};
        case GETUSERBYTOKEN_SUCCESS:
            return {
                ...state,
                token: (apiLand==='http://127.0.0.1:5001'||apiLand==='http://127.0.0.1:5002'||apiLand==='http://127.0.0.1:5003')?action.user.token:action.user.wToken
            };
        default:
            return state;
    }
}
