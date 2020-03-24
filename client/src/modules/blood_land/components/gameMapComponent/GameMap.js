import React, {PureComponent} from 'react';
import GoogleMap from 'google-map-react';
import connect from "react-redux/es/connect/connect";
import isEqual from 'lodash.isequal';
import {mapActions} from "../../../../store/actions/commonActions/mapActions";
import intersectionBy from 'lodash.intersectionby';
import isUndefined from 'lodash.isundefined';
import * as f from "./component/GameMapFunction";
import GameMapRender from "./component/GameMapRender";
import {objectsActions} from "../../../../store/actions/gameActions/objectsActions";
import {landActions} from "../../../../store/actions/landActions/landActions";
import {alertPopup} from "./component/A&PSchema";
import {inventoryActions} from "../../../../store/actions/gameActions/inventoryActions";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import {mapGameAction} from "../../../../store/actions/gameActions/mapGameActions";

//-----note 08/06/2019 - MINH TRI
//Lock => on handle SetState -> bound change
// -----------------------------------------

class GameMap extends PureComponent {
    state = {
        selectedTiles: [],
        selectMode: "single", //none, single, multi, clear
        currentPopup: alertPopup.noPopup,
        checkTreeInterval: null,
        firstLoad: true
    };

    static getDerivedStateFromProps(props, state) {
        if (props.lands.allLands && !isEqual(props.lands.allLands, state.lands)) {
            if (props.lands.isOwn) {
                return {landsUpdated: true, selectedTiles: []};
            }
            return {lands: props.lands.allLands}
        }
        const {center, zoom, centerQuadKey, centerChange} = props.map;
        if (center) {
            if (zoom) {
                if (centerQuadKey) {
                    return {center, zoom, centerQuadKey, centerChange};
                }
                return {center, zoom, centerChange};
            }
            return {center, centerChange};
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.characterData !== this.props.characterData) {
            const {characterData, lands, user, objectArea} = this.props;
            const arrayTileEffect = this.createBitaminTile();

            if (characterData) {
                f.addCharacterToMap(characterData, lands, user, this.handleShowPopup, objectArea, arrayTileEffect);
            }
        }
        if (prevProps.itemData !== this.props.itemData) {
            const {itemData, lands, user, objectArea, wallet, itemInventory} = this.props;
            if (itemData) {
                const itemFind = itemInventory && itemInventory.find(shop => shop.itemId === itemData.itemId);
                if (itemData.itemId === 'I03' || itemFind.quantity > 0) {
                    f.usingItemForTree(itemData, lands, user, this.handleShowPopup, objectArea, this.handleShowAlert)
                } else {
                    const {info} = wallet;
                    if (info.goldBlood - itemFind.price < 0) {
                        this.handleShowAlert(alertPopup.rechargeAlertPopup) /*!!!!important*/
                    } else {
                        f.usingItemForTree(itemData, lands, user, this.handleShowPopup, objectArea, this.handleShowAlert)
                    }
                }

            }
        }

        if (prevProps.plantingResult !== this.props.plantingResult) {
            if (this.props.plantingResult) {
                const {plantingResult: {status}} = this.props;
                if (status) {
                    setTimeout(() => {
                        this.handleShowAlert(alertPopup.platingTreeSuccessPopup)
                    }, 500);
                    this.props.clearPlantedTreesResult()
                } else {
                    this.handleShowAlert(alertPopup.platingTreeUnSuccessPopup);
                    this.props.clearPlantedTreesResult()
                }
            }
        }

        if (prevProps.usingResult !== this.props.usingResult) {
            if (this.props.usingResult) {
                const {usingResult: {status}} = this.props;
                if (status) {
                    setTimeout(() => {
                        this.handleShowAlert(alertPopup.usingItemForTreeSuccessPopup)
                    }, 500);
                    this.props.clearSuccessError();
                } else {
                    this.handleShowAlert(alertPopup.usingItemForTreeUnSuccessPopup);
                    this.props.clearSuccessError();
                }
            }
        }
        //plant tree
        if (!isUndefined(this.props.plantStatus)) {
            this.props.clearMoveTreeToMap();
        }
    }

