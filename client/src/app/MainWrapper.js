import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

class MainWrapper extends PureComponent {

    componentDidMount()
    {
        document.addEventListener("keydown", this.preventSomeKeys, false);
    }

    UNSAFE_componentWillMount()
    {
        document.removeEventListener("keydown", this.preventSomeKeys, false);
    }
    

    preventSomeKeys = (e) =>{
        if(e.ctrlKey){
            switch (e.keyCode){
                case 73:
                    return this.disabledEvent(e);
                case 16:
                    return this.disabledEvent(e);
                case 85:
                    return this.disabledEvent(e);
                default:
                    break;
            }
        }
        
        switch (e.keyCode){
            case 123:
                return this.disabledEvent(e);
            case 45:
                return this.disabledEvent(e);
            case 36:
                return this.disabledEvent(e);
            case 33:
                return this.disabledEvent(e);
            case 34:
                return this.disabledEvent(e);
            case 35:
                return this.disabledEvent(e);
            case 46:
                return this.disabledEvent(e);
            default:
                break;
        }
    }

    disabledEvent = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
    }

    preventRightClick = (e) =>{
        e.preventDefault();
    }

    render() {
        let wrapperClass = classNames({
            'wrapper': true
        });
        return (
            <div className="theme-light"
            onContextMenu = {(e)=>this.preventRightClick(e)}
            >
                <div className={wrapperClass}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
        theme: state.theme,
        sidebar: state.sidebar
    }
})(MainWrapper);