import React, {Component, PureComponent} from 'react';
import GoogleMap from 'google-map-react';
import update from 'immutability-helper';
import isEqual from 'lodash.isequal';
import isNull from 'lodash.isnull';
import connect from "react-redux/es/connect/connect";
import {mapActions} from "../../../../store/actions/commonActions/mapActions";
import {
    calculatorLand,
    checkInCenter,
    checkInCountry,
    drawLine,
    removeDuplicates,
    splitLand
} from './component/MapFunction';
import {
    LatLongToTileXY,
    loadingImage,
    QuadKeyToLatLong,
    QuadKeyToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
} from '../general/System';

import {landActions} from "../../../../store/actions/landActions/landActions";
import uniq from "lodash.uniq";
import has from "lodash.has";
import {toggleLandIcon} from "./component/asset";
import {getCertificateAlertPopup, landCertificationPopup} from "./component/LandMapAlert";
import TranslateLanguage from './../general/TranslateComponent';


const DEFAULT_LEVEL_OFFSET = 2;
const LIMIT_ZOOM_SELECTED = 22;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;
let tmp = [];

class LandMap extends Component {
    state = {
            center: null,// [37.566535, 126.9779692],// {lat: 38.30394763084891, lng: 127.51487731933594}
            zoom: null,
            size: null,
            bounds: null,
            map: null,
            lands: null,
            tiles: [],
            selectedTiles: [],
            selectMode: "single", //none, single, multi, clear, line, fill
            multiSelectStart: null,
            multiSelectSave: [],
            multiClearStart: null,
            centerQuadKey: null,
            firstLoad: true,
            defaultLandPrice: 0,
            landGrpCate: null,
        };


    //gọi khi map move hoặc zoom
    _onChange = async ({center, zoom, bounds}) => {
        localStorage.setItem('lat', center.lat );
        localStorage.setItem('lng', center.lng );
        if (this.state.centerChange || this.state.firstLoad) {
            //tạo ra tiles
            const tiles = this.drawTiles({
                zoom: zoom,
                bounds: bounds,
                lands: this.state.lands || [],
                selectedTiles: this.state.selectedTiles,
            });
            //set state, thay đổi tiles hiện tại và sẽ render lại tiles
            this.setState({
                tileLoaded: true,
                landsUpdated: false,
                tiles,
                zoom,
                bounds,
                centerChange: false,
                firstLoad: false
            });
        }
        //cập nhật lại vị trí hiện tại
        this.props.updateCenterMap(center);
        this.props.syncCenterMap(center, zoom);
    };

    static getDerivedStateFromProps(props, state) {
        //lấy land từ props và cập nhật land trong state ( chỉ cập nhật nếu land từ props và land từ state khác nhau )
        const {allLands, landGrpCate, defaultLandPrice, isOwn} = props.lands;
        if (allLands && !isEqual(allLands, state.lands)) {
            if (isOwn) {
                return {lands: allLands, landsUpdated: true, selectedTiles: []};
            }
            return {lands: allLands, landGrpCate, defaultLandPrice, landsUpdated: true}
        }
        //change center
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

    componentDidMount() {
        const {user: {_id}} = this.props;
        const {center, zoom} = this.props.dataMap;
        //load tất cả land của 1 user khi đã render xong map
        this.props.getAllLandById(_id);
        // this.onHandleGetLocation();

        //setState trạng thái load của map, quadKey center, zoom hiện tại
        this.setState({loaded: true, center, zoom});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // cập nhật land được chọn
        //cập nhật trạng thái mới của land được chọn, nếu mode từ props mới là clear thì xóa luôn những land đang chọn = rỗng
        // còn không thì cập nhật land được chọn ( chọn từng ô hoặc từng vùng )
        if (this.state.loaded && this.props.map.mode && this.props.map.mode !== this.state.selectMode) {
            const {zoom, bounds, lands, selectedTiles} = this.state;
            let newSelectedTiles = this.props.map.mode === "clear" ? [] : selectedTiles;
            if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                let tiles = this.drawTiles({
                    zoom,
                    bounds,
                    lands,
                    selectedTiles: newSelectedTiles,
                });
                this.setState({
                    tiles,
                    // landsUpdated: false,
                    selectMode: this.props.map.mode,
                    selectedTiles: newSelectedTiles,
                    multiSelectStart: null,
                    multiClearStart: null
                });
            }
        }

        if (this.state.loaded && this.props.map.selected && !isEqual(this.props.map.selected, this.state.selectedTiles)) {
            const {zoom, bounds, lands} = this.state;
            if (typeof bounds !== 'undefined' && !isNull(bounds)) {
                const tiles = this.drawTiles({zoom, bounds, lands, selectedTiles: this.props.map.selected});
                this.setState({tiles, selectedTiles: this.props.map.selected});
            }
        }
    }

    getZoomBounds = (map) => {
        //trả ra 4 cặp latlng của 4 góc theo màn hình
        if (!map) return;
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
        return {zoom, bounds, level: zoom + DEFAULT_LEVEL_OFFSET};
    };

