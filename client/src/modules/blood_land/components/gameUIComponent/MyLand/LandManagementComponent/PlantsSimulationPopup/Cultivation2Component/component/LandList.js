import React, {PureComponent} from 'react';
import {getMapImgByItemId} from "../../../../../../../../helpers/thumbnails";
import common from "../../../../../../../../helpers/Common";


class LandList extends PureComponent {
    onHandleClickCheckBox = (landClick , landsSelected) => {
        const {onHandleClickOneCheckBox} = this.props;
        const landsSelectedNew = landsSelected.map(land => {
            if(land.quadKey === landClick.quadKey){
                land.checked = !land.checked
            }
            return land
        });
        onHandleClickOneCheckBox(landsSelectedNew)
    };

    render() {
        const {selectedLands} = this.props;
        const noLandHeightList = 320 - selectedLands.length * 27;
        return (
            <div className='plant-simulation-list list-scrollable top-bottom-padding-row-2px' style={{height: '323px', overflowY: 'scroll'}}>
                {selectedLands.map((item, index) => {
                    const {quadKey , checked , treePlanted , name} = item;
                    return (
                        <div className='item' key={index}>
                            {/*//row 1*/}
                            <div className='i-25 l-right'>
                                <div className='checkbox-item'>
                                    <div className={`checkbox ${checked ? 'checked' : ''}`} onClick={() => this.onHandleClickCheckBox(item, selectedLands)}/>
                                    <div className='signal-tree'>
                                        {treePlanted && <img src={getMapImgByItemId(treePlanted.itemId)} alt=''/>}
                                    </div>
                                    {treePlanted ? treePlanted.name_ko : '...'}
                                </div>
                            </div>
                            {/*====================================================*/}
                            {/*row 2*/}
                            <div className='i-25 l-right text-center'>
                                {name === "" ? `${quadKey.substring(0, 15)}...` : name.substring(0, 15)}
                            </div>
                            {/*==============================================*/}
                            {/*row 3*/}
                            <div className='i-25 l-right text-center'>
                                {treePlanted ? treePlanted.defaultProfit.toFixed(5) + '%' : '0%'}
                            </div>
                            {/*================================================*/}
                            {/*row 4*/}
                            <div className='i-25 text-right'>
                                <button className='item-view-btn'
                                        style={{marginRight: '8px', width: '70%'}}>
                                    {treePlanted ? `${common.getDefaultWaterLeftDay()} 일` : '...'}
                                </button>
                                남음
                            </div>
                            {/*==========================================================*/}
                        </div>
                    )
                })}
                <div className='item no-content'
                     style={{height: noLandHeightList < 0 ? '12px' : noLandHeightList + 'px'}}>
                    <div className='i-25 l-right'/>
                    <div className='i-25 l-right text-center'/>
                    <div className='i-25 l-right text-center'/>
                    <div className='i-25 text-right'/>
                </div>
            </div>
        )
    }
}

export default LandList