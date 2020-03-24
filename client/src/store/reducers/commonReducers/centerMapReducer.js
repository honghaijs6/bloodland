import {
    ADD_CENTER_MAP_GEO,
    SYNC_CENTER_MAP
} from '../../actions/commonActions/mapActions';

export default function (state = {centerMap: [], centerMapGeo: []}, action) {
    switch (action.type) {
        case SYNC_CENTER_MAP:
            return {
                ...state,
                centerMap: action.center
            };
        case ADD_CENTER_MAP_GEO:
            return {
                ...state,
                centerMapGeo: action.centerMapGeo
            };
        default:
            return state
    }
}
