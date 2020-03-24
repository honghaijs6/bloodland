import * as t from '../../actionTypes/gameActionTypes/inventoryActionTypes'

const inventoryReducer = (state = {}, action) => {
    switch (action.type) {
        case t.GET_CHARACTER_INVENTORY_BY_USER_SUCCESS:
            return {
                ...state,
                characterInventory: action.characterInventory
            };
        case t.GET_ITEM_INVENTORY_BY_USER_SUCCESS:
            return {
                ...state,
                itemInventory: action.itemInventory
            };
        case t.GET_GIFT_INVENTORY_BY_USER_SUCCESS:
            return {
                ...state,
                giftInventory: action.giftInventory
            };
        case t.USE_ITEM_SUCCESS:
            return {
                ...state,
                usingResult: action.usingResult
            };
        case t.USE_ITEM_FAILURE:
            return {
                ...state,
                usingResult: action.error
            };
        case t.CLEAR_SUCCESS_ERROR:
            return {
                ...state,
                usingResult: undefined
            };
        case t.MOVE_TREE_INVENTORY_TO_MAP_SUCCESS:
            return {
                ...state,
                plantingResult: action.plantingResult
            };
        case t.MOVE_TREE_INVENTORY_TO_MAP_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.CLEAR_PLANTED_TREES_RESULT:
            return {
                ...state,
                plantingResult: undefined
            };
        case t.OPEN_RANDOM_BOX_SUCCESS:
            return {
                ...state,
                openResult: action.openResult
            };
        case t.OPEN_RANDOM_BOX_FAILURE:
            return {
                ...state,
                openResult: action.error
            };
        case t.GET_ALL_TREE_BY_USER_ID_SUCCESS:
            return {
                ...state,
                allTrees: action.allTrees
            };
        case t.GET_ALL_TREE_BY_USER_ID_FAILURE:
            return {
                ...state,
                allTrees: action.error
            };
        case t.GET_COMBINE_TREE_BY_USER_ID_SUCCESS:
            return {
                ...state,
                combineTreeResult: action.combineTreeResult
            };
        case t.GET_COMBINE_TREE_BY_USER_ID_FAILURE:
            return {
                ...state,
                combineTreeResult: action.error
            };
        default:
            return state
    }
};

export default inventoryReducer