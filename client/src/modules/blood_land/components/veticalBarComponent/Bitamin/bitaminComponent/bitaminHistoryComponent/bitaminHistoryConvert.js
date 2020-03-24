import React, {PureComponent, Fragment} from 'react'
import moment from 'moment';
import isEqual from 'lodash.isequal';
import {loadingImage} from '../../../../general/System';
import {bitaminActions} from "../../../../../../../store/actions/landActions/bitaminActions";
import {connect} from 'react-redux'
import TranslateLanguage from './../../../../general/TranslateComponent';

const bitaminImage = loadingImage('/images/game-ui/bitamin-title.svg');

class BitaminHistoryConvert extends PureComponent {
    state = {
        offsetNumber: 0,
        fooOffset: true,
        historyDataUpdate: []
    };

    componentDidMount() {
        const {history} = this.props;
        if (history && history.length !== 0 && history[0].category === 'CONVERT') {
            this.setState({
                historyData: history.filter(i => i.status === true)
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {history, requestCategory} = this.props;
        const {historyData} = this.state;
        if (history) {
            if (!isEqual(history, prevProps.history || [])) {

                if (history.length > 0 && history[0].category === requestCategory) {
                    let historyAtState = historyData ? historyData : [];
                    let historyDataUpdate;
                    historyDataUpdate = [...historyAtState, ...history.filter(i => i.status === true)];
                    this.setState({
                        historyData: historyDataUpdate,
                        isNotHaveData: false
                    });
                }
            }
        }
        //check history dât undifined and return not have data
        if((historyData && historyData.length === 0 || !historyData) && !isEqual(historyData , history)){
            setTimeout(() => {
                this.setState({historyData : history})
            }, 200)
        }

    }

    loadingAfterScroll = (e) => {
        const {user: {_id}, history} = this.props;
        const {offsetNumber} = this.state;
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if (bottom && history.length !== 0) {
            this.setState({
                offsetNumber: offsetNumber + 1
            });
            this.props.getBitaminHistory({userId: _id, category: "CONVERT", offsetNumber: offsetNumber + 1});
        }
    };

    loadingFirst = () => {
        return (
            <div className='bitamin-history-no-records'>
                <div className='screen-loading'>
                    <div className="lds-roller">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
            </div>
        )
    }
    loadingScroll = () => {
        return (
            <div className="lds-ellipsis-history">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };

    getNoRecordScreen = () => {
        return <div className='bitamin-history-no-records'>
            <div className='warning'>
                <div className="lnr lnr-warning lnr-custom-close"/>
                <TranslateLanguage direct={'bitamin.bitaminHistory.noHistory'}/>
            </div>
        </div>
    };

    render() {
        const {historyData , offsetNumber} = this.state;
        const {history} = this.props;
        return (
            <Fragment>
                {!historyData ? this.loadingFirst() :
                    historyData.length === 0 ? this.getNoRecordScreen() :
                        <div className='bitamin-history-list' onScroll={(e) => this.loadingAfterScroll(e)}>
                            {historyData.map((value, i) => {
                                const {createdAt, amount} = value;
                                return (
                                    <div key={i}>
                                        <div className={'history-item-wrapper'}>
                                            {/* <div className='number-col'>{i + 1}</div> */}
                                            <div className='date-col'>
                                                {moment(new Date(createdAt), "YYYY-MM-DD").format("DD-MM-YY")}
                                            </div>
                                            <div className='time-col'>
                                                {moment(new Date(createdAt), 'hh:mm:ss').format('HH:mm')}
                                            </div>
                                            <div className='cate-detail-col'>
                                                {/*<span className='detail'><TranslateLanguage direct={'bitamin.bitaminHistory.getDetail.buyTree'}/></span>*/}
                                            </div>
                                            <div className='amount-col'>
                                                {amount}
                                                <img src={bitaminImage} alt=''/>
                                            </div>
                                        </div>
                                        <div className='end-line'/>
                                    </div>
                                )
                            })}
                            <div className={'history-item-wrapper'}>
                                {historyData.length > 10 && history.length !== 0 && this.loadingScroll()}
                            </div>
                        </div>}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, bitaminReducer: { requestCategory}} = state;
    return {user, requestCategory}
};

const mapDispatchToProps = (dispatch) => ({
    getBitaminHistory: (param) => dispatch(bitaminActions.getBitaminHistory(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(BitaminHistoryConvert)