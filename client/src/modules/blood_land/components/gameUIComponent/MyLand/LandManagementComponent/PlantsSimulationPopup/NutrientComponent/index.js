import React, {Component, Fragment, PureComponent} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import classNames from 'classnames';
import * as alert from './component/alertPopup';
import * as m from '../../../../../../../../helpers/importModule';
import isEqual from 'lodash.isequal'

const {...a} = alert.alertPopup;
const itemForTree = 'I01';

class Nutrients extends PureComponent {
    state = {
        currentAlertPopUp: a.noPopup,
        usingAmount: 0,
        selectedTreeAmount: 0,
        confirmAction: false,
        isNutrientClose: false
    };

    componentDidMount() {
        const {user: {_id}} = this.props
        const {user: {wToken}} = this.props;
        this.props.getItemInventoryByUserId({userId: _id});
        this.props.getWalletInfo({wToken});
        this.props.getAllObjectsByUserId({userId: _id});
    }

    componentDidUpdate(prevProps, prevState) {
        const {inventoryReducer: {usingResult}, myObjects} = this.props;
        const {lands, isNutrientClose} = this.state;

        ///remember
        if (!lands || !isEqual(myObjects, prevProps.myObjects)) {
            this.loadData();
        }

        if (usingResult) {
            this.handleHideAlertPopup();
            if (usingResult.status) {
                this.handleShowAlertPopup(a.usingItemSuccessAlert);
                this.props.clearSuccessError();
            } else {
                this.handleShowAlertPopup(a.usingItemUnsuccessAlert);
                this.props.clearSuccessError();

            }
        }
        if (lands && lands.length <= 0) {
            isNutrientClose && this.props.handleHidePopup();
        }

    }

    loadData = () => {
        const {selectedLands} = this.props;
        const landAfterRemoveLimitNutritionalAndBtamin = this.getTrees().filter(l => !l.isBigTreeQuadKey && l.tree.limitUseNutritional > 0);
        const landBtamin = this.getBitaminTrees();
        let typeAlert = "";
        if (selectedLands.length !== 0) {
            //có chọn đất
            if (landBtamin && this.getTrees().length === 0) {
                typeAlert = "landHaveBtaminTree";
            }
            if (this.getTrees().length > 0) {
                if (landAfterRemoveLimitNutritionalAndBtamin.length === 0) {
                    //đã tiêm thuốc đầy đủ
                    typeAlert = "fullNutritional";
                } else {
                    //Normal
                }
            } else {
                if(!landBtamin){
                    typeAlert = "pleasePlantTreeBefore";
                }
            }
        } else {
            typeAlert = "noSelection";
        }


        //const maxLimitNutrilands = lands.filter(val => val.tree.limitUseNutritional === 0);
        const {isNutrientClose} = this.state;
        if (typeAlert === "fullNutritional") {
            //console.log('this.handleShowAlertPopup(a.enoughNutritionAlert);')
            this.handleShowAlertPopup(a.enoughNutritionAlert);
        } else if (typeAlert === "noSelection") {
            //console.log('this.handleShowAlertPopup(a.noTreeSelection)')
            !isNutrientClose && this.handleShowAlertPopup(a.noTreeSelection);
        } else if (typeAlert === "pleasePlantTreeBefore") {
            //console.log('plant tree');
            this.handleShowAlertPopup(a.getPlantTreeBefore);
        }else if(typeAlert === "landHaveBtaminTree") {
            this.handleShowAlertPopup(a.landHaveBtaminTreeAlert);
        }

        this.setState({
            lands: landAfterRemoveLimitNutritionalAndBtamin
        });
    }
    getBitaminTrees = () => {
        const {selectedLands, myObjects} = this.props;
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];

