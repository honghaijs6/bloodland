import React, {Fragment, PureComponent} from 'react'
import { loadingImage } from '../../general/System';

class LandStatusComponent extends PureComponent {
    render() {
        const {className} = this.props;
        const myForSell = className.indexOf('myForSell');
        const myLand = className.indexOf('myLand');
        const forSell = className.indexOf('forSell');
        const forSaleStatus = ( myForSell !== -1 && (myLand === -1 && myForSell === -1) )|| forSell !== -1;
        const myLandStatus = myLand !== -1 && myForSell === -1;
        const myLandMySale = myLand !== -1 && myForSell !== -1;
        return (
            <Fragment>
                {forSaleStatus && <img src={loadingImage('/images/bloodland-ui/forsale2.svg')} alt='' style={{
                            width: '24px',
                            position: 'relative',
                            top: '-1px',
                            left:' -1px'
                    }} />
                }
                {
                    myLandStatus && 
                    <img src={loadingImage('/images/bloodland-ui/myland2.svg')} alt='' style={{
                            width: '24px',
                            position: 'relative',
                            top: '-1px',
                            left:' -1px'
                    }} />
                }
                {
                    myLandMySale && 
                    <img src={loadingImage('/images/bloodland-ui/mysale.svg')} alt='' style={{
                            width: '24px',
                            position: 'relative',
                            top: '-1px',
                            left:' -1px'
                    }} />
                }
            </Fragment>
        )
    }
}

export default LandStatusComponent
