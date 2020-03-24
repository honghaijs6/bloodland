import {bitaminService} from "../../services/landServices/bitaminService";
import * as t from '../../actionTypes/landActionTypes/bitaminActionTypes'
// import { history } from './../../../helpers/history';

export const bitaminActions = {
    getMyBitamin,
    getBitaminHistory,
    exchangeBitamin,
    resetStatus
};

function getMyBitamin(param) {
    return dispatch => {
        bitaminService.getMyBitamin(param)
            .then(
                result => {
                    dispatch(success(result))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(result) {
        return { type: t.GET_MY_BITAMIN_SUCCESS, result }
    }

    function failure(error) {
        return { type: t.GET_MY_BITAMIN_FAILURE, error }
    }
}

function exchangeBitamin(param) {
    // console.log('param', param)
    return dispatch => {
        bitaminService.exchangeBitamin(param)
            .then(
                exchange => {
                    dispatch(success(exchange))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(exchange) {
        return { type: t.EXCHANGE_BITAMIN_SUCCESS, exchange }
    }

    function failure(error) {
        return { type: t.EXCHANGE_BITAMIN_FAILURE, error }
    }
}

function getBitaminHistory(param) {
    const {category} = param;
    return dispatch => {
        dispatch(request(category));
        bitaminService.getBitaminHistory(param)
            .then(
                history => {
                    if(category === 'RECEIVE'){
                        dispatch(successReceive(history))
                    }
                    if(category === 'USE'){
                        dispatch(successUse(history))
                    }
                    if(category === 'CONVERT'){
                        dispatch(successConvert(history))
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };
    // /{userId,category,offsetNumber}
    function request(category) {
        return { type: t.REQUEST_BITAMIN_HISTORY , category}
    }

    function successReceive(history) {
        return { type: t.GET_BITAMIN_HISTORY_RECEIVE_SUCCESS, history }
    }
    function successUse(history) {
        return { type: t.GET_BITAMIN_HISTORY_USE_SUCCESS, history }
    }
    function successConvert(history) {
        return { type: t.GET_BITAMIN_HISTORY_CONVERT_SUCCESS, history }
    }

    function failure(error) {
        return { type: t.GET_BITAMIN_HISTORY_FAILURE, error }
    }
}

function resetStatus(){
    return {type:  t.RESET_STATUS }
}