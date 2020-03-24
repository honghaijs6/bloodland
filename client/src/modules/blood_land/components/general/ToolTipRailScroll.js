import React , {PureComponent} from "react";
import TranslateLanguage from "../general/TranslateComponent";


class TooltipRailScroll extends PureComponent {
    render() {
        const {descLang} = this.props;
        // console.log('de', descLang)
        return <div className="tooltip-desc">
            {/*{nameLang && <b><TranslateLanguage direct={nameLang} /></b> }*/}
            {descLang && <TranslateLanguage direct={descLang} /> }
        </div>
    }
}
export default TooltipRailScroll