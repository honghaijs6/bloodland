import React, {PureComponent, Fragment} from 'react';
import {connect} from 'react-redux';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import common from '../../../../../../helpers/Common';
import TranslateLanguage from "../../../general/TranslateComponent";


const myWalletInformation = [
    {titleInfo: <TranslateLanguage direct={'menuTab.shop.myBlood'}/>, type: 'total'},
    {titleInfo: <TranslateLanguage direct={'menuTab.shop.purchaseBlood'}/>, type: 'used'},
    {titleInfo: <TranslateLanguage direct={'menuTab.shop.remainBlood'}/>, type: 'rest'}
];

class ShopWalletInfoComponent extends PureComponent {
    componentDidMount() {
        const {user:{wToken}} = this.props;
        this.props.getWalletInfo({wToken})
    }
    //function calculate blood
    onCalculateBlood = (walletInfo) => {
        const {quantity , itemSelected} = this.props;
        let totalBloodBuy = 0;
        const originBlood = walletInfo && walletInfo.goldBlood ? walletInfo.goldBlood : 0;
        const price = itemSelected && itemSelected.price ? itemSelected.price : 0;
        let bloodLeft = originBlood;
        if((quantity || quantity === 0) && (price || price === 0)){
            totalBloodBuy = quantity * price;
            bloodLeft = parseFloat(originBlood - totalBloodBuy);
        }
        return {
            totalBloodBuy,bloodLeft,originBlood
        }
    };

    render() {
        const {wallet,onHandleGetWalletInformation} = this.props;
        if(!wallet){
            return <div>Loading</div>
        }else{
            const {info} = wallet;
            const calculateBlood = this.onCalculateBlood(info);
            const { totalBloodBuy,bloodLeft,originBlood} = calculateBlood;
            onHandleGetWalletInformation(bloodLeft);
            return(
                <div className="my-wallet-grid-container">
                    {myWalletInformation.map((item, index) => {
                        const {titleInfo , type} = item;
                        return (
                            <Fragment key={index}>
                                <div>{titleInfo}</div>
                                <div> 
                                    {type === 'used' ? -(totalBloodBuy) : 
                                    common.convertLocaleStringToSpecialString(type === 'total' ? 
                                    originBlood : bloodLeft , 12)}
                                </div>
                                <div>
                                    Blood
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            )
        }

    }
}

const mapStateToProps = (state) => {
    const {wallet, authentication: {user}} = state;
    return {
        wallet, user
    }
};
const mapDispatchToProps = (dispatch) => ({
    getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(ShopWalletInfoComponent)