import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {Modal} from 'reactstrap';
import isEqual from "lodash.isequal";
import {
    splitLandCanBuyLevel24FromSelectedTiles,
    convertFloatToLocalString,
} from '../../landMapComponent/component/MapFunction';
import {bloodAppId} from "../../../../../../src/helpers/config";
import Rules from "../../../../../helpers/ValidationRule";
import {loadingImage} from "../../general/System";
import MessageBox from './../../general/MessageBox';

// const DEFAULT_CATEGORY_NAME = "category name 1";
class LandPurchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            currentDropdownItem: this.dropdownValue.noDropdown,
            mode: 0,
            totalLandPurchase: -1,
            buySuccess: -1,
            popupNoData: true,
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
            error: null
        };
    }

    screen = {
        default: 0,
        tradingHistory: 3,
        //landSale:4,
        landInfo: 5,
    };

    popupScreen = {
        noPopup: 10,
        landPurchase: 1,
    };

    dropdownValue = {
        noDropdown: 30,
        myCart: 31,
    };

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
            modalPopup: false,
            checkAll: false
        });
    };

    // handleDropdown = (item) => {
    //     this.setState({
    //         currentPopupScreen: this.popupScreen.noPopup,
    //         currentDropdownItem: item === this.state.currentDropdownItem ? this.dropdownValue.noDropdown : item,
    //     });
    // };

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
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            modalAlertPopup: false
        });
    };

    getActivePopupClass = (popupScreen) => {
        let gameTabItemClass = classNames({
            'active': popupScreen === this.state.currentPopupScreen
        });
        return gameTabItemClass;
    };

    getActiveAlertPopupClass = (popupScreen) => {
        let gameTabItemClass = classNames({
            'active': popupScreen === this.state.currentAlertPopUp
        });
        return gameTabItemClass;
    };

    getDefaultScreen = () => {
        const {mode} = this.props;
        switch (mode) {
            case 'MAIN':
                return (
                    <li className={this.getActivePopupClass(this.popupScreen.LandPurchase)}
                        onClick={() => this.handleShowPopup(this.popupScreen.LandPurchase)}>
                        <img src={loadingImage('/images/game-ui/tab4/nav1.svg')} alt=''/>
                        <div>랜드 구매</div>
                    </li>
                );
            case 'CART':
                return (
                    <button onClick={() => this.handleShowPopup(this.popupScreen.LandPurchase)}>
                        <img src={loadingImage('/images/game-ui/sm-sell-land.svg')} alt=''/>
                        <div>구매</div>
                    </button>
                );
            default:
                break;
        }
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
        let {selectedTiles, user, map, mode} = this.props;
        if (mode === 'MAIN') {
            selectedTiles = map.selected ? map.selected : selectedTiles;
        }
        if (selectedTiles && selectedTiles.length > 0) {
            let total = selectedTiles.reduce((totalCount, tile) => totalCount + tile.totalCount, 0);
            if (total > 10000) {
                this.setState({errorSelected: "tooManyLand"});
            } else {
                let splitLand = splitLandCanBuyLevel24FromSelectedTiles(selectedTiles, user, 1);
                splitLand = splitLand.map(splLand => ({checked: false, land: splLand}));
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

    componentDidMount() {
        this.setState({categoryName: ''});
        // const {user} = this.props;
        // this.props.getWalletInfo({'wToken': user.wToken, 'nid': user.nid, 'email': user.email});
        if (this.props.selectedTiles) {
            this.loadDataPurchase();
        } else {
            this.setState({calculatorBuyLand: this.resetCalculatorBuyLand(this.props.user)});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.buying === true) {
            const {isOwn, purchaseSuccess, error, updates, buyFailure} = this.props.lands;
            if (isOwn) {
                if (purchaseSuccess) {
                    this.removeCheckedItem();
                    this.loadDataPurchase();

                    let totalLandPurchase = updates.length + buyFailure.length;
                    let buySuccess = updates.length
                    this.handleShowAlertPopup(this.alertPopupScreen.successAlert, {totalLandPurchase, buySuccess});
                } else {
                    if (error === 'invalidToken') {
                        setTimeout(() => {
                            this.handleShowAlertPopup(this.alertPopupScreen.reLoginAlert)
                        }, 300000);
                    } else {
                        this.handleShowAlertPopup(this.alertPopupScreen.errorAlert);
                        //this.props.sendNotification();
                    }
                }
                this.props.clearPurchaseStatusSocket();
                this.setState({buying: false});
            }
        }
        if (this.props.selectedTiles && !isEqual(this.props.selectedTiles, prevProps.selectedTiles)) {
            this.loadDataPurchase();
        }

    }

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='screen-content-error'>
                    <div className='warning'><div className="lnr lnr-warning"/> 정보 없음</div>
                </div>
            </Fragment>
        );
    };

    render() {
        const modalPopup = this.getModalPopup();
        const alertPopup = this.getAlertModalPopup();
        const defaultScreen = this.getDefaultScreen();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
                {alertPopup}
            </Fragment>
        );
    }

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.landPrices === this.state.currentPopupScreen ? this.getLandPurchasePopup() : ''}
            </Fragment>
        );
    };

    _checkedAllLand = (splitLand) => {
        let newLandItems = [...this.state.landItems].map(landItem => ({
            checked: !this.state.checkAll,
            land: landItem.land
        }));
        const {wallet} = this.state;

        if (wallet && wallet.info) {
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {
                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = 1;
                    sum.totalPurchaseFee = 0;
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
            this.setState({checkAll: !this.state.checkAll, landItems: newLandItems, calculatorBuyLand});
        }

    };

    _checkedOneLand = (landItem) => {
        let newLandItems = [...this.state.landItems];
        let fIndex = newLandItems.findIndex(landIt => landIt.land.quadKey === landItem.land.quadKey);
        newLandItems[fIndex].checked = !newLandItems[fIndex].checked;
        const {wallet} = this.state;
        if (wallet.info) {
            const calculatorBuyLand = newLandItems.reduce((sum, landItem) => {
                if (landItem.checked) {
                    sum.totalLandNumber += 1;
                    sum.totalBloodFee = 1;
                    sum.totalPurchaseFee = 0;
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

    _changeCategoryName = (e) => {
        const newCategoryName = e.target.value;
        this.setState({categoryName: newCategoryName});
        // if(newCategoryName && newCategoryName.length <= 3000){
        //     this.setState({ categoryName: newCategoryName });
        // }
        //if(validatePrice(newSellPrice)){
        // let newSellLand = [...this.state.sellLand];
        // let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey);
        // newSellLand[fIndex].land.sellPrice = newSellPrice;
        // this.setState({ sellLand: newSellLand, limitPrice: false });
        // } else {
        //     this.setState({ limitPrice: true });
        // }
    };

    getLandPurchasePopup = () => {
        const {calculatorBuyLand: {totalLandNumber, totalBloodFee, totalPurchaseFee}, landItems, errorSelected, categoryName, wallet} = this.state;
        let goldBlood = wallet && wallet.info && wallet.info.goldBlood;
        let clsCheckAll = this.state.checkAll ? 'item-checkbox checked' : 'item-checkbox';
        let checkSelected = landItems && landItems.map(land => land.checked);
        return (
            <Fragment>
                {errorSelected === "tooManyLand" ? this.getAlertTooManyLand() :
                    ((errorSelected === 'noLand' || landItems.length === 0) && this.state.buying === false) ? this.getAlertNoLand() :
                        <Modal isOpen={this.state.modalPopup} backdrop="static"
                               className={`custom-modal modal--land-purchase`}>
                            <div className='custom-modal-header'>
                                <img src='/images/bloodland-ui/land-purchare-white.png' alt=''/>
                                구매하기
                                <span className="lnr lnr-cross lnr-custom-close"
                                      onClick={() => this._removeCheckItemWhenClosePuschasePopup()}/>
                            </div>
                            <Fragment>
                                <div className='custom-modal-body'>
                                    <div className='land-trade-list-2'>
                                        <div className='item horizontal-br'>
                                            <div className='item-title text-center '>
                                                선택한 랜드
                                            </div>
                                            <div className='item-edit'>
                                                금액
                                            </div>
                                        </div>
                                        <div className='item horizontal-br'>
                                            <div className='item-title'>
                                                <div className={clsCheckAll} onClick={() => this._checkedAllLand()}/>
                                                전체 선택
                                            </div>
                                            <div className='item-edit text-center'>
                                                구매 랜드 블러드
                                            </div>
                                        </div>
                                    </div>
                                    <div className='land-trade-list-2 list-scrollable' style={{fontSize: '11px'}}>
                                        {
                                            landItems.map((landItem, index) => {
                                                const clsCheckOne = landItem.checked ? 'item-checkbox checked' : 'item-checkbox';
                                                return <div className='item' key={index}>
                                                    <div className='item-title'>
                                                        <div className={clsCheckOne}
                                                             onClick={() => this._checkedOneLand(landItem)}/>
                                                        {landItem.land.quadKey}
                                                    </div>
                                                    <div className='item-edit'>
                                                        <input type="number" readOnly
                                                               value={1}/> Blood
                                                    </div>
                                                </div>
                                            })
                                        }
                                        <div className='item no-content'
                                             style={{height: (279 - 28 - (landItems.length - 1) * 19) + 'px'}}>
                                            <div className='item-title'/>
                                            <div className='item-edit'/>
                                        </div>
                                    </div>
                                    <div className='land-trade-list' style={{padding: '5px 10px 0px 10px'}}>
                                        <div className='item'>
                                            <div className='label-edit'>폴더 이름</div>
                                            <div className='editor no-addition-label'>
                                                <input type='text' value={categoryName}
                                                       onChange={(e) => this._changeCategoryName(e)}/>
                                                <div className='unit'/>
                                            </div>
                                        </div>

                                        <div className='item'>
                                            <div className='label-edit'>선택한 랜드 수</div>
                                            <div className='editor no-addition-label'>
                                                <input readOnly value={totalLandNumber}/>
                                                <div className='unit'>랜드</div>
                                            </div>
                                        </div>

                                        <div className='item'>
                                            <div className='label-edit'>구매 랜드의 블러드 수량</div>
                                            <div className='editor no-addition-label'>
                                                <input readOnly value={convertFloatToLocalString(totalBloodFee)}/>
                                                <div className='unit'>Blood</div>
                                            </div>
                                        </div>

                                        {/*<div className='item'>
                                                                            <div className='label-edit'>구매 수수료</div>
                                                                            <div className='addition-label'>0.01 Blood</div>
                                                                            <div className='editor'>
                                                                                <input readOnly value={ totalPurchaseFee } />
                                                                                Blood
                                                                            </div>
                                                                        </div>*/}

                                        <div className='item'>
                                            <div className='label-edit'>나의 블러드 수량</div>
                                            <div className='editor no-addition-label'>
                                                <input readOnly value={convertFloatToLocalString(goldBlood)}/>
                                                <div className='unit'>Blood</div>
                                            </div>
                                        </div>

                                        <div className='item'>
                                            <div className='label-edit'>구매 후 나의 블러드</div>
                                            <div className='editor no-addition-label'>
                                                <input readOnly
                                                       value={convertFloatToLocalString(goldBlood - (totalBloodFee + totalPurchaseFee))}/>
                                                <div className='unit'>Blood</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='custom-modal-footer-action-group'>
                                    {/*<button>*/}
                                    {/*<img src='/images/bloodland-ui/rechare-btn.png' alt=''/>*/}
                                    {/*<div>충전</div>*/}
                                    {/*</button>*/}
                                    {
                                        checkSelected.length === 0 ?
                                            <Fragment>
                                                <button
                                                    onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.noSelectedAlert)}>
                                                    <img src='/images/game-ui/sm-ok.svg' alt=''/>
                                                    <div>확인</div>
                                                </button>
                                                <button
                                                    onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.noSelectedAlert)}>
                                                    <img src='/images/game-ui/sm-recycle.svg' alt=''/>
                                                    <div>삭제</div>
                                                </button>
                                            </Fragment>
                                            :
                                            <Fragment>
                                                <button onClick={() => this._checkEmptyLandBeforeOpenConfirmPopup()}>
                                                    <img src='/images/game-ui/sm-ok.svg' alt=''/>
                                                    <div>확인</div>
                                                </button>
                                                <button
                                                    onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.deletedLandAlert)}>
                                                    <img src='/images/game-ui/sm-recycle.svg' alt=''/>
                                                    <div>삭제</div>
                                                </button>
                                            </Fragment>
                                    }
                                    <button onClick={() => this._removeCheckItemWhenClosePuschasePopup()}>
                                        <img src='/images/game-ui/sm-close.svg' alt=''/>
                                        <div>취소</div>
                                    </button>
                                </div>
                            </Fragment>
                        </Modal>}
            </Fragment>
        )
    };

    _removeCheckItemWhenClosePuschasePopup() {
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
        this.handleHidePopup();
    }

    validateCategoryName = (value) => {
        const allCate = this.props.lands.categories;
        let categorieNames = allCate.map((item, index) => {
            return item.category.name
        });

        let rules = new Rules.ValidationRules();
        if (rules.checkLength(value, 36, '_'))
            return this.setState({
                error: rules.checkLength(value, 36, '문자 수는 ' + 36 + ' 미만이어야합니다.'),
                modalAlertPopup: true
            });
        if (rules.checkExistName(value, categorieNames, '_'))
            return this.setState({
                error: rules.checkExistName(value, categorieNames, '이미 존재하는 이름입니다.'),
                modalAlertPopup: true
            });
    }


    hidePopupAnClearError = () => {
        this.setState({
            modalAlertPopup: false,
            error: null
        });
    }

    _checkEmptyLandBeforeOpenConfirmPopup = () => {
        //no check when buy land
        //vuongcheck
        this.validateCategoryName(this.state.categoryName.trim());

        if (this.state.categoryName.trim() === '' || this.state.categoryName === null) return this.handleShowAlertPopup(this.alertPopupScreen.folderNameEmptyAlertPopup);
        if (this.state.calculatorBuyLand.totalLandNumber <= 0) return this.handleShowAlertPopup(this.alertPopupScreen.noSelectedAlert);
        //not enough blood when buy land
        if (this.state.calculatorBuyLand.myBloodAfterBuy <= 0) return this.handleShowAlertPopup(this.alertPopupScreen.notEnoughBloodAlert);
        //show confirm buy
        this.handleShowAlertPopup(this.alertPopupScreen.purchaseLandConfirmAlert);
    };
    confirmLandPurchase = () => {
        const {_id, wToken, nid, name, role} = this.props.user;
        let filterCheckedLand = this.state.landItems.filter(landItems => landItems.checked);
        if (filterCheckedLand && filterCheckedLand.length > 0) {
            let arrTransferBlood = filterCheckedLand.map(landItem => {
                let buyLand = landItem.land;
                if (buyLand.user) {
                    return {
                        sender: _id,
                        receiver: buyLand.user._id,
                        receivernId: buyLand.user.nid || buyLand.user._id + " nId",
                        amount: 1,
                        //item: 'quadKey',
                        //testNote: "other user",
                        quadKey: buyLand.quadKey,
                    }
                } else {
                    return {
                        sender: _id,
                        receiver: null,/*'santa'wId ? '5c40074457eb466c2a65d7c5' : undefined,*/
                        receivernId: 0,
                        amount: 1,
                        //item: 'quadKey',
                        //testNote: "santa",
                        quadKey: buyLand.quadKey,
                    }
                }
            });

            let objBuyLand = {
                categoryName: this.state.categoryName,
                userId: _id,
                userRole: role,
                wToken,
                name,
                wId: "wId User",
                nid: nid ? nid : "buyer nid",
                quadKeys: filterCheckedLand.reduce((allQK, landItem) => allQK.concat(landItem.land.quadKey), []),
                buyMode: 'forbid',
            };

            let landDeleteInCart = this.state.landItems.filter(landItem => landItem.checked);
            if (this.props.mode === 'CART') this.props.updateList(landDeleteInCart);

            this.setState({buying: true, landItems: []});
            this.props.clearSelected();
            this.props.transferBloodTradingLand({transferBloods: arrTransferBlood, buyLands: objBuyLand});
            this.handleHideAlertPopup();
            this.handleHidePopup();
            if (this.state.calculatorBuyLand.totalLandNumber > 400) this.handleShowAlertPopup(this.alertPopupScreen.waitingAlert);
        }
    };

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    };

    removeCheckedItem() {
        let newLandItems = [...this.state.landItems];
        newLandItems = newLandItems.filter(slTile => slTile.checked === false);

        if (this.props.mode === 'CART') {
            //let removeLand = this.state.landItems.filter(landItem => landItem.checked).map(landItem => landItem.land);
            this.getSuccessAlertPopup();
        }

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

    hideAndRefreshPage = () => {
        this.handleHideAllPopup();
    };

    alertPopupScreen = {
        noPopup: 22,
        deletedLandAlert: 21,
        purchaseLandConfirmAlert: 22,
        waitingAlert: 23, //cho
        successAlert: 24,
        errorAlert: 25,
        noLandAlert: 26,
        addCartAlert: 27,
        addCartSuccessAlert: 28,
        reLoginAlert: 29,
        noSelectedAlert: 30,
        waitingNoBlockAlert: 31, //c
        notEnoughBloodAlert: 32,
        folderNameEmptyAlertPopup: 33
    };


    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.deletedLandAlert === this.state.currentAlertPopUp && this.getDeletedLandAlertPopup()}
                {this.alertPopupScreen.purchaseLandConfirmAlert === this.state.currentAlertPopUp && this.getPurchaseLandConfirmAlertPopup()}
                {this.alertPopupScreen.waitingAlert === this.state.currentAlertPopUp && this.getWaitingAlertPopup()}
                {this.alertPopupScreen.successAlert === this.state.currentAlertPopUp && this.getSuccessAlertPopup()}
                {this.alertPopupScreen.errorAlert === this.state.currentAlertPopUp && this.getErrorAlertPopup()}
                {this.alertPopupScreen.noSelectedAlert === this.state.currentAlertPopUp && this.getNoSelectedAlert()}
                {this.alertPopupScreen.waitingNoBlockAlert === this.state.currentAlertPopUp && this.waitingNoBlockAlertPopup()}
                {this.alertPopupScreen.notEnoughBloodAlert === this.state.currentAlertPopUp && this.getNotEnoughBloodAlertPopup()}
                {this.alertPopupScreen.folderNameEmptyAlertPopup === this.state.currentAlertPopUp && this.getFolderNameEmptyAlertPopup()}
                {this.alertPopupScreen.reLoginAlert === this.state.currentAlertPopUp && this.getReLoginAlertPopup()}
                {/*waitingNoBlockAlert*/}
                {this.state.error && this.getValidateAlertPopup()}
            </Fragment>
        );
    };

    getValidateAlertPopup() {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.hidePopupAnClearError();
        const header = '오류';
        const body = this.state.error;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getAlertNoLand() {
        const modal = this.state.modalPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '오류';
        const body = '구매할 랜드를 선택하십시오.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getAlertTooManyLand() {
        const modal = this.state.modalPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '오류';
        const body = '선택한 토지는 3000보다 낮아야합니다.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getPurchaseLandConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmLandPurchase();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '구매';
        const body = '선택한 랜드를 정말로 구매 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getNoSelectedAlert = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body = '구매하기 전에 땅을 선택하십시오!';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };


    getNotEnoughBloodAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup ();
        const header = '알림';
        const body = ' 블러드 잔액이 부족합니다<br/>웹 지갑에서 송금하세요'
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getWaitingAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const sign = "loading"; //blood //success //error //delete //loading
        const header = '알림';
        const body = '랜드 구매 중! 잠시만 기다려주세요!';
        return <MessageBox modal={modal} sign={sign} header={header} body={body} />
    };

    getSuccessAlertPopup = () => {
        const {totalLandPurchase, buySuccess} = this.state;

        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.hideAndRefreshPage();
        const header = `완료`;
    const body = `선택한 ${<span className='text-selected'>{totalLandPurchase}</span>}개의 랜드 중 ${<span className='text-total'>{buySuccess}</span>}개의 랜드 구매에 성공하였습니다.`;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    waitingNoBlockAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "loading"; //blood //success //error //delete //loading
        const confirmBtn = () => this.hideAndRefreshPage();
        const header = '알림';
        const body = '시스템이 토지 구입을 처리 중입니다.';
        return <MessageBox modal={modal} sign={sign} header={header} body={body} mode={mode} confirmBtn={confirmBtn}/>

    };

    getErrorAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '알림';
        const body =  `구매 할 수 없는 랜드가 포함되어 <br/>구매에 실패 하였습니다.`
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getFolderNameEmptyAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body =  `올바른 폴더명을 입력해주세요`
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getReLoginAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => window.location.href = 'https://wallet.blood.land/sns/logout/ext?appId=' + bloodAppId;
        const noBtn = () => this.handleHideAllPopup();
        const sign = "error"; //blood //success //error //delete //loading
        const header = '재 로그인';
        const body =  `토큰 지갑이 만료되면 다시 로그인하여 토큰을 검색합니까?`
        return <MessageBox modal={modal} mode={mode} sign={sign} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getDeletedLandAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmDeleteSelectedLand();
        const noBtn = () => this.handleHideAlertPopup();
        const sign = "error"; //blood //success //error //delete //loading
        const header = '삭제';
        const body =  `선택한 랜드를 구매 목록에서 삭제 할까요?`
        return <MessageBox modal={modal} mode={mode} sign={sign} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

}

function mapStateToProps(state) {
    const {lands, authentication: {user}, map, users, notify: {notifies}, wallet} = state;
    return {
        notifies,
        user,
        lands,
        map,
        users,
        wallet,
    };
}

const mapDispatchToProps = (dispatch) => ({
    //sendNotification: (param) => dispatch(notificationAction.send(param)),
    getAllCategory: (userId) => {dispatch(landActions.getAllCategory({userId: userId}));},
    addWaitingTile: (tiles) => dispatch(mapActions.addWaitingTile(tiles)),
    removeWaitingTile: (tiles) => dispatch(mapActions.removeWaitingTile(tiles)),
    transferBloodTradingLand: (objTransfer) => dispatch(socketActions.transferBloodTradingLand(objTransfer)),
    clearBloodPurchase: () => dispatch(userActions.clearBloodPurchase()),
    transferBlood: (objTransfer) => dispatch(userActions.transferBlood(objTransfer)),
    transferBloodTrading: (objTransfer) => dispatch(userActions.transferBloodTrading(objTransfer)),
    clearSelected: () => dispatch(mapActions.clearSelected()),
    clearPurchaseStatusSocket: () => dispatch(landActions.clearPurchaseStatusSocket()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LandPurchase)
