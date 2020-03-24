import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import {landActions} from "../../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../../store/actions/commonActions/mapActions";
import {socketActions} from "../../../../../../store/actions/commonActions/socketActions";
import {validatePrice} from "../../../landMapComponent/component/MapFunction";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";
import MessageBox from '../../../general/MessageBox';
import classNames from 'classnames';

class LandManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalAlertPopup: false,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            //
            sellPrice: 0,
            selling: false,
            checkAll: false,
            data: 0,
            unSelectedPopup: false,
            sellPriceAlertPopup: false,
            limitPrice: false,
        }
    }

    componentDidMount(){
        const {sellLand} = this.props;
        this.setState({
            sellLand,
            sellPrice: this.props.lands.defaultLandPrice
        });
    }
    
    componentDidUpdate() {
        const {isOwnSell, sellSuccess} = this.props.lands;
        if (isOwnSell && this.state.selling === true) {
            if (sellSuccess) {
                this.handleShowAlertPopup(this.alertPopupScreen.sellLandSuccessAlert);
            } else {

            }
            this.props.clearForSaleStatusSocket();
            this.props.getAllCategory(this.props.user._id);
        }
    }

    popupScreen = {
        noPopup: 10,
        sellLand: 1,
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

    toggle = (data) => {
        this.setState({
            data
        })
    };

    render() {
        const popup = this.getSellLandPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {popup}
                {alertPopup}
            </Fragment>
        );
    }

    handleCheckAll = () => {
        let newSellLand = [...this.state.sellLand].map(landItem => {
            if(!landItem.isBigTreeQuadKey){
                landItem.checked = !this.state.checkAll;
            }
            return landItem;
        });
        this.setState({checkAll: !this.state.checkAll, sellLand: newSellLand});
    };

    changePriceAll = (e) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            //limitPrice
            let newSellLand = [...this.state.sellLand].map(landItem => {
                if(!landItem.isBigTreeQuadKey){
                    landItem.land.sellPrice = newSellPrice;
                }
                return landItem;
            });
            this.setState({sellPrice: newSellPrice, sellLand: newSellLand, limitPrice: false});
        } else {
            this.setState({limitPrice: true});
        }
    };

    handleCheckLand = (landItem) => {
        let newSellLand = [...this.state.sellLand];
        let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey);
        if(!landItem.isBigTreeQuadKey){
            newSellLand[fIndex].checked = !landItem.checked;
        }
        const checkedItem = newSellLand.filter(landItem => landItem.checked);
        this.setState({sellLand: newSellLand, checkAll: checkedItem.length === newSellLand.length});
    };

    changePriceOne = (e, landItem) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newSellLand = [...this.state.sellLand];
            let fIndex = newSellLand.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            newSellLand[fIndex].land.sellPrice = newSellPrice;
            this.setState({sellLand: newSellLand, limitPrice: false});
        } else {
            this.setState({limitPrice: true});
        }
    };

    clearCheckBoxWhenClosePopup = () => {
        const newSellLand = [...this.state.sellLand].map(landItem => {
            landItem.checked = false;
            return landItem;
        });
        this.setState({sellLand: newSellLand, checkAll: false, sellPrice: this.props.lands.defaultLandPrice});
        this.handleHideAllPopup();
    }

    sellLands = (errorStatus,sellLandFilter) =>{
        if(errorStatus){
            if (sellLandFilter.length === 0 ) {
                this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToSellAlert);
            } else {
                this.handleShowAlertPopup(this.alertPopupScreen.limitSellPriceAlert);
            }
        }
        else{
            this.handleShowAlertPopup(this.alertPopupScreen.sellLandConfirmAlert)
        }
    }

    getSellLandPopup = () => {
        const {sellLand,sellPrice,checkAll} = this.state;
        const {modalPopup} = this.props;
        const checkAllClass = classNames({
            'check-box':true,
            'checked' : checkAll,
        })
        const sellLandFilter = sellLand && sellLand.filter(sellLand => sellLand.checked);
        const sellLandPriceFilter = sellLand && sellLand.filter(sellLand => sellLand.land.sellPrice < 1);
        const errorStatus = sellLandFilter && (sellLandFilter.length === 0 || sellPrice === 0 || sellLandPriceFilter.length !== 0);
        const selectedLandLength = sellLand && sellLand.filter(landItem => landItem.checked).length;
        const spacing = <div className='item-row'><div className='land-col'></div><div className='blood-col'></div></div>;
        // console.log('modalPopup',modalPopup);
        return sellLand && (
            <Modal isOpen={modalPopup} backdrop="static" className={`custom-modal modal--land-sell`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-sell-land.svg')} alt=''/>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.sell'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => this.props.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='sell-land-container'>
                        <div className='header-grid'>
                            <div className='land-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.selectLand'}/></div>
                            <div className='blood-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.salePrice'}/></div>

                            <div className='land-sub-col'>
                                <div className={checkAllClass} onClick={() => this.handleCheckAll()} />
                                <span onClick={() => this.handleCheckAll()} ><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.selectAll'}/></span>
                                <div > &nbsp;{`(${ (Array.isArray(sellLand) && sellLand.length) || 0 })`} </div>
                            </div>
                            <div className='blood-sub-col'>
                                <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.amount'}/>
                                <input type='number' onChange={(e) => this.changePriceAll(e)} value={sellPrice} /> Blood
                            </div>
                        </div>
                                           
                        <div className='body-grid'>
                            {spacing}
                            {
                                sellLand.map((landItem, index) => {
                                    const checkBoxClass = classNames({
                                        'check-box':true,
                                        'checked' : landItem.checked,
                                        'hide':landItem.isBigTreeQuadKey
                                    });
                                    return  <div className='item-row' key={index}>
                                                <div className='land-col'>
                                                    <div className={checkBoxClass} onClick={() => this.handleCheckLand(landItem)}/>
                                                    <span onClick={() => this.handleCheckLand(landItem)}>{landItem.land.name ? landItem.land.name : landItem.land.quadKey}</span>
                                                </div>
                                                <div className='blood-col'>
                                                    <input type='number' disabled={ landItem.isBigTreeQuadKey }
                                                            onChange={(e) => this.changePriceOne(e, landItem)}
                                                            value={landItem.land.sellPrice}
                                                    /> Blood
                                                </div>
                                            </div>
                                })
                            }
                        </div>
                    
                        <div className='footer-grid'>
                            <div className='footer1-col'><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.totalSell'}/></div>
                            <div className='footer2-col'>
                                <div className='value'>{selectedLandLength}</div> <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.land'}/>
                            </div>
                        </div>
                
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.sellLands(errorStatus,sellLandFilter)}>
                            <img src='/images/game-ui/sm-ok.svg' alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.confirm'}/>
                            </div>
                    </button>
                    <button onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.sellLandCancelAlert)}>
                        <img src='/images/game-ui/sm-close.svg' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    };

    confirmDeleteSelectedCat = () => {
        this.handleShowAlertPopup(this.alertPopupScreen.deletedCateSuccessAlert);
    };
    
    confirmSellLand() {
        //onsole.log("ok");
        if (this.state.selling === false) {
            const arrQuadkey = [...this.state.sellLand].reduce((quadKeys, landItem) => {
                if (landItem.checked) {
                    quadKeys = quadKeys.concat({quadKey: landItem.land.quadKey, landPrice: landItem.land.sellPrice});
                }
                return quadKeys;
            }, []);

            // //sellLand
            let objSellLand = {
                userId: this.props.user._id,
                forSaleStatus: true,
                quadKeys: arrQuadkey,
                mode: "sell",
                nid: this.props.user.nid || -1,
            };

            this.setState({selling: true});
            this.props.sellLandSocket(objSellLand);
        }
        this.handleShowAlertPopup(this.alertPopupScreen.sellLandSuccessAlert);
    }

    removeLandWhenStay() {
        this.handleHideAlertPopup();
        this.handleHideAllPopup();
    }

    reloadData = () => {
        this.props.uncheckAndUpdateCategories();
        this.props.gotoSellLand();
    }

    resetData = () => {
        this.props.resetData(this.props.user._id);
        this.handleHideAllPopup();
    };

    handleHideAllPopup = () => {
        this.props.handleHidePopup();
        this.handleHideAlertPopup();
    };

    alertPopupScreen = {
        noPopup: 'noPopup',
        sellLandCancelAlert: 'sellLandCancelAlert',
        sellLandConfirmAlert: 'sellLandConfirmAlert',
        sellLandSuccessAlert: 'sellLandSuccessAlert',
        sellLandFailureAlert: 'sellLandFailureAlert',
        noSelectedLandToSellAlert: 'noSelectedLandToSellAlert',
        limitSellPriceAlert: 'limitSellPriceAlert'
    };


    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.deletedCateAlert === this.state.currentAlertPopUp && this.getDeletedCateAlertPopup()}
                {this.alertPopupScreen.deletedCateSuccessAlert === this.state.currentAlertPopUp && this.getDeletedCateSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandCancelAlert === this.state.currentAlertPopUp && this.getSellLandCancelAlertPopup()}
                {this.alertPopupScreen.sellLandConfirmAlert === this.state.currentAlertPopUp && this.getSellLandConfirmAlertPopup()}
                {this.alertPopupScreen.sellLandSuccessAlert === this.state.currentAlertPopUp && this.getSellLandSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandFailureAlert === this.state.currentAlertPopUp && this.getSellLandFailureAlertPopup()}
                {this.alertPopupScreen.noSelectedLandToSellAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToSellAlertPopup()}
                {this.alertPopupScreen.limitSellPriceAlert === this.state.currentAlertPopUp && this.getLimitSellPriceAlertPopup()}
            </Fragment>
        );
    };

    getLimitSellPriceAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getLimitSellPriceAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getLimitSellPriceAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getNoSelectedLandToSellAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

   
    getDeletedCateAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const sign = "delete"; //blood //success //error //delete //loading
        const yesBtn = () => this.confirmDeleteSelectedCat();
        const noBtn = () => this.handleHideAlertPopup();
        const header = "삭제 하기";
        const body = "폴더를 정말 삭제 하시겠습니까?";
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
    };

    getDeletedCateSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = "완료";
        const body = "삭제를 완료 하였습니다.";
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandCancelAlertPopup = () => {
        const modal  = this.state.modalAlertPopup;
        const mode   = "question"; //question //info //customize
        const yesBtn = () => this.clearCheckBoxWhenClosePopup();
        const noBtn  = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandCancelAlertPopup.header'}/>;
        const body   = <TranslateLanguage direct={'alert.getSellLandCancelAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const header = <TranslateLanguage direct={'alert.getSellLandConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getSellLandConfirmAlertPopup.body'}/>;
        const yesBtn = () => this.confirmSellLand();
        const noBtn = () => this.handleHideAlertPopup();
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const yesBtn = () => this.reloadData();
        const noBtn = () => this.removeLandWhenStay();
        const header = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
    };

    getSellLandFailureAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = '오류';
        const body = '오류가 생겼습니다.';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}

function mapStateToProps(state) {
    const {lands, authentication: {user}, map} = state;
    return {
        lands,
        user,
        map,
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    getAllCategory: (userId) => dispatch(landActions.getAllCategory({userId: userId})),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandManagement);