import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
import alertActions from "../../actions/commonActions/alertActions";
import { store } from "../../../helpers/store";
import { handleResponses, handleErrorResponses } from "../../../helpers/handleResponse"

export const landService = {
    getAllLandMarkCategoryInMap,
    addCenterCategory,
    getDefault,
    getAllLandById,
    getAllHistoryTradingLandById,
    purchase,
    getAllLand,
    getAllCategory,
    transferLandCategory,
    editLand,
    addCategory,
    editCategory,
    deleteLandCategory,
    getAllLandMarkCategory,
    getAllLandCategory,
    getLandByCategory,
    getAreaLand,
    changeLandMarkState,
    getLandInfo,
    getLandByQuadKeys
};

export function getLandInfo(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getLandInfo`, requestOptions).then(handleResponses).catch(err => handleResponseError(err));
}


export function getAllLandMarkCategoryInMap() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        //body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getAllLandMarkCategoryInMap`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}


export function addCenterCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/addCenterCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getAllLandById(userId) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    };
    return fetch(`${apiLand}/lands/getAllLandById`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
//ko
export function getDefault() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    return fetch(`${apiLand}/lands/getDefault`, requestOptions)
        .then(handleResponse)
        .catch(err => {
            console.log("error: ", err);
        });
}
//ko
export function getAllHistoryTradingLandById(userId) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),

    };
    return fetch(`${apiLand}/lands/getAllHistoryTradingLandById`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}
//ko
export function purchase(land) {

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(land)
    };
    return fetch(`${apiLand}/lands/purchase`, requestOptions)
        .then(handleResponse)
        .then(lands => {
            return lands;
        });
}
//ko
export function getAllLand(startEndTile) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(startEndTile),
    };
    return fetch(`${apiLand}/lands/getAllLand`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

// getAreaLand
export function getAreaLand(startEndTile) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(startEndTile),
    };
    return fetch(`${apiLand}/lands/getAreaLand`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getLandByQuadKeys({ userId, itemQuadKeys }) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemQuadKeys }),
    };
    return fetch(`${apiLand}/lands/getLandByQuadKeys`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function transferLandCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/transferLandCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function editLand(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/editLand`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function addCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/addCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function editCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/editCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}


export function deleteLandCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };
    return fetch(`${apiLand}/lands/deleteLandCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getAllCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getAllCategory`, requestOptions).then(handleResponses).catch(handleErrorResponses);
}

export function getAllLandMarkCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getAllLandMarkCategory`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getAllLandCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getAllLandCategory`, requestOptions).then(handleResponses).catch(err => handleResponseError(err));
}

export function getLandByCategory(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/getLandByCategory`, requestOptions).then(handleResponses).catch(err => handleResponseError(err));
}

export function changeLandMarkState(param) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(param)
    };

    return fetch(`${apiLand}/lands/updateLandMarksState`, requestOptions).then(handleResponses).catch(err => handleResponseError(err));
}

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401)
                window.location.reload(true);

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export function handleResponseError(err) {
    if (err.toString() === 'TypeError: Failed to fetch') {
        store.dispatch(alertActions.tokenExpiredPopup(err))
    }
}
