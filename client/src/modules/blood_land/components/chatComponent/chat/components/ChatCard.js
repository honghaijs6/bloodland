import React, {PureComponent} from 'react';
import {Card, Col} from 'reactstrap';
import Chat from './Chat';
import { connect } from 'react-redux';

class ChatCard extends PureComponent {
    render() {
       // const {user} = this.props;
        return (
            <Col md={12} lg={12}>
                <Card>
                    <Chat />
                </Card>
            </Col>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.authentication.user
    }
};
const connectedChatCard = connect(mapStateToProps,null)(ChatCard);
export default connectedChatCard;
