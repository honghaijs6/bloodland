import React, {Fragment, PureComponent} from "react"
import {Modal} from 'reactstrap';
import TranslateLanguage from "../../../general/TranslateComponent";
import classNames from 'classnames';
import {bitaminActions} from "../../../../../../store/actions/landActions/bitaminActions";
import {connect} from 'react-redux'
import {loadingImage} from "../../../general/System";
import BitaminHistoryConvert from "./bitaminHistoryComponent/bitaminHistoryConvert";
import BitaminHistoryUse from "./bitaminHistoryComponent/bitaminHistoryUse";
import BitaminHistoryReceive from "./bitaminHistoryComponent/bitaminHistoryReceive";

const bitamin_history = [
    {screen: 'RECEIVE', name: 'receiveHistory'},
    {screen: 'USE', name: 'usageHistory'},
    {screen: 'CONVERT', name: 'exchangeHistory'},
];


class BitaminHistory extends PureComponent {
    state = {
        currentTab: 'RECEIVE',
        offsetNumber: 0
    };
    logoUrl = loadingImage('/images/game-ui/tab11/nav2.svg');
    closeButtonImage = loadingImage('/images/game-ui/sm-close.svg');
    onHandleChangeTab = (tab) => {
        const {user: {_id}} = this.props;
        const {offsetNumber} = this.state;
        this.props.getBitaminHistory({userId: _id, category: tab, offsetNumber});
        this.setState({
            currentTab: tab
        })
    };

    componentDidMount() {
        const {user: {_id}} = this.props;
        const {offsetNumber, currentTab} = this.state;
        this.props.getBitaminHistory({userId: _id, category: currentTab, offsetNumber});
    }

    loading = () =>{
        return (
            <div className='bitamin-history-no-records'>
                <div className='screen-loading'>
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
            </div>
        )
    }
    render() {
        const {modal, handleHidePopup, historyReceive , historyUse , historyConvert} = this.props;
        const {currentTab} = this.state;
        return (
            <Modal isOpen={modal} backdrop="static" className={`custom-modal modal--bitamin-history`}>
                <div className='custom-modal-header'>
                    <img src={this.logoUrl} alt='' style={{height: '2rem'}}/>
                    <TranslateLanguage direct={'bitamin.bitaminHistory'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => handleHidePopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='bitamin-history-tabs'>
                        <div className='tabs-wrapper'>
                            {bitamin_history.map((value, i) => {
                                const {screen, name} = value;
                                const tabItem = classNames({
                                    'tab-item': true,
                                    'active': currentTab === screen
                                });
                                return (
                                    <div className={tabItem} key={i} onClick={() => this.onHandleChangeTab(screen)}>
                                        <TranslateLanguage direct={`bitamin.bitaminHistory.${name}`}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='bitamin-history-body'>
                        {currentTab === 'RECEIVE' && <BitaminHistoryReceive history={historyReceive}/>}
                        {currentTab === 'USE' &&  <BitaminHistoryUse history={historyUse}/> }
                        {currentTab === 'CONVERT' && <BitaminHistoryConvert history={historyConvert}/>}
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => handleHidePopup()}>
                        <img src={this.closeButtonImage} alt=''/>
                        <div>
                            <TranslateLanguage direct={'bitamin.bitaminHistory.cancelBtn'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, bitaminReducer: {historyReceive, historyUse , historyConvert}} = state;
    return {user, historyReceive , historyUse , historyConvert}
};

const mapDispatchToProps = (dispatch) => ({
    getBitaminHistory: (param) => dispatch(bitaminActions.getBitaminHistory(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(BitaminHistory)