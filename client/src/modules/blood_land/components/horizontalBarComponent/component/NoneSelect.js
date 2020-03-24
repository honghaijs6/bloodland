import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';

class NoneSelect extends Component {
    funcCode = 1;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active:false
    }
    setImg = (img) =>{
        this.setState({
            img: img
        })
    }
    checkSelected = (selected) =>{
        if(selected)
            this.setImg(this.SELECTED_IMG);
        else{
            this.setImg(this.IMG);
        }
    }

    componentDidMount(){
        this.checkSelected(this.props.selected);
    }

    async componentWillReceiveProps(nextProps){
        this.checkSelected(nextProps.selected);
        this.setState({
                active:!nextProps.gameMode
        });
    }

    handleOnClickOption = () => {
        this.props.selectMode('none');
        this.props.handleFuncSelect(this.funcCode);
    };

    render(){
        const {active} = this.state;
        const nameLang = 'horizontalBarComponent.NoneSelect'
        // const descLang = 'horizontalBarComponent.NoneSelect.desc';
        return(
            <button className={`game-func-btn  ${!active ? 'deactive' : 'none'}`} onClick={() => active &&  this.handleOnClickOption()}
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(this.props.selected)}>
                <img src={this.state.img} alt='' />
                 <Tooltip descLang={nameLang} />
            </button>
        );
    }
}


function mapStateToProps(state) {
    const { authentication: {user},map,settingReducer:{gameMode} } = state;
    return {
        user,map,gameMode
    };
}
const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
});

export default connect(mapStateToProps,mapDispatchToProps)(NoneSelect)
