import React, {Component} from 'react';
import cloneDeep from "lodash.clonedeep";
import {getMapImgByItemId} from "../../../../../../../helpers/thumbnails";
import ItemDetailPopup from '../../component/itemDetailPopup';
import ToolTipInventoryComponent from "../../component/toolttipInventory";
import ItemTranslate from '../../../../general/ItemTranslate';

class CharacterInventoryGridOnLand extends Component {
    state = {
        isOpenItemDetail: false,
        itemDetail: null
    };


    createSquare = () => {
        const {onLands} = this.props;
        const characterInventoryClone = cloneDeep(onLands);
        let squares = [];
        for (let i = 0; i < 75 - characterInventoryClone.length; i++) {
            squares.push({key: i + characterInventoryClone.length})
        }
        return [...characterInventoryClone, ...squares]
    };


    onClosePopup = () => {
        if (this.state.isOpenItemDetail) {
            this.setState({isOpenItemDetail: false, itemDetail: null});
        }

    };


    openItemDetail = (itemDetail) => {
        //if closed popup
        if (!this.state.isOpenItemDetail) {
            this.setState({isOpenItemDetail: true, itemDetail: itemDetail});
        } else { //if open another item when some item's opened
            if (this.state.itemDetail._id.toString() !== itemDetail._id.toString()) {
                this.setState({isOpenItemDetail: true, itemDetail: itemDetail});
            }
        }
    };

    render() {
        const {isOpenItemDetail, itemDetail} = this.state;
        const {settingReducer:{language}} = this.props;
        const squaresArray = this.createSquare();
        return (
            <div className='grid-inventory-container'>
                <div className='popup-container' style={{display: isOpenItemDetail ? 'block' : 'none'}}>
                    {isOpenItemDetail && <ItemDetailPopup itemDetail={itemDetail} handleHidePopup={this.onClosePopup} language={language}/>}
                </div>
                {squaresArray.map((item, index) => {
                    const {itemId, itemDetail, quantity} = item;
                    return (
                        <div className='grid-inventory' key={index}
                             onClick={() => itemId && this.openItemDetail(itemDetail)}>
                            {itemDetail && <div><img style={{width:'20px'}} src={getMapImgByItemId(itemId)} alt={itemDetail.name_ko}/></div>}
                            {quantity && <div className='quantity'><span>{quantity > 999 ? '999+' : quantity}</span></div>}
                            {itemId && <ToolTipInventoryComponent title={<ItemTranslate itemSelected={item} name={true} decoClass='translation'  language={language} />} 
                                                                  content={<ItemTranslate itemSelected={item} descriptionForInventory={true} decoClass='translation'  language={language} />}
                                                                  quantity={quantity}
                                                                  itemId={itemId} />}
                        </div>
                    )
                })}
            </div>
        );
    }
}


export default CharacterInventoryGridOnLand