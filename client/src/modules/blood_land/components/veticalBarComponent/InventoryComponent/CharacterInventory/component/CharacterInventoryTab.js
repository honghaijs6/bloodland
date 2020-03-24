import React , {Component} from 'react';
import TranslateLanguage from "../../../../general/TranslateComponent";
import Tooltip from './../../../../general/Tooltip';
const inventoryCharacterTab = {
  onLand: 'onLand',
  offLand: 'offLand'
};
class CharacterInventoryTab extends Component{
    state = {
        currentTab: inventoryCharacterTab.offLand
    };

    onHandleChangeTab = (selectedTab) => {
        this.props.onHandleChangeTab(selectedTab);
        this.setState({
            currentTab: selectedTab
        });
    };

    render() {
        const {currentTab} = this.state;
        return (
            <div className="tab-inventory-container">
                <div className={`tab-inventory ${currentTab === inventoryCharacterTab.onLand && 'active'}`}
                     onClick={() => this.onHandleChangeTab(inventoryCharacterTab.onLand)}>
                    <TranslateLanguage direct={'menuTab.characters.onLand'}/>
                    <Tooltip descLang={'menuTab.characters.onLand.toolTip.desc'} />
                </div>
                <div className={`tab-inventory ${currentTab === inventoryCharacterTab.offLand && 'active'}`}
                     onClick={() => this.onHandleChangeTab(inventoryCharacterTab.offLand)}>
                    <TranslateLanguage direct={'menuTab.characters.offLand'}/>
                    <Tooltip descLang={'menuTab.characters.offLand.toolTip.desc'} />
                </div>
            </div>
        );
    }
}
export default CharacterInventoryTab