    startAndEndBounds = ({level, beginTile, endTile}) => {
        if (beginTile.x > endTile.x) {
            let tmpEndTile = 127;
            if (level > 7) {
                tmpEndTile = 2 ** level - 1;
            }
            return [{ //split end chunk
                beginTile: {x: beginTile.x, y: beginTile.y},
                endTile: {x: tmpEndTile, y: endTile.y}
            }, { //split start chunk
                beginTile: {x: 0, y: beginTile.y},
                endTile: {x: endTile.x, y: endTile.y}
            }]
        } else {
            return [{beginTile, endTile}];
        }
    };

    getParticalLands(map) {
        //gọi request lấy những land trong database
        const {bounds, level} = this.getZoomBounds(map);
        let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

        let arrQK = [];
        for (let x = beginTile.x; x <= endTile.x; x++) {
            for (let y = beginTile.y; y <= endTile.y; y++) {
                arrQK.push(TileXYToQuadKey(x, y, level));
            }
        }
        let parents1 = uniq(arrQK.map(qk => qk.substr(0, level - PARENT_1_RANGE)));
        let parents2 = uniq(arrQK.map(qk => qk.substr(0, level - PARENT_2_RANGE)));
        // this.props.getAllLand({ parents1, parents2, level, role: this.props.user ? this.props.user.role : 'user' });
        this.props.getAreaLand({parents1, parents2, level, role: this.props.user ? this.props.user.role : 'user'});

    }

    _onGoogleApiLoaded = ({map}) => {
        //event load map và setState map vào component
        this.setState({map});

        map.addListener('idle', () => {
            //event mỗi khi map thay đổi
            if (this.state.tileLoaded) {
                const {zoom, bounds} = this.getZoomBounds(map);
                if (typeof this.props.map.zoom !== 'undefined' && zoom === this.props.map.zoom) {
                    //load map lên và gọi request lấy land trong database
                    this.getParticalLands(map);
                    const tiles = this.drawTiles({
                        zoom,
                        bounds,
                        lands: this.state.lands || [],
                        selectedTiles: this.state.selectedTiles,
                    });
                    this.setState({
                        // tileLoaded: true,
                        // landsUpdated: false,
                        tiles,
                        zoom,
                        bounds,
                    });
                }
            }
        });

        map.addListener('zoom_changed', (e) => {
            //tạo hiệu ứng xóa lưới khi vừa zoom xong
            this.setState({tiles: [], multiSelectStart: null, multiClearStart: null});
        });

        map.addListener('bounds_changed', (e) => {
            //sự kiện khi 1 map nhận thay đổi và load xong hết dữ liệu
            if (this.state.tileLoaded) {
                const {zoom, bounds} = this.getZoomBounds(map);
                if (typeof this.props.map.zoom !== 'undefined' && zoom === this.props.map.zoom) {
                    //tạo tile
                    const tiles = this.drawTiles({
                        zoom,
                        bounds,
                        lands: this.state.lands || [],
                        selectedTiles: this.state.selectedTiles,
                    });
                    //set tiles và sẽ render lại
                    this.setState({
                        // tileLoaded: true,
                        // landsUpdated: false,
                        tiles,
                        zoom,
                        bounds
                    });
                }
            }
        });

        map.addListener('dragstart', () => {
            //sự kiện kéo map, set 1 biến flag để chặn hiệu ứng thừa
            this.setState({isDragging: true, isTouch: true});
        });

        map.addListener('dragend', () => {
            //sự kiện sau khi kéo map, set lại biến flag
            setTimeout(() => {
                this.setState({isDragging: false});
            })
        });
    };

