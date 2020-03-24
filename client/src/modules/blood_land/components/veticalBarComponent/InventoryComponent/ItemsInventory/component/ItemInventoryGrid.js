import React, {Component} from 'react'
import {connect} from "react-redux";
import {inventoryActions} from "../../../../../../../store/actions/gameActions/inventoryActions";
import cloneDeep from 'lodash.clonedeep'
import {getShopThumbnailByItemId} from "../../../../../../../helpers/thumbnails";
import ToolTipInventoryComponent from "../../component/toolttipInventory";
import {covertDragPositionToQuadkey} from "../../../../gameMapComponent/component/GameMapFunction";
import {mapGameAction} from "../../../../../../../store/actions/gameActions/mapGameActions";
import ItemTranslate from '../../../../general/ItemTranslate';
import ItemDetailPopup from "../../component/itemDetailPopup";

class ItemInventoryGrid extends Component {
    state = {};

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getItemInventoryByUserId({userId: _id})
    }

    squaresArrayRender = (itemInventory) => {
        const itemInventoryClone = cloneDeep(itemInventory);
        let squares = [];
        //check item quantity < 0 => return item.quantity = 0
        const itemInventoryFilter = itemInventoryClone.map(item => {
            if (item.quantity <= 0 ) {item.quantity = 0}
            return item
        });
        for (let i = 0; i < 80 - itemInventoryFilter.length; i++) {
            squares.push({key: i + itemInventoryFilter.length})
        }
        return [...itemInventoryFilter, ...squares]
    };

    onDragItemCharacterEnd = (e, item) => {
        const position = {
            x: e.clientX,
            y: e.clientY
        };
        const gameTabOffset = document.getElementById("game-tab-content").getBoundingClientRect();
        const {left} = gameTabOffset;
        if (position.x < left) {
            const quadKey = covertDragPositionToQuadkey(position);
            const itemData = {
                quadKey, itemId: item.itemId
            };
            this.props.onHandleMoveItemFromInventoryToMap(itemData);
        }
    };
    onHandleDragStart = (e, imageThumb) => {
        let img = new Image();
        img.src = imageThumb;
        e.dataTransfer.setDragImage(img, 10, 10);
        this.setState({toolTipToggle: false})
    };

    loading = () => {
        return (
            <div className='load-land'>
                <div className='load__icon-wrap'>
                    <div className="lds-roller">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
            </div>
        )
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

    onClosePopup = () => {
        if (this.state.isOpenItemDetail) {
            this.setState({isOpenItemDetail: false, itemDetail: null});
        }
    };
    render() {
        const {itemInventory,settingReducer:{language}} = this.props;
        if (!itemInventory) {
            return this.loading();
        } else {
            const {toolTipToggle , isOpenItemDetail , itemDetail} = this.state;
            const squaresArray = this.squaresArrayRender(itemInventory);
            return (
                <div className='grid-inventory-container'>
                    <div className='popup-container' style={{display: isOpenItemDetail ? 'block' : 'none'}}>
                        {isOpenItemDetail && <ItemDetailPopup itemDetail={itemDetail} handleHidePopup={this.onClosePopup} />}
                    </div>
                    {squaresArray.map((item, index) => {
                        const {itemId, quantity} = item;
                        const imageThumb = getShopThumbnailByItemId(itemId);
                        return (
                            <div className='grid-inventory' key={index}
                                 onClick={() => itemId && this.openItemDetail(item)}
                                 onMouseOver={() => this.setState({toolTipToggle: true})}>
                                <div draggable={true} onDragStart={(e) => this.onHandleDragStart(e, imageThumb)}
                                     onDragEnd={(e) => this.onDragItemCharacterEnd(e, item)}>
                                    <img src={imageThumb} alt=''/>
                                </div>
                                {itemId && itemId !== 'I03' &&
                                <div className='quantity'><span>{quantity > 999 ? '999+' : quantity}</span></div>}
                                {itemId && toolTipToggle &&
                                <ToolTipInventoryComponent  title={<ItemTranslate itemSelected={item} name={true} decoClass='translation'  language={language} />} 
                                                            content={<ItemTranslate itemSelected={item} descriptionForInventory={true} decoClass='translation'  language={language} />}
                                                            quantity={quantity} itemId={itemId}/>}
                            </div>
                        )
                    })}
                </div>
            );
        }

    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, inventoryReducer: {itemInventory},settingReducer} = state;
    return {
        user, itemInventory,settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    getItemInventoryByUserId: (param) => dispatch(inventoryActions.getItemInventoryByUserId(param)),
    onHandleMoveItemFromInventoryToMap: (itemData) => dispatch(mapGameAction.onHandleMoveItemFromInventoryToMap(itemData))
});
export default connect(mapStateToProps, mapDispatchToProps)(ItemInventoryGrid)