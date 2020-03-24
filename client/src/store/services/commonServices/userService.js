import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
import {store} from '../../../helpers/store';
import alertActions from "../../actions/commonActions/alertActions";
// import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';
// const _ = require('../../../helpers/testTemplate');

import {tradeService} from './tradeService';
import {friendService} from './friendService';
import {settingService} from './settingService';
import {mailService} from './mailService';

// import {} from './settingService';

export const userService = {
    login,
    register,
    getAll,
    getById,
    socialLoginRequest,
    getByToken,
    ...tradeService,
    ...friendService,
    ...settingService,
    ...mailService
};

export function login(userName, password)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
    };

    return fetch(`${apiLand}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (typeof user.token !== 'undefined' && (user.token) && (user.token) !== '') {
                //console.log('userService save token', localStorage)
                localStorage.setItem('token', user.token);
            }
            return user;
        });
}

export function getAll()
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiLand}/users`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getById(id)
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${apiLand}/users/${id}`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}
//ko
export function getByToken(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        mode:'cors',
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/users/getByToken`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (typeof user.token !== 'undefined' && (user.token) && (user.token) !== '') {
                //console.log('userService 2', localStorage);
                localStorage.setItem('token', user.token);
            }
            return user;
        });
}

export function register(user)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${apiLand}/users/register`, requestOptions).then(handleResponse).catch();
}

export function socialLoginRequest(user)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`${apiLand}/users/socialLogin`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function handleResponse(response)
{
    return response.text().then(text => {
        //console.log('response text', response);
        const data = text && JSON.parse(text);
        if (!response.ok)
        {
            if (response.status === 401)
                window.location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export function handleResponseError(err){
    if(err.toString() === 'TypeError: Failed to fetch'){
        store.dispatch(alertActions.tokenExpiredPopup(err))
    }
}
