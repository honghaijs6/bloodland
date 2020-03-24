import * as t from '../../actionTypes/gameActionTypes/shopsActionTypes'

const shopsReducer = (state = {}, action) => {
    switch (action.type) {
        case t.GET_SHOPS_SUCCESS:
            return {
                ...state,
                shops: action.shop
            };
        case t.GET_SHOPS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.GET_SHOPS_RANDOM_BOX_SUCCESS:
            return {
                ...state,
                shopsRandomBox: action.shopsRandomBox
            };
        case t.GET_SHOPS_RANDOM_BOX_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.BUY_SHOPS_SUCCESS:
            return {
                ...state,
                result: action.result
            };
        case t.CLEAR_RESULT_STATUS:
            return {
                ...state,
                result: undefined
            };
        default:
            return state
    }
};

export default shopsReducer;