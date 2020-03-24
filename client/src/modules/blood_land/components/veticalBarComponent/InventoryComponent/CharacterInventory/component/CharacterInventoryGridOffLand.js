import React, {Component, Fragment} from 'react';
import cloneDeep from "lodash.clonedeep";
import {getShopImgByItemId, getShopThumbnailByItemId} from "../../../../../../../helpers/thumbnails";
import ItemDetailPopup from '../../component/itemDetailPopup';
import ToolTipInventoryComponent from "../../component/toolttipInventory";
import {covertDragPositionToQuadkey} from "../../../../gameMapComponent/component/GameMapFunction";
import {mapGameAction} from "../../../../../../../store/actions/gameActions/mapGameActions";
import {connect} from 'react-redux';
import Tooltip from "../../../../general/Tooltip";
import {alertPopup} from "./Alert&Popup";
import ItemTranslate from '../../../../general/ItemTranslate';
import TranslateLanguage from './../../../../general/TranslateComponent';

class CharacterInventoryGridOffLand extends Component {
    state = {
        isOpenItemDetail: false,
        itemDetail: null
    };
    //create square in inventory
    createSquare = () => {
        const {characterInventory} = this.props;
        const characterInventoryClone = cloneDeep(characterInventory);
        const characterInventoryFilter = characterInventoryClone.filter(character => character.quantity > 0);
        let squares = [];
        for (let i = 0; i < 70 - characterInventoryFilter.length; i++) {
            squares.push({key: i + characterInventoryFilter.length})
        }
        return [...characterInventoryFilter, ...squares]
    };

    onDragItemCharacterEnd = (e, item) => {
        const position = {
            x: e.clientX,
            y: e.clientY
        };
        this.setState({
            isImageDisplay: false
        });
        const gameTabOffset = document.getElementById("game-tab-content").getBoundingClientRect();
        const {left} = gameTabOffset;
        if (position.x < left) {
            const quadKey = covertDragPositionToQuadkey(position);
            const characterData = {
                quadKey, item
            };
            this.props.onHandleMoveCharacterFromInventoryToMap(characterData);
            item.itemId === 'T10' && this.props.onHandleGetQuadKeyBitamin(quadKey);
        }else{
            this.props.onHandleGetQuadKeyBitamin()
        }
    };

    onHandleDragSpecialItem = (e) => {
        const position = {
            x: e.clientX,
            y: e.clientY
        };
        const {myLands} = this.props;
        const gameTabOffset = document.getElementById("game-tab-content").getBoundingClientRect();
        const {left} = gameTabOffset;
        if (position.x < left) {
            const quadKey = covertDragPositionToQuadkey(position);
            if (localStorage.quadKeyBitamin !== quadKey) {
                localStorage.setItem('quadKeyBitamin', quadKey);
                const checkMyLands = myLands.filter(land => land.quadKey === quadKey);
                checkMyLands.length !== 0 && this.props.onHandleGetQuadKeyBitamin(quadKey);
            }
        }
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
    onHandDragStart = (e, imageThumb) => {
        let img = new Image();
        img.src = imageThumb;
        e.dataTransfer.setDragImage(img, 10, 10);
        this.setState({
            toolTipToggle: false
        })
    };


    onHandleShowCombineTree = () => {
        const {onHandleShowPopup} = this.props;
        onHandleShowPopup(alertPopup.combineTreePopup)
    };



    render() {
        const {toolTipToggle, isOpenItemDetail, itemDetail} = this.state;
        const {settingReducer: {language}} = this.props;
        const squaresArray = this.createSquare();
        return (
            <Fragment>
                <div className='grid-inventory-container'>
                    <div className='popup-container' style={{display: isOpenItemDetail ? 'block' : 'none'}}>
                        {isOpenItemDetail &&
                        <ItemDetailPopup itemDetail={itemDetail} handleHidePopup={this.onClosePopup}/>}
                    </div>
                    {squaresArray.map((item, index) => {
                        const {itemId, quantity,} = item;
                        const imageThumb = getShopThumbnailByItemId(itemId);
                        return (
                            <div className='grid-inventory' key={index}
                                 onClick={() => itemId && this.openItemDetail(item)}
                                 onMouseOver={() => this.setState({toolTipToggle: true})}>
                                <div draggable={true}
                                     onDragStart={(e) => this.onHandDragStart(e, imageThumb)}
                                     onDrag={(e) => itemId === 'T10' && this.onHandleDragSpecialItem(e, item)}
                                     onDragEnd={(e) => this.onDragItemCharacterEnd(e, item)}
                                >
                                    <img src={getShopImgByItemId(itemId)} alt={imageThumb}/>
                                    <img src={imageThumb} alt={imageThumb} style={{display: 'none'}}/>
                                </div>
                                {quantity &&
                                <div className='quantity'><span>{quantity > 999 ? '999+' : quantity}</span></div>}
                                {itemId && toolTipToggle &&
                                <ToolTipInventoryComponent
                                    title={<ItemTranslate itemSelected={item} name={true} decoClass='translation'
                                                          language={language}/>}
                                    content={<ItemTranslate itemSelected={item} descriptionForInventory={true}
                                                            decoClass='translation' language={language}/>}
                                    quantity={quantity} itemId={itemId}/>}
                            </div>
                        )
                    })}
                </div>
                <div className='combine-tree-button-container'>
                    <div className='combine-tree-button'>
                        <span onClick={() => this.onHandleShowCombineTree()}><TranslateLanguage direct={'menuTab.characters.offLand.toolTip.combine-tree-button.name'}/></span>
                        <Tooltip descLang={'menuTab.characters.offLand.toolTip.combine-tree-button.desc'}/>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {mapGameReducer: {quadKeyCheckTileEffect}, lands: {myLands}} = state;
    return {
        quadKeyCheckTileEffect, myLands
    }
};
const mapDispatchToProps = (dispatch) => ({
    onHandleMoveCharacterFromInventoryToMap: (characterData) => dispatch(mapGameAction.onHandleMoveCharacterFromInventoryToMap(characterData)),
    onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterInventoryGridOffLand)