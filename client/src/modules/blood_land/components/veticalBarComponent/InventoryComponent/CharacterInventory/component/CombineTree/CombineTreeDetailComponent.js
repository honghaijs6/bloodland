import React, {Fragment, PureComponent} from "react";
import {getShopImgByItemId} from "../../../../../../../../helpers/thumbnails";
import {connect} from 'react-redux'
import ClickNHold from 'react-click-n-hold';
import cloneDeep from "lodash.clonedeep";
import {alertPopup} from "../Alert&Popup";
import common from "../../../../../../../../helpers/Common";
// import Tooltip from "../../../../../general/Tooltip";
import TranslateLanguage from './../../../../../general/TranslateComponent';
import ItemTranslate from './../../../../../general/ItemTranslate';

const BUTTON_COMBINE = [
    {title: <TranslateLanguage direct={'treeCombine.singleCombineTreeBtn'} />, type: 'btn1'},
    {title: <TranslateLanguage direct={'treeCombine.multiCombineTreeBtn'} />, type: 'btn2'},
    {title: <TranslateLanguage direct={'treeCombine.cancelBtn'} />, type: 'btn3'}
];

const myWalletInformation = [
    // {titleInfo: 'My blood', type: 'total'},
    {titleInfo: <TranslateLanguage direct={'treeCombine.total'} />, type: 'used'},
    // {titleInfo: 'Remain blood', type: 'rest'}
];
const defaultCountdownTime = 1;
const timeToAction = 300;
let timer = 0;

