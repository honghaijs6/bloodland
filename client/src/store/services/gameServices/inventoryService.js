import { apiGame } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
// import alertActions from "../../actions/commonActions/alertActions";
// import {store} from "../../../helpers/store";
import {handleResponses,handleErrorResponses} from "../../../helpers/handleResponse";
const _ = require('../../../helpers/testTemplate');

export const inventoryService = {
    getCharacterInventoryByUserId,
    getItemInventoryByUserId,
    moveTreeToMap,
    useItemForTree,
    checkAnyDeadTrees,
    handleGetAllTreesByUserId,
    handleCombineTreeByUserId
};

export function getCharacterInventoryByUserId(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/getCharacterInventoryByUserId`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getItemInventoryByUserId(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/getItemInventoryByUserId`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}


export function moveTreeToMap(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/moveTreeToMap`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function useItemForTree(param) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/useItem`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function checkAnyDeadTrees(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/checkAnyDeadTrees`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function handleGetAllTreesByUserId(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body:  _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/getAllTreesByUserId`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}


export function handleCombineTreeByUserId(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body:   _.body(param)
    };
    return fetch(`${apiGame}/game/inventory/combineTrees`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

