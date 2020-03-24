import { apiLand } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleErrorResponses,handleResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

export const bitaminService = {
    getMyBitamin,
    getBitaminHistory,
    exchangeBitamin
};

export function getMyBitamin(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/bitamin/getMyBitamin`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function exchangeBitamin(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/bitamin/exchangeBitamin`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
export function getBitaminHistory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/bitamin/getBitaminHistory`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}