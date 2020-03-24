import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import common from '../../../../../helpers/Common';
import TranslateLanguage from "../../general/TranslateComponent";

class ProfileScreen extends Component {

    componentDidMount() {
        const {user: {wToken}} = this.props;
        this.props.getWalletInfo({wToken});
    }

    render() {
        const {user, wallet} = this.props;
        const oriGoldBlood = wallet && wallet.info && wallet.info.goldBlood ? parseFloat(wallet.info.goldBlood) : 0;
        return (
            <li className='menu-level-2 info clear-hover'>
                {typeof user.wId !== "undefined" && (user.wId) && 
                <div className='user-info'>
                    <div className='lable-info'>
                        <TranslateLanguage direct={'menuTab.user.information.id'}/>
                    </div>
                    <div className='info-user'>{user.wId}</div>
                </div>}
                {typeof user.lastName !== "undefined" && (user.lastName) && 
                <div className='user-info'>
                    <div className='lable-info'>
                        <TranslateLanguage direct={'menuTab.user.information.name'}/>
                    </div>
                    <div className='info-user'>{user.lastName}</div>
                </div>}
                {typeof user.email !== "undefined" && (user.email) &&
                <div className='user-info'>
                    <div className='lable-info'>
                        <TranslateLanguage direct={'menuTab.user.information.email'}/>
                    </div>
                    <div className='info-user'>{user.email}</div>
                </div>}
                <div className='user-info'>
                    <div className='lable-info'>
                        <TranslateLanguage direct={'menuTab.user.information.blood'}/>
                    </div>
                    <div className='info-user'>{common.convertLocaleStringToSpecialString(oriGoldBlood, 6)}</div>
                </div>
            </li>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, wallet} = state;
    return {
        user, wallet
    };
}

const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
export default connectedPage;
