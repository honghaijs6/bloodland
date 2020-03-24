import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import LandTradingHistory from './LandTradingHistory';
import LandInfo from './LandInfo';

import {landActions} from "../../../../../store/actions/landActions/landActions";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import GameUICommon from '../Common/IdentityCard';
import LandPurchasePopup from './LandPurchasePopup';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from './../../general/Tooltip';
import { LazyImage } from 'react-lazy-images';

class LandTrading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            currentDropdownItem: this.dropdownValue.noDropdown,
            selectedTiles: [],
            checkAll: false,
            landItems: [],
            calculatorBuyLand: {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: 0,
                myBloodAfterBuy: 0,
            },
            buying: false,
            isAdmin: false,
        };
    }

    screen = {
        default: "default",
        LandTradingHistory: "LandTradingHistory",
        landInfo: "landInfo",
        adminForbidLand: "adminForbidLand",
    };

    popupScreen = {
        noPopup: "noPopup",
        landPurchase: "landPurchase",
    };

    alertPopupScreen = {
        noPopup: "noPopup",
        deletedLandAlert: "deletedLandAlert",
        purchaseLandConfirmAlert: "purchaseLandConfirmAlert",
        waitingAlert: "waitingAlert",
        successAlert: "successAlert",
        errorAlert: "errorAlert",
        noLandAlert: "noLandAlert",
        addCartAlert: "addCartAlert",
        addCartSuccessAlert: "addCartSuccessAlert",
        tooManyLandAlert: "tooManyLandAlert",
    };

    dropdownValue = {
        noDropdown: "noDropdown",
        myCart: "myCart",
    };

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modalPopup: true
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modalPopup: false
        });
    };

    handleDropdown = (item) => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            currentDropdownItem: item === this.state.currentDropdownItem ? this.dropdownValue.noDropdown : item,
        });
    };


    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            modalAlertPopup: false,
        });
    };



    getActiveAlertPopupClass = (popupScreen) => {
        return classNames({
            'active': popupScreen === this.state.currentAlertPopUp
        });
    };


    getActivePopupClass = (popupScreen) => {
        return classNames({
            'active': popupScreen === this.state.currentPopupScreen
        });
    };

    loadingImg = (ref) => {
        return (
            <div ref={ref} className="lds-ellipsis img-loading">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };

    getDefaultScreen = () => {
        return (
            <ul className='function-menu'>
                <GameUICommon />
                <li className={this.getActivePopupClass(this.popupScreen.LandPurchase)}
                        onClick={() => this.handleShowPopup(this.popupScreen.LandPurchase)}>
                    <LazyImage src={loadingImage('/images/game-ui/tab4/nav1.svg')}
                            placeholder={({ imageProps, ref }) => (
                                this.loadingImg(ref)
                            )}
                            actual={({ imageProps }) => <img {...imageProps}  alt="buyLand" />} />
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand'}/>
                    </div>
                    <Tooltip nameLang={'menuTab.transaction.buyLand.toolTip.name'} descLang={'menuTab.transaction.buyLand.toolTip.desc'} />
                </li>
                <li onClick={() => this.handleChangeScreen(this.screen.landInfo)}>
                    <LazyImage src={loadingImage('/images/game-ui/tab4/nav3.svg')}
                            placeholder={({ imageProps, ref }) => (
                                this.loadingImg(ref)
                            )}
                            actual={({ imageProps }) => <img {...imageProps}  alt="viewLand" />} />
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.viewLand'}/>
                    </div>
                    <Tooltip nameLang={'menuTab.transaction.viewLand.toolTip.name'} descLang={'menuTab.transaction.viewLand.toolTip.desc'} />
                </li>
                <li onClick={() => this.handleChangeScreen(this.screen.LandTradingHistory)}>
                    <LazyImage src={loadingImage('/images/game-ui/tab4/nav4.svg')}
                            placeholder={({ imageProps, ref }) => (
                                this.loadingImg(ref)
                            )}
                            actual={({ imageProps }) => <img {...imageProps}  alt="history" />} />
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.history'}/>
                    </div>
                    <Tooltip nameLang={'menuTab.transaction.history.toolTip.name'} descLang={'menuTab.transaction.history.toolTip.desc'} />
                </li>
            </ul>
        );
    };

    getScreenByValue = (value) => {
        switch (value) {
            case this.screen.landInfo:
                return <LandInfo handleChangeScreen={this.handleChangeScreen}
                    selectedTiles={this.props.selectedTiles} />;
            case this.screen.LandTradingHistory:
                return <LandTradingHistory handleChangeScreen={this.handleChangeScreen} />;
            default:
                return '';
        }
    };


    render() {

        const modalPopup = this.getModalPopup();
        return (
                <Fragment>
                    {this.screen.default === this.state.currentScreen && this.getDefaultScreen()}
                    {this.screen.landInfo === this.state.currentScreen && this.getScreenByValue(this.screen.landInfo)}
                    {this.screen.LandTradingHistory === this.state.currentScreen && this.getScreenByValue(this.screen.LandTradingHistory)}
                    {this.screen.adminForbidLand === this.state.currentScreen && this.setAdmin()}
                    {modalPopup}
                </Fragment>

            )

    }

    setAdmin() {
        this.setState({ isAdmin: true });
        this.getDefaultScreen();
    }

    getModalPopup = () => {
        const {modalPopup} = this.state
        return modalPopup  &&  <LandPurchasePopup handleShowPopup={this.handleShowPopup} handleHidePopup={this.handleHidePopup} modalPopup={modalPopup} selectedTiles={this.props.map.selected} />
    };
}

function mapStateToProps(state) {
    const { lands, authentication: { user }, map, users } = state;
    return {
        user,
        lands,
        map,
        users,

    };
}

const mapDispatchToProps = (dispatch) => ({
    addLandToCart: (lands) => dispatch(mapActions.addLandToCart(lands)),
    transferBloodTradingLand: (objTranfer) => dispatch(socketActions.transferBloodTradingLand(objTranfer)),
    clearBloodPurchase: () => dispatch(userActions.clearBloodPurchase()),
    transferBlood: (objTransfer) => dispatch(userActions.transferBlood(objTransfer)),
    transferBloodTrading: (objTransfer) => dispatch(userActions.transferBloodTrading(objTransfer)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LandTrading)
