import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import cloneDeep from "lodash.clonedeep";
import {validatePrice} from '../../landMapComponent/component/MapFunction';
import {loadingImage} from "../../general/System";
import MessageBox from './../../general/MessageBox';

class SellLandModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,

            forSellLandSelected: null,
            re_selling: false,
            sellPrice: null,
            checkAll: false,
            resetPriceWhenOpen: true,
            limitPrice: false
        };
    }

    screen = {
        default: 0
    };

    popupScreen = {
        noPopup: 10,
        sellLandModify: 11,
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
            modalPopup: false,
            checkAll: false
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

    PREVIOUS_SCREEN = 0;

    componentDidMount() {
        this.props.getAllCategory(this.props.user._id);
        this.setState({sellPrice: this.props.lands.defaultLandPrice});
    }

    componentDidUpdate() {
        const {isOwnSell, sellSuccess} = this.props.lands;
        if (isOwnSell && this.state.re_selling === true) {
            if (sellSuccess) {
                this.handleShowAlertPopup(this.alertPopupScreen.cancelLandSaleSuccessAlert);
            }
            this.props.clearForSaleStatusSocket();
            this.props.getAllCategory(this.props.user._id);
            this.setState({re_selling: false});
        }
    }

    getDefaultScreen = () => {
        return (
            <button onClick={() => this._checkSelectedSellLandBeforeOpenEditSellLand()}>
                <img src={loadingImage('/images/game-ui/sm-change-land-price.svg')} alt=''/>
                <div>수정</div>
            </button>
        );
    };

    _checkSelectedSellLandBeforeOpenEditSellLand() {
        if (this.props.forSellLandSelected && this.props.forSellLandSelected.length > 0) {
            let forSellLandSelected = cloneDeep(this.props.forSellLandSelected).map(landItem => {
                landItem.checked = false;
                return landItem;
            });
            this.setState({forSellLandSelected: forSellLandSelected || [], resetPriceWhenOpen: false})
            this.handleShowPopup(this.popupScreen.sellLandModify);
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToModifyAlert);
        }
    }

    render() {
        const modalPopup = this.getModalPopup();
        const alertPopup = this.getAlertModalPopup();
        const defaultScreen = this.getDefaultScreen();
        return (
            <Fragment>
                {defaultScreen}
                {alertPopup}
                {modalPopup}
            </Fragment>
        );
    }

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.sellLandModify === this.state.currentPopupScreen ? this.getSellLandModifyPopup() : ''}
            </Fragment>
        );
    };

    _changePriceAll = (e) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newForSellLandSelected = [...this.state.forSellLandSelected].map(landItem => {
                landItem.land.sellPrice = newSellPrice;
                return landItem;
            });
            this.setState(() => ({
                sellPrice: newSellPrice,
                forSellLandSelected: newForSellLandSelected,
                limitPrice: false
            }));
        } else {
            this.setState({limitPrice: true});
        }
    };

    _clickCheckedAll = () => {
        const {forSellLandSelected} = this.state;
        let newForSellLandSelected = [...forSellLandSelected].map(landItem => {
            landItem.checked = !this.state.checkAll;
            return landItem;
        });
        this.setState({checkAll: !this.state.checkAll, forSellLandSelected: newForSellLandSelected});
    };

    _clickCheckbox = (landItem) => {
        let newForSellLandSelected = [...this.state.forSellLandSelected];
        let fIndex = newForSellLandSelected.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey);
        newForSellLandSelected[fIndex].checked = !landItem.checked;
        let checkedLand = newForSellLandSelected.filter(landItem => landItem.checked);
        this.setState({
            forSellLandSelected: newForSellLandSelected,
            checkAll: checkedLand.length === newForSellLandSelected.length
        });
    };

    _changePriceOne = (e, landItem) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newForSellLandSelected = [...this.state.forSellLandSelected];
            let fIndex = newForSellLandSelected.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            newForSellLandSelected[fIndex].land.sellPrice = newSellPrice;
            this.setState({forSellLandSelected: newForSellLandSelected, limitPrice: false});
        } else {
            this.setState({limitPrice: true});
        }
    };

    _changeTotalReSellLand = () => {
        let total = parseFloat([...this.state.forSellLandSelected].reduce((total, landItem) => total + parseFloat(landItem.land.sellPrice), 0)).toFixed(2);
        return parseFloat(total).toLocaleString();
    }

    getSellLandModifyPopup = () => {
        return (
            <Modal isOpen={this.state.modalPopup} backdrop="static" className={`custom-modal modal--land-purchase`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-change-land-price.svg')} alt='' />
                    판매하기
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => this.clearCheckBoxWhenClosePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='land-trade-list-2'>
                        <div className='item horizontal-br'>
                            <div className='item-title text-center '>
                                선택한 랜드
                            </div>
                            <div className='item-edit'>
                                판매 금액
                            </div>
                        </div>
                        <div className='item horizontal-br'>
                            <div className='item-title'>
                                <div className={'item-checkbox' + (this.state.checkAll ? ' checked' : '')}
                                     onClick={() => this._clickCheckedAll()}/>
                                전체 선택
                            </div>
                            <div className='item-edit'>
                                일괄 금액 넣기 <input type='number' onChange={(e) => this._changePriceAll(e)}
                                                value={this.state.sellPrice}/> Blood
                            </div>
                        </div>
                    </div>
                    <div className='land-trade-list-2 list-scrollable' style={{height: '348px', fontSize: '11px'}}>
                        {
                            this.state.forSellLandSelected.map((landItem, index) => {
                                return <div className='item' key={index}>
                                    <div className='item-title'>
                                        <div className={'item-checkbox' + (landItem.checked ? ' checked' : "")}
                                             onClick={() => this._clickCheckbox(landItem)}
                                        />
                                        {landItem.land.name ? landItem.land.name : landItem.land.quadKey}
                                    </div>
                                    <div className='item-edit'>
                                        <input type='number' onChange={(e) => this._changePriceOne(e, landItem)}
                                               value={landItem.land.sellPrice}/> Blood
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className='land-trade-list'>
                        <div className='item'>
                            <div className='label-edit'>총 판매 랜드 수</div>
                            <div className='editor no-addition-label'>
                                <span style={{
                                    marginLeft: '10rem',
                                    marginRight: '0.5rem'
                                }}>{this.state.forSellLandSelected.filter(landItem => landItem.checked).length}</span>
                                랜드
                            </div>
                        </div>
                        {/*                        <div className='item'>
                            <div className='label-edit'>총 판매 랜드 금액</div>
                            <div className='editor'>
                                <input defaultValue={ parseFloat(this.state.forSellLandSelected.reduce((total, landItem) => total + parseFloat(landItem.land.sellPrice), 0) ).toFixed(2) } />
                                Blood
                                </div>
                        </div>*/}
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this._checkSelectedBeforeConfirmModifyLand()}>
                        <img src='/images/game-ui/sm-ok.svg' alt=''/>
                        <div>확인</div>
                    </button>
                    <button onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifyCancelAlert)}>
                        <img src='/images/game-ui/sm-close.svg' alt=''/>
                        <div>취소</div>
                    </button>
                </div>
            </Modal>
        )
    };

    _checkSelectedBeforeConfirmModifyLand() {
        if (this.state.forSellLandSelected && this.state.forSellLandSelected.filter(checkedLand => checkedLand.checked).length > 0) {
            this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifyConfirmAlert);
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToModifyAlert);
        }
    }

    clearCheckBoxWhenClosePopup() {
        let clearForSellLand = [...this.state.forSellLandSelected].map(landItem => {
            landItem.checked = false;
            return landItem;
        });
        this.setState({
            forSellLandSelected: clearForSellLand,
            checkAll: false,
            resetPriceWhenOpen: true,
            sellPrice: this.props.lands.defaultLandPrice,
        });
        this.handleHideAllPopup();
    }

    confirmModifySellLand = () => {
        if (this.state.re_selling === false) {
            const arrQuadkey = [...this.state.forSellLandSelected].reduce((quadKeys, landItem) => {
                if (landItem.checked) {
                    quadKeys = quadKeys.concat({quadKey: landItem.land.quadKey, landPrice: landItem.land.sellPrice});
                }
                return quadKeys;
            }, []);
            this.setState({re_selling: true});
            //re-sell after change price

            const param = {
                userId: this.props.user._id,
                forSaleStatus: true,
                quadKeys: arrQuadkey,
                mode: 're_selling',
                nid: this.props.user.nid || 222222222,
            }
            this.props.sellLandSocket(param);
        }
    };
    
    alertPopupScreen = {
        noPopup: 20,
        cancelLandSaleAlert: 21,
        cancelLandSaleSuccessAlert: 22,
        sellLandModifyCancelAlert: 23,
        sellLandModifyConfirmAlert: 24,
        sellLandModifySuccessAlert: 25,
        noSelectedLandToModifyAlert: 26,
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.cancelLandSaleSuccessAlert === this.state.currentAlertPopUp && this.getCancelLandSaleSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandModifyCancelAlert === this.state.currentAlertPopUp && this.getSellLandModifyCancelAlertPopup()}
                {this.alertPopupScreen.sellLandModifyConfirmAlert === this.state.currentAlertPopUp && this.getSellLandModifyConfirmAlertPopup()}
                {this.alertPopupScreen.sellLandModifySuccessAlert === this.state.currentAlertPopUp && this.getSellLandModifySuccessAlertPopup()}
                {this.alertPopupScreen.noSelectedLandToModifyAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToModifyAlertPopup()}
            </Fragment>
        );
    };

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    }

    getCancelLandSaleSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '완료';
        const body = '수정을 완료하였습니다';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandModifyCancelAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.clearCheckBoxWhenClosePopup();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '취소 하기';
        const body = '판매등록을 정말로 취소 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifyConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmModifySellLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '등록 하기';
        const body = '판매 정보를 수정하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifySuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '등록 하기';
        const body = '선택한 랜드를 판매등록 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getNoSelectedLandToModifyAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body = '수정할 랜드를 선택해주세요.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}

//랜드를 선택해주세요
function mapStateToProps(state) {
    const {lands, authentication: {user}, map} = state;
    return {
        lands,
        user,
        map
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    getAllCategory: (userId) => {dispatch(landActions.getAllCategory({userId}))}
});

export default connect(mapStateToProps, mapDispatchToProps)(SellLandModify);
