import React, {Fragment, PureComponent} from 'react'
import PlantCultivationComponent from "./PlantCultivationComponent/PlantCultivationComponent";
import Draggable from 'react-draggable';
class PlantCultivationPopup extends PureComponent{

    getTreeDetailPopup = () => {
        const {objectId , handleHidePopup} = this.props;
        const defaultPosition = {
            x: window.innerWidth / 3,
            y: window.innerHeight / 5
        };
        return(
            <Draggable handle=".tree-detail-panels" bounds="parent" defaultPosition={defaultPosition}>
                <div className="tree-detail-panels">
                    <PlantCultivationComponent objectId={objectId} handleHidePopup={handleHidePopup}/>
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