import React, { Fragment, Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Modal } from 'reactstrap';
import classNames from 'classnames';

import { validatePrice } from '../../../landMapComponent/component/MapFunction';

import {
    TranslateLanguage,
    loadingImage,
    MessageBox,
    landActions,
    mapActions,
    socketActions,
} from '../../../../../../helpers/importModule';


class SellLandModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAlertPopup: false,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            checkPriceAlert: false,
            forSellLandSelected: [],
            reselling: false,
            preReSellingLands: [],
            sellPrice: 0,
            checkAll: false,
            limitPrice: false,
            data: 0
        };
    }
    
    componentDidMount() {
        const {user:{_id},forSellLandSelected,lands} = this.props
        // console.log('forSellLandSelected',forSellLandSelected);
        // console.log('lands',lands);
        this.props.getAllCategory(_id);
        this.setState({ sellPrice: lands.defaultLandPrice });
        
        if (forSellLandSelected && forSellLandSelected.length > 0) {
            this.setState({ 
                forSellLandSelected
            });
        }
    }

    componentDidUpdate (prevProps) {
        const {isOwnSell, sellSuccess,mode} = this.props.lands;
        if (isOwnSell && this.state.reselling === true && mode === 'reselling') {
            if (sellSuccess) {
                this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifySuccessAlert);
            } else {
                this.handleShowAlertPopup(this.alertPopupScreen.changeModifiedSellLandNumberAlert);
            }
            this.props.clearForSaleStatusSocket();
            this.props.getAllCategory(this.props.user._id);
        }
    }

    handleHideSuccessAlertPopup = () => {
        this.props.clearForSaleStatusSocket();
        this.handleHideAlertPopup();
        this.props.getAllCategory(this.props.user._id);
        this.setState({preReSellingLands: []});
    }


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

    changePriceAll = (e) => {
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
            this.setState({ limitPrice: true });
        }
    };

    clickCheckedAll = () => {
        const { forSellLandSelected ,checkAll} = this.state;
        let newForSellLandSelected = [...forSellLandSelected].map(landItem => {
            landItem.checked = !this.state.checkAll;
            return landItem;
        });
        this.setState({ checkAll: !checkAll, forSellLandSelected: newForSellLandSelected });
    };

    clickCheckbox = (landItem) => {
        let newForSellLandSelected = [...this.state.forSellLandSelected];
        let fIndex = newForSellLandSelected.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey);
        newForSellLandSelected[fIndex].checked = !landItem.checked;
        let checkedLand = newForSellLandSelected.filter(landItem => landItem.checked);
        this.setState({
            forSellLandSelected: newForSellLandSelected,
            checkAll: checkedLand.length === newForSellLandSelected.length
        });
    };

    changePriceOne = (e, landItem) => {
        const newSellPrice = parseFloat(e.target.value);
        if (validatePrice(newSellPrice)) {
            let newForSellLandSelected = [...this.state.forSellLandSelected];
            let fIndex = newForSellLandSelected.findIndex(splLand => splLand.land.quadKey === landItem.land.quadKey)
            newForSellLandSelected[fIndex].land.sellPrice = newSellPrice;
            this.setState({ forSellLandSelected: newForSellLandSelected, limitPrice: false });
        } else {
            this.setState({ limitPrice: true });
        }
    };


    confirmModifySellLand = () => {
        const arrQuadkey = [...this.state.forSellLandSelected].reduce((quadKeys, landItem) => {
            if (landItem.checked) {
                quadKeys = quadKeys.concat({ quadKey: landItem.land.quadKey, landPrice: landItem.land.sellPrice });
            }
            return quadKeys;
        }, []);
        //re-sell after change price
        const param = {
            userId: this.props.user._id,
            forSaleStatus: true,
            quadKeys: arrQuadkey,
            mode: 'reselling',
            nid: this.props.user.nid || 99999999,
        };

        this.setState({
            preReSellingLands: param.quadKeys,
            reselling:true
        });
        this.props.sellLandSocket(param);
        this.handleHideAlertPopup()
    };

    handleHideAllPopup = () => {
        this.handleHideAlertPopup();
        this.props.handleHidePopup();
    }

    getCancelLandSaleSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = <TranslateLanguage direct={'alert.getCancelLandSaleSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getCancelLandSaleSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getSellLandModifyCancelAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.props.handleHidePopup();
        const noBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandModifyCancelAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getSellLandModifyCancelAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifyConfirmAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmModifySellLand();
        const noBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getSellLandModifyConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getSellLandModifySuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = <TranslateLanguage direct={'alert.getSellLandModifySuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getSellLandModifySuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getCheckPriceAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = <TranslateLanguage direct={'alert.checkPriceAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.checkPriceAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
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

    getChangeModifiedSellLandNumberAlert = () => {
        const {updatedStateLands} = this.props.lands;
        const {preReSellingLands} = this.state;
        const modal = this.state.modalAlertPopup
        const mode = "info"; //question //info //customize
        const sign = updatedStateLands.length <= 0 ? "error" : "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAllPopup();
        const header = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.header'}/>;
        const $_selected = `<span class='text-selected'>${preReSellingLands.length}</span>`;
        const $_total = `<span class='text-total'>${updatedStateLands.length}</span>`;
        const body = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.body'} $_selected={$_selected} $_total={$_total} />;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;

    };

    getSellLandModifyPopup = () => {
        const { sellPrice, checkAll, forSellLandSelected } = this.state;
        const {modalPopup} = this.props;
        const checkAllClass = classNames({
            'check-box':true,
            'checked':checkAll
        });
        const forSellLandSelectedFilter = forSellLandSelected && forSellLandSelected.filter(f => f.land.sellPrice < 1);
        const selectedLandLength = forSellLandSelected.filter(landItem => landItem.checked).length;
        const spacing = <div className='item-row'><div className='land-col'></div><div className='blood-col'></div></div>;
        return (
            <Modal isOpen={modalPopup} backdrop="static" className={`custom-modal modal--land-sell-modify`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/sm-change-land-price.svg')} alt='' />
                    <TranslateLanguage direct={'alert.getSellLandModifyPopup.header'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.props.handleHidePopup()} />
                </div>
                <div className='custom-modal-body'>
                    <div className='sell-land-modify-container'>
                        <div className='header-grid'>
                            <div className='land-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.headingColumn1'}/>
                            </div>
                            <div className='blood-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.headingColumn2'}/>
                            </div>
                            <div className='land-sub-col'>
                                <div className={checkAllClass} onClick={() => this.clickCheckedAll()}/>
                                <span onClick={() => this.clickCheckedAll()} ><TranslateLanguage direct={'alert.getSellLandModifyPopup.selectAll'}/></span>
                                <div > &nbsp;{`(${ (Array.isArray(forSellLandSelected) && forSellLandSelected.length) || 0 })`} </div>
                            </div>
                            <div className='blood-sub-col'>
                                <TranslateLanguage direct={'alert.getSellLandModifyPopup.changePriceAll'}/>
                                <input type='number' onChange={(e) => this.changePriceAll(e)} value={sellPrice} /> Blood
                            </div>
                        </div>
                        <div className='body-grid'>
                        {spacing}
                        {
                            forSellLandSelected.map((landItem, index) => {
                                const checkboxClass = classNames({
                                    'check-box':true,
                                    'checked':landItem.checked
                                });
                                return  <div className='item-row' key={index}>
                                            <div className='land-col'>
                                                <div className={checkboxClass} onClick={() => this.clickCheckbox(landItem)}/>
                                                <span onClick={() => this.clickCheckbox(landItem)} >{landItem.land.name ? landItem.land.name : landItem.land.quadKey}</span>
                                            </div>
                                            <div className='blood-col'>
                                                <input type='number' onChange={(e) => this.changePriceOne(e, landItem)}
                                                        value={landItem.land.sellPrice}
                                                /> Blood
                                            </div>
                                        </div>
                            })
                        }
                        </div>
                        <div className='footer-grid'>
                            <div className='footer1-col'><TranslateLanguage direct={'alert.getSellLandModifyPopup.totalSell'}/></div>
                            <div className='footer2-col'>
                                <div className='value'> { selectedLandLength }</div> <TranslateLanguage direct={'alert.getSellLandModifyPopup.land'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.modifyPriceLands(forSellLandSelectedFilter)}>
                        <img src={loadingImage('/images/game-ui/sm-ok.svg')} alt='' />
                        <div><TranslateLanguage direct={'alert.getSellLandModifyPopup.confirm'}/></div>
                    </button>
                    <button onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifyCancelAlert)}>
                        <img src={loadingImage('/images/game-ui/sm-close.svg')} alt='' />
                        <div><TranslateLanguage direct={'alert.getSellLandModifyPopup.cancel'}/></div>
                    </button>
                </div>
            </Modal>
        )
    };
    
    alertPopupScreen = {
        noPopup: 'noPopup',
        cancelLandSaleAlert: 'cancelLandSaleAlert',
        cancelLandSaleSuccessAlert: 'cancelLandSaleSuccessAlert',
        sellLandModifyCancelAlert: 'sellLandModifyCancelAlert',
        sellLandModifyConfirmAlert: 'sellLandModifyConfirmAlert',
        sellLandModifySuccessAlert: 'sellLandModifySuccessAlert',
        noSelectedLandToModifyAlert: 'noSelectedLandToModifyAlert',
        checkPriceAlert: 'checkPriceAlert',
        changeModifiedSellLandNumberAlert: 'changeModifiedSellLandNumberAlert'
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.cancelLandSaleSuccessAlert === this.state.currentAlertPopUp && this.getCancelLandSaleSuccessAlertPopup()}
                {this.alertPopupScreen.sellLandModifyCancelAlert === this.state.currentAlertPopUp && this.getSellLandModifyCancelAlertPopup()}
                {this.alertPopupScreen.sellLandModifyConfirmAlert === this.state.currentAlertPopUp && this.getSellLandModifyConfirmAlertPopup()}
                {this.alertPopupScreen.sellLandModifySuccessAlert === this.state.currentAlertPopUp && this.getSellLandModifySuccessAlertPopup()}
                {this.alertPopupScreen.noSelectedLandToModifyAlert === this.state.currentAlertPopUp && this.getNoSelectedLandToModifyAlertPopup()}
                {this.alertPopupScreen.changeModifiedSellLandNumberAlert === this.state.currentAlertPopUp && this.getChangeModifiedSellLandNumberAlert()}
                {this.alertPopupScreen.checkPriceAlert === this.state.currentAlertPopUp && this.getCheckPriceAlertPopup()}
            </Fragment>
        );
    };
    
    render() {
        const modalPopup = this.getSellLandModifyPopup();
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {modalPopup}
                {alertPopup}
            </Fragment>
        );
    }

    modifyPriceLands = (forSellLandSelectedFilter) => {
        if(forSellLandSelectedFilter){
            if(forSellLandSelectedFilter.length !== 0) {
                this.handleShowAlertPopup(this.alertPopupScreen.checkPriceAlert);
            }
            else{
                if (this.state.forSellLandSelected && this.state.forSellLandSelected.filter(checkedLand => checkedLand.checked).length > 0) {
                    this.handleShowAlertPopup(this.alertPopupScreen.sellLandModifyConfirmAlert);
                } else {
                    this.handleShowAlertPopup(this.alertPopupScreen.noSelectedLandToModifyAlert);
                }
            }
        } 
    }
}

//랜드를 선택해주세요
function mapStateToProps(state) {
    const { lands, authentication: { user }, map,settingReducer:{language} } = state;
    return {
        lands,
        user,
        map,
        language
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
    sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
    syncCenterMap: (center, zoom) => dispatch(mapActions.syncCenterMap(center, zoom)),
    getAllCategory: (userId) => {dispatch(landActions.getAllCategory({ userId }))}
});

export default connect(mapStateToProps, mapDispatchToProps)(SellLandModify);
