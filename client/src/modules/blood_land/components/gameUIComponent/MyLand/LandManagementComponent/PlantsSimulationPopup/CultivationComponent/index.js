import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import isEqual from 'lodash.isequal';
import {Modal} from 'reactstrap';
import classNames from 'classnames';

import {
    common,
    getMapImgByItemId,
    loadingImage,
    TranslateLanguage,
    ItemTranslate,
    alertActions,
    objectsActions,
    shopsActions,
    inventoryActions
} from '../../../../../../../../helpers/importModule';

import {
    alertPopup,
    getInitLoadingPopup,
    getNoTreeSelection,
    getUsingItemConfirmAlertPopup,
    getNoEnoughAmountUsingItemAlertPopup,
    getNoSelectionAlert,
    getUsingItemSuccessAlert,
    getUsingItemUnsuccessAlert,
    getTreesOnLandAlertPopup,
    getLoadingPopup
} from './component/alertPopup';

const {
    noPopup,
    noTreeSelection,
    noSelectionAlert,
    noEnoughAmountUsingItemAlert,
    usingItemConfirmAlert,
    usingItemSuccessAlert,
    usingItemUnsuccessAlert,
    treesOnLandAlert,
    // closeConfirmAlert,
    loadingAlert
} = alertPopup;

class Cultivation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAlertPopUp: noPopup,
            checkAll: false,    
            checkClose: false,
            confirmAction: false,
            noLandToggle: true,
        }
    }

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getAllObjectsByUserId({userId: _id});
        this.props.getCharacterInventoryByUserId({userId: _id});
    }

    componentDidUpdate = (prevProps) => {
        const {inventoryReducer: {characterInventory, plantingResult}} = this.props;
        const {treeInInventory,lands} = this.state;

        if(!treeInInventory){
            this.loadTrees();
        }
        else{
            if(!isEqual(prevProps.inventoryReducer.characterInventory,characterInventory)){
                this.loadTrees();
            }
        }

        if(!lands){
            this.loadData();
        }

        if (plantingResult) {
            // this.handleHideAlertPopup();
            if (plantingResult.result.plantedTrees.length > 0) {
                this.handleShowAlertPopup(usingItemSuccessAlert);
                this.props.clearPlantedTreesResult();
            } else {
                this.handleShowAlertPopup(usingItemUnsuccessAlert);
                this.props.clearPlantedTreesResult();
            }
        }
    }

    getTrees = () => {
        const {selectedLands, myObjects} = this.props;
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        let totallands = selectedLands.map(land => {
            return {
                tree: myObjects.find(elm => elm.quadKey === land.quadKey),
                land: land,
                isBigTreeQuadKey : allBigTreeQuadKey.some(bigTrQK => bigTrQK === land.quadKey),
                checked: false
            };
        }).filter(item => !item.isBigTreeQuadKey && item.land.forSaleStatus === false);

        const landHasTree = totallands.filter(i => i.tree);
        const landNoTree =  totallands.filter(i => !i.tree);
        return {landNoTree,landHasTree};
    }

    loadData = () => {
        const {landNoTree,landHasTree} = this.getTrees();
        //lands = lands.filter(l => !l.isBigTreeQuadKey);
        // console.log("selectedLands",landHasTree); 

        if (landNoTree.length === 0) {
            if(landHasTree.length > 0){
                this.handleShowAlertPopup(treesOnLandAlert);
            }else{

                this.handleShowAlertPopup(noTreeSelection);
            }
        }

        this.setState({
            lands:landNoTree,
            checkAll: false
        });
    };

    loadTrees = () => {
        // console.log("vao day- choancuc");
        const {shopsReducer: {shops}, inventoryReducer: {characterInventory}} = this.props;
        const {lands} = this.state;
        const landsState = lands ? lands : [];
        // console.log('lands',lands)
        let treeInInventory = [];
        let trees = shops.filter(t => t.category === 'TREE' && t.itemId !== 'T10').sort((a,b)=>{return a.itemId - b.itemId });
        trees.forEach(tree => {
            const filteredTree = characterInventory && characterInventory.find(l => l.itemId === tree.itemId);
            let maxAmount = filteredTree ? filteredTree.quantity : 0;
            treeInInventory.push({tree, maxAmount, usingAmount: 0, remainAmount: maxAmount});
        });

        treeInInventory.map(val => {
            val.usingAmount = 0;
            val.remainAmount = val.maxAmount;
            landsState.map(land => {
                const {tree} = land;
                // console.log('land',land);
                if (tree) {
                    if (tree.itemId === val.tree.itemId) {
                        val.usingAmount = val.usingAmount + 1;
                        val.remainAmount = (val.maxAmount - val.usingAmount) < 0 ? 0 : val.maxAmount - val.usingAmount
                    }
                }
                return land;
            });
            return val;
        });
        this.setState({treeInInventory});
    };
    
    goToShop = () => {
        this.handleHideAlertPopup();
        this.props.handleShowShopPopup();
    };


    handleHideNoSelect = () => {
        this.setState({
            noLandToggle: false
        });
        this.handleHideAllPopup();
    }

    checkAllItems = () => {
        let checkAll = !this.state.checkAll;
        let lands = [...this.state.lands];
        lands = lands.map((land, index) => {
            land.checked !== null && (land.checked = checkAll);
            return land;
        });

        this.setState({
            checkAll: checkAll,
            lands: lands
        });
    }

    clickCheckbox = (item) => {

        let lands = [...this.state.lands];
        let fIndex = lands.findIndex(l => l.land.quadKey === item.land.quadKey)
        lands[fIndex].checked = item.checked === null ? null : !item.checked;
        let checkAll = false;
        if (!lands[fIndex].checked) {
            checkAll = false;
        } else {
            if (lands.length === lands.filter(l => l.checked).length)
                checkAll = true;
        }

        this.setState({
            lands: lands,
            checkAll: checkAll
        });
    };


    plantTree = (bud) => {
        //this.handleShowAlertPopup(noEnoughAmountUsingItemAlert)
        const lands = this.state.lands;
        const checkedLandsLength = lands.filter(i => i.checked === true).length;
        if (checkedLandsLength === 0) return this.handleShowAlertPopup(noSelectionAlert);

        let treeInInventory = this.state.treeInInventory;

        const modifiedLands = [];
        let budAmount = bud.remainAmount;
        let noBud = false;

        for (let i = 0; i < lands.length; i++) {
            const land = lands[i];
            if (land.tree) {
                const {tree} = land;
                if (tree.itemId === bud.tree.itemId) {
                    if (land.checked) {
                        budAmount = budAmount - 1;
                        land.tree = bud.tree;
                        land.checked = false;
                    }
                } else {
                    if (land.checked && budAmount > 0) {
                        budAmount = budAmount - 1;
                        land.tree = bud.tree;
                        land.checked = false;
                    } else if (land.checked && budAmount === 0) {
                        noBud = true;
                    }
                }
            } else {
                if (land.checked && budAmount > 0) {
                    budAmount = budAmount - 1;
                    land.tree = bud.tree;
                    land.checked = false;
                } else if (budAmount === 0) {
                    noBud = true;
                }
            }
            modifiedLands.push(land);

            this.setState({land: modifiedLands});
        }

        treeInInventory = treeInInventory.map((val, index) => {
            val.usingAmount = 0;
            val.remainAmount = val.maxAmount;
            lands.map(land => {
                if (typeof land.tree !== 'undefined') {
                    const {tree} = land;
                    if (tree) {
                        if (tree.itemId === val.tree.itemId) {
                            val.usingAmount = val.usingAmount + 1
                            val.remainAmount = (val.maxAmount - val.usingAmount) < 0 ? 0 : val.maxAmount - val.usingAmount
                        }
                    }
                }
                return land;
            });
            return val;
        });
        this.setState({treeInInventory, checkAll: false});

        if (noBud)
            this.handleShowAlertPopup(noEnoughAmountUsingItemAlert);


    };

    //alert
    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });

    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: noPopup,
            modalAlertPopup: false,
        });
    };

    confirmSuccess = () => {
        const {user: {_id}} = this.props;
        this.props.getAllObjectsByUserId({userId: _id});
        this.props.getCharacterInventoryByUserId({userId: _id});
        this.handleHideAllPopup();
    }

    plantTreeApi = () => {
        this.handleShowAlertPopup(loadingAlert);
        const {lands} = this.state;
        const {user: {_id}} = this.props;

        let items = [];
        lands.filter(val => val.tree && typeof val.tree !== 'undefined' && val.checked).map(
            v => {
                items.push({
                    "quadKey": v.land.quadKey,
                    "itemId": v.tree.itemId
                })
                return v;
            }
        )
        const param = {
            "userId": _id,
            items
        }
        this.props.onHandleMoveTreeToMap(param);
    };

    handleHideAllPopup = () => {
        this.handleHideAlertPopup();
        this.props.handleHidePopup();
    }

    confirmUsingItem = (type) => {
        const {lands} = this.state;
        const landsFilter = lands.filter(l => l.checked);
        if (type === 'final') {
            if (landsFilter.length !== 0) {
                const landTreeFilter = landsFilter.filter(l => l.tree === null)
                if (landTreeFilter.length !== 0) {
                    this.handleShowAlertPopup(noSelectionAlert)
                    this.setState({
                        noTreeSelect: true
                    })
                } else {
                    this.handleShowAlertPopup(usingItemConfirmAlert);
                    this.setState({
                        checkClose: true
                    })
                }
            } else {
                this.handleShowAlertPopup(noSelectionAlert);
            }
        } else {
            if (lands.filter(i => i.checked === null).length === 0) return this.handleShowAlertPopup(noSelectionAlert);
            this.handleShowAlertPopup(usingItemConfirmAlert);
        }
    };

    
    getTreeCultivation = () => {
        const {lands} = this.state;
        const isCheckAll = lands && lands.filter(l => !l.checked).length <= 0;
        const checkAllClass = classNames({
            'check-box':true,
            'checked' : isCheckAll,
        });
        const {settingReducer: {language}} = this.props;
        const spacing = <div className='item-row'><div className='tree-col'/><div className='blood-col'/><div className='land-col' /><div className='water-col' /></div>;
        return (
                <div className='tree-cultivate-container'>
                    <div className='header-grid'>
                        <div className='head1-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.landSelected'}/>
                        </div>
                        <div className='head2-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.progressRate'}/>
                        </div>

                        <div className='tree-sub-col'>
                            <div className={checkAllClass} onClick={() => this.checkAllItems()}/>
                            <span onClick={() => this.checkAllItems()}><TranslateLanguage direct={'menuTab.myLand.landOwned.tree.selectAll'}/></span>
                            <div > &nbsp;{`(${ (Array.isArray(lands) && lands.length) || 0 })`} </div>
                        </div>
                        <div className='land-sub-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.location'}/>
                        </div>
                        <div className='blood-sub-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.interest'}/>
                        </div>
                        <div className='water-sub-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.waterTime'}/>
                        </div>
                    </div>
                    <div className='body-grid'>
                    {spacing}
                    {
                        lands.map((item, index) => {
                            const checkBoxClass = classNames({
                                'check-box':true,
                                'checked' : item.checked,
                            });
                            return (
                                <div className='item-row' key={index}>
                                    <div className='tree-col'>
                                        <div className={checkBoxClass} onClick={() => this.clickCheckbox(item)}/>
                                        <div className='signal-tree'>
                                            <img src={item.tree && getMapImgByItemId(item.tree.itemId)} alt=''/>
                                        </div>
                                        <span onClick={() => this.clickCheckbox(item)} >
                                            {item.tree ? <ItemTranslate itemSelected={item.tree} name={true} decoClass='translation'  language={language} /> : '...'}
                                        </span>
                                    </div>
                                    <div className='land-col'>
                                        {item.land.name ? item.land.name : item.land.quadKey}
                                    </div>
                                    <div className='blood-col'>
                                        {item.tree ? item.tree.defaultProfit + '%' : '0%'}
                                    </div>
                                    <div className='water-col'>
                                        <input className='water-left-day' disabled value={item.tree ? `${common.getDefaultWaterLeftDay()}` : '...'}/>
                                        <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.left'}/>
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>
                    <div className='footer-grid'>
                        <div className='footer1-col'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.landQuantity'}/>
                        </div>
                        <div className='footer2-col'>
                            <div className='value'>{lands.filter(l => l.checked).length}</div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.land'}/>
                        </div>
                    </div>
                </div>
            );
    }

    getTreeInventory = () =>{
        const {treeInInventory} = this.state;
        const {settingReducer: {language}} = this.props;
        return(
                <div className='tree-inventory-container'>
                    <div className='header-grid'>
                        <div className='title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.item'}/>
                        </div>
                        <div className='title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.reserveQuantity'}/>
                        </div>
                        <div className='title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.quantityToUse'}/>
                        </div>
                        <div className='title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.quantityLeft'}/>
                        </div>
                    </div>
                    <div className='body-grid'>
                    {
                        Array.from(treeInInventory, (item, index) => (
                            <Fragment key={index}>
                                <div className='content'>
                                    <button className='sp-item' onClick={() => this.plantTree(item)}>
                                        <div className='sp-img'><img src={getMapImgByItemId(item.tree.itemId)} alt={`itemId`} /></div>
                                        <div className='sp-name'><ItemTranslate itemSelected={item.tree} name={true} decoClass='translation' language={language} /></div>
                                    </button>
                                </div>
                                <div className='content'>
                                    <div className='value'>{item.maxAmount}</div>
                                </div>
                                <div className='content'>
                                    <div className='value'>{item.usingAmount}</div>
                                </div>
                                <div className='content'>
                                    <div className='value'>{item.remainAmount}</div>
                                </div>
                            </Fragment>
                        ))
                    }
                    </div>
                </div>
        );
    }

    getLandListPopup = () => {
        const {lands} = this.state;
        return lands.length > 0 && (
            <Modal isOpen={this.props.modalPopup} backdrop="static" className={`custom-modal modal--tree-cultivation`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHideAllPopup()}/>
                </div>
                <div className='custom-modal-body'>
                    {this.getTreeCultivation()}
                    {this.getTreeInventory()}
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.confirmUsingItem('final')}>
                        <img src={loadingImage(`/images/game-ui/sm-ok.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.use'}/>
                        </div>
                    </button>
                    <button onClick={() => this.handleHideAllPopup()}>
                        <img src={loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    }


    getAlertModalPopup = () => {
        const {noTreeSelect,modalAlertPopup,currentAlertPopUp} = this.state;
        const {handleHideAlertPopup,handleHideAllPopup,goToShop,plantTreeApi,confirmSuccess} = this;
        return (
            <Fragment>
                {currentAlertPopUp === noSelectionAlert             && getNoSelectionAlert({noTreeSelect,modalAlertPopup,handleHideAlertPopup})}
                {currentAlertPopUp === noEnoughAmountUsingItemAlert && getNoEnoughAmountUsingItemAlertPopup({modalAlertPopup,goToShop,handleHideAlertPopup})}
                {currentAlertPopUp === usingItemConfirmAlert        && getUsingItemConfirmAlertPopup({modalAlertPopup,plantTreeApi,handleHideAlertPopup})}
                {currentAlertPopUp === usingItemSuccessAlert        && getUsingItemSuccessAlert({modalAlertPopup,confirmSuccess})}
                {currentAlertPopUp === usingItemUnsuccessAlert      && getUsingItemUnsuccessAlert({modalAlertPopup,handleHideAlertPopup})}
                {currentAlertPopUp === loadingAlert                 && getLoadingPopup({modalAlertPopup})}
                {currentAlertPopUp === noTreeSelection              && getNoTreeSelection({modalAlertPopup,handleHideAllPopup})}
                {currentAlertPopUp === treesOnLandAlert              && getTreesOnLandAlertPopup({modalAlertPopup,handleHideAllPopup})}
            </Fragment>
        );
    };
    
    //render
    render() {
        const {lands, treeInInventory} = this.state;
        const {modalPopup} = this.props;
        const alertPopup = this.getAlertModalPopup();
        const renderLandTree = lands && treeInInventory ? this.getLandListPopup() : getInitLoadingPopup({modalPopup});
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
        alert,
        objectsReducer: {myObjects},
        shopsReducer,
        inventoryReducer,
        settingReducer
    } = state;
    return {
        user, alert,
        myObjects, shopsReducer, inventoryReducer, settingReducer
    };
};

const mapDispatchToProps = (dispatch) => ({
    getShop: () => dispatch(shopsActions.getShop()),
    getAllObjectsByUserId: (param) => dispatch(objectsActions.getAllObjectsByUserId(param)),
    getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
    onHandleMoveTreeToMap: (param) => dispatch(inventoryActions.onHandleMoveTreeToMap(param)),
    clearPlantedTreesResult: () => dispatch(inventoryActions.clearPlantedTreesResult()),
    popup: (screen) => dispatch(alertActions.popup(screen))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Cultivation);
export default connectedPage;