import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";

class MyLandsCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {title, totalLandNumber} = this.props
        return (
            <div className='my-land-counter'>
                {title}
                <div>{totalLandNumber} 랜드</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {authentication: {user}} = state;
    return {
        user,
    };
}

const connectedPage = connect(mapStateToProps)(MyLandsCounter);
export default connectedPage;