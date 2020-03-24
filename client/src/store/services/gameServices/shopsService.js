import { apiGame } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleErrorResponses,handleResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

/*
  //vuong 23.3 - shopsActions
*/
export const shopsService = {
    getShop,
    buyItemFromShop,
    buyRandomBoxFromShop,
    getRandomBoxShop
};

export function getShop() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    return fetch(`${apiGame}/game/shop/getShop`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getRandomBoxShop() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    return fetch(`${apiGame}/game/shop/getRandomBoxShop`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function buyItemFromShop(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/shop/buyItemFromShop`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function buyRandomBoxFromShop(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/shop/buyRandomBoxFromShop`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}