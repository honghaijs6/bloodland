import React, {Component, Fragment , memo} from 'react';
import {translate} from 'react-i18next';
import connect from "react-redux/es/connect/connect";
import MultipleMap from "../blood_land/components/general/MultipleMap";
import {settingActions} from "../../store/actions/commonActions/settingActions";
import ReactHowler from 'react-howler'
import config from '../../helpers/config';
import {alertPopup, getChromeDetectAlert, getTokenErrorAlert, getWIdExistAlert} from "./alertPopup";
import {landActions} from "../../store/actions/landActions/landActions";
import {shopsActions} from "../../store/actions/gameActions/shopsActions";

// update: 22/3/1019
// by Minh Tri - refactor code
// update: 8/6/1019
// by Minh Tri - refactor code


const SoundHowlerComponent = memo((props) => {
    const {setting:{bgMusic} , sound: {mp3} } = props;
    return (
        <Fragment>
            {!bgMusic ? null : bgMusic.turnOn && <ReactHowler
                src={mp3}
                playing={true}
                volume={bgMusic.volume / 100}
            />}
        </Fragment>
    )
});


class BloodLand extends Component {
    constructor(props) {
        super(props);
        this.checkBrowser();
        props.getDefault();
        props.getSetting(props.user._id);
        this.state = {
            currentPopup: alertPopup.noPopup
        };
    }

    checkBrowser = () => {
        if (navigator.userAgent.indexOf("Chrome") === -1) {
            this.setState({
                currentPopup: alertPopup.chromeDetectedAlert
            })
        }
    };

    componentDidMount() {
        const {user: {wId}} = this.props;
        if (!config.devMode) {
            if (!wId || wId === '') {
                this.setState({
                    currentPopup: alertPopup.wIdAlert
                })
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        //console.log('componentWillReceiveProps', nextProps);
        const {tokenError, user: {wId}} = nextProps;
        if (!config.devMode) {
            //console.log('!config.devMode')
            if (!wId || wId === '') {
                console.log("!wId || wId === ''")
                this.setState({
                    wIdExistAlert: alertPopup.wIdAlert
                })
            }
        }
        if (tokenError) {
            this.setState({
                currentPopup: alertPopup.tokenErrorAlert,
            })
        }
    }


    handleShowPopup = () => {
        const {currentPopup} = this.state;
        const chromeDetectedAlertStatus = currentPopup === alertPopup.chromeDetectedAlert;
        const wIdAlertStatus = currentPopup === alertPopup.wIdAlert;
        const tokenErrorAlertStatus = currentPopup === alertPopup.tokenErrorAlert;
        return (
            <Fragment>
                {chromeDetectedAlertStatus && getChromeDetectAlert(chromeDetectedAlertStatus)}
                {wIdAlertStatus && !config.devMode && getWIdExistAlert(wIdAlertStatus)}
                {tokenErrorAlertStatus && getTokenErrorAlert(tokenErrorAlertStatus)}
            </Fragment>
        )
    };

    render() {
        const {settingReducer} = this.props;
        const {currentPopup} = this.state;

        const checkDisplay = currentPopup === alertPopup.noPopup;
        return (
            <Fragment>
                {<MultipleMap checkDisplay={checkDisplay}/>}
                {settingReducer && <SoundHowlerComponent
                    setting={this.props.settingReducer.bgMusic}
                    sound={`${process.env.PUBLIC_URL}/sounds/bg3.mp3`}
                    playing={true}
                />}
                {this.handleShowPopup()}
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, alert, lands, authentication: {user}, alert: {tokenError}} = state;
    return {
        settingReducer,
        lands,
        user,
        alert,
        tokenError
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSetting: (userId) => dispatch(settingActions.getSetting({userId})),
    getDefault: () => dispatch(landActions.getDefault()),
    getAllLandMarkCategoryInMap: () => dispatch(landActions.getAllLandMarkCategoryInMap()),
    onHandleGetShop: () => dispatch(shopsActions.getShop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(BloodLand));






