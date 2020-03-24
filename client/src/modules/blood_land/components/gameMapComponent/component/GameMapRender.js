import React, { Fragment, memo} from 'react'
import * as f from './GameMapAlert'
import {connect} from 'react-redux';
import {inventoryActions} from "../../../../../store/actions/gameActions/inventoryActions";
import PlantCultivationPopup from "../../gameUIComponent/Common/PlantCultivationComponent/PlantCultivationPopup";
import ItemDetailPopup from "../../gameUIComponent/Common/PlantCultivationComponent/component/itemDetailPopup";
import {alertPopup} from "./A&PSchema";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {translate} from 'react-i18next';
// import {landActions} from "../../../../../store/actions/landActions/landActions";
import {mapGameAction} from "../../../../../store/actions/gameActions/mapGameActions";


const GameMapRender = memo((props) => {
    const {renderMap, currentPopup,  settingReducer:{language}, onHandleGetQuadKeyBitamin, handleHidePopup, plantData, onMoveCharacterToMap, itemPopupCultivation, usingItemData, onHandleUsingItemForTree, handleShowPopupForTree, itemPopupDetail, handleShowAlert, getCharacterInventoryByUserId, getItemInventoryByUserId, user, shops, getWalletInfo, arrayTileEffect, map, getAreaObject, getAreaLand} = props;

    const alertPopupRender = (currentPopup) => {
        const wrongLandAlertStatus = currentPopup === alertPopup.wrongLandAlert;
        const plantingConfirmAlertStatus = currentPopup === alertPopup.plantingConfirmAlert;
        const cultivationTreePopupStatus = currentPopup === alertPopup.cultivationTreePopup;
        const usingItemConfirmAlertStatus = currentPopup === alertPopup.usingItemConfirmAlert;
        const usingItemNoneQuantityConfirmAlertStatus = currentPopup === alertPopup.usingItemNoneQuantityConfirmAlert;
        const detailTreePopupStatus = currentPopup === alertPopup.detailTreePopup;
        const loadingPopupStatus = currentPopup === alertPopup.loadingPopup;
        const platingTreeSuccessPopupStatus = currentPopup === alertPopup.platingTreeSuccessPopup;
        const platingTreeUnSuccessPopupStatus = currentPopup === alertPopup.platingTreeUnSuccessPopup;
        const usingItemForTreeSuccessPopupStatus = currentPopup === alertPopup.usingItemForTreeSuccessPopup;
        const usingItemForTreeUnSuccessPopupStatus = currentPopup === alertPopup.usingItemForTreeUnSuccessPopup;
        const limitNutritionAlertStatus = currentPopup === alertPopup.limitNutritionAlert;
        const checkForSaleStatusForItemStatus = currentPopup === alertPopup.checkForSaleStatusAlert;
        const checkTreeAlreadyExistAlertStatus = currentPopup === alertPopup.checkTreeAlreadyExistAlert;
        const rechargeAlertPopupStatus = currentPopup === alertPopup.rechargeAlertPopup;
        const checkForSalesStatusForTreeAlertStatus = currentPopup === alertPopup.checkForSaleStatusForTreeAlert;
        const  checkAlreadyHaveTreeAlertStatus = currentPopup === alertPopup.checkAlreadyHaveTreeAlert;
        const checkPlantTreeTreeBeforeNutrientStatus = currentPopup === alertPopup.checkPlantTreeBeforeNutrient;
        const checkPlantTreeTreeBeforeShovelStatus = currentPopup === alertPopup.checkPlantTreeBeforeShovel;
        const checkPlantTreeTreeBeforeDropletStatus = currentPopup === alertPopup.checkPlantTreeBeforeDroplet;
        return(
            <Fragment>
                {/*//wrong land alert*/}
                {wrongLandAlertStatus && f.getPlantingUnsuccessAlert(wrongLandAlertStatus, handleHidePopup, onHandleGetQuadKeyBitamin)}
                {/*confirm plating tree*/}
                {plantingConfirmAlertStatus && f.getPlantTreeConfirm(plantingConfirmAlertStatus, handleHidePopup, plantData, onMoveCharacterToMap, handleShowAlert , arrayTileEffect , onHandleGetQuadKeyBitamin)}
                {/*popup take care tree*/}
                {(cultivationTreePopupStatus || detailTreePopupStatus) && <div className="popup-container">
                    {cultivationTreePopupStatus && <PlantCultivationPopup objectId={itemPopupCultivation} handleHidePopup={handleHidePopup} handleShowAlert={handleShowAlert}/>}
                    {/*popup detail tree*/}
                    {detailTreePopupStatus && <ItemDetailPopup itemDetail={itemPopupDetail} handleHidePopup={handleHidePopup}/>}
                </div>}
                {/*confirm using item popup*/}
                {usingItemConfirmAlertStatus && f.getUsingItemForTreeConfirm(usingItemConfirmAlertStatus, handleHidePopup, usingItemData, onHandleUsingItemForTree, handleShowAlert , shops,language)}
                {/*confirm using item if quantity === 0*/}
                {usingItemNoneQuantityConfirmAlertStatus && f.getUsingItemByBloodForTreeConfirm(usingItemNoneQuantityConfirmAlertStatus, handleHidePopup, usingItemData, onHandleUsingItemForTree, handleShowAlert , shops,language)}
                {/*loading*/}
                {loadingPopupStatus && f.loadingPopup(loadingPopupStatus)}
                {/*//plating success*/}
                {platingTreeSuccessPopupStatus && f.getPlantingSuccessAlert(platingTreeSuccessPopupStatus, handleHidePopup, getCharacterInventoryByUserId, user , onHandleGetQuadKeyBitamin , getAreaObject  , getAreaLand , map)}
                {/*//planting un success*/}
                {platingTreeUnSuccessPopupStatus && f.getDroppingTreeUnsuccessAlert(platingTreeUnSuccessPopupStatus, handleHidePopup,getCharacterInventoryByUserId,user, onHandleGetQuadKeyBitamin , getAreaObject  , getAreaLand , map)}
                {/*using item success*/}
                {usingItemForTreeSuccessPopupStatus && f.getItemSuccessAlert(usingItemForTreeSuccessPopupStatus, handleHidePopup, getItemInventoryByUserId, user , handleShowPopupForTree , itemPopupCultivation , usingItemData ,  getWalletInfo , map ,  getAreaObject ,  getAreaLand, getCharacterInventoryByUserId)}
                {/*using item un success*/}
                {usingItemForTreeUnSuccessPopupStatus && f.getDroppingItemUnsuccessAlert(usingItemForTreeUnSuccessPopupStatus, handleHidePopup  )}
                {/*limit nutrition alert*/}
                {limitNutritionAlertStatus && f.getUseLimitedItemAlert(limitNutritionAlertStatus, handleHidePopup )}
                {/*check for sale status*/}
                {checkForSaleStatusForItemStatus && f.checkForSaleStatusAlertForItemPopup(checkForSaleStatusForItemStatus, handleHidePopup)}
                {/*checkTreeAlreadyExistAlert*/}
                {checkTreeAlreadyExistAlertStatus && f.getLeftWaterDeadAlertPopup(checkTreeAlreadyExistAlertStatus , handleHidePopup)}
                {/*recharge alert popup*/}
                {rechargeAlertPopupStatus && f.getRechargeAlertPopup(rechargeAlertPopupStatus , handleHidePopup)}
                {/*check for sale status for tree alert*/}
                {checkForSalesStatusForTreeAlertStatus && f.checkForSaleStatusAlertForTreePopup(checkForSalesStatusForTreeAlertStatus , handleHidePopup, onHandleGetQuadKeyBitamin)}
                {/*check already have tree alert*/}
                {checkAlreadyHaveTreeAlertStatus && f.getAlreadyHaveTreeAlert(checkAlreadyHaveTreeAlertStatus , handleHidePopup)}
                {/*check plant tree before -> nutrient */}
                {checkPlantTreeTreeBeforeNutrientStatus && f.getPlantTreeBeforeNutrient(checkPlantTreeTreeBeforeNutrientStatus, handleHidePopup)}
                {/*check plant tree before -> shovel*/}
                {checkPlantTreeTreeBeforeShovelStatus && f.getPlantTreeBeforeShovel(checkPlantTreeTreeBeforeShovelStatus, handleHidePopup)}
                {/*check plant tree before -> droplet*/}
                {checkPlantTreeTreeBeforeDropletStatus && f.getPlantTreeBeforeDroplet(checkPlantTreeTreeBeforeDropletStatus, handleHidePopup)}
            </Fragment>
        )
    };

    return (
        <Fragment>
            {renderMap}
            {alertPopupRender(currentPopup)}
        </Fragment>
    )
});

const mapStateToProps = (state) => {
    const {authentication: {user}, shopsReducer: {shops}, settingReducer} = state;
    return {
        user, shops, settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    onMoveCharacterToMap: (param) => dispatch(inventoryActions.onHandleMoveTreeToMap(param)),
    onHandleUsingItemForTree: (param) => dispatch(inventoryActions.onHandleUsingItemForTree(param)),

    //load lai  inventory
    getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
    getItemInventoryByUserId: (param) => dispatch(inventoryActions.getItemInventoryByUserId(param)),

    //load lai wallet
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey))

});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(GameMapRender))