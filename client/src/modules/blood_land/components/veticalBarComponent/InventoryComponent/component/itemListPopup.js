import React, {PureComponent} from 'react'
import {Modal} from 'reactstrap';
import {getShopImgByItemId} from "../../../../../../helpers/thumbnails";
import {closeItemListImage, usingRandomBoxImage2} from "../asset";
import TranslateLanguage from './../../../general/TranslateComponent';
import {connect} from 'react-redux'
import ItemTranslate from '../../../general/ItemTranslate';



const itemListStyle = {background: `url(${usingRandomBoxImage2})`};
class ItemListPopup extends PureComponent {
    render() {
        const {isAlertOpen , handleHidePopup , itemList , shops,language} = this.props;
        return (
            <Modal isOpen={isAlertOpen} backdrop="static" className={`custom-modal modal--land-purchase`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.randomBox'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => handleHidePopup()}/>
                </div>
                <div className='custom-modal-body' style={{justifyContent: 'unset'}}>
                    <div className='gifts-list'>
                        {
                            itemList.map((item, index) => {
                                const {itemId , quantity} = item;
                                const itemFilter = shops.find(item => item.itemId === itemId);
                                return (
                                    <div className='gift-item' key={index}>
                                        <div className='gift-title'
                                             style={itemListStyle}>
                                            <span>
                                                <ItemTranslate itemSelected={itemFilter} name={true} decoClass='translation'  language={language} />
                                            </span>
                                        </div>
                                        <div className='gift-content' style={{fontSize:(quantity > 10000) ? '12px' : '18px'}}>
                                            <img src={getShopImgByItemId(itemId)} alt=''/>
                                            <span>x</span> <span>{quantity}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div className='custom-modal-footer-action-group' style={{borderTop: '#990000 2px solid'}}>
                    <button onClick={() => handleHidePopup()}>
                        <img src={closeItemListImage} alt=''/>
                        <div><TranslateLanguage direct={'menuTab.randomBox.close'}/></div>
                    </button>
                </div>
            </Modal>
        );
    }
}
const mapStateToProps = (state) => {
    const {shopsReducer: {shops}, authentication: {user},settingReducer:{language}} = state;
    return {
        shops, user, language
    }
};
export default connect(mapStateToProps , null)(ItemListPopup)