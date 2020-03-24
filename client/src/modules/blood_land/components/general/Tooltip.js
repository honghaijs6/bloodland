import React, {
    //Fragment, 
    PureComponent} from 'react'
import TranslateLanguage from './TranslateComponent';

class Tooltip extends PureComponent {
    render() {
        const {nameLang,descLang} = this.props
        return <div className="tooltip-info">
            {nameLang && <b><TranslateLanguage direct={nameLang} /></b> }
            {descLang && <div><TranslateLanguage direct={descLang} /></div> }
        </div>
    }
}
export default Tooltip