        let isBigTreeQuadKey = [];
        selectedLands.map(land => {
            isBigTreeQuadKey = allBigTreeQuadKey.some(bigTrQK => bigTrQK === land.quadKey)
        });
        return isBigTreeQuadKey;
    }
    getTrees = () => {
        const {selectedLands, myObjects} = this.props;
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        return selectedLands.map(land => {
            return {
                tree: myObjects.find(elm => elm.quadKey === land.quadKey && m.common.waterLeftSecond(elm.waterEndTime) > 0),
                land: land,
                isBigTreeQuadKey: allBigTreeQuadKey.some(bigTrQK => bigTrQK === land.quadKey),
                checked: false
            };
        }).filter(item => item.tree && item.land.forSaleStatus === false && item.tree.category === 'TREE');
    };

    clickCheckbox = (tree) => {
        let treeForCaring = [...this.state.lands];
        let fIndex = treeForCaring.findIndex(l => l.land.quadKey === tree.land.quadKey);

        treeForCaring[fIndex].checked = !tree.checked;
        let countCheckedTree = treeForCaring.filter(l => l.checked === true).length;
        this.setState({
            selectedTreeAmount: countCheckedTree,
            usingAmount: countCheckedTree,
            lands: treeForCaring
        });
    };

    clickCheckAll = () => {
        let {lands} = this.state;
        const isCheckAll = lands.filter(l => !l.checked).length <= 0;
        if (isCheckAll) {
            lands = lands.map(l => {
                if (l.tree.limitUseNutritional > 0) {
                    l.checked = false;
                }
                return l;
            });
            this.setState({lands});
        } else {
            lands = lands.map(l => {
                if (l.tree.limitUseNutritional > 0) {
                    l.checked = true;
                }
                return l;
            });
            this.setState({lands});
        }
    }
    //alert
    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: a.noPopup,
            modalAlertPopup: false,
        });
    };

    popupScreen = {
        shop: 13
    };

    confirmUsingItem = () => {
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}} = this.props;
        const nutrient = itemInventory && itemInventory.filter(i => i.itemId === itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;

        if (lands.filter(l => l.checked).length < 1) {
            this.handleShowAlertPopup(a.noSelectionAlert);
        } else if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
        else if (usingAmount > nutrient.quantity) {
            this.handleShowAlertPopup(a.noEnoughAmountUsingItemAlert);
        } else {
            this.handleShowAlertPopup(a.usingItemConfirmAlert);
        }
    };

    hasWaterLeftDeadTrees() {
        const {lands} = this.state;
        for (let i = 0; i < lands.length; i++) {
            const {tree} = lands[i];
            if (lands[i].checked) if (m.common.waterLeftSecond(tree.waterEndTime) <= 0) return true
        }
        return false;
    };

    useItem = () => {
        if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
        this.handleShowAlertPopup(a.loadingAlert);

        // create param for api

        const {lands} = this.state;
        const itemId = itemForTree;
        const {user: {_id}} = this.props
        let trees = [];
        for (let i = 0; i < lands.length; i++) {
            if (lands[i].checked) {
                const currentTree = lands[i].tree._id;
                trees.push(currentTree);
            }
        }
        //nutrient , trees, userId: _id
        this.props.useItem({itemId, trees, userId: _id});
    };

    checkGoldBloodAndUseItem = (neededGoldBlood) => {
        const {wallet: {info: {goldBlood}}} = this.props;
        if (neededGoldBlood <= 0 || goldBlood <= 0) {
            this.handleShowAlertPopup(a.noEnoughMoneyAlert);
        } else if (goldBlood < neededGoldBlood) {
            this.handleShowAlertPopup(a.noEnoughMoneyAlert);
        } else this.useItem();
    };

    confirmSuccess = () => {
        const {user: {_id}} = this.props;
        const {lands} = this.state;
        this.props.getAllObjectsByUserId({userId: _id});

        setTimeout(() => {
            this.loadData();
        }, 50);

        if (this.state.confirmAction) {
            //this.getTrees();
            this.handleHideAlertPopup();
            this.setState({
                isNutrientClose: true
            })
        } else {
            setTimeout(() => {
                if (this.state.lands.length > 0)
                    this.handleHideAlertPopup();
                else
                    this.handleHideAllPopup();
            }, 100);
        }
    };

    handleHideAllPopup = () => {
        this.handleHideAlertPopup();
        this.props.handleHidePopup();

    };

    checkGoldBlood = () => {
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}} = this.props;
        const nutrient = itemInventory && itemInventory.filter(i => i.itemId === itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;
        return nutrient.price * (usingAmount - nutrient.quantity);
    }

    getAlertModalPopup = () => {
        const {modalAlertPopup, currentAlertPopUp} = this.state;
        const {handleHideAlertPopup, checkGoldBloodAndUseItem, handleHideAllPopup, confirmSuccess, useItem, checkGoldBlood} = this;
        return (
            <Fragment>
                {a.noSelectionAlert === currentAlertPopUp && alert.getNoSelectionAlert({
                    modalAlertPopup,
                    handleHideAlertPopup
                })}
                {a.noEnoughAmountUsingItemAlert === currentAlertPopUp && alert.getNoEnoughAmountUsingItemAlertPopup({
                    modalAlertPopup,
                    checkGoldBloodAndUseItem,
                    handleHideAlertPopup,
                    neededGoldBlood: checkGoldBlood()
                })}
                {a.usingItemConfirmAlert === currentAlertPopUp && alert.getUsingItemConfirmAlertPopup({
                    modalAlertPopup,
                    useItem,
                    handleHideAlertPopup
                })}
                {a.usingItemSuccessAlert === currentAlertPopUp && alert.getUsingItemSuccessAlert({
                    modalAlertPopup,
                    confirmSuccess
                })}
                {a.usingItemUnsuccessAlert === currentAlertPopUp && alert.getUsingItemUnsuccessAlert({handleHideAlertPopup})}
                {a.noTreeSelection === currentAlertPopUp && alert.getNoTreeSelection({
                    modalAlertPopup,
                    handleHideAllPopup
                })}
                {a.getPlantTreeBefore === currentAlertPopUp && alert.getPlantTreeBefore({
                    modalAlertPopup,
                    handleHideAllPopup
                })}
                {a.loadingAlert === currentAlertPopUp && alert.getLoadingPopup({modalAlertPopup})}
                {a.enoughNutritionAlert === currentAlertPopUp && alert.getEnoughNutritionAlert({
                    modalAlertPopup,
                    handleHideAllPopup
                })}
                {a.leftWaterDeadAlert === currentAlertPopUp && alert.getLeftWaterDeadAlertPopup({
                    modalAlertPopup,
                    confirmSuccess
                })}
                {a.noEnoughMoneyAlert === currentAlertPopUp && alert.getNoEnoughMoneyAlertPopup({
                    modalAlertPopup,
                    handleHideAlertPopup
                })}
                {a.landHaveBtaminTreeAlert === currentAlertPopUp && alert.getLandHaveBtaminTree({
                    modalAlertPopup,
                    handleHideAllPopup
                })}
            </Fragment>
        );
    };

    getOnLandTreeListPopup = () => {
        //isCheckAll
        const {settingReducer: {language}} = this.props
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}} = this.props;
        const nutrient = itemInventory && itemInventory.filter(i => i.itemId === itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;
        const isCheckAll = lands && lands.filter(l => !l.checked).length <= 0;
        const checkAllClass = classNames({
            'check-box': true,
            'checked': isCheckAll,
        });
        const spacing = <div className='item-row'>
            <div className='tree-col'/>
            <div className='blood-col'/>
            <div className='land-col'/>
            <div className='nutrient1-col'/>
            <div className='nutrient2-col'/>
        </div>;

        return lands.length > 0 && (
            <Modal isOpen={this.props.modalPopup} backdrop="static" className={`custom-modal modal--tree-nutrients`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close"
                          onClick={() => this.props.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='tree-nutrient-container'>

                        <div className='header-grid'>
                            <div className='head1-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.select'}/>
                            </div>
                            <div className='head2-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.progress'}/>
                            </div>
                            <div className='tree-sub-col'>
                                <div className={checkAllClass} onClick={() => this.clickCheckAll()}/>
                                <span onClick={() => this.clickCheckAll()}><m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.selectAll'}/></span>
                                <div> &nbsp;{`(${(Array.isArray(lands) && lands.length) || 0})`} </div>
                            </div>
                            <div className='land-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.location'}/>
                            </div>
                            <div className='blood-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.rate'}/>
                            </div>
                            <div className='nutrient-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.nutrientTime'}/>
                            </div>
                        </div>

                        <div className='body-grid'>
                            {spacing}
                            {
                                lands.map((item, index) => {
                                    const checkBoxClass = classNames({
                                        'check-box': true,
                                        'checked': item.checked,
                                    });
                                    const {nutritionalEndTime1, nutritionalEndTime2} = item.tree;
                                    const {nutritionalDayRemaining1, nutritionalDayRemaining2} = m.common.nutritionalDayRemaining({
                                        nutritionalEndTime1,
                                        nutritionalEndTime2
                                    });
                                    return (
                                        <div className='item-row' key={index}>
                                            <div className='tree-col'>
                                                <div className={checkBoxClass}
                                                     onClick={() => this.clickCheckbox(item)}/>
                                                <img src={m.getMapImgByItemId(item.tree.itemId)} alt=''/>
                                                <span onClick={() => this.clickCheckbox(item)}><m.ItemTranslate
                                                    itemSelected={item.tree.item} name={true} decoClass='translation'
                                                    language={language}/></span>
                                            </div>
                                            <div className='land-col'>
                                                {item.land.name ? item.land.name : item.land.quadKey}
                                            </div>
                                            <div className='blood-col'>
                                                {item.tree ? item.tree.profitTotal.toFixed(6) + '%' : '0%'}
                                            </div>
                                            <div className='nutrient1-col'>
                                                <input className='left-day' disabled
                                                       value={nutritionalEndTime1 ? nutritionalDayRemaining1 : 0}/>
                                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.left'}/>
                                            </div>
                                            <div className='nutrient2-col'>
                                                <input className='left-day' disabled
                                                       value={nutritionalEndTime2 ? nutritionalDayRemaining2 : 0}/>
                                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.left'}/>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className='footer-grid'>
                            <div className='footer1-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.quantity'}/>
                            </div>
                            <div className='footer2-col'>
                                <input className='value' readOnly value={usingAmount}/>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.sprout'}/>
                            </div>
                        </div>
                    </div>
                    <div className='nutrient-item-inventory-container'>
                        <div className='header-grid'>
                            <div className='title'>
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.item'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.reserve'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.quantityToUse'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.nutrient.quantityLeft'}/>
                            </div>
                        </div>
                        <div className='body-grid'>
                            <div className='content'>
                                <div className='sp-item no-hover'>
                                    <div className='sp-img'>
                                        {<img src={m.getShopThumbnailByItemId(itemForTree)} alt=''/>}
                                        {nutrient.quantity}
                                        <m.TranslateLanguage
                                            direct={'menuTab.myLand.landOwned.nutrient.times'}/>
                                    </div>
                                    <div className='sp-name'>
                                        <m.ItemTranslate itemSelected={nutrient} name={true} decoClass='translation'
                                                         language={language}/>
                                    </div>
                                </div>
                            </div>
                            <div className='content'>
                                {/* so luong du tru */}
                                <div className='value'>{nutrient.quantity}</div>
                            </div>

                            <div className='content'>
                                {/* so luong muon su dung */}
                                <div className='value'>{usingAmount}</div>
                            </div>

                            <div className='content'>
                                {/* so luong con lai */}
                                <div
                                    className='value'>{usingAmount > nutrient.quantity ? 0 : nutrient.quantity - usingAmount}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => {
                        this.setState({confirmAction: true});
                        this.confirmUsingItem();
                    }}>
                        <img src={m.loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.use'}/>
                        </div>
                    </button>
                    <button onClick={() => this.props.handleHidePopup()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    };

    render() {
        const alertPopup = this.getAlertModalPopup();
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}, modalPopup} = this.props;
        const nutrient = itemInventory && itemInventory.find(i => i.itemId === itemForTree);
        const renderLandTree = lands && nutrient ? this.getOnLandTreeListPopup() : alert.getLoading({modalPopup});
        return (
            <Fragment>
                {renderLandTree}
                {alertPopup}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        authentication: {user},
        objectsReducer: {myObjects},
        lands: {allLands},
        shopsReducer,
        inventoryReducer,
        wallet,
        settingReducer
    } = state;
    return {
        user, myObjects, inventoryReducer, allLands, shopsReducer, wallet, settingReducer
    };
};

const mapDispatchToProps = (dispatch) => ({
    getShop: () => dispatch(m.shopsActions.getShop()),
    getAllObjectsByUserId: (param) => dispatch(m.objectsActions.getAllObjectsByUserId(param)),
    getItemInventoryByUserId: (param) => dispatch(m.inventoryActions.getItemInventoryByUserId(param)),
    useItem: (param) => dispatch(m.inventoryActions.onHandleUsingItemForTree(param)),
    clearSuccessError: () => dispatch(m.inventoryActions.clearSuccessError()),
    popup: (screen) => dispatch(m.alertActions.popup(screen)),
    getWalletInfo: (param) => dispatch(m.userActions.getWalletInfo(param)),

});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Nutrients);
export default connectedPage;