    //show alert and popup
    handleShowAlert = (status) => {
        this.setState({
            currentPopup: status
        });
    };
    handleShowPopup = (status) => {
        const {characterData, user, checkLand, itemData, objectId, checkForSaleStatus , checkNotMyLand , checkAlreadyHaveTree} = status;
        const {itemInventory} = this.props;
        if(checkNotMyLand){
            this.setState({
                currentPopup: alertPopup.wrongLandAlert
            })
        }
        else if (checkForSaleStatus) {
            this.setState({
                currentPopup: alertPopup.checkForSaleStatusForTreeAlert
            })
        }else if(checkAlreadyHaveTree) {
            this.setState({
                currentPopup: alertPopup.checkAlreadyHaveTreeAlert
            })
        }else {
            if (checkLand) {
                if (characterData) {
                    const plantData = {characterData, user};
                    this.setState({
                        plantData,
                        currentPopup: alertPopup.plantingConfirmAlert
                    })
                } else if (itemData) {
                    const {checkLand: {checkLimitNutritionResult}} = status;
                    if (checkLimitNutritionResult) {
                        this.setState({
                            currentPopup: alertPopup.limitNutritionAlert
                        })
                    } else {
                        const usingItemData = {itemData, user, objectId};
                        if (itemData.itemId === "I03") {
                            this.setState({
                                usingItemData,
                                currentPopup: alertPopup.usingItemConfirmAlert
                            })
                        } else {
                            const itemInventoryFindItem = itemInventory.find(item => item.itemId === itemData.itemId);
                            if (itemInventoryFindItem.quantity === 0) {

                                this.setState({
                                    usingItemData,
                                    currentPopup: alertPopup.usingItemNoneQuantityConfirmAlert
                                })
                            } else {
                                this.setState({
                                    usingItemData,
                                    currentPopup: alertPopup.usingItemConfirmAlert
                                })
                            }
                        }
                    }
                } else {
                    this.setState({
                        currentPopup: alertPopup.platingTreeUnSuccessPopup
                    })
                }
            } else {
                this.setState({
                    currentPopup: alertPopup.wrongLandAlert
                })
            }
        }

    };
    handleShowPopupForTree = (status) => {
        const {checkPopup, item: {itemId, _id}} = status;

        if (checkPopup === alertPopup.cultivationTreePopup) {
            this.setState({
                itemPopupCultivation: _id,
                currentPopup: alertPopup.cultivationTreePopup
            })
        } else {
            this.setState({
                itemPopupDetail: itemId,
                currentPopup: alertPopup.detailTreePopup
            })
        }
    };

    handleHidePopup = () => {
        this.setState({
            currentPopup: alertPopup.noPopup
        })
    };

    componentWillUnmount = () => {
        clearInterval(this.state.checkTreeInterval);
    };

    // =========================================
    componentDidMount() {
        const {user: {wToken, _id}} = this.props;
        // Minh tri
        // Update param - 6/4/19
        // ========================================
        this.props.getAllLandById(_id);
        this.setState({loaded: true});
        this.props.getWalletInfo({wToken});

    }


    onHandleSetState = (map) => {
        const {selectedTiles, lands, centerQuadKey} = this.state;
        const {zoom, bounds} = f.getZoomBounds(map);
        const {lands: {openCountriesLoading, openCountries}} = this.props;
        const drawTilesParam = {
            zoom,
            bounds,
            lands: lands || [],
            selectedTiles,
            centerQuadKey,
            openCountriesLoading,
            openCountries
        };

        const tiles = f.drawTiles(drawTilesParam);
        this.setState({tileLoaded: true, landsUpdated: false, tiles, zoom, bounds});
    };

    _onGoogleApiLoaded = ({map}) => {
        const {user, getAreaObject, getAreaLand} = this.props;
        this.setState({map});
        map.addListener('idle', () => {
            f.getParticleLands(map, getAreaObject, user, getAreaLand);
            this.onHandleSetState(map)

        });
        map.addListener('bounds_changed', () => {
            this.onHandleSetState(map);
        });
        map.addListener('dragstart', () => {
            this.setState({isDragging: true});
        });
        map.addListener('dragend', () => {
            setTimeout(() => {
                this.setState({isDragging: false});
            })
        });
    };

