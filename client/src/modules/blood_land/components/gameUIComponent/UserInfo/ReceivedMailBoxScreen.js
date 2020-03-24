import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import classNames from 'classnames';
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import SendMailPopup from '../Common/SendMailPopup';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from './../../general/Tooltip';
import {onHandleTranslate} from '../../../../../helpers/Common';
import {translate} from 'react-i18next';
import {itemTranslateInfo} from './../../general/ItemTranslateAsString';
import {translateContent, translateTitle} from './../../general/EmailTranslate';
import MessageBox from './../../general/MessageBox';

import moment from "moment";
import {FaEnvelope} from 'react-icons/fa';
import {FaEnvelopeOpen} from 'react-icons/fa';
const buttonActive = {
    opacity: 1
}
const buttonDisable  = {
    opacity: 0.5
}
class ReceivedMailBoxScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentScreen: this.screen.list,
            currentPopupScreen: this.popupScreen.noPopup,
            success: true,
            mailReceiver: null,
            mailDetail: null,
            emailContent: '',
            title: '',
            sendMailModal: false,
        };
        this.loadData();
    }

    screen = {
        list: 'list',
        detail: 'detail'
    };

    componentDidUpdate(prevProps) {
        const {receivedList, deleteMailStatus, blockStatus} = this.props;
        if (receivedList !== prevProps.receivedList) {
            this.setState({receivedList, checkAll: false});
            setTimeout(() => {
                this.handleShowPopup(this.popupScreen.noPopup)
            } , 1000)
        }
        if (deleteMailStatus !== prevProps.deleteMailStatus) {
            if (typeof deleteMailStatus !== "undefined") {
                if (deleteMailStatus) {
                    this.handleShowPopup(this.popupScreen.deleteSuccess);
                } else {

                }
            }
        }
        if (blockStatus !== prevProps.blockStatus) {
            if (typeof blockStatus !== "undefined") {
                if (blockStatus) {
                    this.handleShowPopup(this.popupScreen.blockSuccess);
                } else {

                }
            }
        }
    }

    loadData() {
        const {user: {_id}} = this.props;
        this.props.getAllMails(_id);
        this.props.getFriendListBlockList(_id);
    }

    checkAllCheckBox = () => {
        this.setState({
            checkAll: !this.state.checkAll,
            isReadMailsDisabled: false
        });
        this.doCheckAllAndUpdateLists(!this.state.checkAll);
    };

    doCheckAllAndUpdateLists = (checkAll) => {
        let {receivedList} = this.state;
        receivedList = receivedList.map((f, i) => {
            f.checked = checkAll;
            return f;
        });
        this.setState({
            receivedList: receivedList,
        });
    };

    doCheckAndUpdateLists = (item) => {
        let {receivedList} = this.state;
        receivedList = receivedList.map(m => {
            if (item === m.mail._id)
                m.checked = !m.checked;
            return m;
        });
        this.setState({
            receivedList,
            checkAll: receivedList.filter(i => i.checked).length === this.state.receivedList.length,
            isReadMailsDisabled: false
        });
    };

    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen,
        });
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
            modal: false,
            emailContent: null, title: null
        });
    };

    handleShowSendMailPopup = () => {
        this.setState({
            sendMailModal: true,
        });
    };

    handleHideSendMailPopup = () => {
        this.setState({
            sendMailModal: false,
        });
    };

    showDetailMail = (item) => {
        const {user: {_id}} = this.props;
        this.setState({
            mailDetail: item.mail
        });
        this.props.readMail(_id, item.mail._id);
        this.props.haveNewMails(_id);
        this.handleChangeScreen(this.screen.detail);
    };

    deleteMails = () => {
        const {receivedList} = this.state;
        const checkStatus = receivedList && receivedList.some(({checked}) => checked);
        this.handleShowPopup(checkStatus ? this.popupScreen.deleteConfirm : this.popupScreen.noSelection);
    }

    handleBackBtn = () => {
        this.setState({
            checkAll: false,
            emailContent: '',
            title: '',
        });
        this.handleChangeScreen(this.screen.list)
    }

    deleteAMail = (mailDetailId) => {
        this.setState({mailDetailId});
        this.handleShowPopup(this.popupScreen.deleteConfirm);
    }

    readMails = () => {
        const {receivedList} = this.state;
        const {user: {_id}} = this.props;
        const userId = _id;
        const mailIds = receivedList.map(m => {
            if (m.checked) {
                return m.mail._id;
            }
            return null;
        }).filter(m => m);
        if (mailIds.length > 0) {
            this.handleShowPopup(this.popupScreen.loading);
            this.props.readManyMail(userId, mailIds);
            setTimeout(() => {
                this.props.haveNewMails(userId);
            }, 1000);
        }
        this.setState({
            isReadMailsDisabled: true
        })
    }


    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='mail-box-warning-screen'>
                    <div className='warning'>
                        <div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.user.email.receive.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.receive.back'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    getLoadingView = () => {
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
    }

    getMessageItem = (item, key) => {
        const {mail: {title, fromName, status, _id, createdDate}, checked} = item;
        const {t, language, lng} = this.props;
        const translatedTitle = translateTitle(fromName, title, onHandleTranslate, t, language, lng);

        const checkBoxClass = classNames({
            'check-box': true,
            'checked': checked
        });
        const mailItemClass = classNames({
            'read': status && status === 1
        });

        const createdDateFormat = moment(createdDate).format('DD/MM/YY');
        return (
            <tr className={mailItemClass} key={key}>
                <td className='user-col'>
                    <div className={checkBoxClass} onClick={() => this.doCheckAndUpdateLists(_id)}/>
                    <div className='click-able' onClick={() => this.showDetailMail(item)}>
                        {status && status === 1 ? <FaEnvelopeOpen/> : <FaEnvelope/>}
                        {fromName}
                    </div>
                </td>
                <td className='mail-col' onClick={() => this.showDetailMail(item)}>
                    {translatedTitle.substring(0, 13)}...
                </td>
                <td className='date-col' onClick={() => this.showDetailMail(item)}>
                    {createdDateFormat}
                </td>
            </tr>
        );
    };

    renderMailsView = () => {
        const {receivedList, checkAll , isReadMailsDisabled} = this.state;
        const checkAllClass = classNames({
            'check-box': true,
            'checked': checkAll
        });

        const receivedListChecked = receivedList.filter(r => r.checked);
        const receivedListHasRead = receivedListChecked.filter(r => r.mail.status === 0).length !== 0;
        return (
            <div className='user-mail-container'>
                <div className='select-all' onClick={(e) => this.checkAllCheckBox(e)}>
                    <div className={checkAllClass}/>
                    <TranslateLanguage direct={'menuTab.user.email.receive.selectAll'}/>
                    <span> &nbsp;{`(${(Array.isArray(receivedList) && receivedList.length) || 0})`} </span>
                </div>
                <div className='user-mail-grid-container'>
                    <table>
                        <tbody>
                        {receivedList && receivedList.map((item, key) => {
                            return (this.getMessageItem(item, key))
                        })}
                        </tbody>
                    </table>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.user.email.receive.back'}/></div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>
                    <button onClick={() => this.deleteMails()}>
                        <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/></div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.recycleButton'}/>
                    </button>
                    <button onClick={() => receivedListHasRead && this.readMails()} disabled={isReadMailsDisabled}>
                        <div style={!receivedListHasRead ? buttonDisable : buttonActive}>
                            <img src={loadingImage(`/images/game-ui/sm-readmails.svg`)} alt=''/>
                            <div><TranslateLanguage direct={'menuTab.user.email.receive.readAll'}/></div>
                        </div>
                        {receivedListHasRead && <Tooltip descLang={'menuTab.user.email.tooltip.readMailsButton'}/>}
                    </button>
                </div>
            </div>
        );
    }

    getListView = () => {
        const {receivedList} = this.state;
        return receivedList ? receivedList.length === 0 ? this.getNoInfoView() : this.renderMailsView() : this.getLoadingView();
    };

    getDetailView = () => {
        const {mailDetail: {fromName, title, content, _id, fromId, createdDate}} = this.state;
        const {blockFriendList, t, language, lng, shops} = this.props;

        const blockFriendListFilter = blockFriendList.filter(f => f.friend.userId === fromId);

        const {translatedTitle, translatedContent} = translateContent(fromName, title, content, onHandleTranslate, itemTranslateInfo, t, language, lng, shops, createdDate);

        const isBlockUser = blockFriendListFilter.length !== 0;
        return (
            <Fragment>
                <div className='mail-box-ui-screen'>
                    <div className='mail-detail'>
                        <div className='mail-user'>{fromName}</div>
                        <div className='mail-title'>{translatedTitle}</div>
                        <div className='mail-content' dangerouslySetInnerHTML={{__html: translatedContent}}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.handleBackBtn()}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.receive.back'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.backButton'}/>
                    </button>

                    {fromId && !isBlockUser &&
                    <button onClick={() => this.handleShowSendMailPopup()}>
                        <img src='/images/bloodland-ui/btn-edit.png' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.receive.edit'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.replyButton'}/>
                    </button>}

                    <button onClick={() => this.deleteAMail(_id)}>
                        <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.recycleButton'}/>
                    </button>

                    {fromId && !isBlockUser &&
                    <button onClick={() => this.handleShowPopup(this.popupScreen.blockConfirm)}>
                        <img src='/images/bloodland-ui/btn-blockfriend.png' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.receive.blockFriend'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.email.tooltip.blockFriendButton'}/>
                    </button>
                    }
                </div>
            </Fragment>
        );
    };

    getDefaultScreen = () => {
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab1/nav2-1.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.user.email.receive'}/>
                    </div>
                </div>
                {this.screen.list === this.state.currentScreen && this.getListView()}
                {this.screen.detail === this.state.currentScreen && this.getDetailView()}
            </Fragment>
        );
    };

    getSendMailPopup = () => {
        const {sendMailModal, mailDetail} = this.state;
        return sendMailModal && <SendMailPopup friendList={null} sendMailModal={sendMailModal}
                                               toId={mailDetail ? mailDetail.fromId : null}
                                               toName={mailDetail ? mailDetail.fromName : null}
                                               handleShowSendMailPopup={this.handleShowSendMailPopup}
                                               handleHideSendMailPopup={this.handleHideSendMailPopup}
        />
    }

    render() {
        const defaultScreen = this.getDefaultScreen();
        const modalPopup = this.getModalPopup();
        const sendMailPopup = this.getSendMailPopup();
        return (
            <Fragment>
                {defaultScreen}
                {modalPopup}
                {sendMailPopup}
            </Fragment>
        );
    }

    doBlockUser = () => {
        const {mailDetail: {fromId, fromName}} = this.state;
        const {user: {_id}} = this.props;
        const param = {
            userId: _id,
            blockList: [
                {
                    userId: fromId,
                    name: fromName
                }
            ]
        };
        this.props.blockFriend(param);
        this.handleShowPopup(this.popupScreen.blockSuccess)
    };

    doDeleteSelectedMails = () => {
        const {receivedList, mailDetailId} = this.state;
        let emailIdArr = mailDetailId ? [mailDetailId] : receivedList.map(email => {
            if (email.checked === true) {
                return email.mail._id
            } else {
                return null
            }
        }).filter(e => e !== null);
        const {user: {_id}} = this.props;
        this.props.deleteReceivedMail(emailIdArr, _id);
        this.handleHidePopup();
    }


    popupScreen = {
        noPopup: 'noPopup',
        deleteConfirm: 'deleteConfirm',
        blockConfirm: 'blockConfirm',
        deleteSuccess: 'deleteSuccess',
        blockSuccess: 'blockSuccess',
        noSelection: 'noSelection',
        loading: 'loading'
    };

    getModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.deleteConfirm === this.state.currentPopupScreen && this.getDeleteConfirmAlertPopup()}
                {this.popupScreen.blockConfirm === this.state.currentPopupScreen && this.getBlockConfirmAlertPopup()}
                {this.popupScreen.deleteSuccess === this.state.currentPopupScreen && this.getDeleteSuccessAlertPopup()}
                {this.popupScreen.blockSuccess === this.state.currentPopupScreen && this.getBlockSuccessAlertPopup()}
                {this.popupScreen.noSelection === this.state.currentPopupScreen && this.getNoSelectionAlertPopup()}
                {this.popupScreen.loading === this.state.currentPopupScreen && this.loadingPopup(this.popupScreen.loading === this.state.currentPopupScreen)}
            </Fragment>
        );
    };


    confirmDeleteSuccess = () => {
        this.props.resetStatus();
        this.handleChangeScreen(this.screen.list);
        this.handleHidePopup();
        const {user: {_id}} = this.props;
        this.props.haveNewMails(_id);
    }

    loadingPopup = (loadingPopupStatus) => {
        const modal = loadingPopupStatus;
        const sign = "loading"; //blood //success //error //delete //loading
        const header =  <TranslateLanguage direct={'menuTab.randomBox.alert.loadingPopup.header'}/>;
        const body =    <TranslateLanguage direct={'menuTab.randomBox.alert.loadingPopup.body'}/>;
        return <MessageBox modal={modal} sign={sign} header={header} body={body} />
    };
    getNoSelectionAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.receivedMail.getNoSelectionAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.receivedMail.getNoSelectionAlertPopup.body'}/>
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
    };


    getDeleteConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.doDeleteSelectedMails();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.receivedMail.getDeleteConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.receivedMail.getDeleteConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
    }

    getDeleteSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.confirmDeleteSuccess();
        const header = <TranslateLanguage direct={'alert.receivedMail.getDeleteSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.receivedMail.getDeleteSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
    }

    getBlockConfirmAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.doBlockUser();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.receivedMail.getBlockConfirmAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.receivedMail.getBlockConfirmAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
    }

    getBlockSuccessAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => {
            this.props.resetStatus();
            this.handleHidePopup();
        }
        const header = <TranslateLanguage direct={'alert.receivedMail.getBlockSuccessAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.receivedMail.getBlockSuccessAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
    }
}

