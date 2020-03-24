import {LatLongToTileXY, TileXYToLatLong, TileXYToQuadKey} from "../../general/System";
import uniq from "lodash.uniq";
import {calculatorLand, checkInCountry} from "../../landMapComponent/component/MapFunction";
import {alertPopup} from "./A&PSchema";
import isEmpty from "lodash.isempty";
import React, {memo} from "react";
import LandStatusComponent from "./LandStatusRender";
import TreePositionRender from "./TreePositionRender";
import {QuadKeyToTileXY} from "../../../components/general/System";
import clonedeep from 'lodash.clonedeep'

export const covertDragPositionToQuadkey = (dropClientOffset) => {
    let tile_n = document.getElementsByClassName("tile-n");
    let tiles = [];
    // let characters = this.state.characters;
    for (let index = 0; index < tile_n.length; index++) {
        const element = tile_n[index];

        let rect = element.getBoundingClientRect();
        let rectjson = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
        };
        tiles.push({id: element.id, rect: rectjson});
    }
    if (tiles.length > 0 && dropClientOffset) {
        let positionItemTile = {};
        for (let j = 0; j < tiles.length; j++) {
            const tile = tiles[j];
            if (tile.rect.left <= dropClientOffset.x && dropClientOffset.x <= tile.rect.right
                && tile.rect.top <= dropClientOffset.y && dropClientOffset.y <= tile.rect.bottom
            ) {
                positionItemTile = tile.id
            }
        }
        return positionItemTile
    }
};
const checkSquareQuadKeys = (baseQuadKey, quadKeys) => {
    if (!quadKeys) return false;
    if (quadKeys.length !== 4) return false;

    if (baseQuadKey !== quadKeys[0]) return false;

    let base = QuadKeyToTileXY(baseQuadKey);
    let p1 = QuadKeyToTileXY(quadKeys[0]);
    let p2 = QuadKeyToTileXY(quadKeys[1]);
    let p3 = QuadKeyToTileXY(quadKeys[2]);
    let p4 = QuadKeyToTileXY(quadKeys[3]);

    if (base.level !== 24) return false;
    if (p1.level !== 24) return false;
    if (p2.level !== 24) return false;
    if (p3.level !== 24) return false;
    if (p4.level !== 24) return false;

    p1 = {x: p1.x - base.x, y: p1.y - base.y};
    p2 = {x: p2.x - base.x, y: p2.y - base.y};
    p3 = {x: p3.x - base.x, y: p3.y - base.y};
    p4 = {x: p4.x - base.x, y: p4.y - base.y};

    if ((p1.x === 0 && p1.y === 0) === false) return false;
    if ((p2.x === 1 && p2.y === 0) === false) return false;
    if ((p3.x === 1 && p3.y === 1) === false) return false;
    return (p4.x === 0 && p4.y === 1) !== false;


};
const checkOwnerTiles = (tilesArray, userId) => {
    const tilesArrayCheckOwner = tilesArray.filter(tile => tile.user._id === userId);
    return tilesArrayCheckOwner.length === 4;
};

// move character to map================================================================================================

