import { apiGame } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from "../../../helpers/handleResponse";
const _ = require('../../../helpers/testTemplate');

export const randomBoxInventoryService = {
    getRandomBoxInventory,
    openRandomBoxes,
};

export function getRandomBoxInventory(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/randomBoxInventory/getRandomBoxInventory`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function openRandomBoxes(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/randomBoxInventory/openBoxCreateItemAndAddToInventory`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
