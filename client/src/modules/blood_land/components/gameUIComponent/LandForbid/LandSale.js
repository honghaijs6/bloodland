import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import MyLandsCounter from './MyLandsCounter';
import {landActions} from "../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {socketActions} from "../../../../../store/actions/commonActions/socketActions";
import cloneDeep from "lodash.clonedeep";
import SellLandModifyPopup from './SellLandModifyPopup';
import {loadingImage, QuadKeyToLatLong} from '../../general/System';
import MessageBox from './../../general/MessageBox';

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
    PREVIOUS_SCREEN = 0;

    UNSAFE_componentWillReceiveProps(nextProps) {
        const {lands: {categories}} = nextProps;
        if (categories) {
            const {noSellLand, forSellLand} = cloneDeep(categories).reduce((allLand, cateItem) => {
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
                cate.category.lands = cate.category.lands.length > 0
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
    }

    componentDidMount() {
        this.props.getAllCategory(this.props.user._id);
        this.props.getAllLandMarkCategory(this.props.user._id);
    }



    _clickCheckedAll = (mode) => {
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

    _clickCheckbox = (landItem, mode) => {
        if (mode === 'noSell') {
            let noSellLand = [...this.state.noSellLand];
            let fIndex = noSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            noSellLand[fIndex].checked = !landItem.checked;
            const checkedItem = noSellLand.filter(landItem => landItem.checked);
            this.setState({noSellLand, checkAll: checkedItem.length === noSellLand.length });
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
                <div className='screen-content-error'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/> 정보 없음</div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen(this.PREVIOUS_SCREEN)}>
                        <img src='/images/game-ui/sm-back.svg' alt=''/>
                        <div>뒤로</div>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () => {
        return (
            <div className='load-land'>
                <div className='load__icon-wrap'>
                    <div className="lds-roller">
                            <div/><div/><div/><div/><div/><div/><div/><div/>
                    </div>
                </div>
            </div>
        )
    };

    moveToLand = (land) => {
        const center = QuadKeyToLatLong(land.quadKey);
        this.props.syncCenterMap(center, land.quadKey.length - 2, land.quadKey);
        this.handleHideAllPopup();
    };


    getDefaultScreen = () => {
        const {forSellLand} = this.state;
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab2/nav2.svg')} alt=''/>
                    <div>보유 랜드</div>
                </div>
                {
                    this.state.forSaleLandNumber === undefined ? this.loading() :
                        this.state.forSaleLandNumber === 0 ? this.getNoInfoView() :
                            <Fragment>
                                <div className='sub-screen-content-3'>
                                    <MyLandsCounter title='판매중인 랜드 수량' totalLandNumber={this.state.forSaleLandNumber}/>
                                </div>
                                <div className='sub-screen-content-4'>
                                    <div className='header-tb'>
                                        <div style={{width: '158px'}}>랜드</div>
                                        <div style={{width: '60px'}}>판매 금액</div>
                                    </div>
                                </div>
                                <div className='screen-content-4 no-padding-bottom' style={{overflowX:'hidden'}}>
                                    <div className='my-forbid-land-sale-list'>
                                        <div className='item '>
                                            <div className={'checkbox' + (this.state.checkAll ? ' checked' : '')}
                                                 onClick={() => this._clickCheckedAll('forSale')}/>
                                            <div className='item-content'>
                                                <div className='item-col-115'>
                                                    <span
                                                        className='select-all-hover'>전체선택
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {forSellLand.map((landItem, index) => {
                                            return <div key={index} className='item'>
                                                <div className={'checkbox' + (landItem.checked ? ' checked' : "")}
    onClick={() => this._clickCheckbox(landItem, 'forSale')}/>
                                                <div className='item-content'>
                                                    <div className='item-col-115'>
                                                        <div
                                                            className='child-hover'
                                                            onClick={() => this.moveToLand(landItem.land)}
                                                        >
                                                            {landItem.land.name ? landItem.land.name : landItem.land.quadKey}
                                                        </div>
                                                    </div>
                                                    <div className='item-col-50'>
                                                        <div className='child-hover'>{landItem.land.sellPrice}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className='action-group'>
                                    <button onClick={() => this.props.handleChangeScreen(this.PREVIOUS_SCREEN)}>
                                        <img src='/images/game-ui/sm-back.svg' alt=''/>
                                        <div>뒤로</div>
                                    </button>
                                    <SellLandModifyPopup forSellLandSelected={ this.state.forSellLand.filter(landItem => landItem.checked) } />
                                    <button
                                        onClick={() => this._checkBeforeDeleteLand()}>
                                        <img src='/images/bloodland-ui/delete-land.png' alt=''/>
                                        <div>판매취소</div>
                                    </button>
                                </div>
                            </Fragment>
                }

            </Fragment>
        );
    };

    _checkBeforeDeleteLand(){
        if(this.state.forSellLand && this.state.forSellLand.filter(landItem => landItem.checked).length > 0){
            this.handleShowAlertPopup(this.alertPopupScreen.cancelLandSaleAlert)
        } else {
            this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToDeleteAlert);
        }
    }

    render() {
        //const modalPopup = this.getModalPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {
                    this.screen.default === this.state.currentScreen ? this.getDefaultScreen() : ''
                }
                {/*modalPopup*/}
                {alertPopup}
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
        const newSellPrice = e.target.value
        if (e.target.value) {
            let newSellLand = [...this.state.sellLand].map(landItem => {
                landItem.land.sellPrice = newSellPrice;
                return landItem;
            });
            this.setState({sellPrice: newSellPrice, sellLand: newSellLand});
        }
    };

    _confirmRemoveLand = () => {
        if (this.state.unselling === false) {
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
                mode: 'remove_sell',
            };
            this.setState({unselling: true});
            this.props.sellLandSocket(objUnsellLand);
        }
        //redirect
        this.handleHideAlertPopup();
    };

    confirmModifySellLand = () => {
        this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifySuccessAlert);
    };

    handleHideAllPopup = () => {
        this.handleHidePopup();
        this.handleHideAlertPopup();
    }

    alertPopupScreen = {
        noPopup: 20,
        cancelLandSaleAlert: 21,
        cancelLandSaleSuccessAlert: 22,
        sellLandModifyCancelAlert: 23,
        sellLandModifyConfirmAlert: 24,
        sellLandModifySuccessAlert: 25,
        noSelectedLandToDeleteAlert: 26
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.cancelLandSaleAlert === this.state.currentAlertPopUp && this.getCancelLandSaleAlertPopup() }
                {this.alertPopupScreen.cancelLandSaleSuccessAlert === this.state.currentAlertPopUp && this.getCancelLandSaleSuccessAlertPopup() }
                {this.alertPopupScreen.sellLandModifyCancelAlert === this.state.currentAlertPopUp && this.getSellLandModifyCancelAlertPopup() }
                {this.alertPopupScreen.sellLandModifyConfirmAlert === this.state.currentAlertPopUp && this.getSellLandModifyConfirmAlertPopup() }
                {this.alertPopupScreen.sellLandModifySuccessAlert === this.state.currentAlertPopUp && this.getSellLandModifySuccessAlertPopup() }
                {this.alertPopupScreen.noSelectedLandToDeleteAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToDeletePopup() }
            </Fragment>
        );
    };
    
    getCancelLandSaleAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this._confirmRemoveLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '판매 취소';
        const body = '선택하신 랜드판매를 취소 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getCancelLandSaleSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '완료';
        const body = '삭제를 완료 하였습니다.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandModifyCancelAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.handleHideAllPopup();
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
        const body = '선택한 랜드를 판매등록 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifySuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header =  '등록 하기';
        const body = '선택한 랜드를 판매등록 하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getNoSelectedLandToDeletePopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body =  '판매 취소할 랜드를 선택해주세요';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}

function mapStateToProps(state) {
    const {lands, authentication: {user}, map} = state;
    return {
        lands,
        user,
        map
    };
}

const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    getAllCategory: (userId) => dispatch(landActions.getAllCategory({userId})),
    getAllLandMarkCategory: (userId) => dispatch(landActions.getAllLandMarkCategory({userId}))
});

export default connect(mapStateToProps, mapDispatchToProps)(LandSale);