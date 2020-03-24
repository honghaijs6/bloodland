import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
// import {store} from '../../../helpers/store';
// import alertActions from "../../actions/commonActions/alertActions";
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

export const settingService = {
    getSetting,
    setLandShowInfo,
    setBgMusic,
    setEffMusic,
    setSetting,
    setLanguage
};

export function getSetting(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/settings/get`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function setLandShowInfo(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/settings/setLandShowInfo`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function setBgMusic(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/settings/setBgMusic`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}


export function setEffMusic(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/settings/setEffMusic`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function setSetting(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/settings/set`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function setLanguage(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/settings/setLanguage`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
