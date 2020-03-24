import React, {PureComponent} from 'react'
import TranslateLanguage from './TranslateComponent';
import { loadingImage } from './System';
import { Modal } from 'reactstrap';

const bloodWarningSign = loadingImage(`/images/game-ui/blood-wallet-icon.svg`);
const successSign = loadingImage(`/images/game-ui/alert-success.svg`);
const errorSign  = loadingImage(`/images/game-ui/alert-danger.svg`);
const deleteSign = loadingImage(`/images/game-ui/alert-delete.svg`);
const loadingSign = <div className="lds-roller"><div/><div/><div/><div/><div/><div/><div/><div/></div>

class MessageBox extends PureComponent {

    render() {
        const {modal} = this.props;
        const {mode} = this.props;
        const {sign} = this.props;
        const {confirmBtn} = this.props;
        const {yesBtn,noBtn} = this.props;

        const {header,body} = this.props;

        const {closeBtn,firstBtn,secondBtn,thirdBtn} = this.props;

        return (
            <Modal isOpen={modal} backdrop="static" className={`custom-modal modal--message-box`}>
                <div className='custom-modal-header'>
                    {header}
                    { mode==='question' && noBtn       && <span className="lnr lnr-cross lnr-custom-close" onClick={noBtn}/> }
                    { mode==='info'  && confirmBtn  && <span className="lnr lnr-cross lnr-custom-close" onClick={confirmBtn}/> }
                    { mode==='customize'  && confirmBtn  && <span className="lnr lnr-cross lnr-custom-close" onClick={closeBtn}/> }
                </div>
                <div className='custom-modal-body'>
                    {sign==='blood' && <img src={bloodWarningSign} alt='blood'/>}
                    {sign==='success' && <img src={successSign} alt='success'/>}
                    {sign==='error' && <img src={errorSign} alt='error'/>}
                    {sign==='delete' && <img src={deleteSign} alt='delete'/>}
                    {sign==='loading' && loadingSign}
                    <br/>
                    <br/>
                    {body}
                    
                </div>
                {
                    mode==='question' && 
                    <div className='custom-modal-footer'>
                        <button onClick={yesBtn}><TranslateLanguage direct={'messageBox.yesBtn'}/></button>
                        <button onClick={noBtn} ><TranslateLanguage direct={'messageBox.noBtn'} /></button>
                    </div>
                }
                {
                    mode==='info' && 
                    <div className='custom-modal-footer'>
                        <button onClick={confirmBtn}><TranslateLanguage direct={'messageBox.confirmBtn'}/></button>
                    </div>
                }
                {
                    mode==='customize' && 
                    <div className='custom-modal-footer'>
                        <button onClick={firstBtn.onClick}>{firstBtn.name}</button>
                        <button onClick={secondBtn.onClick}>{secondBtn.name}</button>
                        <button onClick={thirdBtn.onClick}>{thirdBtn.name}</button>
                    </div>
                }
            </Modal>
        )
    }
}
export default MessageBox