import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

export const mailService = {
    getAllMails,
    sendMail,
    readMail,
    deleteSentMail,
    deleteReceivedMail,
    haveNewMails,
    readManyMail
};

export function haveNewMails(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/mails/haveNewMails`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}


export function getAllMails(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/mails/getAll`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function sendMail(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/mails/send`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function readMail(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/mails/read`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function readManyMail(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/mails/readManyMail`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function deleteReceivedMail(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/mails/deleteReceivedMail`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function deleteSentMail(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/mails/deleteSentMail`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
