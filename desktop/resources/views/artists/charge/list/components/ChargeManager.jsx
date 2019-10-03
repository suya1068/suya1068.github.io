import "./chargeManager.scss";
import React, { Component, PropTypes } from "react";
import ChargePeriod from "./period/ChargePeriod";
import ProductSelect from "./select/ProductSelect";
import Buttons from "desktop/resources/components/button/Buttons";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import PopModal from "shared/components/modal/PopModal";
// import ChargePayment from "./payment/ChargePayment";

import auth from "forsnap-authentication";
import api from "forsnap-api";
import utils from "forsnap-utils";

export default class ChargeManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser(),
            category: "",
            freeCategory: ["INTERIOR", "PROFILE_BIZ", "VIDEO_BIZ"],
            selectProducts: [],
            isFree: false
        };

        /**
         * 하위 인스턴스
         */
        this.ChargePayment = null;
        this.ChargePeriod = null;

        this.onSelectProduct = this.onSelectProduct.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
    }

    onSelectProduct(selectProducts) {
        const { freeCategory } = this.state;
        let isFree = false;

        for (let i = 0; i < selectProducts.length; i += 1) {
            const o = selectProducts[i];
            isFree = freeCategory.includes(o.category_code);

            if (!isFree) {
                break;
            }
        }

        this.setState({
            selectProducts,
            isFree
        });
    }

    insertChargeProduct(id, params) {
        return api.artists.insertChargeProduct(id, params);
    }

    onSubmit() {
        const { active } = this.props;
        const { user, selectProducts, isFree } = this.state;
        const chargePeriodInst = this.ChargePeriod;

        // const chargePaymentInst = this.ChargePayment;

        const getPaymentWeek = chargePeriodInst.getPaymentWeek();
        const getTotalPrice = chargePeriodInst.getTotalPrice();
        const getAddDate = chargePeriodInst.getAddDate();
        // const getPaymethod = chargePaymentInst.getPaymentMethod();

        if (!Array.isArray(selectProducts) || !selectProducts.length) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "상품을 선택해주세요"
            });
        } else if (active.free !== null && isFree) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(active.free ? "현재 결제중인 상품이 있습니다.\n광고신청현황에서 상품을 추가해주세요." : "현재 승인대기중인 상품이 있습니다.\n승인완료 후 광고신청현황에서 상품을 추가해주세요.")
            });
        } else if (active.pay !== null && !isFree) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(active.pay ? "현재 결제중인 상품이 있습니다.\n광고신청현황에서 상품을 추가해주세요." : "현재 승인대기중인 상품이 있습니다.\n승인완료 후 광고신청현황에서 상품을 추가해주세요.")
            });
        } else {
            PopModal.progress();
            const params = {
                price: isFree ? 0 : getTotalPrice,
                week: getPaymentWeek,
                product_no: selectProducts.map(o => o.product_no).join(",")
            };

            if (getAddDate) {
                params.add_period = getAddDate;
            }

            this.insertChargeProduct(user.id, params)
                .then(response => {
                    PopModal.closeProgress();
                    if (response.status === 200) {
                        if (typeof this.props.getChargeProduct === "function") {
                            this.props.getChargeProduct();
                        }

                        let message = "유료광고 신청이 완료되었습니다.\n신청 후 약 2영업일 이내 처리됩니다.";

                        if (isFree) {
                            message = "광고신청이 완료되었습니다.\n신청 후 약 2영업일 이내 처리됩니다.";
                        }

                        PopModal.alert(message);
                    }
                })
                .catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data);
                });
        }
    }

    render() {
        const { products } = this.props;
        const { isFree } = this.state;
        return (
            <div className="charge-manager">
                <ProductSelect list={products} onSelectProduct={this.onSelectProduct} />
                <ChargePeriod ref={instance => (this.ChargePeriod = instance)} isFree={isFree} />
                {/*<ChargePayment ref={instance => (this.ChargePayment = instance)} />*/}
                <div className="charge-manager-btn">
                    <Buttons buttonStyle={{ theme: "default", shape: "circle", width: "w179" }} inline={{ onClick: this.onSubmit }}>광고신청</Buttons>
                </div>
            </div>
        );
    }
}