//check available to move
const onHandleCheckAvailableLand = (myLand, characterData, objects, arrayTileEffect, user) => {
    const {item: {itemId}} = characterData;
    const checkQuadKey = myLand.filter(land => land.quadKey === characterData.quadKey);
    const checkObjectQuadKey = objects.filter(object => object.quadKey === characterData.quadKey);
    const bigTreeQuadKeys = objects ? (objects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
    if (checkQuadKey.length === 0) {
        return {checkNotMyLand: true}
    } else if (checkQuadKey[0].forSaleStatus) {
        return {checkForSaleStatus: true}
    } else if (checkQuadKey.length === 1 && checkObjectQuadKey.length === 1) {
        return {checkAlreadyHaveTree: true}
    } else {
        const checkQuadKeyResult = checkQuadKey.length !== 0;
        const checkQuadKeyNormalTree = bigTreeQuadKeys.filter(q => q === characterData.quadKey);
        const checkObjectQuadKeyResult = checkObjectQuadKey.length === 0 && checkQuadKeyNormalTree.length === 0;

        //special Tree
        const checkSquareAvailable = itemId === 'T10' ? arrayTileEffect ? arrayTileEffect.filter(t => t.squareAvailable).length === 4 : false : true;
        const arrayTileEffectQuadKey = arrayTileEffect && arrayTileEffect.map(t => {
            return t.quadKey
        });
        const checkSquareQuadKey = itemId === 'T10' ? checkSquareAvailable ? checkSquareQuadKeys(arrayTileEffectQuadKey[0], arrayTileEffectQuadKey) : false : true;
        const checkOwnerTile = itemId === 'T10' ? checkSquareQuadKey ? checkOwnerTiles(arrayTileEffect, user._id) : false : true;

        return checkQuadKeyResult && checkObjectQuadKeyResult && checkOwnerTile;
    }

};

export const addCharacterToMap = (characterData, lands, user, handleShowPopup, objects, arrayTileEffect) => {
    if (characterData && lands && user) {
        const myLand = lands && lands.allLands.filter(land => land.user._id === user._id);
        const checkLand = onHandleCheckAvailableLand(myLand, characterData, objects, arrayTileEffect, user);
        if (checkLand.checkAlreadyHaveTree || checkLand.checkNotMyLand || checkLand.checkForSaleStatus) {
            handleShowPopup(checkLand)
        } else {
            const dataPlanting = {
                characterData, user, checkLand
            };
            handleShowPopup(dataPlanting)
        }

    }
};
// ====================================================================


//move item to using in tree==========================================
//check available to move
const onHandleCheckQuadKeyObject = (objects, itemData) => {
    const {itemId} = itemData;
    const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
    const findTreeInTileResult = itemSpecialFilter.filter(item => {
        const {bigTreeQuadKeys} = item;
        const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
        return findObject.length !== 0 && item
    });
    if (findTreeInTileResult && itemId === 'I04' && findTreeInTileResult.length !== 0) {
        return findTreeInTileResult
    } else if (findTreeInTileResult && itemId !== 'I04' && findTreeInTileResult.length === 0) {
        return objects.filter(object => object.quadKey === itemData.quadKey);
    } else {
        return []
    }
};
const onHandleCheckAvailableForItem = (myLand, itemData, objects) => {
    const checkQuadKey = myLand.filter(land => land.quadKey === itemData.quadKey);
    if (checkQuadKey.length !== 0) {
        const checkForSaleStatus = (checkQuadKey[0].forSaleStatus && itemData.itemId === 'I01') || (checkQuadKey[0].forSaleStatus && itemData.itemId === 'I02');
        if (checkForSaleStatus) {
            return {checkForSaleStatus: true}
        } else {
            const checkObjectQuadKey = onHandleCheckQuadKeyObject(objects, itemData);
            const checkQuadKeyResult = checkQuadKey.length !== 0;
            const checkObjectQuadKeyResult = checkObjectQuadKey.length !== 0;

            if (itemData.itemId === 'I01') {
                const checkLimitNutrition = objects.filter(object => (object.quadKey === itemData.quadKey) && object.limitUseNutritional === 0);
                const checkLimitNutritionResult = checkLimitNutrition.length === 0;
                if (!checkLimitNutritionResult) {
                    return {checkLimitNutritionResult: true}
                } else {
                    return checkLimitNutritionResult && checkObjectQuadKeyResult && checkQuadKeyResult
                }
            } else {
                return checkObjectQuadKeyResult && checkQuadKeyResult
            }
        }
    }
};

const onHandleCheckTreeInTile = ( myLand , objects , itemData) => {
    const findTile = objects.filter(object => object.quadKey === itemData.quadKey);
    const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
    const findTreeInTileResult = itemSpecialFilter.filter(item => {
        const {bigTreeQuadKeys} = item;
        const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
        return findObject.length !== 0 && item
    });
    const checkQuadKey = myLand.filter(land => land.quadKey === itemData.quadKey);
    return checkQuadKey.length !== 0 && findTile.length === 0 && findTreeInTileResult.length === 0;
};
export const usingItemForTree = (itemData, lands, user, handleShowPopup, objects, handleShowAlert) => {
    if (itemData && lands && user) {
        const myLand = lands && lands.allLands.filter(land => land.user._id === user._id);
        const checkLand = onHandleCheckAvailableForItem(myLand, itemData, objects);
        const checkNotHaveTreeInTile = onHandleCheckTreeInTile( myLand ,  objects , itemData);
        //check quadkey again -> before submit
        const itemSpecialFilter = objects.filter(object => object.itemId === 'T10');
        const objectFilter = itemData.itemId === 'I04' ? itemSpecialFilter.find(item => {
            const {bigTreeQuadKeys} = item;
            const findObject = bigTreeQuadKeys.filter(quadKey => quadKey === itemData.quadKey);
            return findObject.length !== 0 && item
        }) : objects.find(object => object.quadKey === itemData.quadKey);
        // ==========================================
        if(checkNotHaveTreeInTile  && itemData.itemId !== 'I04'){
            if(itemData.itemId === 'I01'){
                handleShowAlert(alertPopup.checkPlantTreeBeforeNutrient)
            }else if(itemData.itemId === 'I02'){
                handleShowAlert(alertPopup.checkPlantTreeBeforeShovel)
            }else if(itemData.itemId === 'I03'){
                handleShowAlert(alertPopup.checkPlantTreeBeforeDroplet)
            }
        }else if (checkLand) {
            // console.log('ch', checkLand)
            if (checkLand.checkForSaleStatus) {
                handleShowAlert(alertPopup.checkForSaleStatusAlert)
            } else {
                if (objectFilter) {
                    const dataUsingItem = {
                        itemData, user, checkLand, objectId: objectFilter._id
                    };
                    handleShowPopup(dataUsingItem)
                } else {
                    handleShowPopup('error')
                }
            }
        } else {
            handleShowPopup('error')
        }
    }
};

// ==============================================================================


//draw tile in game map ======================================

const DEFAULT_LEVEL_OFFSET = 2;
//step 1
export const drawTiles = (drawTilesParam) => {
    const {zoom, bounds, lands, selectedTiles, centerQuadKey, openCountriesLoading, openCountries} = drawTilesParam;

    const level = zoom + DEFAULT_LEVEL_OFFSET;

    let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
    let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);
    const LOAD_OUT_BOUNDS = 0;
    beginTile = {x: beginTile.x - LOAD_OUT_BOUNDS, y: beginTile.y - LOAD_OUT_BOUNDS};
    endTile = {x: endTile.x + LOAD_OUT_BOUNDS, y: endTile.y + LOAD_OUT_BOUNDS};

    const paramStartAndEndBounds = {
        level, beginTile, endTile
    };
    let arrStartEnd = startAndEndBounds(paramStartAndEndBounds);
    return arrStartEnd.reduce((total, {beginTile, endTile}) => {
            const paramArrayTile = {
                beginTile, endTile, zoom, level, lands, selectedTiles, centerQuadKey, openCountriesLoading, openCountries
            };
            const createArrayTileResult = createArrayTile(paramArrayTile);
            return total.concat(createArrayTileResult)
        }, []
    );
};

