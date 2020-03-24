import { userService } from '../../services/commonServices/userService';
import alertActions from './alertActions';
import { history } from '../../../helpers/history';
import { bloodAppId } from "../../../helpers/config";

export const UPDATE_WALLET_INFO = 'UPDATE_WALLET_INFO';
export const CLEAR_USER_INFO = 'CLEAR_USER_INFO';

export const REGISTER_REQUEST = 'USERS_REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'USERS_REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'USERS_REGISTER_FAILURE';

export const LOGIN_REQUEST = 'USERS_LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'USERS_LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'USERS_LOGIN_FAILURE';

export const NEW_USER_CONNECTED = 'NEW_USER_CONNECTED';
export const USER_DICCONNECTED = 'USER_DICCONNECTED';

export const LOGIN_WALLET_SUCCESS = 'LOGIN_WALLET_SUCCESS';

export const GET_GOLD_BLOOD_SUCCESS = 'GET_GOLD_BLOOD_SUCCESS';
export const GET_GOLD_BLOOD_FAILURE = 'GET_GOLD_BLOOD_FAILURE';

export const ADD_GOLD_BLOOD_SUCCESS = 'ADD_GOLD_BLOOD_SUCCESS';
export const ADD_GOLD_BLOOD_FAILURE = 'ADD_GOLD_BLOOD_FAILURE';

export const USE_GOLD_BLOOD_SUCCESS = 'USE_GOLD_BLOOD_SUCCESS';
export const USE_GOLD_BLOOD_FAILURE = 'USE_GOLD_BLOOD_FAILURE';

export const COIN_TO_WALLET_SUCCESS = 'COIN_TO_WALLET_SUCCESS';
export const COIN_TO_WALLET_FAILURE = 'COIN_TO_WALLET_FAILURE';

export const WALLET_TO_COIN_SUCCESS = 'WALLET_TO_COIN_SUCCESS';
export const WALLET_TO_COIN_FAILURE = 'WALLET_TO_COIN_FAILURE';

export const USER_LOGOUT = 'USER_LOGOUT';

export const GETALL_REQUEST = 'USERS_GETALL_REQUEST';
export const GETALL_SUCCESS = 'USERS_GETALL_SUCCESS';
export const GETALL_FAILURE = 'USERS_GETALL_FAILURE';

export const DELETE_REQUEST = 'USERS_DELETE_REQUEST';
export const DELETE_SUCCESS = 'USERS_DELETE_SUCCESS';
export const DELETE_FAILURE = 'USERS_DELETE_FAILURE';

export const FRIENDANDBLOCK_SUCCESS = 'FRIENDANDBLOCK_SUCCESS';
export const FRIENDANDBLOCK_FAILURE = 'FRIENDANDBLOCK_FAILURE';

export const ADDFRIEND_SUCCESS = 'ADDFRIEND_SUCCESS';
export const ADDFRIEND_FAILURE = 'ADDFRIEND_FAILURE';

export const FOUND_FRIENDS_SUCCESS = 'FOUND_FRIENDS_SUCCESS';
export const FOUND_FRIENDS_FAILURE = 'FOUND_FRIENDS_FAILURE';

export const UNFRIEND_SUCCESS = 'UNFRIEND_SUCCESS';
export const UNFRIEND_FAILURE = 'UNFRIEND_FAILURE';

export const BLOCKFRIEND_SUCCESS = 'BLOCKFRIEND_SUCCESS';
export const BLOCKFRIEND_FAILURE = 'BLOCKFRIEND_FAILURE';

export const GET_BE_BLOCK_USER_SUCCESS = 'GET_BE_BLOCK_USER_SUCCESS';
export const GET_BE_BLOCK_USER_FAILURE = 'GET_BE_BLOCK_USER_FAILURE'

export const UNBLOCKFRIEND_SUCCESS = 'UNBLOCKFRIEND_SUCCESS';
export const UNBLOCKFRIEND_FAILURE = 'UNBLOCKFRIEND_FAILURE';

export const UPDATE_REQUEST = 'USERS_UPDATE_REQUEST';
export const UPDATE_SUCCESS = 'USERS_UPDATE_SUCCESS';
export const UPDATE_FAILURE = 'USERS_UPDATE_FAILURE';

export const LISTMAIL_SUCCESS = 'LISTMAIL_SUCCESS';
export const LISTMAIL_FAILURE = 'LISTMAIL_FAILURE';

export const READMAIL_SUCCESS = 'READMAIL_SUCCESS';
export const READMAIL_FAILURE = 'READMAIL_FAILURE';

export const READ_MAILS_SUCCESS = 'READ_MAILS_SUCCESS';
export const READ_MAILS_FAILURE = 'READ_MAILS_FAILURE';

export const SENDMAIL_SUCCESS = 'SENDMAIL_SUCCESS';
export const SENDMAIL_FAILURE = 'SENDMAIL_FAILURE';
export const SENDMAIL_RESET_STATUS = 'SENDMAIL_RESET_STATUS';

export const DELETEMAIL_SUCCESS = 'DELETEMAIL_SUCCESS';
export const DELETEMAIL_FAILURE = 'DELETEMAIL_FAILURE';

export const SET_SOCIAL_USER = 'SET_SOCIAL_USER';
export const UPDATE_IMAGE_USER = 'UPDATE_IMAGE_USER';

export const GETBYID_REQUEST = 'GETBYID_REQUEST';
export const GETBYID_SUCCESS = 'GETBYID_SUCCESS';
export const GETBYID_FAILURE = 'GETBYID_FAILURE';

export const GETUSERBYTOKEN_REQUEST = 'GETUSERBYTOKEN_REQUEST';
export const GETUSERBYTOKEN_SUCCESS = 'GETUSERBYTOKEN_SUCCESS';
export const GETUSERBYTOKEN_FAILURE = 'GETUSERBYTOKEN_FAILURE';

export const TRANSFER_BLOOD_STATUS = 'TRANSFER_BLOOD_STATUS';
export const TRANSFER_BLOOD_SUCCESS = 'TRANSFER_BLOOD_SUCCESS';
export const TRANSFER_BLOOD_FAILURE = 'TRANSFER_BLOOD_FAILURE';

export const PURCHASE_LANDS_CLEAR = 'PURCHASE_LANDS_CLEAR';
export const PURCHASE_LANDS_SUCCESS = 'PURCHASE_LANDS_SUCCESS';
export const PURCHASE_LANDS_FAILURE = 'PURCHASE_LANDS_FAILURE';

export  const CHECK_STATUS_BY_USERNAME_REQUEST = 'CHECK_STATUS_BY_USERNAME_REQUEST';
export  const CHECK_STATUS_BY_USERNAME_SUCCESS = 'CHECK_STATUS_BY_USERNAME_SUCCESS';

export  const GET_BALANCE_GOLDBLOOD_REQUEST = 'GET_BALANCE_GOLDBLOOD_REQUEST';
export  const GET_BALANCE_GOLDBLOOD_SUCCESS = 'GET_BALANCE_GOLDBLOOD_SUCCESS';

export  const GET_WITHDRAW_GOLDBLOOD_REQUEST = 'GET_WITHDRAW_GOLDBLOOD_REQUEST';
export  const GET_WITHDRAW_GOLDBLOOD_SUCCESS = 'GET_WITHDRAW_GOLDBLOOD_SUCCESS';

export  const GET_PAY_GOLDBLOOD_REQUEST = 'GET_PAY_GOLDBLOOD_REQUEST';
export  const GET_PAY_GOLDBLOOD_SUCCESS = 'GET_PAY_GOLDBLOOD_SUCCESS';

export  const GET_REWARD_INTEREST_GOLDBLOOD_REQUEST = 'GET_REWARD_INTEREST_GOLDBLOOD_REQUEST';
export  const GET_REWARD_INTEREST_GOLDBLOOD_SUCCESS = 'GET_REWARD_INTEREST_GOLDBLOOD_SUCCESS';

export  const RESET_STATUS = 'RESET_STATUS';

export  const HAVE_NEW_MAILS_SUCCESS = 'HAVE_NEW_MAILS_SUCCESS';
export  const HAVE_NEW_MAILS_FAILURE = 'HAVE_NEW_MAILS_FAILURE';

export const userActions = {
    updateWalletInfo,
    clearUserInfo,
    login,
    loginWallet,
    logout,
    logoutSocket,
    logoutWallet,
    register,
    getBeBlockedUser,
    getAll,
    getFriendListBlockList,
    addFriend,
    findFriend,
    unFriend,
    blockFriend,
    unBlockFriend,
    update,
    getAllMails,
    sendMail,
    resetSentStatus,
    readMail,
    haveNewMails,
    deleteReceivedMail,
    deleteSentMail,
    getWalletInfo,
    transferBlood,
    transferBloodTrading,
    transferStatus,
    clearBloodPurchase,
    delete: _delete,
    socialLoginRequest,
    socialUserSubmit,
    getById,
    getByToken,
    checkStatusByUserName,
    getGoldBlood,
    addGoldBlood,
    useGoldBlood,
    coinToWallet,
    walletToCoin,
    getBalance,
    getWithdraw,
    resetStatus,
    readManyMail
    // getPay,
    // getRewardInterest,
};

function getBalance(param){
    return dispatch => {
        dispatch(request());
        userService.getBalance(param)
            .then(
                res => {
                    dispatch(success(res));
                }
            );
    };

    function request() { return { type: GET_BALANCE_GOLDBLOOD_REQUEST } }
    function success(res) { return { type: GET_BALANCE_GOLDBLOOD_SUCCESS, res } }
}

function getWithdraw(param){
    return dispatch => {
        dispatch(request());
        userService.getWithdraw(param)
            .then(
                res => {
                    dispatch(success(res));
                    dispatch(getWalletInfo(param));
                }
            );
    };
    function request() { return { type: GET_WITHDRAW_GOLDBLOOD_REQUEST } }
    function success(res) { return { type: GET_WITHDRAW_GOLDBLOOD_SUCCESS, res } }
}

// function getPay(param){
//     return dispatch => {
//         dispatch(request());
//         userService.getPay(param)
//             .then(
//                 res => {
//                     dispatch(success(res));
//                     dispatch(getBalance(param));
//                 }
//             );
//     };
//
//     function request() { return { type: GET_PAY_GOLDBLOOD_REQUEST } }
//     function success(res) { return { type: GET_PAY_GOLDBLOOD_SUCCESS, res } }
// }

// function getRewardInterest(param){
//     return dispatch => {
//         dispatch(request());
//         userService.getRewardInterest(param)
//             .then(
//                 res => {
//                     dispatch(success(res));
//                     dispatch(getWalletInfo(param));
//                 }
//             );
//     };
//
//     function request() { return { type: GET_REWARD_INTEREST_GOLDBLOOD_REQUEST } }
//     function success(res) { return { type: GET_REWARD_INTEREST_GOLDBLOOD_SUCCESS, res } }
// }

function updateWalletInfo(res){
    return { type: UPDATE_WALLET_INFO, res }
}

function clearUserInfo(){
    return { type: CLEAR_USER_INFO }
}

function login(userName, password) {
    return dispatch => {
        dispatch(request({ userName }));
        userService.login(userName, password)
            .then(
                user => {
                    dispatch(success(user));
                    //dispatch(getGoldBlood({'userId': user._id}));
                    //dispatch(socketActions.userConnected(userName));

                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: LOGIN_REQUEST, user } }
    function success(user) { return { type: LOGIN_SUCCESS, user } }
    function failure(error) { return { type: LOGIN_FAILURE, error } }
}

function loginWallet(user) {
    return dispatch => {
        if (user) {
            dispatch(success(user));
            dispatch(getWalletInfo({'wToken':user.wToken}));
            // if (typeof user.nid !== 'undefined' && user.nid) {
            //     dispatch(newUserConnected({user: user.nid}));
            // }
        }
        else {
            dispatch(failure('Fail to Login Wallet'));
            dispatch(alertActions.error('Fail to Login Wallet'));
        }
    };

    function success(user) { return { type: LOGIN_SUCCESS, user } }
    function failure(error) { return { type: LOGIN_FAILURE, error } }
    // function newUserConnected(user) { return { type: NEW_USER_CONNECTED, user } }
}

function register(user) {
    return dispatch => {
        dispatch(request(user));
        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: REGISTER_REQUEST, user } }
    function success(user) { return { type: REGISTER_SUCCESS, user } }
    function failure(error) { return { type: REGISTER_FAILURE, error } }
}

function logout() {
    //console.log('===> logout');
    const lat = localStorage.getItem('lat');
    const lng = localStorage.getItem('lng');
    localStorage.clear();
    localStorage.setItem('lat',lat);
    localStorage.setItem('lng',lng);
    if(process.env.NODE_ENV !== "development"){
        //logout
        window.location.replace('https://wallet.blood.land/sns/logout/ext?appId='+ bloodAppId);
    }
    return { type: USER_LOGOUT };
}

function logoutSocket() {
    return dispatch => {;
        dispatch(logout());
    };
}

function logoutWallet() {
    return dispatch => {
        dispatch(logout());
    };
}

function transferBlood(param) {
    return dispatch => {
        userService.transferBlood(param)
            .then(
                info => {
                    dispatch(alertActions.success('Transfer successful'));
                    dispatch(transferStatus(info));
                    // dispatch(success(info));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                    // dispatch(failure(error));
                }
            );
    };

    //function success(info) { return { type: TRANSFER_BLOOD_SUCCESS, info } }
    //function failure(error) { return { type: TRANSFER_BLOOD_FAILURE, error } }
}
function transferStatus(status) { return { type: TRANSFER_BLOOD_STATUS, status } }
function transferBloodTrading(param) {
    return dispatch => {
        userService.purchaseLands(param)
            .then(
                info => {
                    //dispatch(alertActions.success('Purchase Lands successful'));
                    dispatch({ type: TRANSFER_BLOOD_SUCCESS, info });
                },
                error => {
                    //dispatch(alertActions.error(error.toString()));
                    dispatch({ type: PURCHASE_LANDS_FAILURE, error });
                }
            );
    };
    //function success(info) { return { type: PURCHASE_LANDS_SUCCESS, info } }
    //function failure(error) { return { type: PURCHASE_LANDS_FAILURE, error } }
}

function clearBloodPurchase() {
    return { type: PURCHASE_LANDS_CLEAR }
}

function getAll() {
    return dispatch => {
        dispatch(request());
        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: GETALL_REQUEST } }
    function success(users) { return { type: GETALL_SUCCESS, users } }
    function failure(error) { return { type: GETALL_FAILURE, error } }
}

function getWalletInfo(param) {
    return dispatch => {
        userService.getWalletInfo(param)
            .then(
                info => {
                    if (typeof info !== 'undefined' && (info))
                        dispatch(success(info));
                },
                error => {
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

   function success(info) { return { type: LOGIN_WALLET_SUCCESS, info } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));
        userService.getById(id)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: GETBYID_REQUEST } }
    function success(user) { return { type: GETBYID_SUCCESS, user } }
    function failure(error) { return { type: GETBYID_FAILURE, error } }
}

function checkStatusByUserName(param){
    return dispatch => {
        dispatch(request(param));
        userService.checkStatusByUserName(param)
            .then(
                infoStatusByUsername => {
                    dispatch(success(infoStatusByUsername))
                },
            );
    };

    function request() { return { type: CHECK_STATUS_BY_USERNAME_REQUEST } }
    function success(infoStatusByUsername) {return {type: CHECK_STATUS_BY_USERNAME_SUCCESS , infoStatusByUsername}}
}

function getByToken(param) {
    return dispatch => {
        dispatch(request(param));
        userService.getByToken(param)
            .then(
                user => {
                    if(typeof user.wToken !== 'undefined' && user.wToken !== '' && user.wId==='')
                    {
                        window.location.replace('https://wallet.blood.land/sns/logout/ext?appId='+bloodAppId);
                    }
                    //console.log('getByToken user rs', user);
                    dispatch(success(user));
                    // if (typeof user.nid !== 'undefined' && user.nid) {
                    //     dispatch(newUserConnected({user: user.nid}));
                    // }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: GETUSERBYTOKEN_REQUEST } }
    function success(user) { return { type: GETUSERBYTOKEN_SUCCESS, user } }
    function failure(error) { return { type: GETUSERBYTOKEN_FAILURE, error } }
    //function newUserConnected(user) { return { type: NEW_USER_CONNECTED, user } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));
        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: DELETE_REQUEST, id } }
    function success(id) { return { type: DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: DELETE_FAILURE, id, error } }
}


function getBeBlockedUser(param){
    return dispatch => {
        userService.getBeBlockedUser(param)
            .then(
                users => {
                    dispatch(success(users));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );

    };

    function success(users) { return { type: GET_BE_BLOCK_USER_SUCCESS, users } }
    function failure(error) { return { type: GET_BE_BLOCK_USER_FAILURE, error } }
}

function getFriendListBlockList(param) {
    return dispatch => {
        userService.getFriendListBlockList(param)
            .then(
                friendAndBlockList => {
                    dispatch(success(friendAndBlockList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(friendAndBlockList) { return { type: FRIENDANDBLOCK_SUCCESS, friendAndBlockList } }
    function failure(error) { return { type: FRIENDANDBLOCK_FAILURE, error } }
}

function addFriend(param) {
    return dispatch => {
        userService.addFriend(param)
            .then(
                friendAndBlockList => {
                    dispatch(success(friendAndBlockList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(friendAndBlockList) { return { type: ADDFRIEND_SUCCESS, friendAndBlockList } }
    function failure(error) { return { type: ADDFRIEND_FAILURE, error } }
}

function findFriend(param) {
    return dispatch => {
        userService.findFriend(param)
            .then(
                foundFriends => {
                    dispatch(success(foundFriends));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(foundFriends) { return { type: FOUND_FRIENDS_SUCCESS, foundFriends } }
    function failure(error) { return { type: FOUND_FRIENDS_FAILURE, error } }
}

function blockFriend(param) {

    return dispatch => {
        userService.blockFriend(param)
            .then(
                friendAndBlockList => {
                    dispatch(success(friendAndBlockList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(friendAndBlockList) { return { type: BLOCKFRIEND_SUCCESS, friendAndBlockList } }
    function failure(error) { return { type: BLOCKFRIEND_FAILURE, error } }
}

function unFriend(param) {
    return dispatch => {
        userService.unFriend(param)
            .then(
                friendAndBlockList => {
                    dispatch(success(friendAndBlockList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(friendAndBlockList) { return { type: UNFRIEND_SUCCESS, friendAndBlockList } }
    function failure(error) { return { type: UNFRIEND_FAILURE, error } }
}

function unBlockFriend(param) {
    return dispatch => {
        userService.unBlockFriend(param)
            .then(
                friendAndBlockList => {
                    dispatch(success(friendAndBlockList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(friendAndBlockList) { return { type: UNBLOCKFRIEND_SUCCESS, friendAndBlockList } }
    function failure(error) { return { type: UNBLOCKFRIEND_FAILURE, error } }
}

function update(user) {
    return dispatch => {
        dispatch(request());
        userService.update(user)
            .then(
                () => {
                    dispatch(success(user));
                    dispatch(alertActions.success("Update info success"));
                },
                error => {
                    dispatch(failure());
                    dispatch(alertActions.error(error.toString()));

                }
            );

    };
    function request() { return { type: UPDATE_REQUEST } }
    function success(user) { return { type: UPDATE_SUCCESS, user } }
    function failure() { return { type: UPDATE_FAILURE } }
}

function getAllMails(param) {
    return dispatch => {
        userService.getAllMails(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: LISTMAIL_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: LISTMAIL_FAILURE, error } }
}

function haveNewMails(param) {
    return dispatch => {
        userService.haveNewMails(param)
            .then(
                newMails => {
                    dispatch(success(newMails));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(newMails) { return { type: HAVE_NEW_MAILS_SUCCESS, newMails } }
    function failure(error) { return { type: HAVE_NEW_MAILS_FAILURE, error } }
}

function sendMail(param) {
    return dispatch => {
        userService.sendMail(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: SENDMAIL_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: SENDMAIL_FAILURE, error } }
}

function resetSentStatus() {
    return{
        type: SENDMAIL_RESET_STATUS
    }
}

function readMail(param) {
    return dispatch => {
        userService.readMail(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: READMAIL_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: READMAIL_FAILURE, error } }
}

function readManyMail(param) {
    return dispatch => {
        userService.readManyMail(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: READ_MAILS_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: READ_MAILS_FAILURE, error } }
}

function deleteReceivedMail(param) {
    return dispatch => {
        userService.deleteReceivedMail(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: DELETEMAIL_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: DELETEMAIL_FAILURE, error } }
}

function deleteSentMail(param) {
    return dispatch => {
        userService.deleteSentMail(param)
            .then(
                receivedAndSentList => {
                    dispatch(success(receivedAndSentList));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function success(receivedAndSentList) { return { type: DELETEMAIL_SUCCESS, receivedAndSentList } }
    function failure(error) { return { type: DELETEMAIL_FAILURE, error } }
}

function socialUserSubmit(user) {
    return dispatch => {
        userService.register(user) // if register success from social User
            .then(() => {
                // LOGIN AFTER REGISTER
                userService.login(user.userName, user.password)
                    .then(
                        user => {
                            dispatch(success(user));
                            history.push('/');
                        },
                        error => {
                            dispatch(failure(error.toString()));
                            dispatch(alertActions.error(error.toString()));
                        }
                    );

                function success(user) { return { type: LOGIN_SUCCESS, user } }
                function failure(error) { return { type: LOGIN_FAILURE, error } }
                // END LOGIN AFTER REGISTER

            })
            .catch(error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            });


        function failure(error) { return { type: LOGIN_FAILURE, error } }
    }
}

function socialLoginRequest(socialUser, type) {
    let user = {};
    let userImgUrl;
    switch (type) {
        case `google`:
            user.userName = socialUser.profileObj.email;
            user.password = socialUser.googleId;
            user.firstName = socialUser.profileObj.familyName;
            user.lastName = socialUser.profileObj.givenName;
            userImgUrl = socialUser.profileObj.imageUrl;
            break;
        case `facebook`:
            user.userName = socialUser.email;
            user.password = socialUser.id;
            user.firstName = socialUser.name;
            user.lastName = socialUser.name;
            userImgUrl = socialUser.picture.data.url;
            break;
        default:
            break;
    }
    return dispatch => {
        userService.socialLoginRequest(user).then(data => {
            const { result } = data;
            if (result) {
                userService.login(user.userName, user.password)
                    .then(
                        user => {
                            dispatch(success(user));
                            history.push('/');
                        },
                        error => {
                            dispatch(failure(error.toString()));
                            dispatch(alertActions.error(error.toString()));
                        }
                    );
            }
            else {
                //if social user no exist
                // register(user);
                dispatch({ type: SET_SOCIAL_USER, socialUser: user, userImgUrl: userImgUrl });
                history.push('/verify');
                // userService.register(user)
                //     .then(
                //         user => {
                //             dispatch(success());
                //             history.push('/login');
                //             dispatch(alertActions.success('Registration successful'));
                //         },
                //         error => {
                //             dispatch(failure(error.toString()));
                //             dispatch(alertActions.error(error.toString()));
                //         }
                //     );

                //     function success(user) { return { type: REGISTER_SUCCESS, user } }
                //     function failure(error) { return { type: REGISTER_FAILURE, error } }
                //     //
            }
        });
        function success(user) { return { type: LOGIN_SUCCESS, user } }
        function failure(error) { return { type: LOGIN_FAILURE, error } }
    }
}

function getGoldBlood(param) {
    return dispatch => {
        userService.getGoldBlood(param)
            .then(
                info => {
                    // console.log("info",info);
                    dispatch(success(info));
                },
                error => {
                    // console.log("error info", error);
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(info) { return { type: GET_GOLD_BLOOD_SUCCESS, info } }
    function failure(error) { return { type: GET_GOLD_BLOOD_FAILURE, error } }
}

function addGoldBlood(param) {
    return dispatch => {
        userService.addGoldBlood(param)
            .then(
                info => {
                    dispatch(success(info));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(info) { return { type: ADD_GOLD_BLOOD_SUCCESS, info } }
    function failure(error) { return { type: ADD_GOLD_BLOOD_FAILURE, error } }
}

function useGoldBlood(param) {
    return dispatch => {
        userService.useGoldBlood(param)
            .then(
                info => {
                    dispatch(success(info));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(info) { return { type: USE_GOLD_BLOOD_SUCCESS, info } }
    function failure(error) { return { type: USE_GOLD_BLOOD_FAILURE, error } }
}


function coinToWallet(param) {
    return dispatch => {
        userService.coinToWallet(param)
            .then(
                info => {
                    dispatch(success(info));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(info) { return { type: COIN_TO_WALLET_SUCCESS, info } }
    function failure(error) { return { type: COIN_TO_WALLET_FAILURE, error } }
}

function walletToCoin(param) {
    return dispatch => {
        userService.walletToCoin(param)
            .then(
                info => {
                    dispatch(success(info));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function success(info) { return { type: WALLET_TO_COIN_SUCCESS, info } }
    function failure(error) { return { type: WALLET_TO_COIN_FAILURE, error } }
}

export const updateImageUser = (imageUser) => {
    return {
        type: 'UPDATE_IMAGE_USER',
        imageUser
    }
};


function resetStatus() {
    return {
        type: 'RESET_STATUS',
    }
}
