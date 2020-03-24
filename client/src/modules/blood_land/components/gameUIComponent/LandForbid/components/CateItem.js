import React,{Component,Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {DropTarget} from 'react-dnd';
import LandItemInCate from './LandItemInCate';
import Rules from "../../../../../../helpers/ValidationRule";
import {landActions} from "../../../../../../store/actions/landActions/landActions";

function collect(connect,monitor){
    return{
        connectDropTarget:connect.dropTarget(),
        hovered:monitor.isOver(),
        item:monitor.getItem(),
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
            userId:props.user._id,
            newCateId:props.cate._id
        });
    }
};

class CateItem extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            landsInCateToggle:false,
            renameInputToggle:false,
            newCate:'',
            error:null,
            cate:null,
        };
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log('nextProps: ', nextProps);
        const {cate} = nextProps;
        this.forceUpdate();
        this.setState({cate:cate});
    }

    showSeleting = () =>{
        this.setState({
            landsInCateToggle:true
        });
    };

    showRenameInput = (cate) =>{
        this.setState({
            newCate:cate.name,
            renameInputToggle:!this.state.renameInputToggle
        });
    }

    toggleRename = () =>{
        this.setState({
            renameInputToggle:!this.state.renameInputToggle
        });
    }
    
    renameCategory = (cateId,value,self)=>{
        let rules = new Rules.ValidationRules();
        if (rules.checkEmpty(value,'_')) 
            return this.setState({error:rules.checkEmpty(value,'올바른 폴더명을 입력해주세요')});
        if (rules.checkLength(value,36,'_'))
            return this.setState({error:rules.checkLength(value,36,'문자 수는 '+ 36 +' 미만이어야합니다.')});
        if (rules.checkExistString(value,self,this.props.categorieNames,'_'))
            return this.setState({error:rules.checkExistString(value,self,this.props.categorieNames,'이미 존재하는 이름입니다.')});

        const {user: {_id}} = this.props;
        const param = {
            input:value,
            userId:_id,
            cateId:cateId
        }
        this.props.renameCategory(param);
        this.toggleRename();
    }

    handleRenameBySubmit = (cate) =>  (e) =>{
        if (e.charCode === 13) {
            const value = this.state.newCate.trim();
            this.renameCategory(cate._id,value,cate.name);
        }
    };

    handleRenameByClick = (cate) =>{
        const value = this.state.newCate.trim();
        this.renameCategory(cate._id,value,cate.name);
    };

    updateInput = (e) =>{
        this.setState({
            newCate : e.target.value,
            error: null
        });
    };

    getCategoryItemWithList = (background,cate,key) =>{
        return  <div className='item' style={{background}}>
                    <div className={'function-container'}>
                        <div className={this.state.renameInputToggle ? 'd-none' : `edit-place rename-btn`} onClick={()=>this.showRenameInput(cate.category)}/>
                        <div className={`checkbox ${cate.checked ? 'checked' : '' }`} onClick={() => this.doCheckAndUpdateCategories({cateId:cate._id},true)}/>
                        <div className='item-content folder'>
                            <div className='item-col-165'>
                                <div className='child-hover folder-color' onClick={()=>this.doSelecting(cate._id)}> <span className="lnr lnr-layers"></span> { cate.category.name.length > 13 ? cate.category.name.substring(0, 10) + '...' : cate.category.name} </div>
                                {/* {console.log('this.state.landsInCateToggle',this.state.landsInCateToggle)} */}
                                {/* {console.log('cate',cate)} */}
                                {this.state.landsInCateToggle ? this.getLandItems(cate.category.lands,0,cate.category.lands.length,cate._id):''}
                            </div>
                        </div>
                    </div>
                </div>
    };

    doCheckAndUpdateCategories = ({cateId},flag) => {
        this.props.doCheckAndUpdateCategories({cateId},flag);
    }

    getLandItems = (lands,from,length,cateId) =>{
        // console.log(cateId);


        let landNamesOfCate = [];
        for (let index = 0; index < lands.length; index++) {
            const land = lands[index].name;
            if(land !== '')
                landNamesOfCate.push(land);
        }
        //console.log('landNamesOfCate =>',landNamesOfCate);

        const landCharacters = this.props.landCharacterReducer.list
        let listHtml = [];
        let sortedLands = lands;
        
        // .sort(
        //     function(a,b){
        //         const dateA = new Date(a.land.updatedAt).getTime();
        //         const dateB = new Date(b.land.updatedAt).getTime();
        //         return dateA < dateB ? 1 : -1;
        //     }
        // );
        for (let index = from; index < length; index++) {
            const land = sortedLands[index];
            //console.log('thoi tieu roi',land);
            let aTreeOnLand = landCharacters.length > 0 ? landCharacters.filter(i => i.quadKey === land.land.quadKey)[0] : null;
            listHtml.push(
                <LandItemInCate landNamesOfCate={landNamesOfCate} selectedItems={lands.filter(l=>l.checked)} cateId={cateId} moveToLand={this.props.moveToLand} renameLand={this.props.renameLand}   isParentFolder={false} check={land.checked} key={index} item={land} doCheckAndUpdateCategories={this.props.doCheckAndUpdateCategories} tree={aTreeOnLand} />
            );
        }
        return listHtml;
    }

    doSelecting = (cateId) =>{
        const param = {
            cateId : cateId,
            userId : this.props.user._id
        }

        this.props.getLandByCategory(param);
        this.setState({
            landsInCateToggle:!this.state.landsInCateToggle
        });
    };

    render(){
        const {connectDropTarget,hovered,key} = this.props;
        // console.log(this.state.error);
        const {error,cate} = this.state;
        const background = hovered ? '#fff2d2' : '';
        return <Fragment>
            {this.state.renameInputToggle ?
                <Fragment>
                    <div className='item' style={{background}}>
                        <div className={'function-container'}>
                            <div className='edit-place confirm-btn' onClick={()=>this.handleRenameByClick(cate.category)} />
                            <div className='edit-place cancel-btn' onClick={()=>this.toggleRename()}/>
                            <input className='edit-input' placeholder='폴더명 입력' autoFocus value={this.state.newCate} onChange={(e)=>this.updateInput(e)} onKeyPress={this.handleRenameBySubmit( cate.category)} />

                        </div>
                    </div>
                    {error && <div className='error-alert'>{error}</div> }
                </Fragment> 
                : <Fragment>
                    { cate && connectDropTarget(this.getCategoryItemWithList(background,cate,key))}
                </Fragment> 
            }
            </Fragment> 
    }
}

function mapStateToProps(state) {
    const { lands, authentication: {user},landCharacterReducer } = state;
    return {
        lands,
        user,
        landCharacterReducer
    };
}
const mapDispatchToProps = (dispatch) => ({
    getLandByCategory: (param) => dispatch(landActions.getLandByCategory(param)),
});


const dropTarget = DropTarget('item',itemDropSource,collect)(CateItem)
const connectedPage = connect(mapStateToProps,mapDispatchToProps)(dropTarget);
export default connectedPage;