//step 2
const startAndEndBounds = (paramStartAndEndBounds) => {
    const {level, beginTile, endTile} = paramStartAndEndBounds;
    if (beginTile.x > endTile.x) {
        let tempEndTile = 2 ** level - 1;
        return [{ //split end chunk
            beginTile: {x: beginTile.x, y: beginTile.y},
            endTile: {x: tempEndTile, y: endTile.y}
        }, { //split start chunk
            beginTile: {x: 0, y: beginTile.y},
            endTile: {x: endTile.x, y: endTile.y}
        }]
    } else {
        return [{beginTile, endTile}]
    }
};

//step 3
const createArrayTile = (paramArrayTile) => {
    const {beginTile, endTile, level, lands, selectedTiles, centerQuadKey, openCountriesLoading, openCountries} = paramArrayTile;
    let arrTile = [];
    if (beginTile.x < endTile.x) {
        for (let x = beginTile.x; x <= endTile.x; x++) {

            for (let y = beginTile.y; y <= endTile.y; y++) {

                const paramCreateTile = {
                    x,
                    y,
                    level,
                    lands,
                    selectedTiles: selectedTiles || [],
                    centerQuadKey,
                    openCountriesLoading,
                    openCountries
                };
                //require createTile - step 4
                const createTileResult = createTile(paramCreateTile);
                arrTile.push(createTileResult)
            }
        }
    }
    return arrTile;
};