class CombineTreeDetailComponent extends PureComponent {
    state = {
        seconds: defaultCountdownTime,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allTrees !== this.props.allTrees) {
            const {allTrees} = this.props;
            const allTreesNew = this.onHandleFormatAllTrees(allTrees);
            this.setState({allTreesNew})
        }
    }

    onHandleFormatAllTrees = (allTrees) => {
        const allTreeSort = allTrees.splice(0, 7).sort((a, b) => {
            return a.tree.price - b.tree.price
        });
        return allTreeSort.map((item) => {
            const {tree: {itemId, price}} = item;
            if (itemId === 'T01' && price !== 100) {
                item.tree.price = 100;
            }
            item.remainAmount = item.maxAmount - item.usingAmount;
            item.totalBlood = item.usingAmount * item.tree.price;
            return item
        })
    };

    //function for down up button===========================
    minusQty = (item) => {
        const {allTreesNew} = this.state;
        const allTreesUpdate = cloneDeep(allTreesNew);
        if (item.usingAmount > 0) {
            const findItemIndex = allTreesUpdate.findIndex(i => i.tree.itemId === item.tree.itemId);
            item.usingAmount = item.usingAmount - 1 >= 0 ? item.usingAmount - 1 : 0;
            item.remainAmount = item.maxAmount - item.usingAmount;
            item.totalBlood = item.usingAmount * item.tree.price;
            allTreesUpdate.splice(findItemIndex, 1, item);
            this.setState({
                allTreesNew: allTreesUpdate
            })
        }
    };

    addQty = (item) => {
        const {allTreesNew} = this.state;
        const allTreesUpdate = cloneDeep(allTreesNew);
        if (item.remainAmount > 0) {
            const findItemIndex = allTreesUpdate.findIndex(i => i.tree.itemId === item.tree.itemId);
            item.usingAmount = item.remainAmount - 1 < 0 ? item.maxAmount : item.usingAmount + 1;
            item.remainAmount = item.maxAmount - item.usingAmount;
            item.totalBlood = item.usingAmount * item.tree.price;
            allTreesUpdate.splice(findItemIndex, 1, item);
            this.setState({
                allTreesNew: allTreesUpdate
            })
        }
    };

    invokeAdd10ItemAmount = (item) => {
        timer = setInterval(() => this.countDownAddOne(item), timeToAction)
    };
    invokeRemove10ItemAmount = (item) => {
        timer = setInterval(() => this.countDownRemoveOne(item), timeToAction)
    };

    countDownAddOne = (item) => {
        const {allTreesNew} = this.state;
        const allTreesUpdate = cloneDeep(allTreesNew);
        if (item.remainAmount > 0) {
            const findItemIndex = allTreesUpdate.findIndex(i => i.tree.itemId === item.tree.itemId);
            item.usingAmount = item.remainAmount - 10 < 0 ? item.maxAmount : item.usingAmount + 10;
            item.remainAmount = item.maxAmount - item.usingAmount;
            item.totalBlood = item.usingAmount * item.tree.price;
            allTreesUpdate.splice(findItemIndex, 1, item);
            this.setState({
                allTreesNew: allTreesUpdate
            })
        }
    };

    countDownRemoveOne = (item) => {
        const {allTreesNew} = this.state;
        const allTreesUpdate = cloneDeep(allTreesNew);
        if (item.usingAmount > 0) {
            const findItemIndex = allTreesUpdate.findIndex(i => i.tree.itemId === item.tree.itemId);
            item.usingAmount = item.usingAmount - 10 >= 0 ? item.usingAmount - 10 : 0;
            item.remainAmount = item.maxAmount - item.usingAmount;
            item.totalBlood = item.usingAmount * item.tree.price;
            allTreesUpdate.splice(findItemIndex, 1, item);
            this.setState({
                allTreesNew: allTreesUpdate
            })
        }
    };

    breakInvoke = () => {
        clearInterval(timer);
        timer = 0;
        this.setState({
            seconds: defaultCountdownTime
        })
    };

    clickNHold = (mode, item) => {
        switch (mode) {
            case 'add':
                return this.invokeAdd10ItemAmount(item);
            case 'remove':
                return this.invokeRemove10ItemAmount(item);
            default:
                break;
        }
    };
    // ========================================================

    onHandleMouseOver = (e, item) => {
        this.setState({
            toolTipStatus: true,
            toolTipItem: item
        });
    };

    onRenderListTree = () => {
        //, toolTipItem
        const {allTreesNew } = this.state;
        if (!allTreesNew) {
            return <div>Loading</div>
        } else {
            const {language} = this.props;
            return (
                <Fragment>
                    {allTreesNew.map((item, key) => {
                        let {tree: {itemId}, tree, maxAmount, remainAmount, usingAmount} = item;
                        const maxAmountFormatStatus = maxAmount <= 999;
                        const usingAmountFormatStatus = usingAmount <= 999;
                        const isUsingAmountMin = usingAmount === 0;
                        const isUsingAmountMax = remainAmount === 0;
                        return (
                            <div className='combine-tree-item-container' key={key}>
                                <div className='tree-item-detail-container'>
                                    <div className='tree-item-detail-header'>
                                        <ItemTranslate itemSelected={tree} name={true} decoClass='translation'  language={language} />
                                    </div>
                                    <div className='tree-item-detail-image-container'>
                                        <div className='tree-item-detail-image'>
                                            <span><img src={getShopImgByItemId(itemId)}
                                                       alt={itemId}/></span>
                                        </div>
                                    </div>
                                    <div className='tree-item-detail-quantity-container'>
                                        <div className='tree-item-detail-quantity-wrapper'>
                                            <ClickNHold time={0.5}
                                                        onStart={() => !isUsingAmountMin && this.minusQty(item)}
                                                        onClickNHold={() => this.clickNHold('remove', item)}
                                                        onEnd={this.breakInvoke}
                                                        className={`down-button ${isUsingAmountMin && 'disabled'}`}>
                                                <div className='down-button-icons'>&lsaquo;</div>
                                            </ClickNHold>
                                            <div className='quantity-tree-item'
                                                 onMouseOver={(e) => this.onHandleMouseOver(e, item)}
                                                 onMouseOut={() => {
                                                     this.setState({toolTipStatus: false})
                                                 }}>
                                                {usingAmountFormatStatus ? usingAmount : '999+'}/{maxAmountFormatStatus ? maxAmount : '999+'}
                                            </div>
                                            <ClickNHold time={0.5}
                                                        onStart={() => !isUsingAmountMax && this.addQty(item)}
                                                        onClickNHold={() => this.clickNHold('add', item)}
                                                        onEnd={this.breakInvoke}
                                                        className={`up-button ${isUsingAmountMax && 'disabled'}`}>
                                                <div className='up-button-icons'>&rsaquo;</div>
                                            </ClickNHold>
                                        </div>
                                    </div>
                                    {/* {toolTipItem && toolTipItem.tree.itemId === itemId && this.onRenderToolTipForCombineTree()} */}
                                </div>
                            </div>
                        )
                    })}
                </Fragment>

            )
        }
    };

    onCalculateAndRenderAmountBlood = (goldBlood,type) => {
        let totalBlood = 0;
        const {allTreesNew} = this.state;
        if (!allTreesNew) {
            return <div>Loading</div>
        } else {
            for (let i = 0; i < allTreesNew.length; i++) {
                totalBlood += allTreesNew[i].totalBlood;
            }
            this.setState({
                totalBloodCombine: totalBlood
            });
            switch (type) {
                case 'total':
                    return common.convertLocaleStringToSpecialString(goldBlood, 12);
                case 'used':
                    return common.convertLocaleStringToSpecialString(totalBlood, 12);
                case 'rest':
                    return common.convertLocaleStringToSpecialString(goldBlood - totalBlood, 12);
                default:
                    break;
            }

        }
    };

    onRenderTotalAmountBlood = () => {
        const {wallet: {info:{goldBlood}}} = this.props;
        return myWalletInformation.map((info , key) => {
                    const {titleInfo , type} = info;
                    return(
                        <Fragment>
                            <div className='amount-blood-container' key={key}>
                                <div className='amount-blood-title'>
                                    {titleInfo}
                                </div>
                                <div className='amount-blood-number'>
                                    {this.onCalculateAndRenderAmountBlood(goldBlood,type)} / {common.convertLocaleStringToSpecialString(4000, 12)}
                                </div>
                                <div className='amount-blood-currency'>
                                    BLOOD
                                </div>
                            </div>
                            <div className='clue'><TranslateLanguage direct={'treeCombine.clue'} /></div>
                        </Fragment>
                    );
                });
    };

    onHandleSingleCombineTree = () => {
        const {allTreesNew} = this.state;
        const allTreesNewClone = allTreesNew && cloneDeep(allTreesNew);
        const allTreesCombine = allTreesNewClone.filter(item => item.usingAmount !== 0);
        this.props.handleGetCombineTrees(allTreesCombine);
        const {onHandleShowCombineTreePopup} = this.props;
        onHandleShowCombineTreePopup(alertPopup.getConfirmCombineSinglePopup)
    };

    onHandleMultiCombineTree = () => {
        const {allTreesNew} = this.state;
        let allTreesNewClone = allTreesNew && cloneDeep(allTreesNew);
        allTreesNewClone.map(item => {
            item.usingAmount = item.maxAmount;
            item.remainAmount = 0;
            return item
        });
        const allTreesCombine = allTreesNewClone.filter(item => item.usingAmount !== 0);
        this.props.handleGetCombineTrees(allTreesCombine);
        const {onHandleShowCombineTreePopup} = this.props;
        onHandleShowCombineTreePopup(alertPopup.getConfirmCombineSinglePopup)
    };

    
    onHandleCombineClick = (type) => {
        let allTreePrice = 0;
        const {allTreesNew} = this.state;
        const {onHandleShowCombineTreePopup} = this.props;
        const checkTreeAmount = allTreesNew.filter(tree => tree.maxAmount > 0);
        allTreesNew.map(item => {
            allTreePrice += item.maxAmount * item.tree.price;
            return item
        });
        const {totalBloodCombine} = this.state;
        if(type === 'btn3'){
            this.props.handleHidePopup();
        }else if(checkTreeAmount.length === 0){
            onHandleShowCombineTreePopup(alertPopup.getNotHaveAnyTreeInventoryAlert)
        }else if(allTreePrice < 4000){
            onHandleShowCombineTreePopup(alertPopup.notEnoughMinimumMoneyPopup)
        } else if(type === 'btn2') {
            this.onHandleMultiCombineTree();
        }else if(totalBloodCombine < 4000){
            onHandleShowCombineTreePopup(alertPopup.notEnoughMinimumMoneyPopup)
        } else{
            switch (type) {
                case 'btn1':
                    return this.onHandleSingleCombineTree();
                case 'btn2':
                    return this.onHandleMultiCombineTree();
                case 'btn3':
                    return this.props.handleHidePopup();
                default:
                    break;
            }
        }
    };

    onRenderCombineButton = () => {
        return (
            <div className='button-combine-wrapper'>
                {BUTTON_COMBINE.map((button, key) => {
                    const {title, type} = button;
                    return (
                        <div className='button-combine' key={key}>
                            <div className='button-combine-detail-wrapper' onClick={() => this.onHandleCombineClick(type)}>
                                <div className='button-combine-title'>
                                    {title}
                                </div>
                            </div>
                        </div>)
                })}
            </div>
        )
    };


    render() {
        return (
            <div className='custom-modal-body'>
                <div className='combineTree-list-tree-container'>
                    <div className='combineTree-list-tree'>
                        {this.onRenderListTree()}
                    </div>
                    <div className='total-amount-blood-container'>
                        {this.onRenderTotalAmountBlood()}
                    </div>
                    <div className='combine-button-container'>
                        {this.onRenderCombineButton()}
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    const {inventoryReducer: {allTrees}, authentication: {user}, settingReducer: {language} , wallet} = state;
    return {
        allTrees, user, language , wallet
    }
};
export default connect(mapStateToProps, null)(CombineTreeDetailComponent)