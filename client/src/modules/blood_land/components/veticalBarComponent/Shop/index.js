import React, {Component, Fragment} from 'react';
import {Modal} from 'reactstrap';
import {headerImgScr} from "./asset";
import ShopDetailComponent from "./shopComponent/shopDetailComponent";
import ShopTabComponent from "./shopComponent/shopTabComponent";
import ShopWalletInfoComponent from "./shopComponent/shopWalletInfo";
import {
    getPurchaseConfirmPopup, getPurchaseSuccessAlertPopup, getPurchaseUnSuccessAlertPopup,
    getQuantityAlertPopup,
    getRechargeAlertPopup,
    loadingPopup,
    getLimitBuyItemPopup,
    getBuyAllAmountPopup
} from "./shopComponent/alertPopup";
import {shopsActions} from "../../../../../store/actions/gameActions/shopsActions";
import {connect} from 'react-redux'
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {inventoryActions} from '../../../../../store/actions/gameActions/inventoryActions';
import {alertPopup} from "./shopComponent/alertPopup";

import TranslateLanguage from "../../general/TranslateComponent";


class ShopComponent extends Component {
    state = {
        currentAlertPopUp: alertPopup.noPopup,
        canBuyAmount: -1,
        buyQuantity: -1
    };
    
    componentDidMount(){
        this.props.getShop();
    }

