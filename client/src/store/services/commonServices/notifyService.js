import { apiLand } from '../../../helpers/config';
import {authHeader} from '../../../helpers/authHeader';
import alertActions from "../../actions/commonActions/alertActions";
import {store} from "../../../helpers/store";

export const notifyService = {
    getById,
    updateStatus,
    send
};

export function getById(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id})
    };

    return fetch(`${apiLand}/notifies/getById`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function updateStatus(id) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id})
    };

    return fetch(`${apiLand}/notifies/updateStatus`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function send(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/notifies/send`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
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
