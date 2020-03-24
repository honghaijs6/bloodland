import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {DropTarget} from 'react-dnd';
import {FaFolder, FaFolderOpen} from 'react-icons/fa';
import intersectionBy from 'lodash.intersectionby';
import { translate } from 'react-i18next';

import LandItem from './LandItem';

import {
    Rules,
    onHandleTranslate,
    TranslateLanguage,
    landActions,
} from '../../../../../../../helpers/importModule';

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        item: monitor.getItem(),
    }
}

const itemDropSource = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        const item = monitor.getItem();
        return props.dropItemToCate({
            ...item,
            userId: props.user._id,
            newCateId: props.cate.category._id
        });
    }
};

class CateItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            landsInCateToggle: false,
            renameInputToggle: false,
            newCate: '',
            error: null,
            cate: null
        };
    }

    componentDidMount() {
        const {cate} = this.props;
        this.setState({cate: cate});
    }

    componentDidUpdate(prevProps){
        const {cate, closeCategory} = this.props;
        if(cate !== prevProps.cate){
            this.forceUpdate();
            this.setState({cate});
        }
        if(closeCategory !== prevProps.closeCategory){
            this.setState({
                landsInCateToggle: false
            });
        }
    }

    showRenameInput = (cate) => {
        this.setState({
            newCate: cate.name,
            renameInputToggle: !this.state.renameInputToggle
        });
    }

    toggleRename = () => {
        this.setState({
            renameInputToggle: !this.state.renameInputToggle
        });
    }

    renameCategory = (cateId, value, self) => {
        let rules = new Rules.ValidationRules();

        const {t, settingReducer: {language}, lng} = this.props;
        const checkExistString = onHandleTranslate(t, 'validation.addCategoryValidation.checkExistString', language, lng);
        const checkLength = onHandleTranslate(t, 'validation.addCategoryValidation.checkLength', language, lng);
        const checkEmpty = onHandleTranslate(t, 'validation.addCategoryValidation.checkEmpty', language, lng);

        if (rules.checkEmpty(value, '_'))
            return this.setState({error: rules.checkEmpty(value, checkEmpty)});
        if (rules.checkLength(value, 36, '_'))
            return this.setState({error: rules.checkLength(value, 36, checkLength)});

        if (rules.checkExistString(value, self, this.props.categorieNames, '_'))
            return this.setState({error: rules.checkExistString(value, self, this.props.categorieNames, checkExistString)});

        const {user: {_id}} = this.props;
        const param = {
            input: value,
            userId: _id,
            cateId: cateId
        }
        this.props.renameCategory(param);
        this.toggleRename();
    }

    handleRenameBySubmit = (cate) => (e) => {
        if (e.charCode === 13) {
            const value = this.state.newCate.trim();
            this.renameCategory(cate._id, value, cate.name);
        }
    };

    handleRenameByClick = (cate) => {
        const value = this.state.newCate.trim();
        this.renameCategory(cate._id, value, cate.name);
    };

    updateInput = (e) => {
        this.setState({
            newCate: e.target.value,
            error: null
        });
    };


    doCheckAndUpdateCategories = ({categoryId}, flag) => {
        setTimeout(() => {
            this.props.doCheckAndUpdateCategories({categoryId}, flag);
        }, 10);
    };

    //vuonglt fix load land pending
    doSelecting = (cateId, lands) => {
        if (!lands) {
            const param = {
                cateId: cateId,
                userId: this.props.user._id
            }
            this.props.getLandByCategory(param);
        }

        setTimeout(() => {
            this.setState({
                landsInCateToggle: !this.state.landsInCateToggle
            });
        }, 50);
    }

    onHandleCheckLandSelectedCategory = (selected, lands) => {
        if (selected && selected.length !== 0 && lands) {
            const landFilter = lands.map(l => l.land);
            return intersectionBy(selected, landFilter, 'quadKey')
        }
    };

    getEditName = () =>{
        const {error, cate} = this.state;
        const {t, settingReducer: {language}, lng} = this.props;
        return  <Fragment>
                    <div className='folder edit'>
                        <div className='confirm-btn' onClick={() => this.handleRenameByClick(cate.category)} />
                        <div className='cancel-btn'  onClick={() => this.toggleRename()}/>
                        <FaFolder className='folder-close' size={16} />
                        <input  placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.addFolder.folderName', language, lng)}
                                autoFocus value={this.state.newCate}
                                onChange={(e) => this.updateInput(e)}
                                onKeyPress={this.handleRenameBySubmit(cate.category)}/>
                    </div>
                    {error && <div className='error-alert'>{error}</div>}
                </Fragment>
    }

    loading = () => {
        return (
            <div className='land-list'>
                <div className="lds-ellipsis">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        )
    };

    //vuonglt 6/6/2019 fix loading
    renderCategory = () => {
        const {cate,landsInCateToggle} = this.state;
        const {key,hovered} = this.props;
        const {category, checked} = cate;
        const checkBoxClass = `check-box ${checked ? 'checked' : ''} ${landsInCateToggle ? 'folder-opened' : ''}`;
        const hoverClass = `${hovered ? 'hovered': ''}`
        if (category) {
            const {name, _id, lands} = category;
            return (
                <div className={hoverClass} key={key}>
                    <div className='folder' >
                        {name === 'empty' ? <div className='empty-replace'/> : <div className='rename-btn' onClick={() => this.showRenameInput(category)}></div>}
                        <div className={checkBoxClass} onClick={() => landsInCateToggle && this.doCheckAndUpdateCategories({categoryId: _id}, true, lands)}/>
                        {landsInCateToggle && lands && lands.length > 0 ? <FaFolderOpen className='folder-open' size={18} /> : <FaFolder className='folder-close' size={16} />}
                        <div className='name' onClick={() => this.doSelecting(_id, lands)}>
                            {name === 'empty' ? <TranslateLanguage direct={'menuTab.myLand.landOwned.tempFolder'}/> : name }
                        </div>
                    </div>
                    {landsInCateToggle && ( this.getLandItems(lands, _id)) }
                </div>
            )
        }
    };

    getLandItems = (lands, cateId) => {
        const {selected, myObjects,moveToLand,renameLand,doCheckAndUpdateCategories} = this.props;
        const quadKeyResult = lands && this.onHandleCheckLandSelectedCategory(selected, lands);
        const landNamesOfCate = lands && lands.map(({name},i)=> name !== '' && name);
        lands && lands.sort(function(a,b){
            return new Date(b.land.purchaseDate) - new Date(a.land.purchaseDate);
        });
        return  lands ? <div className='land-list'>
                    {lands.map((o,i)=>{
                        const aTreeOnLand = myObjects && myObjects.length > 0 ? myObjects.find(i => i.quadKey === o.land.quadKey) : null;
                        return <LandItem  key={i}   landNamesOfCate={landNamesOfCate}
                                                    selectedItems={lands.filter(l => l.checked)}
                                                    cateId={cateId}
                                                    moveToLand={moveToLand}
                                                    renameLand={renameLand}
                                                    isParentFolder={false}
                                                    check={o.checked}
                                                    item={o}
                                                    doCheckAndUpdateCategories={doCheckAndUpdateCategories}
                                                    tree={aTreeOnLand}
                                                    quadKeyResult={quadKeyResult && quadKeyResult}
                                            />
                    })}
                </div> :
                this.loading();
    }


    render() {
        const {connectDropTarget} = this.props;
        const {renameInputToggle,cate} = this.state;
        const {getEditName,renderCategory} = this;
        return renameInputToggle ? getEditName() : cate && connectDropTarget(renderCategory())
    }
}

function mapStateToProps(state) {
    const {lands, authentication: {user}, objectsReducer: {myObjects}, map: {selected}, settingReducer} = state;
    return {
        lands,
        user,
        myObjects,
        selected,
        settingReducer
    };
}

const mapDispatchToProps = (dispatch) => ({
    getLandByCategory: (param) => dispatch(landActions.getLandByCategory(param)),
    getLandByCategoryForChecking: (param) => dispatch(landActions.getLandByCategoryForChecking(param)),
});


const dropTarget = DropTarget('item', itemDropSource, collect)(translate('common')(CateItem))
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(dropTarget);
export default connectedPage;