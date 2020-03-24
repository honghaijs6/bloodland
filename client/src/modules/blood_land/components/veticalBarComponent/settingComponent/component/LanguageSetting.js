import React , {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux'
import {settingActions} from "../../../../../../store/actions/commonActions/settingActions";
import TranslateLanguage from './../../../general/TranslateComponent';
// import config from '../../../../../../helpers/config';

let LANGUAGES = [
    {label:'한국어',val:'kr'},
    {label:'English',val:'en'},
    {label:'Tiếng Việt',val:'vi'},
    {label:'语言',val:'cn'},
    {label:'Indonesia',val:'in'},
    {label:'ไทย',val:'th'}
]

// if(config.devMode) LANGUAGES.push({label:'Indonesia',val:'in'},{label:'ไทย',val:'th'})


class LanguageSetting extends Component {
    state={
    }

    handleSelect = () =>{
        this.setState({toggleDropdown:!this.state.toggleDropdown});
    };

    selectLang = (lang) =>{
        const {val} = lang;

        const {user: {_id}} = this.props;
        const param = {
            userId: _id,
            language: val
        };
        this.props.setLanguage(param)

        this.setState({
            toggleDropdown:false
        });
    }

    render() {
        const {settingReducer: {language}} = this.props;
        // console.log('language',language);
        const {toggleDropdown} = this.state;
        const selectDropdown = classNames({
            'setting-select-dropdown':true,
            'hide': !toggleDropdown
        });
        const currentName = language && LANGUAGES.find(l=>l.val === language);
        return (
                <div className='setting-row margin-top-20'>
                <div><TranslateLanguage direct={'menuTab.setting.language'}/></div>
                <div className='setting-select'>
                    <div className='setting-selected' onClick={()=> this.handleSelect()}> {currentName && currentName.label} </div>
                    <div className={selectDropdown}>
                        {
                            LANGUAGES.map((i,index)=>{return <div className='setting-select-item' key={index} onClick={()=>this.selectLang(i)}>{i.label}</div>})
                        }
                    </div>
                </div>
            </div>
            );
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, authentication: {user}} = state;
    return {
        settingReducer,
        user
    };
};
const mapDispatchToProps = (dispatch) => ({
    setLanguage: (setting) => dispatch(settingActions.setLanguage(setting))
});
export default connect(mapStateToProps , mapDispatchToProps)(LanguageSetting)
