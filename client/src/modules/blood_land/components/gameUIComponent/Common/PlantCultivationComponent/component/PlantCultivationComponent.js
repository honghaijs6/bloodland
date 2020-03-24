import React, {Fragment, PureComponent} from 'react'
import effect from '../../../../general/StartDustEffect';
import {connect} from "react-redux";
import {getMapImgByItemId, getShopImgByItemId} from "../../../../../../../helpers/thumbnails";
import {loadingImage} from "../../../../general/System";
import {objectsActions} from "../../../../../../../store/actions/gameActions/objectsActions";
// import moment from "moment";
import {inventoryActions} from "../../../../../../../store/actions/gameActions/inventoryActions";
import {mapGameAction} from "../../../../../../../store/actions/gameActions/mapGameActions";
import common, {onHandleTranslate} from "../../../../../../../helpers/Common";
import {alertPopup} from "../../../../gameMapComponent/component/A&PSchema";
import TranslateLanguage from './../../../../general/TranslateComponent';
import {translate} from "react-i18next";
import classNames from 'classnames';
import ItemTranslate from '../../../../general/ItemTranslate';

const itemDetailTitleBG = loadingImage(`/images/game-ui/text-banner.svg`);
const itemDetailTitleStyle = {
    background: `url(${itemDetailTitleBG}) center no-repeat`
};
const usingItemTitleBG = loadingImage(`/images/game-ui/text-banner.svg`);
const usingItemTitleStyle = {
    background: `url(${usingItemTitleBG}) center no-repeat`
};

class PlantCultivationComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.timer = 0
    }

    getDetail = (detailObj) => {
        return detailObj.bigTreeQuadKeys ? 
                this.renderBigTreeDetail(detailObj) : 
                this.renderTreeDetail(detailObj);
    };

    renderBigTreeDetail = (detailObj) =>{
        const {distributedPrice} = detailObj;
        const distributedPriceFormat = parseFloat(distributedPrice).toFixed(4);
        return (
            <div className='detail1'>
                <div className='content-a'>
                    <span><TranslateLanguage direct={'PlantCultivationComponent.detail2.detailLabel'}/></span>
                </div>
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail2.bitaminPaidPerDay'}/>
                    <span className='float-right'>200 Bitamin</span>
                </div> 
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail2.bitaminPaid'}/>
                    <span className='float-right'>{distributedPriceFormat} Bitamin</span>
                </div>
            </div>
        );
    }

    renderTreeDetail = (detailObj) =>{
        const {landPrice, profitTotal, profit, distributedPrice, waterEndTime, profitNutritional1, profitNutritional2, profitNutritional3, profitNutritional4,nutritionalEndTime1,nutritionalEndTime2} = detailObj;
        const {t, settingReducer: {language}, lng} = this.props;

        const profitDayBlood = parseFloat((profitTotal / 100) * landPrice).toFixed(4);
        const profitTotalFormat = profitNutritional1 + profitNutritional2 + profitNutritional3 + profitNutritional4;
        const profitFormat = parseFloat(profit).toFixed(4);
        const distributedPriceFormat = parseFloat(distributedPrice).toFixed(4);
        // const test  =  common.waterLeftSecond(waterStartTime,waterEndTime)

        const leftDay = common.waterLeftDay(waterEndTime);
        const { nutritionalDayRemaining1, nutritionalDayRemaining2 } = common.nutritionalDayRemaining({ nutritionalEndTime1, nutritionalEndTime2 });
        const day = onHandleTranslate(t, "PlantCultivationComponent.detail.day", language, lng);
        const translateClass = classNames({'translation': language !== 'kr'});

        let waterLeftdayNotice = onHandleTranslate(t, "PlantCultivationComponent.detail.treeNotice", language, lng);
        waterLeftdayNotice = waterLeftdayNotice.replace("$_leftDay", `<span class='left-days'>${leftDay}${day}</span>`);

        let nutritionalDayRemainingNotice1 = onHandleTranslate(t, "PlantCultivationComponent.detail.nutritionalDayRemainingNotice1", language, lng);
        nutritionalDayRemainingNotice1 = nutritionalDayRemainingNotice1.replace("$_leftDay", `<span class='left-days'>${nutritionalDayRemaining1}${day}</span>`);

        let nutritionalDayRemainingNotice2 = onHandleTranslate(t, "PlantCultivationComponent.detail.nutritionalDayRemainingNotice2", language, lng);
        nutritionalDayRemainingNotice2 = nutritionalDayRemainingNotice2.replace("$_leftDay", `<span class='left-days'>${nutritionalDayRemaining2}${day}</span>`);

        return(
            <div className='detail1'>
                <div className='content-a'>
                    <span className={translateClass} dangerouslySetInnerHTML={{__html: waterLeftdayNotice}}/>
                </div>
                {nutritionalEndTime1 && <div className='content-a'>
                    <span className={translateClass} dangerouslySetInnerHTML={{__html: nutritionalDayRemainingNotice1}}/>
                </div>}
                {nutritionalEndTime2 && <div className='content-a'>
                    <span className={translateClass} dangerouslySetInnerHTML={{__html: nutritionalDayRemainingNotice2}}/>
                </div>}
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail.landPrice'}/>
                    <span className='float-right'>{parseFloat(landPrice).toLocaleString()} Blood</span>
                </div>
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail.profitFormat'}/> 
                    <span className='float-right'> {profitFormat} %</span>
                </div>
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail.profitTotalFormat'}/>
                    <span className='float-right'>{profitTotalFormat} %</span>
                </div>
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail.profitDayBlood'}/>
                    <span className='float-right'>{profitDayBlood} Blood</span>
                </div>
                <div className='content-b'>
                    <TranslateLanguage direct={'PlantCultivationComponent.detail.distributedPriceFormat'}/>
                    <span className='float-right'>{distributedPriceFormat} Blood</span>
                </div>
            </div>
        )
    }

    componentDidMount() {
        const {user: {_id}, objectId} = this.props;
        const param = {
            userId: _id,
            objectId
        };
        this.props.onHandleGetObjectDetail(param);
        this.props.getItemInventoryByUserId({userId: _id})
    }

    onHandleUsingItem = (detailObj, itemId, handleShowAlert) => {
        const {quadKey, waterEndTime} = detailObj;
        const itemData = {
            quadKey, itemId
        };
        if (common.waterLeftSecond(waterEndTime) <= 0) {
            handleShowAlert(alertPopup.checkTreeAlreadyExistAlert)
        } else {
            this.props.onHandleMoveItemFromInventoryToMap(itemData);
        }

    };
    getPlantsCultivate = (detailObj, handleShowAlert) => {
        const {itemInventory, settingReducer: {language}} = this.props;
        const itemInventoryFilter = itemInventory && detailObj.itemId === 'T10' ? itemInventory.filter(item => item.itemId === 'I04') : itemInventory && itemInventory.filter(item => item.itemId !== 'I04');
        return (
            <div className='using-items'>
                <div className='item-detail-title' style={usingItemTitleStyle}>
                    <TranslateLanguage direct={'PlantCultivationComponent.getPlantsCultivate.header'}/>
                </div>
                <div className='item-detail-using-items scrollable'>
                    {itemInventoryFilter && itemInventoryFilter.map((item, index) => {
                        const name = <ItemTranslate itemSelected={item} name={true} decoClass='translation'
                                                    language={language}/>;
                        const {itemId, quantity} = item;
                        return (
                            <button className='item-btn' key={index}
                                    onClick={() => this.onHandleUsingItem(detailObj, itemId, handleShowAlert)}>
                                <div className='sp-img'>
                                    <img src={getShopImgByItemId(itemId)} alt=''/>
                                    {itemId !== 'I03' && <Fragment>
                                        {quantity}
                                        <TranslateLanguage
                                            direct={'PlantCultivationComponent.getPlantsCultivate.item'}/>
                                    </Fragment>
                                    }
                                </div>
                                <div className='sp-name'>{name}</div>
                            </button>
                        )
                    })}

                </div>
            </div>
        )
    };

    render() {
        const {detailObj, handleHidePopup, handleShowAlert, settingReducer: {language}} = this.props;
        // console.log('detailObj',detailObj);
        if (!detailObj) return null;
        else {
            const {itemId, item} = detailObj;
            return (
                <div className='tree-detail-panel'>
                    <span className='lnr lnr-cross lnr-custom-close-detail-popup' onClick={() => handleHidePopup()}/>
                    <div className='item-detail-1'>
                        <div className='detail-img'>
                            <div className='item-detail-title' style={itemDetailTitleStyle}>
                                {item && <ItemTranslate itemSelected={item} name={true} decoClass='translation'
                                                        language={language}/>}
                            </div>
                            {effect.sparkleEffect()}
                            {itemId && <img src={getMapImgByItemId(itemId)} alt={itemId}/>}
                        </div>
                        {this.getPlantsCultivate(detailObj, handleShowAlert)}
                    </div>
                    <div className='item-detail-2'>
                        {this.getDetail(detailObj)}
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, objectsReducer: {detailObj}, inventoryReducer: {itemInventory}, settingReducer} = state;
    return {
        user,
        detailObj,
        itemInventory,
        settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    getItemInventoryByUserId: (param) => dispatch(inventoryActions.getItemInventoryByUserId(param)),
    onHandleGetObjectDetail: (param) => dispatch(objectsActions.getDetailObject(param)),
    onHandleMoveItemFromInventoryToMap: (itemData) => dispatch(mapGameAction.onHandleMoveItemFromInventoryToMap(itemData))
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(PlantCultivationComponent))
