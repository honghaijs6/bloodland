import React, {Component} from 'react'
import {connect} from "react-redux";
import {mapActions} from "../../../../../store/actions/commonActions/mapActions";
import {settingActions} from "../../../../../store/actions/commonActions/settingActions";
import {loadingImage} from "../../general/System";
import {mapGameAction} from "../../../../../store/actions/gameActions/mapGameActions";
import Tooltip from './../../general/Tooltip';

class IconToggle extends Component {
    funcCode = 6;
    IMG = loadingImage(`/images/funcs/func-${this.funcCode}.svg`);
    SELECTED_IMG = loadingImage(`/images/funcs/func-${this.funcCode}-selected.svg`);
    state = {
        img: this.IMG,
        active:false,
        toggle: true
    }
    componentDidMount(){
        const {showItem} = this.props;
        this.checkSelected(showItem);
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
                if(this.props.showItem)
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
        const {showItem} = this.props;
        this.props.show(!showItem)
        this.setState({
            toggle: !this.state.toggle
        });
        if(this.state.active){
            this.props.onHandleHideOtherCharacterOnMap(this.state.toggle)
        }

    };

    render(){
        const {showItem} = this.props;
        const {active,toggle} = this.state;
        const nameLang = toggle ? 'horizontalBarComponent.IconToggle.active' : 'horizontalBarComponent.IconToggle.deactive';
        // const descLang = 'horizontalBarComponent.IconToggle.desc';
        return(
            <button className={`game-func-btn ${!active ? 'deactive' : 'none'}`} onClick={() => active && this.handleOnClickOption()}
                                                onMouseEnter={() => active && this.setImg(this.SELECTED_IMG)}
                                                onMouseOut  ={() => active && this.checkSelected(showItem)} >
                <img src={this.state.img} alt='' />
                 <Tooltip descLang={nameLang} />
            </button>
        );
    }
}


function mapStateToProps(state) {
    const { authentication: {user},settingReducer:{gameMode,showItem}  } = state;
    return {
        user,showItem,gameMode
    };
}
const mapDispatchToProps = (dispatch) => ({
    clearSelected: () => dispatch(mapActions.clearSelected()),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    show: (displayItem) => dispatch(settingActions.showItem(displayItem)),
    onHandleHideOtherCharacterOnMap: (toggle) => dispatch(mapGameAction.onHandleHideOtherCharacterOnMap(toggle))
});

export default connect(mapStateToProps,mapDispatchToProps)(IconToggle)
