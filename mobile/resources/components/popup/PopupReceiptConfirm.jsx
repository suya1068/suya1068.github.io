import "./scss/PopupReceipt.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import PopDownContent from "shared/components/popdown/PopDownContent";
import RequestJS from "shared/components/quotation/request/QuotationRequest";

import Icon from "desktop/resources/components/icon/Icon";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class PopupReceiptConfirm extends Component {
    constructor(props) {
        super(props);

        const d = mewtime();

        this.state = {
            method: {
                card: "신용카드",
                trans: "계좌이체",
                vbank: "무통장 입금"
            },
            calendar: {
                events: [],
                min: d.clone().subtract(1).format("YYYY-MM-DD"),
                max: d.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD")
            },
            reserveDt: "",
            title: ""
        };

        this.onClose = this.onClose.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentWillMount() {
        const { data } = this.props;
        const orderInfo = data.order_info;
        const isOrder = data.option_type === "ORDER";
        const isAddition = ["TALK_CUSTOM", "TALK_EXTRA"].indexOf(data.option_type) !== -1;

        if (isOrder) {
            this.state.title = data.option_name;

            if (data.reserve_dt && data.reserve_dt !== "0000-00-00") {
                this.state.reserveDt = data.reserve_dt;
            } else if (orderInfo && orderInfo.date) {
                if (orderInfo.date.match(/^[0-9]{4}[0-9]{2}[0-9]{2}$/)) {
                    this.state.reserveDt = mewtime.strToDate(orderInfo.date);
                } else if (RequestJS.isDateOption(orderInfo.date)) {
                    this.state.reserveDt = orderInfo.date;
                } else {
                    this.state.reserveDt = "미정";
                }
            }
        } else {
            if (isAddition) {
                this.state.title = data.option_name;
            } else {
                this.state.title = data.title || "";
            }

            this.state.reserveDt = data.reserve_dt;
        }

        this.state.calendar.date = this.state.reserveDt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ? this.state.reserveDt : mewtime().format("YYYY-MM-DD");
    }

    onClose() {
        const { modalName } = this.props;
        if (modalName) {
            Modal.close(modalName);
        } else {
            Modal.close();
        }
    }

    onSelect(obj) {
        if (obj && obj.date) {
            const { calendar } = this.state;
            const date = obj.date.format("YYYY-MM-DD");
            calendar.date = date;

            Modal.show({
                type: MODAL_TYPE.CONFIRM,
                content: `촬영일자는 환불이나 정산 시 발생할 수 있는 분쟁에 중요한 기준이 됩니다.\n' ${date} ' 해당 날짜를 등록하시겠습니까?`,
                onSubmit: () => {
                    this.setState({
                        calendar,
                        reserveDt: date
                    });
                }
            });
        }
    }

    onConfirm() {
        const { reserveDt } = this.state;
        const { data, callBack } = this.props;

        if (data && callBack && typeof callBack === "function") {
            const orderInfo = data.order_info;
            const isOrder = data.option_type === "ORDER";
            let isDate = true;

            if (isOrder && orderInfo) {
                if (!orderInfo.date || !orderInfo.date.match(/^[0-9]{4}[0-9]{2}[0-9]{2}$/)) {
                    isDate = false;
                }
            }

            if (!isDate && (!reserveDt || !reserveDt.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "고객과 협의한 촬영일을 선택해주세요"
                });
            } else {
                callBack(data.buy_no, data.product_no, isDate ? "" : reserveDt.replace(/-/g, ""));
                this.onClose();
            }
        }
    }

    render() {
        const { method, calendar, reserveDt, title } = this.state;
        const { data } = this.props;
        const orderInfo = data.order_info;
        const isOrder = data.option_type === "ORDER";
        const isCustom = data.option_type === "TALK_CUSTOM";
        let isDate = true;
        const isAddition = ["TALK_CUSTOM", "TALK_EXTRA"].indexOf(data.option_type) !== -1;
        let optionInfo = null;
        const is_model = data.category === "MODEL";

        if (!data) {
            this.onClose();
            return null;
        }

        if (isOrder && orderInfo) {
            if ((!data.reserve_dt || data.reserve_dt === "0000-00-00") && (!orderInfo.date || !orderInfo.date.match(/^[0-9]{4}[0-9]{2}[0-9]{2}$/))) {
                isDate = false;
            }
        }

        if (isOrder && orderInfo) {
            optionInfo = (
                <div key="option-category">
                    <div className="title">
                        카테고리
                    </div>
                    <div className="content">
                        {orderInfo.category_name || ""}
                    </div>
                </div>
            );
        } else if (data.option_type === "PACKAGE") {
            if (!data.package) return null;
            optionInfo = [];
            optionInfo.push(
                <div key="option-info-package">
                    <div className="title">
                        패키지
                    </div>
                    <div className="content">
                        <div className="option__count">
                            <div className="title text-right"><strong>{data.package.title || ""}</strong></div>
                        </div>
                        {data.package.photo_cnt ?
                            <div className="option__count">
                                <div className="title">이미지 컷 수</div>
                                <div className="content">{data.package.photo_cnt} 컷</div>
                            </div> : null
                        }
                        {data.package.custom_cnt ?
                            <div className="option__count">
                                <div className="title">보정 컷 수</div>
                                <div className="content">{data.package.custom_cnt ? `${data.package.custom_cnt} 컷` : "없음"}</div>
                            </div> : null
                        }
                        {data.package.photo_time ?
                            <div className="option__count">
                                <div className="title">촬영시간</div>
                                <div className="content">{data.package.photo_time === "MAX" ? "300분 이상" : `${data.package.photo_time}분`}</div>
                            </div> : null
                        }
                        {data.package.running_time ?
                            <div className="option__count">
                                <div className="title">러닝타임</div>
                                <div className="content">{`${data.package.running_time || "-"} 분`}</div>
                            </div> : null
                        }
                        <div className="option__count">
                            <div className="title">{data.category === "DRESS_RENT" ? "대여기간" : "작업일"}</div>
                            <div className="content">{data.package.complete_period} 일</div>
                        </div>
                        <div className="option__count">
                            <div className="title">금액</div>
                            <div className="content">
                                {utils.format.price(data.package.price)}
                                {data.package.count > 1 ? <small>&nbsp;X&nbsp;{utils.format.price(data.package.count)}</small> : "원"}
                            </div>
                        </div>
                    </div>
                </div>
            );

            let options = [];
            if (utils.isArray(data.extra_option)) {
                const exList = data.extra_option.reduce((rs, ex) => {
                    rs.push({
                        ...ex
                    });

                    return rs;
                }, []);

                options = options.concat(exList);
            }

            if (utils.isArray(data.custom_option)) {
                const customList = data.custom_option.reduce((rs, c, i) => {
                    if (c.price && c.price !== 0) {
                        rs.push({
                            ...c,
                            code: `custom-option-${i}`
                        });
                    }

                    return rs;
                }, []);

                options = options.concat(customList);
            }

            if (utils.isArray(options)) {
                optionInfo.push(
                    <div key="option-info-extra">
                        <div className="title">
                            추가옵션
                        </div>
                        <div className="content">
                            {options.map(o => {
                                return (
                                    <div key={`option-count-${o.code}`} className="option__count">
                                        <div className="title">{o.title || ""}</div>
                                        <div className="content">{utils.format.price(o.price)}&nbsp;<small>&nbsp;X&nbsp;{utils.format.price(o.count)}</small></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }
        } else if (!isAddition) {
            optionInfo = (
                <div key="option-info">
                    <div className="title">
                        옵션내용
                    </div>
                    <div className="content">
                        <div className="option__count">
                            <div className="title">
                                <Icon name="opt_origin" />
                                <small>컷수</small>
                            </div>
                            <div className="content">{data.min_cut_cnt} ~ {data.max_cut_cnt}</div>
                        </div>
                        <div className="option__count">
                            <div className="title">
                                <Icon name="opt_custom" />
                                <small>보정</small>
                            </div>
                            <div className="content">{data.custom_cnt}</div>
                        </div>
                        <div className="option__count">
                            <div className="title">
                                <Icon name="opt_print" />
                                <small>인화</small>
                            </div>
                            <div className="content">{data.print_cnt}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="popup__receipt__confirm">
                <div className="receipt__body">
                    <div className="receipt_title">
                        {title}
                    </div>
                    <div className="receipt_no">
                        <span className="title">예약번호</span>{data.buy_no}
                    </div>
                    <div className="receipt_content">
                        <div>
                            <div className="title">
                                작가명
                            </div>
                            <div className="content">
                                <span>{data.nick_name}</span>
                            </div>
                        </div>
                        {data.phone ?
                            <div>
                                <div className="title">
                                    연락처
                                </div>
                                <div className="content">
                                    <span>{data.phone}</span>
                                </div>
                            </div> : null
                        }
                        {data.email ?
                            <div>
                                <div className="title">
                                    이메일
                                </div>
                                <div className="content">
                                    <span>{data.email}</span>
                                </div>
                            </div> : null
                        }
                        {!is_model && optionInfo}
                    </div>
                    {isCustom || isAddition ?
                        <div className="receipt_content">
                            <div>
                                <div className="title">
                                    메시지
                                </div>
                                <div className="content">
                                    {utils.linebreak(data.option_content)}
                                </div>
                            </div>
                        </div> : null
                    }
                    <div className="receipt_content">
                        <div>
                            <div className="title">
                                예약일
                            </div>
                            <div className="content">
                                {data.reg_dt}
                            </div>
                        </div>
                        <div>
                            <div className="title">
                                예약자명
                            </div>
                            <div className="content">
                                {data.user_name}
                            </div>
                        </div>
                        {isOrder || isAddition || data.option_type === "PACKAGE" ?
                            null :
                            <div>
                                <div className="title">
                                    예약인원
                                </div>
                                <div className="content">
                                    {data.person_cnt}
                                </div>
                            </div>
                        }
                        <div>
                            <div className="title">
                                금액
                            </div>
                            <div className="content">
                                {utils.format.price(data.total_price)} 원
                            </div>
                        </div>
                        <div>
                            <div className="title">
                                결제방식
                            </div>
                            <div className="content">
                                {data.pay_type === "vbank" ?
                                    <div className="pay__info">
                                        <div>{method[data.pay_type]}</div>
                                        <div>{data.vbank_date}</div>
                                        <div>{data.vbank_name}</div>
                                        <div>{data.vbank_num}</div>
                                    </div>
                                    : method[data.pay_type]
                                }
                            </div>
                        </div>
                        {!is_model &&
                        <div>
                            <div className="title">
                                촬영일
                            </div>
                            <div className="content">
                                {isDate ?
                                    reserveDt :
                                    <PopDownContent
                                        target={<div className="date__choose"><Icon name="calendar_s" />{reserveDt}</div>}
                                        posy={10}
                                        reverse
                                    >
                                        <div className="calendar-popup">
                                            <SlimCalendar {...calendar} onSelect={this.onSelect} />
                                        </div>
                                    </PopDownContent>
                                }
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <div className="receipt__footer">
                    <h3 className="h6-sub" style={{ marginTop: "20px", textAlign: "center" }}>예약을 승인 하시겠습니까?</h3>
                    <div className="modal-button-group">
                        <button className="_button _button__black" onClick={this.onClose}>취소</button>
                        <button className="_button _button__white" onClick={this.onConfirm}>확인</button>
                    </div>
                </div>
            </div>
        );
    }
}

PopupReceiptConfirm.propTypes = {
    modalName: PropTypes.string.isRequired,
    data: PropTypes.shape([PropTypes.node]),
    callBack: PropTypes.func
};

export default PopupReceiptConfirm;
