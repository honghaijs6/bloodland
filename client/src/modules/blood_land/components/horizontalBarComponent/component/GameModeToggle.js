import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';

class GameModeToggle extends Component {
    funcCode = 11;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        selected:false,
        active:true
    }
    setImg = (img) =>{
        this.setState({
            img: img
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.gameMode === false){
            this.setState({
                selected: false,
                img: this.IMG
            });
        }
        if(nextProps.gameMode === true){
            this.setState({
                selected: true,
                img: this.SELECTED_IMG
            });
        }
    }

    checkSelected = (selected) =>{
        if(selected)
            this.setImg(this.SELECTED_IMG);
        else{
            this.setImg(this.IMG);
        }
    }

    handleOnClickOption = () => {
        this.setState({
            selected: !this.state.selected
        });
        //this.props.selectMode('multi');
        setTimeout(() => {
            this.props.toggleGame(this.state.selected);
        }, 100);
    };

    render(){
        const {active,selected} = this.state;
        const nameLang = selected ? 'horizontalBarComponent.GameModeToggle.Game' : 'horizontalBarComponent.GameModeToggle.RealEstate'
        // const descLang = 'horizontalBarComponent.GameModeToggle.desc';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()} 
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(this.state.selected)} >
                <img src={this.state.img} alt='' />
                 <Tooltip descLang={nameLang} />
            </button>
        );
    }
}

function mapStateToProps(state) {
    const { authentication: {user},settingReducer:{gameMode}, map  } = state;
    return {
        user,gameMode, map
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    toggleGame: (toggle) => dispatch(settingActions.toggleGameMode(toggle)),
});

export default connect(mapStateToProps,mapDispatchToProps)(GameModeToggle)