    createTile = (x, y, level, lands, selectedTiles) => {
        //hàm tạo ra 1 tile dựa vào các thông tin sau
        //lấy quadKey từ x,y,level
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        //lấy latlng từ x,y,level
        let tileLatLng = TileXYToLatLong(x, y, level);
        //khao báo tile object
        let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};
        //BOOLEAN trạng thái selected của 1 tile, nếu quadKey của tile này thuộc state selectedTiles của component thì TRUE, else FALSE 
        tile.selected = selectedTiles && selectedTiles.length > 0 && selectedTiles.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        //BOOLEAN trạng thái forbid của 1 tile từ function checkInCountry
        const forbid = !checkInCountry({
            latlng: tileLatLng,
            openCountries: this.props.lands.openCountriesLoading === false ? this.props.lands.openCountries : []
        });
        //BOOLEAN trạng thái cho biết 1 tile có phải là center hay ko
        tile.isCenter = this.state.centerQuadKey && tileQuadKey === this.state.centerQuadKey;
        //BOOLEAN trạng thái cho biết 1 tile có phải là landmark hay ko
        tile.landmark = this.props.lands.landmarks && this.props.lands.landmarks.length > 0 && this.props.lands.landmarks.some(lm => lm.centerQuadKey.indexOf(tileQuadKey) === 0);
        const totalCount = calculatorLand(tile.quadKey.length);
        //đếm số land có tồn tại trên 1 tile ( khi zoom lên các tầng trên )
        tile.totalCount = totalCount;
        //nếu lands có giá trị ( đất trong database )
        if (lands) {
            //tìm và set giá trị 1 land nếu land này có đang nằm trong những tiles hiển thị trên màn hình
            let fLand = lands.find(land => tile && tile.quadKey.indexOf(land.quadKey) === 0);
            if (fLand) {
                //set giá trị cho 1 land
                tile.lands = [{
                    forbid: forbid || fLand.forbidStatus,
                    landmark: fLand.user && fLand.user.role && fLand.user.role === 'manager',//fLand.forbidStatus,
                    forSaleStatus: fLand.forSaleStatus,
                    user: fLand.user,
                    quadKey: fLand.quadKey,
                }]
            } else {
                // //13211230
                // //1321123
                // //lọc ra những land ở tầng trên thuộc 1 land
                // let fOutLand = lands.filter(land => land.quadKey && land.quadKey.indexOf(tile.quadKey) === 0);
                // if (fOutLand && fOutLand.length > 0) {
                //     //set các lands thuộc 1 tile, ( khi zoom tầng trên, 1 tile có thể gồm nhiều land )
                //     tile.lands = fOutLand.map(land => {
                //         const landCount = calculatorLand(tile.quadKey.length + (land.quadKey.length - tile.quadKey.length));
                //         return {
                //             forbid: forbid || land.forbidStatus,
                //             landmark: land.user && land.user.role && land.user.role === 'manager',//land.forbidStatus,
                //             forSaleStatus: land.forSaleStatus,
                //             sellPrice: land.sellPrice,
                //             initialPrice: null,
                //             purchasePrice: null,
                //             purchaseDate: null,
                //             user: land.user,
                //             landCount: landCount,
                //             totalCount: totalCount,
                //             quadKey: land.quadKey,
                //         }
                //     });
                // } else {
                //set 1 tile chỉ có 1 land
                tile.lands = [{
                    empty: true,
                    forbid: forbid || false,
                    forSaleStatus: null,
                    landmark: false,
                    user: null,
                    sellPrice: this.state.defaultLandPrice,
                    initialPrice: this.state.defaultLandPrice,
                    purchasePrice: null,
                    purchaseDate: null,
                    landCount: totalCount,
                    totalCount: totalCount,
                    char: null,
                    quadKey: tileQuadKey,
                }];
                //}
            }
            return tile;
        }
    }

    createTileLower22 = (x, y, level, lands, selectedTiles) => {
        //tạo tile nếu khác tầng cuối cùng
        //lấy quadkey từ x,y,level
        let tileQuadKey = TileXYToQuadKey(x, y, level);
        //lấy latlng từ x,y,level
        let tileLatLng = TileXYToLatLong(x, y, level);
        //tạo tile object
        let tile = {level, latlng: tileLatLng, quadKey: tileQuadKey};

        //tính tổng số land có bên trên của 1 tile
        const totalCount = calculatorLand(tile.quadKey.length);

        tile.totalCount = totalCount;
        //tile.forbid = !checkInCountry(tileLatLng);
        //BOOLEAN trạng thái 1 tile có phải là forbid hay ko
        tile.forbid = !checkInCountry({
            latlng: tileLatLng,
            openCountries: this.props.lands.openCountriesLoading === false ? this.props.lands.openCountries : []
        });
        //BOOLEAN trạng thái 1 tile có đang được select hay ko ? ( kiểm tra từ state selectedTiles ) 
        tile.selected = selectedTiles && selectedTiles.length > 0 && selectedTiles.some(t => tile.quadKey.indexOf(t.quadKey) === 0 || t.quadKey.indexOf(tile.quadKey) === 0);
        //BOOLEAN trạng thái 1 tile có phải là landmark hay ko ?
        tile.landmark = this.props.lands.landmarks && this.props.lands.landmarks.length > 0 && this.props.lands.landmarks.some(lm => lm.centerQuadKey.indexOf(tileQuadKey) === 0);
        let fLand = lands.find(land => land.quadKey === tile.quadKey);
        //tạo thông tin số đất được mua, số đất không đc mua, số landmark của 1 tile ( khác tầng cuối cùng )
        if (fLand) {
            tile.canBuy = totalCount - fLand.count;
            tile.canNotBuy = fLand.count;
            tile.landmarkCount = fLand.landmarkCount || 0;
        }
        return tile;
    }

    createArrayTile({beginTile, endTile, zoom, level, lands, selectedTiles}) {
        //tạo ra nhiều tiles , được gọi trong function drawTiles
        let arrTile = [];
        // const {isTouch} = this.state;
        // if (zoom === 22 && isTouch) {
        //     this.setState({ isTouch: false });
        // }

        if (zoom === 22) {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(this.createTile(x, y, level, lands, selectedTiles || []));
                    }
                }
            }
        } else {
            if (beginTile.x <= endTile.x) {
                for (let x = beginTile.x; x <= endTile.x; x++) {
                    for (let y = beginTile.y; y <= endTile.y; y++) {
                        arrTile.push(this.createTileLower22(x, y, level, lands, selectedTiles || []));
                    }
                }
            }

        }
        return arrTile;
    }

    drawTiles({zoom, bounds, lands, selectedTiles}) {
        //tạo biến level
        const level = zoom + DEFAULT_LEVEL_OFFSET;
        //tạo tile với tọa độ x,y từ latlng góc trái trên
        let beginTile = LatLongToTileXY(bounds.ne.lat, bounds.sw.lng, level);
        //tạo tile với tọa độ x,y từ latlng góc phải dưới
        let endTile = LatLongToTileXY(bounds.sw.lat, bounds.ne.lng, level);

        const LOAD_OUT_BOUNDS = 0;
        beginTile = {x: beginTile.x - LOAD_OUT_BOUNDS, y: beginTile.y - LOAD_OUT_BOUNDS};
        endTile = {x: endTile.x + LOAD_OUT_BOUNDS, y: endTile.y + LOAD_OUT_BOUNDS};

        //ARRAY trường hợp đi hết 1 vòng trái đất, tách ra 2 loại lưới, 
        let arrStartEnd = this.startAndEndBounds({level, beginTile, endTile});
        //tạo tiles
        return arrStartEnd.reduce((total, {beginTile, endTile}) => total.concat(this.createArrayTile({
            beginTile,
            endTile,
            zoom,
            level,
            lands,
            selectedTiles
        })), []);
    }

    tileByQuadKey(quadKey) {
        const totalCount = calculatorLand(quadKey.length);
        let tileXY = QuadKeyToTileXY(quadKey);
        let latlng = QuadKeyToLatLong(quadKey);
        return {
            "x": tileXY.x,
            "y": tileXY.y,
            "level": tileXY.level,
            "isCenter": null,
            "latlng": latlng,
            "quadKey": quadKey,
            "selected": true,
            "lands": [{
                "char": null,
                "empty": true,
                "forSaleStatus": null,
                "forbid": false,
                "user": null,
                "sellPrice": this.state.defaultLandPrice,
                "landCount": totalCount,
                "totalCount": totalCount,
                "quadKey": quadKey,
            }]
        }
    }


    loopFill = (x, y) => {
        try {
            var center = TileXYToQuadKey(x + 0, y + 0, 24);
            var left = TileXYToQuadKey(x - 1, y + 0, 24);
            var right = TileXYToQuadKey(x + 1, y + 0, 24);
            var top = TileXYToQuadKey(x + 0, y - 1, 24);
            var bottom = TileXYToQuadKey(x + 0, y + 1, 24);
            //const { selectedLineTiles } = this.state;

            if (!Array.isArray(tmp) || tmp.length === 0 || tmp.length > 6000) return;
            if (center && left && right && top && bottom) {
                if (tmp.indexOf(center) === -1) tmp.push(center);
                if (tmp.indexOf(left) === -1) this.loopFill(x - 1, y + 0);
                if (tmp.indexOf(right) === -1) this.loopFill(x + 1, y + 0);
                if (tmp.indexOf(top) === -1) this.loopFill(x + 0, y - 1);
                if (tmp.indexOf(bottom) === -1) this.loopFill(x + 0, y + 1);
            }
        } catch (e) {
            throw e;
        }
    };

    //sự kiện tile click
    tileClick(tile) {
        //chỉ cho phép click chọn tile nếu tile có giá lớn hơn 0 đồng
        //let isAllLandsOfTileGressThanZero = tile.lands ? tile.lands.filter(l => l.initialPrice > 0) : [];
        const {lands, user} = this.props;
        //không cho click nếu ko có 1 miếng đất có giá lớn hơn 0
        if (!lands || lands.landPriceLoading) return;
        //không cho click nếu không phải tầng cuối cùng
        if (this.state.zoom < LIMIT_ZOOM_SELECTED/* && this.props.user.role !== 'manager'*/) return;  //don't click when lower zoom 22
        //không cho click land forbid
        if (tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => tile.quadKey.indexOf(land.quadKey) === 0 && land.forbid)) return;    //limit don't click to Forbid Tile
        //không cho admin click land nếu đất đó thuộc người khác
        if (user && user.role && user.role === 'manager' && tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => land.user !== null)) return;   //limit admin don't click to Partical or Other land

        if (this.state.selectMode === "none") {
            if (this.state.multiClearStart === null) {
                if (!this.state.isDragging) {
                    this.setState({multiClearStart: tile});
                }
            } else {
                this.setState({multiClearStart: null, selectedTiles: this.state.multiSelectSave});
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else if (this.state.selectMode === "multi") {
            //Chọn từng vùng
            //nếu state khởi đầu null , bắt đầu chọn
            if (this.state.multiSelectStart === null) {
                //set state tile khởi đầu
                if (!this.state.isDragging) {
                    this.setState({multiSelectStart: tile});
                }
            } else {
                //state khởi đầu khác null, chọn xong và set state selected
                this.setState({multiSelectStart: null, selectedTiles: this.state.multiSelectSave});
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else if (this.state.selectMode === "line") {
            //chọn theo line - chức năng admin
            if (this.state.multiSelectStart === null) {
                if (!this.state.isDragging) { //click Start Tile
                    // const { selectedLineTiles } = this.state;
                    if (tmp && tmp.length > 0 && checkInCenter({x: tile.x, y: tile.y}, tmp)) {
                        this.loopFill(tile.x, tile.y);
                        if (tmp.length <= 6000) {
                            let newSelectedTiles = tmp.map(qk => {
                                let fTile = this.state.tiles.find(t => t.quadKey === qk);
                                if (fTile) {
                                    fTile.selected = true;
                                    return fTile;
                                } else {
                                    return this.tileByQuadKey(qk);
                                }
                            });

                            const {zoom, bounds, lands} = this.state;
                            if (bounds && zoom) {
                                const tiles = this.drawTiles({zoom, bounds, lands, selectedTiles: newSelectedTiles});
                                this.setState({multiSelectStart: null, tiles, selectedTiles: newSelectedTiles});
                                this.props.addSelected(newSelectedTiles);
                            }
                        } else if (tmp.length === 6001) {
                            tmp = [];
                            this.setState({multiSelectStart: null});
                        }
                    } else {
                        this.setState({multiSelectStart: tile});
                    }
                }
            } else { //click End Tile
                //const selectedLineTiles = this.state.multiSelectSave.map(nslTile => TileXYToQuadKey(nslTile.x, nslTile.y, 24));
                tmp = this.state.multiSelectSave.map(nslTile => TileXYToQuadKey(nslTile.x, nslTile.y, 24));
                //tmp = [...selectedLineTiles];
                this.setState({multiSelectStart: null, selectedTiles: this.state.multiSelectSave});
                this.props.addSelected(this.state.multiSelectSave);
            }
        } else {
            //chọn từng ô
            //chọn vị trí của tile mà bạn đã click
            const selectedIndex = this.state.tiles.findIndex(t => t.quadKey === tile.quadKey);
            //nếu ô này chưa được chọn
            if (this.state.tiles[selectedIndex].selected === false) {
                //nếu không có đang kéo màn hình
                if (!this.state.isDragging) {
                    //show popup buy land
                    const newTiles = [...this.state.tiles];
                    newTiles[selectedIndex].selected = true;
                    let newSelectedTiles = update(this.state.selectedTiles, {$push: [tile]});
                    this.setState({tiles: newTiles, selectedTiles: newSelectedTiles});
                    this.props.addSelected(newSelectedTiles);
                }
            } else { //nếu ô này đã được chọn
                const newTiles = [...this.state.tiles];
                newTiles[selectedIndex].selected = false;
                let newSelectedTiles = [...this.state.selectedTiles];
                const slTIndex = this.state.selectedTiles.findIndex(t => t.quadKey === tile.quadKey);
                if (slTIndex !== -1) { //equal level
                    newSelectedTiles = update(newSelectedTiles, {$splice: [[slTIndex, 1]]});
                } else { // lower level or higher
                    const lowerLevelIndex = this.state.selectedTiles.findIndex(t => tile.quadKey.indexOf(t.quadKey) === 0)
                    if (lowerLevelIndex !== -1) {
                        let parentTile = newSelectedTiles[lowerLevelIndex];
                        let arrSplitQuadkey = splitLand([parentTile.quadKey], tile.quadKey);
                        let splitTile = arrSplitQuadkey.map(qk => this.tileByQuadKey(qk));

                        newSelectedTiles.splice(lowerLevelIndex, 1);
                        newSelectedTiles = newSelectedTiles.concat(splitTile);
                    }
                }
                //remove under lever
                newSelectedTiles = newSelectedTiles.filter(t => t.quadKey.indexOf(tile.quadKey) !== 0);

                this.setState({tiles: newTiles, landsUpdated: true, selectedTiles: newSelectedTiles});
                this.props.addSelected(newSelectedTiles);
            }
        }
    }

    getLineAround([tileA, tileB]) {
        let arrLine = drawLine([tileA, tileB]);
        return arrLine && arrLine.length > 0 ? arrLine.map(tile => TileXYToQuadKey(tile.x, tile.y, 24)) : [];
    }

    tileMouseEnter(tileEnd, e) {
        //hiệu ứng hover
        if (this.state.zoom < LIMIT_ZOOM_SELECTED/* && this.props.user.role !== 'manager'*/) return; //don't click when lower zoom 22
        let tileStart = null;
        if (this.state.selectMode === "none") {
            tileStart = this.state.multiClearStart;
        } else if (this.state.selectMode === "line") {
            tileStart = this.state.multiSelectStart;
            if (tileStart) {
                let lineQuadKeys = this.getLineAround([{x: tileStart.x, y: tileStart.y}, {x: tileEnd.x, y: tileEnd.y}]);
                if (Array.isArray(lineQuadKeys) && lineQuadKeys.length > 0) {
                    let arrTmp = [];
                    [...this.state.tiles].map(t => {
                        let findQK = lineQuadKeys.find(lineQK => lineQK === t.quadKey);
                        if (findQK) {
                            t.selected = true;
                            arrTmp.push(t);
                        }
                        return t;
                    });

                    let newSelectedTiles = removeDuplicates([...arrTmp, ...this.state.selectedTiles], 'quadKey');
                    if (this.props.user.role === 'manager') {
                        newSelectedTiles = newSelectedTiles && newSelectedTiles.length > 0 && newSelectedTiles.filter(slTile => slTile.lands && slTile.lands.length > 0 && !slTile.lands.some(land => land.user));
                    }

                    const {zoom, bounds, lands} = this.state;
                    if (bounds && zoom) {
                        const tiles = this.drawTiles({zoom, bounds, lands, selectedTiles: newSelectedTiles});
                        this.setState({tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles});
                    }
                }
            }
        } else if (this.state.selectMode === "multi") {
            //nếu đang hover mà trạng thái chọn 1 vùng
            //set trạng thái selected true từ ô bắt đầu + ô đang hover ( vẽ hình vuông theo tọa độ x,y)
            tileStart = this.state.multiSelectStart;
            if (tileStart) {
                let arrTmp = [];
                [...this.state.tiles].map(t => {
                    if ((t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                        (t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileEnd.y && t.y >= tileStart.y) ||
                        (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileStart.y && t.y >= tileEnd.y) ||
                        (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileEnd.y && t.y >= tileStart.y)) {
                        t.selected = true;
                        arrTmp.push(t);
                    }
                    return t;
                });
                let newSelectedTiles = [];
                if (this.state.selectMode === "multi") {
                    //xóa các đất trùng nhau
                    newSelectedTiles = removeDuplicates([...arrTmp, ...this.state.selectedTiles], 'quadKey');
                    if (this.props.user.role === 'manager') {
                        newSelectedTiles = newSelectedTiles && newSelectedTiles.length > 0 && newSelectedTiles.filter(slTile => slTile.lands && slTile.lands.length > 0 && !slTile.lands.some(land => land.user));
                    }
                } else if (this.state.selectMode === "none") {
                    newSelectedTiles = [...this.state.selectedTiles].filter(slTile => !arrTmp.some(tmp => slTile.quadKey.indexOf(tmp.quadKey) === 0));
                }
                //setState vẽ lại lưới
                if (typeof this.state.bounds !== 'undefined' && !isNull(this.state.bounds)) {
                    const tiles = this.drawTiles({
                        zoom: this.state.zoom,
                        bounds: this.state.bounds,
                        lands: this.state.lands || [],
                        selectedTiles: newSelectedTiles,
                    });
                    this.setState({tiles: tiles, landsUpdated: false, multiSelectSave: newSelectedTiles});
                }
            }
        }
    }


    render() {
        const {lands,landInfo} = this.props;
        const check = !this.state.tiles || !this.state.tiles[0] || !this.state.bounds || !this.state.zoom;
        let tiles = this.state.tiles;


        if (this.state.multiSelectStart === null && this.state.multiClearStart === null && this.state.landsUpdated && !check) {
            tiles = this.drawTiles({
                zoom: this.state.zoom,
                bounds: this.state.bounds,
                lands: this.state.lands || [],
                selectedTiles: this.state.selectedTiles,
            });
        }
        this.props.checkLoadedTiles(tiles);

        return (
            <GoogleMap
                center={this.state.center}
                zoom={this.state.zoom}
                onGoogleApiLoaded={this._onGoogleApiLoaded}
                onChange={this._onChange}
                yesIWantToUseGoogleMapApiInternals
                options={{
                    fullscreenControl: false,
                    disableDoubleClickZoom: false,
                    //maxZoom: 20,
                    minZoom: 5,
                    keyboardShortcuts: false,
                }}>
                {tiles.map((item) => {
                    // console.log('item', item)
                    return <TileComponent
                        key={item.quadKey}
                        lat={item.latlng.lat}
                        lng={item.latlng.lng}
                        tile={item}
                        mainMap={this.state}
                        user={this.props.user}
                        myLands={this.props.myLands}
                        tileClick={() => this.tileClick(item)}
                        tileMouseEnter={() => this.tileMouseEnter(item)}
                        settingReducer={this.props.settingReducer}
                        isDragging={this.state.isDragging}
                        syncCenterMap={this.props.syncCenterMap}
                        getAllLandById={this.props.getAllLandById}
                        clearSelected={this.props.clearSelected}
                        selectMode={this.props.selectMode}
                        getLandInfo={this.props.getLandInfo}
                        landInfo={landInfo}
                    />;
                })}
                {lands && lands.landmarks && lands.landmarks.length > 0 && lands.landmarks.map((landmark, key) => {
                    return (
                        <MarkerLandMark
                            lat={landmark.center.lat}
                            lng={landmark.center.lng}
                            landmark={landmark}
                            key={key}/>
                    )
                })}
            </GoogleMap>
        );
    }
}

const mapStateToProps = (state) => {
    const {lands, authentication: {user}, map, alert, users, settingReducer, lands: {myLands, areaLand,landInfo}} = state;
    return {
        user, alert, lands, map, users, settingReducer, myLands , areaLand,landInfo
    };
};

const mapDispatchToProps = (dispatch) => ({
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    updateCenterMap: (center) => dispatch(mapActions.updateCenterMap(center)),
    addSelected: (multiSelectSave) => dispatch(mapActions.addSelected(multiSelectSave)),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandMap);

class TileComponent extends PureComponent {
    state = {};

    constructor(props) {
        super(props);
        this.state = {
            toolTipDisplay: false,
            top: 0
        }
    }

    createClassLandLower22 = (props) => {
        let cls = "";
        if (props.tile && props.tile.forbid) {
            cls += ' forbid';
        }
        const {tile: {canBuy, canNotBuy, totalCount, landmarkCount = 0}} = props;
        if (landmarkCount * 2 >= totalCount) {
            cls += ' landmark';
        } else {
            if (!has(props.tile, 'canBuy') || canBuy === totalCount) {
                cls += '';
            } else if (canNotBuy === totalCount) {
                cls += ' noSell';
            } else {
                cls += ' partial';
            }
        }
        return cls;
    }

    createClassLand = (props, {canBuy}) => {
        const {tile, tile: {lands, selected}, user} = props;
        let clsName = "";
        clsName += lands.reduce((clsName, land) => {
            if (land.user) {
                if (land.forbid) { //forbid by Admin
                    if (land.landmark) {
                        if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                    } else {
                        if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                    }
                } else {
                    if (land.user._id === user._id) { //is MyLand
                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' myLand myForSell') === -1) clsName += ' myLand myForSell';
                        } else {
                            if (clsName.indexOf(' myLand') === -1) clsName += ' myLand';
                        }
                    } else { //is other user
                        if (land.landmark) {
                            if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                        }

                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' forSell') === -1) clsName += ' forSell';
                        } else {
                            if (clsName.indexOf(' noSell') === -1) clsName += ' noSell';
                        }
                    }
                }
            } else { //forbid Area
                if (land.forbid) {
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                }
            }
            return clsName;
        }, '');

        if (canBuy > 0) {
            clsName = clsName.replace(/ myLand| noSell| forbid| partial/g, ' partial');
        }

        if (tile.waiting) {
            clsName += ' waiting';
        } else {
            if (clsName.indexOf(' forbid') !== -1) { //when has forbid land => disable selected
                clsName = clsName.replace(' selected', '');
            } else {
                clsName += selected ? " selected" : "";
            }
        }
        clsName += tile.isCenter ? ' center' : "";
        return clsName;
    };


    // tren tang 18
    createInfoLandLowerLv23(props) {
        const {tile: {totalCount, canBuy, canNotBuy, landmarkCount = 0}, settingReducer} = props;
        let infoHtml = '';
        const {landSetting} = settingReducer;
        if (landSetting && landSetting.showInfo) {
            infoHtml = has(props.tile, 'canBuy') ? (
                <div className='cell'>
                    <div>
                        <div className='cell-info' onMouseOver={() => this.setState({toolTipDisplay: true})}
                             onMouseLeave={() => this.setState({toolTipDisplay: false})}>
                            <span className='can-buy'>{canNotBuy > totalCount ? totalCount : canNotBuy} /&nbsp; </span>
                            <span className='total-count'>{totalCount}</span>
                            {
                                this.state.toolTipDisplay
                                &&
                                <span className="tooltiptext">
                                    <div>
                                        <div><TranslateLanguage direct={'land.tooltip.total'}/>: {totalCount}</div>
                                        <div><TranslateLanguage
                                            direct={'land.tooltip.landmarkCount'}/>: {landmarkCount > totalCount ? totalCount : landmarkCount}</div>
                                        <div><TranslateLanguage
                                            direct={'land.tooltip.canBuy'}/>: {canBuy < 0 ? 0 : canBuy} </div>
                                        <div><TranslateLanguage
                                            direct={'land.tooltip.canNotBuy'}/>: {canNotBuy > totalCount ? totalCount : canNotBuy} </div>
                                    </div>
                                </span>
                            }
                        </div>
                    </div>
                </div>
            ) : ''
        }
        return infoHtml;
    }


    onHandleShowLandCertificate = () => {
        const {tile: {quadKey}} = this.props;
        this.props.getLandInfo(quadKey);
        this.setState({
            isOpenLandCertificate: true
        });
    };
    onHandleHideLandCertificate = () => {
        this.onHandleMouseLeave();
        this.props.clearSelected();
        this.props.selectMode(1);
        this.setState({
            isOpenLandCertificate: false

        });
    };

    onHandleShowCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: true
        })
    };
    onHandleHideCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: false,
            toggleCertification: false
        })
    };
    onHandleMouseOver = (tile) => {
        const {lands} = tile;
        if (lands && lands[0] && lands[0].user !== null ) {
            if (lands[0].forbid === false && lands[0].landmark === false) {
                this.setState({
                    toggleCertification: true
                })
            }
        }
    };
    onHandleMouseLeave = () => {
        this.setState({toggleCertification: false})
    };

    render() {

        const {mainMap, tile: {lat, lng, quadKey, lands, totalCount}, tile, tileClick, tileMouseEnter, user, syncCenterMap, landInfo} = this.props;
        const {toggleCertification, isOpenLandCertificate, isOpenCertificateImage} = this.state;
        let clsName = '';
        let infoHtml = '';

        if (mainMap.zoom !== 22) {
            infoHtml = this.createInfoLandLowerLv23(this.props);
            clsName = this.createClassLandLower22(this.props);
        } else {
            let otherLand = lands && lands.length > 0 && lands.reduce((otherLand, land) => {
                if (land.user) {
                    if (land.user._id === user._id)
                        otherLand.myLand += land.landCount;
                    else {
                        if (land.forSaleStatus === true)
                            otherLand.forSale += land.landCount;
                        else
                            otherLand.noSell += land.landCount;
                    }
                } else if (land.forbid) {
                    otherLand.forbid += land.landCount;
                }
                return otherLand;
            }, {noSell: 0, forSale: 0, forbid: 0, myLand: 0});

            // làm lại chỗ này no sell === ko có tại zoom khác 22
            const {noSell, forSale, forbid, myLand} = otherLand;
            const empty = totalCount - (noSell + forSale + forbid + myLand);
            const canBuy = forSale + empty ? forSale + empty : '';
            const canNotBuy = myLand + noSell ? myLand + noSell : '';
            clsName = this.createClassLand(this.props, {canBuy, canNotBuy})
        }
        return (
            <div id={quadKey} className={'tile-n' + clsName} onClick={() => tileClick()}
                 onMouseOver={() => this.onHandleMouseOver(tile)}
                 onMouseLeave={() => this.onHandleMouseLeave()}
                 onMouseEnter={(e) => tileMouseEnter(e)} data-lat={lat} data-lng={lng}>
                {toggleCertification && <div className="toggle-land-button-container">
                    <div className='toggle-land-button' onClick={() => this.onHandleShowLandCertificate()}>
                        <img src={toggleLandIcon} alt=''/>
                    </div>

                </div>}
                {isOpenLandCertificate && landCertificationPopup(isOpenLandCertificate,landInfo,user,syncCenterMap, this.onHandleHideLandCertificate, this.onHandleShowCertificateImage)}
                {isOpenCertificateImage && getCertificateAlertPopup(isOpenCertificateImage, tile, this.onHandleHideCertificateImage, user, landInfo)}
                {/*show info land when other user sell 4 cell below*/}
                {infoHtml}
                {/*((clsName.indexOf('partial') !== -1 || clsName.indexOf('noSell') !== -1 || clsName.indexOf('myLand') !== -1 || clsName.indexOf('myForSell') !== -1) || clsName.indexOf('landmark') !== -1) && infoHtml*/}

                {clsName.indexOf('center') !== -1 ? <div className='centick'/> : null}
                {(clsName.indexOf('myForSell') !== -1 && clsName.indexOf('myLand') === -1) || clsName.indexOf('forSell') !== -1 ?
                    <div className='fs-cont'>
                        {<img src={loadingImage('/images/bloodland-ui/forsale1.svg')} alt='' style={{width: '45px'}}/>}
                        {/* <div className="fs-img"/>
                        <div className='fs-title'> for sale</div> */}
                    </div>
                    : ''
                }
                {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') === -1 ?
                    <div className='ml-cont'>
                        {<img src={loadingImage('/images/bloodland-ui/myland1.svg')} alt='' style={{width: '45px'}}/>}
                        {/* <div className="ml-img"/> */}
                        {/* <div className='ml-title'> my land</div> */}
                    </div>
                    : ''
                }
                {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') !== -1 ?
                    <div className='fl-cont' style={{marginTop: '22px'}}>
                        <div className='fs-cont'>
                            {<img src={loadingImage('/images/bloodland-ui/forsale1.svg')} alt=''
                                  style={{width: '45px'}}/>}
                        </div>
                        <div className='ml-cont'>
                            {<img src={loadingImage('/images/bloodland-ui/myland1.svg')} alt=''
                                  style={{width: '45px'}}/>}
                        </div>
                    </div> : ''
                }
            </div>
        )
    }
}

class MarkerLandMark extends PureComponent {
    render() {
        return (
            <div className='landmark-marker-container'>
                <div className='landmark-name'>{this.props.landmark && this.props.landmark.name}</div>
                <div className="marker-landmark">
                    <div className="marker-landmark-plus"/>
                </div>
            </div>
        )
    }
}
