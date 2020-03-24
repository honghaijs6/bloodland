import * as t from '../../actionTypes/gameActionTypes/mapGameActionTypes';

export const mapGameAction = {
    onHandleMoveCharacterFromInventoryToMap,
    onHandleMoveItemFromInventoryToMap,
    onHandleHideOtherCharacterOnMap,
    onHandleGetQuadKeyBitamin,
    onHandleGetArrayTileEffect
};

function onHandleMoveCharacterFromInventoryToMap(characterData) {
    return {
        type: t.ON_HANDLE_MOVE_CHARACTER_INVENTORY_TO_MAP, characterData
    }
}

function onHandleMoveItemFromInventoryToMap(itemData) {
    return {
        type: t.ON_HANDLE_MOVE_ITEM_INVENTORY_TO_MAP, itemData
    }
}

function onHandleHideOtherCharacterOnMap(toggleHiddenCharacterStatus) {
    return {
        type: t.ON_HANDLE_HIDDEN_OTHER_CHARACTER_ON_MAP, toggleHiddenCharacterStatus
    }
}

function onHandleGetQuadKeyBitamin(quadKeyBitamin) {
    return {
        type: t.ON_HANDLE_GET_QUADKEY_TILE_EFFECT_SPECIAL_TREE , quadKeyBitamin
    }
}

function  onHandleGetArrayTileEffect(arrayTileEffect){
    return{
        type: t.ON_HANDLE_GET_ARRAY_TILE_EFFECT , arrayTileEffect
    }
}