import React, {PureComponent} from 'react'
import {Modal} from "reactstrap";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";

export default class UnselectedAlert extends PureComponent {
    errorImg = loadingImage(`/images/game-ui/alert-danger.svg`);

    render() {
        const {content} = this.props;
        return (
            <Modal isOpen backdrop="static" className={`custom-modal modal--alert`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.selectFolder.header'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => {this.props.toggle({data: 0})}}/>
                </div>
                <div className='custom-modal-body'>
                    <img src={this.errorImg} alt='alert danger'/>
                    <br/><br/>
                    {content}
                </div>
                <div className='custom-modal-footer'>
                    <button onClick={() => {this.props.toggle({data: 0})}}>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.confirm'}/>
                    </button>
                </div>
            </Modal>
        )
    }

}