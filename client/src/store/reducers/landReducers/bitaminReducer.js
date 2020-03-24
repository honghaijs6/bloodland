import * as t from '../../actionTypes/landActionTypes/bitaminActionTypes'
const rootState = {
    historyReceive: [],
    historyUse: [],
    historyConvert: []
}
const bitaminReducer = (state = {...rootState}, action) => {
    switch (action.type) {
        case t.REQUEST_BITAMIN_HISTORY:
            // console.log('REQUEST_BITAMIN_HISTORY', action)
            return {
                ...state,
                requestCategory: action.category,
                loading: true
            };
        case t.EXCHANGE_BITAMIN_SUCCESS:
            // console.log('EXCHANGE_BITAMIN_SUCCESS',)
            return {
                ...state,
                exchange: action.exchange,
                status: "ieow",
                requestCategory: null,
                loading: false
            };
        case t.EXCHANGE_BITAMIN_FAILURE:
            return {
                ...state,
                exchange: action.error,
                requestCategory: null,
                loading: false
            };
        case t.GET_MY_BITAMIN_SUCCESS:
            return {
                ...state,
                ...action.result
            };
        case t.GET_MY_BITAMIN_FAILURE:
            return {
                ...state,
                bitamin: action.error
            };
        case t.GET_BITAMIN_HISTORY_RECEIVE_SUCCESS:
            return {
                ...state,
                historyReceive: action.history,
                loading: false
            };
        case t.GET_BITAMIN_HISTORY_USE_SUCCESS:
            return {
                ...state,
                historyUse: action.history,
                loading: false
            };
        case t.GET_BITAMIN_HISTORY_CONVERT_SUCCESS:
            return {
                ...state,
                historyConvert: action.history,
                loading: false
            };
        case t.GET_BITAMIN_HISTORY_FAILURE:
            return {
                ...state,
                history: action.error,
                loading: false
            };
        case t.RESET_STATUS:
            return {
                ...state,
                exchange: undefined
            };
        default:
            return state
    }
};

export default bitaminReducer