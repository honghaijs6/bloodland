import { inventoryService } from "../../services/gameServices/inventoryService";
import { randomBoxInventoryService } from "../../services/gameServices/randomBoxInventoryService";
import { objectsActions } from "../../actions/gameActions/objectsActions";
import * as t from '../../actionTypes/gameActionTypes/inventoryActionTypes'

export const inventoryActions = {
    getCharacterInventoryByUserId,
    getItemInventoryByUserId,
    getGiftInventoryByUserId,
    onHandleMoveTreeToMap,
    onHandleUsingItemForTree,
    onHandleOpenRandomBox,
    clearSuccessError,
    clearPlantedTreesResult,
    checkAnyDeadTrees,
    clearCheckAnyDeadTrees,
    checkParamBeforeUseItem,
    getAllTreeByUserId,
    getCombineTreeByUserId
};

function getCharacterInventoryByUserId(param) {
    // console.log('param', param)
    return dispatch => {
        inventoryService.getCharacterInventoryByUserId(param)
            .then(
                characterInventory => {
                    dispatch(success(characterInventory))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(characterInventory) {
        return { type: t.GET_CHARACTER_INVENTORY_BY_USER_SUCCESS, characterInventory }
    }

    function failure(error) {
        return { type: t.GET_CHARACTER_INVENTORY_BY_USER_FAILURE, error }
    }
}

function getItemInventoryByUserId(param) {
    return dispatch => {
        inventoryService.getItemInventoryByUserId(param)
            .then(
                itemInventory => {
                    dispatch(success(itemInventory))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(itemInventory) {
        return { type: t.GET_ITEM_INVENTORY_BY_USER_SUCCESS, itemInventory }
    }

    function failure(error) {
        return { type: t.GET_ITEM_INVENTORY_BY_USER_FAILURE, error }
    }
}

function getGiftInventoryByUserId(param) {
    return dispatch => {
        randomBoxInventoryService.getRandomBoxInventory(param)
            .then(
                giftInventory => {
                    dispatch(success(giftInventory))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(giftInventory) {
        return { type: t.GET_GIFT_INVENTORY_BY_USER_SUCCESS, giftInventory }
    }

    function failure(error) {
        return { type: t.GET_GIFT_INVENTORY_BY_USER_FAILURE, error }
    }
}

function onHandleMoveTreeToMap(param) {
    return dispatch => {
        inventoryService.moveTreeToMap(param)
            .then(
                plantingResult => {
                    dispatch(objectsActions.moveTreeToMap({ status: plantingResult.status, plantedTrees: plantingResult.result.plantedTrees ? plantingResult.result.plantedTrees : [] }));
                    dispatch(success(plantingResult));
                },
                error => {
                    dispatch(objectsActions.moveTreeToMap({ status: false, error }));
                    dispatch(failure(error.toString()));
                }
            );

        function success(plantingResult) {
            return { type: t.MOVE_TREE_INVENTORY_TO_MAP_SUCCESS, plantingResult }
        }

        function failure(error) {
            return { type: t.MOVE_TREE_INVENTORY_TO_MAP_FAILURE, error }
        }
    }
}

function onHandleUsingItemForTree(param) {
    return dispatch => {
        inventoryService.useItemForTree(param)
            .then(
                usingResult => {
                    const itemId = param.itemId;
                    if (itemId === 'I01' && usingResult.status) {
                        //use nutrient
                        dispatch(reloadItemInventory(usingResult.itemInventory))
                        dispatch(success(usingResult))
                    } else if (itemId === 'I02' && usingResult.status) {
                        //use shovel
                        dispatch(reloadItemInventory(usingResult.itemInventory))
                        dispatch(objectsActions.removeObjects({ status: usingResult.status, deletedTrees: usingResult.deletedTrees ? usingResult.deletedTrees : []  }))
                        dispatch(success(usingResult))
                    } else if (itemId === 'I03' && usingResult.status) {
                        //use water
                        dispatch(reloadItemInventory(usingResult.itemInventory))
                        dispatch(success(usingResult))
                        dispatch(objectsActions.updateTreeObject({ objects: usingResult.result }));
                    }else{
                        //error case
                        dispatch(success(usingResult))
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

        function reloadItemInventory(itemInventory) {
            return { type: t.GET_ITEM_INVENTORY_BY_USER_SUCCESS, itemInventory }
        }

        function success(usingResult) {
            return { type: t.USE_ITEM_SUCCESS, usingResult }
        }

        function failure(error) {
            return { type: t.USE_ITEM_FAILURE, error }
        }
    }
}

function onHandleOpenRandomBox(param) {
    return dispatch => {
        randomBoxInventoryService.openRandomBoxes(param)
            .then(
                openResult => {
                    dispatch(success(openResult))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    };

    function success(openResult) {
        return { type: t.OPEN_RANDOM_BOX_SUCCESS, openResult }
    }

    function failure(error) {
        return { type: t.OPEN_RANDOM_BOX_FAILURE, error }
    }
}

function checkAnyDeadTrees(param) {
    return dispatch => {
        inventoryService.checkAnyDeadTrees(param)
            .then(
                deadTrees => {
                    dispatch(success(deadTrees));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

        function success(deadTrees) {
            return { type: t.CHECK_ANY_DEAD_TREES_SUCCESS, deadTrees }
        }

        function failure(error) {
            return { type: t.CHECK_ANY_DEAD_TREES_FAILURE, error }
        }
    }
}

function checkParamBeforeUseItem(param) {
    return dispatch => {
        inventoryService.checkParamBeforeUseItem(param)
            .then(
                checkResult => {
                    dispatch(success(checkResult));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

        function success(checkResult) {
            return { type: t.CHECK_PARAM_BEFOR_SUCCESS, checkResult }
        }

        function failure(error) {
            return { type: t.CHECK_PARAM_BEFOR_FAILURE, error }
        }
    }
}

function getAllTreeByUserId(param) {
    return dispatch => {
        inventoryService.handleGetAllTreesByUserId(param)
            .then(
                allTrees => {
                    dispatch(success(allTrees));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

        function success(allTrees) {
            return { type: t.GET_ALL_TREE_BY_USER_ID_SUCCESS, allTrees }
        }

        function failure(error) {
            return { type: t.GET_ALL_TREE_BY_USER_ID_FAILURE, error }
        }
    }
}

function clearCheckAnyDeadTrees() {
    return { type: t.CLEAR_ANY_DEAD_TREES }
}

function clearSuccessError() {
    return { type: t.CLEAR_SUCCESS_ERROR }
}

function clearPlantedTreesResult() {
    return { type: t.CLEAR_PLANTED_TREES_RESULT }
}

function getCombineTreeByUserId(param) {
    return dispatch => {
        inventoryService.handleCombineTreeByUserId(param)
            .then(
                combineTreeResult => {
                    dispatch(success(combineTreeResult))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
        function success(combineTreeResult) {
            return { type: t.GET_COMBINE_TREE_BY_USER_ID_SUCCESS, combineTreeResult }
        }

        function failure(error) {
            return { type: t.GET_COMBINE_TREE_BY_USER_ID_FAILURE, error }
        }
    }
}
