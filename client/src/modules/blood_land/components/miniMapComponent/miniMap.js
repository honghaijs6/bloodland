import React, {PureComponent} from "react";
import {settingActions} from "../../../../store/actions/commonActions/settingActions";
import {connect} from "react-redux";
import MiniMapContainer from "./component/miniMapContainer";
import ToggleButton from "./component/toggleButton";

class MiniMap extends PureComponent {
    state = {
        currentTab: 1,
        toggle:true
    };
    handleToggleOnClick = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    };
    getCurrentData = (data) => {
        this.setState({
            currentTab: data
        })
    };
    render() {
        const {toggle} = this.state;
        return(
            <div className='miniMap-container'>
                <ToggleButton handleToggleOnClick={this.handleToggleOnClick} toggle={toggle} handleCurrentTab={(data) => this.getCurrentData(data)}/>
                {toggle &&  <MiniMapContainer currentTab={this.state.currentTab}/>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { authentication: {user}} = state;
    return {
        user
    };
};

const mapDispatchToProps = (dispatch) => ({
    expandMap: (expand) => dispatch(settingActions.expandMap(expand)),
});

export default connect(mapStateToProps,mapDispatchToProps)(MiniMap)