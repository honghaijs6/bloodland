import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
// import classNames from 'classnames';
import {bitaminActions} from "../../../../../../store/actions/landActions/bitaminActions";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";
// import Tooltip from './../../../general/Tooltip';
import { Modal } from 'reactstrap';

import ClickNHold from 'react-click-n-hold';
import {InputText} from "primereact/inputtext";
import {alertPopup,
        loadingPopup,
        getExchangeConfirmAlert,        
        getExchangeSuccessAlert,
        getExchangeUnSuccessAlert,
        getNotEnoughLimitValueAlert
    } from './AlertPopup'

const logoUrl =           loadingImage('/images/game-ui/tab11/nav1.svg');
const sendButtonImage =   loadingImage('/images/game-ui/sm-sendblood.svg');
const closeButtonImage =  loadingImage('/images/game-ui/sm-close.svg');
const bitaminImage =      loadingImage('/images/game-ui/bitamin-title.svg');
const earthImage =        loadingImage('/images/game-ui/minimap-earth.svg');

let time = 0;
const timeToAction = 100;

class BitaminExchange extends Component {
    state = {
        currentAlertPopup: alertPopup.noPopup,
        isAlertOpen:false,
        bitaminValue: 0
    };

    componentDidUpdate(prevProps){
        const {exchange} = this.props;
        if(exchange && prevProps.exchange !== exchange){
            setTimeout(() => {
                if(exchange.status){
                    this.handleShowPopup(alertPopup.getExchangeSuccessAlert);
                }
                if(!exchange.status){
                    this.handleShowPopup(alertPopup.getExchangeUnSuccessAlert);
                }
            }, 50);
        }
    }
    
