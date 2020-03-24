import React, {PureComponent} from 'react';
import {getShopImgByItemId} from "../../../../../../../helpers/thumbnails";
import {bloodICon} from "../../asset";

class GiftList extends PureComponent {
    state = {};
    onHandleCharacterClick = (gift) => {
        this.setState({
            giftSelected: gift
        });
        this.props.onHandleObjectSelected(gift)
    };

    giftListRender = (giftList) => {
        const {giftSelected} = this.state;
        if(!giftSelected){
            return <div>Loading</div>
        }else{
            const {randomBoxId} = giftSelected;
            return (
                giftList.map((gift, index) => {
                    return (
                        <div className={`shop-item ${gift.randomBoxId === randomBoxId && 'selected'}`} key={index} onClick={() => this.onHandleCharacterClick(gift)}>
                            <div className='item-img'>
                            <span>
                                <img src={getShopImgByItemId(gift.randomBoxId)} alt={gift.name_ko}/>
                            </span>
                            </div>
                            <div className='item-price'>
                                <img className='blood-icon' src={bloodICon} alt='bloodCoin'/>
                                {gift.price}
                            </div>
                        </div>
                    )
                })
            )
        }
    };

    componentDidMount() {
        const {giftList} = this.props;
        if (giftList) {
            this.setState({
                giftSelected: giftList[0]
            });
            this.props.onHandleObjectSelected(giftList[0])
        }
    }

    render() {

        let {giftList} = this.props;

        if (!giftList) {
            return <div>Loading</div>
        } else {
            giftList = giftList.sort((a,b)=>{return a.price - b.price });
            return (
                <div className='shop-storage'>
                    <div className='list-nav-btn' onClick={() => this.preOffsetList(giftList)}>
                        {/*<img src={largePreBtn} alt=''/>*/}
                    </div>
                    <div className='shop-list'>
                        <div className='offset-view'>
                            {giftList && this.giftListRender(giftList)}
                        </div>
                    </div>
                    <div className='list-nav-btn' onClick={() => this.nextOffsetList(giftList)}>
                        {/*<img src={largeNextBtn} alt=''/>*/}
                    </div>
                </div>
            )
        }

    }
}

export default GiftList
