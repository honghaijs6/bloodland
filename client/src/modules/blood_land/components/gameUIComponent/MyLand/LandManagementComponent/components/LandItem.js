import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {DragSource} from 'react-dnd';
import { translate } from 'react-i18next';


import {
    Rules,
    getMapImgByItemId,
    onHandleTranslate,
    landActions,
} from '../../../../../../../helpers/importModule';

const itemSource = {
    beginDrag(props) {
        let lands = props.selectedItems;
        if (lands.filter(i => i.land._id === props.item.land._id).length === 0) lands.push(props.item);
        return {
            item: {
                lands,
                oldCateId: props.cateId
            }
        };
    },
    endDrag(props, monitor, component, test) {
        if (!monitor.didDrop()) {
            return;
        }
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

class LandItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renameInputToggle: false,
            checked: false,
            newLand: ''
        };
    }

    componentDidMount() {
        if(this.props.latestQK){
            setTimeout(() => {
                this.props.getLastestQuadkeyLandPurchase()
            }, 3000)
        }
    }


    renameInputToggle = (name) => {
        this.setState({
            newLand: name,
            renameInputToggle: !this.state.renameInputToggle,
            error:undefined
        });
    }

    renameLand = (land, value) => {
        let rules = new Rules.ValidationRules();
        
        const {t,settingReducer:{language},lng} = this.props;
        const checkLengthErr = onHandleTranslate(t,'validation.checkLength', language , lng);
        // if (rules.checkEmpty(value,'_')) 
        //     return this.setState({error:rules.checkEmpty(value,'올바른 폴더명을 입력해주세요')});
        if (rules.checkLength(value, 36, '_'))
            return this.setState({error: rules.checkLength(value, 36, checkLengthErr)});
        // if (rules.checkExistString(value, land.name, this.props.landNamesOfCate, '_'))
        //     return this.setState({error: rules.checkExistString(value, land.name, this.props.landNamesOfCate, '이미 존재하는 이름입니다.')});

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
            this.renameLand(land, value);
        }
    }

    handleRenameByClick = (land) => {
        // if (this.validate(this.state.newLand)) return;
        const value = this.state.newLand.trim();
        this.renameLand(land, value);
    }

    updateInput = (e) => {
        this.setState({
            newLand: e.target.value,
            checkLength: false
        });
    };

    getTree = (tree , allBigTreeQuadKey , quadKey) => {
        let  thumbImgUrl = tree  &&  getMapImgByItemId(tree.itemId === 'T10' ? 'T10-icon' : tree.itemId) ;
        const checkQuadKey = allBigTreeQuadKey ?  allBigTreeQuadKey.filter(tree => tree === quadKey) : [];
        const thumbImgUrlForBitaminTree = !thumbImgUrl  ? checkQuadKey.length === 1 && getMapImgByItemId('T10-icon') : thumbImgUrl;
        return  (
            <div className='signal-tree'>
                <img src={thumbImgUrlForBitaminTree ? thumbImgUrlForBitaminTree : null} alt=''/>
            </div>
        )
    };

    handleCheckLand = () =>{
        const {item, doCheckAndUpdateCategories} = this.props;
        !item.land.forSaleStatus && doCheckAndUpdateCategories(item.land);
    }
    //vuonglt  6/6/2019 add new css and html
    getEditName = () =>{
        const {item} = this.props;
        const {newLand} = this.state
        const {error} = this.state;
        const {t,settingReducer:{language},lng} = this.props;
        return <Fragment>
                    <div className='land edit'>
                        <div className='confirm-btn' onClick={() => this.handleRenameByClick(item.land)} ></div>
                        <div className='cancel-btn'  onClick={() => this.renameInputToggle('')} ></div>
                        <input  placeholder={onHandleTranslate(t,'menuTab.myLand.landOwned.editLandName', language , lng)}
                                value={newLand} autoFocus onChange={(e) => this.updateInput(e)}
                                onKeyPress={this.handleRenameBySubmit(item.land)}/>
                    </div>
                    {error && <div className='error-alert'>{error}</div>}
                </Fragment>
    }

    //vuonglt  6/6/2019 add new css and html
    renderLand = () =>{
        const {isDragging, connectDragSource, item, tree, quadKeyResult, myObjects , latestQK} = this.props;
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        const hasSelectedQuadkeyAtLandMap = quadKeyResult && quadKeyResult.find(i => i.quadKey === item.land.quadKey);
        const {quadKey,name} = item.land;
        const findLatestQuadKey = latestQK && latestQK.length !== 0 && latestQK.filter(q => q.quadKey === quadKey);
        const checkBoxClass = `check-box ${item.checked ? 'checked' : ''} ${item.land.forSaleStatus ? 'hide' : ''}`;
        // console.log('hasSelectedQuadkeyAtLandMap',hasSelectedQuadkeyAtLandMap);
        const landNameClass = `name ${item.highlight || hasSelectedQuadkeyAtLandMap || (findLatestQuadKey && findLatestQuadKey.length !== 0) ? 'highlight-land' : ''} ${isDragging ? 'hide-on-dragging' : ''}`
        return  (
            <div className='land'>
                <div className='rename-btn' onClick={() => this.renameInputToggle(item.land.name)}></div>
                <div className={checkBoxClass} onClick={() => this.handleCheckLand()}></div>
                {
                    connectDragSource(
                        <div className={landNameClass} onClick={() => this.props.moveToLand(item)}>{name ? name : quadKey}</div>
                    )
                }
                {this.getTree(tree , allBigTreeQuadKey , quadKey)}
            </div>
        );
    }

    render() {
        const {renameInputToggle} = this.state;
        return renameInputToggle ? this.getEditName() : this.renderLand();
    }
}

function mapStateToProps(state) {
    const {authentication: {user},settingReducer , objectsReducer: {myObjects} , lands:{latestQK}} = state;
    return {
        user,settingReducer, myObjects , latestQK
    };
}

const mapDispatchToProps = (dispatch) => ({
    getLastestQuadkeyLandPurchase: (param) => dispatch(landActions.getLastestQuadkeyLandPurchase(param))
});

const dragSource = DragSource('item', itemSource, collect)(translate('common')(LandItem))
const connectedPage = connect(mapStateToProps , mapDispatchToProps)(dragSource);
export default connectedPage;