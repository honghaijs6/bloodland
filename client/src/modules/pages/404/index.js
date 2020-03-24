import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom'
import {loadingImage} from "../../blood_land/components/general/System";

const Image404 = loadingImage('/images/404/404.jpg');

export default class NotFound404 extends PureComponent {
    render() {
        return (
            <div className='not-found'>
                <div className='not-found__content fadeIn'>
                    <img className='not-found__image' src={Image404} alt='404'/>
                    {/* <h3 className='not-found__info'>Ooops! A The page you are looking for could not be found :(</h3> */}
                    <div className='not-found__info'>Ooops..... 찾고있는 페이지를 찾을 수 없습니다</div>
                    <Link className='back-to-bloodland' to='/'>Back to Bloodland</Link>
                </div>
            </div>
        )
    }
}