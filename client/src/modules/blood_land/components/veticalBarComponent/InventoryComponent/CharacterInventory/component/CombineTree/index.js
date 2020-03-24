import React, {Component, Fragment} from 'react';
import {Modal} from 'reactstrap';
import {connect} from 'react-redux'
import {
    alertPopup,
    getConfirmCombineSinglePopup,
    getConfirmCombineMultiPopup,
    getNotEnoughMinimumMoneyAlert,
    getNotHaveTreeInventoryAlert
} from "../Alert&Popup";
import {inventoryActions} from "../../../../../../../../store/actions/gameActions/inventoryActions";
import CombineTreeDetailComponent from "./CombineTreeDetailComponent";
import {userActions} from "../../../../../../../../store/actions/commonActions/userActions";
import TranslateLanguage from './../../../../../general/TranslateComponent';


class CombineTreeComponent extends Component {
    state = {};

    componentDidMount() {
        const {user: {_id , wToken}} = this.props;
        this.props.onHandleGetAllTreeByUserId({userId: _id});
        this.props.getWalletInfo({wToken})
    }

    onHandleShowCombineTreePopup = (currentCombinePopup) => {
        this.setState({
            currentCombinePopup
        })
    };

   

    onRenderCombineTreePopup = () => {
        const {currentCombinePopup} = this.state;
        const getConfirmCombineSinglePopupStatus = currentCombinePopup === alertPopup.getConfirmCombineSinglePopup;
        const getConfirmCombineMultiPopupStatus = currentCombinePopup === alertPopup.getConfirmCombineMultiPopup;
        const notEnoughMinimumMoneyStatus = currentCombinePopup === alertPopup.notEnoughMinimumMoneyPopup;
        const notHaveTreeInventoryAlertStatus = currentCombinePopup === alertPopup.getNotHaveAnyTreeInventoryAlert;
        return (
            <Fragment>
                {getConfirmCombineSinglePopupStatus && getConfirmCombineSinglePopup(this.onHandleCloseCombinePopup, getConfirmCombineSinglePopupStatus, this.handleConfirmCombineSingle)}
                {getConfirmCombineMultiPopupStatus && getConfirmCombineMultiPopup(this.onHandleCloseCombinePopup, getConfirmCombineMultiPopupStatus)}
                {notEnoughMinimumMoneyStatus && getNotEnoughMinimumMoneyAlert(this.onHandleCloseCombinePopup, notEnoughMinimumMoneyStatus)}
                {notHaveTreeInventoryAlertStatus && getNotHaveTreeInventoryAlert(this.onHandleCloseCombinePopup , notHaveTreeInventoryAlertStatus)}
            </Fragment>
        )

    };
    onHandleCloseCombinePopup = () => {
        this.setState({
            currentCombinePopup: alertPopup.noPopup
        })
    };

    handleHidePopup = () => {
        const {handleHidePopup} = this.props;
        handleHidePopup()
    };

    handleGetCombineTrees = (combineTrees) => {
        const items = combineTrees.map(item => {
            return{
                itemId: item.tree.itemId,
                quantity: item.usingAmount
            }
        });
        const {user:{_id}} = this.props;
        const combineTreesParam = {
            userId: _id,
            items
        };
        this.setState({
            combineTreesParam
        })
    };


    //function combine tree ====================================
    handleConfirmCombineSingle = () => {
        const {combineTreesParam} = this.state;
        process.env.NODE_ENV === 'development' && console.log('Combine tree param', combineTreesParam);
        this.props.onHandleShowPopup(alertPopup.loadingPopup);
        this.props.getCombineTreeByUserId(combineTreesParam)

    };
    // =========================================================

    render() {
        const {isOpen, allTrees} = this.props;
        return (
            <Fragment>
                <Modal isOpen={isOpen} backdrop="static" className={`custom-modal modal--shop`}>
                    <div className='custom-modal-header'>
                        <TranslateLanguage direct={'treeCombine.combineTreeTitle'} />
                        <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHidePopup()}/>
                    </div>
                    <CombineTreeDetailComponent allTrees={allTrees} handleHidePopup={this.handleHidePopup}
                                                onHandleShowCombineTreePopup={this.onHandleShowCombineTreePopup}
                                                handleGetCombineTrees={this.handleGetCombineTrees}/>
                </Modal>
                {this.onRenderCombineTreePopup()}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {inventoryReducer: {allTrees, combineTreeResult}, authentication: {user}, settingReducer: {language}} = state;
    return {
        allTrees, user, language , combineTreeResult
    }
};
const mapDispatchToProps = (dispatch) => ({
    onHandleGetAllTreeByUserId: (param) => dispatch(inventoryActions.getAllTreeByUserId(param)),
    getWalletInfo: (information) => dispatch(userActions.getWalletInfo(information)),
    getCombineTreeByUserId: (param) => dispatch(inventoryActions.getCombineTreeByUserId(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(CombineTreeComponent)