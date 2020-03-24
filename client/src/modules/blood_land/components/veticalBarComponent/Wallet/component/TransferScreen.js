import React, {Fragment, PureComponent} from 'react';
import TransferScreenRender from "./TransferScreenRender";
import {alertPopup} from "../component/AlertPopup";
import {getTransferConfirmAlert, getTransferSuccessAlert, getTransferUnSuccessAlert,getNotEnoughLimitValueAlert} from "./AlertPopup";
import {connect} from 'react-redux'
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {loadingPopup} from "../../../gameMapComponent/component/GameMapAlert";
import {translate} from "react-i18next";


class TransferScreen extends PureComponent {
    state = {
        currentPopup: alertPopup.noPopup
    };

    onHandleShowPopup = (param) => {
        if (param) {
            const {status, goldBloodValue} = param;
            this.setState({
                currentPopup: status,
                goldBloodValue
            })
        }
    };

    onHandleClosePopup = () => {
        this.setState({
            currentPopup: alertPopup.noPopup
        })
    };

    onHandlePopupRender = () => {
        const {currentPopup, goldBloodValue} = this.state;
        const {handleHidePopup, getWithdraw, user} = this.props;
        const getTransferConfirmAlertStatus = currentPopup === alertPopup.getTransferConfirmAlert;
        const loadingPopupStatus = currentPopup === alertPopup.loadingPopup;
        const getTransferSuccessAlertStatus = currentPopup === alertPopup.getTransferSuccessAlert;
        const getTransferUnSuccessAlertStatus = currentPopup === alertPopup.getTransferUnSuccessAlert;
        const getNotEnoughLimitValueAlertStatus = currentPopup === alertPopup.getNotEnoughLimitValueAlert;

        return (
            <Fragment>
                {getTransferConfirmAlertStatus && getTransferConfirmAlert(getTransferConfirmAlertStatus, this.onHandleClosePopup, goldBloodValue, getWithdraw, user, this.onHandleShowPopup)}
                {loadingPopupStatus && loadingPopup(loadingPopupStatus)}
                {getTransferSuccessAlertStatus && getTransferSuccessAlert(getTransferSuccessAlertStatus, handleHidePopup)}
                {getTransferUnSuccessAlertStatus && getTransferUnSuccessAlert(getTransferUnSuccessAlertStatus, handleHidePopup)}
                {getNotEnoughLimitValueAlertStatus && getNotEnoughLimitValueAlert(getNotEnoughLimitValueAlertStatus, this.onHandleClosePopup)}
            </Fragment>
        )
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {getWithdrawApi} = this.props;
        if(prevProps.getWithdrawApi !== getWithdrawApi) {
            if (getWithdrawApi) {
                const {successes} = getWithdrawApi;
                setTimeout(() => {
                    if (successes) {
                        this.onHandleShowPopup({status: alertPopup.getTransferSuccessAlert})
                    } else {
                        this.onHandleShowPopup({status: alertPopup.getTransferUnSuccessAlert})
                    }
                }, 1000)
            }
        }
    }

    render() {
        const {modal, handleHidePopup} = this.props;
        // console.log('modal',modal);
        return (
            <Fragment>
                <TransferScreenRender modal={modal} handleHidePopup={handleHidePopup} onHandleShowPopup={this.onHandleShowPopup}/>
                {this.onHandlePopupRender()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, wallet, users: {getWithdrawApi}} = state;
    return {
        user, wallet, getWithdrawApi
    };
};
const mapDispatchToProps = (dispatch) => ({
    getWithdraw: (param) => dispatch(userActions.getWithdraw(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(TransferScreen))