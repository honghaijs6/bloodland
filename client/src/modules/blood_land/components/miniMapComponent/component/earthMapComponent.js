import React, {Fragment, PureComponent} from "react";
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {loadModules} from "esri-loader";

import {loadingImage} from "../../general/System";
const galaxyStarFieldImg = loadingImage('/images/mini-map/galaxy_starfield.png')
class EarthMapComponent extends PureComponent {

    state = {loading: true};

    showCoordinates = (e, view, webMercatorUtils) => {
        e.stopPropagation();
        let point = view.toMap({x: e.x, y: e.y});
        //the map is in web mercator but display coordinates in geographic (lat, long)
        if (point !== null) {
            let mp = webMercatorUtils.webMercatorToGeographic(point);
            let data = {
                lat: Number(mp.y.toFixed(14)),
                lng: Number(mp.x.toFixed(14))
            };
            this.props.syncCenterMap(data, null, null, true);
        }


    };


    loading = () => {
        loadModules(['esri/config'], {
            url: 'https://js.arcgis.com/4.9/',
            css: 'https://js.arcgis.com/4.9/esri/css/main.css'
        }).then(([esriConfig]) => {
            esriConfig.request.useIdentity = false;
            loadModules([
                "esri/Map",
                "esri/views/SceneView",
                "esri/layers/VectorTileLayer",
                "esri/geometry/support/webMercatorUtils",
                "dojo/dom",])
                .then(([Map, SceneView, VectorTileLayer, webMercatorUtils]) => {
                    let map = new Map();
                    const vtLayer = new VectorTileLayer({
                        style: {
                            "layers": [{
                                "layout": {},
                                "paint": {
                                    "fill-color": "#F0ECDB",
                                },
                                "source": "esri",
                                "minzoom": 0,
                                "source-layer": "Land",
                                "type": "fill",
                                "id": "Land/0"
                            },
                                {
                                    "layout": {},
                                    "paint": {
                                        "fill-pattern": "Landpattern",
                                        "fill-opacity": 0.25
                                    },
                                    "source": "esri",
                                    "minzoom": 0,
                                    "source-layer": "Land",
                                    "type": "fill",
                                    "id": "Land/1"
                                },
                                {
                                    "layout": {},
                                    "paint": {
                                        "fill-color": "#93CFC7"
                                    },
                                    "source": "esri",
                                    "minzoom": 0,
                                    "source-layer": "Marine area",
                                    "type": "fill",
                                    "id": "Marine area/1"
                                },
                                {
                                    "layout": {},
                                    "paint": {
                                        "fill-pattern": "Marine area",
                                        "fill-opacity": 0.08
                                    },
                                    "source": "esri",
                                    "source-layer": "Marine area",
                                    "type": "fill",
                                    "id": "Marine area/2"
                                },
                                {
                                    "layout": {
                                        "line-cap": "round",
                                        "line-join": "round"
                                    },
                                    "paint": {
                                        "line-color": "#cccccc",
                                        "line-dasharray": [
                                            7, 5.33333
                                        ],
                                        "line-width": 1
                                    },
                                    "source": "esri",
                                    "minzoom": 1,
                                    "source-layer": "Boundary line",
                                    "type": "line",
                                    "id": "Boundary line/Admin0/0"
                                },
                                {
                                    "layout": {
                                        "text-font": [
                                            "Risque Regular"
                                        ],
                                        "text-anchor": "center",
                                        "text-field": "{_name_global}",
                                    },
                                    "paint": {
                                        "text-halo-blur": 1,
                                        "text-color": "#AF420A",
                                        "text-halo-width": 1,
                                        "text-halo-color": "#f0efec"
                                    },
                                    "source": "esri",
                                    "source-layer": "Continent",
                                    "type": "symbol",
                                    "id": "Continent"
                                },
                                {
                                    "layout": {
                                        "text-font": [
                                            "Atomic Age Regular"
                                        ],
                                        "text-field": "{_name}",
                                    },
                                    "paint": {
                                        "text-halo-blur": 1,
                                        "text-color": "#AF420A",
                                        "text-halo-width": 1,
                                        "text-halo-color": "#f0efec"
                                    },
                                    "source": "esri",
                                    "minzoom": 2,
                                    "source-layer": "Admin0 point",
                                    "maxzoom": 10,
                                    "type": "symbol",
                                    "id": "Admin0 point/large"
                                }],
                            "glyphs": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
                            "version": 8,
                            "sprite": "https://www.arcgis.com/sharing/rest/content/items/7675d44bb1e4428aa2c30a9b68f97822/resources/sprites/sprite",
                            "sources": {
                                "esri": {
                                    "url": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer",
                                    "type": "vector"
                                }
                            }
                        }
                    });
                    map.add(vtLayer);
                    let view = new SceneView({
                        container: "viewDiv",
                        map: map,
                        alphaCompositingEnabled: true,
                        environment: {
                            // set a transparent background
                            background: {
                                type: "color",
                                color: [255, 252, 244, 0]
                            }
                        },
                        zoom: 1,
                        constraints: {
                            altitude: {
                                min: 800000,
                                max: 25000000
                            }
                        },
                        padding: {
                            top: 30
                        },
                        center: [-122.4443, 47.2529]
                        // center: [center.lat, center.lng]
                    });

                    view.when(() => {
                        setTimeout(() => {
                            this.setState({
                                loading: false
                            });
                        }, 2500);

                        //after map loads, connect to listen to mouse move & drag events
                        view.on("click", (e) => this.showCoordinates(e, view, webMercatorUtils));
                    });
                })

        }).catch(err => {
            this.setState({
                mapLoaded: true,
                error: err.message || err
            })
        })
    };

    componentDidMount() {
        this.loading();
    }
    render() {
        const {loading} = this.state;
        return (
            <div className='earth-style'>
                 <Fragment>
                    {loading ? <div className='loading-miniMap'>
                            <div className="lds-ripple">
                                <div/>
                                <div/>
                            </div>
                        </div>: <img className='galaxyStarFieldImg' src={galaxyStarFieldImg} alt="space"/>}
                    <div id='viewDiv'/>
                </Fragment>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    map: state.map,
});
const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey, centerChange) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey, centerChange)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EarthMapComponent)