    //life circle check when result return
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {result} = this.props;
        if(result && prevProps.result !== result){
            if(result.status){
                this.handleShowPopup(alertPopup.buyItemShopSuccess);
            }
            else{
                if(result.code){
                    if(result.code === 'buyAllAmount'){
                        let {canBuyAmount,buyQuantity} = result.result;
                        // console.log({canBuyAmount,buyQuantity});
                        this.setState({canBuyAmount,buyQuantity});
                        this.handleShowPopup(alertPopup.buyAllAmountSuccess);
                    }else{
                        this.handleShowPopup(alertPopup.buyItemShopUnSuccess);
                    }
                }else{
                    this.handleShowPopup(alertPopup.buyItemShopUnSuccess);
                }
            }

        }
    }

    // vuonglt add for planting tree popup
    componentWillUnmount(){
        const {isPlanting,user:{_id}} = this.props;
        // console.log('isPlanting',isPlanting);
        if(isPlanting){
            this.props.getCharacterInventoryByUserId({userId: _id});
        }
    }

    //function get form child component
    onHandleObjectSelected = (item) => {
        if (item) {
            this.setState({
                itemSelected: item,
                // resetQuantity: true
            })
        }
    };
    onHandleGetQuantity = (quantity) => {
        if (quantity !== this.state.quantity) {
            this.setState({
                quantity
            })
        }
    };
    onHandleGetWalletInformation = (bloodLeft) => {
        if (bloodLeft !== this.state.bloodLeft) {
            this.setState({
                bloodLeft
            });
        }
    };

    //handle for popup
    handleShowPopup = (type) => {
        this.setState({
            currentAlertPopUp: type,
            isAlertOpen: true
        })
    };

    //On handle confirm buy
    handleConfirmBuyItem = () => {
        const {itemSelected: {itemId, randomBoxId}, quantity} = this.state;
        const {shops} = this.props;
        const selectedItem = shops.find(i=>i.itemId === itemId);
        if(selectedItem && selectedItem.buyLimitAmount < quantity){
            return this.handleShowPopup(alertPopup.limitBuyItemPopup);
        }
        // console.log('quantity',quantity);
        const {user: {_id, nid}} = this.props;
        if (nid) {
            const param = {
                [itemId ? 'itemId' : 'randomBoxId']: itemId ? itemId : randomBoxId,
                quantity,
                userId: _id,
                getFromCode: "B"
            };
            if (itemId) {
                this.props.onHandleBuyItemFromShop(param);
            } else {
                this.props.onHandleBuyRandomBoxFromShop(param);
            }
            this.handleShowPopup(alertPopup.loadingPopup);
        } else {
            this.handleShowPopup(alertPopup.loadingPopup);
            setTimeout(() => {
                this.handleShowPopup(alertPopup.buyItemShopUnSuccess);
            }, 500)
        }
    };
    //function close shop
    handleHidePopup = () => {
        this.setState({
            isAlertOpen: false
        })
    };

    reloadData = () =>{
        const {user:{wToken,_id}} = this.props;
        this.props.onHandleGetAllTreeByUserId({userId: _id});
        this.props.getWalletInfo({wToken});
        this.props.getShop();
        this.setState({ resetQuantity: true});
    }
        //function close shop
    clearStatusAndHandleHidePopup = () => {
        this.handleHidePopup();
        this.props.clearResultStatus();
        this.reloadData();
    };
    
    //render popup
    handleRenderPopup = () => {
        const {currentAlertPopUp, isAlertOpen, itemSelected, canBuyAmount, buyQuantity} = this.state;
        const {settingReducer: {language}} = this.props;
        return (
            <Fragment>
                {currentAlertPopUp === alertPopup.alertQuantity && getQuantityAlertPopup(this.handleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.alertBloodRecharge && getRechargeAlertPopup(this.handleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.alertConfirmPurchaseItem && getPurchaseConfirmPopup(this.handleHidePopup, isAlertOpen, itemSelected, this.handleConfirmBuyItem,language)}
                {currentAlertPopUp === alertPopup.loadingPopup && loadingPopup(this.handleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.buyItemShopSuccess && getPurchaseSuccessAlertPopup(this.clearStatusAndHandleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.buyItemShopUnSuccess && getPurchaseUnSuccessAlertPopup(this.clearStatusAndHandleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.limitBuyItemPopup && getLimitBuyItemPopup(this.clearStatusAndHandleHidePopup, isAlertOpen)}
                {currentAlertPopUp === alertPopup.buyAllAmountSuccess && getBuyAllAmountPopup(this.clearStatusAndHandleHidePopup,isAlertOpen,canBuyAmount,buyQuantity) }
            </Fragment>
        )
    };

    //shop header render
    shopHeaderRender = () => {
        return (
            <div className='custom-modal-header'>
                <img src={headerImgScr} alt=''/>

                <TranslateLanguage direct={'menuTab.shop'}/>
                <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.props.handleHidePopup()}/>
            </div>
        )
    };

    //shop body render
    shopBodyRender = () => {
        const {itemSelected, quantity, bloodLeft } = this.state;
        const {settingReducer: {language}, shops} = this.props;
        return (
            <div className='custom-modal-body'>
                <div className='game-shop'>
                    <ShopWalletInfoComponent quantity={ quantity ? quantity : 0} itemSelected={itemSelected}
                                             onHandleGetWalletInformation={(bloodLeft) => this.onHandleGetWalletInformation(bloodLeft)}/>
                    <ShopDetailComponent language={language}
                                         shops={shops}
                                         itemSelected={itemSelected} bloodLeft={bloodLeft}
                                         onHandleGetQuantity={(quantity) => this.onHandleGetQuantity(quantity)}
                                         handleShowPopup={(type) => this.handleShowPopup(type)}/>
                    <ShopTabComponent onHandleObjectSelected={(item) => this.onHandleObjectSelected(item)}/>
                </div>
            </div>
        )
    };

    render() {
        const {isOpen} = this.props;
        const {isAlertOpen} = this.state;
        return (
            <Fragment>
                <Modal isOpen={isOpen} backdrop="static" className={`custom-modal modal--shop`}>
                    {this.shopHeaderRender()}
                    {this.shopBodyRender()}
                </Modal>
                {isAlertOpen && this.handleRenderPopup()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, shopsReducer: {result}, settingReducer, shopsReducer: {shops}} = state;
    return {
        user, result, settingReducer, shops
    }
};
const mapDispatchToProps = (dispatch) => ({
    getShop: () => dispatch(shopsActions.getShop()),
    onHandleBuyItemFromShop: (param) => dispatch(shopsActions.buyItemFromShop(param)),
    onHandleBuyRandomBoxFromShop: (param) => dispatch(shopsActions.buyRandomBoxFromShop(param)),
    getWalletInfo: (information) => dispatch(userActions.getWalletInfo(information)),
    getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
    onHandleGetAllTreeByUserId: (param) =>  dispatch(inventoryActions.getAllTreeByUserId(param)),
    clearResultStatus: () => dispatch(shopsActions.clearResultStatus()),
});
export default connect(mapStateToProps, mapDispatchToProps)(ShopComponent)