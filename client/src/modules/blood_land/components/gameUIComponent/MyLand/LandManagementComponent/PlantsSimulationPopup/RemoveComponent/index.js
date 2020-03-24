import React, {Fragment, PureComponent} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import classNames from 'classnames';
import {translate} from 'react-i18next';
import * as m from '../../../../../../../../helpers/importModule';
import * as alert from './component/alertPopup';
import isEqual from "lodash.isequal";

const {...a} = alert.alertPopup


class Removal extends PureComponent {
    state = {
        usingAmount: 0,
        remainAmount: 0,
        selectedTreeAmount: 0,
        confirmAction: false,
        isRemoveClose: false
    }


    itemForTree = 'I02';

    componentDidMount() {
        const {user: {_id}} = this.props
        const {user: {wToken}} = this.props;
        this.props.getItemInventoryByUserId({userId: _id});
        this.props.getAllObjectsByUserId({userId: _id});
        this.props.getWalletInfo({wToken});
    }

    componentDidUpdate(prevProps) {
        const {inventoryReducer: {usingResult}, myObjects} = this.props;
        const {lands , isRemoveClose} = this.state;
        if (!lands || !isEqual(myObjects , prevProps.myObjects)) {
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

        if(lands && lands.length <= 0 ){
            isRemoveClose && this.props.handleHidePopup();
        }
    }

    loadData = () => {
        const {selectedLands} = this.props;
        const {isRemoveClose} = this.state;
        const landAfterRemoveLimitNutritionalAndBtamin = this.getTrees().filter(l => !l.isBigTreeQuadKey );
        const landBtamin = this.getBitaminTrees();
        let typeAlert = "";
        if(selectedLands.length > 0){
            //có chọn đất
            if (landBtamin && this.getTrees().length === 0) {
                typeAlert = "landHaveBtaminTree";
            }
            if(this.getTrees().length > 0){
                    //Normal
            } else {
                if(!landBtamin){
                    typeAlert = "pleasePlantTreeBefore";
                }
            }
        } else {
            typeAlert = "noSelection";
        }
        if (typeAlert === "noSelection") {
            //console.log('this.handleShowAlertPopup(a.noTreeSelection)')
            !isRemoveClose && this.handleShowAlertPopup(a.noTreeSelection);
        } else if(typeAlert === "pleasePlantTreeBefore"){
            //console.log('plant tree');
            this.handleShowAlertPopup(a.getPlantTreeBefore);
        }else if(typeAlert === "landHaveBtaminTree") {
            this.handleShowAlertPopup(a.landHaveBtaminTreeAlert);
        }


        this.setState({
            lands: landAfterRemoveLimitNutritionalAndBtamin
        });
    };

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


    _clickCheckbox = (tree) => {
        let treeForCaring = [...this.state.lands];
        let fIndex = treeForCaring.findIndex(l => l.land.quadKey === tree.land.quadKey);

        treeForCaring[fIndex].checked = !tree.checked;
        let countCheckedTree = treeForCaring.filter(l => l.checked).length;
        this.setState({
            selectedTreeAmount: countCheckedTree,
            usingAmount: countCheckedTree,
            lands: treeForCaring
        });
    };

    _clickCheckAll = () => {
        let {lands} = this.state;
        const isCheckAll = lands.filter(l => !l.checked).length <= 0;
        if (isCheckAll) {
            lands = lands.map(l => {
                l.checked = false;
                return l;
            });
            this.setState({lands});
        } else {
            lands = lands.map(l => {
                l.checked = true;
                return l;
            });
            this.setState({lands});
        }
    }

    getLoading = () => {
        const modal = this.props.modalPopup;
        const sign = "loading"; //blood //success //error //delete //loading
        const header = <m.TranslateLanguage direct={'alert.loadingPopup.header'}/>;
        const body = <m.TranslateLanguage direct={'alert.loadingPopup.body'}/>;
        return <m.MessageBox modal={modal} sign={sign} header={header} body={body}/>
    };


    render() {
        const alertPopup = this.getAlertModalPopup();
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}} = this.props;
        const shovel = itemInventory && itemInventory.find(i => i.itemId === this.itemForTree);
        const renderLandTree = lands && shovel ? this.getOnLandTreeListPopup() : this.getLoading();
        return (
            <Fragment>
                {renderLandTree}
                {alertPopup}
            </Fragment>
        );
    }

    getOnLandTreeListPopup = () => {
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}, settingReducer: {language}} = this.props;
        const shovel = itemInventory && itemInventory.filter(i => i.itemId === this.itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;
        const isCheckAll = lands && lands.filter(l => !l.checked).length <= 0;
        const checkAllClass = classNames({
            'check-box': true,
            'checked': isCheckAll,
        });
        const landFilter = lands && lands.filter(val => Math.round((m.common.waterLeftDay(val.tree.waterEndTime))) > -1);
        const spacing = <div className='item-row'>
            <div className='tree-col'/>
            <div className='blood-col'/>
            <div className='land-col'/>
            <div className='water-col'/>
        </div>;
        return lands.length > 0 && (
            <Modal isOpen={this.props.modalPopup} backdrop="static" className='custom-modal modal--tree-remove'>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.props.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='remove-tree-container'>

                        <div className='header-grid'>
                            <div className='head1-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.landSelected'}/>
                            </div>
                            <div className='head2-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.progressRate'}/>
                            </div>
                            <div className='tree-sub-col'>
                                <div className={checkAllClass} onClick={() => this._clickCheckAll()}/>
                                <span onClick={() => this._clickCheckAll()}><m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.shovel.selectAll'}/></span>
                                <div> &nbsp;{`(${(Array.isArray(lands) && lands.length) || 0})`} </div>
                            </div>
                            <div className='land-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.location'}/>
                            </div>
                            <div className='blood-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.interestRate'}/>
                            </div>
                            <div className='water-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.waterTime'}/>
                            </div>
                        </div>

                        <div className='body-grid'>
                            {spacing}
                            {
                                landFilter.map((item, index) => {
                                    const checkBoxClass = classNames({
                                        'check-box': true,
                                        'checked': item.checked,
                                    });
                                    return (
                                        <div className='item-row' key={index}>
                                            <div className='tree-col'>
                                                <div className={checkBoxClass}
                                                     onClick={() => this._clickCheckbox(item)}/>
                                                <img src={m.getMapImgByItemId(item.tree.itemId)} alt=''/>
                                                <span onClick={() => this._clickCheckbox(item)}><m.ItemTranslate
                                                    itemSelected={item.tree.item} name={true} decoClass='translation'
                                                    language={language}/></span>
                                            </div>
                                            <div className='land-col'>
                                                {item.land.name ? item.land.name : item.land.quadKey}
                                            </div>
                                            <div className='blood-col'>
                                                {item.tree ? item.tree.profitTotal.toFixed(6) + '%' : '0%'}
                                            </div>
                                            <div className='water-col'>
                                                <input className='water-left-day' disabled
                                                       value={m.common.waterLeftDay(item.tree.waterEndTime)}/>
                                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.left'}/>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>

                        <div className='footer-grid'>
                            <div className='footer1-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantity'}/>
                            </div>
                            <div className='footer2-col'>
                                <input className='value' disabled value={usingAmount}/>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.tree'}/>
                            </div>
                        </div>
                    </div>
                    <div className='remove-item-inventory-container'>
                        <div className='header-grid'>
                            <div className='title'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.item'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.reserve'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantityUsed'}/>
                            </div>
                            <div className='title'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.quantityLeft'}/>
                            </div>
                        </div>
                        <div className='body-grid'>
                            <div className='content'>
                                <div className='sp-item no-hover'>
                                    <div className='sp-img'>
                                        {<img src={m.getShopThumbnailByItemId(this.itemForTree)} alt=''/>}
                                        {shovel.quantity}
                                        <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.times'}/>
                                    </div>
                                    <div className='sp-name'>
                                        <m.ItemTranslate itemSelected={shovel} name={true} decoClass='translation'
                                                         language={language}/>
                                    </div>
                                </div>
                            </div>
                            <div className='content'>
                                {/* so luong du tru */}
                                <div className='value'>{shovel.quantity}</div>
                            </div>

                            <div className='content'>
                                {/* so luong muon su dung */}
                                <div className='value'>{usingAmount}</div>
                            </div>

                            <div className='content'>
                                {/* so luong con lai */}
                                <div
                                    className='value'>{usingAmount > shovel.quantity ? 0 : shovel.quantity - usingAmount}</div>
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
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.use'}/>
                        </div>
                    </button>
                    <button onClick={() => this.props.handleHidePopup()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
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
        const shovel = itemInventory && itemInventory.filter(i => i.itemId === this.itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;

        if (lands.filter(l => l.checked).length < 1) {
            this.handleShowAlertPopup(a.noSelectionAlert);
        } else if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
        else if (usingAmount > shovel.quantity) {
            this.handleShowAlertPopup(a.noEnoughAmountUsingItemAlert);
        } else {
            this.handleShowAlertPopup(a.usingItemConfirmAlert);
        }
    };

    hasWaterLeftDeadTrees() {
        const {lands} = this.state;
        for (let i = 0; i < lands.length; i++) {
            if (lands[i].checked) {
                const {tree} = lands[i];
                if (m.common.waterLeftSecond(tree.waterEndTime) <= 0) return true;
            }
        }
        return false;
    };

    useItem = () => {
        if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
        this.handleShowAlertPopup(a.loadingAlert);
        const {lands} = this.state;
        const itemId = this.itemForTree;
        const {user: {_id}} = this.props
        let trees = [];
        for (let i = 0; i < lands.length; i++) {
            if (lands[i].checked) {
                const currentTree = lands[i].tree._id;
                trees.push(currentTree);
            }
        }
        this.props.useItem({itemId, trees, userId: _id});
    };

    confirmSuccess = () => {
        const {user: {_id}} = this.props;
        this.props.getAllObjectsByUserId({userId: _id});

        if (this.state.confirmAction) {
            this.handleHideAlertPopup();
            this.setState({
                isRemoveClose: true
            })
        } else {
            const remainLands = this.state.lands.filter(l => l.checked === false);
            this.setState({lands: remainLands});
            setTimeout(() => {
                if (this.state.lands.length > 0)
                    this.handleHideAlertPopup();
                else {
                    this.handleHideAllPopup();
                }
            }, 100);
        }
    };

    handleHideAllPopup = () => {
        this.handleHideAlertPopup();
        this.props.handleHidePopup();
    };

    checkGoldBloodAndUseItem = (neededGoldBlood) => {
        const {wallet: {info: {goldBlood}}} = this.props;
        if (neededGoldBlood <= 0 || goldBlood <= 0) {
            this.handleShowAlertPopup(a.noEnoughMoneyAlert);
        } else if (goldBlood < neededGoldBlood) {
            this.handleShowAlertPopup(a.noEnoughMoneyAlert);
        } else this.useItem();
    };

    checkGoldBlood = () => {
        const {lands} = this.state;
        const {inventoryReducer: {itemInventory}} = this.props;
        const shovel = itemInventory && itemInventory.filter(i => i.itemId === this.itemForTree)[0];
        const usingAmount = lands && lands.filter(l => l.checked).length;
        return shovel.price * (usingAmount - shovel.quantity)
    }

    getAlertModalPopup = () => {
        const {currentAlertPopUp, modalAlertPopup} = this.state;
        const {useItem, handleHideAlertPopup, checkGoldBlood, confirmSuccess, handleHideAllPopup, checkGoldBloodAndUseItem} = this;
        return (
            <Fragment>
                {currentAlertPopUp === a.noSelectionAlert && alert.getNoSelectionAlert({modalAlertPopup, handleHideAlertPopup})}
                {currentAlertPopUp === a.noEnoughAmountUsingItemAlert && alert.getNoEnoughAmountUsingItemAlertPopup({
                    modalAlertPopup,
                    checkGoldBloodAndUseItem,
                    handleHideAlertPopup,
                    neededGoldBlood: checkGoldBlood()
                })}
                {currentAlertPopUp === a.usingItemConfirmAlert && alert.getUsingItemConfirmAlertPopup({
                    modalAlertPopup,
                    useItem,
                    handleHideAlertPopup
                })}
                {currentAlertPopUp === a.usingItemSuccessAlert && alert.getUsingItemSuccessAlert({
                    modalAlertPopup,
                    confirmSuccess
                })}
                {currentAlertPopUp === a.usingItemUnsuccessAlert && alert.getUsingItemUnsuccessAlert({
                    modalAlertPopup,
                    handleHideAlertPopup
                })}
                {currentAlertPopUp === a.noTreeSelection && alert.getNoTreeSelection({modalAlertPopup, handleHideAllPopup})}
                {currentAlertPopUp === a.loadingAlert && alert.getLoadingPopup({modalAlertPopup})}
                {currentAlertPopUp === a.leftWaterDeadAlert && alert.getLeftWaterDeadAlertPopup({
                    modalAlertPopup,
                    confirmSuccess
                })}
                {a.getPlantTreeBefore === currentAlertPopUp && alert.getPlantTreeBefore({modalAlertPopup, handleHideAllPopup})}
                {currentAlertPopUp === a.noEnoughMoneyAlert && alert.getNoEnoughMoneyAlertPopup({
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

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(translate('common')(Removal));
export default connectedPage;
