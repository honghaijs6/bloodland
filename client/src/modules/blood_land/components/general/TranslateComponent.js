import React, {
    //Fragment, 
    PureComponent} from 'react'
import {translate} from "react-i18next";
import {connect} from 'react-redux';
import classNames  from 'classnames';

class TranslateLanguage extends PureComponent {
    renderBody = (body) => {
        const {
            $_gold,
            $_total_land,
            $_purchased_land,
            $_item,
            $_price,
            $_blood,
            $_total,
            $_selected,
            $_leftDay,
        } = this.props;
        if($_gold) body = body.replace("$_gold",$_gold);
        if($_total_land) body = body.replace("$_total_land",$_total_land);
        if($_purchased_land) body = body.replace("$_purchased_land",$_purchased_land);
        if($_item) body = body.replace("$_item",$_item);
        if($_price) body = body.replace("$_price",$_price);
        if($_blood) body = body.replace("$_blood",$_blood);
        if($_total) body = body.replace("$_total",$_total);
        if($_selected) body = body.replace("$_selected",$_selected);
        if($_leftDay) body = body.replace("$_leftDay",$_leftDay);
        return body;
    }
    render() {
        const {t, settingReducer: {language}, lng, direct} = this.props;
        let translation = classNames({
            'translation': language !== 'kr'
        });
        const __html = this.renderBody(t(`${direct}.${language ? language : lng}.title`, {framework: "react-i18next"}));
        return (
            <span className={translation}
                  dangerouslySetInnerHTML={{__html}}/>
        );
    }
}

const mapStateToProps = (state) => {
    const {settingReducer} = state;
    return {
        settingReducer
    }
};
export default connect(mapStateToProps)(translate('common')(TranslateLanguage))