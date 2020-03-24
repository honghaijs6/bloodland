import React, {Component, PureComponent} from 'react';
import GoogleMap from 'google-map-react';
import connect from "react-redux/es/connect/connect";
import { mapActions } from "../../../../../store/actions/commonActions/mapActions";

class NormalMapComponent extends Component {


	constructor(props) {
		super(props);
		this.state = {
			dataMap: this.props.dataMap,
			locationPin: {
				lat: 37.566535,
				lng: 126.9779692
			}
		}
	}

	_onChange = ({ center, zoom, size, bounds}) => {
		this.setState({ center: center, pinLeft: 0, pinTop: 0 });
	};

	componentDidUpdate(prevProps){
		const {map:{center}} = this.props;
		if(center && center !== prevProps.map.center){
			this.setState({ center });
		}
	}

	_onGoogleApiLoaded = ({map, maps}) => {
		this.setState({ map, maps });
		maps.event.addListener(map, 'bounds_changed', () => {
			// this.changePin(map, maps);
		});
        maps.event.addListener(map, 'click', (e) => {
            const center = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
			this.setState({
				locationPin: center
			});
            this.props.syncCenter(center, null, null, true);

        });
	};


	render() {
		const {dataMap:{zoom, mapOptions} } = this.state;
		const {map: {center}} = this.props;
		return (
			<GoogleMap
				center={center}
				zoom={zoom}
                options={mapOptions}
				onGoogleApiLoaded={this._onGoogleApiLoaded}
				onChange={this._onChange}
				yesIWantToUseGoogleMapApiInternals={true}
			>
				{center && <MinimapRender className={"minimap pin"} lat={center.lat} lng={center.lng}/>}
			</GoogleMap>
		);
	}
}

const mapStateToProps = (state) => ({
    map: state.map,
});
const mapDispatchToProps = (dispatch) => ({
    syncCenter: (center, zoom, centerQuadKey, centerChange) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey, centerChange))
});
export default connect(mapStateToProps , mapDispatchToProps)(NormalMapComponent);


class MinimapRender extends PureComponent{
	render() {
		const {className} = this.props;
		return(
			<div className={className}/>
		)
	}
}