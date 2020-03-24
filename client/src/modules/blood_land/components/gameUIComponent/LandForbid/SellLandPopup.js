import React, { Fragment, Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Modal } from 'reactstrap';
import { landActions } from "../../../../../store/actions/landActions/landActions";
import { mapActions } from "../../../../../store/actions/commonActions/mapActions";
import { socketActions } from "../../../../../store/actions/commonActions/socketActions";
import cloneDeep from "lodash.clonedeep";
import UnselectedAlert from "../UserInfo/component/unselectedAlertPopup";
import { validatePrice } from "../../landMapComponent/component/MapFunction";
import { loadingImage } from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import MessageBox from './../../general/MessageBox';

class LandManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalPopup: false,
            modalAlertPopup: false,
            currentPopupScreen: this.popupScreen.noPopup,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            //
            sellLand: [],
            sellPrice: 0,
            selling: false,
            checkAll: false,
            data: 0,
            unSelectedPopup: false,
            limitPrice: false,
        }
    }

    popupScreen = {
        noPopup: 10,
        sellLand: 1,
    };

    getDefaultScreen = () => {
        return (
            <button onClick={() => this._createDataToSellLand()}>
                <img src={loadingImage(`/images/game-ui/sm-sell-land.svg`)} alt='' />
                <div>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand'} />
                    {/* aloalo */}
                </div>
            </button>
        );
    }

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

    _createDataToSellLand = () => {
        let cateChecked = cloneDeep(this.props.categories).reduce((allLand, cateItem) => {
            if (cateItem.category && cateItem.category.lands && cateItem.category.lands.length > 0) {
                let landChecked = cateItem.category.lands.reduce((allChkLand, landItem) => {
                    if (landItem.checked === true) {
                        landItem.checked = false;
                        allChkLand = allChkLand.concat(landItem);
                    }
                    return allChkLand;
                }, []);
                allLand = allLand.concat(landChecked);
            }
            return allLand;
        }, []);
        if (cateChecked.length > 0) {
            this.setState({ sellLand: cateChecked });
            this.handleShowPopup(this.popupScreen.sellLand);
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToSellAlert);
        }
    };

    toggle = (data) => {
        this.setState({
            data
        })
    };
    render() {
        const { unSelectedPopup, data } = this.state;
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
                {alertPopup}
                {unSelectedPopup && data === 1 && <UnselectedAlert toggle={(data) => this.toggle(data)} content={'랜드를 선택해주세요'} />}
            </Fragment>
        );
    }

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.sellLand === this.state.currentPopupScreen ? this.getSellLandPopup() : ''}
            </Fragment>
        );
    };


    componentDidMount() {
        this.setState({ sellPrice: this.props.lands.defaultLandPrice });
    }


    componentDidUpdate() {
        const { isOwnSell, sellSuccess } = this.props.lands;
        if (isOwnSell && this.state.selling === true) {
            if (sellSuccess) {
                this.handleShowAlertPopup(this.alertPopupScreen.sellLandSuccessAlert);
            } else {

            }
            this.props.clearForSaleStatusSocket();
            this.props.getAllCategory(this.props.user._id);
            this.setState({ selling: false });
        }
    }

    _clickCheckedAll = () => {
        let newSellLand = [...this.state.sellLand].map(landItem => {
            landItem.checked = !this.state.checkAll;
            return landItem;
        });
        this.setState({ checkAll: !this.state.checkAll, sellLand: newSellLand });
    };

    _changePriceAll = (e) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            //limitPrice
            let newSellLand = [...this.state.sellLand].map(landItem => {
                landItem.land.sellPrice = newSellPrice;
                return landItem;
            });
            this.setState({ sellPrice: newSellPrice, sellLand: newSellLand, limitPrice: false });
        } else {
            this.setState({ limitPrice: true });
        }
    };

    _clickCheckbox = (landItem) => {
        let newSellLand = [...this.state.sellLand];
        let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
        newSellLand[fIndex].checked = !landItem.checked;
        const checkedItem = newSellLand.filter(landItem => landItem.checked);
        this.setState({ sellLand: newSellLand, checkAll: checkedItem.length === newSellLand.length });
    };

    _changePriceOne = (e, landItem) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newSellLand = [...this.state.sellLand];
            let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            newSellLand[fIndex].land.sellPrice = newSellPrice;
            this.setState({ sellLand: newSellLand, limitPrice: false });
        } else {
            this.setState({ limitPrice: true });
        }
    };

    // _deleteLandSell = () => {
    //     let newSellLand = [...this.state.sellLand];
    //     let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
    //     newSellLand[fIndex].checked = !landItem.checked;
    //     this.setState({ sellLand: newSellLand });
    // }

    _changeTotalSellLand() {
        let total = this.state.sellLand.reduce((total, landItem) => total + parseFloat(landItem.land.sellPrice), 0);
        return parseFloat(total).toLocaleString();
    }

    _clearCheckBoxWhenClosePopup() {
        const newSellLand = [...this.state.sellLand].map(landItem => {
            landItem.checked = false;
            return landItem;
        });
        this.setState({ sellLand: newSellLand, checkAll: false, sellPrice: this.props.lands.defaultLandPrice });
        this.handleHideAllPopup();
    }

    getSellLandPopup = () => {
        const { sellLand } = this.state;
        const sellLandFilter = sellLand.filter(sellLand => sellLand.checked);
        return (
            <Modal isOpen={this.state.modalPopup} backdrop="static" className={`custom-modal modal--land-purchase`}>
                <div className='custom-modal-header'>
                    <img src='/images/bloodland-ui/land-purchare-white.png' alt='' />
                    판매 하기
                    <span className="lnr lnr-cross lnr-custom-close"
                        onClick={() => this._clearCheckBoxWhenClosePopup()} />
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
                                    onClick={() => this._clickCheckedAll()} />
                                전체 선택
                            </div>
                            <div className='item-edit'>
                                일괄 금액 넣기
                                <input type='number'
                                    onChange={(e) => this._changePriceAll(e)}
                                    value={this.state.sellPrice}
                                /> Blood
                            </div>
                        </div>
                    </div>
                    <div className='land-trade-list-2 list-scrollable' style={{ height: '348px' }}>
                        {
                            this.state.sellLand.map((landItem, index) => {
                                return <div className='item' key={index}>
                                    <div className='item-title'>
                                        <div className={'item-checkbox' + (landItem.checked ? ' checked' : "")}
                                            onClick={() => this._clickCheckbox(landItem)} />
                                        {landItem.land.name ? landItem.land.name : landItem.land.quadKey}
                                    </div>
                                    <div className='item-edit'>
                                        <input type='number'
                                            onChange={(e) => this._changePriceOne(e, landItem)}
                                            value={landItem.land.sellPrice}
                                        /> Blood
                                    </div>
                                </div>
                            })
                        }
                        <div className='item no-content'
                            style={{ height: (347 - this.state.sellLand.length * 27) + 'px' }}>
                            <div className='item-title' />
                            <div className='item-edit' />
                        </div>
                    </div>
                    <div className='land-trade-list'>
                        <div className='item'>
                            <div className='label-edit'>총 판매 랜드 수</div>
                            <div className='addition-label' />
                            <div className='editor'>
                                <span style={{
                                    marginLeft: '10rem',
                                    marginRight: '0.5rem'
                                }}>{this.state.sellLand ? (this.state.sellLand.filter(landItem => landItem.checked)).length : 0}</span>
                                랜드
                            </div>
                        </div>
                        {/*<div className='item'>
                            <div className='label-edit'>총 판매 랜드 금액</div>
                            <div className='addition-label'></div>
                            <div className='editor'>
                                <input defaultValue={ this._changeTotalSellLand() } />
                                Blood
                                </div>
                        </div>*/}
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    {sellLandFilter.length === 0 ? <button onClick={() => { this.setState({ unSelectedPopup: true, data: 1 }) }}>
                        <img src='/images/game-ui/sm-ok.svg' alt='' />
                        <div>확인</div>
                    </button> :
                        <button onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.sellLandConfirmAlert)}>
                            <img src='/images/game-ui/sm-ok.svg' alt='' />
                            <div>확인</div>
                        </button>}

                    <button onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.sellLandCancelAlert)}>
                        <img src='/images/game-ui/sm-close.svg' alt='' />
                        <div>취소</div>
                    </button>
                </div>
            </Modal>
        )
    };

    confirmDeleteSelectedCat = () => {
        this.handleShowAlertPopup(this.alertPopupScreen.deletedCateSuccessAlert);
    };

    _confirmSellLand() {
        if (this.state.selling === false) {
            const arrQuadkey = [...this.state.sellLand].reduce((quadKeys, landItem) => {
                if (landItem.checked) {
                    quadKeys = quadKeys.concat({ quadKey: landItem.land.quadKey, landPrice: landItem.land.sellPrice });
                }
                return quadKeys;
            }, []);

            // //sellLand
            // let objSellLand = {
            //     userId: this.props.user._id,
            //     forSaleStatus: true,
            //     quadKeys: arrQuadkey,
            //     mode: "sell",
            //     nid: this.props.user.nid || 333333333,
            // };
            // console.log(objSellLand);
            this.setState({ selling: true });

            let param = {
                quadKeys: arrQuadkey.map(q => q.quadKey),
                token: this.props.user.wToken,
                userId: this.props.user._id,
                forSaleStatus: true
            }
            this.props.changeLandMarkState(param);
            // this.props.sellLandSocket(objSellLand);
        }
        //redirect
        this.handleShowAlertPopup(this.alertPopupScreen.sellLandSuccessAlert);
    }

    removeLandWhenStay() {
        //const newSellLand = [...this.state.sellLand].filter(landItem => landItem.checked === false);
        //this.setState({ sellLand: newSellLand });
        this.handleHideAlertPopup();
    }

    reloadData = () => {
        this.props.uncheckAndUpdateCategories();
        this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.landSale);
    }

    resetData = () => {
        this.props.resetData(this.props.user._id);
        this.handleHideAllPopup();
    };

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    }
    
    alertPopupScreen = {
        noPopup: 20,
        sellLandCancelAlert: 23,
        sellLandConfirmAlert: 24,
        sellLandSuccessAlert: 25,
        sellLandFailureAlert: 26,
        noSelectedLandToSellAlert: 27,
    };
    
    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.deletedCateAlert === this.state.currentAlertPopUp          && this.getDeletedCateAlertPopup()}
                {this.alertPopupScreen.deletedCateSuccessAlert === this.state.currentAlertPopUp   && this.getDeletedCateSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandCancelAlert === this.state.currentAlertPopUp       && this.getSellLandCancelAlertPopup()}
                {this.alertPopupScreen.sellLandConfirmAlert === this.state.currentAlertPopUp      && this.getSellLandConfirmAlertPopup()}
                {this.alertPopupScreen.sellLandSuccessAlert === this.state.currentAlertPopUp      && this.getSellLandSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandFailureAlert === this.state.currentAlertPopUp      && this.getSellLandFailureAlertPopup()}
                {this.alertPopupScreen.noSelectedLandToSellAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToSellAlertPopup()}
            </Fragment>
        );
    };
    
    getDeletedCateAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const yesBtn = () => this.confirmDeleteSelectedCat();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '삭제 하기';
        const body = '폴더를 정말 삭제 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign}/>;
    };

    getDeletedCateSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '완료';
        const body = '삭제를 완료 하였습니다.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandCancelAlertPopup = () => {
        const modal = this.state.modalAlertPopup;    
        const mode = "question"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const yesBtn = () => this.handleHidePopup();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '취소 하기';
        const body = ' 판매등록을 정말로 취소 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} sign={sign} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this._confirmSellLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '등록 하기';
        const body = '선택한 랜드를 판매등록 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const yesBtn = () => this.reloadData();
        const noBtn = () => this.removeLandWhenStay();
        const header = '등록 하기';
        const body = '선택한 랜드 판매 등록이 완료 되었습니다.<br />판매중인 랜드로 이동 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} sign={sign} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandFailureAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '등록 하기';
        const body = '선택한 랜드를 판매등록 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getNoSelectedLandToSellAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body = '판매할 랜드를 선택해주세요.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}

function mapStateToProps(state) {
    const { lands, authentication: { user }, map } = state;
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
    getAllCategory: (userId) => dispatch(landActions.getAllCategory({ userId: userId })),
    changeLandMarkState: (param) => dispatch(landActions.changeLandMarkState(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(LandManagement);