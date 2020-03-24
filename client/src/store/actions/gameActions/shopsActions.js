import {shopsService} from "../../services/gameServices/shopsService";
import * as t from '../../actionTypes/gameActionTypes/shopsActionTypes'

export const shopsActions = {
    getShop,
    getRandomBoxShop,
    buyItemFromShop,
    buyRandomBoxFromShop,
    clearResultStatus
};

function getShop() {
    return dispatch => {
        shopsService.getShop()
            .then(
                shop => {
                    dispatch(success(shop));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(shop) {
        return {type: t.GET_SHOPS_SUCCESS, shop}
    }

    function failure(error) {
        return {type: t.GET_SHOPS_FAILURE, error}
    }
}

function getRandomBoxShop() {
    return dispatch => {
        shopsService.getRandomBoxShop()
            .then(
                shopsRandomBox => {
                    dispatch(success(shopsRandomBox));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(shopsRandomBox) {
        return {type: t.GET_SHOPS_RANDOM_BOX_SUCCESS, shopsRandomBox}
    }

    function failure(error) {
        return {type: t.GET_SHOPS_RANDOM_BOX_FAILURE, error}
    }
}

function buyItemFromShop(param) {
    return dispatch => {
        shopsService.buyItemFromShop(param)
            .then(
                result => {
                    dispatch(success(result))
                },
                error => {
                    // dispatch(failure(error.toString()));
                }
            )
    };

    function success(result) {
        return {type: t.BUY_SHOPS_SUCCESS, result}
    }
}

function buyRandomBoxFromShop(param) {
    return dispatch => {
        shopsService.buyRandomBoxFromShop(param)
            .then(
                result => {
                    dispatch(success(result))
                }
            )
    };

    function success(result) {
        return {type: t.BUY_SHOPS_SUCCESS, result}
    }
}

function clearResultStatus() {
    return {type: t.CLEAR_RESULT_STATUS}
}
