import {objectsService} from "../../services/gameServices/objectsService";
import * as t from "../../actionTypes/gameActionTypes/objectActionTypes"

export const objectsActions = {
    moveTreeToMap,
    clearMoveTreeToMap,
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId,
    removeObjects,
    updateTreeObject,
    setTreeDies,
    getAreaObject
};

function moveTreeToMap({status, plantedTrees, error}) {
    return status ? {type: t.MOVE_TREE_TO_MAP_SUCCESS, res: {status, plantedTrees}} : {
        type: t.MOVE_TREE_TO_MAP_FAILURE,
        res: {status, error}
    };
}

function clearMoveTreeToMap() {
    return {type: t.CLEAR_MOVE_TREE_TO_MAP}
}

function getAllObjects({quadKeyParent1, quadKeyParent2, level}) {
    return dispatch => {
        objectsService.getAllObjects({quadKeyParent1, quadKeyParent2, level})
            .then(
                objects => {
                    dispatch(success(objects));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(objects) {
        return {type: t.GET_OBJS_SUCCESS, objects}
    }

    function failure(error) {
        return {type: t.GET_OBJS_FAILURE, error}
    }
}

function getAreaObject({quadKeyParent1}) {
    return dispatch => {
        objectsService.getAreaObject({quadKeyParent1})
            .then(
                objectArea => {
                    dispatch(success(objectArea));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(objectArea) {
        return {type: t.GET_OBJS_AREA_SUCCESS, objectArea}
    }

    function failure(error) {
        return {type: t.GET_OBJS_AREA_FAILURE, error}
    }
}
function getAllObjectsByUserId({userId}) {
    return dispatch => {
        objectsService.getAllObjectsByUserId({userId})
            .then(
                myObjects => {
                    dispatch(success(myObjects));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(myObjects) {
        return {type: t.GET_MY_OBJS_SUCCESS, myObjects}
    }

    function failure(error) {
        return {type: t.GET_MY_OBJS_FAILURE, error}
    }
}

function getDetailObject({userId, objectId}) {
    return dispatch => {
        objectsService.getDetailObject({userId, objectId})
            .then(
                detail => {
                    dispatch(success(detail));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(detail) {
        return {type: t.GET_DETAIL_OBJ_SUCCESS, detail}
    }

    function failure(error) {
        return {type: t.GET_DETAIL_OBJ_FAILURE, error}
    }
}


function getOnLandObjectsByUserId({userId}) {
    return dispatch => {
        objectsService.getOnLandObjectsByUserId({userId})
            .then(
                onLands => {
                    dispatch(success(onLands));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(onLands) {
        return {type: t.GET_ONLAND_OBJS_BY_USERID_SUCCESS, onLands}
    }

    function failure(error) {
        return {type: t.GET_ONLAND_OBJS_BY_USERID_FAILURE, error}
    }
}

function removeObjects({status, deletedTrees}) {
    return {type: t.REMOVE_OBJS, status, deletedTrees}
}


function updateTreeObject({objects}) {
    return {type: t.UPDATE_OBJS, objects}
}


function setTreeDies(trees) {
    console.log("trees will set to dies is", trees);
    return {type: t.SET_TREE_DIES, trees}
}