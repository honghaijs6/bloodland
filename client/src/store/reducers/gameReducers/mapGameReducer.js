import * as t from '../../actionTypes/gameActionTypes/mapGameActionTypes'

const mapGameReducer = (state = {}, action) => {
    switch (action.type) {
        case t.ON_HANDLE_MOVE_CHARACTER_INVENTORY_TO_MAP:
            return {
                ...state,
                characterData: action.characterData
            };
        case t.ON_HANDLE_MOVE_ITEM_INVENTORY_TO_MAP:
            return {
                ...state,
                itemData: action.itemData
            };
        case t.ON_HANDLE_HIDDEN_OTHER_CHARACTER_ON_MAP:
            return {
                ...state,
                toggleHiddenCharacterStatus: action.toggleHiddenCharacterStatus
            };
        case t.ON_HANDLE_GET_QUADKEY_TILE_EFFECT_SPECIAL_TREE:
            return {
                ...state,
                quadKeyBitamin: action.quadKeyBitamin
            };
        case t.ON_HANDLE_GET_ARRAY_TILE_EFFECT:
            return {
              ...state,
              arrayTileEffect: action.arrayTileEffect
            };
        default:
            return state
    }
};

export default mapGameReducer;