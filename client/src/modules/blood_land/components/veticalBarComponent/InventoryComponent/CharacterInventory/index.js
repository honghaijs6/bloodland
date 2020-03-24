import React, {Fragment, PureComponent} from 'react'
import {inventoryCharacterImage} from "../asset";
import CharacterInventoryTab from "./component/CharacterInventoryTab";
import CharacterInventoryOffLand from "./component/CharacterInventoryOffLand";
import CharacterInventoryOnLand from "./component/CharacterInventoryOnLand";
import TranslateLanguage from './../../../general/TranslateComponent';
import CombineTreeComponent from './component/CombineTree/index'
import {alertPopup} from "./component/Alert&Popup";
import {loadingPopup, getCombineFailAlert} from  "./component/Alert&Popup"
import {connect} from  'react-redux'
import {inventoryActions} from "../../../../../../store/actions/gameActions/inventoryActions";
import ItemDetailPopup from "../component/itemDetailPopup";
import ItemListPopup from "../component/itemListPopup";
const inventoryCharacterTab = {
    onLand: "onLand",
    offLand: "offLand"
};

class CharacterInventory extends PureComponent {
    state={
        currentTab: inventoryCharacterTab.offLand,
        currentPopup: alertPopup.noPopup
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.combineTreeResult !== this.props.combineTreeResult){
            process.env.NODE_ENV === 'development' && console.log('Combine Tree result', this.props.combineTreeResult);
            const {combineTreeResult:{mergeItems , status}} = this.props;
            if(status){
                const {user: {_id}} = this.props;
                this.props.getCharacterInventoryByUserId({userId: _id});
                if(mergeItems.length === 1){
                    if(mergeItems[0].quantity === 1){
                        this.setState({
                            itemsResult: mergeItems[0]
                        });
                        setTimeout(() => {
                            this.onHandleShowPopup(alertPopup.getSingleCombineTreeResultPopup);
                        } , 1000)
                    }else{
                        this.setState({
                            itemsResult: mergeItems
                        });
                        setTimeout(() => {
                            this.onHandleShowPopup(alertPopup.getMultiCombineTreeResultPopup);
                        } , 1000)
                    }

                }else if(mergeItems.length > 1){
                    this.setState({
                        itemsResult: mergeItems
                    });
                    setTimeout(() => {
                        this.onHandleShowPopup(alertPopup.getMultiCombineTreeResultPopup);
                    } , 1000)
                }
            }else{
                const {user: {_id}} = this.props;
                this.props.getCharacterInventoryByUserId({userId: _id});
                setTimeout(() => {
                    this.onHandleShowPopup(alertPopup.getCombineFailAlert);
                } , 1000)
            }
        }
    }

    onHandleChangeTab = (selectedTab) => {
        this.setState({currentTab: selectedTab});
    };

    onHandleShowPopup = (currentPopupStatus) => {
        this.setState({
            currentPopup: currentPopupStatus
        })
    };
    onHandleHidePopup = () => {
        this.onHandleShowPopup(alertPopup.noPopup)
    };

    onHandleRenderPopup = () => {
        const {currentPopup, itemsResult} = this.state;
        const combineTreePopupStatus = currentPopup === alertPopup.combineTreePopup;
        const loadingStatus = currentPopup === alertPopup.loadingPopup;
        const oneCombineTreeResultStatus = currentPopup === alertPopup.getSingleCombineTreeResultPopup;
        const manyCombineTreeResultStatus = currentPopup === alertPopup.getMultiCombineTreeResultPopup;
        const getCombineFailAlertStatus = currentPopup === alertPopup.getCombineFailAlert
        return (
            <Fragment>
                {combineTreePopupStatus && <CombineTreeComponent isOpen={combineTreePopupStatus}
                                                                 onHandleShowPopup={this.onHandleShowPopup}
                                                                 handleHidePopup={this.onHandleHidePopup}/>}
                {oneCombineTreeResultStatus && <ItemDetailPopup itemDetail={itemsResult} handleHidePopup={this.onHandleHidePopup}/>}
                {manyCombineTreeResultStatus && <ItemListPopup isAlertOpen={manyCombineTreeResultStatus} itemList={itemsResult} handleHidePopup={this.onHandleHidePopup} />}
                {getCombineFailAlertStatus && getCombineFailAlert(this.onHandleHidePopup ,getCombineFailAlertStatus )}
                {loadingStatus && loadingPopup(loadingStatus)}
            </Fragment>
        )
    };
    render(){
        const {currentTab} = this.state;
        return(
            <Fragment>
                <div className='screen-title clear-top-empty'>
                    <img src={inventoryCharacterImage} alt={'inventoryItem'}/>
                    <div><TranslateLanguage direct={'menuTab.characters'}/></div>
                </div>
                <CharacterInventoryTab onHandleChangeTab={(selectedTab) => this.onHandleChangeTab(selectedTab)}/>
                {currentTab === inventoryCharacterTab.offLand ? <CharacterInventoryOffLand onHandleShowPopup={this.onHandleShowPopup}/> : <CharacterInventoryOnLand/>}
                <div style={{position: 'fixed' , width: '100vw' , height: '100vh'}}>
                    {this.onHandleRenderPopup()}
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    const {inventoryReducer: { combineTreeResult} , authentication:{user}} = state;
    return {
         combineTreeResult , user
    }
};
const mapDispatchToProps = (dispatch) => ({
    //load lai  inventory
    getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
});

export default connect(mapStateToProps , mapDispatchToProps)(CharacterInventory)