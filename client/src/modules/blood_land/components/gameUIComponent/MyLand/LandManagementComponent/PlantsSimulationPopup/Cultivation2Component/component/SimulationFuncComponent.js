import React from 'react';

export const CultivationSimulationBodyHeading = (checkAll, onHandleCheckAll) => {
    return (
        <div className='plant-simulation-list header top-bottom-padding-row-10px'>
            <div className='item l-bot'>
                <div className='i-50 text-center l-right'>
                    선택한 랜드
                </div>
                <div className='i-50 text-center'>
                    진행율
                </div>
            </div>
            <div className='item l-bot'>
                <div className='i-25 l-right'>
                    <div className='checkbox-item' onClick={() => onHandleCheckAll()}>
                        <div className={`checkbox ${checkAll && 'checked'}`}/>
                        전체 선택
                    </div>
                </div>
                <div className='i-25 l-right text-center'>
                    위치
                </div>
                <div className='i-25 l-right text-center'>
                    이자율
                </div>
                <div className='i-25 text-center'>
                    물이 필요한 시간
                </div>
            </div>
        </div>
    )
};

export const AmountSelectedlandSimulation = () => {
    return (
        <div className='plant-simulation-list header top-bottom-padding-row-10px'>
            <div className='item l-bot'>
                <div className='i-50 text-center l-right'>
                    선택된 랜드 수량
                </div>
                <div className='i-50 text-center'>
                    <input readOnly/> 랜드
                </div>
            </div>
        </div>
    )
};


//counting amount of tree => new All Trees
export const CheckAmountForAllTreeUpdateComponentDidUpdate = (param) => {
    const {allTrees, normalCount, whiteCount,
        greenCount, blueCount, bronzeCount, silverCount, goldCount, platinumCount, diamondCount
    } = param;
    return allTrees.map(object => {
        if (object.tree.itemId === 'T01' && normalCount) {
            object.usingAmount = normalCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T02' && whiteCount) {
            object.usingAmount = whiteCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T03' && greenCount) {
            object.usingAmount = greenCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T04' && blueCount) {
            object.usingAmount = blueCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T05' && bronzeCount) {
            object.usingAmount = bronzeCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T06' && silverCount) {
            object.usingAmount = silverCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T07' && goldCount) {
            object.usingAmount = goldCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T08' && platinumCount) {
            object.usingAmount = platinumCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T09' && diamondCount) {
            object.usingAmount = diamondCount;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else {
            object.remainAmount = object.maxAmount - object.usingAmount
        }
        return object
    })
};

export const CheckAmountForAllTreeUpdateSimulateFunction = (param) => {
    const {
        allTreesClone , normalCount,whiteCount,
        greenCount,blueCount,bronzeCount,
        silverCount,goldCount,platinumCount,diamondCount
    } = param;
    const test = allTreesClone.map(t => {
        if (normalCount && t.tree.itemId === 'T01') {
            t.usingAmount = normalCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (whiteCount && t.tree.itemId === 'T02') {
            t.usingAmount = whiteCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (greenCount && t.tree.itemId === 'T03') {
            t.usingAmount = greenCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (blueCount && t.tree.itemId === 'T04') {
            t.usingAmount = blueCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (bronzeCount && t.tree.itemId === 'T05') {
            t.usingAmount = bronzeCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (silverCount && t.tree.itemId === 'T06') {
            t.usingAmount = silverCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (goldCount && t.tree.itemId === 'T07') {
            t.usingAmount = goldCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (platinumCount && t.tree.itemId === 'T08') {
            t.usingAmount = platinumCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (diamondCount && t.tree.itemId === 'T09') {
            t.usingAmount = diamondCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else {
            t.usingAmount = 0;
            t.remainAmount = t.maxAmount - t.usingAmount
        }
        return t
    });
    return test

};