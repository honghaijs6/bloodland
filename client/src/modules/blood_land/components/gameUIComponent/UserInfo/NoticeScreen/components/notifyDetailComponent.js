import React, {Fragment, PureComponent} from 'react'
import {loadingImage} from "../../../../general/System";
import TranslateLanguage from "../../../../general/TranslateComponent";
import Tooltip from "../../../../general/Tooltip";
import {connect} from 'react-redux'
import {mapActions} from "../../../../../../../store/actions/commonActions/mapActions";


class NotifyDetailComponent extends PureComponent {
    state = {};

    componentDidMount() {

    }

    render() {
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
                            Test
                        </div>
                        <div className='notice-content'>
                            Test
                        </div>
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

const mapStateToProps = (state) => {
    const {lands, notify: {notice}} = state;
    return {
        lands, notice
    }
};

const mapDispatchToProps = (dispatch) => ({
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
});
export default connect(mapStateToProps, mapDispatchToProps)(NotifyDetailComponent)

