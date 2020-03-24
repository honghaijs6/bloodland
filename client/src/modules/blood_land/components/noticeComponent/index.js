import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import TranslateLanguage from './../general/TranslateComponent';
import {notificationAction} from "../../../../store/actions/commonActions/notifyActions";

class Notice extends Component {
    state = { seconds: 0 };
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds === 5 ? 0 : prevState.seconds + 1
        }));
    }

    onHandleClickNotice = () => {
        const notice = 'open';
        this.props.onHandleOpenNotify(notice)
    };

    componentDidMount(){
        this.interval = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    list=[
        {kr:"63빌딩 랜드마크 오픈!",en:"63 Building Landmark  OPEN!"},
        {kr:"인천공항 랜드마크 오픈!",en:"Incheon Airport Landmark OPEN!"},
        {kr:"고층 건물 주인은 누구?",en:"Shorcut to Korea's Landmark"},
        {kr:"김포공항 랜드마크 사러가기!",en:"Gimpo Airport Landmark OPEN!"},
        {kr:"랜드마크 주인공은 누구?",en:"Shorcut to Korea's Skyscraper"},
        {kr:"서울 마천루는 누구의 것인가?",en:"Who will be the owner of Seoul's skyscrapers?"}
    ];

    render() {
        let {seconds} = this.state;
        const {settingReducer:{language}} = this.props;


        let notice = this.list[seconds].kr;
        if(language !== "kr"){
            if(this.list[seconds].en !== ""){
                notice = this.list[seconds].en;
            }
        }

        return <div className='notice-landmark'>
            <div className='notice-title' ><TranslateLanguage direct={'landmarkNotice.commonTitle'}/>&nbsp;|</div>
            <div className='notice-link' onClick={() =>  this.onHandleClickNotice()}>{notice}</div>
        </div>
    }
}

const mapStateToProps = (state) => {
    const {settingReducer} = state;
    return {
        settingReducer
    }
};
const mapDispatchToProps = (dispatch) => ({
    onHandleOpenNotify: (notice) => dispatch(notificationAction.onOpenNotify(notice))
});
export default connect(mapStateToProps , mapDispatchToProps)(Notice);
