import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LogIn from '../modules/user/login';
import Register from '../modules/user/register';
// import Chat from '../modules/chat';
// import ProFile from '../modules/user/profile';
import NotFound404 from "../modules/pages/404";
import Authorization from "../helpers/Authorization";

const Router = () => {
    return (
        <main>
            <Switch>
                <Route exact path='/login' component={LogIn} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/' component={Authorization} />
                <Route path="*" component={NotFound404} />
            </Switch>
        </main>
    );
};

export default Router;