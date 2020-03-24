import React, {Component} from 'react';
import {connect} from 'react-redux';
import Draggable from 'react-draggable';
import {getMapImgByItemId} from "../../../../../../../helpers/thumbnails";
import {loadingImage} from "../../../../general/System";
import effect from "../../../../general/StartDustEffect";
import ReactDOMServer from 'react-dom/server';
import ItemTranslate from './../../../../general/ItemTranslate';

const itemDetailBanner = loadingImage(`/images/game-ui/text-banner.svg`);
const itemDetailStyle = {background: `url(${itemDetailBanner}) center no-repeat`};
class ItemDetailPopup extends Component {

    render() {
        const {handleHidePopup, itemDetail,language} = this.props;
        const name = ReactDOMServer.renderToString(<ItemTranslate itemDetail={itemDetail} name={true} decoClass='translation'  language={language} />);
        const descriptionForDetail = ReactDOMServer.renderToString(<ItemTranslate itemDetail={itemDetail} descriptionForDetail={true} decoClass='translation'  language={language} />);

        return (
            <Draggable handle=".item-detail-panels" bounds="parent"
                       defaultPosition={{x: window.innerWidth / 3, y: window.innerHeight / 5}}>
                <div className='item-detail-panels'>
                    <div className='item-detail-panel'>
                        <span className="lnr lnr-cross lnr-custom-close-detail-popup"
                              onClick={() => handleHidePopup()}
                        />
                        <div className='detail-img'>
                            {effect.sparkleEffect()}
                            <span>
                                <img src={getMapImgByItemId(itemDetail)} alt={itemDetail}/>
                            </span>
                        </div>
                        <div className='detail-info'>
                            <div className="item-detail-title" style={itemDetailStyle} dangerouslySetInnerHTML={{__html: name}} />
                            <div className="info-content" dangerouslySetInnerHTML={{__html: descriptionForDetail}} />
                        </div>
                    </div>
                </div>
            </Draggable>
        )
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user},settingReducer:{language}} = state;
    return {
        user,language
    }
};

export default connect(mapStateToProps, null)(ItemDetailPopup);
