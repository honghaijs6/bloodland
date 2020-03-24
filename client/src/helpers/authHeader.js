import { apiLand } from '../helpers/config';
import {store} from "./store";
import isEmpty from "lodash.isempty";

export function authHeader() {
    const { userToken } = store.getState();
    let token = (typeof localStorage.token !== 'undefined') ? localStorage.token : '';

    if (typeof userToken.token !== 'undefined'&&!isEmpty(userToken.token)) token = userToken.token;

    if( apiLand === 'https://if-land.blood.land:4000' || apiLand === 'https://if.blood.land:4000')
        return (token)?{ 'Authorization': token }:{};

    return (token)?{ 'Authorization': 'Bearer ' + token }:{};
}
