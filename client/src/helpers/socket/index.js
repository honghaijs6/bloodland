import { apiLand } from './../config';
import io from 'socket.io-client';
import { combineEvents, applySocketMiddeware } from './middleware';
import { landEvent, landSocket } from './landSocket';

const socket_land = io(apiLand);
const allSocketFn = combineEvents(landEvent);
const socketServers = {
    'land': socket_land,
};

const socketMiddleware = applySocketMiddeware(socketServers, allSocketFn);
const socketReceiver = (dispatch) => {
    landSocket(dispatch, socketServers);
};

export {
    socketMiddleware,
    socketReceiver
}
