import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
// import {store} from '../../../helpers/store';
// import alertActions from "../../actions/commonActions/alertActions";
import {handleResponses,handleErrorResponses} from '../../../helpers/handleResponse';
const _ = require('../../../helpers/testTemplate');

export const tradeService = {
    getBalance,
    getWithdraw,
    getPay,
    getRewardInterest,
    getWalletInfo,
    transferBlood,
    purchaseLands,
    getGoldBlood,
    addGoldBlood,
    useGoldBlood,
    coinToWallet,
    walletToCoin
};

export function getBalance(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getBalance`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getWithdraw(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getWithdraw`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getPay(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getPay`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getRewardInterest(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getRewardInterest`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getWalletInfo(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getWalletInfo`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function transferBlood(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/trades/transferBlood`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function purchaseLands(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: _.body(param)
    };

    return fetch(`${apiLand}/users/trades/purchaseLands`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getGoldBlood(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/getGoldBlood`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function addGoldBlood(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/addGoldBlood`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function useGoldBlood(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/useGoldBlood`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function coinToWallet(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/coinToWallet`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function walletToCoin(param)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: _.body(param)
    };
    return fetch(`${apiLand}/users/trades/walletToCoin`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
