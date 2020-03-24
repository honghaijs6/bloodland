import React from 'react';
import SoundSetting from './component/SoundSetting'
import LandSetting from "./component/LandSetting";
import LanguageSetting from "./component/LanguageSetting";

class SettingScreen extends React.Component {

    render() {
        return (
            <div style={{padding: '0px 15px 0px 15px'}}>
                <div className='setting'>
                    <SoundSetting/>
                    <LandSetting/>
                    <LanguageSetting/>
                </div>
            </div>
        );
    }
}

export default SettingScreen;
