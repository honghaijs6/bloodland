import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ChatBubble from './ChatBubble';
import { Modal, ModalBody } from 'reactstrap';


class ChatBubbleList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            modal: false,
            imageModal : ''
        });
    }
    scrollBottom() {
        // let componentChatbox = document.getElementById('chatbox');
        // let chatContent = $('#chatbox-content').find('.scroll-content');
       // let scrollTo = componentChatbox.scrollHeight - 286.50;
      // chatContent.css({ "-webkit-transform": "translate3d(0px," + (-scrollTo) + "px,0px)" });

      //  chatContent.animate({ "-webkit-transform": "translate3d(0px," + (-250) + "px,0px)"},500);

        
        //    let staticHeight = $('#chatbox-content').find('.scrollbar-track-y').css('height');
        //    //285.996-70.3319
        //    let scrollBarHeight = $('#chatbox-content').find('.scrollbar-thumb-y').css('height');

        // let y = getTransform(x);
    }

    componentDidMount() {
        this.scrollBottom();

    }

    componentDidUpdate() {
        this.scrollBottom();
    }

    onOpenImage = (imageSrc) => {
        this.setState({
            modal : !this.state.modal,
            imageModal : imageSrc
        });
    }

    onRenderMessages = () => {
        const { messages,currentUser } = this.props;
        let result = null;
        if (messages !== undefined) {
            result = messages.map((elm, index) => {
                let styleClass = '';
                if(elm.user.userName === currentUser.userName){
                    styleClass = 'current-user-message-wrap'
                }
                return <ChatBubble onOpenImage = {this.onOpenImage}styleClass={styleClass} message={elm} key={index} />
            });
        }
        return result;
    };
    render() {
        return (
            <div id="chatbox" className="chat__dialog-messages">
                {this.onRenderMessages()}
                <Modal className="custom-map-modal" isOpen={this.state.modal} toggle={this.onOpenImage}  centered >
                    <ModalBody>
                        <img src={this.state.imageModal}/>
                    </ModalBody>

                </Modal>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        messages: state.chatRooms.messages,
        currentUser: state.authentication.user
    }
};

const connectedChatBubbleList = connect(mapStateToProps, null)(ChatBubbleList);
export default connectedChatBubbleList;