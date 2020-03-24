export const LAST_CENTER_MAP = 'LAST_CENTER_MAP';
export const ADD_CENTER_MAP_GEO = 'ADD_CENTER_MAP_GEO';
export const INVALID_TOKEN = 'INVALID_TOKEN';
export const CLEAR_INVALID_TOKEN = 'CLEAR_INVALID_TOKEN';
export const SELECT_MODE = 'SELECT_MODE';
export const CLEAR_STATUS_REMOVE_LAND_IN_CART = 'CLEAR_STATUS_REMOVE_LAND_IN_CART';
export const REMOVE_LAND_IN_CART = 'REMOVE_LAND_IN_CART';
export const ADD_LAND_TO_CART = 'ADD_LAND_TO_CART';
export const SYNC_CENTER_MAP = 'SYNC_CENTER_MAP';
export const UPDATE_MAP = 'UPDATE_MAP';
export const UPDATE_MOVABLES = 'UPDATE_MOVABLES';
export const GET_CURRENT = 'GET_CURRENT';
export const ADD_SELECTED = 'ADD_SELECTED';
export const CLEAR_SELECTED = 'CLEAR_SELECTED';
//====================================================================
export const CLEAR_STEP_AFTER_MOVE = 'CLEAR_STEP_AFTER_MOVE';
export const UPDATE_TILES = 'UPDATE_TILES';
export const CLEAR_CART = 'CLEAR_CART';
export const SAVE_CART = 'SAVE_CART';
export const DISABLE_TILE_MAP = 'DISABLE_TILE_MAP';

export const mapActions = {
    disableTileMap,
    clearInvalidToken,
    invalidToken,
    clearStatusRemoveLandInCart,
    removeLandInCart,
    addLandToCart,
    //map
    syncCenterMap,
    updateMap,
    //select
    selectMode,
    addSelected,
    clearSelected,
    //====================
    clearStepsAfterMove,
    updateCenterMap,
    addCenterMapGeo
    //clearCart,
    //saveCart,
};

function updateCenterMap(centerMap){
    return { type: LAST_CENTER_MAP, centerMap: centerMap };
}

function addCenterMapGeo(centerMapGeo){
    return { type: ADD_CENTER_MAP_GEO, centerMapGeo: centerMapGeo };
}

function disableTileMap(disableMap){
    return { type: DISABLE_TILE_MAP, disableMap: disableMap };
}

function clearInvalidToken(){
    return { type: CLEAR_INVALID_TOKEN };
}

function invalidToken(){
    return { type: INVALID_TOKEN }
}

function selectMode(mode){
    return { type: SELECT_MODE, mode }
}

function clearStatusRemoveLandInCart(){
    return { type: CLEAR_STATUS_REMOVE_LAND_IN_CART }
}

function removeLandInCart(lands){
    return { type: REMOVE_LAND_IN_CART, lands }
}

function addLandToCart(lands){
    return { type: ADD_LAND_TO_CART, lands }
}

function updateMap(map){
    return { type: UPDATE_MAP, map }
}

function clearSelected(clearQuadKeys=[]){
    return { type: CLEAR_SELECTED, clearQuadKeys }
}

function syncCenterMap(center, zoom=null, centerQuadKey=null, centerChange=false){
    if(center && zoom){
        return {
            type: SYNC_CENTER_MAP,
            center,
            zoom,
            centerQuadKey,
            centerChange,
        }
    }
    return {
        type: SYNC_CENTER_MAP,
        center,
        zoom,
        centerQuadKey,
        centerChange,
    }
}
//=========================================================
// function updateMovables(movables){
//     return {
//         type: UPDATE_MOVABLES,
//         movables: movables
//     }
// }
//
// function getCurrent(current){
//     return {
//         type: GET_CURRENT,
//         current: current
//     }
// }

function addSelected(selected, mode="map"){
    return {
        type: ADD_SELECTED,
        selected: selected,
    }
}

function clearStepsAfterMove(steps){
    return {
        type: CLEAR_STEP_AFTER_MOVE,
        steps: steps
    }
}
