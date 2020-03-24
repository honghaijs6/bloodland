import React, {PureComponent, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {Modal} from 'reactstrap';
import classNames from 'classnames';
import * as m from '../../../../../../../../helpers/importModule'
import * as alert from './component/alertPopup';
import isEqual from "lodash.isequal";

const {...a} = alert.alertPopup;


class Droplet extends PureComponent {
    state = {
        currentAlertPopUp: a.noPopup,
        usingAmount: 0,
        remainAmount: 0,
        selectedTreeAmount: 0,
        confirmAction: false,
        isDropletClose: false
    }


    droplet = {
        "itemId": "I03",
        "defaultProfit": 0,
        "price": 0,
        "category": "ITEM",
        "status": "CANNOTBUY"
    };

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getAllObjectsByUserId({userId: _id});
    }

    componentDidUpdate(prevProps) {
        const {inventoryReducer: {usingResult}, isDropletClose , myObjects} = this.props;
        const {lands} = this.state;
        if (!lands || !isEqual(myObjects , prevProps.myObjects)) {
            this.loadData();
        }

        if (usingResult) {
            this.handleHideAlertPopup();
            if (usingResult.status) {
                this.setState({currentAlertPopUp: a.noPopup});
                this.handleShowAlertPopup(a.usingItemSuccessAlert);
                this.props.clearSuccessError();
            } else {
                this.setState({currentAlertPopUp: a.noPopup});
                this.handleShowAlertPopup(a.usingItemUnsuccessAlert);
                this.props.clearSuccessError();
            }
        }
        if (lands && lands.length <= 0) {
            isDropletClose && this.props.handleHidePopup();
        }
    }

    loadData = () => {
        const {selectedLands} = this.props;
        const {isDropletClose} = this.state;
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
            !isDropletClose && this.handleShowAlertPopup(a.noTreeSelection);
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
    }

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
        const renderLandTree = lands ? this.getOnLandTreeListPopup() : this.getLoading();
        return (
            <Fragment>
                {renderLandTree}
                {alertPopup}
            </Fragment>
        );
    }

    getOnLandTreeListPopup = () => {
        const {settingReducer: {language}} = this.props
        const {lands} = this.state;
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
            <div className='water-col'/>
        </div>;
        return lands.length > 0 && (
            <Modal isOpen={this.props.modalPopup} backdrop="static" className={`custom-modal modal--tree-water`}>
                <div className='custom-modal-header'>
                    <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.detail'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.props.handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='droplet-container'>
                        <div className='header-grid'>
                            <div className='head1-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.landSelected'}/>
                            </div>
                            <div className='head2-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.progressRate'}/>
                            </div>
                            <div className='tree-sub-col'>
                                <div className={checkAllClass} onClick={() => this.clickCheckAll()}/>
                                <span onClick={() => this.clickCheckAll()}><m.TranslateLanguage
                                    direct={'menuTab.myLand.landOwned.water.selectAll'}/></span>
                                <div> &nbsp;{`(${(Array.isArray(lands) && lands.length) || 0})`} </div>
                            </div>
                            <div className='land-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.location'}/>
                            </div>
                            <div className='blood-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.interest'}/>
                            </div>
                            <div className='water-sub-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.waterTime'}/>
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
                                            <div className='water-col'>
                                                <input className='water-left-day' disabled
                                                       value={m.common.waterLeftDay(item.tree.waterEndTime)}/>
                                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.left'}/>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                        <div className='footer-grid'>
                            <div className='footer1-col'>
                                <button className='droplet-item no-hover'>
                                    <div className='sp-img'>
                                        <img src={m.getShopThumbnailByItemId(this.droplet.itemId)} alt=''/>
                                        <m.ItemTranslate itemSelected={this.droplet} name={true} decoClass='translation'
                                                         language={language}/>
                                    </div>
                                </button>
                            </div>
                            <div className='footer2-col'>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.quantity'}/>
                                <input className='value' disabled value={usingAmount}/>
                                <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.tree'}/>
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
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.use'}/>
                        </div>
                    </button>
                    <button onClick={() => this.props.handleHidePopup()}>
                        <img src={m.loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <m.TranslateLanguage direct={'menuTab.myLand.landOwned.water.cancel'}/>
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
        if (lands.filter(l => l.checked).length < 1) {
            this.handleShowAlertPopup(a.noSelectionAlert);
        } else {
            if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
            this.handleShowAlertPopup(a.usingItemConfirmAlert);
        }
    };

    hasWaterLeftDeadTrees() {
        const {lands} = this.state;
        for (let i = 0; i < lands.length; i++) {
            const {tree} = lands[i];
            if (lands[i].checked) {
                if (m.common.waterLeftSecond(tree.waterEndTime) <= 0) return true
            }
        }
        return false;
    }

    useItem = () => {
        if (this.hasWaterLeftDeadTrees()) return this.handleShowAlertPopup(a.leftWaterDeadAlert);
        this.handleShowAlertPopup(a.loadingAlert);
        const {lands} = this.state;
        const {itemId} = this.droplet;
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

        setTimeout(() => {
            this.loadData();
        }, 50);

        if (this.state.confirmAction) {
            this.getTrees();
            this.handleHideAlertPopup();
            this.setState({
                isDropletClose: true
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

    getAlertModalPopup = () => {
        const {modalAlertPopup, currentAlertPopUp} = this.state;
        const {useItem, confirmSuccess, handleHideAlertPopup, handleHideAllPopup} = this;
        return (
            <Fragment>
                {a.noSelectionAlert === currentAlertPopUp && alert.getNoSelectionAlert({
                    modalAlertPopup,
                    handleHideAlertPopup
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
                {a.usingItemUnsuccessAlert === currentAlertPopUp && alert.getUsingItemUnsuccessAlert({
                    modalAlertPopup,
                    handleHideAlertPopup
                })}
                {a.noTreeSelection === currentAlertPopUp && alert.getNoTreeSelection({
                    modalAlertPopup,
                    handleHideAllPopup
                })}
                {a.getPlantTreeBefore === currentAlertPopUp && alert.getPlantTreeBefore({modalAlertPopup, handleHideAllPopup})}
                {a.loadingAlert === currentAlertPopUp && alert.getLoadingPopup({modalAlertPopup})}
                {a.leftWaterDeadAlert === currentAlertPopUp && alert.getLeftWaterDeadAlertPopup({
                    modalAlertPopup,
                    confirmSuccess
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
        inventoryReducer,
        settingReducer
    } = state;
    return {
        user, myObjects, allLands, inventoryReducer, settingReducer
    };
};

const mapDispatchToProps = (dispatch) => ({
    getShop: () => dispatch(m.shopsActions.getShop()),
    getAllObjectsByUserId: (param) => dispatch(m.objectsActions.getAllObjectsByUserId(param)),
    useItem: (param) => dispatch(m.inventoryActions.onHandleUsingItemForTree(param)),
    clearSuccessError: () => dispatch(m.inventoryActions.clearSuccessError()),
    popup: (screen) => dispatch(m.alertActions.popup(screen)),

});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Droplet);
export default connectedPage;
