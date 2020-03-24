import React , {Component} from "react";

class ToolTipInventoryComponent extends Component {
    render() {
        const {title , content , quantity , itemId} = this.props;
        return (
            <div className='tooltip-inventory'>
                <div className='title-container'>
                    <div className='tooltip-inventory-title'>{title}</div>
                    {itemId !== 'I03' && <div className='tooltip-inventory-title'>[ TOTAL : {quantity} ]</div>}
                </div>
                <div className='tooltip-inventory-content'>{content}</div>
            </div>
        );
    }
}
export default ToolTipInventoryComponent