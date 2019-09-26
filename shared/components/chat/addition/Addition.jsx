import "./Addition.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

import AdditionDate from "./components/AdditionDate";
import AdditionReceipt from "./components/AdditionReceipt";
import AdditionPrice from "./components/AdditionPrice";
import AdditionContent from "./components/AdditionContent";

class Addition extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalName: props.modalName,
            isProgress: false,
            tab: props.tab,
            data: props.data,
            date: "",
            buyNo: "",
            price: "",
            content: ""
        };

        this.onTab = this.onTab.bind(this);
        this.onRequest = this.onRequest.bind(this);

        this.setProgress = this.setProgress.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setReceipt = this.setReceipt.bind(this);
        this.setPrice = this.setPrice.bind(this);
        this.setContent = this.setContent.bind(this);

        this.apiReservation = this.apiReservation.bind(this);
    }

    componentWillMount() {
    }

    /**
     * 탭 변경
     * @param tab
     */
    onTab(tab) {
        const { data } = this.state;

        if (tab === "EXTRA" && !utils.isArray(data.reserve_list)) {
            PopModal.alert("결제내역이 없어서 추가결제는 불가능합니다");
        } else {
            const prop = {
                tab
            };

            if (tab === "CUSTOM") {
                prop.buyNo = "";
            } else {
                prop.date = "";
            }

            this.setState(prop);
        }
    }

    /**
     * 결제 요청하기
     */
    onRequest() {
        const { tab, date, buyNo, price, content, isProgress, data } = this.state;
        let alertMessage = "";

        if (tab === "CUSTOM" && !date) {
            alertMessage = "날짜를 선택해주세요";
        } else if (tab === "EXTRA" && !buyNo) {
            alertMessage = "해당 결제건을 선택해주세요";
        } else if (!price) {
            alertMessage = "비용을 입력해주세요";
        } else if (tab === "CUSTOM" && price < 25000) {
            alertMessage = "최소 비용은 포스냅 정책에 따라\n25,000원 이상만 가능합니다.";
        } else if (!content || content.length < 5) {
            alertMessage = "메시지를 입력해주세요 (최소 5자 이상)";
        } else if (!isProgress) {
            this.setProgress(true);
            const params = {
                key: data.key,
                group_type: data.group_type,
                reserve_type: tab,
                price,
                content
            };

            if (tab === "CUSTOM") {
                params.date = date;
            } else {
                params.buy_no = buyNo;
            }

            this.apiReservation(data.receive_id, params);
        }

        if (alertMessage) {
            PopModal.alert(alertMessage);
        }
    }

    setProgress(b) {
        this.state.isProgress = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    setDate(date) {
        const { tab } = this.state;

        if (tab === "EXTRA") {
            return "";
        }

        this.state.date = date;
        return this.state.date;
    }

    setReceipt(buyNo) {
        const { tab } = this.state;

        if (tab === "CUSTOM") {
            return "";
        }

        this.state.buyNo = buyNo;
        return this.state.buyNo;
    }

    setPrice(price) {
        this.state.price = price;
        return this.state.price;
    }

    setContent(content) {
        this.state.content = content;
        return this.state.content;
    }

    /**
     * API 결제요청
     * @param receiveId - String (수신 사용자 아이디
     * @param params - Object {
     *      key          - String (대화방 키값 product_no or offer_no)
     *      group_type   - String (대화방 종류)
     *      reserve_type - String (예약 종류, CUSTOM - 맞춤결제, EXTRA - 추가결제)
     *      price        - Number (결제 가격)
     *      content      - String (결제 내용)
     *      date         - String (맞춤결제시 예약일)
     *      buy_no       - String (추가결제시 주문번호)
     * }
     */
    apiReservation(receiveId, params) {
        API.talks.reservation(receiveId, params).then(response => {
            this.setProgress(false);

            if (response.status === 200) {
                const { modalName } = this.state;

                PopModal.close(modalName);
                PopModal.toast(`${params.reserve_type === "CUSTOM" ? "맞춤결제" : "추가결제"}를 요청했습니다`);
            }
        }).catch(error => {
            this.setProgress(false);
        });
    }

    render() {
        const { modalName, tab, data } = this.state;
        const isReserve = utils.isArray(data.reserve_list);

        return (
            <div className="chat__addition">
                <div className="chat__addition__close">
                    <button className="modal-close" onClick={() => PopModal.close(modalName)} />
                </div>
                <div className="chat__addition__head">
                    <div className="addition__tab">
                        <div className={classNames("tab__item", { active: tab === "CUSTOM" })} onClick={() => this.onTab("CUSTOM")}>맞춤결제</div>
                        {isReserve ?
                            <div className={classNames("tab__item", { active: tab === "EXTRA" })} onClick={() => this.onTab("EXTRA")}>추가결제</div> : null
                        }
                    </div>
                </div>
                <div className="chat__addition__body">
                    <div className="addition__container">
                        <div className="addition__container__title">
                            <span>날짜를 선택하세요.</span>
                        </div>
                        <div className="addition__container__content">
                            <AdditionDate data={{ tab, IF: { setDate: this.setDate } }} />
                        </div>
                    </div>
                    <div className="addition__container">
                        {isReserve ? [
                            <div key="addition_container_receipt_title" className="addition__container__title">
                                <span>해당 결제건을 선택해주세요.</span>
                            </div>,
                            <div key="addition_ container_receipt_content" className="addition__container__content flex__auto">
                                <AdditionReceipt data={{ tab, list: data.reserve_list, IF: { setReceipt: this.setReceipt } }} />
                            </div>] : null
                        }
                        <div className="addition__container__title">
                            <span>촬영비용금액을 입력해주세요.</span>
                        </div>
                        <div className="addition__container__content">
                            <AdditionPrice data={{ tab, IF: { setPrice: this.setPrice } }} />
                        </div>
                    </div>
                    <div className="addition__container">
                        <div className="addition__container__title">
                            <span>메시지를 입력해주세요.</span>
                        </div>
                        <div className="addition__container__content">
                            <AdditionContent data={{ tab, IF: { setContent: this.setContent } }} />
                        </div>
                        <div className="addition__container__buttons">
                            <button onClick={this.onRequest}>결제요청하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Addition.propTypes = {
    modalName: PropTypes.string.isRequired,
    tab: PropTypes.oneOf(["CUSTOM", "EXTRA"]),
    data: PropTypes.shape([PropTypes.node])
};

Addition.defaultProps = {
    tab: "CUSTOM",
    data: {}
};

export default Addition;
