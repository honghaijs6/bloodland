import {
    CLEAR_USER_INFO,
    PURCHASE_LANDS_SUCCESS,
    PURCHASE_LANDS_FAILURE,
    PURCHASE_LANDS_CLEAR,
    TRANSFER_BLOOD_STATUS,
    TRANSFER_BLOOD_SUCCESS,
    TRANSFER_BLOOD_FAILURE,
    GETALL_REQUEST,
    GETALL_SUCCESS,
    GETALL_FAILURE,
    DELETE_REQUEST,
    DELETE_SUCCESS,
    DELETE_FAILURE,
    SET_SOCIAL_USER,
    UPDATE_REQUEST,
    UPDATE_SUCCESS,
    UPDATE_IMAGE_USER,
    GETBYID_SUCCESS,
    GETBYID_FAILURE,
    GETBYID_REQUEST,
    FRIENDANDBLOCK_SUCCESS,
    FRIENDANDBLOCK_FAILURE,
    FOUND_FRIENDS_SUCCESS,
    FOUND_FRIENDS_FAILURE,
    ADDFRIEND_SUCCESS,
    ADDFRIEND_FAILURE,
    UNFRIEND_SUCCESS,
    UNFRIEND_FAILURE,
    BLOCKFRIEND_SUCCESS,
    BLOCKFRIEND_FAILURE,
    UNBLOCKFRIEND_SUCCESS,
    UNBLOCKFRIEND_FAILURE,
    LISTMAIL_SUCCESS,
    LISTMAIL_FAILURE,
    SENDMAIL_SUCCESS,
    SENDMAIL_FAILURE,
    SENDMAIL_RESET_STATUS,
    READMAIL_SUCCESS,
    READMAIL_FAILURE,
    READ_MAILS_SUCCESS,
    READ_MAILS_FAILURE,
    DELETEMAIL_SUCCESS,
    DELETEMAIL_FAILURE,
    CHECK_STATUS_BY_USERNAME_REQUEST,
    CHECK_STATUS_BY_USERNAME_SUCCESS,
    GET_BALANCE_GOLDBLOOD_REQUEST,
    GET_BALANCE_GOLDBLOOD_SUCCESS,
    GET_WITHDRAW_GOLDBLOOD_REQUEST,
    GET_WITHDRAW_GOLDBLOOD_SUCCESS,
    GET_PAY_GOLDBLOOD_REQUEST,
    GET_PAY_GOLDBLOOD_SUCCESS,
    GET_REWARD_INTEREST_GOLDBLOOD_REQUEST,
    GET_REWARD_INTEREST_GOLDBLOOD_SUCCESS,
    GET_BE_BLOCK_USER_SUCCESS,
    RESET_STATUS,
    HAVE_NEW_MAILS_SUCCESS,
    HAVE_NEW_MAILS_FAILURE
} from '../../actions/commonActions/userActions';

