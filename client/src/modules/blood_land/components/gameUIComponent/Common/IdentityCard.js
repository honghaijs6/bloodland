import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {landActions} from "../../../../../store/actions/landActions/landActions";
import moment from "moment";
import {loadingImage} from "../../general/System";

const socialLogo = {
    'facebook': loadingImage(`/images/game-ui/blood-email/facebook.svg`),
    'google': loadingImage(`/images/game-ui/blood-email/gmail.svg`),
    'kakao': loadingImage(`/images/game-ui/blood-email/kakao.svg`),
    'naver': loadingImage(`/images/game-ui/blood-email/naver.svg`),
    'twitter': loadingImage(`/images/game-ui/blood-email/twitter.svg`)
};
const identityCard = [
    {type: 'minimap-earth', currency: 'Cells'},
    {type: 'blood', currency: 'Blood'},
    {type: 'email', currency: ''},
];

class IdentityCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: this.screen.default,
            imageStatus: "loading"
        };
    }

    handleImageLoaded() {
        this.setState({ imageStatus: "loaded" });
      }
    
      handleImageErrored() {
        this.setState({ imageStatus: "failed" });
      }

    getSocialLogo = (social) => {
        return typeof socialLogo[social] !== 'undefined' ? socialLogo[social] : null;
    };

    screen = {
        default: 0,
        bloodId: 1
    };

    // componentDidMount(){
    //     this.props.getAllLandById(this.props.user._id);
    // }

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    getDefaultScreen = () => {
        const {user} = this.props;
        const snsList = user.wSns && user.wSns;
        // console.log('this.state.imageStatus',this.state.imageStatus);
        // style={{display:this.state.imageStatus ? '':'' }} 
        return (
            <Fragment>
                {typeof user.email !== "undefined" && (user.email) ?
                    <li className='no-bg-hover' onClick={() => this.handleChangeScreen(this.screen.bloodId)}
                        style={{height: '62px'}}>
                        <div className='avatar-icon-container'>
                            <img src={loadingImage('/images/game-ui/blood-email.svg')} alt=''  onLoad={()=>this.handleImageLoaded()} onError={()=>this.handleImageErrored()}/>
                            <div className="social-icon">
                                {snsList && snsList.map((item, key) => {
                                    return (
                                        <img key={key} src={this.getSocialLogo(item)} alt=''/>
                                    )
                                })}
                            </div>
                        </div>
                        <div>{user.email}</div>
                    </li>
                    : //null
                    <li className='no-bg-hover' onClick={() => this.handleChangeScreen(this.screen.bloodId)}
                        style={{height: '62px'}}>
                        <div className='avatar-icon-container'>
                            <img src={loadingImage('/images/game-ui/blood-email.svg')} alt=''/>
                            <div className="social-icon">
                                {snsList && snsList.map((item, key) => {
                                    return (
                                        <img key={key} src={this.getSocialLogo(item)} alt=''/>
                                    )
                                })}

                            </div>
                        </div>
                        <div>{user.userName}@gmail.com</div>
                    </li>
                }
            </Fragment>
        )
    };


    renderValueIdentityCard = (type, user , lands) => {
        const {wallet} = this.props;
        const goldBlood = wallet && wallet.info && wallet.info.goldBlood ? parseFloat(wallet.info.goldBlood).toLocaleString() : 0;
        switch (type) {
            case 'minimap-earth':
                return lands.length;
            case 'blood':
                return goldBlood; //common.convertLocaleStringToSpecialString(user.goldBlood, 6);
            case 'email':
                return user.email;
            default:
                break;
        }
    };
    getBloodIdScreen = () => {
        const {user , myLands} = this.props;
        return (
            <Fragment>
                <li className='no-hover' onClick={() => this.handleChangeScreen(this.screen.default)}
                    style={{height: '62px'}}>
                    <div className='blooder-id'>
                        <div className='blooder-card-header'>
                            <span className='header-title'>blooder indentity</span>
                        </div>
                        <div className='blooder-card-body'>
                            <div className='avatar-container'>
                                <div className='blooder-avatar'>
                                    <img alt='' style={{width: '70%', height: '77%'}}
                                         src={loadingImage('/images/game-ui/no-avatar.png')}/>
                                </div>
                                <div className='blooder-number'>ID</div>
                                <div className='blooder-name'>
                                    {user.wId ? user.wId : user.userName}
                                </div>
                            </div>
                            <div className='information-container'>
                                {identityCard.map((item, key) => {
                                    const {type, currency} = item;
                                    return (
                                        <div className='info-container' key={key}>
                                            <div className='icon'>
                                                <img alt='' style={{width: '13px', marginTop: '6px'}}
                                                     src={loadingImage(`/images/game-ui/${type}.svg`)}/>
                                            </div>
                                            <div className='information'>
                                                <div className='info-detail'>
                                                    {this.renderValueIdentityCard(type, user , myLands)} {currency}
                                                </div>

                                            </div>

                                        </div>
                                    )
                                })}
                                <div className='date-container'>
                                    <div className='title'>
                                        DATE OF ISSUE
                                    </div>
                                    <div className='content'>{moment(user.wCreatedDate).format('YYYY.MM.DD')}</div>
                                </div>
                            </div>
                        </div>
                        <div className='blooder-card-footer'>
                            <span className='footer-title'>www.blood.land</span>
                        </div>
                    </div>
                </li>
            </Fragment>
        )
    };

    render() {
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen ? this.getDefaultScreen() : ''}
                {this.screen.bloodId === this.state.currentScreen ? this.getBloodIdScreen() : ''}
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    const {lands: {myLands}, authentication: {user},wallet} = state;
    return {
        user, myLands,wallet
    };
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
//     };
// };

const connectedPage = connect(mapStateToProps, null)(IdentityCard);
export default connectedPage;