    createBitaminTile = () => {
        let {tiles} = this.state;
        const {quadKeyBitamin , objectArea , user: {_id} } = this.props;
        const bigTreeQuadKeys = objectArea ? (objectArea.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        const createTileEffectParam = {quadKeyBitamin , tiles , objectArea , bigTreeQuadKeys , _id };
        return quadKeyBitamin && f.onHandleCreateTileEffect(createTileEffectParam);
    }
    _onChange = async ({center, zoom, bounds}) => {
        localStorage.setItem('lat', center.lat );
        localStorage.setItem('lng', center.lng );
    };
    renderMap = () => {
        let {center, isDragging, tiles} = this.state;
        const {lands: {allLands}, landSelected  , objectArea , user: {_id} } = this.props;
        const landsFilter = intersectionBy(allLands, tiles, 'quadKey');
        const arrayTileEffect = this.createBitaminTile();
        return (
            <GoogleMap
                center={center}
                zoom={22}
                onChange={this._onChange}
                onGoogleApiLoaded={this._onGoogleApiLoaded}
                yesIWantToUseGoogleMapApiInternals
                options={{
                    fullscreenControl: false,
                    disableDoubleClickZoom: true,
                    scrollwheel: false,
                    zoomControl: false,
                    keyboardShortcuts: false,
                }}>
                {tiles && tiles.map((item) => {
                    let myLand = landsFilter && landsFilter.filter(i => i.quadKey === item.quadKey)[0];

                    let clsName = f.onRenderClassName(item, myLand, _id, arrayTileEffect, landSelected);

                    const {latlng: {lat, lng}, quadKey} = item;
                    return (
                        <f.SingleTile
                            key={quadKey}
                            lat={lat} lng={lng}
                            quadKey={quadKey} className={clsName}
                            landCharacters={objectArea} handleShowPopupForTree={this.handleShowPopupForTree}
                            isDragging={isDragging}/>
                    )
                })}

            </GoogleMap>
        );
    };

    render() {
        const {currentPopup, plantData, itemPopupCultivation, itemPopupDetail, usingItemData, map } = this.state;
        const renderMap = this.renderMap();
        const arrayTileEffect = this.createBitaminTile();
        return (
            <GameMapRender renderMap={renderMap} currentPopup={currentPopup}
                           itemPopupCultivation={itemPopupCultivation}
                           itemPopupDetail={itemPopupDetail}
                           handleHidePopup={this.handleHidePopup}
                           map={map}
                           plantData={plantData}
                           usingItemData={usingItemData}
                           arrayTileEffect={arrayTileEffect}
                           getAreaObject={this.props.getAreaObject}
                           getAreaLand={this.props.getAreaLand}
                           handleShowPopupForTree={this.handleShowPopupForTree}
                           handleShowAlert={(status) => this.handleShowAlert(status)}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        wallet, lands, authentication: {user},
        shopsReducer: {shops},
        mapGameReducer: {arrayTileEffect},
        map, lands: {landSelected}, objectsReducer: {objects, plantStatus, objectArea }, mapGameReducer: {characterData, itemData, quadKeyBitamin}, inventoryReducer: {itemInventory, plantingResult, usingResult}
    } = state;
    return {
        user,
        lands,
        map,
        landSelected,
        objects,
        characterData,
        itemData,
        itemInventory,
        plantStatus,
        plantingResult,
        usingResult,
        wallet,
        shops,
        quadKeyBitamin,
        arrayTileEffect,
        objectArea
    };
};

const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    clearMoveTreeToMap: () => dispatch(objectsActions.clearMoveTreeToMap()),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    // getAllObjects: (param) => dispatch(objectsActions.getAllObjects(param)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
    clearSuccessError: () => dispatch(inventoryActions.clearSuccessError()),
    setTreeDies: (deadTrees) => dispatch(objectsActions.setTreeDies(deadTrees)),
    onHandleGetArrayTileEffect: (arrayTileEffect) => dispatch(mapGameAction.onHandleGetArrayTileEffect(arrayTileEffect)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    getAreaObject: (param) => dispatch(objectsActions.getAreaObject(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameMap);



