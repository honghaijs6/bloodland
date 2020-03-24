// Store Game Objects - Tree - Character
import * as t from '../../actionTypes/gameActionTypes/objectActionTypes'

const objectsReducer = (state = {}, action) => {
    switch (action.type) {
        case t.MOVE_TREE_TO_MAP_SUCCESS:
            if (state.objects && action.res.plantedTrees) {
                state.objects = [...state.objects].concat(action.res.plantedTrees);
            }
            return {
                ...state,
                plantStatus: action.res.status,
            };
        case t.MOVE_TREE_TO_MAP_FAILURE:
            return {
                ...state,
                ...action
            };
        case t.CLEAR_MOVE_TREE_TO_MAP:
            if (state.plantStatus) delete state.plantStatus;
            return {
                ...state,
            };

        case t.GET_OBJS_SUCCESS:
            //console.log('action.objects', action.objects);
            return {
                ...state,
                objects: action.objects
            };
        case t.GET_OBJS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.GET_OBJS_AREA_SUCCESS:
            //console.log('action.objects', action.objects);
            return {
                ...state,
                objectArea: action.objectArea
            };
        case t.GET_OBJS_AREA_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_MY_OBJS_SUCCESS:
            return {
                ...state,
                myObjects: action.myObjects
            };
        case t.GET_MY_OBJS_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_DETAIL_OBJ_SUCCESS:
            return {
                ...state,
                detailObj: action.detail
            };

        case t.GET_DETAIL_OBJ_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_ONLAND_OBJS_BY_USERID_SUCCESS:
            return {
                ...state,
                onLands: action.onLands
            };

        case t.GET_ONLAND_OBJS_BY_USERID_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.REMOVE_OBJS:
            let treeObjects = [];
            if (state.objects) {
                treeObjects = state.objects.filter(tree => !action.deletedTrees.includes(tree._id.toString()));
            }
            return {
                ...state,
                objects: treeObjects
            };

        case t.UPDATE_OBJS:
            let updateTreeObjects = [];
            if (typeof state.objects !== 'undefined' && state.objects) {
                updateTreeObjects = state.objects.map(tree => {
                    let index = action.objects.findIndex(t => t._id.toString() === tree._id.toString());
                    if (index !== -1) {
                        return action.objects[index];
                    }
                    return tree;
                })
            }
            return {
                ...state,
                objects: (!updateTreeObjects || typeof updateTreeObjects) ? state.objects : updateTreeObjects
            };

        case t.SET_TREE_DIES:
            return {...state};
        default:
            return state
    }
};

export default objectsReducer;