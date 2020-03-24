import React, { PureComponent } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import FacebookIcon from 'mdi-react/FacebookIcon';
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import { userActions } from '../../../../store/actions/commonActions/userActions';

class LogInForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            userName: 'aa',
            password: 'aa',
            submitted: false
        };

        this.showPassword = this.showPassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(userActions.logout());
        this.refs.userName.select();
    }
    responseGoogle(res) {
        window.gapi.auth2.getAuthInstance().disconnect();
        const { dispatch } = this.props;
        const type = `google`;
        if (res && res.profileObj) {
            dispatch(userActions.socialLoginRequest(res, type));
        }
    }

    responseFacebook(res)
    {
        const { dispatch } = this.props;
        const type = `facebook`;
        if (res && res.id) {
            dispatch(userActions.socialLoginRequest(res, type));
        }
    }
    showPassword(e) {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { userName, password } = this.state;
        const { dispatch } = this.props;
        if (userName && password) {
            dispatch(userActions.login(userName, password));
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { userName, password, submitted } = this.state;
        return (
            <form className='login-form' name="form" onSubmit={this.handleSubmit}>
                {/* {'form-group' + (submitted && !userName ? ' has-error' : '')} */}
                <div className='input'>
                    <input type="text" className="userName" placeholder='Username' name="userName" value={userName} onChange={this.handleChange} autoFocus ref='userName' />
                    {submitted && !userName &&
                    <div className="help-block">Username is required</div>
                    }
                </div>
                {/* {'form-group' + (submitted && !password ? ' has-error' : '')} */}
                <div className='input'>
                    <input type="password" className="password" placeholder='Password' name="password" value={password} onChange={this.handleChange} />
                    {submitted && !password &&
                    <div className="help-block">Password is required</div>
                    }
                </div>
                <div className='login-group-btn'>
                    <button>로그인</button>
                    {loggingIn &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" alt={loggingIn} />
                    }
                   <Link to="/register">가입하기</Link>
                </div>

                <div className='login__social'>
                    <FacebookLogin
                        appId="541625726264092"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass='login__social-btn login__social-btn--facebook'
                        textButton={<FacebookIcon />}
                    />&nbsp;
                    <FacebookLogin
                        appId="541625726264092"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass='login__social-btn login__social-btn--facebook'
                        textButton={<FacebookIcon />}
                    />&nbsp;
                    <FacebookLogin
                        appId="541625726264092"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass='login__social-btn login__social-btn--facebook'
                        textButton={<FacebookIcon />}
                    />&nbsp;
                    <GoogleLogin
                        clientId="1095934133955-m206kbp3d5qbdhprfla93jvosq572p8q.apps.googleusercontent.com"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        disable={true}
                        className='login__social-btn login__social-btn--google'
                        buttonText={<GooglePlusIcon />}
                    />
                    
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn,
    };
}

const connectedLoginPage = connect(mapStateToProps)(LogInForm);

export default reduxForm({
    form: 'log_in_form',
    connectedLoginPage
})(LogInForm);
