import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {Modal} from 'reactstrap';
import isEqual from "lodash.isequal";
import {
    convertFloatToLocalString,
    splitLandCanBuyLevel24FromSelectedTiles
} from '../../landMapComponent/component/MapFunction';
import {bloodAppId} from "../../../../../../src/helpers/config";
import Rules from "../../../../../helpers/ValidationRule";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import {StyledDropdown} from '../../../../../components/customStyled/Dropdown_style';
import {
    alertPopupScreen,
    getInitLoadingAlertPopup,
    getValidateAlertPopup,
    getNoLandAlertPopup,
    getTooManyLandAlertPopup,
    getPurchaseLandConfirmAlertPopup,
    getNoSelectedAlert,
    getNotEnoughBloodAlertPopup,
    getWaitingAlertPopup,
    getSuccessAlertPopup,
    getDeletedLandAlertPopup,
    getWaitingNoBlockAlertPopup,
    getErrorAlertPopup,
    getFolderNameEmptyAlertPopup,
    getReLoginAlertPopup
} from './component/AlertPopup';

const TOTAL_PURCHASE_FEE = 0.01;

class LandPurchasePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentAlertPopUp: alertPopupScreen.noPopup,
            totalLandPurchase: -1,
            buySuccess: -1,
            popupNoData: true,
            showPurchaseScreen: true,
            //data
            selectedTiles: [],
            checkAll: false,
            landItems: [],
            landDeleteInCart: null,
            calculatorBuyLand: {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: 0,
                myBloodAfterBuy: 0,
            },
            buying: false,
            errorSelected: null,
            categoryName: '',
            error: null,
            prePurchaseLands: []
        };
    }

    componentDidMount() {
        this.initLoadData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.buying === true) {
            const {isOwn, purchaseSuccess, updates, buyFailure} = this.props.lands;
            if (isOwn) {
                if (purchaseSuccess) {
                    this.removeCheckedItem();
                    this.loadDataPurchase();

                    let totalLandPurchase = updates.length + buyFailure.length;
                    let buySuccess = updates.length
                    this.handleShowAlertPopup(alertPopupScreen.successAlert, {totalLandPurchase, buySuccess});
                } else {
                    this.handleShowAlertPopup(alertPopupScreen.errorAlert);
                }

                this.setState({buying: false});
            }
        }
        if (this.props.selectedTiles && !isEqual(this.props.selectedTiles, prevProps.selectedTiles)) {
            this.loadDataPurchase();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {wallet} = nextProps;
        const walletCheck = Object.keys(wallet).length === 0 && wallet.constructor === Object;
        if (!walletCheck && wallet.info) {
            return {
                wallet: wallet
            }
        } else {
            return null
        }
    }

    handleShowAlertPopup = (screen, param) => {

        let updateTotalLandPurchase = -1;
        let updateBuySuccess = -1;
        if (typeof param !== 'undefined') {
            updateTotalLandPurchase = param.totalLandPurchase;
            updateBuySuccess = param.buySuccess;
        }
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
            totalLandPurchase: updateTotalLandPurchase,
            buySuccess: updateBuySuccess
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: alertPopupScreen.noPopup,
            modalAlertPopup: false
        });
    };


    resetCalculatorBuyLand() {
        const {wallet} = this.state;
        return {
            totalLandNumber: 0,
            totalBloodFee: 0,
            totalPurchaseFee: 0,
            myBlood: wallet && wallet.info && wallet.info.goldBlood ? wallet.info.goldBlood : 0,
            myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood ? wallet.info.goldBlood : 0,
        }
    }

    loadDataPurchase() {
        let {selectedTiles, user, map} = this.props;
        selectedTiles = map.selected ? map.selected : selectedTiles;
        if (selectedTiles && selectedTiles.length > 0) {
            let total = selectedTiles.reduce((totalCount, tile) => totalCount + tile.totalCount, 0);
            if (total > 300) {
                this.setState({errorSelected: "tooManyLand"});
            } else {
                //console.log('selectedTiles ', selectedTiles)
                let splitLand = splitLandCanBuyLevel24FromSelectedTiles(selectedTiles, user, this.props.lands.defaultLandPrice);
                splitLand = splitLand.map(splLand => ({checked: false, land: splLand}));
                const itemQuadKeys = splitLand.map(l => {
                    return{
                        quadKey: l.land.quadKey,
                        userId: l.land.user ? l.land.user._id :  null
                    }
                });
                const paramGetLandByQuadKey = {
                    userId: user._id,
                    itemQuadKeys
                };
                this.props.getLandByQuadKey(paramGetLandByQuadKey);
                this.setState({
                    landItems: splitLand,
                    calculatorBuyLand: this.resetCalculatorBuyLand(),
                    errorSelected: null,
                });
            }
        } else {
            this.setState({errorSelected: "noLand"});
        }
    }

    initLoadData = () => {
        this.setState({categoryName: ''});
        const {user: {wToken}} = this.props;
        this.props.getAllLandCategory({userId: this.props.user._id});
        this.props.getWalletInfo({wToken});
        if (this.props.selectedTiles) {
            this.loadDataPurchase();
        } else {
            this.setState({calculatorBuyLand: this.resetCalculatorBuyLand(this.props.user)});
        }
    };

    checkedAllLand = (splitLand) => {
        let newLandItems = [...this.state.landItems].map(landItem => ({
            checked: !this.state.checkAll,
            land: landItem.land
        }));
        const {wallet} = this.state;
        if (wallet && wallet.info) {
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {

                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = parseFloat(sum.totalBloodFee) + parseFloat(landItem.land.sellPrice);
                    sum.totalPurchaseFee += TOTAL_PURCHASE_FEE;
                    sum.myBloodAfterBuy = wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood) - parseFloat(sum.totalBloodFee) - sum.totalPurchaseFee;
                }
                return sum;
            }, {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
                myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
            });
            calculatorBuyLand.totalBloodFee = parseFloat(calculatorBuyLand.totalBloodFee);
            calculatorBuyLand.totalPurchaseFee = parseFloat(calculatorBuyLand.totalPurchaseFee);
            calculatorBuyLand.myBloodAfterBuy = parseFloat(calculatorBuyLand.myBloodAfterBuy);

            this.setState({checkAll: !this.state.checkAll, landItems: newLandItems, calculatorBuyLand});
        }

    };

    checkedOneLand = (landItem) => {
        let newLandItems = [...this.state.landItems];
        let fIndex = newLandItems.findIndex(landIt => landIt.land.quadKey === landItem.land.quadKey);
        newLandItems[fIndex].checked = !newLandItems[fIndex].checked;
        const {wallet} = this.state;
        //console.log('wallet', wallet)
        if (wallet && wallet.info) {
            //console.log('newLandItems ', newLandItems[0].land.sellPrice);
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {
                //console.log('sum.totalBloodFee ', parseFloat(sum.totalBloodFee));
                //console.log('sellPrice ', parseFloat(landItem.land.sellPrice));\

                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = parseFloat(sum.totalBloodFee) + parseFloat(landItem.land.sellPrice);
                    sum.totalPurchaseFee += TOTAL_PURCHASE_FEE;
                    sum.myBloodAfterBuy = wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood) - parseFloat(sum.totalBloodFee);
                }
                return sum;
            }, {
                totalLandNumber: 0,
                totalBloodFee: 0,
                totalPurchaseFee: 0,
                myBlood: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
                myBloodAfterBuy: wallet && wallet.info && wallet.info.goldBlood && parseFloat(wallet.info.goldBlood),
            });

            calculatorBuyLand.totalBloodFee = parseFloat(calculatorBuyLand.totalBloodFee);
            calculatorBuyLand.totalPurchaseFee = parseFloat(calculatorBuyLand.totalPurchaseFee);
            calculatorBuyLand.myBloodAfterBuy = parseFloat(calculatorBuyLand.myBloodAfterBuy);

            const checkedItem = this.state.landItems.filter(item => item.checked);
            this.setState({
                landItems: newLandItems,
                calculatorBuyLand,
                checkAll: checkedItem.length === this.state.landItems.length
            });
        }

    };

    changeCategoryName = (e) => {
        const newCategoryName = e.target.value;
        this.setState({categoryName: newCategoryName});
    };

    removeCheckItemWhenClosePuschasePopup() {
        const rmChecked = this.state.landItems.map(landItem => {
            landItem.checked = false;
            return landItem;
        });
        this.setState({
            landItems: rmChecked,
            checkAll: false,
            calculatorBuyLand: this.resetCalculatorBuyLand(),
            categoryName: ''
        });
        this.props.handleHidePopup();
    }

    validateCategoryName = (value) => {
        const allCate = this.props.lands.categories;
        let categorieNames = allCate.map((item, index) => {
            return item.category.name
        });

        let rules = new Rules.ValidationRules();
        if (rules.checkLength(value, 36, '_'))
            return this.setState({
                error: rules.checkLength(value, 36, <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkLength'}/>),
                modalAlertPopup: true
            });
        if (rules.checkExistName(value, categorieNames, '_'))
            return this.setState({
                error: rules.checkExistName(value, categorieNames, <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkExistString'}/>),
                modalAlertPopup: true
            });
    }

    hidePopupAnClearError = () => {
        this.setState({
            modalAlertPopup: false,
            error: null
        });
    };

    checkEmptyLandBeforeOpenConfirmPopup = () => {
        const {landItems,categoryName,categoryNameSelected,calculatorBuyLand} = this.state;
        const isSelected = landItems && landItems.some(land => land.checked);
        if(!isSelected) {
            return this.handleShowAlertPopup(alertPopupScreen.noSelectedAlert);
        }
        
        this.validateCategoryName(categoryName.trim());
        if ((categoryName.trim() === '' || categoryName === null ) && !categoryNameSelected ) return this.handleShowAlertPopup(alertPopupScreen.folderNameEmptyAlertPopup);
        if (calculatorBuyLand.totalLandNumber <= 0) return this.handleShowAlertPopup(alertPopupScreen.noSelectedAlert);
        //not enough blood when buy land
        if (calculatorBuyLand.myBloodAfterBuy <= 0) return this.handleShowAlertPopup(alertPopupScreen.notEnoughBloodAlert);
        //show confirm buy
        this.handleShowAlertPopup(alertPopupScreen.purchaseLandConfirmAlert);
    };

    hideAndRefreshPage = () => {
        this.handleHideAllPopup();
    };

    confirmLandPurchase = () => {
        let {lands: {categories}} = this.props;
        let categoryList = [];
        categories && categories.length !== 0 && categories.map(c => c.category.name !== 'empty' && categoryList.push(c.category));
        const {_id, nid} = this.props.user;
        let filterCheckedLand = this.state.landItems.filter(landItems => landItems.checked);
        if (filterCheckedLand && filterCheckedLand.length > 0) {
            let objBuyLand = {
                categoryName: this.state.categoryName === '' ? this.state.categoryNameSelected.name: this.state.categoryName,
                itemQuadKeys: filterCheckedLand.map(landItem => {
                    const {quadKey, sellPrice, user} = landItem.land;
                    return user ? {
                            quadKey,
                            sellPrice,
                            buyerId: _id,
                            buyerNid: nid,
                            sellerId: user._id,
                            sellerNid: user.nid
                        }
                        : {quadKey, sellPrice, buyerId: _id, buyerNid: nid, sellerId: null, sellerNid: 0}
                }),
                user: this.props.user,
                categoryId: !this.state.changeCategoryModeToggle && categoryList.length !== 0 ? this.state.categoryNameSelected._id : null
            };
            // this.props.getLastestQuadkeyLandPurchase(objBuyLand.itemQuadKeys)
            const quadKeys = filterCheckedLand.map(landItem => landItem.land.quadKey);
            // let landDeleteInCart = this.state.landItems.filter(landItem => landItem.checked);
            // if (this.props.mode === 'CART') this.props.updateList(landDeleteInCart);
            this.setState({showPurchaseScreen: false});
            this.setState({prePurchaseLands: quadKeys});
            this.setState({buying: true, landItems: []});
            this.props.clearSelected();
            this.props.transferBloodTradingLand({buyLands: objBuyLand});
            this.handleHideAlertPopup();
            // this.props.getWalletInfo({'wToken': user.wToken});
            this.handleShowAlertPopup(alertPopupScreen.waitingAlert);
        }
    };

    handleHideAllPopup = () => {
        this.props.clearPurchaseStatusSocket();
        this.setState({prePurchaseLands: []});
        this.props.handleHidePopup();
        this.handleHideAlertPopup();
    };

    removeCheckedItem() {
        let newLandItems = [...this.state.landItems];
        newLandItems = newLandItems.filter(slTile => slTile.checked === false);
        this.setState({
            checkAll: false,
            landItems: newLandItems,
            calculatorBuyLand: this.resetCalculatorBuyLand(this.props.user)
        });
    }

    confirmDeleteSelectedLand = () => {
        this.removeCheckedItem();
        this.handleHideAlertPopup();
    }

    changeCategoryEditor = () =>{
        this.setState({
            changeCategoryModeToggle: !this.state.changeCategoryModeToggle,
            categoryNameSelected: null,
            categoryName: ''
        });
    }

    checkEmptyLandBeforeOpenDeleteLandPopup = () =>{
        const {deletedLandAlert,noSelectedAlert} = alertPopupScreen
        const {landItems} = this.state;
        const isSelected = landItems && landItems.some(land => land.checked);
        return isSelected ? this.handleShowAlertPopup(deletedLandAlert) : this.handleShowAlertPopup(noSelectedAlert);
    }

    getSelectedLandList = (landItems,categoryList,categoryNameSelected,categoryName,totalLandNumber,totalBloodFee,goldBlood) => {
        const {checkAll, changeCategoryModeToggle} = this.state;
        const clsCheckAll = classNames({
            'check-box' :true,
            'checked' : checkAll
        });
        const {lands} = this.props;
        if(lands.buyLandList){
            const {buyLandList:{buyLandInfos}} = lands;
            landItems.map(l => {
                let landItemFind = buyLandInfos && buyLandInfos.find(landInfo => landInfo.quadKey === l.land.quadKey);
                l.land.initialPrice =landItemFind && landItemFind.initialPrice;
                l.land.sellPrice = landItemFind && landItemFind.sellPrice;
                return l
            });
        }
        const spacing = <div className='item-row'><div className='land-col'/><div className='init-blood-col'/><div className='blood-col' /></div>;
        return (
            <div className='land-purchase-container'>
                <div className='header-grid'>
                    <div className='land-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.selectedLandTitle'}/>
                    </div>
                    <div className='blood-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.priceTitle'}/>
                    </div>
                    <div className='land-sub-col'>
                        <div className={clsCheckAll} onClick={() => this.checkedAllLand()}/>
                        <span onClick={() => this.checkedAllLand()}><TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.selectAll'}/></span>
                        <div > &nbsp;{`(${ (Array.isArray(landItems) && landItems.length) || 0 })`} </div>
                    </div>
                    <div className='init-blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.landPrice'}/>
                    </div>
                    <div className='blood-sub-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.priceBlood'}/>
                    </div>
                </div>

                <div className='body-grid'>
                {spacing}
                {
                    landItems.map((landItem, index) => {
                        const clsCheckOne = classNames({
                            'check-box' :true,
                            'checked' : landItem.checked
                        });

                        return <div className='item-row' key={index}>
                                    <div className='land-col'>
                                        <div className={clsCheckOne} onClick={() => this.checkedOneLand(landItem)}/>
                                        <span onClick={() => this.checkedOneLand(landItem)} >{landItem.land.quadKey}</span>
                                    </div>
                                    <div className='init-blood-col'>
                                        <input type="number" readOnly value={landItem.land.initialPrice}/>
                                    </div>
                                    <div className='blood-col'>
                                        <input type="number" readOnly value={landItem.land.sellPrice}/> Blood
                                    </div>
                                </div>
                    })
                }
                </div>
                <div className='footer-grid'>

                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.folderName'}/>
                    </div>
                    <div className='edit-col'>
                        {!this.state.changeCategoryModeToggle && categoryList.length !== 0 ?
                            <StyledDropdown optionLabel='name' value={categoryNameSelected} options={categoryList}
                                onChange={(e) => {this.setState({categoryNameSelected: e.value})}} placeholder="Select a Category"/> :
                            <input autoFocus className='value' type='text' value={categoryName} onChange={(e) => this.changeCategoryName(e)}/>
                        }
                    </div>
                    <div className='unit-col'>
                        <div className='change-mode-button' onClick={() => this.changeCategoryEditor()}>
                            <div className='change-mode-button-content'>{!changeCategoryModeToggle ?
                                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.change-mode-button2'}/> :
                                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.change-mode-button1'}/>}</div>
                        </div>

                    </div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.noSelectedLand'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{totalLandNumber}</div>
                    </div>
                    <div className='unit-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.land'}/>
                    </div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.bloodPurchasedLand'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(totalBloodFee)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.fees'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{0}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.myBlood'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(goldBlood)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>


                    <div className='title-col'>
                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.myBloodAfter'}/>
                    </div>
                    <div className='edit-col'>
                        <div className='value'>{convertFloatToLocalString(goldBlood - totalBloodFee)}</div>
                    </div>
                    <div className='unit-col'>Blood</div>

                </div>
            </div>
        )
    }

    getLandPurchasePopup = () => {
        const {calculatorBuyLand: {totalLandNumber, totalBloodFee}, landItems, errorSelected, categoryName, wallet, modalAlertPopup, showPurchaseScreen , categoryNameSelected} = this.state;
        let goldBlood = wallet && wallet.info ? wallet.info.goldBlood : 0;
        let {modalPopup, lands: {categories}} = this.props;
        let categoryList = [];
        categories && categories.length !== 0 && categories.map(c => c.category.name !== 'empty' && categoryList.push(c.category));
        if(errorSelected === "tooManyLand"){
            return  getTooManyLandAlertPopup(modalPopup,this.handleHideAllPopup)
        }
        else if(!modalAlertPopup && this.state.buying === false &&
                 (errorSelected === 'noLand' || landItems.length === 0)){
            return getNoLandAlertPopup(modalPopup,this.handleHideAllPopup);
        }
        else if(!wallet){
            getInitLoadingAlertPopup(modalPopup);
        }
        else{
            return showPurchaseScreen && <Modal isOpen={modalPopup} backdrop="static" className={`custom-modal modal--land-purchase`}>
                                    <div className='custom-modal-header'>
                                        <img src={loadingImage('/images/bloodland-ui/land-purchare-white.png')} alt=''/>
                                        <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.header'}/>
                                        <span className="lnr lnr-cross lnr-custom-close"
                                            onClick={() => this.removeCheckItemWhenClosePuschasePopup()}/>
                                    </div>
                                    <div className='custom-modal-body'>
                                        {this.getSelectedLandList(landItems,categoryList,categoryNameSelected,categoryName,totalLandNumber,totalBloodFee,goldBlood)}
                                    </div>
                                    <div className='custom-modal-footer-action-group'>
                                        <button onClick={() => this.checkEmptyLandBeforeOpenConfirmPopup()}>
                                            <img src='/images/game-ui/sm-ok.svg' alt=''/>
                                            <div>
                                                <TranslateLanguage direct={'menuTab.transaction.buyLand.getLandPurchasePopup.confirmBtn'}/>
                                            </div>
                                        </button>
                                        <button onClick={() => this.checkEmptyLandBeforeOpenDeleteLandPopup()}>
                                            <img src='/images/game-ui/sm-recycle.svg' alt=''/>
                                            <div>
                                                <TranslateLanguage
                                                    direct={'menuTab.transaction.buyLand.getLandPurchasePopup.deleteBtn'}/>
                                            </div>
                                        </button>
                                        <button onClick={() => this.removeCheckItemWhenClosePuschasePopup()}>
                                            <img src='/images/game-ui/sm-close.svg' alt=''/>
                                            <div>
                                                <TranslateLanguage
                                                    direct={'menuTab.transaction.buyLand.getLandPurchasePopup.cancelBtn'}/>
                                            </div>
                                        </button>
                                    </div>
                                </Modal>
        }
    };

    getAlertModalPopup = () => {
        const {modalAlertPopup,currentAlertPopUp,error} = this.state;
        const {getAllLandById , user} = this.props;
        const {hidePopupAnClearError} = this;
        const { deletedLandAlert,
                purchaseLandConfirmAlert,
                waitingAlert,
                successAlert,
                errorAlert,
                noSelectedAlert,
                waitingNoBlockAlert,
                notEnoughBloodAlert,
                folderNameEmptyAlertPopup,
                reLoginAlert } = alertPopupScreen;
        const {buySuccess, prePurchaseLands:{length}} = this.state;
        return (
            <Fragment>
                {deletedLandAlert === currentAlertPopUp && getDeletedLandAlertPopup(modalAlertPopup,this.confirmDeleteSelectedLand,this.handleHideAlertPopup)}
                {purchaseLandConfirmAlert === currentAlertPopUp && getPurchaseLandConfirmAlertPopup(modalAlertPopup,this.confirmLandPurchase,this.handleHideAlertPopup)}
                {waitingAlert === currentAlertPopUp && getWaitingAlertPopup(modalAlertPopup)}
                {successAlert === currentAlertPopUp && getSuccessAlertPopup(modalAlertPopup,this.hideAndRefreshPage,buySuccess,length , getAllLandById , user)}
                {errorAlert === currentAlertPopUp && getErrorAlertPopup(modalAlertPopup,this.handleHideAllPopup)}
                {noSelectedAlert === currentAlertPopUp && getNoSelectedAlert(modalAlertPopup,this.handleHideAlertPopup)}
                {waitingNoBlockAlert === currentAlertPopUp && getWaitingNoBlockAlertPopup(modalAlertPopup,this.hideAndRefreshPage)}
                {notEnoughBloodAlert === currentAlertPopUp && getNotEnoughBloodAlertPopup(modalAlertPopup,this.handleHideAlertPopup)}
                {folderNameEmptyAlertPopup === currentAlertPopUp && getFolderNameEmptyAlertPopup(modalAlertPopup,this.handleHideAlertPopup)}
                {reLoginAlert === currentAlertPopUp && getReLoginAlertPopup(modalAlertPopup,bloodAppId,this.handleHideAllPopup)}
                {/*waitingNoBlockAlert*/}
                {error && getValidateAlertPopup(modalAlertPopup,hidePopupAnClearError,error)}
            </Fragment>
        );
    };

    render() {
        const modalPopup = this.getLandPurchasePopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {modalPopup}
                {alertPopup}
            </Fragment>
        );
    }

}


