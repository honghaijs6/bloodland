const combineEvents = (...param) => {
    return Object.assign(...param);
};

const applySocketMiddeware = (socket, allSocketFn) => {
    return store => next => action => {
        //console.log("socket",socket);
        const isFnExist = allSocketFn.hasOwnProperty(action.type);
        if (isFnExist) {
            const socketEmitter = allSocketFn[action.type];
            // console.log("action.type",action.type);
            socketEmitter(socket, action);
        }
        next(action);
    }
};

export {
    combineEvents,
    applySocketMiddeware
}