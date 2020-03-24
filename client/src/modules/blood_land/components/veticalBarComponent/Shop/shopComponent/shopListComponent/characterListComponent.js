import React, {Component} from 'react'
import {bloodICon, largeNextBtn, largePreBtn} from "../../asset";
import cloneDeep from 'lodash.clonedeep';
import {getShopImgByItemId} from "../../../../../../../helpers/thumbnails";
import TranslateLanguage from "../../../../general/TranslateComponent";
import classNames from 'classnames';


const widthShopItem = 52;

class ShopCharacter extends Component {
    state = {
        offsetX: 0
    };
    //navigation function
    preOffsetList = (characterList) => {
        const {offsetX} = this.state;
        if(characterList.length > 10 && offsetX !== 0 ){
            this.setState({
                offsetX: offsetX + widthShopItem
            })
        }
    };
    nextOffsetList = (characterList) => {
        const {offsetX} = this.state;
        const offSetMax = -((characterList.length - 10) * widthShopItem);
        if(characterList.length > 10 && offsetX > offSetMax){
            this.setState({
                offsetX: this.state.offsetX - widthShopItem
            })
        }

    };
    onSetOffsetViewStyle = (characterList) => {
        let characterClone = cloneDeep(characterList);
        const {offsetX} = this.state;
        const viewWidth = widthShopItem * characterClone.length;
        return {
            width: `${viewWidth}px`,
            left: `${offsetX}px`
        }
    };

    getItemCondition = (character) =>{
        const canNotBuy = character.status === "CANNOTBUY";
        const soldOut   = character ? character.buyLimitAmount <= 0 : false;
        return {canNotBuy,soldOut};
    }

    //on handle character selected
    onHandleCharacterClick = (character) => {
        const {canNotBuy,soldOut} = this.getItemCondition(character);
        if(!canNotBuy && !soldOut){
            this.setState({
               characterSelected: character
            });
            this.props.onHandleObjectSelected(character)
        }
    };


    characterListRender = (characterListSort) => {
        const {characterSelected} = this.state;

        if(!characterSelected){
            return <div>Loading</div>
        }else{
            return (
                characterListSort.map((character, index) => {
                    const {itemId} = characterSelected;
                    const {canNotBuy,soldOut} = this.getItemCondition(character);
                    const shopItemClassName = classNames({
                        'shop-item':true,
                        'disable': canNotBuy || soldOut,
                        'selected': character.itemId === itemId
                    });

                    return (
                        <div className={shopItemClassName} key={index} onClick={() => this.onHandleCharacterClick(character)}>
                            <div className='item-img'>
                            <span>
                                <img src={getShopImgByItemId(character.itemId)} alt={character.name_ko}/>
                            </span>
                            </div>
                            {
                                character.status === 'LIMIT' &&  <div className='item-amount'>
                                    {character.buyLimitAmount}
                                </div>
                            }
                            {
                                character.status === 'CANBUY' || character.status === 'LIMIT'  ? 
                                <div className={`item-price${character.status === 'LIMIT' ? '-1':''}`}>
                                    <img className='blood-icon' src={bloodICon} alt='bloodCoin'/>
                                    {character.price}
                                </div> : 
                                <div className='item-not-available'><span className='item-panel'><TranslateLanguage direct={'menuTab.shop.preparing'}/></span></div>
                            }
                        </div>
                    )
                })
            )
        }

    };


    componentDidMount() {
        const {characterList} = this.props;
        if (characterList) {
            let bloodTree = characterList.filter(i => i.category === 'TREE' && i.status !== 'HIDDEN').sort((a,b)=>{return a.price - b.price });
            let character = characterList.filter(i => i.category === 'CHARACTER');
            let characterListSort = [...bloodTree, ...character];
            process.env.NODE_ENV === 'production' && characterListSort.filter(ch => ch.itemId !== 'T10');
            this.setState({
                characterSelected: characterListSort[0]
            });
            this.props.onHandleObjectSelected(characterListSort[0])
        }

    }

    render() {
        const {characterList} = this.props;
        if (!characterList) {
            return <div>Loading</div>
        } else {
            const offsetViewStyle = this.onSetOffsetViewStyle(characterList);
            let bloodTree = characterList.filter(i => i.category === 'TREE' && i.status !== 'HIDDEN').sort((a,b)=>{return a.price - b.price });
            let character = characterList.filter(i => i.category === 'CHARACTER');
            let characterListSort = [...bloodTree, ...character];
            return (
                <div className='shop-storage'>
                    <div className='list-nav-btn'  onClick={() => this.preOffsetList(characterListSort)}>
                        <img src={largePreBtn} alt=''/>
                    </div>
                    <div className='shop-list'>
                        <div className='offset-view' style={offsetViewStyle}>
                            {characterListSort && this.characterListRender(characterListSort)}
                        </div>
                    </div>
                    <div className='list-nav-btn' onClick={() => this.nextOffsetList(characterListSort)}>
                        <img src={largeNextBtn} alt=''/>
                    </div>
                </div>
            )
        }
    }
}

export default ShopCharacter
