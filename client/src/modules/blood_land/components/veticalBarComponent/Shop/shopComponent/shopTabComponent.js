import React, {Fragment, PureComponent} from 'react'
import ShopCharacter from "./shopListComponent/characterListComponent";
import {shopsActions} from "../../../../../../store/actions/gameActions/shopsActions";
import {connect} from 'react-redux'
import ItemCharacter from "./shopListComponent/itemListComponent";
import GiftList from "./shopListComponent/giftListComponent";
import TranslateLanguage from "../../../general/TranslateComponent";

const tabScreen = {
    characterList: 1,
    itemList: 2,
    giftList: 3,
};
const tabName = [
    {name: <TranslateLanguage direct={'menuTab.shop.characters'}/>, index: 1},
    {name: <TranslateLanguage direct={'menuTab.shop.items'}/>, index: 2},
    {name: <TranslateLanguage direct={'menuTab.shop.randomBox'}/>, index: 3},
];


class ShopTabComponent extends PureComponent {
    state = {
        currentTabScreen: tabScreen.characterList
    };
    onHandleTabChange = (item) => {
        const {index} = item;
        switch (index) {
            case 1:
                return this.setState({
                    currentTabScreen: tabScreen.characterList
                });
            case 2:
                return this.setState({
                    currentTabScreen: tabScreen.itemList
                });
            case 3:
                return this.setState({
                    currentTabScreen: tabScreen.giftList
                });
            default:
                break;
        }
    };

    shopTabRender = () => {
        const {currentTabScreen} = this.state;
        return (
            tabName.map((item, index) => {
                return (
                    <div className={`type-tab ${currentTabScreen === item.index && 'selected'}`}
                         onClick={() => this.onHandleTabChange(item)} key={index}>
                        {item.name}
                    </div>
                )
            })
        )
    };

    shopTabItemRender = (currentTabScreen, shops, shopsRandomBox) => {
        const {onHandleObjectSelected} = this.props;
        const characterList =  shops.filter(s => s.category === 'CHARACTER' || s.category === 'TREE');
        const itemList = shops.filter(s => s.category === 'ITEM');
        switch (currentTabScreen) {
            case 1:
                return <ShopCharacter characterList={characterList} onHandleObjectSelected={onHandleObjectSelected}/>;
            case 2:
                return <ItemCharacter itemList={itemList} onHandleObjectSelected={onHandleObjectSelected}/>;
            case 3:
                return <GiftList giftList={shopsRandomBox} onHandleObjectSelected={onHandleObjectSelected}/>;
            default:
                break;
        }
    };

    componentDidMount() {
        this.props.getRandomBoxShop();
    }

    loading = () => {
        return (
            <div className='shop-loading'>
                <div className="lds-roller">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        )
    };

    render() {
        const {currentTabScreen} = this.state;
        const {shops, shopsRandomBox} = this.props;
        if (!shops || !shopsRandomBox) {
            return this.loading();
        } else {
            return (
                <Fragment>
                    <div className='shop-tab'>
                        {this.shopTabRender()}
                    </div>
                    {this.shopTabItemRender(currentTabScreen, shops, shopsRandomBox)}
                    {/*{currentTabScreen === tabScreen.characterList && <CharacterListComponent selectedItem={selectedItem} onClickCurrentItem={onClickCurrentItem}/>}*/}
                </Fragment>

            )
        }

    }
}

const mapStateToProps = (state) => {
    const {shopsReducer: {shops, shopsRandomBox}} = state;
    return {
        shops,
        shopsRandomBox
    }
};
const mapDispatchToProps = (dispatch) => ({
    getRandomBoxShop: () => dispatch(shopsActions.getRandomBoxShop())
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopTabComponent)
