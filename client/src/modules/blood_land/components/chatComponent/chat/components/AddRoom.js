import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { chatActions } from './../../../store/actions/chatActions'

class AddRoom extends PureComponent {
    constructor(props) {
        super(props);
        this.state = ({
            name: '',
            image: '',
            imageFile: null
        });
    }

    onHandleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onHandleFileChange = (e) => {
        this.setState({
            image: e.target.files[0].name,
            imageFile: e.target.files[0]
        });
    };

    onClear = (e) => {
        e.preventDefault();
        this.setState({
            name :'',
            image: '',
            image_name : null
        });
    };

    onSubmitForm = (e) => {
        e.preventDefault();
        const { name, image,imageFile } = this.state;
        let room = {
            name: name,
            image: image,
            imageFile: imageFile
        };
        this.props.onAddRoom(room);
        this.props.onGetAllChats();
        this.props.onCloseForm();
    };

    render() {
        const image_name = this.state.image.length < 1
        ? 'Choose file'
        : this.state.image.substring(0,9) + '...';
        return (
            <form onSubmit={this.onSubmitForm}>
                <div className="form-group">
                    <label htmlFor="room-name">Room's name</label>
                    <input type="text" name="name" className="form-control" value={this.state.name} onChange={this.onHandleChange} />
                </div>
                <label htmlFor="customFile">Room's image</label>
                <div className="custom-file">                 
                    <input type="file" className=" custom-file-input" id="customFile" onChange={this.onHandleFileChange}/>
                    <label className="custom-file-label" htmlFor="customFile">{image_name}</label>
                </div>
                <button className="mt-3 btn btn-primary">Save</button>
                <button className="mt-3 btn btn-danger" onClick={this.onClear}>Cancel</button>
            </form>
        )
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddRoom: (room) => {
            dispatch(chatActions.create(room));
        },
        onGetAllChats: () => {
            dispatch(chatActions.getAll());
        },
    }
};

const connectAddRoom = connect(null, mapDispatchToProps)(AddRoom);
export default connectAddRoom;