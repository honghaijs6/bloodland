import {landService} from "../../services/landServices/landService";
import * as t from "../../actionTypes/landActionTypes/landActionTypes"

export const landActions = {
    getAllLandMarkCategoryInMap,
    addCenterCategory,
    getAllHistoryTradingLandById,
    getDefault,
    getAllLandById,
    getAllLand,
    getAllCategory,
    transferLandCategory,
    editLand,
    addCategory,
    editCategory,
    deleteLandCategory,
    clearPurchaseStatusSocket,
    saveSelectedLandPosition,
    getAllLandMarkCategory,
    getAllLandCategory,
    getLandByCategory,
    getLandByCategoryForChecking,
    changeLandMarkState,
    getLastestQuadkeyLandPurchase,
    getAreaLand,
    getLandInfo,
    getLandByQuadKey
};


function getLandInfo(param) {
    // console.log('getLandInfo')
    return dispatch => {
        landService.getLandInfo(param)
            .then(
                result => dispatch({ type: t.GET_LAND_INFO_SUCCESS, result }),
                error => dispatch({ type: t.GET_LAND_INFO_FAILURE, error })
            );
    };
}

function getAllLandMarkCategoryInMap() {
    // console.log('getAllLandMarkCategoryInMap')
    return dispatch => {
        landService.getAllLandMarkCategoryInMap()
            .then(
                res => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_IN_MAP_SUCCESS, res }),
                error => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_IN_MAP_FAILURE, error })
            );
    };
}


function getLandByCategory(param) {
    // console.log('getLandByCategory')
    return dispatch => {
        landService.getLandByCategory(param)
            .then(
                result => dispatch({ type: t.GET_LAND_BY_CATEGORY_SUCCESS, category: result }),
                error => dispatch({ type: t.GET_LAND_BY_CATEGORY_FAILURE, error })
            );
    };
}

function getLandByCategoryForChecking(param) {
    // console.log('getLandByCategoryForChecking')
    return dispatch => {
        landService.getLandByCategory(param)
            .then(
                result => dispatch({ type: t.GET_LAND_BY_CATEGORY_FOR_CHECKING_SUCCESS, category: result }),
                error => dispatch({ type: t.GET_LAND_BY_CATEGORY_FOR_CHECKING_FAILURE, error })
            );
    };
}


function getAllLandMarkCategory(param) {
    // console.log('getAllLandMarkCategory')
    return dispatch => {
        landService.getAllLandMarkCategory(param)
            .then(
                result => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_SUCCESS, categories: result }),
                error => dispatch({ type: t.GET_ALL_LAND_MARK_CATEGORY_FAILURE, error })
            );
    };
}

function getAllLandCategory(param) {
    // console.log('getAllLandCategory')
    return dispatch => {
        landService.getAllLandCategory(param)
            .then(
                result => dispatch({ type: t.GET_ALL_LAND_CATEGORY_SUCCESS, categories: result }),
                error => dispatch({ type: t.GET_ALL_LAND_CATEGORY_FAILURE, error })
            );
    };
}

function addCenterCategory(param) {
    // console.log('addCenterCategory')
    return dispatch => {
        landService.addCenterCategory(param)
            .then(
                res => dispatch({ type: t.ADD_CENTER_CATEGORY_SUCCESS, res }),
                error => dispatch({ type: t.ADD_CENTER_CATEGORY_FAILURE, error })
            );
    };
}

function getDefault() {
    // console.log('getDefault')
    return dispatch => {
        dispatch({ type: t.GET_DEFAULT });
        landService.getDefault()
            .then(
                res => dispatch({ type: t.GET_DEFAULT_SUCCESS, res }),
                error => dispatch({ type: t.GET_DEFAULT_FAILURE, error })
            );
    };
}

function getAllLandById(userId) {
    // console.log('getAllLandById')
    return dispatch => {
        //dispatch({ type: GET_ALL_LAND_BY_ID });
        landService.getAllLandById(userId)
            .then(
                res => dispatch({ type: t.GET_ALL_LAND_BY_ID_SUCCESS, res }),
                error => dispatch({ type: t.GET_ALL_LAND_BY_ID_FAILURE, error })
            );
    };
}

function getAllLand(startEndTile) {
    // console.log('getAllLand')
    return dispatch => {
        dispatch({ type: t.GET_ALL_LAND });
        landService.getAllLand(startEndTile)
            .then(
                res => dispatch({ type: t.GET_ALL_LAND_SUCCESS, res }),
                error => dispatch({ type: t.GET_ALL_LAND_FAILURE, error })
            );
    };
}

