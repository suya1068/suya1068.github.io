import "./ProductsConceptPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import api from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

import { CONCEPT_LIST } from "shared/constant/product.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import ChargeCount from "shared/helper/charge/ChargeCount";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

import ProductsConceptSearch from "./components/ProductsConceptSearch";
import ProductsConceptImages from "./components/ProductsConceptImages";
import ProductsConceptConsult from "./components/ProductsConceptConsult";
import CompleteModal from "./modal/CompleteModal";

class ProductsConceptPage extends Component {
    constructor(props) {
        super(props);

        const category_code = document.getElementById("category_code");
        const category_name = document.getElementById("category_name");

        this.state = {
            isMount: true,
            depth_data: null,
            depth_info: [],
            depth_images: [],
            images_list: [],
            concept_data: null,
            category_code: category_code ? category_code.getAttribute("content") : "",
            category_name: category_name ? category_name.getAttribute("content") : "",
            select: {},
            recommend: ""
        };

        this.chargeCount = new ChargeCount();

        this.onSelectDepth = this.onSelectDepth.bind(this);
        this.onSelectRecommend = this.onSelectRecommend.bind(this);
        this.onShowConsultModal = this.onShowConsultModal.bind(this);
        this.onConsult = this.onConsult.bind(this);

        this.artistConsult = this.artistConsult.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.getConceptInfo = this.getConceptInfo.bind(this);
        this.getConceptImages = this.getConceptImages.bind(this);
        this.removeDuplicateImages = this.removeDuplicateImages.bind(this);
        this.createDepthImages = this.createDepthImages.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const { category_code } = this.state;
        const concept_data = CONCEPT_LIST[category_code];

        this.chargeCount.init();

        const chargeMaxCount = this.chargeCount.getMaxCount();
        const crc = this.chargeCount.getCRC();

        this.setStateData(() => {
            return {
                concept_data,
                crc,
                chargeMaxCount
            };
        });
    }

