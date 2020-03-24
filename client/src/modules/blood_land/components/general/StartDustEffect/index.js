import React from 'react';
import {loadingImage} from "../System";

export default {
    sparkleEffect
};


function createStar(sparkle,size,key){
    const style ={
        top: (Math.random() * 207) + 'px',
        left: (Math.random() * 260) + 'px',
        animationDelay: (Math.random() * sparkle) + 's',
        background: `url(${loadingImage(`/images/game-ui/light-particle.svg`)})`
      }
    return <div key={key} className={`template shine ${size}`} style={style}/>
}


function sparkleEffect(){
    const stars =  50;
    const sparkle = 20;
    let size = 'small';
    let anims = []
        for(var i = 0; i < stars; i++) {
            if(i % 2 === 0) {
                size = 'small';
            } else if(i % 3 === 0) {
                size = 'medium';
            } else {
                size = 'large';
            }
        anims.push(createStar(sparkle,size,i));
    }
    return  <div id="starshine">
        {anims}
    </div>
}