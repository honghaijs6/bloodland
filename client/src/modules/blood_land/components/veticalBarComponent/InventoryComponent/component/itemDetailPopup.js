import React, {Component} from 'react';
import {getShopImgByItemId} from '../../../../../../helpers/thumbnails';
import Draggable from 'react-draggable';
import effect from "../../../general/StartDustEffect";
import {usingRandomBoxImage} from "../asset";
import {connect} from 'react-redux'
import ItemTranslate from '../../../general/ItemTranslate';



const itemDetailStyle = {background: `url(${usingRandomBoxImage}) center no-repeat`};
const closeStyle = {
    position: "absolute",
    top: "0px",
    right: "0px",
    background: "#AC0000",
    border: "#AC0000 3px solid",
    color: "white",
    borderRadius: "20px",
    fontSize: "21px",
    padding: "4px",
    cursor: "pointer",
    zIndex: "999"
}
class ItemDetailPopup extends Component {

    render() {
        const {handleHidePopup, itemDetail: {itemId} , shops,language} = this.props;
        const treeDetail = shops && shops.find(tree => tree.itemId === itemId);
        return (
            <Draggable handle=".item-detail-panels" bounds="parent"
                       defaultPosition={{x: window.innerWidth / 2.4, y: window.innerHeight / 6.2}}>
                <div className='item-detail-panels'>
                    <div className='item-detail-panel'>
                        <span className="lnr lnr-cross lnr-custom-close-detail-popup"  style={closeStyle} onClick={() => handleHidePopup()}/>
                        <div className='detail-img'>
                            {effect.sparkleEffect()}
                            <span>
                                <img src={getShopImgByItemId(itemId)} alt={itemId}/>
                            </span>
                        </div>
                        <div className='detail-info'>
                            <div className='item-detail-title' style={itemDetailStyle}>
                                <ItemTranslate itemSelected={treeDetail} name={true} decoClass='translation'  language={language} />
                            </div>
                            <div className='info-content'>
                                <ItemTranslate itemSelected={treeDetail} descriptionForDetail={true} decoClass='translation'  language={language} />
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        )
    }
}

const mapStateToProps = (state) => {
    const {shopsReducer: {shops}, authentication: {user},settingReducer:{language}} = state;
    return {
        shops, user,language
    }
};
export default connect(mapStateToProps , null)(ItemDetailPopup);
