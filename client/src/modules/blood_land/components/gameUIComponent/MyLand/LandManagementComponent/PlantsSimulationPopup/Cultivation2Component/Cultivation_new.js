import React, {Fragment, PureComponent} from 'react';
import {getInitLoadingPopup, getNoSelectionAlert} from "./alertPopup";
import CultivationSimulation from "./component/CultivationSimulation";
import {inventoryActions} from "../../../../../../../store/actions/gameActions/inventoryActions";
import {connect} from 'react-redux';
class Cultivation extends PureComponent {
    state = {};

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.onHandleGetAllTreeByUserId({userId: _id})
    }


    render() {
        const {handleHidePopup, isAlertOpen, selectedLands, allTrees} = this.props;
        const checkDataExistStatus  = !selectedLands || !allTrees;
        return (
            <Fragment>
                {selectedLands.length === 0 ? getNoSelectionAlert(isAlertOpen, handleHidePopup) :
                    checkDataExistStatus ? getInitLoadingPopup(checkDataExistStatus) :
                    <CultivationSimulation isAlertOpen={isAlertOpen}
                                           allTrees={allTrees}
                                           handleHidePopup={handleHidePopup}
                                           selectedLands={selectedLands}/>}
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    const {inventoryReducer:{allTrees} , authentication: {user}} = state;
    return{
        allTrees,user
    }
};

const mapDispatchToProps = (dispatch) => ({
    onHandleGetAllTreeByUserId: (param) =>  dispatch(inventoryActions.getAllTreeByUserId(param))
});

export default connect(mapStateToProps , mapDispatchToProps)(Cultivation)
