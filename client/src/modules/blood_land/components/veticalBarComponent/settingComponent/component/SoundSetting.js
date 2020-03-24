import React, {Component, Fragment} from 'react'
import {settingActions} from "../../../../../../store/actions/commonActions/settingActions";
import {connect} from 'react-redux'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {turnOnImage} from "../asset";
import TranslateLanguage from "../../../general/TranslateComponent";

class SoundSetting extends Component {
    onHandleClick = () => {
        const {settingReducer: {bgMusic: {turnOn, volume}}, user: {_id}} = this.props;
        const settingParam = {
            userId: _id,
            bgMusic: {turnOn: !turnOn, volume}
        };
        this.props.setBgMusic(settingParam)
    };

    onHandleAfterChange = (value) => {
        const {settingReducer: {bgMusic: {turnOn}}, user: {_id}} = this.props;
        const settingParam = {
            userId: _id,
            bgMusic: {turnOn: turnOn, volume: value}
        };
        this.props.setBgMusic(settingParam)
    };

    render() {
        const {settingReducer: {bgMusic}} = this.props;
        return (
            <Fragment>
                {bgMusic &&
                <Fragment>
                    <div className='setting-row margin-top-20'>
                        <div>
                            <TranslateLanguage direct={'menuTab.setting.backgroundMusic'}/>
                        </div>
                        <div className='switch-control' onClick={() => this.onHandleClick()}>
                            {bgMusic.turnOn ? <div className='switch-content-on'>ON</div> :
                                <div className='switch-content-off'>OFF</div>}
                            <img className={`switch-btn ${bgMusic.turnOn ? 'on' : ''}`} src={turnOnImage} alt=''/>
                        </div>
                    </div>
                    <div>
                        <Slider min={0} max={100} defaultValue={bgMusic.volume} onAfterChange={(value) => this.onHandleAfterChange(value)}/>
                    </div>
                </Fragment>}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, authentication: {user}} = state;
    return {
        settingReducer, user
    }
};
const mapDispatchToProps = (dispatch) => ({
    setBgMusic: (setting) => dispatch(settingActions.setBgMusic(setting)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SoundSetting)