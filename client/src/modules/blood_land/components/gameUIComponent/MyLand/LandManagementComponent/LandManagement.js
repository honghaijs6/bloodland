import React, {Fragment, PureComponent} from 'react';
import connect from "react-redux/es/connect/connect";
import isEqual from 'lodash.isequal';
import {Modal} from 'reactstrap';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import {InputText} from "primereact/inputtext";

import cloneDeep from "lodash.clonedeep";
import differenceWith from "lodash.differencewith";

import {translate} from "react-i18next";

import Cultivation from './PlantsSimulationPopup/CultivationComponent';
import Nutrients from './PlantsSimulationPopup/NutrientComponent';
import Removal from './PlantsSimulationPopup/RemoveComponent';
import Droplet from './PlantsSimulationPopup/DropLetComponent';

import SellLandPopup from './SellLandPopup';
import CateItem from './components/CateItem';
import {
    alertPopup,
    getErrorInputAlertPopup,
    getDeletedCateAlertPopup,
    getDeletedCateSuccessAlertPopup,
    getNoSelectedLandToSellAlertPopup,
    getNoSelectedLandToDeleteAlertPopup,
} from './components/alertPopup';

import Shop from '../../../veticalBarComponent/Shop';
import Tooltip from "../../../general/Tooltip";
import {
    Rules,
    onHandleTranslate,
    TranslateLanguage,
    loadingImage, QuadKeyToLatLong,
    landActions,
    mapActions,
    socketActions,
    objectsActions
} from '../../../../../../helpers/importModule';

const {
    noPopup,
    deletedCateAlert,
    deletedCateSuccessAlert,
    addFolderAlert,
    errorInputAlert,
    noSelectedLandToSellAlert,
    noSelectedLandToDeleteAlert,
} = alertPopup;

const funcList = [
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.nutrient'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-medic.png'),
        type: 'nutrition'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-shovel.png'),
        type: 'shovel'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.water'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-water.png'),
        type: 'smallWater'
    },
    {
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.tree'}/>,
        image: loadingImage('/images/game-ui/sm-icon/sm-tree.png'),
        type: 'cultivation'
    },
];

class LandManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalAlertPopup: false,
            currentAlertPopUp: noPopup,
            newCate: '',
            errors: [],
            offsetX: 0,
            selectedLands: [],
            data: 0,
            shopModal: false,
            totalLandNumber: undefined,
            error: null
        }
    }

    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: noPopup,
            modalAlertPopup: false,
            alertConfirm: false,
            error: null
        });
    };

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getAllLandCategory({userId: _id});
    }
    
    componentDidUpdate(prevProps) {
        const {myLands, user: {_id}} = this.props;
        // console.log('myLands',myLands);
        const {categories} = this.state;
        // console.log('categories',categories);
        // console.log('!categories || !isEqual(this.props.categories,prevProps.categories)',!categories || !isEqual(this.props.categories,prevProps.categories));
        if (!categories || !isEqual(this.props.categories,prevProps.categories)){
            // this.props.getAllLandById(_id);
            this.props.getAllObjectsByUserId({userId: _id});
            let {categories} = this.props;
            categories = categories.filter(c => c.type !== "landmark").map((cat, i) => {
                cat.category.lands && cat.category.lands.map((land, j) => {
                    land.highlight = false;
                    if (land.checked) {
                        land.highlight = true;
                        land.checked = cat.checked;
                    }
                    return land;
                });
                return cat;
            });
            this.setState({categories, totalLandNumber: myLands ? myLands.length : undefined});
        }
    }


    dropItemToCate = (param) => {
        if (
            (param.item.oldCateId === null && param.newCateId === 'empty') ||
            param.item.oldCateId === param.newCateId
        ) {
        } else {
            let lands = param.item.lands;
            let oldCateId = param.item.oldCateId;
            let userId = param.userId;
            let newCateId = param.newCateId;
            this.props.transferLandCategory(userId, lands, oldCateId, newCateId);
        }
    };


    doCheckAndUpdateCategories = (land, checkall) => {
        let {categories} = this.state;
        let {categoryId, _id} = land;
        categories = categories.map((c, i) => {
            if (c.category._id === categoryId) {
                if (checkall) {
                    c.checked = !c.checked;
                }
                const landsLength = c.category.lands.length
                let {lands} = c.category;

                lands.map((l, j) => {
                    if (checkall && !(l.land.forSaleStatus)) {
                        l.checked = c.checked;
                    } else {
                        if (l.land._id === _id) {
                            l.checked = !l.checked;
                            if (landsLength === lands.filter(s => s.checked).length) {
                                c.checked = true;
                            } else {
                                c.checked = false;
                            }
                        }
                    }
                    return l;
                });
            }
            return c;
        });

        let selectedLands = this.getSelectedLand(categories);
        this.setState({
            selectedLands,
            categories: categories,
        });
    };

    uncheckAndUpdateCategories = () => {
        let {categories} = this.state;
        categories = categories.map((c, i) => {
            c.checked = false;
            let {lands} = c.category;
            lands && lands.map((l, j) => {
                l.checked = false;
                return l;
            });
            return c;
        });

        this.setState({
            categories: categories,
        });
    };

    getSelectedLand = (categories) => {
        let landList = [];
        for (let i = 0; i < categories.length; i++) {
            const lands = categories[i].category.lands ? categories[i].category.lands : [];
            for (let j = 0; j < lands.length; j++) {
                const landItem = lands[j];
                if (landItem.checked) {
                    landList.push(landItem.land);
                }
            }
        }
        return landList;
    }

    moveToLand = (item) => {
        const {gameMode, map} = this.props;
        if (map && map.zoom === 22) {
            const center = QuadKeyToLatLong(item.land.quadKey);
            let zoom = item.land.quadKey.length - 2;
            gameMode && this.props.saveLandSelectedPosition(item);
            this.props.syncCenterMap(center, zoom, item.land.quadKey);
        } else {
            const center = QuadKeyToLatLong(item.land.quadKey);
            this.props.syncCenterMap(center);
        }

    };


    validate = (value) => {
        let errors = [];
        let rules = new Rules.ValidationRules();
        const rule1 = rules.checkLength(value, 36, '36 length limited');
        let hasError = rule1.hasError;
        if (hasError)
            errors.push(<Fragment key={errors.length + 1}>{rule1.error}</Fragment>);

        this.setState({errors: errors});
        return hasError;
    };


    addCategory = (e) => {
        let {categories} = this.state;
        let categorieNames = categories.map((item, index) => {
            return item.category.name
        });

        if (typeof e === "undefined") {
            const value = this.state.newCate.trim();

            let rules = new Rules.ValidationRules();
            if (rules.checkEmpty(value, '_'))
                return this.setState({
                    error: rules.checkEmpty(value, <TranslateLanguage
                        direct={'validation.addCategoryValidation.checkEmpty'}/>)
                });
            if (rules.checkLength(value, 36, '_'))
                return this.setState({
                    error: rules.checkLength(value, 36, <TranslateLanguage
                        direct={'validation.addCategoryValidation.checkLength'}/>)
                });

            if (rules.checkExistString(value, '', categorieNames, '_'))
                return this.setState({
                    error: rules.checkExistString(value, '', categorieNames, <TranslateLanguage
                        direct={'validation.addCategoryValidation.checkExistString'}/>)
                });

            const {user: {_id}} = this.props;
            this.props.addCategory(value, _id);
            this.handleHideAlertPopup();
        } else {
            if (e.charCode === 13) {
                //if (this.validate(this.state.newCate)) return;
                const value = this.state.newCate.trim();

                let rules = new Rules.ValidationRules();
                if (rules.checkEmpty(value, '_'))
                    return this.setState({
                        error: rules.checkEmpty(value, <TranslateLanguage
                            direct={'validation.addCategoryValidation.checkEmpty'}/>)
                    });
                if (rules.checkLength(value, 36, '_'))
                    return this.setState({
                        error: rules.checkLength(value, 36, <TranslateLanguage
                            direct={'validation.addCategoryValidation.checkLength'}/>)
                    });

                if (rules.checkExistString(value, '', categorieNames, '_'))
                    return this.setState({
                        error: rules.checkExistString(value, '', categorieNames, <TranslateLanguage
                            direct={'validation.addCategoryValidation.checkExistString'}/>)
                    });

                const {user: {_id}} = this.props;
                this.props.addCategory(e.target.value, _id);
                this.handleHideAlertPopup();

            }
        }
        this.forceUpdate();
    };

    renameCategory = (param) => {
        this.props.editCategory(param.input, param.userId, param.cateId);
    };


    deleteCategory = () => {
        let {categories} = this.state;
        const {user: {_id}} = this.props;
        if (!categories) return;
        else if (categories.length === 0) return;

        const excludeNames = ['empty'];
        const newCategories = differenceWith(categories, excludeNames,
            ({category}, excludeName) => category.name === excludeName
        );

        if (!newCategories) return;
        else if (newCategories.length === 0) return;

        newCategories.map((item, index) => {
            if (item.checked)
                this.props.deleteLandCategory(_id, item.category._id);
            return null;
        });
    };

    renameLand = (arg) => {
        this.props.editLand(arg.input, arg.userId, arg.cateId, arg.landId);
    };

    updateInput = (e) => {
        this.setState({
            newCate: e.target.value,
            alertConfirm: false,
            error: null
        });
    };

    callFuncTion = (type) => {
        switch (type) {
            case 'nutrition':
                this.doNutrients();
                break;
            case 'shovel':
                this.doRemoval();
                break;
            case 'smallWater':
                this.doDroplet();
                break;
            case 'cultivation':
                this.doCultivation();
                break;
            default:
                break;
        }
    };

    handleShowNewFolderEditPopup = () => {
        this.closeCategory()
        this.setState({newCate: ''});
        this.handleShowAlertPopup(addFolderAlert);
    };

    handleShowShopPopup = () => {
        this.setState({shopModal: true});
    };

    handleHideShopPopup = () => {
        this.setState({shopModal: false});
    };


    toolTipItemRender = (type) => {
        let renderLabel = ''
        switch (type) {
            case 'nutrition':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.nutritionButton'}/>;
                break;
            case 'shovel':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.shovelButton'}/>;
                break;
            case 'smallWater':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.dropletButton'}/>;
                break;
            case  'cultivation':
                renderLabel = <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.cultivationButton'}/>;
                break;
            default:
                break;
        }
        return renderLabel;
    };

    handleShowSellLandPopup = () => {
        const {myObjects} = this.props;
        const {categories} = this.state;
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];

        let cateChecked = cloneDeep(categories).reduce((allLand, cateItem) => {
            if (cateItem.category && cateItem.category.lands && cateItem.category.lands.length > 0) {
                let landChecked = cateItem.category.lands.reduce((allChkLand, landItem) => {
                    if (landItem.checked === true) {
                        landItem.checked = false;
                        landItem.isBigTreeQuadKey = allBigTreeQuadKey.some(bigTrQK => bigTrQK === landItem.land.quadKey);
                        allChkLand = allChkLand.concat(landItem);
                    }
                    return allChkLand;
                }, []);
                allLand = allLand.concat(landChecked);
            }
            return allLand;
        }, []);
        if (cateChecked.length > 0) {
            const cateCheckedFilter = cateChecked.filter(cate => cate.isBigTreeQuadKey === false);
            this.setState({cateCheckedFilter});
            this.handleShowPopup(this.popupScreen.sellLand);
        } else {
            this.handleShowAlertPopup(noSelectedLandToSellAlert);
        }
    }

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='screen-content-error'>
                    <div className='warning'>
                        <div className="lnr lnr-warning lnr-custom-close"/>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.noInformation'}/>
                    </div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.default)}>
                        <img src='/images/game-ui/sm-back.svg' alt=''/>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.back'}/>
                        </div>
                        <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.backButton'}/>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () => {
        return (
            <div className='load-land'>
                <div className='load__icon-wrap'>
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
    };

    closeCategory = () => {
        const {closeCategory} = this.state;
        this.setState({
            closeCategory: !closeCategory
        })
    };

    getMylandList = () => {
        let {categories , closeCategory} = this.state;
        if (!categories) return;
        else if (categories.length === 0) return;
        let categorieNames = categories.map((item, index) => {
            return item.category.name
        });
        return (
            <div className='my-land-list-grip-container'>
                <div className='folder-list'>
                    {categories.map((item, key) => (
                        <CateItem categorieNames={categorieNames} key={key}
                                  closeCategory={closeCategory}
                                  cate={item}
                                  renameCategory={(param) => this.renameCategory(param)}
                                  renameLand={(arg) => this.renameLand(arg)}
                                  dropItemToCate={(i) => this.dropItemToCate(i)}
                                  moveToLand={this.moveToLand}
                                  doCheckAndUpdateCategories={this.doCheckAndUpdateCategories}/>
                    ))}
                </div>
            </div>
        );
    };

    getPlantSimulationActionGroup = () => {
        // landCharacterReducerFilter, landCharacterFilter
        return <div className='plant-simulation-button-group-grid-container'>
            {
                funcList.map((item, index) => {
                    const {name, image, type} = item;
                    return (
                        <button key={index} onClick={() => this.callFuncTion(type)}>
                            <img src={image} alt=''/>
                            <div>{name}</div>
                            {this.toolTipItemRender(type)}
                        </button>
                    )
                })
            }
        </div>
    }

    getMyLandAmount = () => {
        const {totalLandNumber} = this.state;
        return (
            <div className='myland-amount-grid-container'>
                <div className='col'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.myTotalLand'}/>
                </div>
                <div className='col'>
                    {totalLandNumber}
                </div>
            </div>
        )
    }

    getMainActionGroup = () => {
        return (
            <div className='action-group'>
                <button onClick={() => this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.default)}>
                    <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.back'}/>
                    </div>
                    <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.backButton'}/>
                </button>
                <button onClick={() => this.handleShowNewFolderEditPopup()}>
                    <img src={loadingImage(`/images/game-ui/sm-add-folder.svg`)} alt=''/>
                    <div><TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder'}/></div>
                    <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.addFolderButton'}/>
                </button>
                <button onClick={() => this.handleShowDeleteAlertPopup()}>
                    <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)} alt=''/>
                    <div><TranslateLanguage direct={'menuTab.myLand.landOwned.recycle'}/></div>
                    <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.recycleButton'}/>
                </button>

                <button onClick={() => this.handleShowSellLandPopup()}>
                    <img src={loadingImage('/images/game-ui/sm-sell-land.svg')} alt=''/>
                    <div><TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand'}/></div>
                    <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.sellLandButton'}/>
                </button>
            </div>
        )
    }

    getMyLand = () => {
        return (
            <div className='myland-grid-container'>
                {this.getMyLandAmount()}
                {this.getPlantSimulationActionGroup()}
                {this.getMylandList()}
                {this.getMainActionGroup()}
            </div>
        )
    }

    getDefaultScreen = () => {
        const {totalLandNumber} = this.state;
        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab2/nav1.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned'}/>
                    </div>
                </div>
                {typeof totalLandNumber === 'undefined' ? this.loading() : totalLandNumber === 0 ? this.getNoInfoView() : this.getMyLand()}
            </Fragment>
        );
    };

    handleShowDeleteAlertPopup = () => {
        const {categories} = this.state;
        this.closeCategory();
        const categoriesFilter = categories.filter(c => c.checked);
        categoriesFilter.length === 0 ? this.handleShowAlertPopup(noSelectedLandToDeleteAlert) : this.handleShowAlertPopup(deletedCateAlert);
    }

    getShopPopup = () => {
        return <Shop isPlanting={true} isOpen={this.state.shopModal} handleShowPopup={this.handleShowShopPopup}
                     handleHidePopup={this.handleHideShopPopup} popupScreen={null}/>
    }

    render() {
        const alertPopup = this.getAlertModalPopup();
        const popupScreen = this.getModalPopup();
        // console.log('this.state.currentPopupScreen',this.state.currentPopupScreen);
        return (
            <Fragment>
                {this.getDefaultScreen()}
                {popupScreen}
                {alertPopup}
                {this.state.shopModal && this.getShopPopup()}
            </Fragment>
        );
    }

    //Plants simulation

    doNutrients = () => {
        this.handleShowPopup(this.popupScreen.nutrients);
    }
    doRemoval = () => {
        this.handleShowPopup(this.popupScreen.removal);
    }

    doCultivation = () => {
        this.handleShowPopup(this.popupScreen.cultivation);
    }
    doDroplet = () => {
        this.handleShowPopup(this.popupScreen.droplet);
    }
    handleShowPopup = (popupScreen) => {
        this.setState({
            currentPopupScreen: popupScreen,
            modalPopup: true
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modalPopup: false
        });
    };


    popupScreen = {
        noPopup: 'noPopup',
        sellLand: 'sellLand',
        nutrients: 'nutrients',
        removal: 'removal',
        cultivation: 'cultivation',
        droplet: 'droplet',
    };

    gotoSellLand = () => {
        this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.landSale);
    }

    getModalPopup = () => {
        const {sellLand, nutrients, removal, cultivation, droplet} = this.popupScreen;
        const {categories, cateCheckedFilter, selectedLands, modalPopup, currentPopupScreen} = this.state;
        // const {popupScreen,handleShowPopup} = this.props;
        const {handleHidePopup, handleShowShopPopup} = this;
        let allLands = [];
        if (typeof categories !== 'undefined' && categories.length > 0) {
            for (let cates of categories) {
                allLands = [...allLands, ...(cates.category.lands ? cates.category.lands.map(val => val.land) : [])];
            }
        }

        return (
            <Fragment>
                {
                    sellLand === currentPopupScreen &&
                    <SellLandPopup modalPopup={modalPopup} handleHidePopup={handleHidePopup}
                                   gotoSellLand={this.gotoSellLand}
                                   sellLand={cateCheckedFilter}
                                   categories={this.state.categories}
                                   resetData={this.props.getAllCategory}
                                   uncheckAndUpdateCategories={this.uncheckAndUpdateCategories}/>
                }

                {
                    nutrients === currentPopupScreen &&
                    <Nutrients selectedLands={selectedLands}
                               modalPopup={modalPopup} handleHidePopup={handleHidePopup}
                               handleShowShopPopup={handleShowShopPopup}/>
                }
                {
                    removal === currentPopupScreen &&
                    <Removal selectedLands={selectedLands}
                             modalPopup={modalPopup} handleHidePopup={handleHidePopup}
                             handleShowShopPopup={handleShowShopPopup}/>
                }

                {
                    cultivation === currentPopupScreen &&
                    <Cultivation
                        selectedLands={selectedLands} modalPopup={modalPopup} handleHidePopup={handleHidePopup}
                        handleShowShopPopup={handleShowShopPopup}/>
                }

                {
                    droplet === currentPopupScreen &&
                    <Droplet selectedLands={selectedLands}
                             modalPopup={modalPopup} handleHidePopup={handleHidePopup}
                    />
                }
            </Fragment>
        );
    };

    confirmDeleteSelectedCat = () => {
        this.deleteCategory();
        this.handleShowAlertPopup(deletedCateSuccessAlert);
    };


    getAddFolderAlertPopup = () => {
        const {newCate, error} = this.state;
        const {t, language, lng} = this.props;
        return (
            <Modal isOpen={this.state.modalAlertPopup} backdrop="static" className={`custom-modal modal--alert`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHideAlertPopup()}/>
                </div>
                <div className='custom-modal-body' style={{paddingTop: '57px'}}>
                    <div className='container'>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <InputText value={this.state.newCate} onChange={(e) => this.updateInput(e)}
                                               style={{width: '200px'}}
                                               onKeyPress={(e) => this.addCategory(e)}
                                               placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.addFolder.folderName', language, lng)}/>
                                    {error && <div style={{color: 'red'}}>{error}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='custom-modal-footer'>
                    {newCate.trim() === '' ? <button onClick={() => {
                        this.setState({alertConfirm: true})
                    }}>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder.create'}/>
                    </button> : <button onClick={() => this.addCategory()}>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder.create'}/>
                    </button>}
                    <button onClick={() => this.handleHideAlertPopup()}>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder.cancel'}/>
                    </button>
                </div>
            </Modal>
        )
    };


    //land management
    getAlertModalPopup = () => {
        const {currentAlertPopUp,modalAlertPopup} = this.state;
        const {confirmDeleteSelectedCat,handleHideAlertPopup} = this;
        return (
            <Fragment>
                {currentAlertPopUp === deletedCateAlert && getDeletedCateAlertPopup({modalAlertPopup,confirmDeleteSelectedCat,handleHideAlertPopup})}
                {currentAlertPopUp === deletedCateSuccessAlert && getDeletedCateSuccessAlertPopup({modalAlertPopup,handleHideAlertPopup})}
                {currentAlertPopUp === addFolderAlert && this.getAddFolderAlertPopup()}
                {currentAlertPopUp === errorInputAlert && getErrorInputAlertPopup({modalAlertPopup,handleHideAlertPopup})}
                {currentAlertPopUp === noSelectedLandToSellAlert && getNoSelectedLandToSellAlertPopup({modalAlertPopup,handleHideAlertPopup})}
                {currentAlertPopUp === noSelectedLandToDeleteAlert && getNoSelectedLandToDeleteAlertPopup({modalAlertPopup,handleHideAlertPopup})}
            </Fragment>
        );
    };

}

