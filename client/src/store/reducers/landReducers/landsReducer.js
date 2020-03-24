import has from 'lodash.has';
import isEmpty from 'lodash.isempty';
import * as t from '../../actionTypes/landActionTypes/landActionTypes'


import {
    CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET,
    CLEAR_SELL_LAND_STATUS_SOCKET,
    GET_ALL_LAND_SOCKET_FAILURE,
    GET_ALL_LAND_SOCKET_SUCCESS,
    REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE,
    REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS,
    RESPONSE_PURCHASE_LAND_SOCKET_FAILURE,
    RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS,
    RESPONSE_SELL_LAND_SOCKET_FAILURE,
    RESPONSE_SELL_LAND_SOCKET_SUCCESS,
} from '../../actions/commonActions/socketActions';

export default function (state = {
    categories: [], updates: [], updatedStateLands: []


}, action) {
    switch (action.type) {
        case t.GET_ALL_LAND_MARK_CATEGORY_IN_MAP_SUCCESS:
            //console.log('GET_ALL_LAND_MARK_CATEGORY_IN_MAP_SUCCESS', action.res);
            return {
                ...state,
                landmarks: action.res
                //categories: action.categories
            };
        case t.ADD_CENTER_CATEGORY_SUCCESS:
            //console.log('ADD_CENTER_CATEGORY_SUCCESS', action.res);
            return {...state, updateCenterCategorySuccess: action.res.success, categoryUpdate: action.res.updates};
        case t.ADD_CENTER_CATEGORY_FAILURE:
            return {...state, ...action.res};

        case t.GET_ALL_LAND_BY_ID_SUCCESS:
            //console.log('GET_ALL_LAND_BY_ID_SUCCESS', action.res);
            return {
                ...state,
                myLands: action.res.myLand
            };
        case t.GET_ALL_LAND_BY_ID_FAILURE:
            return {...state, ...action.res};
        //=====================================================================================
        case t.GET_DEFAULT:
            return {...state, landPriceLoading: true, openCountriesLoading: true};
        case t.GET_DEFAULT_SUCCESS:
            // /console.log('action.res', action.res);
            return {
                ...state,
                landPriceLoading: false,
                ...action.res[0],
                openCountriesLoading: false,
                openCountries: action.res[1],
            };
        case t.GET_DEFAULT_FAILURE:
            return {
                ...state,
                landPriceLoading: false,
                ...action.res[0],
                openCountriesLoading: false,
                openCountries: action.res[1],
            };
        //=====================================================================================
        case CLEAR_REMOVE_HISTORY_TRADING_LAND_STATUS_SOCKET:
            if (has(state, 'removeHistorySuccess')) {
                delete state.removeHistorySuccess;
            }
            if (has(state, 'isOwnDeleteHistory')) {
                delete state.isOwnDeleteHistory;
            }
            return {...state};
        case REMOVE_HISTORY_TRADING_LAND_SOCKET_SUCCESS:
            return {
                ...state,
                isOwnDeleteHistory: action.res.isOwnDeleteHistory
            };
        case REMOVE_HISTORY_TRADING_LAND_SOCKET_FAILURE:
            return {
                ...state,
                error: action.error,
                isOwnDeleteHistory: action.res.isOwnDeleteHistory
            };
        case t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_SUCCESS:
            return {...state, histories: action.histories};
        case t.GET_ALL_HISTORY_TRADING_LAND_BY_ID_FAILURE:
            return {...state, error: action.error};
        case t.GET_ALL_LAND:
            return {...state, landLoading: true};
        case t.GET_ALL_LAND_SUCCESS:
            //console.log('action.res ', action.res)
            return {...state, ...action.res, landLoading: false};
        case t.GET_ALL_LAND_FAILURE:
            return {...state, error: action.error, lands: [], landLoading: false};
        case t.GET_AREA_LAND_SUCCESS:
            //console.log('action.res ', action.res)
            return {...state, ...action.areaLand, landLoading: false};
        case t.GET_AREA_LAND_FAILURE:
            return {...state, error: action.error, lands: [], landLoading: false};
        case CLEAR_SELL_LAND_STATUS_SOCKET:
            // console.log("action", action);
            delete state.isOwnSell;
            delete state.sellSuccess;
            return {...state, updatedStateLands: []};
        case RESPONSE_SELL_LAND_SOCKET_SUCCESS:
            // console.log("|action", action);
            let resSell = action.res;
            //console.log(resSell);
            if (state.allLands && state.allLands.length > 0) {
                if (resSell && resSell.success && resSell.updates) {
                    let arrUpdateTmp = [...resSell.updates];
                    let newLand = [...state.allLands].map(land => {
                        //land.quadKey
                        let fIndex = arrUpdateTmp.findIndex(ud => ud.quadKey === land.quadKey);
                        if (fIndex !== -1) {
                            land = arrUpdateTmp[fIndex];
                        }
                        return land;
                    });
                    //console.log("new",newLand);
                    return {
                        ...state,
                        allLands: newLand,
                        updatedStateLands: resSell.updates,
                        sellSuccess: resSell.success,
                        isOwnSell: resSell.isOwn,
                        mode: resSell.mode
                    };
                } else {
                    return {
                        ...state,
                        allLands: state.allLands,
                        updatedStateLands: resSell.updates,
                        sellSuccess: resSell.success,
                        mode: resSell.mode
                    };
                }
            }
            return {...state};
        case RESPONSE_SELL_LAND_SOCKET_FAILURE:
            //console.log("|action", action);
            //     let resSell = action.res;
            return {
                ...state,
                isOwnSell: action.res.isOwn,
                mode: action.res.mode,
                error: action.error,
                sellSuccess: action.res.success
            };
        case t.GET_MY_LAND_FROM_STORE:
            if (state.allLands && action.userId) {
                const myLands = state.allLands.filter(land => land.userId === action.userId);
                return {...state, myLands};
            }
            return {...state, myLands: []};
        case RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS:

            //console.log('RESPONSE_PURCHASE_LAND_SOCKET_SUCCESS ', state, action);
            let {allLands} = state;
            let lands = action.res;

            if (!isEmpty(state) && allLands) {
                if (lands && lands.success && lands.updates) {
                    //console.log("update")
                    let arrUpdateTmp = [...lands.updates];
                    let newLand = [...allLands].reduce((arrLand, land) => {
                        let fIndex = arrUpdateTmp.findIndex(ud => ud.quadKey === land.quadKey);
                        if (fIndex !== -1) {
                            arrLand.push(arrUpdateTmp[fIndex]);
                            arrUpdateTmp.splice(fIndex, 1);
                        } else {
                            arrLand.push(land)
                        }
                        return arrLand;
                    }, []);
                    if (arrUpdateTmp.length > 0) {
                        newLand = [...newLand, ...arrUpdateTmp];
                    }
                    return {
                        ...state,
                        allLands: newLand,
                        purchaseSuccess: lands.success,
                        updates: lands.updates,
                        buyFailure: lands.buyFailure,

                        isOwn: lands.isOwn,
                    };
                } else {
                    return {...state, allLands: allLands, purchaseSuccess: lands.success,};
                }
            }
            return {...state,/* allLands: newLand, updateSuccess: lands.success, isOwn: lands.isOwn, myLands: []*/};
        case RESPONSE_PURCHASE_LAND_SOCKET_FAILURE:
            return {
                ...state,
                error: action.res.error,
                purchaseSuccess: action.res.success,
                //mode : lands.mode,
                isOwn: action.res.isOwn,
                removeWaitingTiles: true,
                clearWaitingQuadKeys: action.res.clearWaitingQuadKeys
            };
        case GET_ALL_LAND_SOCKET_SUCCESS:
            return {...state, allLands: action.res.lands};
        case GET_ALL_LAND_SOCKET_FAILURE:
            return {...state, error: action.error, allLand: [],};
        case t.CLEAR_PURCHASE_STATUS_SOCKET:
            delete state.isOwn;
            delete state.updateSuccess;
            delete state.mode;

            return {...state, updates: []};
        // case PURCHASE_LAND_SUCCESS:
        //     return { ...state, success: action.resUpdate.success, updates: action.resUpdate.updates };
        // case PURCHASE_LAND_FAILURE:
        //     return { ...state, error: action.error, success: action.resUpdate.success };
        case t.LANDS_GETALLCATEGORY_SUCCESS:
            //console.log(action);
            return {
                ...state,
                categories: action.categories
            };
        case t.LANDS_GETALLCATEGORY_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.SAVE_LAND_SELECTED_POSITION:
            return {
                ...state,
                landSelected: action.landSelected
            };
        case t.GET_ALL_LAND_MARK_CATEGORY_SUCCESS:
            return {
                ...state,
                categories: action.categories
            };
        case t.GET_ALL_LAND_CATEGORY_SUCCESS:
            // console.log('action.categories',action.categories);
            return {
                ...state,
                categories: action.categories
            };
        case t.GET_LAND_BY_CATEGORY_SUCCESS:
            if (state.categories.length < 1) {
                return {...state}
            } else {
                let categories = state.categories;
                if (action.category.cateId) {
                    for (let cate of categories) {
                        if (cate._id.toString() === action.category.cateId.toString()) {
                            cate.category.lands = action.category.lands.map(l => {
                                return {
                                    land: l,
                                    checked: false
                                }
                            });
                            break;
                        }
                    }
                } else {
                    for (let cate of categories) {
                        if (cate._id === null) {
                            cate.category.lands = action.category.lands.map(l => {
                                return {
                                    land: l,
                                    checked: false
                                }
                            });
                            break;
                        }
                    }
                }
                return {
                    ...state,
                    categories: categories
                }
            }

        case t.GET_LAND_BY_CATEGORY_FOR_CHECKING_SUCCESS:
            if (state.categories.length < 1) {
                return {...state}
            } else {
                let categories = state.categories;
                // console.log(categories);
                // console.log('action.category',action.category);
                if (action.category.cateId) {
                    for (let cate of categories) {
                        if (cate._id.toString() === action.category.cateId.toString()) {
                            cate.category.lands = action.category.lands.map(l => {
                                return {
                                    land: l,
                                    checked: true
                                }
                            });
                            break;
                        }
                    }
                } else {
                    for (let cate of categories) {
                        if (cate._id === null) {
                            cate.category.lands = action.category.lands.map(l => {
                                return {
                                    land: l,
                                    checked: true
                                }
                            });
                            break;
                        }
                    }
                }

                // console.log('categories',categories);
                return {
                    ...state,
                    categories: categories
                }
            }
        case t.GET_LAND_BY_CATEGORY_FOR_CHECKING_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.TRANSFER_LAND_CATEGORY_SUCCESS:

            if (state.categories.length < 1) {
                return {...state}
            } else {
                if (!action.modifiedCate)
                    return {
                        ...state,
                        categories: []
                    };
                const {oldCategory, newCategory, newCategoryLands} = action.modifiedCate;
                let {categories} = state;
                categories = categories.map(cate => {
                    if (cate._id === oldCategory.cateId) {
                        cate.category.lands = oldCategory.lands;
                    }
                    if (cate._id === newCategory.cateId) {
                        cate.category.lands = newCategory.lands.map(l => {
                            for (let i = 0; i < newCategoryLands.length; i++) {
                                if (l.land._id.toString() === newCategoryLands[i]._id.toString()) l.checked = true;
                            }
                            return l;
                        });
                    }
                    return cate;
                });
                return {
                    ...state,
                    categories: categories
                }
            }

        case t.EDIT_CATEGORY_SUCCESS:
            if (state.categories.length < 1) {
                return {...state}
            } else {
                let categories = state.categories.map(cate => {
                    if (cate._id === action.modifiedCate._id) {
                        cate.category.name = action.modifiedCate.name;
                    }
                    return cate;
                });
                return {
                    ...state,
                    categories: categories
                }
            }

        case t.EDIT_LAND_SUCCESS:
            if (state.categories.length < 1) {
                return {...state}
            } else {
                let categories = state.categories.map(cate => {
                    if (cate._id === action.modifiedLand.categoryId) {
                        cate.category.lands = cate.category.lands.map(l => {
                            if (l.land._id === action.modifiedLand._id) {
                                l.land.name = action.modifiedLand.name;
                            }
                            return l;
                        });
                    }
                    return cate;
                });
                return {
                    ...state,
                    categories: categories
                }
            }

        case t.ADD_CATEGORY_SUCCESS:
            // console.log('action.categories',action.categories);
            return {
                ...state,
                categories: action.categories
            };

        case t.DELETE_LAND_CATEGORY_SUCCESS:
            // console.log('action.emptyCateLands',action.emptyCateLands);
            if (state.categories.length < 1) {
                return {...state}
            } else {
                let categories = state.categories;
                categories = categories.filter(c => c._id !== action.emptyCateLands.cateId)
                // console.log('categories',categories);
                categories = categories.map(cate => {
                    if (cate._id === null)
                        cate.category.lands = action.emptyCateLands.emptyCateLands;
                    return cate;
                });

                return {
                    ...state,
                    categories: categories
                }
            }
        case t.GET_LATEST_QUADKEY_LAND_PURCHASE:
            return {
                ...state,
                latestQK: action.param
            };
        case t.GET_LAND_INFO_SUCCESS:
            // console.log('action.result',action.result);
            return {
                ...state,
                landInfo: action.result
            };

        case t.GET_LAND_INFO_FAILURE:
            return {
                ...state,
                landInfo: action.error
            };
        case t.GET_LAND_BY_QUADKEY_SUCCESS:
            return {
                ...state,
                buyLandList: action.res
            };
        case t.GET_LAND_BY_QUADKEY_FAILURE:
            return {
                ...state,
                error: action.error
            }
        default:
            return state
    }
}