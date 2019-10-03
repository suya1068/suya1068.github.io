import "./chargeProduct.scss";
import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import api from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import ChargeManager from "./components/ChargeManager";
import ChargeListContainer from "./components/list/ChargeListContainer";
import ChargeInfo from "./components/info/ChargeInfo";
import PopModal from "../../../../../../shared/components/modal/PopModal";

export default class ChargeProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            listShotFlag: false,
            active: {
                pay: false,
                free: false
            },
            freeCategory: ["INTERIOR", "PROFILE_BIZ", "VIDEO_BIZ"]
        };

        this.combineProducts = this.combineProducts.bind(this);
        this.getProducts = this.getProducts.bind(this);
        this.getChargeProduct = this.getChargeProduct.bind(this);
        this.getChargeProductList = this.getChargeProductList.bind(this);
        this.exchangeStatus = this.exchangeStatus.bind(this);
    }

    componentDidMount() {
        this.getProducts();
        const user = auth.getUser();
        api.artists.getChargeProduct(user.id, { offset: 0, limit: 100 })
            .then(response => {
                PopModal.closeProgress();
                const { freeCategory } = this.state;
                const data = response.data;
                const active = data.list.reduce((r, o) => {
                    const status = this.exchangeStatus(o);
                    if ((status === "노출중" || status === "승인대기중") && (r.pay === null || r.free === null)) {
                        const type = status === "노출중";
                        if (!o.pay_type) {
                            const product_list = o.product_list || [];
                            let isFree = false;
                            for (let i = 0; i < product_list.length; i += 1) {
                                const item = product_list[i];
                                isFree = freeCategory.includes(item.category);

                                if (!isFree) {
                                    break;
                                }
                            }

                            if (isFree && r.free !== true) {
                                r.free = type;
                            } else if (r.pay !== true) {
                                r.pay = type;
                            }
                        } else if (o.pay_type === "free" && r.free !== true) {
                            r.free = type;
                        } else if (r.pay !== true) {
                            r.pay = type;
                        }
                    }
                    return r;
                }, { pay: null, free: null });

                this.setState({
                    active
                });
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    /**
     * 노출중인 상품만 조합
     */
    combineProducts(list) {
        return list.reduce((result, p) => {
            if (p.display_yn === "Y" && utils.checkCategoryForEnter(p.category_code)) {
                result.push(p);
            }
            return result;
        }, []);
    }

    getProducts() {
        const user = auth.getUser();
        if (user) {
            api.artists.listProduct(user.id)
                .then(response => {
                    this.setState({
                        products: this.combineProducts(response.data.list)
                    });
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }
    }

    getChargeProduct() {
        this.setState({ listShotFlag: true }, () => {
            this.setState({ listShotFlag: false });
        });
    }

    getChargeProductList({ offset, limit }) {
        const user = auth.getUser();
        return api.artists.getChargeProduct(user.id, { offset, limit })
            .then(response => {
                PopModal.closeProgress();
                const { freeCategory } = this.state;
                const data = response.data;
                const active = data.list.reduce((r, o) => {
                    const status = this.exchangeStatus(o);
                    if ((status === "노출중" || status === "승인대기중") && (r.pay === null || r.free === null)) {
                        const type = status === "노출중";
                        if (!o.pay_type) {
                            const product_list = o.product_list || [];
                            let isFree = false;
                            for (let i = 0; i < product_list.length; i += 1) {
                                const item = product_list[i];
                                isFree = freeCategory.includes(item.category);

                                if (!isFree) {
                                    break;
                                }
                            }

                            if (isFree && r.free !== true) {
                                r.free = type;
                            } else if (r.pay !== true) {
                                r.pay = type;
                            }
                        } else if (o.pay_type === "free" && r.free !== true) {
                            r.free = type;
                        } else if (r.pay !== true) {
                            r.pay = type;
                        }
                    }
                    return r;
                }, { pay: null, free: null });

                this.setState({
                    active
                });

                return data;
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    exchangeStatus(data) {
        const requestStatus = data.request_status;
        const paymentStatus = data.payment_status;

        const today = mewtime();

        const isBeforeEndDt = data.start_dt ? today.isBefore(mewtime(data.start_dt)) : null;
        const isAfterStartDt = data.end_dt ? today.isAfter(mewtime(data.end_dt)) : null;
        const payType = data.pay_type;

        let status = "";

        if (data.del_dt) {
            status = "삭제";
        } else if (requestStatus === "READY" && !paymentStatus) {
            status = "승인대기중";
        } else if (requestStatus === "COMPLETE" && paymentStatus !== "COMPLETE") {
            status = "승인완료";
            if (data.start_dt && data.end_dt && !isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
            }

            if (payType === "vbank") {
                if (data.vbank_date && today.isAfter(mewtime(data.vbank_date))) {
                    status = "만료";
                }
            } else if (data.paid_limit_dt && today.isAfter(mewtime(data.paid_limit_dt))) {
                status = "만료";
            }
        } else if (requestStatus === "COMPLETE" && paymentStatus === "COMPLETE") {
            if (!isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
            } else if (isAfterStartDt) {
                status = "만료";
            }
        } else if (requestStatus === "RETURN" || requestStatus === "CANCEL") {
            status = "비승인";
        } else if (requestStatus === "COMPLETE" && paymentStatus === "CANCEL") {
            status = "노출중";
        } else if (requestStatus === "REQUEST") {
            status = "추가승인중";
        } else {
            status = requestStatus;
        }

        return status;
    }

    render() {
        const { products, listShotFlag, active } = this.state;
        return (
            <div key="product-charge" className="product-charge">
                <div className="section-title">
                    <h4 className="h4-sub text-bold">광고관리</h4>
                    <p className="h5-caption">광고 신청 시 해당 카테고리 리스트페이지 상단 (랜덤노출) 및 포스냅 포트폴리오 영역에 노출됩니다.<br />
                        <strong>광고를 결제하시면 광고기간 내에 모든 상품을 카테고리당 1개씩 등록 가능합니다.</strong>
                    </p>
                </div>
                <div className="product-charge__select-section">
                    <ChargeManager products={products} getChargeProduct={this.getChargeProduct} active={active} />
                </div>
                <div className="product-charge__list-section">
                    <ChargeListContainer products={products} shot={listShotFlag} getChargeProductList={this.getChargeProductList} />
                </div>
                <div className="product-charge__info-section">
                    <ChargeInfo />
                </div>
            </div>
        );
    }
}
