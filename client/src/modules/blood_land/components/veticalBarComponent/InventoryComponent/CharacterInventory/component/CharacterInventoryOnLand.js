import React , {PureComponent} from 'react';
import {connect} from 'react-redux';
import {objectsActions} from "../../../../../../../store/actions/gameActions/objectsActions";
import CharacterInventoryGridOnLand from "./CharacterInventoryGridOnLand";

class CharacterInventoryOnLand extends PureComponent{
    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getOnLandObjectsByUserId({userId:_id});
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
        const {onLands,settingReducer} = this.props;
        if(!onLands){
            return this.loading();
        }else{
            return (
                <CharacterInventoryGridOnLand settingReducer={settingReducer} onLands={onLands}/>
                );
            }
    }

}

const mapStateToProps = (state) => {
    const {authentication: { user } , objectsReducer:{onLands},settingReducer} = state;
    return{
        user,onLands,settingReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getOnLandObjectsByUserId: (param) => dispatch(objectsActions.getOnLandObjectsByUserId(param))
});

export default connect(mapStateToProps , mapDispatchToProps)(CharacterInventoryOnLand)