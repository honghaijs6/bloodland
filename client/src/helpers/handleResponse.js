import {store} from "../helpers/store";
import alertActions from "../store/actions/commonActions/alertActions";
const mm = require('./testTemplate');

export function handleResponses(response)
{
    return response.text().then(text => {
        if(response.ok){
            let data = null;
            data = JSON.parse( mm.gm(text));
            // if(process.env.NODE_ENV !== "development"){
            //     console.log("response.ok =>> process.env.NODE_ENV !== development",process.env.NODE_ENV);
            //     data = JSON.parse( mm.gm(text));
            // }
            // else {
            //     console.log("response.ok =>> process.env.NODE_ENV === development",process.env.NODE_ENV);
            //     data = JSON.parse(text);
            // }

            // console.log('data',data);
            return data;
        }
        else{
            // console.log('loi nam day', text);
            let data = null;
            data = JSON.parse( mm.gm(text));
            // if(process.env.NODE_ENV !== "development"){
            //     data = JSON.parse( mm.gm(text));
            // }
            // else {
            //     data = JSON.parse(text);
            // }
            if (response.status === 401)
                window.location.reload(true);
            // console.log('data',data)
            return Promise.reject(data);
        }
    });
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

export function handleErrorResponses(err){
    // console.log("response.err",err);
    if(err){
        store.dispatch(alertActions.tokenExpiredPopup(err))
    }
    return err;
}
