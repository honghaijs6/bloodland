import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from 'mdi-react/MenuIcon';
import MoreVertIcon from 'mdi-react/MoreVertIcon';
import AddRoom from './AddRoom';
import { Collapse } from 'reactstrap';


export default class ChatTopbar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            isToggleAddForm: false
        });
    }

    static propTypes = {
        onClick: PropTypes.func.isRequired,

    };

    onHandleRoomName = () => {
        const { contact, currentUser } = this.props;
        let strArrs;
        if (contact !== undefined) {
            strArrs = contact.split('-');
            strArrs = strArrs.filter(c => c !== currentUser.userName);
            return strArrs[0];
        }
        return '';
    };

    onToggleAddForm = () => {
        const { isToggleAddForm } = this.state;
        this.setState({
            isToggleAddForm: !isToggleAddForm
        })
    };

    onCloseForm = () => {
        this.setState({
            isToggleAddForm: false
        });
    };

    // onRenderAddForm = () => {
    //     const { isToggleAddForm } = this.state;
    //     return isToggleAddForm
    //         ? 
    //         : '';
    // }

    render() {
        const {  onClick } = this.props;
        return (
            <div className='chat__topbar'>
                <button className='chat__topbar-button chat__topbar-button--menu' onClick={onClick}>
                    <MenuIcon className='chat__topbar-button-icon' />
                </button>

                <div className='chat__topbar-contact'>
                    <p className='chat__topbar-contact-name'>{this.onHandleRoomName()}</p>
                    {/* <p className='chat__topbar-contact-post'>{contact.post}</p> */}
                </div>
                <div className='chat__topbar-right'>
                    <button className='chat__topbar-button'>
                        <MoreVertIcon className='chat__topbar-button-icon' onClick={this.onToggleAddForm} />
                    </button>

                    <Collapse isOpen={this.state.isToggleAddForm} className="add-room">
                        <AddRoom onCloseForm={this.onCloseForm} />
                    </Collapse>
                </div>
            </div>
        )
    }
}