//step 4
const createTile = (paramCreateTile) => {
    const {x, y, level, lands, selectedTiles, centerQuadKey, openCountriesLoading, openCountries} = paramCreateTile;
    let tileQuadKey = TileXYToQuadKey(x, y, level);
    let tileLatLng = TileXYToLatLong(x, y, level);

    let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};
    tile.selected = selectedTiles && selectedTiles.length > 0 && selectedTiles.some(t => typeof t !== 'undefined' && t != null && t && ((tile.quadKey.indexOf(t.quadKey) === 0) || (t.quadKey.indexOf(tile.quadKey) === 0)));
    const forbid = !checkInCountry({
        latlng: tileLatLng,
        openCountries: openCountriesLoading === false ? openCountries : []

    });
    tile.isCenter = centerQuadKey && tileQuadKey === centerQuadKey;
    const totalCount = calculatorLand(tile.quadKey.length);
    tile.totalCount = totalCount;
    if (lands) {
        let fLand = lands.find(land =>
            tile.quadKey.indexOf(land.quadKey) === 0);
        if (fLand) {
            tile.lands = [{
                forbid: forbid || fLand.forbidStatus,
                landmark: fLand.forbidStatus && fLand.user.role === 'manager',
                forSaleStatus: fLand.forSaleStatus,
                sellPrice: fLand.sellPrice,
                user: fLand.user,
                landCount: totalCount,
                totalCount: totalCount,
                quadKey: fLand.quadKey,
            }]
        } else {
            let fOutLand = lands.filter(land => land.quadKey && land.quadKey.indexOf(tile.quadKey) === 0);
            if (fOutLand && fOutLand.length > 0) { //
                tile.lands = fOutLand.map(land => {
                    const landCount = calculatorLand(tile.quadKey.length + (land.quadKey.length - tile.quadKey.length));
                    return {
                        forbid: forbid || land.forbidStatus,
                        landmark: fOutLand.forbidStatus && fOutLand.user.role === 'manager',
                        forSaleStatus: land.forSaleStatus,
                        sellPrice: land.sellPrice,
                        user: land.user,
                        landCount: landCount,
                        totalCount: totalCount,
                        quadKey: land.quadKey,
                    }
                });
            } else {
                tile.lands = [{
                    empty: true,
                    forbid: forbid || false,
                    landmark: false,
                    user: null,
                    forSaleStatus: null,
                    sellPrice: 0,
                    landCount: totalCount,
                    totalCount: totalCount,
                    char: null,
                    quadKey: tileQuadKey,
                }];
            }
        }
        return tile;
    }
};
export const getZoomBounds = (map) => {
    const zoom = map.getZoom();
    const b = map.getBounds();
    const ne = b.getNorthEast();
    const sw = b.getSouthWest();
    const bounds = {
        ne: {lat: ne.lat(), lng: ne.lng()},
        nw: {lat: ne.lat(), lng: sw.lng()},
        se: {lat: sw.lat(), lng: ne.lng()},
        sw: {lat: sw.lat(), lng: sw.lng()},
    };
    return {zoom, bounds, level: zoom + 2};
};


