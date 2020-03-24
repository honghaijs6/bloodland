import React, {PureComponent} from 'react';
import {Container, Row} from 'reactstrap';
import {translate} from 'react-i18next';
class Chat extends PureComponent {
    render() {
        return (
            <Container>
                <Row>
                </Row>
            </Container>
        )
    }
}

export default translate('common')(Chat);