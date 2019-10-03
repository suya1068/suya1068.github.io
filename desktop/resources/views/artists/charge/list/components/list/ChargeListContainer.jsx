import "./chargeList.scss";
import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import Payment from "shared/components/payment/Payment";
import PopModal from "shared/components/modal/PopModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import PopChargePayment from "../pop/PopChargePayment";
import ChargePagination from "../pagination/ChargePagination";
import ChargeList from "./ChargeList";
import ModifyModal from "./ModifyModal";

export default class ChargeListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shot: props.shot,
            chargeList: [],
            limit: 8,
            offset: 0,
            totalCount: 0,
            user: auth.getUser()
        };

        this.onShowModify = this.onShowModify.bind(this);
        this.onAddProduct = this.onAddProduct.bind(this);
        this.onDeleteProduct = this.onDeleteProduct.bind(this);
        this.onPayment = this.onPayment.bind(this);
        this.onPageMove = this.onPageMove.bind(this);
        this.payment = this.payment.bind(this);
        this.loadPaymentModule = this.loadPaymentModule.bind(this);
        this.getChargeProduct = this.getChargeProduct.bind(this);
    }

    componentWillMount() {
        this.getChargeProduct();
    }

    componentWillReceiveProps(np) {
        if (np.shot) {
            this.getChargeProduct();
        }
    }

    onShowModify(data) {
        const { products } = this.props;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: <ModifyModal
                data={data}
                products={products}
                onAddProduct={this.onAddProduct}
                onDeleteProduct={this.onDeleteProduct}
                onClose={() => Modal.close()}
            />
        });
    }

    onAddProduct(artist_id, charge_buy_no, params) {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        return api.artists.insertChargeAddProduct(artist_id, charge_buy_no, params)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                const data = response.data;
                delete data.session_info;
                this.setState(state => {
                    const chargeList = state.chargeList.reduce((r, o) => {
                        if (o.charge_buy_no === data.charge_buy_no) {
                            r.push(data);
                        } else {
                            r.push(o);
                        }

                        return r;
                    }, []);

                    return {
                        chargeList
                    };
                });

                return data;
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

    onDeleteProduct(artist_id, charge_buy_no, no) {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        return api.artists.deleteChargeAddProduct(artist_id, charge_buy_no, no)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                const data = response.data;
                delete data.session_info;
                this.setState(state => {
                    const chargeList = state.chargeList.reduce((r, o) => {
                        if (o.charge_buy_no === data.charge_buy_no) {
                            r.push(data);
                        } else {
                            r.push(o);
                        }

                        return r;
                    }, []);

                    return {
                        chargeList
                    };
                });

                return data;
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

    getChargeProduct() {
        const { offset, limit } = this.state;
        this.props.getChargeProductList({ offset, limit })
            .then(data => {
                PopModal.closeProgress();
                if (data) {
                    this.setState({
                        chargeList: data.list,
                        totalCount: Number(data.total_cnt)
                    });
                }
            });
    }

    /**
     * 결제하기
     * @param type
     * @param payMethod
     * @param price
     * @param title
     * @param add_period
     * @param charge_buy_no
     * @param week
     */
    payment(type, { payMethod, price, charge_buy_no, week = "", title, add_period }) {
        PopModal.progress();
        const { user } = this.state;
        const param = {
            week,
            price: week * 110000
        };

        if (add_period) {
            param.add_period = add_period;
        }

        if (type === "continue") {
            this.updateChargeProductExtend(user.id, charge_buy_no, { ...param })
                .then(response => {
                    const data = response.data;
                    this.loadPaymentModule(user, type, { payMethod, price: param.price, charge_buy_no: data.charge_buy_no, title });
                });
        } else {
            this.loadPaymentModule(user, type, { payMethod, price, charge_buy_no, title });
        }
    }

    loadPaymentModule(user, type, { payMethod, charge_buy_no, price, title }) {
        const userData = user.data;

        Payment.loadIMP(result => {
            PopModal.closeProgress();
            if (result) {
                // 3일이 남지 않았으면, 예약일 전날 까지 입금해야한다
                const dueDate = mewtime().add(3, mewtime.const.DATE);
                const artistId = userData.id;

                IMP.init(__IMP__);
                Payment.payment({
                    pay_method: payMethod,
                    vbank_due: `${dueDate.format("YYYYMMDD")}2359`,
                    merchant_uid: charge_buy_no,
                    name: title,
                    buyer_name: userData.name,
                    buyer_email: userData.email || "",
                    amount: price,
                    custom_data: {
                        user_id: artistId
                    }
                })
                    .then(response => {
                        if (response.success) {
                            const impUid = response.imp_uid;

                            this.fetchChargeProduct(artistId, charge_buy_no, { pay_uid: impUid })
                                .then(res => {
                                    PopModal.closeProgress();
                                    this.getChargeProduct();
                                    PopModal.alert("결제가 완료되었습니다.", { callBack: () => PopModal.close() });
                                })
                                .catch(error => {
                                    PopModal.closeProgress();
                                    PopModal.alert(error.data);
                                });
                        }
                    });
            } else {
                PopModal.closeProgress();
                PopModal.alert("결제모듈을 가져오지 못했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
            }
        });
    }

    /**
     * 유료상품 연장신청
     * @param id
     * @param no
     * @param params
     * @returns {IDBRequest|Promise<void>}
     */
    updateChargeProductExtend(id, no, params) {
        return api.artists.updateChargeProductExtend(id, no, params);
    }

    /**
     * 유료상품 신청
     * @param id
     * @param no
     * @param params
     * @returns {IDBRequest|Promise<void>}
     */
    fetchChargeProduct(id, no, params) {
        return api.artists.fetchChargeProductPayment(id, no, params);
    }

    onPageMove(page) {
        const { limit } = this.state;
        this.setState({
            offset: (page - 1) * limit
        }, () => {
            this.getChargeProduct();
        });
    }

    onPayment(type, obj) {
        const user = auth.getUser();
        if (user) {
            const userData = user.data;
            const modal_name = "pop-charge-payment-modal";

            PopModal.createModal(modal_name,
                <PopChargePayment
                    data={obj}
                    week={obj.week}
                    type={type}
                    payment={this.payment}
                    onClose={() => PopModal.close(modal_name)}
                />,
                { modal_close: false, className: modal_name }
            );

            PopModal.show(modal_name);
        } else {
            PopModal.closeProgress();
        }
    }

    render() {
        const { chargeList, totalCount } = this.state;
        return (
            <div>
                {chargeList.length > 0 &&
                <div className="charge-artist__list">
                    <div>
                        <ChargeList list={chargeList} onPayment={this.onPayment} onShowModify={this.onShowModify} />
                        <ChargePagination totalCount={totalCount} onPageMove={this.onPageMove} />
                    </div>
                </div>
                }
            </div>
        );
    }
}
