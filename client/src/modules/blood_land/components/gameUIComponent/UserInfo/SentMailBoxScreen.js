import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import ToolTip from '../../general/Tooltip'
import MessageBox from './../../general/MessageBox';
import moment from "moment";
import { FaEnvelope } from 'react-icons/fa';

const screen = {
    list: 'list',
    detail: 'detail'
};

class SentMailBoxScreen extends Component {
    state = {
        currentScreen: screen.list,
        mailReceiver: null,
        mailDetail: null,
        checkAll:false
    };

    loadData() {
        const {user: {_id}} = this.props;
        this.props.getAllMails(_id);
    }

    componentWillMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const {sentList,deleteMailStatus} = this.props;
        if(sentList !== prevProps.sentList){
            this.setState({sentList , checkAll: false});
        }
        if(deleteMailStatus !== prevProps.deleteMailStatus){
            if(typeof deleteMailStatus !== "undefined"){
                if(deleteMailStatus){
                    this.handleShowPopup(this.popupScreen.deleteSuccess);
                }
                else{

                }
            }
        }
    }

    doCheckAllAndUpdateLists = () => {
        let {sentList, checkAll} = this.state;
        sentList = sentList.map((f, i) => {
            f.checked = !checkAll
            return f;
        });

        this.setState({
            sentList: sentList,
            checkAll: !checkAll
        });
    };

    doCheckAndUpdateLists = (item) => {
        let {sentList} = this.state;
        sentList = sentList.map((m, i) => {

            if (item === m.mail._id)
                m.checked = !m.checked;
            return m;
        });
        this.setState({
            sentList: sentList,
            checkAll: sentList.filter(i=>i.checked).length === this.state.sentList.length
        });
    };

    showDetailMail = (_id, title, sendName, content, screen) => {
        this.setState({
            title, sendName, content,
            currentScreen: screen,
            sentMailDetailId: _id
        });
    };

    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen,
        })
    };

    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modal: true,
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false
        });
    };

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='mail-box-warning-screen'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.user.email.sent.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.sent.back'}/>
                        </div>
                        <ToolTip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    getDefaultScreen = () => {
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab1/nav2-2.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.user.email.sent'}/>
                    </div>
                </div>
                {screen.list === this.state.currentScreen && this.getSentList()}
                {screen.detail === this.state.currentScreen && this.getDetailView()}
            </Fragment>
        );
    };

    render() {
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
            </Fragment>
        );
    }

    deleteMails = () =>{
        const {sentList} = this.state;
        const checkStatus = sentList && sentList.some(({checked}) => checked);
        this.handleShowPopup(checkStatus ? this.popupScreen.deleteConfirm : this.popupScreen.noSelection);
    };
    
    getLoadingView = () =>{
        return <div className='mail-box-warning-screen'>
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
    };

    renderMails = () =>{
        const {sentList, checkAll} = this.state;
        const checkAllClass = classNames({
            'check-box':true,
            'checked':checkAll
        });
        return (
            <div className='user-mail-container'>
                <div className='select-all' onClick={() => this.doCheckAllAndUpdateLists()}>
                    <div className={checkAllClass}></div>
                    <TranslateLanguage direct={'menuTab.user.email.sent.selectAll'}/>
                </div>
                <div className='user-mail-grid-container'>
                    <table>
                        <tbody>
                            {sentList.length !== 0 && sentList.map(({checked, mail: {_id, title, toName,content, createdDate}}) => {
                                const checkBoxClass = classNames({
                                    'check-box':true,
                                    'checked':checked
                                });
                                
                                const mailItemClass = classNames({
                                    'item-row':true,
                                });
                                const createdDateFormat = moment(createdDate).format('DD/MM/YY');
                                return (
                                    <tr className={mailItemClass} key={_id}>
                                        <td className='user-col'>
                                            <div className={checkBoxClass} onClick={() => this.doCheckAndUpdateLists(_id)} />
                                            <div className='click-able' onClick={() => this.showDetailMail(_id, title, toName, content, screen.detail)}>
                                                <FaEnvelope />
                                                {toName}
                                            </div>
                                        </td>
                                        <td className='mail-col' onClick={() => this.showDetailMail(_id, title, toName, content, screen.detail)}>
                                            {title}
                                        </td>
                                        <td className='date-col' onClick={() => this.showDetailMail(_id, title, toName, content, screen.detail)}>
                                            {createdDateFormat}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.sent.back'}/>
                        </div>
                        <ToolTip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>
                    <button onClick={() => this.deleteMails()}>
                            <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.email.sent.recycle'}/>
                            </div>
                            <ToolTip descLang={'menuTab.user.email.tooltip.recycleButton'}/>
                    </button> 
                </div>
            </div>
        );
    }

    getSentList = () => {
        const {sentList} = this.state;
        return sentList ? sentList.length === 0 ? this.getNoInfoView() : this.renderMails() : this.getLoadingView();
    };

    getDetailView = () => {
        const {title, sendName, content} = this.state;
        return (
            <Fragment>
                <div className='mail-box-ui-screen'>
                    <div className='mail-detail'>
                        <div className='mail-user'>{sendName}</div>
                        <div className='mail-title'>{title}</div>
                        <div className='mail-content' dangerouslySetInnerHTML={{__html: content}}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.handleChangeScreen(screen.list)}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.sent.back'}/>
                        </div>
                        <ToolTip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>
                    <button onClick={() => this.handleShowPopup(this.popupScreen.deleteConfirm)}>
                        <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.sent.recycle'}/>
                        </div>
                        <ToolTip descLang={'menuTab.user.email.tooltip.recycleButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    doDeleteSelectedMails = () => {
        const {sentList, sentMailDetailId} = this.state;
        const {user: {_id}} = this.props;
        let emailIdArr = sentMailDetailId ? [sentMailDetailId] : sentList.map(email => {
            if (email.checked === true) {
                return email.mail._id;
            } else {
                return null;
            }
        }).filter(e => e !== null);
        this.props.deleteSentMail(emailIdArr, _id);
        this.handleHidePopup();
    };

    popupScreen = {
        noPopup: "noPopup",
        deleteConfirm: "deleteConfirm",
        deleteSuccess: "deleteSuccess",
        noSelection:"noSelection"
    };
    
    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.deleteConfirm === this.state.currentPopupScreen && this.getDeleteConfirmAlertPopup()}
                {this.popupScreen.deleteSuccess === this.state.currentPopupScreen && this.getDeleteSuccessAlertPopup()}
                {this.popupScreen.noSelection   === this.state.currentPopupScreen && this.getNoSelectionAlertPopup()}
            </Fragment>
        );
    };
    
    getNoSelectionAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.sentMail.getNoSelectionAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.sentMail.getNoSelectionAlertPopup.body'} />
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getDeleteConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode   = "question"; //question //info //customize
        const yesBtn = () => this.doDeleteSelectedMails();
        const noBtn  = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.sentMail.getDeleteConfirmAlertPopup.header'}/>;
        const body   = <TranslateLanguage direct={'alert.sentMail.getDeleteConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getDeleteSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => {
            this.props.resetStatus();
            this.handleChangeScreen(screen.list);
            this.handleHidePopup();
        };
        const header = <TranslateLanguage direct={'alert.sentMail.getDeleteSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.sentMail.getDeleteSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}

function mapStateToProps(state) {
    const {authentication: {user}, users: {sentList,deleteMailStatus, toggleSendMail}} = state;
    return {
        sentList,
        deleteMailStatus,
        toggleSendMail,
        user
    };
}

const mapDispatchToProps = (dispatch) => ({
    getAllMails: (userId) => dispatch(userActions.getAllMails({userId})),
    deleteSentMail: (emailIdArr, userId) => dispatch(userActions.deleteSentMail({emailIdArr,userId})),
    resetStatus : () => dispatch(userActions.resetStatus())
});
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(SentMailBoxScreen);
export default connectedPage;