function getAreaLand(startEndTile) {
    // console.log('getAreaLand')
    return dispatch => {
        dispatch({ type: t.GET_ALL_LAND });
        landService.getAreaLand(startEndTile)
            .then(
                areaLand => dispatch({ type: t.GET_AREA_LAND_SUCCESS, areaLand }),
                error => dispatch({ type: t.GET_AREA_LAND_FAILURE, error })
            );
    };
}
function getAllHistoryTradingLandById(userId) {
    // console.log('getAllHistoryTradingLandById')
    return dispatch => {
        landService.getAllHistoryTradingLandById(userId)
            .then(
                histories => dispatch({ type: t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_SUCCESS, histories }),
                error => {
                    dispatch({ type: t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_FAILURE, error });
                }
            );
    };
}

function clearPurchaseStatusSocket() {
    // console.log('getAllHistoryTradingLandById')
    return { type: t.CLEAR_PURCHASE_STATUS_SOCKET };
}

function getAllCategory(userId) {
    // console.log('getAllCategory')
    return dispatch => {
        landService.getAllCategory(userId)
            .then(
                categories => dispatch(success(categories)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(categories) {
        return { type: t.LANDS_GETALLCATEGORY_SUCCESS, categories }
    }

    function failure(error) {
        return { type: t.LANDS_GETALLCATEGORY_FAILURE, error }
    }
}

function transferLandCategory(param) {
    // console.log('transferLandCategory')
    return dispatch => {
        landService.transferLandCategory(param)
            .then(
                modifiedCate => dispatch(success(modifiedCate)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(modifiedCate) {
        return { type: t.TRANSFER_LAND_CATEGORY_SUCCESS, modifiedCate }
    }

    function failure(error) {
        return { type: t.TRANSFER_LAND_CATEGORY_FAILURE, error }
    }
}


function addCategory(param) {
    // console.log('addCategory')
    return dispatch => {
        landService.addCategory(param)
            .then(
                categories => dispatch(success(categories)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(categories) {
        return { type: t.ADD_CATEGORY_SUCCESS, categories }
    }

    function failure(error) {
        return { type: t.ADD_CATEGORY_FAILURE, error }
    }
}

function editLand(param) {
    // console.log('editLand')
    return dispatch => {
        landService.editLand(param)
            .then(
                modifiedLand => dispatch(success(modifiedLand)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(modifiedLand) {
        return { type: t.EDIT_LAND_SUCCESS, modifiedLand }
    }

    function failure(error) {
        return { type: t.EDIT_LAND_FAILURE, error }
    }
}

function editCategory(param) {
    // console.log('editCategory')
    return dispatch => {
        landService.editCategory(param)
            .then(
                modifiedCate => dispatch(success(modifiedCate)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(modifiedCate) {
        return { type: t.EDIT_CATEGORY_SUCCESS, modifiedCate }
    }

    function failure(error) {
        return { type: t.EDIT_CATEGORY_FAILURE, error }
    }
}

function deleteLandCategory(param) {
    // console.log('deleteLandCategory')
    return dispatch => {
        landService.deleteLandCategory(param)
            .then(
                emptyCateLands => dispatch(success(emptyCateLands)),
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(emptyCateLands) {
        return { type: t.DELETE_LAND_CATEGORY_SUCCESS, emptyCateLands }
    }

    function failure(error) {
        return { type: t.DELETE_LAND_CATEGORY_FAILURE, error }
    }
}

function saveSelectedLandPosition(landSelected) {
    // console.log('saveSelectedLandPosition')
    return { type: t.SAVE_LAND_SELECTED_POSITION, landSelected }
}

function changeLandMarkState(param) {
    // console.log('changeLandMarkState')
    return dispatch => {
        landService.changeLandMarkState(param)
            .then(
                res => {
                    // console.log("res", res);
                },
                error => {
                    // console.log("error", error);
                }
            );
    };
}

function getLastestQuadkeyLandPurchase (param) {
    // console.log('getLastestQuadkeyLandPurchase')
    return {type: t.GET_LATEST_QUADKEY_LAND_PURCHASE , param}
}

function getLandByQuadKey(param) {
    // console.log('getLandByQuadKey')
    return dispatch => {
        landService.getLandByQuadKeys(param)
            .then(
                res => dispatch({ type: t.GET_LAND_BY_QUADKEY_SUCCESS, res }),
                error => dispatch({ type: t.GET_LAND_BY_QUADKEY_FAILURE, error })
            );
    };
}