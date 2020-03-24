import React, {PureComponent, Fragment} from 'react'
import {loadingImage} from "../../../../general/System";
import TranslateLanguage from '../../../../general/TranslateComponent'
import Tooltip from "../../../../general/Tooltip";

class NotifyList extends PureComponent {

    onHandleClick = () => {
        this.props.handleChangeScreen('default');
    };

    render() {
        return (
            <Fragment>
                <div className='user-notice-ui-screen'>
                    <ul className='notice-list'>
                        <li onClick={() => this.props.handleGetDetail()}>
                            <div className='notice-item-title' style={{fontSize: '13px'}}><TranslateLanguage direct={'landmarkNotice.landMarkList'}/></div>
                            <div className='notice-item-time' style={{fontSize: '13px'}}>19-05-02</div>
                        </li>
                    </ul>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.onHandleClick()}>
                        <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.user.notify.back'}/></div>
                        <Tooltip descLang={'menuTab.user.notify.tooltip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default NotifyList


// getListView = () => {
//     const {notifies} = this.state;
//     return (
//         <Fragment>
//             {!notifies ? <div className='load-land'>
//                 <div className='load__icon-wrap'>
//                     <div className="lds-roller">
//                         <div/>
//                         <div/>
//                         <div/>
//                         <div/>
//                         <div/>
//                         <div/>
//                         <div/>
//                         <div/>
//                     </div>
//                 </div>
//             </div> : notifies.length !== 0 ?
//                 <Fragment>
//
//                 </Fragment> : this.getNoInfoView()
//             }
//
//         </Fragment>
//     );
// };