import { apiLand } from '../../../helpers/config';
import { authHeader } from '../../../helpers/authHeader';
import alertActions from "../../actions/commonActions/alertActions";
import {store} from "../../../helpers/store";

export const chatService = {
    getAll,
    create,
    uploadImage,
    loadMoreMessage
};

export function create(room) {
    let formData = new FormData();
    formData.append('name',room.name);
    formData.append('image',room.image);
    formData.append('imageFile', room.imageFile);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };
    return fetch(`${apiLand}/chats/add`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function getAll() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };
    return fetch(`${apiLand}/chats/getAll`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function uploadImage(selectedFile) {
    let formData = new FormData();
    formData.append('selectedFile', selectedFile);

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: formData
    };

    return fetch(`${apiLand}/chats/uploadImage`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
}

export function loadMoreMessage(roomName,n,topMessIndex){
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(),'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, n,topMessIndex })
    };

    return fetch(`${apiLand}/chats/loadMoreMessage`, requestOptions).then(handleResponse).catch(err => handleResponseError(err));
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
