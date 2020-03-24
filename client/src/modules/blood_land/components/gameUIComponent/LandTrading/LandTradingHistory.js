import React, {Fragment, Component} from 'react';
//import isEqual from "lodash.isequal";
//import sortBy from "lodash.sortby";
import connect from "react-redux/es/connect/connect";
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import {calculatorLand} from '../../landMapComponent/component/MapFunction';
import {loadingImage,QuadKeyToLatLong} from "../../general/System";
import moment from "moment";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from "../../general/Tooltip";
import MessageBox from '../../general/MessageBox';
import classNames from 'classnames';
import _ from 'lodash';


const listViewMode = {
    all: {name: <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.all'}/>, val: 'all'},
    purchase: {name: <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.purchase'}/>, val: 'purchase'},
    sell: {name: <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.sale'}/>, val: 'sell'}
}

class LandTradingHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            selectAll: false,
            histories: undefined,
            viewMode: listViewMode.all,
            selectViewHistories: undefined,
            deleting: false,
            loadHistory: true
        };
    }

  

    componentDidMount() {
        this.props.getAllHistoryTradingLandById(this.props.user._id);
    }

    componentDidUpdate(prevProps, prevState) {
        //Delete History
        const {isOwnDeleteHistory} = this.props.lands;
        if (isOwnDeleteHistory && this.state.deleting === true) {
            this.handleHideAlertPopup();
            this.props.clearRemoveHistoryTradingLandStatus();
            //refresh
            this.props.getAllHistoryTradingLandById(this.props.user._id);
            this.setState({deleting: false});
        }

        //update history
        const {histories} = this.props.lands;
        const { viewMode, loadHistory } = this.state;
        if ((viewMode && prevState.viewMode && viewMode.val !== prevState.viewMode.val) || (histories && prevState.histories && !_.isEqual(histories, prevState.histories)) || loadHistory) {
            const {user} = this.props;
            if(Array.isArray(histories)){

                let [buyer, seller] = _.partition(histories, { buyer: user._id, buyerDeleted: false });
                const historyType = {
                    purchase: buyer,
                    sell: seller,
                    all: histories
                }

                const selectViewHistories = historyType[viewMode.val].map(history => {
                    history.landNumber = calculatorLand(history.quadKey.length);
                    history.simpleDateTrading = moment(history.dateTrading).format("DD/MM/YY");
                    return {checked: false, history: history};
                })//.sort((a, b) => new Date(b.history.simpleDateTrading) - new Date(a.history.dateTrading));

                this.setState({histories, selectViewHistories, viewMode, loadHistory: false});
            }
        }
    }


    screen = {
        default: 'default'
    };

    alertPopupScreen = {
        noPopup: 'noPopup',
        deleteConfirmAlert: 'deleteConfirmAlert',
        noSelectedAlert: 'noSelectedAlert'
    };

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
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
    
    moveToLand = (land) => {
        const {map} = this.props;
        if (map && map.zoom === 22) {
            const center = QuadKeyToLatLong(land.quadKey);
            // console.log('moveToLand', center);
            this.props.syncCenterMap(center, land.quadKey.length - 2, land.quadKey);
        } else {
            const center = QuadKeyToLatLong(land.quadKey);
            // console.log('moveToLand', center);
            this.props.syncCenterMap(center);
        }
    };

    checkedAllHistory = () => {
        let newSelectViewHistories = [...this.state.selectViewHistories];
        if (this.state.selectAll === true) {
            newSelectViewHistories = newSelectViewHistories.map(nltr => {
                nltr.checked = false;
                return nltr;
            });
            this.setState({selectAll: false, landsTrading: newSelectViewHistories});
        } else {
            newSelectViewHistories = newSelectViewHistories.map(nltr => {
                nltr.checked = true;
                return nltr;
            });
            this.setState({selectAll: true, landsTrading: newSelectViewHistories});
        }
    };

    checkedOneHistory = (historyItem) => {
        let newSelectViewHistories = [...this.state.selectViewHistories];
        if (historyItem.checked) {
            const index = newSelectViewHistories.findIndex(ltr => ltr.history._id === historyItem.history._id);
            newSelectViewHistories[index].checked = false;
        } else {
            const index = newSelectViewHistories.findIndex(ltr => ltr.history._id === historyItem.history._id);
            newSelectViewHistories[index].checked = true;
        }
        const checkedItem = newSelectViewHistories.filter(historyItem => historyItem.checked);
        this.setState({
            selectViewHistories: newSelectViewHistories,
            selectAll: checkedItem.length === newSelectViewHistories.length
        });
    };

    // filterHistories
    clickChangeFilterMode = (viewMode) => {
        this.setState({ viewMode, selectAll: false });
    };

    checkSelectionBeforeDeleting = (selectViewHistories) => {
        //console.log('checkSelectionBeforeDeleting', selectViewHistories);
        const deleteHistories = Array.isArray(selectViewHistories) ? selectViewHistories.filter(history => history.checked) : [];
        //no select land
        if(deleteHistories.length === 0) return this.handleShowAlertPopup(this.alertPopupScreen.noSelectedAlert);
        this.handleShowAlertPopup(this.alertPopupScreen.deleteConfirmAlert);
    }

    getNoInfoView = () => {
        return (
            <div className='land-trade-history-warning'>
                <div className='warning'>
                    <div className="lnr lnr-warning lnr-custom-close"/>
                    <TranslateLanguage direct={'menuTab.transaction.history.getNoInfoView'}/>
                </div>
            </div>
        );
    };

    loading = () => {
        return (
            <div className='land-trade-history-warning'>
                <div className='screen-loading'>
                    <div className="lds-roller">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
            </div>
        )
    };

    getSelectedTab = (selected) =>{
        const {viewMode} = this.state;
        const tabItemClass = classNames({
            'tab-item':true,
            'selected':viewMode.val === selected.val
        });
        return tabItemClass;
    }

    getHistoryTab = () =>{
        const {getSelectedTab} = this;
        const {all,purchase,sell} = listViewMode;
        return(
            <div className='land-trade-history-tabs'>
                <div className={getSelectedTab(all)} onClick={() => this.clickChangeFilterMode(all)}>
                    {all.name}
                </div>
                <div className={getSelectedTab(purchase)} onClick={() => this.clickChangeFilterMode(purchase)}>
                    {purchase.name}
                </div>
                <div className={getSelectedTab(sell)} onClick={() => this.clickChangeFilterMode(sell)}>
                    {sell.name}
                </div>
            </div>
        );
    }

    getActionGroup = () =>{
        const {selectViewHistories} = this.state;
        return (
            <div className='action-group'>
                <button onClick={() => this.props.handleChangeScreen('default')}>
                    <img src='/images/game-ui/sm-back.svg' alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.backBtn'}/>
                        <Tooltip descLang={'menuTab.transaction.history.toolTip.backButton'}/>
                    </div>
                </button>
                <button onClick={() => this.checkSelectionBeforeDeleting(selectViewHistories)}>
                    <img src='/images/game-ui/sm-recycle.svg' alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.deleteBtn'}/>
                    </div>
                    <Tooltip descLang={'menuTab.transaction.history.toolTip.deleteButton'}/>
                </button>
            </div>
        );
    }

    getDefaultScreen = () => {
        const {selectViewHistories} = this.state;
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab4/nav4.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.title'}/>
                    </div>
                </div>
                <div className='land-trade-history-container'>
                    {this.getHistoryTab()}
                    {selectViewHistories ? selectViewHistories.length === 0 ? this.getNoInfoView(): this.renderHistory() : this.loading()}
                    {this.getActionGroup()}
                </div>
               
                
            </Fragment>
        );
    };

    renderHistory = () =>{
        const {selectViewHistories} = this.state;
        //console.log('selectViewHistories', selectViewHistories);
        const {selectAll} = this.state;
        const checkAllClass = classNames({
            "check-box":true,
            "checked":selectAll
        });
        return  (
            <div className='land-trade-history-list'>
                <table>
                    <thead>
                        <tr>
                            <td className='land-col'><TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.column1Title'} /></td>
                            <td className='blood-col'><TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.blood'}/></td>
                            <td className='date-col'><TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.date'}/></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='select-all' colSpan={3} onClick={() => this.checkedAllHistory()}>
                                <div className={checkAllClass}></div>
                                <TranslateLanguage direct={'menuTab.transaction.history.getDefaultScreen.all'}/>
                                <span > &nbsp;{`(${ (Array.isArray(selectViewHistories) && selectViewHistories.length) || 0 })`} </span>
                            </td>
                        </tr>
                        {selectViewHistories.map((historyItem, index) => {
                            const checkBoxClass= classNames({
                                'check-box':true,
                                'checked':historyItem.checked
                            });
                            return <tr key={index}>
                                        <td className='land-col'>
                                            <div className={checkBoxClass} onClick={() => this.checkedOneHistory(historyItem)} />
                                            <span style={{ padding: "2px 5px 2px 0px" }} onClick={()=> this.moveToLand(historyItem.history)}>{historyItem.history.quadKey}</span>
                                        </td>
                                        <td className='blood-col' onClick={() => this.checkedOneHistory(historyItem)} >
                                            {historyItem && historyItem.history && historyItem.history.soldPrice && (historyItem.history.soldPrice).toLocaleString()}
                                        </td>
                                        <td className='date-col' onClick={() => this.checkedOneHistory(historyItem)} >
                                            {historyItem && historyItem.history && historyItem.history.dateTrading && historyItem.history.simpleDateTrading}
                                        </td>
                                    </tr>
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {alertPopup}
            </Fragment>
        );
    }

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.deleteConfirmAlert === this.state.currentAlertPopUp && this.getDeleteConfirmAlertPopup()}
                {this.alertPopupScreen.noSelectedAlert === this.state.currentAlertPopUp && this.getNoSelectedAlert()}
            </Fragment>
        );
    };

    deleteHistory = () => {
        const { user } = this.props;
        const { selectViewHistories, deleting } = this.state;
        if (deleting === false) {
            let delHistories = selectViewHistories.reduce((delHistories, historyItem) => {
                if (historyItem.checked === true) {
                    const deleteHistory = historyItem.history.buyer === user._id ? {buyerDeleted: true, historyId: historyItem.history._id} : {sellerDeleted: true, historyId: historyItem.history._id};
                    delHistories.push(deleteHistory);
                }
                return delHistories;
            }, []);
            this.setState({deleting: true});
            this.props.removeHistoryTradingLand({userId: user._id, histories: delHistories});
        }
    };

    getNoSelectedAlert = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'menuTab.transaction.history.alert.getNoSelectedAlert.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.transaction.history.alert.getNoSelectedAlert.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getDeleteConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.deleteHistory();
        const noBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'menuTab.transaction.history.alert.getDeleteConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'menuTab.transaction.history.alert.getDeleteConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    }
}

function mapStateToProps(state) {
    const {lands, authentication: {user}, settingReducer,map} = state;
    return {
        lands,
        user,
        map,
        settingReducer
    };
}

const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    clearRemoveHistoryTradingLandStatus: () => dispatch(socketActions.clearRemoveHistoryTradingLandStatus()),
    removeHistoryTradingLand: (histories) => dispatch(socketActions.removeHistoryTradingLand(histories)),
    getAllHistoryTradingLandById: (userId) => dispatch(landActions.getAllHistoryTradingLandById(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandTradingHistory);