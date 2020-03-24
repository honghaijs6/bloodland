import {
    DISABLE_TILE_MAP,
    CLEAR_INVALID_TOKEN,
    INVALID_TOKEN,
    CLEAR_STATUS_REMOVE_LAND_IN_CART,
    REMOVE_LAND_IN_CART,
    ADD_LAND_TO_CART,
    SYNC_CENTER_MAP,
    UPDATE_MAP,
    UPDATE_MOVABLES,
    GET_CURRENT,
    ADD_SELECTED,
    CLEAR_STEP_AFTER_MOVE,
    UPDATE_TILES,
    SELECT_MODE,
    //======================
    CLEAR_SELECTED,
    CLEAR_CART,
    SAVE_CART
} from '../../actions/commonActions/mapActions';

export default function (state = {tiles: [] , searchLocation: {}}, action) {
    switch (action.type) {
        case DISABLE_TILE_MAP:
            return { ...state, ...action };
        case CLEAR_INVALID_TOKEN:
            if(state.invalidToken){
                delete state.invalidToken;
            }
            return { ...state };
        case INVALID_TOKEN:
            return { ...state, invalidToken: true };
        case CLEAR_STATUS_REMOVE_LAND_IN_CART:
            if(state.isRemoveLandInCart){
                delete state.isRemoveLandInCart;
            }
            return { ...state };
        case REMOVE_LAND_IN_CART:
            let cartAfterRemove = [];
            if(action.lands){
                if(state.cart){
                    if(action.lands && action.lands[0].land){ //remove land after buy in land cart
                        cartAfterRemove = state.cart.filter(land => !action.lands.some(l => l.land.quadKey === land.quadKey));
                    } else { //remove land at deleted button
                        cartAfterRemove = state.cart.filter(land => !action.lands.some(l => l.quadKey === land.quadKey));
                    }
                }
            }
            return { ...state, cart: cartAfterRemove, isRemoveLandInCart: true };
        case ADD_LAND_TO_CART:
            // if(debug){
            // }
            let newCart = [];
            if(state.cart && state.cart.length > 0){
                if(action.lands && action.lands.length > 0){
                    let arrRemoveDuplicate = action.lands.filter(land => {
                        return !state.cart.some(l => l.quadKey === land.quadKey);
                    });
                    newCart = state.cart.concat(arrRemoveDuplicate);
                }
            } else {
                newCart = newCart.concat(action.lands);
            }
            if(state.selected && state.selected.length > 0){
                state.selected = [];
            }
            return { ...state, cart: newCart };
        case UPDATE_TILES:
            return {
                ...state,
                tiles: action.tiles
            };
        case SYNC_CENTER_MAP:
            return {
                ...state,
                ...action,
            };
        case UPDATE_MAP:
            return {
                ...state,
                map: action.map
            };
        case UPDATE_MOVABLES:
            return {
                ...state,
                movables: action.movables
            };
        case GET_CURRENT:
            return {
                ...state,
                current: action.current
            };
        case ADD_SELECTED:
            return { ...state, selected: action.selected };
        case CLEAR_SELECTED:
            // if(action.clearQuadKeys.length > 0){
            //     //console.log('clearQuadKeys ', action.clearQuadKeys);
            //     //action.clearQuadKeys
            //     //let k = state.selected.filter( sl => !action.clearQuadKeys.some(clr => clr.quadKey.indexOf(sl.quadKey) === 0));
            //     //console.log(k);
            //     return { ...state, selected: [] };
            // }
            return { ...state, selected: [] };
        case CLEAR_CART:
            return {
                ...state,
                cart: null
            };
        case SAVE_CART:
            return {
                ...state,
                saveCart: [ ...state, ...action.newCart ]
            };
        case CLEAR_STEP_AFTER_MOVE:
            return {
                ...state,
                steps: action.steps
            };
        case SELECT_MODE:
            return {
                ...state,
                mode: action.mode
            };
        default:
            return state
    }
}