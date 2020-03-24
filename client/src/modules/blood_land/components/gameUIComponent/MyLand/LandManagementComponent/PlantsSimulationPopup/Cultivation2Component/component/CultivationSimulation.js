import React, {Fragment, PureComponent} from 'react';
import {Modal} from 'reactstrap';
import {
    AmountSelectedlandSimulation,
    CheckAmountForAllTreeUpdateComponentDidUpdate, CheckAmountForAllTreeUpdateSimulateFunction,
    CultivationSimulationBodyHeading
} from "./SimulationFuncComponent";
import LandList from "./LandList";
import TreeList from "./TreeList";
import cloneDeep from 'lodash.clonedeep'
import {alertPopup, getNoEnoughTreeAlert, getNoSelectionAlert, getShop} from "../alertPopup";


let normalCount = 0;
let whiteCount = 0;
let greenCount = 0;
let blueCount = 0;
let bronzeCount = 0;
let silverCount = 0;
let goldCount = 0;
let platinumCount = 0;
let diamondCount = 0;


class CultivationSimulation extends PureComponent {
    state = {
        currentPopup: alertPopup.noPopup
    };

    componentDidMount() {
        const {allTrees, selectedLands} = this.props;
        if (allTrees && selectedLands) {
            const selectedLandsUpdate = selectedLands.map(land => {
                land.checked = false;
                land.treePlanted = false;
                return land
            });
            const allTreesUpdate = allTrees.map(object => {
                object.remainAmount = object.maxAmount - object.usingAmount;
                return object
            });
            this.setState({
                allTrees: allTreesUpdate, selectedLands: selectedLandsUpdate
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.allTrees !== prevProps.allTrees) {
            const {allTrees} = this.props;
            const paramCreateAllTreesUpdate = {
                allTrees,normalCount,whiteCount,
                greenCount,blueCount,bronzeCount,
                silverCount,goldCount,platinumCount,diamondCount
            };
            const allTreesUpdate = CheckAmountForAllTreeUpdateComponentDidUpdate(paramCreateAllTreesUpdate);
            this.setState({
                allTrees: allTreesUpdate
            })
        }
    }

    //on handle click checkbox
    onHandleClickOneCheckBox = (landsSelectedUpdate) => {
        if (landsSelectedUpdate) {
            const checkAllStatus = landsSelectedUpdate.filter(land => land.checked).length === landsSelectedUpdate.length;
            this.setState({
                selectedLands: landsSelectedUpdate,
                checkAll: checkAllStatus
            })
        }
    };
    onHandleClickAllCheckBox = () => {
        const {selectedLands} = this.state;
        const selectedLandsClone = cloneDeep(selectedLands);
        const checkNotAllStatus = selectedLandsClone.filter(land => !land.checked).length !== 0;
        const checkAllStatus = selectedLandsClone.filter(land => land.checked).length !== 0;
        if (checkNotAllStatus) {
            const landsSelectedUpdate = selectedLandsClone.map(land => {
                land.checked = true;
                return land
            });
            this.setState({
                selectedLands: landsSelectedUpdate,
                checkAll: true
            })
        } else if (checkAllStatus) {
            const landsSelectedUpdate = selectedLandsClone.map(land => {
                land.checked = false;
                return land
            });
            this.setState({
                selectedLands: landsSelectedUpdate,
                checkAll: false
            })
        }
    };
    // ================================================================================================

    //On handle for popup
    onHandleShowPopup = (currentPopupStatus) => {
        this.setState({
            currentPopup: currentPopupStatus
        })
    };
    onHandleHidePopup = () => {
        this.setState({
            currentPopup: alertPopup.noPopup
        })
    };
    onHandlePopupRender = () => {
        const {currentPopup} = this.state;
        const noSelectedLandAlertStatus = currentPopup === alertPopup.noSelectedLandAlert;
        const getNoEnoughTreeAlertStatus = currentPopup === alertPopup.getNoEnoughTreeAlert;
        const getShopStatus = currentPopup === alertPopup.getShop;
        return (
            <Fragment>
                {noSelectedLandAlertStatus && getNoSelectionAlert(noSelectedLandAlertStatus, this.onHandleHidePopup)}
                {getNoEnoughTreeAlertStatus && getNoEnoughTreeAlert(getNoEnoughTreeAlertStatus, this.onHandleHidePopup, this.onHandleShowPopup)}
                {getShopStatus && getShop(getShopStatus, this.onHandleHidePopup)}
            </Fragment>
        )
    };
    // ===================================================================================================


    onHandleSimulatePlantTree = (itemId) => {
        const {allTrees, selectedLands} = this.state;
        let allTreesClone = cloneDeep(allTrees);
        let landsSelectedClone = cloneDeep(selectedLands);
        normalCount = 0;
        whiteCount = 0;
        greenCount = 0;
        blueCount = 0;
        bronzeCount = 0;
        silverCount = 0;
        goldCount = 0;
        platinumCount = 0;
        diamondCount = 0;
        const treeFind = allTreesClone.find(t => t.tree.itemId === itemId);
        let treeCount = treeFind.remainAmount;
        //update for land
        const landSelectedUpdate = landsSelectedClone.map(land => {
            if (land.checked) {
                if (treeCount > 0) {
                    if (land.treePlanted === false) {
                        //dat chua trong cay
                        const landUpdate = this.onHandleSimulatePlantTreeProcessing(treeFind, land);
                        if (land.quadKey === landUpdate.quadKey) {
                            treeCount = treeCount - 1;
                            landUpdate.checked = false;
                            return landUpdate;
                        }
                    } else {
                        //dat da trong cay
                        if (land.treePlanted.itemId !== itemId) {
                            const landUpdate = this.onHandleSimulatePlantTreeProcessing(treeFind, land);
                            if (land.quadKey === landUpdate.quadKey) {
                                treeCount = treeCount - 1;
                                landUpdate.checked = false;
                                return landUpdate;
                            }
                        } else {
                            land.checked = false;
                            return land
                        }

                    }
                } else {
                    // this.onHandleShowPopup(alertPopup.getNoEnoughTreeAlert);
                    // console.log('thieu cay roi ')
                    return land
                }

            } else {
                return land
            }
        });


        //update for tree
        landSelectedUpdate.map(land => {
            if (land.treePlanted) {
                const {treePlanted: {itemId}} = land;
                switch (itemId) {
                    case "T01":normalCount++;break;
                    case "T02":whiteCount++;break;
                    case "T03":greenCount++;break;
                    case "T04":blueCount++;break;
                    case "T05":bronzeCount++;break;
                    case "T06":silverCount++;break;
                    case "T07":goldCount++;break;
                    case "T08":platinumCount++;break;
                    case "T09":diamondCount++;break;
                }
            }
        });
        const paramUpdateTreeAmount = {
            allTreesClone , normalCount,whiteCount,
            greenCount,blueCount,bronzeCount,
            silverCount,goldCount,platinumCount,diamondCount
        };
        const allTreesUpdate = CheckAmountForAllTreeUpdateSimulateFunction(paramUpdateTreeAmount);

        this.setState({
            checkAll: false,
            allTrees: allTreesUpdate,
            selectedLands: landSelectedUpdate
        })
    };

    //su ly trong cay tren dat
    onHandleSimulatePlantTreeProcessing = (treeFind, land) => {
        land.treePlanted = treeFind.tree;
        return land;
    };


    render() {
        const {handleHidePopup, isAlertOpen} = this.props;
        const {selectedLands, allTrees, checkAll} = this.state;

        if (!selectedLands) {
            return <div>Loading</div>
        } else {
            return (
                <Fragment>
                    <Modal isOpen={isAlertOpen === 15} backdrop="static"
                           className={`custom-modal modal--tree-cultivate`}>
                        <div className='custom-modal-header'>
                            상세내용
                            <span className="lnr lnr-cross lnr-custom-close" onClick={() => handleHidePopup()}/>
                        </div>
                        <div className='custom-modal-body'>
                            {/*//heading*/}
                            {CultivationSimulationBodyHeading(checkAll, this.onHandleClickAllCheckBox)}

                            {/*//land list*/}
                            <LandList selectedLands={selectedLands}
                                      onHandleClickOneCheckBox={(data) => this.onHandleClickOneCheckBox(data)}/>

                            {/*amount selected land*/}
                            {AmountSelectedlandSimulation()}

                            {/*tree list*/}
                            <TreeList treeList={allTrees} selectedLands={selectedLands}
                                      onHandleShowPopup={this.onHandleShowPopup}
                                      onHandleSimulatePlantTree={this.onHandleSimulatePlantTree}/>
                        </div>
                    </Modal>
                    {this.onHandlePopupRender()}
                </Fragment>
            )
        }
    }
}


export default CultivationSimulation