import React, {PureComponent} from 'react';
import LogInForm from './components/LogInForm';
import Alert from "../../../components/Alert";
import connect from "react-redux/es/connect/connect";
import {translate} from "react-i18next";

class LogIn extends PureComponent
{
    render() {
        const { alert } = this.props;
        return (
            <div className='login'>
                <div className='login__wrapper'>
                    <div className='login__card'>
                        <div className='login__head'>
                            <div className='login__logo'></div>
                        </div>
                        {alert.message &&
                        <Alert color={`${alert.type}`}>
                            <p>{alert.message}</p>
                        </Alert>
                        }
                        <LogInForm onSubmit/>
                    </div>
                    {/* <div className='login__card'>
                        <div className='login__head'>
                            <div className='login__logo'></div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state)
{
    const { alert } = state;
    return {
        alert,
    };
}

const connectedGoogleMap = connect(mapStateToProps)(translate('common')(LogIn));
export default connectedGoogleMap;