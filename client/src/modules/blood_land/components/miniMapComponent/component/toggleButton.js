import React, {Component, Fragment} from "react";
import {loadingImage} from "../../general/System";
import TranslateLanguage from '../../general/TranslateComponent'


const toggleImage = loadingImage('/images/game-ui/minimap-earth.svg');

class ToggleButton extends Component {
    state = {
        currentTab: 1
    };



    onHandleTabChangeMiniMap = (currentTab) => {
        const {handleCurrentTab} = this.props;
        this.setState({
            currentTab: currentTab === 1 ? 1 : 2
        });
        handleCurrentTab(currentTab === 1 ? 1 : 2)

    };

    render() {
        const {handleToggleOnClick, toggle} = this.props;
        const {currentTab} = this.state;
        return (
            <Fragment>
                <div className={`toggle-btn ${toggle && 'open'}`} onClick={() => handleToggleOnClick()}>
                    <img style={{width: '29px'}} alt='' src={toggleImage}/>
                </div>
                {toggle && <div className='tab-container' style={{width: currentTab === 2 && '196px'}}>

                    <div className={`first-tab ${currentTab === 1 && 'active'}`}
                         onClick={() => this.onHandleTabChangeMiniMap(1)}>
                        <TranslateLanguage direct={'mapTab.map1'}/>
                    </div>


                    <div className={`second-tab ${currentTab === 2 && 'active'}`}
                         onClick={() => this.onHandleTabChangeMiniMap(2)}>
                        <TranslateLanguage direct={'mapTab.map2'}/>
                    </div>
                </div>}
            </Fragment>

        )
    }
}

export default ToggleButton