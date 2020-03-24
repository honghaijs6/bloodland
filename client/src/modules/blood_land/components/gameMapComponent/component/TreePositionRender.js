import React, {Fragment, PureComponent} from 'react'
import {getMapImgByItemId} from "../../../../../helpers/thumbnails";
import {connect} from 'react-redux';

const alertPopup = {
    detailTreePopup: 'detailTreePopup',
    cultivationTreePopup: 'cultivationTreePopup'
};

class TreePositionRender extends PureComponent {
    state = {};
    onHandleFilterPositionTree = (landCharacters, quadKey) => {
        let positionSelected = [];
        if (landCharacters.length > 0) {
            for (let i = 0; i < landCharacters.length; i++) {
                if (landCharacters[i].quadKey === quadKey) {
                    const param = {
                        ...landCharacters[i]
                    };
                    positionSelected.push(param)
                }
            }
        }
        return positionSelected
    };

    onHandleClick = () => {
        this.setState({
            toggleTree: !this.state.toggleTree
        });
        setTimeout(() => {
            this.setState({
                toggleTree: false
            })
        }, 5000)
    };

    onHandleCheckPopup = (item) => {
        const {user: {_id}, handleShowPopupForTree} = this.props;
        // if () {
            item.userId === _id && handleShowPopupForTree({item, checkPopup: alertPopup.cultivationTreePopup})
        // } else {
        //     handleShowPopupForTree({item, checkPopup: alertPopup.detailTreePopup})
        // }
    };

    render() {
        const {landCharacters, quadKey, toggleHiddenCharacterStatus, user: {_id}} = this.props;
        if (!landCharacters) {
            return <div/>
        } else {
            const positionTreeFilter = this.onHandleFilterPositionTree(landCharacters, quadKey);
            const positionTreeFilterForUser = toggleHiddenCharacterStatus ? positionTreeFilter.filter(tree => tree.userId === _id) : positionTreeFilter;
            return (
                <Fragment>
                    {positionTreeFilterForUser && positionTreeFilterForUser.map((item, index) => {
                        const {itemId, waterEndTime} = item;
                        const {toggleTree} = this.state;
                        let current = new Date();
                        let endTime = new Date(waterEndTime);
                        let res = Math.abs(current - endTime) / 1000;
                        let days = Math.ceil(res / 86400);

                        return (
                            <div key={index}>
                                {toggleTree && item.userId === _id &&
                                <div className={`${itemId === 'T10' ? 'toggle-special-tree-button' : 'toggle-tree-button'}`} onClick={() => this.onHandleCheckPopup(item)}>
                                    <img src={getMapImgByItemId(itemId)} alt=''/>
                                </div>}
                                <div className={`game-obj ${itemId === 'T10' ? 'pos-special-item' : 'pos-item'}`}
                                     key={index} onClick={() => this.onHandleClick(itemId)}>

                                    <div className={`char-status ${days <= 15 ? 'water-warning' : ''} `}/>
                                    <img className={`${itemId === 'T10' ? 'char-special-img' : 'char-img'}`}
                                         src={getMapImgByItemId(itemId)} alt={itemId}/>
                                </div>

                            </div>
                        )
                    })}
                </Fragment>
            )

        }
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, mapGameReducer: {toggleHiddenCharacterStatus}} = state;
    return {
        user, toggleHiddenCharacterStatus
    }
};
export default connect(mapStateToProps, null)(TreePositionRender)