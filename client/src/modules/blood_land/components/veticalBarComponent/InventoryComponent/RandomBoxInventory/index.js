import React, {Component, Fragment} from 'react';
import {inventoryGiftImage} from "../asset";
import RandomBoxInventoryGrid from "./component/randomBoxInventoryGrid";
import {
    getUsingOneRandomBoxConfirmAlert,
    usingRandomBoxPopup,
    loadingPopup,
    getUsingAllRandomBoxConfirmAlert, getOpenRandomBoxUnSuccessAlert
} from "./component/randomBoxAlert";
import {connect} from 'react-redux'
import {inventoryActions} from "../../../../../../store/actions/gameActions/inventoryActions";
import ItemDetailPopup from "../component/itemDetailPopup";
import ItemListPopup from "../component/itemListPopup";

import TranslateLanguage from './../../../general/TranslateComponent';


const randomBoxAlert = {
    noPopup: 'noPopup',
    usingRandomBoxPopup: 'usingRandomBoxPopup',
    usingOneRandomBoxConfirmAlert: 'usingOneRandomBoxConfirmAlert',
    usingAllRandomBoxConfirmAlert: 'usingAllRandomBoxConfirmAlert',
    loadingPopup: 'loadingPopup',
    oneRandomBoxOpenResultPopup: 'oneRandomBoxOpenResultPopup',
    allRandomBoxOpenResultPopup: 'allRandomBoxOpenResultPopup',
    getOpenRandomBoxUnSuccessAlert: 'getOpenRandomBoxUnSuccessAlert'
};

class GiftsInventory extends Component {
    state = {
        currentPopup: randomBoxAlert.noPopup
    };
    onHandleShowPopup = (status) => {
        const {currentPopup, item} = status;
        this.setState({
            currentPopup,
            item
        });
    };
    onHandleHidePopup = () => {
        this.setState({
            currentPopup: randomBoxAlert.noPopup
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.openResult !== this.props.openResult) {
            const {openResult: {status}, user: {_id}, shops} = this.props;
            if (status) {
                const {openResult: {result}} = this.props;
                setTimeout(() => {
                    if(result.length === 1 && result[0].quantity === 1){
                        const itemFindByItemId = shops.find(item => item.itemId === result[0].itemId);
                        this.setState({
                            openOneResult: itemFindByItemId
                        });
                        this.onHandleShowPopup({currentPopup: randomBoxAlert.oneRandomBoxOpenResultPopup})
                    }else{
                        this.setState({
                            openAllResult: result
                        });
                        this.onHandleShowPopup({currentPopup: randomBoxAlert.allRandomBoxOpenResultPopup})
                    }
                    this.props.getGiftInventoryByUserId({userId: _id});

                }, 1000)

            }else if(status === false){
                setTimeout(() => {
                    this.onHandleShowPopup({currentPopup: randomBoxAlert.getOpenRandomBoxUnSuccessAlert})
                },500)
            }
        }
    }

    onHandlePopupRender = (onHandleShowPopup) => {
        const {currentPopup, item, openOneResult, openAllResult} = this.state;
        const {onHandleOpenRandomBox , settingReducer:{language}} = this.props;
        const usingRandomBoxPopupStatus = currentPopup === randomBoxAlert.usingRandomBoxPopup;
        const usingOneRandomBoxConfirmAlertStatus = currentPopup === randomBoxAlert.usingOneRandomBoxConfirmAlert;
        const usingAllRandomBoxConfirmAlertStatus = currentPopup === randomBoxAlert.usingAllRandomBoxConfirmAlert;
        const loadingPopupStatus = currentPopup === randomBoxAlert.loadingPopup;
        const oneRandomBoxOpenResultPopupStatus = currentPopup === randomBoxAlert.oneRandomBoxOpenResultPopup;
        const allRandomBoxOpenResultPopupStatus = currentPopup === randomBoxAlert.allRandomBoxOpenResultPopup;
        const getOpenRandomBoxUnSuccessAlertStatus = currentPopup === randomBoxAlert.getOpenRandomBoxUnSuccessAlert;
        return (
            <Fragment>
                {usingRandomBoxPopupStatus && usingRandomBoxPopup(item, this.onHandleHidePopup, onHandleShowPopup,language)}
                {loadingPopupStatus && loadingPopup(loadingPopupStatus, this.onHandleHidePopup)}
                {usingOneRandomBoxConfirmAlertStatus && getUsingOneRandomBoxConfirmAlert(usingOneRandomBoxConfirmAlertStatus, this.onHandleHidePopup, item, onHandleOpenRandomBox, this.onHandleShowPopup,language)}
                {oneRandomBoxOpenResultPopupStatus && <ItemDetailPopup itemDetail={openOneResult} handleHidePopup={this.onHandleHidePopup} />}
                {usingAllRandomBoxConfirmAlertStatus && getUsingAllRandomBoxConfirmAlert(usingAllRandomBoxConfirmAlertStatus , this.onHandleHidePopup , item, onHandleOpenRandomBox, this.onHandleShowPopup)}
                {allRandomBoxOpenResultPopupStatus && <ItemListPopup isAlertOpen={allRandomBoxOpenResultPopupStatus} itemList={openAllResult} handleHidePopup={this.onHandleHidePopup} />}
                {getOpenRandomBoxUnSuccessAlertStatus && getOpenRandomBoxUnSuccessAlert(getOpenRandomBoxUnSuccessAlertStatus ,this.onHandleHidePopup )}
            </Fragment>
        )
    };

    render() {
        const {currentPopup} = this.state;
        return (
            <Fragment>
                <div className='screen-title clear-top-empty'>
                    <img src={inventoryGiftImage} alt={'inventoryItem'}/>
                    <div><TranslateLanguage direct={'menuTab.randomBox'}/></div>
                </div>
                <RandomBoxInventoryGrid onHandleShowPopup={this.onHandleShowPopup}/>
                <div className='popup-container'
                     style={{display: currentPopup !== randomBoxAlert.noPopup ? 'block' : 'none'}}>
                    {this.onHandlePopupRender(this.onHandleShowPopup)}
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    const {inventoryReducer: {openResult}, authentication: {user}, shopsReducer: {shops},settingReducer} = state;
    return {
        openResult,
        user,
        shops,
        settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    onHandleOpenRandomBox: (param) => dispatch(inventoryActions.onHandleOpenRandomBox(param)),
    getGiftInventoryByUserId: (param) => dispatch(inventoryActions.getGiftInventoryByUserId(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(GiftsInventory)