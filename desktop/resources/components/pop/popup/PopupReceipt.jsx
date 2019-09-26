import "../scss/PopupReceipt.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import PopModal from "shared/components/modal/PopModal";
import DropDown from "shared/components/ui/dropdown/DropDown";

import Icon from "desktop/resources/components/icon/Icon";

import PopupScheduleCancel from "desktop/resources/views/artists/components/PopupScheduleCancel";
import RequestJS from "shared/components/quotation/request/QuotationRequest";

class PopupReceipt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            method: {
                card: "신용카드",
                trans: "계좌이체",
                vbank: "무통장 입금"
            },
            buyNo: props.data.buy_no,
            status: props.status,
            type: props.type,
            searchDate: props.searchDate
        };

        this.onReloadData = this.onReloadData.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.setExtraList = this.setExtraList.bind(this);

        this.onPopupPrintReceipt = this.onPopupPrintReceipt.bind(this);
    }

    componentWillMount() {
        const { data } = this.state;
        this.state.extraList = this.setExtraList(data);
    }

    componentDidMount() {
    }

    onReloadData() {
        const { reload } = this.props;

        if (typeof reload === "function") {
            const obj = reload();

            if (obj) {
                const prop = {};
                const data = obj.data;
                prop.data = data;
                const extraList = this.setExtraList(data);
                prop.extraList = extraList;

                if (extraList) {
                    const item = extraList.find(extra => {
                        return extra.buy_no === this.state.buyNo;
                    });

                    prop.buyNo = item.buy_no;
                } else {
                    prop.buyNo = data.buy_no;
                }

                this.setState(prop);
            }
        }
    }

    onSelect(value) {
        this.setState({
            buyNo: value
        });
    }

    /**
     * 구매영수증 인쇄 가능 팝업창
     */
    onPopupPrintReceipt() {
        const { buy_no } = this.props.data;
        const { status, type, searchDate } = this.props;

        let url = `${__DOMAIN__}/reserve/receipt/${buy_no}?type=${type}`;

        if (status) {
            url += `&status=${status}`;
        }

        if (searchDate) {
            url += `&start=${searchDate.startDate}&end=${searchDate.endDate}`;
        }

        window.open(url, "forsnap", "width=520, height=740, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");
    }

    onCancel() {
        const { userType, reload } = this.props;
        const { data, buyNo } = this.state;
        const modalName = "payment_cancel";
        const options = {
            callBack: () => {
                // this.onReloadData();
                PopModal.close();
            }
        };

        PopModal.createModal(modalName, <PopupScheduleCancel modalName={modalName} data={{ userType, buyNo, productNo: data.product_no || "", baseData: data }} />, options);
        PopModal.show(modalName);
    }

    setExtraList(data) {
        if (utils.isArray(data.extra_info)) {
            const extraList = data.extra_info.slice();
            extraList.unshift({
                buy_no: data.buy_no
            });

            return extraList;
        }

        return null;
    }

    render() {
        const { data, extraList, method, buyNo } = this.state;
        const { userType } = this.props;

        if (!data) {
            return null;
        }

        const orderInfo = data.order_info;
        const isOrder = data.option_type === "ORDER";
        let reserveDt = "";
        let title = "";

        let optionContent = data.option_content;
        let totalPrice = data.total_price;
        const isCustom = data.option_type === "TALK_CUSTOM";
        let isAddition = false;
        const isMain = data.buy_no === buyNo;
        let buttonCancel = null;
        let optionInfo = null;
        const is_model = data.category === "MODEL";

        const payInfo = {
            payType: data.pay_type,
            vbankDate: data.vbank_date || "",
            vbankName: data.vbank_name || "",
            vbankNum: data.vbank_num || ""
        };

        if (isOrder) {
            title = data.option_name || "";

            if (data.reserve_dt && data.reserve_dt !== "0000-00-00") {
                reserveDt = data.reserve_dt;
            } else if (orderInfo) {
                if (RequestJS.isDate(orderInfo.date)) {
                    reserveDt = mewtime.strToDate(orderInfo.date);
                } else if (RequestJS.isDateOption(orderInfo.date)) {
                    reserveDt = orderInfo.date;
                } else {
                    reserveDt = "미정";
                }
            }
        } else {
            if (isCustom) {
                title = data.option_name || "";
                optionContent = data.option_content;
            } else {
                title = data.title || "";
            }

            reserveDt = data.reserve_dt;
        }

        if (!isMain) {
            const item = extraList.find(extra => {
                return extra.buy_no === buyNo;
            });

            if (item) {
                isAddition = item.option_type === "TALK_EXTRA";
                title = item.option_name || "";
                optionContent = item.option_content;
                totalPrice = item.total_price;

                payInfo.payType = item.pay_type;
                payInfo.vbankDate = item.vbank_date || "";
                payInfo.vbankName = item.vbank_name || "";
                payInfo.vbankNum = item.vbank_num || "";

                if ((userType === "U" && ["READY", "PAYMENT", "PREPARE"].indexOf(data.status_type) !== -1)
                    || userType === "A") {
                    if (item.status_type === "READY") {
                        buttonCancel = (
                            <div className="modal-button-group">
                                <button className="modal-btn disabled">결제 대기중입니다</button>
                            </div>
                        );
                    } else if (item.status_type === "CANCEL") {
                        buttonCancel = (
                            <div className="modal-button-group">
                                <button className="modal-btn disabled">결제가 취소되었습니다</button>
                            </div>
                        );
                    } else {
                        buttonCancel = (
                            <div className="modal-button-group">
                                <button className="modal-btn" onClick={this.onCancel}>취소하기</button>
                            </div>
                        );
                    }
                }
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
                                <div className="content">{data.package.photo_time === "MAX" ? "300분 이상" : `${data.package.photo_time} 분`}</div>
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
                                if (!o) return null;

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
            <div className="popup__receipt">
                <div className="receipt__body">
                    <div className="receipt_title">
                        {title}
                    </div>
                    {utils.isArray(extraList) ?
                        <div className="receipt_no">
                            <DropDown
                                data={extraList}
                                select={buyNo}
                                name="buy_no"
                                value="buy_no"
                                onSelect={value => this.onSelect(value)}
                            />
                        </div> :
                        <div className="receipt_no">
                            <span className="title">예약번호</span>{data.buy_no}
                        </div>
                    }
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
                                    {utils.linebreak(optionContent)}
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
                        {isOrder || isCustom || isAddition || data.option_type === "PACKAGE" ?
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
                                {utils.format.price(totalPrice)} 원
                            </div>
                        </div>
                        <div>
                            <div className="title">
                                결제방식
                            </div>
                            <div className="content">
                                {payInfo.payType === "vbank" ?
                                    <div className="pay__info">
                                        <div>{method[payInfo.payType]}</div>
                                        <div>{payInfo.vbankDate}</div>
                                        <div>{payInfo.vbankName}</div>
                                        <div>{payInfo.vbankNum}</div>
                                    </div>
                                    : method[payInfo.payType]
                                }
                            </div>
                        </div>
                        {!is_model &&
                        <div>
                            <div className="title">
                                촬영일
                            </div>
                            <div className="content">
                                {reserveDt}
                            </div>
                        </div>
                        }
                    </div>
                </div>
                {userType === "U" && data.paid_dt &&
                    <div className="print_receipt_button">
                        <button className="_button" onClick={this.onPopupPrintReceipt}>구매 영수증</button>
                    </div>
                }
                <div className="receipt__footer">
                    {this.props.children ?
                        this.props.children
                        : null
                    }
                    {buttonCancel}
                </div>
            </div>
        );
    }
}

PopupReceipt.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    userType: PropTypes.oneOf(["U", "A"]),
    children: PropTypes.node,
    reload: PropTypes.func,
    type: PropTypes.string,
    status: PropTypes.string,
    searchDate: PropTypes.shape({ startDate: PropTypes.string, endDate: PropTypes.string })
};

PopupReceipt.defaultProps = {
    userType: "U",
    type: "RESERVATION",
    status: undefined,
    searchDate: undefined
};

export default PopupReceipt;
