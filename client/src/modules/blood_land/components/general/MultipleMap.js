import React, {Fragment, memo, useState, useEffect} from 'react';
import GameUI from "../veticalBarComponent";
import connect from "react-redux/es/connect/connect";
import MiniMapComponent from "../miniMapComponent/miniMap"
import LandMap from "../landMapComponent/LandMap";
import GameMap from "../gameMapComponent/GameMap";
import {landActions} from "../../../../store/actions/landActions/landActions";
import {shopsActions} from "../../../../store/actions/gameActions/shopsActions";
import Functions from "../horizontalBarComponent";
import SearchBar from "../horizontalBarComponent/component/SearchBar";
import Notice from "../noticeComponent"
import {onHandleGetFirstAccessLocation} from "../../../../helpers/Common";
import BloodExchangeTrade from "../horizontalBarComponent/component/BloodExchangeTrade";


const MultipleMap = memo((props) => {
    const {gameMode, mapExpanding, checkDisplay, onHandleGetShop, lands, getAllLandMarkCategoryInMap} = props;

    let centerMapUpdate = onHandleGetFirstAccessLocation();
    const mainMapUpdate = {
        center: centerMapUpdate,
        zoom: 22,
        size: null,
        bounds: null,
        map: null,
    };
    const [tilesLoaded, setTilesLoaded] = useState(false);
    const [firstLoad, setFirstLoad] = useState(false);
    const [mainMap, setMainMap] = useState(mainMapUpdate);

    useEffect(() => {
        if (!firstLoad) {
            onHandleGetShop();
            getAllLandMarkCategoryInMap();
        }
        return () => {
            setFirstLoad(true)
        }
    });

    const isUndefinedTiles = (tiles) => {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (tile) return false;
        }
        return true
    };

    const hasLengthZero = (tiles) => {
        return tiles.length === 0;
    };

    const checkLoadedTiles = (tiles) => {
        setTilesLoaded(isUndefinedTiles(tiles) || hasLengthZero(tiles))
    };

    return (
        <div className='map-container'>
            <MiniMapComponent/>
            <BloodExchangeTrade defaultPrice={lands.defaultLandPrice}/>
            <Notice />
            {checkDisplay && <Fragment>
                <GameUI gameMode={gameMode}/>
                <div className={`game-tools ${mapExpanding ? 'minimap-expanding' : ''}`}>
                    <SearchBar/>
                    <Functions/>

                </div>
            </Fragment>}

            <div className='mainMap' id='mainMap'>
                {gameMode ? <GameMap dataMap={mainMap}/> :
                    <LandMap checkLoadedTiles={checkLoadedTiles} dataMap={mainMap}/>}
            </div>
        </div>
    )
});


const mapStateToProps = (state) => {
    const {map, lands, settingReducer: {gameMode, mapExpanding}} = state;
    return {
        map,
        lands,
        gameMode,
        mapExpanding
    };
};
const mapDispatchToProps = (dispatch) => ({
    getAllLandMarkCategoryInMap: () => dispatch(landActions.getAllLandMarkCategoryInMap()),
    onHandleGetShop: () => dispatch(shopsActions.getShop()),
});
export default connect(mapStateToProps, mapDispatchToProps)(MultipleMap);
