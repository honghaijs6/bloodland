import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {translate} from "react-i18next";
import {onHandleTranslate} from "../../../../../helpers/Common";
import MatGeocoder from 'react-mui-mapbox-geocoder'
import $ from 'jquery'


const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNqeDMxeHk4ZzA3b3gzenFyMWN4dGZwcW4ifQ.LG2ySlTvT5xl5QLj15uXzA'

class SearchBarComponent extends PureComponent {
    state = {};


    _goToGeocoderResult = (result) => {
        const data = {
            lat: result.center[1],
            lng: result.center[0]
        };
        this.props.syncCenter(data);
        this.props.syncEarth(data)
        // console.log('result', result)
    };

    onHandleSuccess = (result) => {

        if (result.length !== 0) {
            const resultSuggest = result[0].feature;
            const data = {
                lat: resultSuggest.center[1],
                lng: resultSuggest.center[0]
            };
            this.setState({data});
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {
        $('#search-field').focusin(() => {
            $(document).keypress((e) => {
                if (e.which === 13) {
                    this.props.syncCenter(this.state.data);
                    this.props.syncEarth(this.state.data)
                }
            })
        })
    }

    render() {
        const {t, settingReducer: {language}, lng} = this.props;
        return (
            <div className='search-field' id={'search-field'}>
                <MatGeocoder
                    inputPlaceholder={onHandleTranslate(t, "searchTab.searchLocation", language, lng)}
                    accessToken={MAPBOX_TOKEN}
                    onSelect={result => this._goToGeocoderResult(result)}
                    showLoader={false}
                    onSuggest={result => this.onHandleSuccess(result)}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {settingReducer} = state;
    return {
        settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    syncCenter: (center) => dispatch(mapActions.syncCenterMap(center)),
    syncEarth: (data) => dispatch(mapActions.updateMap(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(SearchBarComponent))