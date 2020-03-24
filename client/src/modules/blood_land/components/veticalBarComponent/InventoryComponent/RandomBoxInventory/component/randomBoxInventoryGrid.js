import React, {Component} from 'react'
import {connect} from "react-redux";
import {inventoryActions} from "../../../../../../../store/actions/gameActions/inventoryActions";
import cloneDeep from 'lodash.clonedeep'
import {getShopImgByItemId} from "../../../../../../../helpers/thumbnails";
import ToolTipInventoryComponent from "../../component/toolttipInventory";
// import {usingRandomBoxPopup} from "./randomBoxAlert";
import ItemTranslate from '../../../../general/ItemTranslate';

const randomBoxAlert = {
    noPopup: 'noPopup',
    usingRandomBoxPopup: 'usingRandomBoxPopup'
};
class RandomBoxInventoryGrid extends Component{

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getGiftInventoryByUserId({userId: _id})
    }
    squaresArrayRender = (giftInventory) => {
        const giftInventoryClone = cloneDeep(giftInventory);
        let squares = [];
        //catching when quantity < 0
        const giftInventoryFilter = giftInventoryClone.filter(gift => gift.quantity > 0);
        for (let i = 0; i < 80 - giftInventoryFilter.length; i++) {
            squares.push({key: i + giftInventoryFilter.length})
        }
        return [...giftInventoryFilter, ...squares]
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

    render() {
        const {giftInventory , onHandleShowPopup,settingReducer:{language}} = this.props;
        if(!giftInventory){
            return this.loading();
        }else{
            const squaresArray = this.squaresArrayRender(giftInventory);
            return (
                <div className='grid-inventory-container'>
                    {squaresArray.map((item , index) => {
                        const {randomBoxId  , quantity  } = item;
                        const status = {currentPopup : randomBoxAlert.usingRandomBoxPopup , item};
                        return(
                            <div className='grid-inventory' key={index} onClick={() => randomBoxId && onHandleShowPopup(status)}>
                                <img src={getShopImgByItemId(randomBoxId)} alt=''/>
                                {quantity && <div className='quantity'><span>{quantity > 999 ? '999+' : quantity}</span></div>}
                                {randomBoxId && <ToolTipInventoryComponent
                                    itemId={randomBoxId}
                                    quantity={quantity}
                                    title={<ItemTranslate itemSelected={item} name={true} decoClass='translation'  language={language} />} 
                                    content={<ItemTranslate itemSelected={item} descriptionForInventory={true} decoClass='translation'  language={language} />}
                                    />
                                }
                            </div>
                        )
                    })}
                </div>
            );
        }

    }
}

const mapStateToProps = (state) => {
    const {authentication: { user } , inventoryReducer:{giftInventory},settingReducer} = state;
    return{
        user,giftInventory,settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    getGiftInventoryByUserId: (param) => dispatch(inventoryActions.getGiftInventoryByUserId(param))
});
export default connect(mapStateToProps , mapDispatchToProps)(RandomBoxInventoryGrid)
