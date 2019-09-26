import "./PackagePage.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import { STATE, CATEGORY_CODE } from "shared/constant/package.const";
import ProductObject from "shared/components/products/edit/ProductObject";

import PackageBasic from "./components/PackageBasic";
import PackageOption from "./components/PackageOption";
import PackageContent from "./components/PackageContent";
import PackagePortfolio from "./components/PackagePortfolio";
import PackageVideo from "./components/PackageVideo";

class PackagePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: "",
            category: null,
            option: {},
            detail: {},
            portfolio: {},
            renderLayout: null,
            step: {
                basic: { title: "1단계", content: "기본정보를 입력하세요." },
                option: { title: "2단계", content: "패키지 및 옵션 설정을 입력하세요." },
                detail: { title: "3단계", content: "상세 세부사항을 입력하세요." },
                portfolio: { title: "최종단계", content: "포트폴리오 사진을 등록해주세요.", content2: "이미지를 등록해주세요." },
                video: { title: "최종단계", content: "포트폴리오 영상을 등록해주세요.", content2: "이미지를 등록해주세요." }
            },
            loading: false
        };

        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onComplete = this.onComplete.bind(this);

        this.isUser = this.isUser.bind(this);
        this.redirectComplete = this.redirectComplete.bind(this);
        this.renderLayout = this.renderLayout.bind(this);
    }

    componentWillMount() {
        ProductObject.init();
    }

    componentDidMount() {
        const { productNo, path } = this.props;
        const promise = [];

        promise.push(API.products.categorys());

        if (productNo) {
            const user = auth.getUser();
            promise.push(API.artists.getProductInfo(user.id, productNo));
        }

        Promise.all(promise)
            .then(response => {
                if (response) {
                    const resCategory = response[0];
                    const resProduct = response[1];
                    let prop = {
                        loading: true
                    };

                    if (resProduct) {
                        const data = resProduct.data;

                        ProductObject.setState(STATE.PRODUCT_NO, data.product_no);
                        ProductObject.setState(STATE.BASIC.key, {
                            [STATE.BASIC.TITLE]: data[STATE.BASIC.TITLE] || "",
                            [STATE.BASIC.CATEGORY]: data[STATE.BASIC.CATEGORY] || "",
                            [STATE.BASIC.AGREE]: data[STATE.BASIC.AGREE] || false
                        });

                        const isBiz = ProductObject.isBiz();
                        let pkg = data[STATE.OPTION.PACKAGE.key];

                        if (!isBiz) {
                            if (!pkg && data.option) {
                                pkg = data.option.reduce((rs, obj) => {
                                    rs.push({
                                        [STATE.OPTION.PACKAGE.TITLE]: obj.option_name || "",
                                        [STATE.OPTION.PACKAGE.CONTENT]: obj.option_content || "",
                                        [STATE.OPTION.PACKAGE.PRICE]: obj.price || "",
                                        [STATE.OPTION.PACKAGE.MIN_PRICE]: "",
                                        [STATE.OPTION.PACKAGE.PHOTO_TIME]: "",
                                        [STATE.OPTION.PACKAGE.PHOTO_CNT]: obj.min_cut_cnt || "",
                                        [STATE.OPTION.PACKAGE.CUSTOM_CNT]: obj.custom_cnt || "",
                                        [STATE.OPTION.PACKAGE.PERIOD]: ""
                                    });

                                    return rs;
                                }, []);
                            }
                        }

                        ProductObject.setOptionState(STATE.OPTION.PACKAGE.key, ProductObject.initPackage(pkg));
                        ProductObject.setOptionState(STATE.OPTION.EXTRA_OPTION.key, ProductObject.initExtra(data[STATE.OPTION.EXTRA_OPTION.key]));
                        ProductObject.setOptionState(STATE.OPTION.CUSTOM_OPTION.key, data[STATE.OPTION.CUSTOM_OPTION.key] || []);

                        ProductObject.setState(STATE.DETAIL.key, {
                            [STATE.DETAIL.CONTENT]: isBiz ? "" : (data[STATE.DETAIL.CONTENT] || ""),
                            [STATE.DETAIL.TAG]: utils.search.params(data[STATE.DETAIL.TAG]) || "",
                            [STATE.DETAIL.DESCRIPTION]: data[STATE.DETAIL.DESCRIPTION] ? data[STATE.DETAIL.DESCRIPTION].toString() : "",
                            [STATE.DETAIL.REGION]: isBiz ? [] : (data[STATE.DETAIL.REGION] || [])
                        });
                    }

                    if (resCategory) {
                        const data = resCategory.data;
                        const categoryList = data.category.reduce((result, obj) => {
                            if (obj.code !== "AD") {
                                result.push(obj);
                            }

                            return result;
                        }, []);

                        prop = Object.assign(prop, ProductObject.setState(STATE.CATEGORY_CODES, categoryList));
                    }

                    const progress = ProductObject.checkProgress();
                    prop = Object.assign(prop, this.renderLayout(progress.path === "portfolio" ? path : progress.path));

                    this.setState(prop);
                }
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    onPrev() {
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = this.isUser();

        if (user) {
            switch (this.state.path) {
                case "option":
                    if (productNo) {
                        this.setState(this.renderLayout("basic"));
                    } else {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "잘못된 접근입니다",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                    }
                    break;
                case "detail":
                    if (productNo) {
                        if (ProductObject.isBiz()) {
                            this.setState(this.renderLayout("basic"));
                        } else {
                            this.setState(this.renderLayout("option"));
                        }
                    } else {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "잘못된 접근입니다",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                    }
                    break;
                case "portfolio":
                case "video":
                    if (productNo) {
                        this.setState(this.renderLayout("detail"));
                    } else {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "잘못된 접근입니다",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }

    onNext() {
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = this.isUser();

        if (user) {
            switch (this.state.path) {
                case "basic":
                    if (productNo) {
                        const request = ProductObject.apiBasic(user.id);
                        if (request) {
                            request.then(response => {
                                if (response.status === 200) {
                                    if (ProductObject.isBiz()) {
                                        this.setState(this.renderLayout("detail"));
                                    } else {
                                        this.setState(this.renderLayout("option"));
                                    }
                                }
                            });
                        }
                    } else {
                        const request = ProductObject.apiRegisterProduct(user.id);
                        if (request) {
                            request.then(response => {
                                if (response.status === 200) {
                                    if (ProductObject.isBiz()) {
                                        this.setState(this.renderLayout("detail"));
                                    } else {
                                        this.setState(this.renderLayout("option"));
                                    }
                                }
                            });
                        }
                    }
                    break;
                case "option":
                    if (productNo) {
                        const request = ProductObject.apiOption(user.id);
                        if (request) {
                            request.then(response => {
                                if (response.status === 200) {
                                    this.setState(this.renderLayout("detail"));
                                }
                            });
                        }
                    } else {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "잘못된 접근입니다",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                    }
                    break;
                case "detail":
                    if (productNo) {
                        const request = ProductObject.apiDetail(user.id);
                        if (request) {
                            request.then(response => {
                                if (response.status === 200) {
                                    if (["VIDEO", "VIDEO_BIZ"].indexOf(ProductObject.getCategoryCode()) !== -1) {
                                        this.setState(this.renderLayout("video"));
                                    } else {
                                        this.setState(this.renderLayout("portfolio"));
                                    }
                                }
                            });
                        }
                    } else {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "잘못된 접근입니다",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }

    onComplete() {
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = this.isUser();

        if (user) {
            const category = ProductObject.getCategoryCode();

            if (["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1) {
                const valid = ProductObject.isValidateVideo();
                if (valid.status) {
                    const promise = [];

                    if (valid.video_list) {
                        promise.push(API.artists.updatePortfolioVideo(user.id, productNo, { main_video: valid.main_video, video_list: JSON.stringify(valid.video_list) }));
                    }

                    if (valid.updatePortfolio && utils.isArray(valid.portfolio)) {
                        promise.push(API.artists.updateDisplayOrder(user.id, productNo, { photo_list: JSON.stringify(valid.portfolio) }));
                    }

                    Promise.all(promise)
                        .then(response => {
                            this.redirectComplete();
                        })
                        .catch(error => {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                name: "package-video-valid",
                                content: utils.linebreak(error.data)
                            });
                        });
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "package-video-valid",
                        content: utils.linebreak(valid.message)
                    });
                }
            } else {
                const valid = ProductObject.isValidatePortfolio();
                if (valid.status) {
                    if (valid.isUpdate && utils.isArray(valid.portfolio)) {
                        API.artists.updateDisplayOrder(user.id, productNo, { photo_list: JSON.stringify(valid.portfolio) })
                            .then(response => {
                                this.redirectComplete();
                            })
                            .catch(error => {
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    name: "package-portfolio-valid",
                                    content: error.data
                                });
                            });
                    } else {
                        this.redirectComplete();
                    }
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "package-portfolio-valid",
                        content: valid.message
                    });
                }
            }
        }
    }

    /**
     * 로그인 확인
     * @return Object - 유저정보
     */
    isUser(isAlert = true) {
        const user = auth.getUser();

        if (!user) {
            if (isAlert) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "로그인 후 이용해주세요"
                });
            }

            return false;
        }

        return user;
    }

    redirectComplete() {
        if (window.location.pathname === "/artists/product/edit") {
            const router = this.context.router;
            router.push("/artists/product/list");
        } else {
            Modal.close("product_edit");
        }
    }

    renderLayout(path) {
        const prop = {
            path
        };

        switch (path) {
            case "option":
                prop.renderLayout = <PackageOption key="package-option" />;
                break;
            case "detail":
                prop.renderLayout = <PackageContent key="package-content" />;
                break;
            case "portfolio": {
                const productNo = ProductObject.getState(STATE.PRODUCT_NO);
                prop.renderLayout = <PackagePortfolio key="package-portfolio" productNo={productNo} />;
                break;
            }
            case "video": {
                const productNo = ProductObject.getState(STATE.PRODUCT_NO);
                prop.renderLayout = <PackageVideo key="package-video" productNo={productNo} />;
                break;
            }
            case "basic":
            default:
                prop.renderLayout = <PackageBasic key="package-basic" data={this.state.basic} />;
                break;
        }

        return prop;
    }

    render() {
        const { renderLayout, step, path, loading } = this.state;

        if (!path || !loading) {
            return null;
        }

        const { title, content, content2 } = step[path];
        const category = ProductObject.getCategory();
        let header_title = title;

        if (path === "detail" && ProductObject.isBiz()) {
            header_title = "2단계";
        }

        return (
            <div className="product__package">
                <div className="product__package__header">
                    <h1>
                        <span className="h__title">{header_title}</span><br /><span className="h__content">
                            {path === "portfolio" && category && category.code === CATEGORY_CODE.DRESS_RENT ? content2 : content}
                        </span>
                    </h1>
                </div>
                <div className="product__package__body">
                    {renderLayout}
                </div>
                <div className="product__package__footer">
                    {path !== "basic" ? <button className="f__button" value="이전단계" onClick={this.onPrev}><span>이전단계</span></button> : null}
                    {["portfolio", "video"].indexOf(path) === -1 ?
                        <button className="f__button" value="다음단계 진행하기" onClick={this.onNext}><span>다음단계 진행하기</span></button> :
                        <button className="f__button f__button__theme__pink" value="완료" onClick={this.onComplete}><span>완료</span></button>
                    }
                </div>
            </div>
        );
    }
}

PackagePage.contextTypes = {
    router: routerShape
};

PackagePage.propTypes = {
    productNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    path: PropTypes.string
};

PackagePage.defaultProps = {
    path: "basic"
};

export default PackagePage;
