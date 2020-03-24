import React , {PureComponent,Fragment} from 'react';
import { common } from '../../../../../helpers/importModule';
import TranslateLanguage from './../../general/TranslateComponent';

class BloodExchangeTrade extends PureComponent
{
    loading = () => {
        return (
            <div className="lds-ellipsis">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };

    render() {
        const {defaultPrice} = this.props;
        return (
            <div className='blood-exchange-trade'>
                { defaultPrice ?  
                    <Fragment> 
                        <TranslateLanguage direct={'bloodExchangeTrade.title'}/> 
                        <span>|</span> 
                        {common.convertNumberToStringWithCustomDecimal(defaultPrice,0,12)} 
                        <span>BLOOD</span> 
                    </Fragment> : 
                    <span>{this.loading()}</span>}
            </div>
        );
    }
}
export default BloodExchangeTrade