function mapStateToProps(state) {
    const {lands, authentication: {user}, map, users, notify: {notifies}, settingReducer, wallet} = state;
    return {
        notifies,
        user,
        lands,
        map,
        users,
        wallet,
        settingReducer
    };
}

const mapDispatchToProps = (dispatch) => ({
    getAllCategory: (userId) => dispatch(landActions.getAllCategory({userId: userId})),
    addWaitingTile: (tiles) => dispatch(mapActions.addWaitingTile(tiles)),
    removeWaitingTile: (tiles) => dispatch(mapActions.removeWaitingTile(tiles)),
    transferBloodTradingLand: (objTransfer) => dispatch(socketActions.transferBloodTradingLand(objTransfer)),
    clearBloodPurchase: () => dispatch(userActions.clearBloodPurchase()),
    transferBlood: (objTransfer) => dispatch(userActions.transferBlood(objTransfer)),
    transferBloodTrading: (objTransfer) => dispatch(userActions.transferBloodTrading(objTransfer)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket()),
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    getAllLandCategory: ({userId}) => dispatch(landActions.getAllLandCategory({userId})),
    getLandByQuadKey: (param) => dispatch(landActions.getLandByQuadKey(param)),
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId))
});
export default connect(mapStateToProps, mapDispatchToProps)(LandPurchasePopup)
