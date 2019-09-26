import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import utils from "shared/helper/utils";

import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class PopupScheduleCancel extends Component {
    constructor(props) {
        super(props);

        const { userType, buyNo, productNo, baseData } = props.data;

        this.state = {
            productNo: productNo || "",
            buyNo: buyNo || "",
            userType: userType || "U",
            baseData,
            reason: ""
        };

        this.apiReserveCancel = this.apiReserveCancel.bind(this);
    }

    apiReserveCancel() {
        const { onCallBack } = this.props;
        const { productNo, buyNo, userType, reason } = this.state;
        let message = "";

        if (reason === "") {
            message = "취소사유를 입력해주세요.";
        } else if (reason.length > 50) {
            message = "취소사유는 50자 이하로 입력해주세요.";
        } else {
            Modal.show({
                type: MODAL_TYPE.CONFIRM,
                content: "예약을 취소하시겠습니까?",
                onSubmit: () => {
                    const data = {
                        product_no: productNo,
                        user_type: userType,
                        comment: reason
                    };

                    const request = API.reservations.reserveCancel(buyNo, data);
                    request.then(response => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "예약이 취소되었습니다.",
                            onSubmit: () => Modal.close()
                        });
                        if (typeof onCallBack === "function") {
                            onCallBack();
                        }
                    }).catch(error => {
                        if (utils.errorFilter(error)) {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: utils.linebreak(error.data)
                            });
                        } else {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: utils.linebreak("예약취소중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.")
                            });
                        }
                    });
                }
            });
        }

        if (message !== "") {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(message)
            });
        }
    }

    render() {
        const { reason } = this.state;

        return (
            <div className="photograph-cancel-pop">
                <div className="cancel-pop-title">
                    <p><strong>취소하시는 이유</strong>를 확인해주세요.</p>
                </div>
                <div className="cancel-pop-input">
                    <Input inputStyle={{ width: "block" }} inline={{ value: reason, maxLength: 50, onChange: (e, value) => this.setState({ reason: value }) }} />
                    <span className="cancel-reason-length">{reason.length}/50</span>
                </div>
                <div className="cancel-pop-button">
                    <Buttons buttonStyle={{ width: "block", shape: "circle", theme: "default" }} inline={{ onClick: this.apiReserveCancel }}>취소하기</Buttons>
                </div>
            </div>
        );
    }
}

PopupScheduleCancel.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    onCallBack: PropTypes.func
};

export default PopupScheduleCancel;
