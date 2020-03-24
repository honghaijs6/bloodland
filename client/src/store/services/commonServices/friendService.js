import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

export const friendService = {
    getBeBlockedUser,
    getFriendListBlockList,
    findFriend,
    addFriend,
    unFriend,
    blockFriend,
    unBlockFriend,
    checkStatusByUserName
};

export function getFriendListBlockList(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/getFriendListBlockList`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
export function checkStatusByUserName(param){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/friends/checkStatusByUserName`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function addFriend(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/add`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function findFriend(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/find`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function unFriend(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/unFriend`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function blockFriend(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/block`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function unBlockFriend(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/friends/unBlock`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getBeBlockedUser(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/friends/getBeBlockedUser`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
