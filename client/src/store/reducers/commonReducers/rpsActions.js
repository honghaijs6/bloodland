import { rpsService } from '../../services/rpsService';

export const RPS_CREATE_SUCCESS = 'RPS_CREATE_SUCCESS';
export const RPS_CREATE_FAILURE = 'RPS_CREATE_FAILURE';

export const RPS_FINDUSER_SUCCESS = 'RPS_FINDUSER_SUCCESS';
export const RPS_FINDUSER_FAILURE = 'RPS_FINDUSER_FAILURE';

export const RPS_GETALL_REQUEST = 'RPS_GETALL_REQUEST';
export const RPS_GETALL_SUCCESS = 'RPS_GETALL_SUCCESS';
export const RPS_GETALL_FAILURE = 'RPS_GETALL_FAILURE';

export const EVENT_INITIAL = 'EVENT_INITIAL';
export const EVENT_GET_WINNER = 'EVENT_GET_WINNER';
export const EVENT_CLOSE_WINNER = 'EVENT_CLOSE_WINNER';

export const EVENT_USERS_COUNT = 'EVENT_USERS_COUNT';
export const EVENT_GET_HISTORY = 'EVENT_GET_HISTORY';

export const RPS_GETLAST_HISTORY_REQUEST = 'RPS_GETLAST_HISTORY_REQUEST';
export const RPS_GETLAST_HISTORY_SUCCESS = 'RPS_GETLAST_HISTORY_SUCCESS';
export const RPS_GETLAST_HISTORY_FAILURE = 'RPS_GETLAST_HISTORY_FAILURE';

export const rpsActions = {
    create,
    findUser,
    getAll,
    eventInitial,
    getUsersCount,
    getEventWinner,
    closeWinner,
    getEventHistory,
    getLastHistory
};

function eventInitial(){
    return {
        type: EVENT_INITIAL,
        eventJoined: false,
        usersCount : 0
    }
}

function getUsersCount(usersCount){
    return {
        type: EVENT_USERS_COUNT,
        usersCount
    }
}

function getEventWinner(winner){
    return {
        type: EVENT_GET_WINNER,
        winner: winner
    }
}

function closeWinner(){
    return {
        type: EVENT_CLOSE_WINNER
    }
}

function getEventHistory(rpsHistory){
    return {
        type: EVENT_GET_HISTORY,
        rpsHistory: rpsHistory
    }
}

function create(param)
{
    return dispatch => {
        rpsService.create(param)
            .then(
                result =>{
                    dispatch(success(result.event))
                } ,
                error => dispatch(failure(error.toString()))
            );
        };

    function success(event) { return { type: RPS_CREATE_SUCCESS, event } }
    function failure(error) { return { type: RPS_CREATE_FAILURE, error } }
}

function findUser(param)
{
    return dispatch => {
        rpsService.findUser(param)
            .then(
                event => dispatch(success(event)),
                error => dispatch(failure(error.toString()))
            );
    };

    function success(event) { return { type: RPS_FINDUSER_SUCCESS, event } }
    function failure(error) { return { type: RPS_FINDUSER_FAILURE, error } }
}

function getAll()
{
    return dispatch => {
        dispatch(request());
        rpsService.getAll()
            .then(
                items => dispatch(success(items)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: RPS_GETALL_REQUEST } }
    function success(items) { return { type: RPS_GETALL_SUCCESS, items } }
    function failure(error) { return { type: RPS_GETALL_FAILURE, error } }
}


function getLastHistory()
{
    return dispatch => {
        dispatch(request());
        rpsService.getLastHistory()
            .then(
                lastHistory => dispatch(success(lastHistory)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: RPS_GETLAST_HISTORY_REQUEST } }
    function success(lastHistory) { return { type: RPS_GETLAST_HISTORY_SUCCESS, lastHistory } }
    function failure(error) { return { type: RPS_GETLAST_HISTORY_FAILURE, error } }
}