export const getParticleLands = (map, getAreaObject, user, getAreaLand) => {
    const {bounds, level} = getZoomBounds(map);
    let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
    let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

    let arrQK = [];
    for (let x = beginTile.x; x <= endTile.x; x++) {
        for (let y = beginTile.y; y <= endTile.y; y++) {
            arrQK.push(TileXYToQuadKey(x, y, level));
        }
    }
    let quadKeyParent1 = uniq(arrQK.map(qk => qk.substr(0, level - 4)));
    let quadKeyParent2 = uniq(arrQK.map(qk => qk.substr(0, level - 5)));
    const paramGetAllObject = {
        quadKeyParent1, quadKeyParent2, level
    };
    const paramGetAreaLand = {
        parents1: quadKeyParent1, parents2: quadKeyParent2, level, role: (user && user.role) || 'user'
    };
    getAreaObject({quadKeyParent1: paramGetAllObject.quadKeyParent1});
    getAreaLand(paramGetAreaLand);
};
// ========================================================


// create tile array effect =============================================================
const createSquareTile = (quadKey, tiles) => {
    if (!quadKey || isEmpty(quadKey)) {
        return []
    } else {
        const t0_position = quadKey && QuadKeyToTileXY(quadKey);
        const t1_position = {x: t0_position.x + 1, y: t0_position.y};
        const t2_position = {x: t0_position.x + 1, y: t0_position.y + 1};
        const t3_position = {x: t0_position.x, y: t0_position.y + 1};

        let t0_tile = tiles.find(tile => tile.x === t0_position.x && tile.y === t0_position.y);
        let t1_tile = tiles.find(tile => tile.x === t1_position.x && tile.y === t1_position.y);
        let t2_tile = tiles.find(tile => tile.x === t2_position.x && tile.y === t2_position.y);
        let t3_tile = tiles.find(tile => tile.x === t3_position.x && tile.y === t3_position.y);

        t0_tile = t0_tile && {
            x: t0_tile.x,
            y: t0_tile.y,
            user: t0_tile.lands[0].user,
            quadKey: t0_tile.quadKey,
            forSale: t0_tile.lands[0].forSaleStatus === null ? false : t0_tile.lands[0].forSaleStatus
        };
        t1_tile = t1_tile && {
            x: t1_tile.x,
            y: t0_tile.y,
            user: t1_tile.lands[0].user,
            quadKey: t1_tile.quadKey,
            forSale: t1_tile.lands[0].forSaleStatus === null ? false : t1_tile.lands[0].forSaleStatus
        };
        t2_tile = t2_tile && {
            x: t2_tile.x,
            y: t0_tile.y,
            user: t2_tile.lands[0].user,
            quadKey: t2_tile.quadKey,
            forSale: t2_tile.lands[0].forSaleStatus === null ? false : t2_tile.lands[0].forSaleStatus
        };
        t3_tile = t3_tile && {
            x: t3_tile.x,
            y: t0_tile.y,
            user: t3_tile.lands[0].user,
            quadKey: t3_tile.quadKey,
            forSale: t3_tile.lands[0].forSaleStatus === null ? false : t3_tile.lands[0].forSaleStatus
        };

        return [t0_tile, t1_tile, t2_tile, t3_tile]
    }

};
export const onHandleCreateTileEffect = (param) => {
    const {quadKeyBitamin, tiles, objectArea, bigTreeQuadKeys, _id} = param;

    const normalTreeQuadKeys = objectArea.map(o => {
        return o.quadKey
    });
    let tilesArray = quadKeyBitamin && quadKeyBitamin.length !== 0 && createSquareTile(quadKeyBitamin, tiles);

    tilesArray = tilesArray && tilesArray.filter(t => t && t.user !== null && t.user._id === _id);
    let tilesArrayClone = clonedeep(tilesArray);
    if (tilesArray) {
        if (tilesArray.length < 4) {
            return tilesArray.map(t => {
                t.squareAvailable = false;
                return t
            })
        } else {
            for (let i = 0; i < 4; i++) {
                //checkBigTreeInTile
                tilesArrayClone[i].isNoBigTree = bigTreeQuadKeys ? (bigTreeQuadKeys.filter(quadKey => quadKey === tilesArrayClone[i].quadKey)).length === 0 : true;
                //checkNormalTreeInTile
                tilesArrayClone[i].isNoNormalTree = normalTreeQuadKeys.length !== 0 ? normalTreeQuadKeys.filter(quadKey => tilesArrayClone[i].quadKey === quadKey).length === 0 : true;
                //check user
                tilesArrayClone[i].isRightUser = tilesArray[i].user._id === _id;

                //check for sale
                tilesArrayClone[i].isForSale = tilesArray[i].forSale === false;
            }

            const squareCheck = tilesArrayClone.filter(t => t.isNoBigTree).length === 4 &&
                tilesArrayClone.filter(t => t.isNoNormalTree).length === 4 &&
                tilesArrayClone.filter(t => t.isNoNormalTree).length === 4 &&
                tilesArrayClone.filter(t => t.isForSale).length === 4
            ;
            tilesArray.map(t => {
                t.squareAvailable = squareCheck;
                return t
            });
            return tilesArray
        }
    }
};

