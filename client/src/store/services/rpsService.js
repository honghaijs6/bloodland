import { apiLand } from '../../helpers/config';
import { authHeader } from '../../helpers/authHeader';
import alertActions from "../actions/commonActions/alertActions";
import {store} from "../../helpers/store";

export const rpsService = {
    create,
    findUser,
    getAll,
    getLastHistory
};

export function create(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/events/create`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function findUser(userName)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userName)
    };
    return fetch(`${apiLand}/events/findUser`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getAll(userName)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userName)
    };
    return fetch(`${apiLand}/events/getAll`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getLastHistory()
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };
    return fetch(`${apiLand}/events/history`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function handleResponse(response)
{
    return response.text().then(text => {
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
