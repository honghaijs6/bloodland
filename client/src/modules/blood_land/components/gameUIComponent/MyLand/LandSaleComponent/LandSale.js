import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import cloneDeep from "lodash.clonedeep";
import isEqual from 'lodash.isequal';

import SellLandModifyPopup from './SellLandModifyPopup';

import {
    TranslateLanguage,
    loadingImage, QuadKeyToLatLong,
    MessageBox,
    landActions,
    mapActions,
    socketActions,
} from '../../../../../../helpers/importModule';

import Tooltip from "../../../general/Tooltip";

class LandSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            categories: [],
            noSellLand: [],
            unselling: false,
            cateNosell: [],
            forSellLand: [],
            checkAll: false,
        };
    }

    screen = {
        default: 'default'
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
        this.props.getAllCategory(this.props.user._id);
    }

    componentDidUpdate(prevProps) {
        const {lands: {categories},lands} = this.props;
        const OldCategories = this.state.categories;

        if (!isEqual(categories, OldCategories)) {
            let {noSellLand, forSellLand} = cloneDeep(categories).reduce((allLand, cateItem) => {
                if (cateItem.category && cateItem.category.lands && cateItem.category.lands.length > 0) {
                    let lands = cateItem.category.lands.reduce((allChkLand, landItem) => {
                        //allChkLand.concat(landItem)
                        if (landItem.land.forSaleStatus === true) {
                            allChkLand.forSell.push(landItem);
                        } else {
                            allChkLand.noSell.push(landItem);
                        }
                        return allChkLand;
                    }, {noSell: [], forSell: []});
                    allLand.noSellLand = allLand.noSellLand.concat(lands.noSell);
                    allLand.forSellLand = allLand.forSellLand.concat(lands.forSell);
                }
                return allLand;
            }, {noSellLand: [], forSellLand: []});

            let cateNoSell = cloneDeep(categories).map(cate => {
                //add cate && cate.category && cate.category.lands because sometime error [LandSale.js:104 Uncaught TypeError: Cannot read property 'length' of null];
                cate.category.lands = cate && cate.category && cate.category.lands && cate.category.lands.length > 0
                    ? cate.category.lands.filter(landItem => landItem.land.forSaleStatus === false)
                    : [];
                return cate;
            });

            this.setState({
                categories,
                cateNoSell,
                forSellLand,
                noSellLand,
                forSaleLandNumber: forSellLand.length,
                checkAll: false
            });
        }

        // let tempOldCate = categories;

        if (typeof lands.updates !== 'undefined' && lands.updates.length > 0) {

            let updatedForSellLands = this.state.forSellLand.filter(l => !lands.updates.find(uL => uL.quadKey === l.land.quadKey));


            this.setState({
                // categories: this.state.categories,
                // cateNoSell,
                forSellLand: updatedForSellLands,
                // noSellLand,
                forSaleLandNumber: updatedForSellLands.length,
            });
            this.props.clearPurchaseStatusSocket();

        }

        const {isOwnSell, sellSuccess, mode} = lands;

        if (sellSuccess !== prevProps.lands.sellSuccess) {
            if (isOwnSell && this.screen.default === this.state.currentScreen && mode === 'removesell') {
                if (sellSuccess === false) {
                    this.handleShowAlertPopup(this.alertPopupScreen.cancelSellingLandNumberAlert);
                } else {
                    //needcheck
                    this.handleShowAlertPopup(this.alertPopupScreen.cancelSellingLandNumberAlert);
                }
            }
        }
    }

    clickCheckedAll = (mode) => {
        if (mode === "noSell") {
            let noSellLand = [...this.state.noSellLand].map(landItem => {
                landItem.checked = !this.state.checkAll;
                return landItem;
            });
            this.setState({checkAll: !this.state.checkAll, noSellLand});
        } else {
            let forSaleLand = [...this.state.forSellLand].map(landItem => {
                landItem.checked = !this.state.checkAll;
                return landItem;
            });
            this.setState({checkAll: !this.state.checkAll, forSaleLand});
        }
    };

    clickCheckbox = (landItem, mode) => {
        if (mode === 'noSell') {
            let noSellLand = [...this.state.noSellLand];
            let fIndex = noSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            noSellLand[fIndex].checked = !landItem.checked;
            const checkedItem = noSellLand.filter(landItem => landItem.checked);
            this.setState({noSellLand, checkAll: checkedItem.length === noSellLand.length});
        } else {
            let forSellLand = [...this.state.forSellLand];
            let fIndex = forSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            forSellLand[fIndex].checked = !landItem.checked;
            const checkedItem = forSellLand.filter(landItem => landItem.checked);
            this.setState({forSellLand, checkAll: checkedItem.length === forSellLand.length});
        }
    };

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='land-sale-warning-screen'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.myLand.landSold.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src='/images/game-ui/sm-back.svg' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.back'}/>
                        </div>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () => {
        return (
            <div className='land-sale-warning-screen'>
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

    moveToLand = (land) => {
        const {map} = this.props;
        if (map && map.zoom === 22) {
            const center = QuadKeyToLatLong(land.quadKey);
            this.props.syncCenterMap(center, land.quadKey.length - 2, land.quadKey);
            this.handleHideAllPopup();
        } else {
            const center = QuadKeyToLatLong(land.quadKey);
            this.props.syncCenterMap(center);
            this.handleHideAllPopup();
        }
    };

    renderLandSaleList = () =>{
        const {forSellLand,forSaleLandNumber} = this.state;
        const checkallClass = classNames({
            'check-box':true,
            'checked':this.state.checkAll
        });
        return(
            <Fragment>
                <div className='land-list-length'>
                    <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.heading'} />
                    <div>{forSaleLandNumber} <TranslateLanguage direct={'menuTab.myLand.landOwned.land'}/></div>
                </div>
                <div className='land-sale-list-container'>
                    <div className='header-grid'>
                        <div className='land-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.column1Title'} />
                        </div>
                        <div className='blood-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.column2Title'} />
                        </div>
                        <div className='select-all' onClick={() => this.clickCheckedAll('forSale')}>
                            <div className={checkallClass}></div>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.checkAllButton'}/>
                            <span > &nbsp;{`(${ (Array.isArray(forSellLand) && forSellLand.length) || 0 })`} </span>
                        </div>
                    </div>
                    <div className='body-grid'>
                        {forSellLand.map((landItem, index) => {
                            const checkItemClass = classNames({
                                'check-box' :true,
                                'checked':landItem.checked
                            });
                            return <div key={index} className='item-row'>
                                        <div className='land-col'>
                                            <div className={checkItemClass} onClick={() => this.clickCheckbox(landItem, 'forSale')}/>
                                            <span onClick={() => this.moveToLand(landItem.land)}>
                                                {landItem.land.name ? landItem.land.name : landItem.land.quadKey}
                                            </span>
                                        </div>
                                        <div className='blood-col'>{landItem.land.sellPrice}</div>
                                    </div>
                        })}
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage('/images/game-ui/sm-back.svg')} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.myLand.landSold.back'}/></div>
                        <Tooltip descLang={'menuTab.myLand.landSold.MyLandsCounter.toolTip.removeSellLandButton'} />
                    </button>
                    <button onClick={() => this.handleShowSellLandModify()}>
                        <img src={loadingImage('/images/game-ui/sm-change-land-price.svg')} alt='' />
                        <div><TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.editLandSellButton'}/></div>
                        <Tooltip descLang={'menuTab.myLand.landSold.MyLandsCounter.toolTip.editLandSellButton'} />
                    </button>
                    <button onClick={() => this.checkBeforeDeleteLand()}>
                        <img src={loadingImage('../../../../../images/game-ui/sm-remove-land.svg')} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.removeSellLandButton'}/></div>
                        <Tooltip descLang={'menuTab.myLand.landSold.MyLandsCounter.toolTip.removeSellLandButton'} />
                    </button>
                </div>
            </Fragment>
        );
    }

    getLandSale = () =>{
        const {forSellLand,forSaleLandNumber} = this.state;
        return typeof forSaleLandNumber === 'undefined' ? this.loading() : forSellLand.length === 0 ? this.getNoInfoView() :  this.renderLandSaleList(); 
    }

    getDefaultScreen = () => {
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={('../../../../../images/game-ui/tab2/nav2.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.landSold'}/>
                    </div>
                </div>
                {this.getLandSale()}
            </Fragment>
        );
    };

    checkBeforeDeleteLand() {
        if (this.state.forSellLand && this.state.forSellLand.filter(landItem => landItem.checked).length > 0) {
            const preforSellLand = cloneDeep(this.state.forSellLand);
            this.setState({preforSellLand});
            this.handleShowAlertPopup(this.alertPopupScreen.cancelLandSaleAlert)
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToDeleteAlert);
        }
    }
    
    handleShowSellLandModify = ()=>{
        const {forSellLand} = this.state;
        let selectedSellLand = forSellLand.filter(landItem => landItem.checked);

        if (selectedSellLand && selectedSellLand.length > 0) {
            let forSellLandSelected = cloneDeep(selectedSellLand).map(landItem => {
                landItem.checked = false;
                return landItem;
            });
            this.setState({ 
                forSellLandSelected
            });
            this.handleShowPopup(this.popupScreen.sellLandModify);
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToModifyAlert);
        }
    }
    
    getSellLandModifyPopup = () =>{
        const {forSellLandSelected,modalPopup} = this.state;
        return <SellLandModifyPopup forSellLandSelected={forSellLandSelected} handleHidePopup={this.handleShowPopup} modalPopup={modalPopup}   />
    }


    render() {
        const modalPopup = this.getModalPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {modalPopup}
                {alertPopup}
            </Fragment>
        );
    }

    popupScreen = {
        noPopup: 'noPopup',
        sellLandModify: 'sellLandModify',
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.sellLandModify === this.state.currentPopupScreen && this.getSellLandModifyPopup()}
            </Fragment>
        );
    };

    
    confirmRemoveLand = () => {
        console.log('vo day');
        const arrQuadkey = [...this.state.forSellLand].reduce((quadKeys, landItem) => {
            if (landItem.checked) {
                quadKeys = quadKeys.concat({quadKey: landItem.land.quadKey, landPrice: landItem.land.sellPrice});
            }
            return quadKeys;
        }, [])
        // sellLand
        let objUnsellLand = {
            userId: this.props.user._id,
            forSaleStatus: false,
            quadKeys: arrQuadkey,
            mode: 'removesell',
            nid: this.props.user.nid || 555555555,
        };
        // this.setState({unselling: true});
        this.props.sellLandSocket(objUnsellLand);
        // }
        //redirect
        this.handleHideAlertPopup();
    };

    confirmModifySellLand = () => {
        this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifySuccessAlert);
    };

    handleHideSuccessAlertPopup = () => {
        this.props.clearForSaleStatusSocket();
        this.handleHideAlertPopup();
        this.props.getAllCategory(this.props.user._id);
    }

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    };

    alertPopupScreen = {
        noPopup: 'noPopup',
        cancelLandSaleAlert: 'cancelLandSaleAlert',
        cancelLandSaleSuccessAlert: 'cancelLandSaleSuccessAlert',
        sellLandModifyCancelAlert: 'sellLandModifyCancelAlert',
        sellLandModifyConfirmAlert: 'sellLandModifyConfirmAlert',
        sellLandModifySuccessAlert: 'sellLandModifySuccessAlert',
        noSelectedLandToDeleteAlert: 'noSelectedLandToDeleteAlert',
        cancelSellingLandNumberAlert: 'cancelSellingLandNumberAlert',
        noSelectedLandToModifyAlert:'noSelectedLandToModifyAlert'
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.noSelectedLandToModifyAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToModifyAlertPopup()}
                {this.alertPopupScreen.cancelLandSaleAlert === this.state.currentAlertPopUp && this.getCancelLandSaleAlertPopup()}
                {this.alertPopupScreen.cancelLandSaleSuccessAlert === this.state.currentAlertPopUp && this.getCancelLandSaleSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandModifyCancelAlert === this.state.currentAlertPopUp && this.getSellLandModifyCancelAlertPopup()}
                {this.alertPopupScreen.sellLandModifyConfirmAlert === this.state.currentAlertPopUp && this.getSellLandModifyConfirmAlertPopup()}
                {this.alertPopupScreen.sellLandModifySuccessAlert === this.state.currentAlertPopUp && this.getSellLandModifySuccessAlertPopup()}
                {this.alertPopupScreen.noSelectedLandToDeleteAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToDeletePopup()}
                {this.alertPopupScreen.cancelSellingLandNumberAlert === this.state.currentAlertPopUp && this.getCancelSellingLandNumberAlert()}
            </Fragment>
        );
    };
    
    getNoSelectedLandToModifyAlertPopup = () => {
        const modal = this.state.modalAlertPopup
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getNoSelectedLandToModifyAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getNoSelectedLandToModifyAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getCancelLandSaleAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmRemoveLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.header'}/>;
        const body =  <TranslateLanguage direct={'alert.getCancelLandSaleAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getCancelLandSaleSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getCancelLandSaleSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getCancelLandSaleSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandModifyCancelAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleHideAllPopup();
        const noBtn = () => this.handleHidehandleHideAlertPopupPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandModifyCancelAlertPopup.header'}/>
        const body = <TranslateLanguage direct={'alert.getSellLandModifyCancelAlertPopup.body'}/>
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifyConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmModifySellLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header = 
        <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.header'}/>
        const body = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.body'}/>
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifySuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandModifySuccessAlertPopup.header'}/>
        const body = <TranslateLanguage direct={'alert.getSellLandModifySuccessAlertPopup.body'}/>
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getNoSelectedLandToDeletePopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getNoSelectedLandToDeletePopup.header'}/>
        const body = <TranslateLanguage direct={'alert.getNoSelectedLandToDeletePopup.body'}/>
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getCancelSellingLandNumberAlert = () => {
        const {updatedStateLands, sellSuccess} = this.props.lands;
        if (typeof sellSuccess === 'undefined') return;
        const {preforSellLand} = this.state;
        const selectedLandsLength = preforSellLand.filter(l => l.checked === true).length;
        
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideSuccessAlertPopup();
        const header = <TranslateLanguage direct={'alert.getCancelSellingLandNumberAlert.header'}/>
        const $_selected = `<span class='text-selected'>${selectedLandsLength}</span>`;
        const $_total = `<span class='text-total'>${updatedStateLands.length}</span>`;
        const body = <TranslateLanguage direct={'alert.getCancelSellingLandNumberAlert.body'} $_selected={$_selected} $_total={$_total} />;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    
    };
}

function mapStateToProps(state) {
    const {lands, authentication: {user}, map,settingReducer:{language}} = state;
    return {
        lands,
        user,
        map,
        language
    };
}

const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    getAllCategory: (userId) => dispatch(landActions.getAllCategory({userId})),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket())
});

export default connect(mapStateToProps, mapDispatchToProps)(LandSale);
