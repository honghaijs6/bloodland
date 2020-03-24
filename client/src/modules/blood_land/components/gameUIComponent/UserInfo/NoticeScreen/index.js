import React, {Component, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {notificationAction} from "../../../../../../store/actions/commonActions/notifyActions";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";
import Tooltip from "../../../general/Tooltip";
import NotifyList from "./components/notifyListComponent";
import LandmarkNotify from "./components/landmarkNotifyComponent";

class NoticeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: this.screen.list
        };
    }

    screen = {
        list: 'list',
        detail: 'detail',
    };

    componentWillMount() {
        const {user: {_id}} = this.props;
        this.props.onGetUserNotifications(_id)
    }

    
    componentDidMount = () => {
        // console.log('Noticescreen this.props.notice',this.props.notice);
        const {notice} = this.props;
        if(notice === 'pending'){
            this.handleGetDetail();
        }
    };


    handleGetDetail = () => {
        // this.props.onUpdateStatusUserNotification(info.rest.id);
        this.setState({
            currentScreen: this.screen.detail
            // ...info.rest
        });
    };

    onHandelConfirm = () => {
        this.setState({
            currentScreen: this.screen.list
        });
    };



    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen,
        });
    };

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='user-notice-warning-screen'>
                    <div className='warning'>
                        <div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.user.notify.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen('default')}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.notify.back'}/>
                        </div>
                        <Tooltip descLang={'menuTab.user.notify.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };



    render() {
        const {list , detail} = this.screen;
        const {currentScreen} = this.state;
        const statusNotice = false;
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab1/nav1.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.user.notify'}/>
                    </div>
                </div>

                {list === currentScreen     && <NotifyList     handleChangeScreen={this.props.handleChangeScreen} handleGetDetail={this.handleGetDetail}/>}
                {detail === currentScreen   && <LandmarkNotify onHandelConfirm={this.onHandelConfirm} status={statusNotice}/>}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}, notify: {notifies , notice} } = state;
    return {
        user,
        notifies,
        notice
    };
}

const mapDispatchToProps = (dispatch) => ({
    onGetUserNotifications: (id) => dispatch(notificationAction.getById(id)),
    onUpdateStatusUserNotification: (id) => dispatch(notificationAction.updateStatus(id)),
    onHandleOpenNotify: (notice) => dispatch(notificationAction.onOpenNotify(notice))
});
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(NoticeScreen);
export default connectedPage;