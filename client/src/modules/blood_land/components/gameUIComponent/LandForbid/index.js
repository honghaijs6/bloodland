import React,{Fragment,Component}  from 'react';
import connect from "react-redux/es/connect/connect";
import LandManagement from './LandManagement';
import LandSale from './LandSale';
import GameUICommon from '../Common/IdentityCard';
import AdminLandPurchase from './AdminLandPurchase';
import {loadingImage} from "../../general/System";
class MyLands extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            currentScreen: this.screen.default,
            selectedTiles: [],
        };
    }

    screen = {
        default: 0,
        landManagement: 1,
        landSale:2,
    };

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    getScreenByValue = (value) =>{
        switch (value) {
            case this.screen.landManagement:
                return <LandManagement PREVIOUS_SCREEN={this.screen}  handleChangeScreen={this.handleChangeScreen} handleShowPopup={this.props.handleShowPopup} popupScreen={this.props.popupScreen} />;
            case this.screen.landSale:
                return <LandSale handleChangeScreen={this.handleChangeScreen} />;
            default:
                return '';
        }
    };

    getDefaultScreen = () => {
        return (
            <ul className='function-menu'>
                        <GameUICommon />
                        <li onClick={() => this.handleChangeScreen(this.screen.landManagement)}>
                            <img src={loadingImage('/images/game-ui/tab2/nav1.svg')} alt='' />
                            <div>대법원의 조언</div>
                        </li>
                        {this.props.user.role === 'manager' ? <AdminLandPurchase selectedTiles={this.props.map.selected} mode={"MAIN"} /> : ""}
            </ul>
        );
    };

    render() {
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen ? this.getDefaultScreen() : ''}
                {this.screen.landManagement === this.state.currentScreen ? this.getScreenByValue(this.screen.landManagement) : ''}
                {this.screen.landSale === this.state.currentScreen ? this.getScreenByValue(this.screen.landSale) : ''}
            </Fragment>
        );
    }

}

const mapStateToProps = (state) => {
    const { authentication: {user},map } = state;
    return {
        user,
        map,
    };
};

const connectedPage = connect(mapStateToProps,null)(MyLands);
export default (connectedPage);
