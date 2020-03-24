import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../store/actions/commonActions/userActions";
import {Modal} from 'reactstrap';
import {StyledEditor} from "../../../../../components/customStyled/Editor_style";
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import {translate} from "react-i18next";
import {onHandleTranslate} from "../../../../../helpers/Common";
import MessageBox from './../../general/MessageBox';

class SendMailPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentPopupScreen: this.popupScreen.noPopup,
            emailContent:'',
            title:'',
            toId:'',toName:''
        };
    }

    popupScreen = {
        noPopup: 'noPopup',
        successReply: 'successReply',
        errorReply:'errorReply',
        error:'error',
        cancelConfirm: 'cancelConfirm',
        loading: 'loading'
    };

    componentDidUpdate(prevProps){
        const {success} = this.props;
        if(success && success !== prevProps.success){
            if(success === true){
                setTimeout(() => this.handleShowPopup(this.popupScreen.successReply) , 500)
            }
            else{
                setTimeout(() => this.handleShowPopup(this.popupScreen.errorReply) , 500)

            }
        }
    }

    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen,
        });
    };

    handleShowPopup = (popupScreen, id) => {
        this.setState({
            mailDetailId: id,
            currentPopupScreen: popupScreen,
            modal: true,
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false,
        });
    };


    sendMail = () => {
        const {user: {_id, userName},friendList,toId,toName} = this.props;
        const {emailContent, title} = this.state;
        const mails = [];
        if(friendList){
            for(let f of friendList){
                if(f.checked){
                    let param = {
                        title,
                        content :emailContent,
                        fromId: _id,
                        fromName: userName,
                        toId: f.friend.userId,
                        toName: f.friend.name
                    };
                    mails.push(param)


                }
            }
            this.props.sendMail(mails);
        }else{
            const param = {
                title,
                content: emailContent,
                fromId: _id,
                fromName: userName,
                toId:toId,
                toName:toName
            };
            this.props.sendMail([param]);
        }

        // this.props.sendMail(param)
    };


    renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"/>
                 <button className="ql-italic" aria-label="Italic"/>
                <button className="ql-underline" aria-label="Underline"/>
            </span>
        );
    };

    handleCheckMail = () => {
        const {title, emailContent} = this.state;
        this.setState({
            titleValidation: title === '' || !title,
            contentValidation: emailContent === null || !emailContent
        });
        this.handleShowPopup(this.popupScreen.validation);
    }

    render() {
        const defaultScreen = this.getDefaultScreen();
        const alertModalPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {defaultScreen}
                {alertModalPopup}
            </Fragment>
        );
    }

    handleCloseMailPopup = () =>{
        this.setState({
            emailContent:null, 
            title:null
        });
        this.props.handleHideSendMailPopup()
    }

    getDefaultScreen = () => {
        const {emailContent, title, isSendButtonDisabled} = this.state;
        const  {friendList,toName} = this.props;
        const friendListFilter = friendList && friendList.filter(f => f.checked);
        const {t, settingReducer: {language}, lng} = this.props;
        const placeholderTitle = onHandleTranslate(t, "alert.sendMailPopup.placeHolderTitle", language, lng);
        const placeholderContent = onHandleTranslate(t, "alert.sendMailPopup.placeHolderContent", language, lng);
        const header = this.renderHeader();
        return (
            <Modal isOpen={this.props.sendMailModal} backdrop="static" className={`custom-modal modal--send-mail`}>
                <div className='custom-modal-header'>
                    <img src='/images/bloodland-ui/title-icon-edit-mail.png' alt=''/>
                    <TranslateLanguage direct={'alert.sendMailPopup.header'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleCloseMailPopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='title-mail'>
                        <div className='to-user'>
                            {friendListFilter ? friendListFilter.map( (item , index) => {
                                const {friend: {name}} = item;
                                return (
                                    <div className='to-user-name' key={index}>{name}</div>
                                )
                            }):<div className='to-user-name' >{toName}</div>}
                        </div>

                        {/*<input placeholder='ID아이디' className='to-user'*/}
                               {/*value={friendList && friendList.map(f => f.name)} readOnly/>*/}
                        <div className='break-y'>
                        </div>
                        <input placeholder={placeholderTitle} className='title-content' value={title ? title : ''}
                               onChange={(e) => this.setState({title: e.target.value,titleValidation: false})}/>
                    </div>
                    <div className='body-mail'>
                        <StyledEditor headerTemplate={header} placeholder={placeholderContent}  style={{height: '22rem'}}
                                      value={emailContent}
                                      onTextChange={(e) => this.setState({emailContent: e.htmlValue,contentValidation:false})}/>
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    <button onClick={() => this.handleSendMail(title,emailContent)}>
                            <img src={loadingImage('/images/game-ui/sm-send.svg')} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.user.email.sendMailButton'}/>
                            </div>
                    </button>
                    <button onClick={() => this.handleShowPopup(this.popupScreen.cancelConfirm)} disabled={isSendButtonDisabled}>
                        <img src={loadingImage(`/images/game-ui/sm-close.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.email.cancelButton'}/>
                        </div>
                    </button>
                </div>
            </Modal>
        )
    }
    
    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.popupScreen.successReply === this.state.currentPopupScreen && this.getSuccessReplyAlertPopup()}
                {this.popupScreen.errorReply === this.state.currentPopupScreen && this.getErrorReplyAlertPopup()}
                {this.popupScreen.cancelConfirm === this.state.currentPopupScreen && this.getReplyCancelAlertPopup()}
                {this.popupScreen.validation === this.state.currentPopupScreen && this.getValidationAlertPopup()}
                {this.popupScreen.loading === this.state.currentPopupScreen && this.loadingPopup(this.popupScreen.loading === this.state.currentPopupScreen)}
            </Fragment>
        );
    };

    handleSendMail = (title,emailContent) => {
        if(title === '' || emailContent === '' || !title || !emailContent) return this.handleCheckMail();
        this.handleShowPopup(this.popupScreen.loading);
        this.setState({
            isSendButtonDisabled: true
        })
        this.sendMail();
        // this.handleHidePopup();
    }

    handleCloseAllPopup = () =>{
        this.setState({emailContent:null, title:null});
        this.props.resetSentStatus();
        this.props.handleHideSendMailPopup();
        this.handleHidePopup();
    }

    getSuccessReplyAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleCloseAllPopup()
        const header = <TranslateLanguage direct={'alert.getSuccessReplyAlertPopup.header'}/>
        const body = <TranslateLanguage direct={'alert.getSuccessReplyAlertPopup.body'}/>
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }

    getErrorReplyAlertPopup = () => {
        const {modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.getErrorReplyAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getErrorReplyAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getReplyCancelAlertPopup = () => {
        const {modal} = this.state;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.closeAllPopup();
        const noBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.getReplyCancelAlertPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.getReplyCancelAlertPopup.body'}/>;
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    }

    closeAllPopup = () =>{
        this.props.handleHideSendMailPopup();
        this.handleHidePopup();
    }

    //Loading
    loadingPopup = (isAlertOpen) => {

        const modal = isAlertOpen;
        const sign = "loading"; //blood //success //error //delete //loading
        const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
        const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
        return <MessageBox modal={modal} sign={sign} header={header} body={body}/>;
    };

    getValidationAlertPopup = () => {
        const {titleValidation, contentValidation,modal} = this.state;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHidePopup();
        const header = <TranslateLanguage direct={'alert.getValidationAlertPopup.header'}/>;
        const body =  <Fragment>
                        {titleValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.titleValidationBody'}/>}<br/>
                        {contentValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.contentValidationBody'}/>}
                    </Fragment>
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    }



}

function mapStateToProps(state) {
    const {authentication, users: {success}, settingReducer} = state;
    const {user} = authentication;
    return {
        user,
        success,
        settingReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMail: (param) => dispatch(userActions.sendMail(param)),
        resetSentStatus: ()=>dispatch(userActions.resetSentStatus()),
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(SendMailPopup);
export default (translate('common')(connectedPage));