    onBitaminChange = (e) => {
        const {bitamin} = this.props;
        const bitaminExchangeValue = parseInt(e.target.value ? e.target.value : 0, 10);
        this.setState({
            bitaminValue: bitaminExchangeValue <= bitamin ? bitaminExchangeValue : parseInt(bitamin , 10),
            notEnoughLimitValue: false
        })
    };
    onRemovebitaminValue = () => {
        const {bitaminValue} = this.state;
        const bitaminExchangeValue = parseInt(bitaminValue ? bitaminValue : 0, 10);
        this.setState({
            bitaminValue: bitaminExchangeValue >= 1 ? bitaminExchangeValue - 1 : 0,
            notEnoughLimitValue: false
        })
    };
    onHoldRemovebitaminValue = () => {
        time = setInterval(this.countDownRemove, timeToAction)
    };
    countDownRemove = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds === 0 ? 0 : this.state.seconds - 1;
        this.state.seconds > 0 && this.setState({
            seconds
        });
        const {bitaminValue} = this.state;
        const bitaminExchangeValue = parseInt(bitaminValue ? bitaminValue : 0, 10);
        seconds === 0 && this.setState({
            bitaminValue: bitaminExchangeValue >= 100 ? bitaminExchangeValue - 100 : 0,
            notEnoughLimitValue: false
        })
    };
    onAddbitaminValue = () => {
        const {bitaminValue} = this.state;
        const {bitamin} = this.props;
        const bitaminExchangeValue = parseInt(bitaminValue ? bitaminValue : 0, 10);
        this.setState({
            bitaminValue: bitaminExchangeValue + 1 <= bitamin ? bitaminExchangeValue + 1 : parseInt(bitamin , 10),
            notEnoughLimitValue: false
        })
    };
    onHoldAddbitaminValue = () => {
        time = setInterval(this.countDownAdd, timeToAction)
    };
    countDownAdd = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds === 0 ? 0 : this.state.seconds - 1;
        this.state.seconds > 0 && this.setState({
            seconds
        });
        const {bitaminValue} = this.state;
        const {bitamin} = this.props;
        const bitaminExchangeValue = parseInt(bitaminValue ? bitaminValue : 0, 10);
        seconds === 0 && this.setState({
            bitaminValue: bitaminExchangeValue + 100 <= bitamin ? bitaminExchangeValue + 100 : parseInt(bitamin , 10),
            notEnoughLimitValue: false
        });
    };
    clickNHold = (type) => {
        type === 'remove' ?
            this.onHoldRemovebitaminValue() : this.onHoldAddbitaminValue()
    };
    breakInvoke = () => {
        //this.startTimer();
        clearInterval(time);
        time = 0;
        this.setState({
            seconds: 1
        });
    };
    

    confirmExchange = () =>{
        // check before confirm
        const {bitaminValue} = this.state;
        const {bitamin} = this.props;
        if(bitaminValue < 100000){
            return this.handleShowPopup(alertPopup.getNotEnoughLimitValueAlert);
        }
        if(bitaminValue > bitamin){
            return this.handleShowPopup(alertPopup.getNotEnoughLimitValueAlert);
        }

        this.handleShowPopup(alertPopup.getExchangeConfirmAlert);
    }

    exchangeBitamin = () =>{
        const {user} = this.props;
        const {bitaminValue} = this.state;
        if (user) {
            const {wToken} = user;
            this.props.exchangeBitamin({wToken,amountBitamin:bitaminValue});
        }
    }

    getDefaultScreen = () => {
        const {modal,handleHidePopup, bitamin} = this.props;
        const {bitaminValue} = this.state;
        return <Modal isOpen={modal} backdrop="static" className={`custom-modal modal--bitamin`}>
                    <div className='custom-modal-header'>
                        <img src={logoUrl} alt='' style={{height: '2rem'}}/>
                        <TranslateLanguage direct={'bitamin.bitaminExchange'}/>
                        <span className="lnr lnr-cross lnr-custom-close" onClick={() => handleHidePopup()}/>
                    </div>
                    <div className='custom-modal-body'>
                        <div className='exchange-bitamin-grid-container'>
                            <div className='description-row'><TranslateLanguage direct={'bitamin.bitaminExchange.description'}/></div>

                            <div className='title-col '>
                                <TranslateLanguage direct={'bitamin.bitaminExchange.bitaminInputLable'}/>
                            </div>
                            <div className='edit-col '>
                                <ClickNHold time={0.5}
                                                onStart={this.onRemovebitaminValue} // Start callback
                                                onClickNHold={() => this.clickNHold('remove')} //Timeout callback
                                                onEnd={this.breakInvoke}>
                                        <span className="lnr lnr-circle-minus num-ctrl"/>
                                </ClickNHold>

                                <InputText type="text" keyfilter="pint" value={bitaminValue}
                                            onChange={(e) => this.onBitaminChange(e)}/>

                                <ClickNHold time={0.5} // Time to keep pressing. Default is 2
                                            onStart={this.onAddbitaminValue} // Start callback
                                            onClickNHold={() => this.clickNHold('add')} //Timeout callback
                                            onEnd={this.breakInvoke}>
                                    <span className="lnr lnr-plus-circle num-ctrl"/>
                                </ClickNHold>
                                <img src={bitaminImage} alt=''/>
                            </div>
                        </div>
                        <div className='exchange-bitamin-grid-container'>
                            <div className='title-col top-border'> 
                                <TranslateLanguage direct={'bitamin.bitaminExchange.myBitaminLabel'}/>
                            </div>
                            <div className='edit-col top-border'>
                                {bitamin ? (parseFloat(bitamin).toLocaleString()).slice(0, 15) : 0} <img src={bitaminImage} alt=''/>
                            </div>

                            <div className='title-col'>
                                <TranslateLanguage direct={'bitamin.bitaminExchange.bloodCoinConvertLabel'}/>
                            </div>
                            <div className='edit-col'>
                                {(parseFloat(bitaminValue).toLocaleString()).slice(0, 15)} <img src={earthImage} alt=''/>
                            </div>

                            <div className='title-col'>
                                <TranslateLanguage direct={'bitamin.bitaminExchange.balanceBitaminLabel'}/>
                            </div>
                            <div className='edit-col'>
                                {bitamin && (parseFloat(bitamin - bitaminValue).toLocaleString()).slice(0, 15)} <img src={bitaminImage} alt=''/>
                            </div>

                        </div>
                    </div>
                    <div className='custom-modal-footer-action-group'>
                        <button onClick={() => this.confirmExchange()}>
                            <img src={sendButtonImage} alt=''/>
                            <div>
                                <TranslateLanguage direct={'bitamin.bitaminExchange.exchangeBtn'}/>
                            </div>
                        </button>

                        <button onClick={() => handleHidePopup()}>
                            <img src={closeButtonImage} alt=''/>
                            <div>
                                <TranslateLanguage direct={'bitamin.bitaminExchange.cancelBtn'}/>
                            </div>
                        </button>
                    </div>
            </Modal>;
    };

    render(){
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {this.getModalPopup()}
            </Fragment>
        )
    }

    //handle for popup
    handleShowPopup = (type) => {
        this.setState({
            currentAlertPopup: type,
            isAlertOpen: true
        })
    };

    handleHidePopUp = () => {
        this.setState({
            currentAlertPopup: alertPopup.noPopup,
            isAlertOpen: false
        })
    };
    
    handleHidePopUpAndResetStatus = () => {
        this.props.resetStatus();
        const {user,handleHidePopup} = this.props;
        if (user) {
            const {wToken} = user;
            this.props.getMyBitamin({wToken});
        }
        this.handleHidePopUp();
        handleHidePopup();
    };

    getModalPopup = () => {
        const {currentAlertPopup, isAlertOpen} = this.state;
        // console.log(currentAlertPopup, isAlertOpen)
        return (
            <Fragment>
               { alertPopup.loadingPopup === currentAlertPopup              && loadingPopup(isAlertOpen) }
               { alertPopup.getExchangeConfirmAlert === currentAlertPopup   && getExchangeConfirmAlert(isAlertOpen,this.handleHidePopUp,this.exchangeBitamin) }
               { alertPopup.getExchangeSuccessAlert === currentAlertPopup   && getExchangeSuccessAlert(isAlertOpen,this.handleHidePopUpAndResetStatus) }
               { alertPopup.getExchangeUnSuccessAlert === currentAlertPopup && getExchangeUnSuccessAlert(isAlertOpen,this.handleHidePopUp) }
               { alertPopup.getNotEnoughLimitValueAlert === currentAlertPopup && getNotEnoughLimitValueAlert(isAlertOpen,this.handleHidePopUp) }
            </Fragment>
        );
    };

}

function mapStateToProps(state) {
    const {authentication: {user},bitaminReducer:{exchange}} = state;
    // console.log('bitaminReducer',bitaminReducer);
    return {
        user,exchange
    };
}

const mapDispatchToProps = (dispatch) => ({
    exchangeBitamin: (param) => dispatch(bitaminActions.exchangeBitamin(param)),
    getMyBitamin: (param) => dispatch(bitaminActions.getMyBitamin(param)),
    resetStatus: () => dispatch(bitaminActions.resetStatus())
});

const connectedPage = connect(mapStateToProps,mapDispatchToProps)(BitaminExchange);
export default connectedPage;