const mapStateToProps = (state) => {
    const {settingReducer: {language}, lands: {categories, modifiedCate, allLands, myLands}, authentication: {user}, map, landCharacterReducer, settingReducer: {gameMode}, objectsReducer: {myObjects}} = state;
    return {
        language,
        categories,
        modifiedCate,
        allLands,
        user,
        map,
        landCharacterReducer, gameMode,
        myLands,
        myObjects
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllLandCategory: ({userId}) => dispatch(landActions.getAllLandCategory({userId})),
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        clearForSaleStatusSocket: () => dispatch(socketActions.clearForSaleStatusSocket()),
        sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
        getAllCategory: (userId) => {
            dispatch(landActions.getAllCategory({userId: userId}));
        },
        transferLandCategory: (userId, lands, oldCateId, newCateId) => {
            dispatch(landActions.transferLandCategory({
                userId: userId,
                lands: lands,
                oldCateId: oldCateId,
                newCateId: newCateId
            }));
        },
        editLand: (name, userId, cateId, landId) => {
            dispatch(landActions.editLand({name: name, userId: userId, cateId: cateId, landId: landId}));
        },
        addCategory: (name, userId) => {
            dispatch(landActions.addCategory({name: name, userId: userId}));
        },
        editCategory: (name, userId, cateId) => {
            dispatch(landActions.editCategory({name: name, userId: userId, cateId: cateId}));
        },
        deleteLandCategory: (userId, cateId) => {
            dispatch(landActions.deleteLandCategory({userId: userId, cateId: cateId}));
        },
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
        saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
        getAllObjectsByUserId: (param) => dispatch(objectsActions.getAllObjectsByUserId(param)),
    };
};
const DragDropLandManagement = DragDropContext(HTML5Backend)(LandManagement);
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(DragDropLandManagement);
export default (translate('common')(connectedPage));
