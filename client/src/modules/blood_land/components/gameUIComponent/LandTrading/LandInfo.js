import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {calculatorLand, landCanBuy} from "../../landMapComponent/component/MapFunction";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import isEqual from "lodash.isequal";
import uniqBy from "lodash.uniqby";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from "../../general/Tooltip";

class LandInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            sendMailModal: false,
        };
    }

    screen = {
        default: 'default'
    };

    popupScreen = {
        noPopup: 'noPopup',
        sendMail: 'sendMail',
    };

    alertPopupScreen = {
        noPopup: 'noPopup',
        sendMailSuccessAlert: 'sendMailSuccessAlert',
        sendMailErrorAlert: 'sendMailErrorAlert',
        sendMailCancelAlert: 'sendMailCancelAlert',
        addFriendAlert: 'addFriendAlert',
        addFriendSuccessAlert: 'addFriendSuccessAlert',
        addFriendFailureAlert: 'addFriendFailureAlert',
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
            modalPopup: true,
            sendMailPopup: true
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modalPopup: false
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

    componentDidMount() {
        let {selected} = this.props;
        this.requestUserInfo(selected);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {selected} = this.props;
        if (Array.isArray(selected) && !isEqual(selected, prevProps.selected)) {
            this.requestUserInfo(selected);
        }
    }

    requestUserInfo = (selectedTiles) => {
        if (Array.isArray(selectedTiles) && selectedTiles.length) {
            let arrUserIdSelected = selectedTiles.reduce((arrUserIdSelected, tile) => {
                if (tile.lands && tile.lands.length > 0) {
                    let arrUserId = tile.lands.reduce((arrUserId, land) => {
                        if (land.user !== null) {
                            arrUserId.push(land.user._id);
                        }
                        return arrUserId;
                    }, []);
                    arrUserIdSelected = arrUserIdSelected.concat(arrUserId);
                }
                return arrUserIdSelected;
            }, []);
            let arrUser = uniqBy(arrUserIdSelected);// removeDuplicates(arrUserSelected, '_id');
            arrUser.length === 1 ? this.props.getById(arrUser[0]) : this.props.clearUserInfo();
        }
        return null;
    };

    PREVIOUS_SCREEN = 0;

    handleHideSendMailPopup = () => {
        this.setState({
            sendMailModal: false,
        });
    };

    //Calculate land can buy
    onCalculateTotalBlood = (selected) => {
        let totalBlood = 0;
        if (selected) {
            selected.map(land => {
                if (!land.lands[0].user || land.lands[0].forSaleStatus) {
                    totalBlood += land.lands[0].sellPrice;
                }
                return land
            })
        }
        return totalBlood
    };
    getDefaultScreen = () => {
        const {user, selected} = this.props;
        const totalSelected = selected && selected.reduce((total, tile) => total + calculatorLand(tile.quadKey.length), 0);
        let arrQuadkey = landCanBuy(selected, user, this.props.lands.defaultLandPrice);
        const canBuy = arrQuadkey && arrQuadkey.reduce((totalLand, land) => totalLand + calculatorLand(land && land.quadKey.length), 0);
        const allQuadkey = selected && selected.map(slTile => slTile.quadKey);
        const totalBlood = this.onCalculateTotalBlood(selected);
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src='/images/bloodland-ui/nav-4-landTrade-item-3-info.png' alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.title'}/>
                    </div>
                </div>
                {!selected || (selected && selected.length === 0) ?
                    <Fragment>
                        <div className='screen-content-error'>
                            <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                                <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.noInformation'}/>
                            </div>
                        </div>
                        <div className='action-group'>
                            <button onClick={() => this.props.handleChangeScreen('default')}>
                                <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                                <div>
                                    <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.backBtn'}/>
                                    <Tooltip descLang={'menuTab.transaction.viewLand.toolTip.backBtn'}/>
                                </div>
                            </button>
                        </div>
                    </Fragment>: 
                    <Fragment>
                        <div className='screen-content-3' style={{height: '641px', padding: '6px'}}>
                            <div className='text-center'>
                                    <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.landInfo'}/>
                            </div>
                            <div className="break-x break-margin-15" style={{margin: '5px 2px 15px 2px'}}/>
                            <div className='land-info-blood-tranfer custom-list'>
                                <div className='item custom-spacing-14px'>
                                    <div className='label-edit float-left'>
                                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.landNumber'}/>
                                    </div>
                                    <div className='editor  custom-content'>
                                        {totalSelected ? totalSelected : 0}
                                    </div>
                                </div>

                                <div className='item custom-spacing-14px'>
                                    <div className='label-edit float-left'>
                                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.landNumberAvailable'}/>
                                    </div>
                                    <div className='editor  custom-content'>
                                        {canBuy ? canBuy : 0}
                                    </div>
                                </div>

                                <div className='item custom-spacing-14px'>
                                    <div className='label-edit float-left'>
                                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.landNumberUnAvailable'}/>
                                    </div>
                                    <div className='editor  custom-content'>
                                        {canBuy || totalSelected ? totalSelected - canBuy : 0}
                                    </div>
                                </div>

                                <div className='item custom-spacing-14px'>
                                    <div className='label-edit float-left'>
                                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.totalBlood'}/>
                                    </div>
                                    <div className='editor  custom-content'>
                                        {totalBlood ? totalBlood : 0} Blood
                                    </div>
                                </div>
                            </div>
                            <div className='break-x break-no-bg break-margin-5'/>
                            <div className='land-info-blood-tranfer text-center'>
                                        <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.bloodInformation'}/>
                                <div className='break-x break-no-bg break-margin-5'/>
                                {allQuadkey && allQuadkey.map(qk => {
                                    return qk + '\n'
                                })}
                            </div>
                        </div>
                        <div className='action-group'>
                            <button onClick={() => this.props.handleChangeScreen('default')}>
                                <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                                <div>
                                    <TranslateLanguage direct={'menuTab.transaction.viewLand.getDefaultScreen.backBtn'}/>
                                </div>
                            </button>
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    };

    render() {
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen && this.getDefaultScreen()}
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const {lands, authentication: {user}, map: {selected}} = state;
    const {userInfo} = state.users;
    return {
        lands,
        user,
        userInfo,
        selected
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearUserInfo: () => dispatch(userActions.clearUserInfo()),
    addFriend: (userId, friendList) => dispatch(userActions.addFriend({userId, friendList})),
    getById: (userId) => dispatch(userActions.getById(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandInfo);