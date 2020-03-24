import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.css'
import '../scss/app.scss';
import Router from './Router';
import connect from "react-redux/es/connect/connect";
import MainWrapper from "./MainWrapper";
import {withCookies} from 'react-cookie';
import {userActions} from "../store/actions/commonActions/userActions";
import isEmpty from "lodash.isempty";
//import { apiLand } from '../helpers/config';

class App extends Component {

    componentWillMount() {
        const {dispatch, cookies, allCookies} = this.props;

        if (!isEmpty(allCookies) && typeof allCookies.wToken !== 'undefined') {
            const {token, ...rest} = allCookies;
            if (typeof token !== 'undefined') {
                //console.log('test late', );
                localStorage.setItem('token', token);
                dispatch(userActions.loginWallet({token, ...rest}));
            }

            if(process.env.NODE_ENV === "production"){
                //console.log('componentWillMount clear prod ck');
                cookies.remove('_id', { domain: '.blood.land' , path : '/'});
                cookies.remove('userName', { domain: '.blood.land' , path : '/'});
                cookies.remove('firstName', { domain: '.blood.land' , path : '/'});
                cookies.remove('lastName', { domain: '.blood.land' , path : '/'});
                cookies.remove('token', { domain: '.blood.land' , path : '/'});
                cookies.remove('email', { domain: '.blood.land' , path : '/'});
                cookies.remove('wToken', { domain: '.blood.land' , path : '/'});
                cookies.remove('wName', { domain: '.blood.land' , path : '/'});
                cookies.remove('wSns', { domain: '.blood.land' , path : '/'});
                cookies.remove('nid', { domain: '.blood.land' , path : '/'});
                cookies.remove('mainWalletAddress', { domain: '.blood.land' , path : '/'});
                cookies.remove('wCreatedDate', { domain: '.blood.land' , path : '/'});
                cookies.remove('goldBlood', { domain: '.blood.land' , path : '/'});
                cookies.remove('wId', { domain: '.blood.land' , path : '/'});
                cookies.remove('role', { domain: '.blood.land' , path : '/'});
            }
            else
            {
                //console.log('componentWillMount clear local ck');
                cookies.remove('_id');
                cookies.remove('userName');
                cookies.remove('firstName');
                cookies.remove('lastName');
                cookies.remove('token');
                cookies.remove('email');
                cookies.remove('wToken');
                cookies.remove('wName');
                cookies.remove('wSns');
                cookies.remove('nid');
                cookies.remove('mainWalletAddress');
                cookies.remove('wCreatedDate');
                cookies.remove('goldBlood');
                cookies.remove('wId');
                cookies.remove('role');
            }
        }
    }

    componentDidMount() {
        const {cookies} = this.props;
        //console.log('app old', apiLand === 'https://if-land.blood.land:4000' || apiLand === 'https://if.blood.land:4000');
        //console.log('app new', process.env.NODE_ENV === "production");
        if(process.env.NODE_ENV === "production"){
            //console.log('componentDidMount clear prod ck');
            cookies.remove('_id', {domain: '.blood.land', path: '/'});
            cookies.remove('userName', {domain: '.blood.land', path: '/'});
            cookies.remove('firstName', {domain: '.blood.land', path: '/'});
            cookies.remove('lastName', {domain: '.blood.land', path: '/'});
            cookies.remove('token', {domain: '.blood.land', path: '/'});
            cookies.remove('email', {domain: '.blood.land', path: '/'});
            cookies.remove('wToken', {domain: '.blood.land', path: '/'});
            cookies.remove('wName', {domain: '.blood.land', path: '/'});
            cookies.remove('wSns', {domain: '.blood.land', path: '/'});
            cookies.remove('nid', {domain: '.blood.land', path: '/'});
            cookies.remove('mainWalletAddress', {domain: '.blood.land', path: '/'});
            cookies.remove('wCreatedDate', {domain: '.blood.land', path: '/'});
            cookies.remove('goldBlood', {domain: '.blood.land', path: '/'});
            cookies.remove('wId', {domain: '.blood.land', path: '/'});
            cookies.remove('role', {domain: '.blood.land', path: '/'});
        }else{
            //console.log('componentDidMount clear local ck');
            cookies.remove('_id');
            cookies.remove('userName');
            cookies.remove('firstName');
            cookies.remove('lastName');
            cookies.remove('token');
            cookies.remove('email');
            cookies.remove('wToken');
            cookies.remove('wName');
            cookies.remove('wSns');
            cookies.remove('nid');
            cookies.remove('mainWalletAddress');
            cookies.remove('wCreatedDate');
            cookies.remove('goldBlood');
            cookies.remove('wId');
            cookies.remove('role');
        }
    }

    render() {
        return (
            <MainWrapper>
                <Router/>
            </MainWrapper>
        )
    }

}

function mapStateToProps(state) {
    const {authentication: {user}} = state;
    return {
        user
    };
}

const connectedApp = connect(mapStateToProps)(hot(module)(App));
export default withCookies(connectedApp);