function mapStateToProps(state) {
    const {authentication, users: {receivedList, blockFriendList, success, deleteMailStatus, blockStatus}, settingReducer: {language}, shopsReducer: {shops}} = state;
    const {user} = authentication;
    return {
        user,
        receivedList,
        blockFriendList,
        success,
        language,
        shops,
        deleteMailStatus,
        blockStatus
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllMails: (userId) => dispatch(userActions.getAllMails({userId: userId})),
        sendMail: (param) => dispatch(userActions.sendMail(param)),
        readMail: (userId, mailId) => dispatch(userActions.readMail({userId, mailId})),
        readManyMail: (userId, mailIds) => dispatch(userActions.readManyMail({userId, mailIds})),
        deleteReceivedMail: (emailIdArr, userId) => dispatch(userActions.deleteReceivedMail({emailIdArr, userId})),
        resetSentStatus: () => dispatch(userActions.resetSentStatus()),
        getFriendListBlockList: (userId) => dispatch(userActions.getFriendListBlockList({userId: userId})),
        blockFriend: (param) => dispatch(userActions.blockFriend(param)),
        resetStatus: () => dispatch(userActions.resetStatus()),
        haveNewMails: (userId) => dispatch(userActions.haveNewMails({userId})),
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(translate('common')(ReceivedMailBoxScreen));
export default connectedPage;
