import React, {PureComponent} from 'react';
import {getShopImgByItemId} from "../../../../../../helpers/thumbnails";
import ClickNHold from 'react-click-n-hold';
import {arrowLeft, arrowRight, bloodICon} from "../asset";
import {alertPopup} from "./alertPopup";

import TranslateLanguage from "../../../general/TranslateComponent";
import { itemTranslateInfo } from './../../../general/ItemTranslateAsString';
import Tooltip from './../../../general/Tooltip';
import ItemTranslate from '../../../general/ItemTranslate';

const defaultCountdownTime = 1;
const timeToAction = 300;
let timer = 0;


class ShopDetailComponent extends PureComponent {
    state = {
        second: defaultCountdownTime,
        quantity: 0
    };

    minusQty = () => {
        if (this.state.quantity > 0) {
            this.setState({
                quantity: this.state.quantity - 1
            });
        }
    };
    minusQtyMulti = () => {
        this.setState({
            quantity: this.state.quantity - 100 > 0 ? this.state.quantity - 100 : 0
        });
        // else if(this.state.quantity <= 100){
        //     this.setState({
        //         quantity: this.state.quantity - 100 > 0 ? this.state.quantity - 100 : 0
        //     })
        // }
    };
    addQty = () => {
        if (this.state.quantity < 1000) {
            this.setState({
                quantity: this.state.quantity + 1
            });
        }
    };
    addQtyMulti = () => {
        if (this.state.quantity < 1000) {
            this.setState({
                quantity: this.state.quantity + 100 < 1000 ? this.state.quantity + 100 : 1000
            });
        }
    };
    clickNHold = (mode) => {
        switch (mode) {
            case 'add':
                return this.invokeAdd10ItemAmount();
            case 'add-multi':
                return this.invokeAdd100ItemAmount();
            case 'remove':
                return this.invokeRemove10ItemAmount();
            case 'remove-multi':
                return this.invokeRemove100ItemAmount();
            default:
                return this.invokeAdd10ItemAmount();
        }
    };

    //for 10 item
    invokeAdd10ItemAmount = () => {
        timer = setInterval(this.countDownAddOne, timeToAction)
    };
    invokeRemove10ItemAmount = () => {
        timer = this.state.quantity >= 10 && setInterval(this.countDownRemoveOne, timeToAction)
    };

    countDownRemoveOne = () => {
        const {seconds} = this.state;
        let second = seconds === 0 ? 0 : seconds - 1;
        seconds > 0 && this.setState({
            seconds: second
        });
        if (seconds === 0) {
            this.setState({
                quantity: this.state.quantity >= 10 ? this.state.quantity - 10 : 0
            })

        }
    };
    countDownAddOne = () => {
        const {seconds} = this.state;
        let second = seconds === 0 ? 0 : seconds - 1;
        seconds > 0 && this.setState({
            seconds: second
        });
        if (seconds === 0) {
            this.setState({
                quantity: this.state.quantity < 1000 ? this.state.quantity + 10 : 1000
            });

        }
    };
    // ============================================================================================


    //for 100 item
    invokeRemove100ItemAmount = () => {
        timer = this.state.quantity - 100 >= 100 && setInterval(this.countDownRemoveMulti, timeToAction)
    };
    invokeAdd100ItemAmount = () => {
        timer = setInterval(this.countDownAddMulti, timeToAction)
    };
    countDownRemoveMulti = () => {
        const {seconds} = this.state;
        let second = seconds === 0 ? 0 : seconds - 1;
        seconds > 0 && this.setState({
            seconds: second
        });
        if (seconds === 0) {
            this.setState({
                quantity: this.state.quantity - 100 >= 100 ? this.state.quantity - 100 : 0
            })

        }
    };
    countDownAddMulti = () => {
        const {seconds} = this.state;
        let second = seconds === 0 ? 0 : seconds - 1;
        seconds > 0 && this.setState({
            seconds: second
        });
        if (seconds === 0) {
            this.setState({
                quantity: this.state.quantity + 100 < 1000 ? this.state.quantity + 100 : 1000
            });

        }
    };
    // ===============================================================================================


    breakInvoke = () => {
        clearInterval(timer);
        timer = 0;
        this.setState({
            seconds: defaultCountdownTime
        })
    };


    handleOnClickBuy = (itemId, quantity) => {

        const {bloodLeft} = this.props;
        if (bloodLeft < 0) {
            this.props.handleShowPopup(alertPopup.alertBloodRecharge)
        } else if (quantity === 0) {
            this.props.handleShowPopup(alertPopup.alertQuantity)
        } else {
            this.props.handleShowPopup(alertPopup.alertConfirmPurchaseItem);
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.itemSelected !== this.props.itemSelected) {
            this.setState({
                quantity: 0
            })
        }
    }

