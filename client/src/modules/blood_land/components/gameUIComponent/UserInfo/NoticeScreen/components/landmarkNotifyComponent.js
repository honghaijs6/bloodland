import React, {Fragment, PureComponent} from 'react'
import {loadingImage} from "../../../../general/System";
import TranslateLanguage from "../../../../general/TranslateComponent";
import Tooltip from "../../../../general/Tooltip";
import {connect} from 'react-redux'
import {mapActions} from "../../../../../../../store/actions/commonActions/mapActions";
import NoticeScreen from "../../NoticeScreen";


// const landMark_mock = [
//     {name: '강남 파이낸스센터'},
//     {name: '김포국제공항'},
//     {name: '래미안첼리투스 101동'},
//     {name: '김해국제공항'},
//     {name: '대구국제공항'},
//     {name: '63빌딩'},
//     {name: '더샵센트럴스타 A동'},
//     {name: '더샵센텀스타B'}
// ]
class LandmarkNotifyComponent extends PureComponent {
    state = {};
    onHandleCenterToMap = (landmark) => {
        const {lands: {landmarks}} = this.props;
        const landmarksNew = landmarks.map(land => {
                land.selected = land === landmark;
                return land
            }
        );
        this.setState({
            landmarks: landmarksNew
        });
        this.props.syncCenterMap(landmark.center)
    };
    componentDidMount() {
        const {lands: {landmarks}} = this.props;
        this.setState({
            landmarks
        });
        
    }

    getParent = () =>{
        return <NoticeScreen />
    }

    render() {
        const {status} = this.props;
        const {landmarks} = this.state;
        // console.log('notice',this.props.notice);

        if (!landmarks) {
            return <div>Loading</div>
        } else {
            let sortLandmarks = landmarks.sort((a, b) => a.name.localeCompare(b.name, 'kr', {ignorePunctuation: true}));
            return (
                <Fragment>
                    {status && <div className='screen-title'>
                        <img src={loadingImage('/images/game-ui/tab1/nav1.svg')} alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.user.notify'}/>
                        </div>
                    </div>}
                    <div className='user-notice-ui-screen'>
                        <div className='notice-detail'>
                            <div className='notice-title'>
                                <TranslateLanguage direct={'landmarkNotice.landMarkList'}/>
                            </div>
                        </div>
                        <div className='landmark-list'>
                            {sortLandmarks.map((landmark, index) => {
                                const {name, center} = landmark;
                                return (
                                    <div className={`landmark-item ${landmark.selected ? 'selected' : '' }`} key={index} onClick={() => this.onHandleCenterToMap(landmark)}>
                                        {center && center.lat !== 0 && center.length !== 0 && name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='action-group'>
                        <button onClick={() => this.props.onHandelConfirm()}>
                            <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                            <div><TranslateLanguage direct={'menuTab.user.notify.back'}/></div>
                            <Tooltip descLang={'menuTab.user.notify.tooltip.backButton'}/>
                        </button>
                    </div>

                </Fragment>
            );
        }
    }
       
}

const mapStateToProps = (state) => {
    const {lands, notify: {notice}} = state;
    return {
        lands, notice
    }
};

const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LandmarkNotifyComponent)

