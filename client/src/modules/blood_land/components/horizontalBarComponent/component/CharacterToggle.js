import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import Tooltip from './../../general/Tooltip';

class CharacterToggle extends Component {
    funcCode = 5;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active:false
    }
    componentDidMount(){
        const {showCharacter} = this.props;
        this.checkSelected(showCharacter);
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.gameMode === false){
            this.setState({
                active:false
            });
        }
        if(nextProps.gameMode === true){
            this.setState({
                active: true
            });
            setTimeout(() => {
                if(this.props.showCharacter)
                    this.setState({img: this.SELECTED_IMG});
                else
                    this.setState({img: this.IMG});
            }, 50);
        }
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

    handleOnClickOption = () => {
        const {showCharacter} = this.props;
        this.props.show(!showCharacter)
    };

    render(){
        const {showCharacter} = this.props;
        const {active,selected} = this.state;
        const nameLang = selected ? 'horizontalBarComponent.CharacterToggle.active' : 'horizontalBarComponent.CharacterToggle.deactive';
        // const descLang = 'horizontalBarComponent.CharacterToggle.desc';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(showCharacter)} >
                <img src={this.state.img} alt='' />
                <Tooltip descLang={nameLang} />
            </button>
        );
    }
}

function mapStateToProps(state) {
    const { authentication: {user},settingReducer:{gameMode,showCharacter} } = state;
    return {
        user,gameMode,showCharacter
    };
}

const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    show: (displayChar) => dispatch(settingActions.showCharacter(displayChar)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CharacterToggle)