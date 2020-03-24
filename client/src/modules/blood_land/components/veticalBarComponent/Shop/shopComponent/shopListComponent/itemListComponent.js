import React, {Component} from 'react';
import {bloodICon } from "../../asset";
import cloneDeep from "lodash.clonedeep";
import {getShopImgByItemId} from "../../../../../../../helpers/thumbnails";

const widthShopItem = 52;

class ItemShop extends Component {
    state = {
        offsetX: 0
    };
    onHandleItemClick = (item) => {
        this.setState({
            itemSelected: item
        });
        this.props.onHandleObjectSelected(item)
    };

    itemListRender = (itemList) => {
        const {itemSelected} = this.state;
        if(!itemSelected){
            return <div>Loading</div>
        }else{
            return(
                itemList.map((item , index) => {
                    const {itemId} = itemSelected;
                    return(
                        <div className={`shop-item ${item.itemId === itemId && 'selected'}`} key={index} onClick={() => this.onHandleItemClick(item)}>
                            <div className='item-img'>
                            <span>
                                <img src={getShopImgByItemId(item.itemId)} alt={item.name_ko}/>
                            </span>
                            </div>
                            <div className='item-price'>
                                <img className='blood-icon' src={bloodICon} alt='bloodCoin'/>
                                {item.price}
                            </div>
                        </div>
                    )
                })
            )
        }
    };

    onSetOffsetViewStyle = (itemList) => {
        let itemListClone = cloneDeep(itemList);
        const {offsetX} = this.state;
        const viewWidth = widthShopItem * itemListClone.length;
        return {
            width: `${viewWidth}px`,
            left: `${offsetX}px`
        }
    };

    componentDidMount() {
        const {itemList} = this.props;
        if (itemList) {
            this.setState({
               itemSelected: itemList[0]
            });
            this.props.onHandleObjectSelected(itemList[0])
        }
    }

    render() {
        const {itemList} = this.props;
        if (!itemList) {
            return <div>Loading</div>
        } else {
            const offsetViewStyle = this.onSetOffsetViewStyle(itemList);
            return (
                <div className='shop-storage'>
                    <div className='list-nav-btn'>
                        {/*<img src={largePreBtn} alt=''/>*/}
                    </div>
                    <div className='shop-list'>
                        <div className='offset-view' style={offsetViewStyle}>
                            {itemList && this.itemListRender(itemList)}
                        </div>
                    </div>
                    <div className='list-nav-btn'>
                        {/*<img src={largeNextBtn} alt=''/>*/}
                    </div>
                </div>
            )
        }

    }
}

export default ItemShop