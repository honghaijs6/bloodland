import React , {PureComponent} from 'react';
import {connect} from 'react-redux';
import {inventoryActions} from "../../../../../../../store/actions/gameActions/inventoryActions";
import CharacterInventoryGridOffLand from "./CharacterInventoryGridOffLand";

class CharacterInventoryOffLand extends PureComponent{
    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getCharacterInventoryByUserId({userId:_id});
    }

    loading = () => {
        return (
            <div className='load-land'>
                <div className='load__icon-wrap'>
                    <div className="lds-roller">
                            <div/><div/><div/><div/><div/><div/><div/><div/>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const {characterInventory,settingReducer , onHandleShowPopup} = this.props;
        if(!characterInventory){
            return this.loading();
        }else{
            return (
                <CharacterInventoryGridOffLand settingReducer={settingReducer}
                                               onHandleShowPopup={onHandleShowPopup}
                                               characterInventory={characterInventory}/>
            );
        }
    }
}

const mapStateToProps = (state) => {
    const {authentication: { user } , inventoryReducer:{characterInventory},settingReducer} = state;
    return{
        user,characterInventory,settingReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param))
});

export default connect(mapStateToProps , mapDispatchToProps)(CharacterInventoryOffLand)