//render classs name
export const onRenderClassName = (item, myLand, _id, tilesEffectArray, landSelected) => {
    let clsName = '';
    const landPosition = landSelected && landSelected.land.quadKey;
    if (item.lands[0]) {
        const myLands = item.lands[0];
        if (myLands.forbid) {
            if (myLands.landmark) {
                if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
            } else {
                if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
            }
        }
    }
    if (myLand) {
        if (myLand.user) {
            if (myLand.forbidStatus) { //forbid by Admin
                if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
            } else {
                if (myLand.user._id !== _id) {
                    if (clsName.indexOf(' myLand noSell') === -1) clsName += ' noSell';
                    if (myLand.forSaleStatus) {
                        if (clsName.indexOf(' forSell') === -1) clsName += ' forSell'
                    }

                } else {
                    if (tilesEffectArray) {
                        for (let i = 0; i < tilesEffectArray.length; i++) {
                            if (myLand.quadKey === tilesEffectArray[i].quadKey) {
                                tilesEffectArray.length !== 4 ? clsName += ' specialTreeUnAvailable' : tilesEffectArray[i].squareAvailable ? clsName += ' specialTreeAvailable' : clsName += ' specialTreeUnAvailable'
                            }
                        }
                    }
                    if (myLand.forSaleStatus) {
                        if (clsName.indexOf(' myLand myForSell') === -1) clsName += ' myForSell'
                    }
                    if (clsName.indexOf(' myLand') === -1) clsName += ' myLand';
                }
            }
        } else { //forbid Area
            if (myLand.forbidStatus) {
                if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
            }
        }
    }

    clsName += landPosition && myLand && myLand.quadKey === landPosition ? ' center' : '';
    return clsName

};


//render single tile -> React memo (HOC)
export const SingleTile = memo((props) => {
    const {className, quadKey, landCharacters, handleShowPopupForTree} = props;
    return (
        <div className={`tile-n ` + className} id={quadKey}
             style={{position: 'relative'}}>
            {className.indexOf('center') !== -1 && <div className='centick'/>}
            <LandStatusComponent className={className}/>
            <TreePositionRender landCharacters={landCharacters} quadKey={quadKey}
                                handleShowPopupForTree={handleShowPopupForTree}/>
        </div>
    )
});
