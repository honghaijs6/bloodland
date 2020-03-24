import React, {PureComponent} from 'react';
import {Modal} from 'reactstrap';
import {closeButtonImage, earthImage, navWalletImage, sendButtonImage, walletIcon} from "../asset";
import TranslateLanguage from "../../../general/TranslateComponent"
import ClickNHold from "react-click-n-hold"
import {InputText} from "primereact/inputtext";
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {connect} from 'react-redux'
import {alertPopup} from "../component/AlertPopup";

let time = 0;
const timeToAction = 100;

class TransferScreenRender extends PureComponent {
    state = {
        goldBloodValue: 0
    };
    onGoldBloodChange = (e) => {
        const {wallet: {info: {goldBlood}}} = this.props;
        const bloodTransfer = parseInt(e.target.value ? e.target.value : 0, 10);
        this.setState({
            goldBloodValue: bloodTransfer <= goldBlood ? bloodTransfer : parseInt(goldBlood , 10)
        })
    };
    onRemoveGoldBloodValue = () => {
        const {goldBloodValue} = this.state;
        const bloodTransfer = parseInt(goldBloodValue ? goldBloodValue : 0, 10);
        this.setState({
            goldBloodValue: bloodTransfer >= 1 ? bloodTransfer - 1 : 0
        })
    };
    onHoldRemoveGoldBloodValue = () => {
        time = setInterval(this.countDownRemove, timeToAction)
    };
    countDownRemove = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds === 0 ? 0 : this.state.seconds - 1;
        this.state.seconds > 0 && this.setState({
            seconds
        });
        const {goldBloodValue} = this.state;
        const bloodTransfer = parseInt(goldBloodValue ? goldBloodValue : 0, 10);
        seconds === 0 && this.setState({
            goldBloodValue: bloodTransfer >= 100 ? bloodTransfer - 100 : 0
        })
    };
    onAddGoldBloodValue = () => {
        const {goldBloodValue} = this.state;
        const {wallet: {info: {goldBlood}}} = this.props;
        const bloodTransfer = parseInt(goldBloodValue ? goldBloodValue : 0, 10);
        this.setState({
            goldBloodValue: bloodTransfer + 1 <= goldBlood ? bloodTransfer + 1 : parseInt(goldBlood , 10)
        })
    };
    onHoldAddGoldBloodValue = () => {
        time = setInterval(this.countDownAdd, timeToAction)
    };
    countDownAdd = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds === 0 ? 0 : this.state.seconds - 1;
        this.state.seconds > 0 && this.setState({
            seconds
        });
        const {goldBloodValue} = this.state;
        const {wallet: {info: {goldBlood}}} = this.props;
        const bloodTransfer = parseInt(goldBloodValue ? goldBloodValue : 0, 10);
        seconds === 0 && this.setState({
            goldBloodValue: bloodTransfer + 100 <= goldBlood ? bloodTransfer + 100 : parseInt(goldBlood , 10)
        });
    };
    clickNHold = (type) => {
        type === 'remove' ?
            this.onHoldRemoveGoldBloodValue() : this.onHoldAddGoldBloodValue()
    };
    breakInvoke = () => {
        //this.startTimer();
        clearInterval(time);
        time = 0;
        this.setState({
            seconds: 1
        });
    };
    onHandleCheckGoldBlood = (e) => {
        const {goldBloodValue} = this.state;
        const {wallet: {info: {goldBlood}}} = this.props;
        e.preventDefault();
        if(goldBloodValue < 100){
            this.props.onHandleShowPopup({status: alertPopup.getNotEnoughLimitValueAlert })
        }else if(goldBloodValue <= goldBlood){
            this.props.onHandleShowPopup({status: alertPopup.getTransferConfirmAlert , goldBloodValue })
        }

    };

    render() {
        const {modal, handleHidePopup, wallet: {info: {goldBlood}}} = this.props;
        const {goldBloodValue} = this.state;
        return (
            <Modal isOpen={modal} backdrop='static' className={`custom-modal modal--blood-transfer`}>
                <div className='custom-modal-header'>
                    <img src={navWalletImage} alt='' style={{height: '2rem'}} className='no-brightness'/>
                    <TranslateLanguage direct={'menuTab.wallet.bloodToWallet'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => handleHidePopup()}/>
                </div>

                <div className='custom-modal-body'>
                    <div className='transfer-blood-grid-container'>
                        <div className='description-row'> <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.information'}/> </div>
                        
                        <div className='title-col '>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.bloodWillSend'}/>
                        </div>
                        <div className='edit-col '>
                             <ClickNHold time={0.5}
                                        onStart={this.onRemoveGoldBloodValue} // Start callback
                                        onClickNHold={() => this.clickNHold('remove')} //Timeout callback
                                        onEnd={this.breakInvoke}>
                                    <span className="lnr lnr-circle-minus num-ctrl" />
                            </ClickNHold>

                            <InputText type="text" keyfilter="pint" value={goldBloodValue}
                                        onChange={(e) => this.onGoldBloodChange(e)}/>

                            <ClickNHold time={0.5} // Time to keep pressing. Default is 2
                                            onStart={this.onAddGoldBloodValue} // Start callback
                                            onClickNHold={() => this.clickNHold('add')} //Timeout callback
                                            onEnd={this.breakInvoke}>
                                    <span className="lnr lnr-plus-circle num-ctrl" />
                            </ClickNHold>

                            <img src={earthImage} alt=''/>
                        </div>
                    </div>
                    
                    <div className='transfer-blood-grid-container'>    
                        <div className='title-col top-border'>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.myBlood'}/>
                        </div>
                        <div className='edit-col top-border'>
                            {goldBlood ? (parseFloat(goldBlood).toLocaleString()).slice(0, 15) : 0} <img src={earthImage} alt=''/>
                        </div>

                        <div className='title-col'>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.webBloodToSend'}/>
                        </div>
                        <div className='edit-col'>
                            {(parseFloat(goldBloodValue).toLocaleString()).slice(0, 15)} <img src={walletIcon} alt=''/>
                        </div>

                        <div className='title-col'>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.bloodBalance'}/>
                        </div>
                        <div className='edit-col'>
                            {goldBlood && (parseFloat(goldBlood - goldBloodValue).toLocaleString()).slice(0, 15)} <img src={earthImage} alt=''/>
                        </div>
                    </div>
                </div>

                <div className='custom-modal-footer-action-group'>
                    <button onClick={(e) => this.onHandleCheckGoldBlood(e)}>
                        <img src={sendButtonImage} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.confirm'}/>
                        </div>
                    </button>

                    <button onClick={() => handleHidePopup()}>
                        <img src={closeButtonImage} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.wallet.bloodToWallet.cancel'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, wallet, users: {getWithdrawApi},settingReducer} = state;
    return {
        user, wallet, getWithdrawApi,
        settingReducer
    };
};
const mapDispatchToProps = (dispatch) => ({
    withdrawApi: (param) => dispatch(userActions.getWithdraw(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(TransferScreenRender)