import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';

class ClearSelection extends Component {
    funcCode = 4;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active:true
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
        // this.props.selectMode('clear');
        this.props.clearSelected();
        // this.props.handleFuncSelect(this.funcCode);
        this.props.toggleGame(false);
    };

    render(){
        const {active} = this.state;
        const nameLang = 'horizontalBarComponent.ClearSelection'
        // const descLang = 'horizontalBarComponent.ClearSelection.desc';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                                                onMouseEnter={() => active &&  this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(this.props.selected)}
                                                >
                <img src={this.state.img} alt='' />
                 <Tooltip descLang={nameLang} />
            </button>
        );
    }
}


function mapStateToProps(state) {
    const { authentication: {user},map,settingReducer:{gameMode} } = state;
    return {
        user,gameMode,map
    };
}
const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    toggleGame: (toggle) => dispatch(settingActions.toggleGameMode(toggle)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ClearSelection)