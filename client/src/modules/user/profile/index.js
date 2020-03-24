import React, {PureComponent} from 'react';
import {Col, Container, Row} from 'reactstrap';
import ProfileMain from './components/ProfileMain';
import ProfileTabs from './components/ProfileTabs';
import {connect} from 'react-redux';

class Calendar extends PureComponent {
    render() {
        const {user} = this.props;
        return (
            <Container>
                <div className='profile'>
                    <Row>
                        <Col md={12} lg={12} xl={4}>
                            <Row>
                                <ProfileMain user={user}/>
                            </Row>
                        </Col>
                        <ProfileTabs/>
                    </Row>
                </div>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        user : state.authentication.user
    }
};

const connectedCalendar = connect(mapStateToProps,null)(Calendar);
export default connectedCalendar;

