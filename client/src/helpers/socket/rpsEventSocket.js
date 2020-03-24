import { rpsActions } from '../../store/reducers/commonReducers/rpsActions';

const rpsEvent = {
    GET_EVENT_USERS_REQUEST: (socket,action) => {
        socket.land.emit('GET_EVENT_USERS_REQUEST');
    }      
};

const rpsEventSocket = (dispatch, socket) => {
    socket.on('EVENT_HISTORY', (rpsHistory) => {
        dispatch(rpsActions.getEventHistory(rpsHistory));
    });

    socket.on('EVENT_WINNER', (userName) => {
        dispatch(rpsActions.getEventWinner(userName));
    });

    socket.on("GET_WINNER", (winner) => {
        dispatch(rpsActions.getWinner(winner));
    });

    socket.on("EVENT_USERS_COUNT", (usersCount) => {
        dispatch(rpsActions.getUsersCount(usersCount));
    });

    socket.on("EVENT_INITIAL", () => {
        dispatch(rpsActions.eventInitial());
    });
};

export{
    rpsEventSocket,
    rpsEvent
}