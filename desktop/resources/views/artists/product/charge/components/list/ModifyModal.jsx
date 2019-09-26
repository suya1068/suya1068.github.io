import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import { CATEGORY } from "shared/constant/product.const";
import DropDown from "shared/components/ui/dropdown/DropDown";

import Icon from "desktop/resources/components/icon/Icon";

class ModifyModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            data: props.data,
            select: "",
            products: [{ product_no: "", title: "추가할 상품을 선택해주세요." }].concat(props.products)
        };

        this.onAddProduct = this.onAddProduct.bind(this);
        this.onDeleteProduct = this.onDeleteProduct.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.exchangeStatus = this.exchangeStatus.bind(this);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onAddProduct() {
        const { data, select } = this.state;
        let message = "";

        if (!select) {
            message = "추가할 상품을 선택해주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            this.props.onAddProduct(data.artist_id, data.charge_buy_no, { product_no: select })
                .then(response => {
                    if (response) {
                        this.setStateData(() => {
                            return {
                                data: response
                            };
                        });
                    }
                });
        }
    }

    onDeleteProduct(no) {
        const { data } = this.state;
        this.props.onDeleteProduct(data.artist_id, data.charge_buy_no, no)
            .then(response => {
                if (response) {
                    this.setStateData(() => {
                        return {
                            data: response
                        };
                    });
                }
            });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    exchangeStatus(data) {
        const requestStatus = data.request_status;
        const paymentStatus = data.payment_status;

        const today = mewtime();

        const isBeforeEndDt = data.start_dt ? today.isBefore(mewtime(data.start_dt)) : null;
        const isAfterStartDt = data.end_dt ? today.isAfter(mewtime(data.end_dt)) : null;
        const payType = data.pay_type;

        let status = "";
        let color = "";

        if (data.del_dt) {
            status = "삭제";
            color = "#e02020";
        } else if (requestStatus === "READY" && !paymentStatus) {
            status = "승인대기중";
            color = "#0091ff";
        } else if (requestStatus === "COMPLETE" && paymentStatus !== "COMPLETE") {
            status = "승인완료";
            color = "#02c196";

            if (data.start_dt && data.end_dt && !isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
                color = "#f7b500";
            }

            // const testDate = mewtime()
            if (payType === "vbank") {
                if (data.vbank_date && today.isAfter(mewtime(data.vbank_date))) {
                    status = "만료";
                    color = "#e02020";
                }
            } else if (data.paid_limit_dt && today.isAfter(mewtime(data.paid_limit_dt))) {
                status = "만료";
                color = "#e02020";
            }
        } else if (requestStatus === "COMPLETE" && paymentStatus === "COMPLETE") {
            if (!isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
                color = "#f7b500";
            } else if (isAfterStartDt) {
                status = "만료";
                color = "#e02020";
            }
        } else if (requestStatus === "RETURN" || requestStatus === "CANCEL") {
            status = "비승인";
            color = "#e02020";
        } else if (requestStatus === "COMPLETE" && paymentStatus === "CANCEL") {
            status = "노출중";
            color = "#f7b500";
        } else if (requestStatus === "REQUEST") {
            status = "추가승인중";
            color = "#0056ff";
        } else {
            status = requestStatus;
        }

        return <span style={{ color }}>{status}</span>;
    }

    render() {
        const { onClose } = this.props;
        const { data, select, products } = this.state;
        const product_list = data.product_list || [];
        const isAdd = !(data.request_status === "COMPLETE" && data.payment_status !== "COMPLETE")

        return (
            <div className="artist__charge__modify__modal">
                <div className="charge__modify__container">
                    <div className="charge__modify__row charge__modify__header">
                        <div className="title">광고상품 추가 / 삭제</div>
                        <div className="close"><button className="_button _button__close" onClick={onClose} /></div>
                    </div>
                    <div className="charge__modify__row">
                        <table className="table">
                            <colgroup>
                                <col width="100" />
                                <col />
                                <col width="120" />
                                <col width="60" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>카테고리</th>
                                    <th>상품명</th>
                                    <th>상태</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product_list.map(o => {
                                    const category = CATEGORY[o.category];
                                    const status = {
                                        request_status: o.status,
                                        del_dt: o.del_dt,
                                        pay_type: data.pay_type,
                                        payment_status: data.payment_status,
                                        vbank_date: data.vbank_date,
                                        paid_limit_dt: data.paid_limit_dt
                                    };

                                    return (
                                        <tr key={`product_${o.no}`}>
                                            <td className="text-center">{category ? category.name : ""}</td>
                                            <td>{o.title}</td>
                                            <td className="text-center">{this.exchangeStatus(status)}</td>
                                            <td className="text-center">
                                                <div className="btn__delete" onClick={() => this.onDeleteProduct(o.no)}>
                                                    <button className="_button _button__close white__darken" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="charge__modify__row">
                        <DropDown
                            data={products}
                            select={select}
                            value="product_no"
                            name="title"
                            textAlign="left"
                            onSelect={value => this.setStateData(() => ({ select: value }))}
                            renderValue={o => {
                                return [
                                    <div key="title">{o.category_name ? `[${o.category_name}] ` : ""}{o.title}</div>,
                                    <Icon key="icon" name="black_dt" />
                                ];
                            }}
                            renderOption={o => {
                                return `${o.category_name ? `[${o.category_name}] ` : ""}${o.title}`;
                            }}
                        />
                    </div>
                    <div className="charge__modify__row charge__modify__buttons">
                        <button className={classNames("_button", !isAdd ? "_button__disable" : "_button__fill__yellow__f7b500")} onClick={isAdd ? this.onAddProduct : null}>{isAdd ? "상품추가" : "상품추가는 광고 결제후 가능합니다."}</button>
                    </div>
                    <div className="charge__modify__row charge__modify__attention">
                        <p className="title">주의사항</p>
                        <p className="sub_title">신청 전 확인해주세요!</p>
                        <p className="description"><span>추가 등록요청시 영업일 2일이내에 관리자의 검수후 노출 됩니다.</span></p>
                        <p className="description"><span>삭제 버튼 클릭시 즉시 광고영역에서 삭제되어 노출 되지 않습니다.(재등록 시 시간이 소요됩니다.)</span></p>
                    </div>
                </div>
            </div>
        );
    }
}

ModifyModal.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    products: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    onAddProduct: PropTypes.func.isRequired,
    onDeleteProduct: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModifyModal;
