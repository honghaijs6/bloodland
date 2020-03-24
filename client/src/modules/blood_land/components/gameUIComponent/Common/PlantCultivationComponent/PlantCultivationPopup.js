import React, {Fragment, PureComponent} from 'react'

import Draggable from 'react-draggable';
import PlantCultivationComponent from "./component/PlantCultivationComponent";
class PlantCultivationPopup extends PureComponent{

    getTreeDetailPopup = () => {
        const {objectId , handleHidePopup , handleShowAlert} = this.props;
        const defaultPosition = {
            x: window.innerWidth / 3,
            y: window.innerHeight / 5
        };
        return(
            <Draggable handle=".tree-detail-panels" bounds="parent" defaultPosition={defaultPosition}>
                <div className="tree-detail-panels">
                    <PlantCultivationComponent objectId={objectId} handleHidePopup={handleHidePopup} handleShowAlert={handleShowAlert}/>
                </div>
            </Draggable>

        )
    };

    render() {
        return (
            <Fragment>
                {this.getTreeDetailPopup()}
            </Fragment>
        );
    }
}
export default PlantCultivationPopup