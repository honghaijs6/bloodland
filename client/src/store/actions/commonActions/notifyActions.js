import {notifyService} from "../../services/commonServices/notifyService";

export const GET_BY_ID_NOTIFY_SUCCESS = 'GET_BY_ID_NOTIFY_SUCCESS';
export const GET_BY_ID_NOTIFY_FAILURE = 'GET_BY_ID_NOTIFY_FAILURE';

export const UPDATE_STATUS_NOTIFY_SUCCESS = 'UPDATE_STATUS_NOTIFY_SUCCESS';
export const UPDATE_STATUS_NOTIFY_FAILURE = 'UPDATE_STATUS_NOTIFY_FAILURE';

export const SEND_NOTIFY_SUCCESS = 'SEND_NOTIFY_SUCCESS';
export const SEND_NOTIFY_FAILURE = 'SEND_NOTIFY_FAILURE';

export const OPEN_NOTIFY = 'OPEN_NOTIFY';
export const notificationAction = {
    getById,
    updateStatus,
    send,
    onOpenNotify
};

function getById(id) {
    return dispatch => {
        notifyService.getById(id)
            .then(
                notifies => {
                    dispatch(success(notifies));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) {
        return {type: GET_BY_ID_NOTIFY_SUCCESS, notifies}
    }

    function failure(error) {
        return {type: GET_BY_ID_NOTIFY_FAILURE, error}
    }
}

function updateStatus(id) {
    return dispatch => {
        notifyService.updateStatus(id)
            .then(
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function failure(error) {
        return {type: UPDATE_STATUS_NOTIFY_FAILURE, error}
    }
}

function send(notify) {
    return dispatch => {
        notifyService.send(notify)
            .then(
                notifies => {
                    dispatch(success(notifies));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(notifies) {
        return {type: SEND_NOTIFY_SUCCESS, notifies}
    }

    function failure(error) {
        return {type: SEND_NOTIFY_FAILURE, error}
    }
}

function onOpenNotify(notice) {
    return {
        type: OPEN_NOTIFY, notice
    }
}