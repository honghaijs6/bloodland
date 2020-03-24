import React, { Fragment, Component } from 'react';
import connect from "react-redux/es/connect/connect";
import { Modal } from 'reactstrap';
import SellLandPopup from './SellLandPopup';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { landActions } from "../../../../../store/actions/landActions/landActions";
import { mapActions } from "../../../../../store/actions/commonActions/mapActions";
import { socketActions } from "../../../../../store/actions/commonActions/socketActions"
import {loadingImage, QuadKeyToLatLong} from '../../general/System';
import CateItem from './components/CateItem';
import Rules from "../../../../../helpers/ValidationRule";
import differenceWith from "lodash.differencewith";
import UnselectedAlert from "../UserInfo/component/unselectedAlertPopup";
import { InputText } from "primereact/inputtext";
import TranslateLanguage from "../../general/TranslateComponent";
import MessageBox from './../../general/MessageBox';


class LandManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAlertPopup: false,
            currentScreen: this.screen.default,
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            categories: [],
            newCate: '',
            errors: [],
            offsetX: 0,
            selectedLands: [],
            data: 0,
            emptyLandAlert: false,
            centerCategory: {
                lat: 0,
                lng: 0
            },
            changeCenterCategory: null,
        }
    }

    screen = {
        default: 0
    };

    handleChangeScreen = (screen) => {
        this.setState({
            lastScreen: this.state.currentScreen,
            currentScreen: screen,
        });
    };

    handleShowAlertPopup = (screen) => {
        this.setState({
            currentAlertPopUp: screen,
            modalAlertPopup: true,
        });
    };

    handleHideAlertPopup = () => {
        this.setState({
            currentAlertPopUp: this.alertPopupScreen.noPopup,
            modalAlertPopup: false,
            alertConfirm: false
        });
    };

    componentDidMount() {
        this.props.getAllLandMarkCategory({ userId: this.props.user._id });
    }

    componentDidUpdate(prevProps){
        const {lands:{categories}} = this.props;
        if(categories !== prevProps.lands.categories){
            this.setState({categories});
        }
    }

    dropItemToCate = (param) => {
        if (
            (param.item.oldCateId === null && param.newCateId === 'empty') ||
            param.item.oldCateId === param.newCateId
        ) {
            //console.log("param.item.oldCateId === null && param.newCateId === 'empty'",param.item.oldCateId === null && param.newCateId === 'empty');
            //console.log("param.item.oldCateId === param.newCateId",param.item.oldCateId === param.newCateId);
        }
        else {
            let lands = param.item.lands;
            let oldCateId = param.item.oldCateId;
            let userId = param.userId;
            let newCateId = param.newCateId;
            this.props.transferLandCategory(userId, lands, oldCateId, newCateId);
        }
    };

    throwItemOutCate = (param) => {
        if (
            (param.item.oldCateId === null && param.newCateId === 'empty') ||
            param.item.oldCateId === param.newCateId
        ) {
        }
        else {
            let lands = param.item.lands;
            let oldCateId = param.item.oldCateId;
            let userId = param.userId;
            let newCateId = param.newCateId;
            this.props.transferLandCategory(userId, lands, oldCateId, newCateId);
        }
    };

    doCheckAndUpdateCategories = (cate, checkall) => {
        let { categories } = this.state;
        let { cateId, _id } = cate;
        categories = categories.map((c, i) => {
            if (c._id === cateId) {
                if (checkall) {
                    c.checked = !c.checked;
                }
                const landsLength = c.category.lands.length
                let { lands } = c.category;

                lands.map((l, j) => {
                    if (checkall && !(l.land.forSaleStatus)) {
                        l.checked = c.checked;
                    }
                    else {
                        if (l.land._id === _id) {
                            l.checked = !l.checked;
                            if (landsLength === lands.filter(s => s.checked).length) {
                                c.checked = true;
                            }
                            else {
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
    }

    uncheckAndUpdateCategories = () => {
        let { categories } = this.state;
        categories = categories.map((c, i) => {
            c.checked = false;
            let { lands } = c.category;
            lands.map((l, j) => {
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
            const lands = categories[i].category.lands;
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
        const { gameMode } = this.props;
        const center = QuadKeyToLatLong(item.land.quadKey);
        let zoom = item.land.quadKey.length - 2;
        gameMode && this.props.saveLandSelectedPosition(item);
        this.props.syncCenterMap(center, zoom, item.land.quadKey);
    };

    getNoInfoView = () => {
        return (
            <Fragment>
                <div className='screen-content-error'>
                    <div className='warning'><div className="lnr lnr-warning lnr-custom-close" /> 정보 없음</div>
                </div>
                <div className='action-group'>
                    <button onClick={() => this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.default)}>
                        <img src='/images/game-ui/sm-back.svg' alt='' />
                        <div>뒤로</div>
                    </button>
                </div>
            </Fragment>
        );
    };

    loading = () => {
        return (
            <div className='load-land'>
                <div className='load__icon-wrap'>
                    <svg className='load__icon'>
                        <path fill='#4ce1b6' d='M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z' />
                    </svg>
                </div>
            </div>
        )
    };

    getCategoriesWithChild = () => {
        let { categories } = this.state;
        if (!categories) return;
        else if (categories.length === 0) return;
        //vuongsuangaymai
        let categorieNames = categories.map((item, index) => {
            return item.category.name
        });

        
        return (
            <Fragment>
                {categories.map((item, index) => (
                    <CateItem categorieNames={categorieNames} key={index}
                        cate={item}
                        renameCategory={(param) => this.renameCategory(param)}
                        renameLand={(arg) => this.renameLand(arg)}
                        dropItemToCate={(i) => this.dropItemToCate(i)}
                        moveToLand={this.moveToLand}
                        doCheckAndUpdateCategories={this.doCheckAndUpdateCategories} />
                ))}
            </Fragment>
        );
    };

    validate = (value) => {
        let errors = [];
        let rules = new Rules.ValidationRules();
        const rule1 = rules.checkLength(value, 36, '36 length limited');
        let hasError = rule1.hasError;
        if (hasError)
            errors.push(<React.Fragment key={errors.length + 1}>{rule1.error}</React.Fragment>);

        this.setState({ errors: errors });
        return hasError;
    };

    addCategory = (e) => {
        if (typeof e === "undefined") {
            const value = this.state.newCate;
            if (value.trim() === '') {
                this.setState({
                    alertConfirm: true
                })
            }
            else {
                const { user: { _id } } = this.props;
                //let result =
                this.props.addCategory(value, _id);
                this.handleHideAlertPopup();
            }
        }
        else {
            if (e.charCode === 13) {
                //if (this.validate(this.state.newCate)) return;
                const value = this.state.newCate;
                if (value.trim() === '') {
                    this.setState({
                        alertConfirm: true
                    })
                } else {
                    const { user: { _id } } = this.props;
                    this.props.addCategory(e.target.value, _id);
                    this.handleHideAlertPopup();
                }
            }
        }
    };

    renameCategory = (param) => {
        this.props.editCategory(param.input, param.userId, param.cateId);
    };

    deleteCategory = () => {
        let { categories } = this.state;
        const { user: { _id } } = this.props;
        if (!categories) return;
        else if (categories.length === 0) return;

        const excludeNames = ['empty'];
        const newCategories = differenceWith(categories, excludeNames,
            ({ category }, excludeName) => category.name === excludeName
        );

        if (!newCategories) return;
        else if (newCategories.length === 0) return;

        newCategories.map((item, index) => {
            if (item.checked)
                this.props.deleteLandCategory(_id, item._id, 'forbid');
            return null;
        });
    };

    renameLand = (arg) => {
        this.props.editLand(arg.input, arg.userId, arg.cateId, arg.landId);
    };

    updateInput = (e) => {
        this.setState({
            newCate: e.target.value,
            alertConfirm: false
        });
    };

    nextOffsetList = (offset) => this.setState({
        offsetX: this.state.offsetX === 66 ? this.state.offsetX : this.state.offsetX + offset
    });

    preOffsetList = (offset) => this.setState({
        offsetX: -this.state.offsetX === 0 ? this.state.offsetX : this.state.offsetX - offset
    });

    widthShopItem = 33;
    toggle = (data) => {
        this.setState({
            data
        })
    }
    getDefaultScreen = () => {
        const { noCategorySelected, data, categories, emptyLandAlert } = this.state;
        const categoriesFilter = categories.filter(c => c.checked);


        return (
            <Fragment>
                <div className='screen-title'>
                    <img src={loadingImage('/images/game-ui/tab2/nav1.svg')} alt='' />
                    <div>대법원의 조언</div>
                </div>
                <div className='screen-content-3' style={{paddingTop: '5px',height:'636px'}}>
                                <div className='my-forbid-land-management-list'>
                                    {this.getCategoriesWithChild()}
                                </div>
                            </div>
                            <div className='action-group'>
                                <button
                                    onClick={() => this.props.handleChangeScreen(this.props.PREVIOUS_SCREEN.default)}>
                                    <img src={loadingImage(`/images/game-ui/sm-back.svg`)} alt='' />
                                    <div>뒤로</div>
                                </button>
                                <button
                                    onClick={() => this._checkNumberCheckedCategory()}>
                                    <img src={loadingImage(`/images/game-ui/sm-add-folder.svg`)}
                                        alt='' />
                                    <div style={{ fontSize: '8px' }}>새 폴더</div>
                                </button>

                                {categoriesFilter.length === 0 ?
                                    <button onClick={() => this.setState({ noCategorySelected: true, data: 1 })}>
                                        <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)}
                                            alt='' />
                                        <div>삭제</div>
                                    </button> : <button
                                        onClick={() => this.handleShowAlertPopup(this.alertPopupScreen.deletedCateAlert)}>
                                        <img src={loadingImage(`/images/game-ui/sm-recycle.svg`)}
                                            alt='' />
                                        <div>삭제</div>
                                    </button>}

                                <SellLandPopup
                                    PREVIOUS_SCREEN={this.props.PREVIOUS_SCREEN}
                                    handleChangeScreen={this.props.handleChangeScreen}
                                    categories={this.state.categories}
                                    resetData={this.props.getAllCategory}
                                    uncheckAndUpdateCategories={this.uncheckAndUpdateCategories}
                                //parentScreenMyLand={ true }
                                />
                            </div>
                            {noCategorySelected && data === 1 &&
                                <UnselectedAlert content={'삭제할 폴더를 선택해주세요.'} toggle={(data) => this.toggle(data)} />}
                            {emptyLandAlert && (data === 1 || data === 2) &&
                                <UnselectedAlert content={data === 1 ? '이 기능을 사용하기 위해 나무를 심으십시오.'
                                    : '이 기능을 사용하기 위해 나무를 심으십시오'}
                                    //  이미 나무의 영양분이 충분합니다
                                    toggle={(data) => this.toggle(data)} />}
            </Fragment>
        );
    };

    _checkNumberCheckedCategory() {
        let filterCategory = [...this.state.categories].filter(cateItem => cateItem.checked);
        if (!Array.isArray(filterCategory)) return;
        if (filterCategory.length === 1) {
            const category = filterCategory[0].category;
            this.setState({
                changeCenterCategory: category,
                centerCategory: {
                    lat: (category.center && category.center.lat) || 0,
                    lng: (category.center && category.center.lng) || 0,
                }
            });
            this.handleShowAlertPopup(this.alertPopupScreen.addCenterCategoryAlert);
        } else {

        }
    }

    render() {
        const alertPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {this.screen.default === this.state.currentScreen ? this.getDefaultScreen() : null}
                {alertPopup}
            </Fragment>
        );
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
        noPopup: 10,
        nutrients: 12,
        removal: 13,
        harvest: 14,
        cultivation: 15,
        droplet: 16,
        waterSpray: 17,
        waterBucket: 18
    };

    updateInputLatCenterCategory = (e) => {
        this.setState({
            centerCategory: {
                lat: e.target.value,
                lng: this.state.centerCategory.lng,
            },
            alertConfirm: false
        });
    };

    updateInputLngCenterCategory = (e) => {
        this.setState({
            centerCategory: {
                lat: this.state.centerCategory.lat,
                lng: e.target.value,
            },
            alertConfirm: false
        });
    };

    addCenterCategory() {
        const { changeCenterCategory, centerCategory } = this.state;
        if (changeCenterCategory && centerCategory && centerCategory.lat && centerCategory.lng) {
            this.props.addCenterCategory({ cateId: changeCenterCategory._id, center: centerCategory });
        }
        this.handleHideAlertPopup();
    }

    confirmDeleteSelectedCat = () => {
        this.deleteCategory();
        this.handleShowAlertPopup(this.alertPopupScreen.deletedCateSuccessAlert);
    };

    // handleHideAllPopup = () => {
    //     this.handleHidePopup();
    //     this.handleHideAlertPopup();
    // }

    getAddFolderAlertPopup = () => {
        const { newCate, alertConfirm } = this.state;
        return (
            <Modal isOpen={this.state.modalAlertPopup} backdrop="static" className={`custom-modal modal--alert`}>
                <div className='custom-modal-header'>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHideAlertPopup()} />
                </div>
                <div className='custom-modal-body' style={{ paddingTop: '57px' }}>
                    <div className='container'>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <InputText value={this.state.newCate} onChange={(e) => this.updateInput(e)}
                                        onKeyPress={(e) => this.addCategory(e)} placeholder='폴더명 입력' />
                                    <div style={{
                                        display: alertConfirm ? 'block' : 'none', marginTop: '9px',
                                        color: 'red'
                                    }}>올바른 폴더명을 입력해주세요
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*{this.state.errors}*/}
                    </div>
                </div>
                <div className='custom-modal-footer'>
                    {newCate.trim() === '' ? <button onClick={() => {
                        this.setState({ alertConfirm: true })
                    }}>생성</button> : <button onClick={() => this.addCategory()}>생성</button>}
                    <button onClick={() => this.handleHideAlertPopup()}>취소</button>
                </div>
            </Modal>
        )
    };

    getAddCenterCategoryAlertPopup = () => {
        const { centerCategory: { lat, lng }, alertConfirm } = this.state;
        return (
            <Modal isOpen={this.state.modalAlertPopup} backdrop="static" className={`custom-modal modal--alert`}>
                <div className='custom-modal-header'>
                    새 폴더
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleHideAlertPopup()} />
                </div>
                <div className='custom-modal-body' style={{ paddingTop: '57px' }}>
                    <div className='container'>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <InputText value={lat} onChange={(e) => this.updateInputLatCenterCategory(e)} placeholder='latitude' />
                                    <InputText value={lng} onChange={(e) => this.updateInputLngCenterCategory(e)} placeholder='longtitude' />
                                    <div style={{
                                        display: alertConfirm ? 'block' : 'none', marginTop: '9px',
                                        color: 'red'
                                    }}>올바른 폴더명을 입력해주세요
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*{this.state.errors}*/}
                    </div>
                </div>
                <div className='custom-modal-footer'>
                    {/* centerCategory.trim() === '' ? <button onClick={() => {
                        this.setState({alertConfirm: true})
                    }}>생성</button> : <button onClick={() => this.addCenterCategory()}>생성</button>*/}
                    <button onClick={() => this.addCenterCategory()}>생성</button>
                    <button onClick={() => this.handleHideAlertPopup()}>취소</button>
                </div>
            </Modal>
        )
    };


    alertPopupScreen = {
        noPopup: 20,
        deletedCateAlert: 21,
        deletedCateSuccessAlert: 22,
        addFolderAlert: 23,
        errorInputAlert: 24,
        addCenterCategoryAlert: 25,
    };

    getAlertModalPopup = () => {
        return (
            <Fragment>
                {this.alertPopupScreen.deletedCateAlert === this.state.currentAlertPopUp && this.getDeletedCateAlertPopup() }
                {this.alertPopupScreen.deletedCateSuccessAlert === this.state.currentAlertPopUp && this.getDeletedCateSuccessAlertPopup() }
                {this.alertPopupScreen.addFolderAlert === this.state.currentAlertPopUp && this.getAddFolderAlertPopup() }
                {this.alertPopupScreen.errorInputAlert === this.state.currentAlertPopUp && this.getErrorInputAlertPopup() }
                {this.alertPopupScreen.addCenterCategoryAlert === this.state.currentAlertPopUp && this.getAddCenterCategoryAlertPopup() }
            </Fragment>
        );
    };

    getErrorInputAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "error"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = '알림';
        const body = '올바른 폴더명을 입력해주세요';
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };

    getDeletedCateAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "question"; //question //info //customize
        const yesBtn = () => this.confirmDeleteSelectedCat();
        const noBtn = () => this.handleHideAlertPopup();
        const header = '삭제하기';
        const body = '선택한 랜드를 정말 삭제하시겠습니까?';
        return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
    };

    getDeletedCateSuccessAlertPopup = () => {
        const modal = this.state.modalAlertPopup;
        const mode = "info"; //question //info //customize
        const sign = "success"; //blood //success //error //delete //loading
        const confirmBtn = () => this.handleHideAlertPopup();
        const header = `완료`;
        const body = `삭제를 완료 하였습니다.`;
        return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
    };
}


function mapStateToProps(state) {
    const { lands, authentication: { user }, map, landCharacterReducer, settingReducer: { gameMode } } = state;
    return {
        lands,
        user,
        map,
        landCharacterReducer, gameMode
    };
}


const mapDispatchToProps = (dispatch) => {
    return {
        getAllLandMarkCategory: ({ userId }) => dispatch(landActions.getAllLandMarkCategory({ userId })),
        addCenterCategory: ({ cateId, center }) => dispatch(landActions.addCenterCategory({ cateId, center })),
        sellLandSocket: (objSellLand) => dispatch(socketActions.sellLandSocket(objSellLand)),
        getAllCategory: (userId) => {
            dispatch(landActions.getAllCategory({ userId: userId }));
        },
        transferLandCategory: (userId, lands, oldCateId, newCateId) => {
            dispatch(landActions.transferLandCategory({
                userId: userId,
                lands: lands,
                oldCateId: oldCateId,
                newCateId: newCateId
            }));
        },
        editLand: (name, userId, cateId, landId) => dispatch(landActions.editLand({ name: name, userId: userId, cateId: cateId, landId: landId })),
        addCategory: (name, userId) => dispatch(landActions.addCategory({ name: name, userId: userId })),
        editCategory: (name, userId, cateId) => dispatch(landActions.editCategory({ name: name, userId: userId, cateId: cateId })),
        deleteLandCategory: (userId, cateId, mode) => dispatch(landActions.deleteLandCategory({ userId, cateId, mode })),
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
        saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
    };
};
const DragDropLandManagement = DragDropContext(HTML5Backend)(LandManagement);
const connectedPage = connect(mapStateToProps, mapDispatchToProps)(DragDropLandManagement);
export default connectedPage;