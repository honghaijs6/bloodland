import {
    GETALL_CHATROOMS_SUCCESS,
    GETALL_RECENTLY_CHAT_USER,
    ADD_RECENTLY_CHAT_USER,
    JOIN_ROOM_REQUEST,
    UPDATE_USER_STATUS,
    FETCH_MESSAGES,
    PUSH_MESSAGE,
    LOAD_MORE_MESSAGE_REQUEST,
    LOAD_MORE_MESSAGE_SUCCESS,
    LOAD_MORE_MESSAGE_ERROR,
    NOTIFICATION,
    CLEAR_NOTIFICATIONS,
} from '../../actions/commonActions/chatActions';
import { USER_LOGOUT } from "../../actions/commonActions/userActions";

const initialState = {
    recentlyChatUser: [{ 'name': 'all' }],
    n: 1,
    loading: false,
    messages: [],
    notifications: [],
    currentRoom: '-1'
};
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_MESSAGES:
            return {
                ...state,
                messages: action.messages,
                loading: false,
            };

        case GETALL_CHATROOMS_SUCCESS: {
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        }

        case JOIN_ROOM_REQUEST: {
            const notifySet = new Set(state.notifications);
            return (typeof state.notifications !== 'undefined' && state.notifications.length > 0) ? {
                ...state,
                chatRooms: state.chatRooms,
                currentRoom: action.roomName,
                notifications: state.notifications.filter(nt => nt.room === action.roomName),
                loading: true,
                n: 1
            } : {
                ...state,
                chatRooms: state.chatRooms,
                currentRoom: action.roomName,
                notifications: Array.from(notifySet),
                loading: true,
                n: 1
            };
        }

        case PUSH_MESSAGE: {
            let newMessages = typeof state.messages === 'undefined' ? [] : state.messages;
            newMessages = [...newMessages, action.newMessage];
            return {
                ...state,
                loading: false,
                messages: newMessages
            }
        }

        case UPDATE_USER_STATUS:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            };
        case GETALL_RECENTLY_CHAT_USER:
            return {
                ...state,
                recentlyChatUser: action.recentlyChatUser
            };

        case ADD_RECENTLY_CHAT_USER:
            return {
                ...state,
                recentlyChatUser: [action.user, ...state.recentlyChatUser]
            };

        case USER_LOGOUT:
            return {};

        case LOAD_MORE_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case LOAD_MORE_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                n: action.result.nextN,
                messages: [...action.result.messages, ...state.messages]
            };

        case LOAD_MORE_MESSAGE_ERROR:
            return {
                ...state,
                n: -1,
                loading: false
            };

        case NOTIFICATION:
            const notifySet = new Set(state.notifications);
            if (action.fromRoom !== state.currentRoom) notifySet.add(action.fromRoom);
            return {
                ...state,
                notifications: Array.from(notifySet)
            };

        case CLEAR_NOTIFICATIONS:
            let updateNotifications = state.notifications.filter(nt => !action.rooms.find(r => r === nt));

            return {
                ...state,
                notifications: updateNotifications
            };
        default:
            return { ...state }
    }
}