    componentDidMount() {
        const { category_code, concept_data } = this.state;

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        this.getConceptInfo(category_code)
            .then(data => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (data[category_code]) {
                    const depth_data = data[category_code];
                    const depth_info = depth_data.map(o => {
                        return {
                            ...o,
                            depth2: o.depth2.split(",")
                        };
                    });

                    this.setStateData(() => {
                        return {
                            depth_data,
                            depth_info
                        };
                    }, () => {
                        const recommend = concept_data.recommend;
                        const keys = Object.keys(recommend);
                        const key = keys ? keys[0] : "";
                        if (key && recommend[key]) {
                            this.onSelectRecommend(key, recommend[key].depth2);
                        }
                    });
                }
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onSelectDepth(depth1, depth2) {
        const { category_code, category_name, select, depth_images } = this.state;
        const count = Object.keys(select).reduce((r, k) => {
            const item = select[k];
            return r + item.length;
        }, 0);

        const depth = select[depth1] || [];
        const depth_idx = depth.indexOf(depth2);

        if (depth_idx > -1) {
            const prop = {
                recommend: ""
            };
            depth.splice(depth_idx, 1);

            const image_idx = depth_images.findIndex(o => {
                return o.depth1 === depth1 && o.depth2 === depth2;
            });

            if (image_idx > -1) {
                depth_images.splice(image_idx, 1);
                prop.depth_images = depth_images;
                prop.images_list = this.removeDuplicateImages(depth_images);
            }

            prop.select = Object.assign({}, select, { [depth1]: depth });

            this.setStateData(() => {
                return prop;
            });
        } else if (count < 5) {
            depth.push(depth2);

            this.gaEvent("항목선택", `${category_name}_${depth1}_${depth2}`);

            const params = {
                category: category_code,
                depth1,
                depth2
            };

            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
            this.getConceptImages(params)
                .then(data => {
                    Modal.close(MODAL_TYPE.PROGRESS);

                    this.setStateData(state => {
                        state.depth_images.push({
                            depth1,
                            depth2,
                            list: data.list
                        });

                        return {
                            recommend: "",
                            depth_images: state.depth_images,
                            images_list: this.removeDuplicateImages(state.depth_images)
                        };
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    }
                });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "컨셉은 5개까지 선택 가능합니다."
            });
        }
    }

    onSelectRecommend(recom, depth2) {
        const {
            recommend,
            depth_info,
            concept_data,
            category_code,
            category_name
        } = this.state;

        if (recommend !== recom) {
            const promise = [];
            const select = depth2.reduce((r, o) => {
                const find = depth_info.find(d => {
                    return d.depth2.includes(o);
                });

                if (find) {
                    if (r[find.depth1]) {
                        r[find.depth1].push(o);
                    } else {
                        r[find.depth1] = [];
                        r[find.depth1].push(o);
                    }

                    const params = {
                        category: category_code,
                        depth1: find.depth1,
                        depth2: o
                    };

                    promise.push(this.getConceptImages(params)
                        .then(data => {
                            return {
                                ...params,
                                list: data.list
                            };
                        })
                    );
                }
                return r;
            }, {});

            if (promise.length) {
                Modal.show({
                    type: MODAL_TYPE.PROGRESS
                });
                Promise.all(promise)
                    .then(response => {
                        Modal.close(MODAL_TYPE.PROGRESS);
                        const depth_images = response.reduce((r, images) => {
                            r.push({
                                depth1: images.depth1,
                                depth2: images.depth2,
                                list: images.list
                            });

                            return r;
                        }, []);

                        this.setStateData(() => {
                            return {
                                depth_images,
                                images_list: this.removeDuplicateImages(depth_images)
                            };
                        });
                    })
                    .catch(error => {
                        Modal.close(MODAL_TYPE.PROGRESS);
                        if (error && error.data) {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: utils.linebreak(error.data)
                            });
                        }
                    });
            }

            const recommend_data = concept_data.recommend[recom];
            this.gaEvent("추천컨셉선택", `${category_name}_${recommend_data.title || ""}`);

            this.setStateData(() => {
                return {
                    select,
                    recommend: recom
                };
            });
        }
    }

    onShowConsultModal(data) {
        const { chargeMaxCount, crc } = this.state;
        const p = {
            access_type: "concept",
            device_type: "desktop",
            category: data.category,
            artist_id: data.user_id,
            portfolio_no: data.portfolio_no,
            product_no: data.product_no
        };

        if (chargeMaxCount - crc === 0) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: <p>포스냅에서는 최대 3명의 작가님께 견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담 혹은 고객센터로 문의내용을 접수해주세요.</p>
            });
        } else {
            // 작가님께 연락처와 선택하신 컨셉이 바로 전달됩니다.
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                content: (
                    <ConsultModal
                        title="작가님께 연락처와 선택하신 컨셉이 바로 전달됩니다."
                        nickName={data.nick_name}
                        requestAbleCount={3 - crc}
                        isTypeRecommendArtist
                        isAgree={false}
                        onConsult={d => {
                            const params = Object.assign({}, d, p);
                            this.artistConsult(params);
                        }}
                        onClose={() => Modal.close()}
                    />
                )
            });
        }
    }

    onConsult(data) {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        api.orders.insertAdviceOrders(data)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);

                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.")
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    artistConsult(data) {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        api.orders.insertArtistOrder(data)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                this.chargeCount.setCRC();
                Modal.close();
                Modal.show({
                    type: MODAL_TYPE.CUSTOM,
                    content: <CompleteModal close={() => Modal.close()} />
                });

                this.setStateData(() => {
                    return {
                        crc: this.chargeCount.getCRC()
                    };
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    gaEvent(action, label) {
        utils.ad.gaEvent("기업_컨셉", action, label);
    }

    removeDuplicateImages(depth_images) {
        return depth_images.reduce((r, o) => {
            const list = [].concat(o.list);

            for (let li = 0; li < r.length; li += 1) {
                const old_list = r[li];

                for (let oi = 0; oi < old_list.list.length; oi += 1) {
                    const old_item = old_list.list[oi];
                    const idx = list.findIndex(image_item => {
                        return image_item.portfolio_no === old_item.portfolio_no;
                    });

                    // if (list.length < 4) {
                    //     break;
                    // }

                    if (idx > -1) {
                        list.splice(idx, 1);
                    }
                }
            }

            r.push({
                depth1: o.depth1,
                depth2: o.depth2,
                list
            });

            return r;
        }, []);
    }

    getConceptInfo(category) {
        return api.products.findConceptInfo({ category })
            .then(response => {
                return response.data;
            });
    }

    getConceptImages(data) {
        return api.products.findConceptImages(data)
            .then(response => {
                return response.data;
            });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    createDepthImages() {
        const { category_code, category_name, depth_images, images_list, concept_data } = this.state;

        if (!Array.isArray(images_list) || !images_list.length) {
            return (
                <div className="concept__images__container">
                    <div className="images__empty">
                        <img alt="!" src={`${__SERVER__.img}/common/icon/icon_exclamation.png`} width="60" />
                        <div className="title">원하는 컨셉을 선택하시면 맞춤 이미지를 확인하실 수 있습니다.</div>
                    </div>
                </div>
            );
        }

        return images_list.map(o => {
            return (
                <ProductsConceptImages
                    key={o.depth2}
                    category_code={category_code}
                    category_name={category_name}
                    depth1={o.depth1}
                    title={o.depth2}
                    description={concept_data.text_depth2[o.depth2] || ""}
                    data={o.list}
                    gaEvent={this.gaEvent}
                    onShowConsultModal={this.onShowConsultModal}
                />
            );
        });
    }

    render() {
        const { depth_info, concept_data, select, recommend } = this.state;

        if (!concept_data) {
            return null;
        }

        return (
            <div className="products__concept__page">
                <div className="concept__container">
                    <div className="concept__row">
                        <div className="concept__header">
                            <div className="title">{concept_data.title}</div>
                            <div className="description">{concept_data.description}</div>
                        </div>
                    </div>
                    <div className="concept__row">
                        <ProductsConceptSearch
                            data={depth_info}
                            recommend_list={concept_data.recommend}
                            select={select}
                            recommend={recommend}
                            onSelectDepth={this.onSelectDepth}
                            onSelectRecommend={this.onSelectRecommend}
                        />
                    </div>
                    <div className="concept__row">
                        {this.createDepthImages()}
                    </div>
                </div>
                <div className="concept__container concept__consult">
                    <div className="concept__row">
                        <ProductsConceptConsult onConsult={this.onConsult} access_type="concept" />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <div id="site-main">
            <ProductsConceptPage />
        </div>
        <Footer />
    </App>,
    document.getElementById("root")
);
