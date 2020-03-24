import React, { Fragment, Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { DragSource } from 'react-dnd';
import Rules from "../../../../../../helpers/ValidationRule";
import common from "../../../../../../helpers/Common";
import { getImgByTypeCode } from "../../../../../../helpers/thumbnails";

const itemSource = {
    beginDrag(props) {
        // console.log('-=-=>GAP',props);
        let lands = props.selectedItems;
        if( lands.filter(i=>i.land._id === props.item.land._id).length === 0) lands.push(props.item);
        return {
                item:{
                        lands,
                        oldCateId:props.cateId
                    }
        };
    },
    endDrag(props, monitor, component, test) {
        if (!monitor.didDrop()) {
            return;
        }
        // console.log("props",props);
        return;//props.handleDrop(props.item);
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }
}

class LandItemInCate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renameInputToggle: false,
            checked: false,
            newLand: '',
            error: []
        };
    }

    renameInputToggle = (name) => {
        this.setState({
            newLand: name,
            renameInputToggle: !this.state.renameInputToggle
        });
    }

    renameLand = (land,value) =>{
        //console.log('landNamesOfCate',this.props.landNamesOfCate);
        let rules = new Rules.ValidationRules();
        if (rules.checkEmpty(value,'_')) 
            return this.setState({error:rules.checkEmpty(value,'올바른 폴더명을 입력해주세요')});
        if (rules.checkLength(value,36,'_'))
            return this.setState({error:rules.checkLength(value,36,'문자 수는 '+ 36 +' 미만이어야합니다.')});
        if (rules.checkExistString(value,land.name,this.props.landNamesOfCate,'_'))
            return this.setState({error:rules.checkExistString(value,land.name,this.props.landNamesOfCate,'이미 존재하는 이름입니다.')});

        const {user: {_id}} = this.props;
        const param = {
                    input: value,
                    userId: _id,
                    cateId: land.cateId,
                    landId: land._id
                };
        this.props.renameLand(param);
        this.renameInputToggle('');
    }

    handleRenameBySubmit = (land) => (e) => {
        if (e.charCode === 13) {
            const value = this.state.newLand.trim();
            this.renameLand(land,value);
        }
    }

    handleRenameByClick = (land) => {
        // if (this.validate(this.state.newLand)) return;
        const value = this.state.newLand.trim();
        this.renameLand(land,value);
    }


    updateInput = (e) => {
        this.setState({
            newLand: e.target.value,
            checkLength: false
        });
    };

    render() {
        const { isDragging, connectDragSource, item, tree } = this.props;
        const { error} = this.state;
        //vuongcheck
        // console.log(item);
        const opacity = isDragging ? 0 : 1;
        const quadKey = item.land.quadKey.length > 15 ?
            <Fragment>
                {item.land.quadKey.substring(0, 15)} ...
                            {/* <span className="full-text-tip">{item.land.quadKey}</span>  */}
            </Fragment> : item.land.quadKey;
        const name = item.land.name.length > 15 ?
            <Fragment>
                {item.land.name.substring(0, 15)}
                {/* <span className="full-text-tip">{item.land.quadKey}</span>  */}
            </Fragment> : item.land.name;
        // console.log(tree);
        const thumbImgUrl = typeof tree === 'undefined' || !tree ? null : !common.isTreeType(tree.type) ? null : getImgByTypeCode(tree.typeCode);
        return (
             <Fragment>
                {this.state.renameInputToggle ?
                    <Fragment>
                        <div className='item item-width-125per fixed-height' style={{ marginLeft: '-35px' }}>
                            <div className={'function-container'}>
                                <div className={`edit-place confirm-btn`} onClick={() => this.handleRenameByClick(item.land)} />
                                <div className={`edit-place cancel-btn`} onClick={() => this.renameInputToggle('')} />
                                <input className='edit-input input-120' placeholder='랜드 이름 수정' value={this.state.newLand} autoFocus onChange={(e) => this.updateInput(e)} onKeyPress={this.handleRenameBySubmit(item.land)} />
                            </div>
                        </div> 
                        {error && <div className='error-alert'>{error}</div> }
                    </Fragment>
                    :
                   <div className='item item-width-125per fixed-height' style={{ marginLeft: '-35px' }}>
                        <div className={'function-container'}>
                            <div className={this.state.renameInputToggle ? 'd-none' : 'edit-place rename-btn'} onClick={() => this.renameInputToggle(item.land.name)} />
                            <div className={`checkbox ${item.checked ? 'checked' : ''} ${item.land.forSaleStatus ? 'hide' : ''}`} onClick={() => {!item.land.forSaleStatus && this.props.doCheckAndUpdateCategories(item.land);}}/>
                            {
                                connectDragSource(
                                    <div className='item-content'>
                                        <div className='item-col-130' style={{ opacity }} onClick={() => this.props.moveToLand(item)}>
                                            <div className='child-hover'>{typeof item.land.name !== 'undefined' && item.land.name && item.land.name !== '' ? name : quadKey}</div>
                                        </div>
                                    </div>)
                            }
                            {
                                typeof tree === 'undefined' || !tree ? null : !common.isTreeType(tree.type) ? null : (
                                    <div className={`signal-tree margin-reset`}>
                                        <img src={thumbImgUrl} alt=''/>
                                    </div>
                                )
                            }
                        </div>
                   </div>
                }  
                </Fragment>
        );
    }


}

function mapStateToProps(state) {
    const { authentication: { user } } = state;
    return {
        user
    };
}


const dragSource = DragSource('item', itemSource, collect)(LandItemInCate)
const connectedPage = connect(mapStateToProps)(dragSource);
export default connectedPage;