    render() {
        let {itemSelected,language, shops} = this.props;
        // console.log('ỉte', itemSelected)
        if (!itemSelected) {
            return <div>Loading</div>
        } else {
            
            itemSelected = !itemSelected.randomBoxId ?  shops.find(i => i.itemId === itemSelected.itemId) : itemSelected;
            const {quantity} = this.state;
            const {itemId, randomBoxId, price} = itemSelected;

            const {name} = itemTranslateInfo (itemSelected,language);
            this.props.onHandleGetQuantity(quantity);
            const multiSelectPreTooltipName =  'menuTab.shop.valueSelectMulti.preTooltip.name',
                  multiSelectPreTooltipdesc = 'menuTab.shop.valueSelectMulti.preTooltip.desc';
            
            const multiSelectNextTooltip = {
                name: 'menuTab.shop.valueSelectMulti.nextTooltip.name',
                desc:'menuTab.shop.valueSelectMulti.nextTooltip.desc' 
            }
            const valueSelectPreTooltip = {
                name: 'menuTab.shop.valueSelect.preTooltip.name',
                desc:'menuTab.shop.valueSelect.preTooltip.desc' 
            }
            const valueSelectNextTooltip = {
                name: 'menuTab.shop.valueSelect.nextTooltip.name',
                desc:'menuTab.shop.valueSelect.nextTooltip.desc' 
            }

            return (
                <div className='item-info'>
                    <div className='item-lg-thumbnail'>
                        <div className='img-content'>
                            <img alt={name} src={getShopImgByItemId(itemId ? itemId : randomBoxId)}/>
                        </div>
                        {itemSelected.buyLimitAmount && <div className='item-amount'>
                            <TranslateLanguage direct={'menuTab.shop.quantity'} /> : {itemSelected.buyLimitAmount}
                        </div>}
                    </div>
                    <div className='item-description'>
                        <div className='desc-content'>
                            <div className='item-title'>
                                <ItemTranslate itemSelected={itemSelected} name={true} decoClass='translation'  language={language} />
                            </div>
                            <div className='item-desc'>
                                <ItemTranslate itemSelected={itemSelected} descriptionForShop={true} decoClass='translation'  language={language} />
                            </div>
                            {/*open buy Item in Shop - Mr. Quan - remove category !== 'ITEM'*/}
                            { itemId !== 'I03' && <div className='item-amount-selector'>
                                <div className='amount-select'>
                                   <span className='value-select-multi' onMouseEnter={()=>this.setState({toolTipToogle:true})} onMouseLeave={()=>this.setState({toolTipToogle:false})}>
                                        <ClickNHold time={0.5} onStart={this.minusQtyMulti}
                                                    onClickNHold={() => this.clickNHold('remove-multi')}
                                                    onEnd={this.breakInvoke}>
                                            <span>
                                                   <img src={arrowLeft} alt=''/>
                                                   <img src={arrowLeft} alt=''/>
                                            </span>
                                        </ClickNHold>
                                        {this.state.toolTipToogle && <Tooltip nameLang={multiSelectPreTooltipName} descLang={multiSelectPreTooltipdesc} />}
                                    </span>
                                    <span className='value-select' onMouseEnter={()=>this.setState({toolTipToogle:true})} onMouseLeave={()=>this.setState({toolTipToogle:false})}>
                                        <ClickNHold time={0.5} onStart={this.minusQty}
                                                    onClickNHold={() => this.clickNHold('remove')}
                                                    onEnd={this.breakInvoke}>
                                        <img src={arrowLeft} alt=''/>
                                        </ClickNHold>
                                        {this.state.toolTipToogle && <Tooltip nameLang={valueSelectPreTooltip.name} descLang={valueSelectPreTooltip.desc} />}
                                    </span>
                                    <div className='amount-value'>{quantity}</div>
                                    <span className='value-select' onMouseEnter={()=>this.setState({toolTipToogle:true})} onMouseLeave={()=>this.setState({toolTipToogle:false})}>
                                        <ClickNHold time={0.5}
                                                    onStart={this.addQty}
                                                    onClickNHold={() => this.clickNHold('add')}
                                                    onEnd={this.breakInvoke}>
                                            <img src={arrowRight} alt=''/>
                                        </ClickNHold>
                                        {this.state.toolTipToogle && <Tooltip nameLang={valueSelectNextTooltip.name} descLang={valueSelectNextTooltip.desc} />}
                                    </span>
                                    <span className='value-select-multi' onMouseEnter={()=>this.setState({toolTipToogle:true})} onMouseLeave={()=>this.setState({toolTipToogle:false})}>
                                        <ClickNHold time={0.5} onStart={this.addQtyMulti}
                                                    onClickNHold={() => this.clickNHold('add-multi')}
                                                    onEnd={this.breakInvoke}>
                                            <span>
                                                  <img src={arrowRight} alt=''/>
                                                  <img src={arrowRight} alt=''/>
                                            </span>
                                        </ClickNHold>
                                        {this.state.toolTipToogle && <Tooltip nameLang={multiSelectNextTooltip.name} descLang={multiSelectNextTooltip.desc} />}
                                    </span>
                                </div>
                                <TranslateLanguage direct={'menuTab.shop.amountSelect'} />
                            </div>}
                            {/*open buy Item in Shop - Mr. Quan - remove category !== 'ITEM'*/}
                            { itemId !== 'I03' && <button className='item-purchase'       
                                    onClick={() => this.handleOnClickBuy(itemId, quantity)}>
                                <div className='item-price'>
                                    {/*open buy Item in Shop - Mr. Quan - remove category !== 'ITEM'*/}
                                    <img src={bloodICon} alt=''/> {quantity * price}
                                </div>
                                {/*open buy Item in Shop - Mr. Quan*/}
                                <div className='item-price-btn'>
                                    <TranslateLanguage direct={'menuTab.shop.buyBtn'} />
                                </div>
                            </button>}
                        </div>
                    </div>
                </div>
            );
        }
    }
}


export default ShopDetailComponent