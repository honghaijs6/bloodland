import React, { PureComponent } from 'react';
import MagnifyIcon from 'mdi-react/MagnifyIcon';

export default class ChatSearch extends PureComponent {
    onHandleChange = (e) => {
        const { onSearching } = this.props;
        onSearching(e.target.value);
    };

    render() {
        return (
            <div className='chat__search'>
                <input className='chat__search-input' placeholder='Search' onChange={this.onHandleChange} />
                <MagnifyIcon />
            </div>
        )
    }
}