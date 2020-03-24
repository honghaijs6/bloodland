import React, {Fragment, PureComponent} from 'react'
import {inventoryItemImage} from "../asset";
import ItemInventoryGrid from "./component/ItemInventoryGrid";
import TranslateLanguage from './../../../general/TranslateComponent';
class ItemsInventory extends PureComponent {
    render(){
        return(
            <Fragment>
                <div className='screen-title clear-top-empty'>
                    <img src={inventoryItemImage} alt={'inventoryItem'}/>
                    <div><TranslateLanguage direct={'menuTab.items'}/></div>
                </div>
                <ItemInventoryGrid/>
            </Fragment>
        )
    }
}
export default ItemsInventory