import React, {Component} from 'react'
import {connect} from "react-redux";
import MultiSelect from './component/MultiSelect';
import SingleSelect from './component/SingleSelect';
import ClearSelection from './component/ClearSelection';
import IconToggle from './component/IconToggle';
import AdsToggle from './component/AdsToggle';
import InfoToggle from './component/InfoToggle';
import ShopToggle from './component/ShopToggle';
import Switch3D from './component/Switch3D';
import GameModeToggle from './component/GameModeToggle';
import {settingActions} from "../../../../store/actions/commonActions/settingActions";
import {mapActions} from "../../../../store/actions/commonActions/mapActions";
import LineSelect from './component/LineSelect';

const func = {
    fillSelect: 20,
    lineSelect: 0,
    noneSelect: 1,
    singleSelect: 2,
    multiSelect: 3,
    clearSelection: 4,
    toggleCharacters: 5,
    toggleIcon: 6,
    toggleStores: 7,
    toggleInfo: 8,
    toggleAds: 9,
    switch3D: 10,
};
// update: 22/3/1019
// By Minh Tri - refactor code

class Functions extends Component {
    state = {
        selectedFunc: func.singleSelect,
    };
    //reset selected status toggle game
    componentDidMount() {
        this.props.toggleGame(false);
    }

    //function selected type
    handleFuncSelect = (selectedFunc) => {
        this.setState({selectedFunc});
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.mode !== this.props.mode){
            if(this.props.mode === func.noneSelect){
                this.setState({
                    selectedFunc: func.noneSelect
                })
            }
        }

    }

    render() {
        const {user: {role}} = this.props;
        const {selectedFunc} = this.state;
        return (
            <div className='game-functions'>
                {role && role === 'manager' && <LineSelect selected={selectedFunc === func.lineSelect}
                                handleFuncSelect={this.handleFuncSelect}/>}
                <SingleSelect selected={selectedFunc === func.singleSelect}
                              handleFuncSelect={this.handleFuncSelect}/>
                <MultiSelect selected={selectedFunc === func.multiSelect}
                             handleFuncSelect={this.handleFuncSelect}/>
                <ClearSelection selected={selectedFunc === func.clearSelection}
                                handleFuncSelect={this.handleFuncSelect}/>
                <IconToggle selected={selectedFunc === func.toggleIcon}
                            handleFuncSelect={this.handleFuncSelect}/>
                <ShopToggle selected={selectedFunc === func.toggleStores}
                            handleFuncSelect={this.handleFuncSelect}/>
                <AdsToggle selected={selectedFunc === func.toggleAds}
                           handleFuncSelect={this.handleFuncSelect}/>
                <InfoToggle selected={selectedFunc === func.toggleInfo}
                            handleFuncSelect={this.handleFuncSelect}/>
                <Switch3D selected={selectedFunc === func.switch3D}
                          handleFuncSelect={this.handleFuncSelect}/>
                <GameModeToggle/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, settingReducer: {gameMode}, lands , map:{mode} } = state;
    return {
        user, gameMode, lands , mode
    };
};
const mapDispatchToProps = (dispatch) => ({
    toggleGame: (mode) => dispatch(settingActions.toggleGameMode(mode)),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode))
});
export default connect(mapStateToProps, mapDispatchToProps)(Functions)
