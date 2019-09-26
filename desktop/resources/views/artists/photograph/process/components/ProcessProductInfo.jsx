import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import { PROCESS_BREADCRUMB_CODE } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";
import RequestJS from "shared/components/quotation/request/QuotationRequest";

import ModifyDate from "./ModifyDate";

class ProcessProductInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onModifyDate = this.onModifyDate.bind(this);

        this.modifyDate = this.modifyDate.bind(this);
        this.renderDateButton = this.renderDateButton.bind(this);
    }

    onModifyDate(e, date) {
        e.stopPropagation();
        e.preventDefault();
        const { data } = this.props;
        const today = mewtime();
        const reserve = mewtime(date);
        reserve.subtract(6).endOf();
        if (today.isBefore(reserve)) {
            const modalName = "pop_modify_date_modal";
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                name: modalName,
                content: <ModifyDate modalName={modalName} buy_no={data.buy_no} date={date} onConfirm={this.modifyDate} />
            });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak("촬영일 변경은 촬영일 기준 6일 이전까지 가능합니다.\n해당 촬영건의 촬영일을 변경하시려면 고객센터로 문의해주세요.")
            });
        }
    }

    modifyDate(buy_no, date) {
        const { onReload } = this.props;
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        api.reservations.modifyDate(buy_no, { reserve_dt: date })
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "촬영일 변경을 요청했습니다.",
                    onSubmit: () => {
                        Modal.close();
                        onReload();
                    }
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

    renderDateButton(date, status, alter_status) {
        const today = mewtime();
        const reserve = mewtime(date);
        if (status && !alter_status && today.isSameOrBefore(reserve)) {
            return <button className="_button _button__white" onClick={e => this.onModifyDate(e, date)}>날짜변경</button>;
        }

        return null;
    }

    render() {
        const { data, onShowPassOrigin, onShowUploadPhotos, onShowCustomPhotos, onMoveChat } = this.props;
        const status = ["READY", "PAYMENT", "PREPARE"].indexOf(data.status_type) !== -1;
        const alterInfo = data.date_alter_info || null;
        let title = <a href={`/products/${data.product_no}`} target="_blank">{data.title}</a>;
        let reserveDate = data.reserve_dt;
        let afterDate = null;
        let alter_status = false;

        if (alterInfo && Array.isArray(alterInfo) && alterInfo.length) {
            const alter = alterInfo.reduce((r, o) => {
                if (!r || r.no < o.no) {
                    return o;
                }

                return r;
            });
            afterDate = alter.after_date;
            alter_status = alter.status === "REQUEST";
        }

        switch (data.option_type) {
            case "OFFER":
            case "ORDER": {
                const orderInfo = data.order_info || {};
                reserveDate = "미정";
                title = "촬영견적";

                if (data.reserve_dt && data.reserve_dt !== "0000-00-00") {
                    reserveDate = data.reserve_dt;
                } else if (orderInfo) {
                    if (utils.isDate(orderInfo.date)) {
                        reserveDate = mewtime.strToDate(orderInfo.date);
                    } else if (RequestJS.isDateOption(orderInfo.date)) {
                        reserveDate = orderInfo.date;
                    }
                }
                break;
            }
            case "TALK_CUSTOM": {
                title = <a role="button" onClick={() => onMoveChat(data)}>맞춤결제</a>;
                break;
            }
            default:
                break;
        }

        return (
            <div className="process__product__info">
                <div className="info__profile">
                    <Img image={{ src: data.thumb_img, content_width: 504, content_height: 504 }} />
                </div>
                <div className="info__content">
                    <div className="title">{title}</div>
                    <div className="description">
                        <p className="date">
                            촬영일 : {reserveDate}
                            {this.renderDateButton(reserveDate, status, alter_status)}
                        </p>
                        {status && alter_status && utils.isDate(afterDate) ? <p>{`변경예정: ${afterDate}`}</p> : null}
                    </div>
                    <div className="buttons dashed">
                        <button className="_button _button__white" onClick={() => onMoveChat(data)}>대화방 바로가기</button>
                    </div>
                    {data.status_type === PROCESS_BREADCRUMB_CODE.SHOT ?
                        <div className="buttons">
                            <button key="image_upload" className="_button _button__white" onClick={() => onShowUploadPhotos(data)}>이미지 업로드</button>
                            <button key="image_outside" className="_button _button__white" onClick={() => onShowPassOrigin(data)}>외부 업로드</button>
                        </div> : null
                    }
                    {data.status_type === PROCESS_BREADCRUMB_CODE.REQ_CUSTOM ?
                        <div className="buttons">
                            <button key="image_upload" className="_button _button__white" onClick={() => onShowCustomPhotos(data)}>보정 업로드</button>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

ProcessProductInfo.propTypes = {
    data: PropTypes.shape({
        buy_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        profile_img: PropTypes.string,
        title: PropTypes.string,
        reserve_dt: PropTypes.string
    }),
    onReload: PropTypes.func.isRequired,
    onShowPassOrigin: PropTypes.func.isRequired,
    onShowUploadPhotos: PropTypes.func.isRequired,
    onShowCustomPhotos: PropTypes.func.isRequired,
    onMoveChat: PropTypes.func.isRequired
};

export default ProcessProductInfo;
