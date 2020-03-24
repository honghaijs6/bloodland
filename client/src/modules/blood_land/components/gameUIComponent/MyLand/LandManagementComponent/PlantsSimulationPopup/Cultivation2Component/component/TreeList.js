import React, {PureComponent} from 'react'
import {getMapImgByItemId} from "../../../../../../../../helpers/thumbnails";
import {alertPopup} from "../alertPopup";

class TreeList extends PureComponent {
    state = {};

    onHandleSimulatePlantTree = (treeSelected, landsSelected) => {
        const {tree: {itemId} , remainAmount} = treeSelected;
        const {onHandleShowPopup, onHandleSimulatePlantTree} = this.props;
        const landAmountSelected = landsSelected.filter(land => land.checked);
        if(landAmountSelected.length === 0){
            onHandleShowPopup(alertPopup.noSelectedLandAlert);
        }else if(remainAmount === 0){
            onHandleShowPopup(alertPopup.getNoEnoughTreeAlert);
        }
        else {
            onHandleSimulatePlantTree(itemId)
        }
    };

    render() {
        const {treeList, selectedLands} = this.props;
        return (
            <div className='plant-simulation-list list-scrollable' style={{paddingTop: '15px', height: '173px',border:'none'}}>
                <div className='title-plan-tree-container'>
                    <div className='tree-row-title'>아이템</div>
                    <div className='tree-available-title'>나의 보유 수량</div>
                    <div className='using-tree-title'>사용 할 수량</div>
                    <div className='rest-tree-title'>남은 수량</div>
                </div>
                {
                    treeList.map((item, index) => {
                        const {tree: {itemId, name_ko}, maxAmount, usingAmount, remainAmount} = item;
                        return (
                            <div className='item no-content' key={index} style={{justifyContent: 'center'}}>
                                <div className='i-30 text-center'
                                     onClick={() => this.onHandleSimulatePlantTree(item, selectedLands)}>
                                    <button className='sp-item' style={{width: '90%'}}>
                                        <div className='sp-img'>
                                            <img src={getMapImgByItemId(itemId)} alt=''/>
                                        </div>
                                        <div className='sp-name'>{name_ko}</div>
                                    </button>
                                </div>
                                <div className='i-60 text-center'>
                                    <div className='inputs-group'>
                                        <div className='textinput'>
                                            <input readOnly value={maxAmount}/>
                                        </div>
                                        <div className='textinput'>
                                            <input readOnly value={usingAmount}/>
                                        </div>
                                        <div className='textinput'>
                                            <input readOnly value={remainAmount}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                }
            </div>
        )
    }

}


export default TreeList