export default function (state = {beBlockUsers:[]}, action) {
    switch (action.type) {
        case CLEAR_USER_INFO:
            //console.log('state ',state)
            if (state.userInfo) delete state.userInfo;
            //console.log('state ',state)
            return { ...state };
        case PURCHASE_LANDS_CLEAR:
            return { purchaseInfo: null };
        case PURCHASE_LANDS_SUCCESS:
            return {
                purchaseInfo: action.info
            };
        case PURCHASE_LANDS_FAILURE:
            return {
                purchaseInfo: action.error
            };
        case TRANSFER_BLOOD_SUCCESS:
            return {
                transferInfo: action.info
            };
        case TRANSFER_BLOOD_FAILURE:
            return {
                transferInfo: action.error
            };
        case GETALL_REQUEST:
            return {
                loading: true
            };
        case GETALL_SUCCESS:
            return {
                users: action.users
            };
        case GETALL_FAILURE:
            return {
                error: action.error
            };
        case DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map(user =>
                    user.id === action.id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        case DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter(user => user.id !== action.id)
            };
        case DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user
            return {
                ...state,
                items: state.items.map(user => {
                    if (user.id === action.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...userCopy } = user;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...userCopy, deleteError: action.error };
                    }
                    return user;
                })
            };
        case SET_SOCIAL_USER:
            return {
                ...state,
                socialUser: action.socialUser,
                userImgUrl: action.userImgUrl
            };
        case UPDATE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UPDATE_IMAGE_USER:
            return {
                ...state,
                imageUser: action.imageUser
            };
        case GETBYID_SUCCESS:
            return {
                ...state,
                userInfo: action.user
            };
        case GETBYID_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case GETBYID_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CHECK_STATUS_BY_USERNAME_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CHECK_STATUS_BY_USERNAME_SUCCESS:
            return {
                ...state,
                infoStatusByUsername: action.infoStatusByUsername
            };
        case UPDATE_SUCCESS:
            let currentUser = state.user;
            currentUser.firstName = action.user.firstName;
            currentUser.lastName = action.user.lastName;
            currentUser.email = action.user.email;
            return {
                ...state,
                user: currentUser
            };
        case FRIENDANDBLOCK_SUCCESS:
            return {
                ...state,
                friendList: action.friendAndBlockList.friendList,
                blockFriendList: action.friendAndBlockList.blockList
            };
        case FRIENDANDBLOCK_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case FOUND_FRIENDS_SUCCESS:
            return {
                ...state,
                foundFriends: action.foundFriends
            };
        case FOUND_FRIENDS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case ADDFRIEND_SUCCESS:
            return {
                ...state,
                addStatus: action.friendAndBlockList.addStatus,
                friendList: action.friendAndBlockList.friendList,
                blockFriendList: action.friendAndBlockList.blockList
            };
        case ADDFRIEND_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UNFRIEND_SUCCESS:
            return {
                ...state,
                unFriendStatus: action.friendAndBlockList.unFriendStatus,
                friendList:  action.friendAndBlockList.friendList,
                blockFriendList:  action.friendAndBlockList.blockList
            };
        case UNFRIEND_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case BLOCKFRIEND_SUCCESS:
            return {
                ...state,
                blockStatus: action.friendAndBlockList.blockStatus,
                friendList: action.friendAndBlockList.friendList,
                blockFriendList: action.friendAndBlockList.blockList
            };
        case BLOCKFRIEND_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case UNBLOCKFRIEND_SUCCESS:
            return {
                ...state,
                unBlockStatus: action.friendAndBlockList.unBlockStatus,
                friendList: action.friendAndBlockList.friendList,
                blockFriendList: action.friendAndBlockList.blockList
            };
        case UNBLOCKFRIEND_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case LISTMAIL_SUCCESS:
            return {
                ...state,
                receivedList: action.receivedAndSentList.receivedList,
                sentList: action.receivedAndSentList.sentList
            };
        case LISTMAIL_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case HAVE_NEW_MAILS_SUCCESS:
            return {
                ...state,
                newMails:action.newMails
            };

        case HAVE_NEW_MAILS_FAILURE:
            return {
                ...state,
                error: action.error
            };
            
        case SENDMAIL_SUCCESS:
            return {
                ...state,
                receivedList: action.receivedAndSentList.receivedList,
                sentList: action.receivedAndSentList.sentList,
                success: true
            };
        case SENDMAIL_RESET_STATUS:
            return {
                ...state,
                success: null
            }
        case SENDMAIL_FAILURE:
            return {
                ...state,
                error: action.error,
                success: false
            };
        case READMAIL_SUCCESS:
            return {
                ...state,
                receivedList: action.receivedAndSentList.receivedList,
                sentList: action.receivedAndSentList.sentList
            };
        case READMAIL_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case READ_MAILS_SUCCESS:
            return {
                ...state,
                receivedList: action.receivedAndSentList.receivedList,
                sentList: action.receivedAndSentList.sentList
            };
        case READ_MAILS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case DELETEMAIL_SUCCESS:
            return {
                ...state,
                deleteMailStatus:action.receivedAndSentList.deleteMailStatus,
                receivedList:        action.receivedAndSentList.receivedList,
                sentList:            action.receivedAndSentList.sentList
            };
        case DELETEMAIL_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case TRANSFER_BLOOD_STATUS:
            return {
                ...state,
                status: action.status
            };

        case GET_BALANCE_GOLDBLOOD_REQUEST:
            return {
                ...state,
                requestBalanceApi: true
            };
        case GET_BALANCE_GOLDBLOOD_SUCCESS:
            return {
                ...state,
                requestBalanceApi: false,
                getBalanceApi: action
            };
        case GET_WITHDRAW_GOLDBLOOD_REQUEST:
            return {
                ...state,
                requestWithdrawApi: true
            };
        case GET_WITHDRAW_GOLDBLOOD_SUCCESS:
            return {
                ...state,
                requestWithdrawApi: false,
                getWithdrawApi: action.res
            };
        case GET_PAY_GOLDBLOOD_REQUEST:
            return {
                ...state,
                requestPayApi: true
            };
        case GET_PAY_GOLDBLOOD_SUCCESS:
            return {
                ...state,
                requestPayApi: false,
                getPayApi: action
            };
        case GET_REWARD_INTEREST_GOLDBLOOD_REQUEST:
            return {
                ...state,
                requestRewardInterestApi: true
            };
        case GET_REWARD_INTEREST_GOLDBLOOD_SUCCESS:
            return {
                ...state,
                requestRewardInterestApi: false,
                getRewardInterestApi: action
            };
        case GET_BE_BLOCK_USER_SUCCESS:
            return {
                ...state,
                beBlockUsers: action.users
            }
        case RESET_STATUS:
            return{
                ...state,
                deleteMailStatus:undefined,
                unFriendStatus:undefined,
                addStatus:undefined,
                blockStatus:undefined,
                unBlockStatus:undefined
            }
        default:
            return state
    }
}
