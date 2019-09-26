import "./scss/PopupPhoneNumber.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import PopModal from "shared/components/modal/PopModal";

class PopupPhoneNumber extends Component {
    constructor() {
        super();

        this.state = {
            phone: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onModify = this.onModify.bind(this);
        this.apiModifyPhone = this.apiModifyPhone.bind(this);
    }

    onChange(e) {
        const target = e.currentTarget;
        const maxLength = target.maxLength;
        const phone = target.value;

        if (maxLength && phone.length > maxLength) {
            return;
        }

        this.setState({
            phone
        });
    }

    onModify() {
        const user = auth.getUser();
        const { phone } = this.state;

        if (user) {
            if (phone.replace(/\s/g, "").length < 1) {
                PopModal.toast("핸드폰 번호를 입력해주세요");
            } else {
                this.apiModifyPhone(user.id, { phone }).then(response => {
                    if (response.status === 200) {
                        PopModal.toast("연락처가 등록되었습니다.", () => PopModal.close());
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        } else {
            redirect.login({ redirectURL: location.pathname });
        }
    }

    apiModifyPhone(id, obj) {
        return API.users.modifyPhone(id, obj);
    }

    render() {
        const { phone } = this.state;

        return (
            <div className="popup__phone">
                <div className="popup__phone__header">
                    <h1 className="header__title">핸드폰 번호를 입력해주세요</h1>
                </div>
                <div className="popup__phone__body">
                    <div className="body__phone">
                        <input type="number" value={phone} className="input" maxLength="11" onChange={this.onChange} />
                    </div>
                    <span className="body__caption"><span className="icon">!</span>연락처를 입력하시면 SMS로 알림을 드립니다.</span>
                </div>
                <div className="popup__phone__footer">
                    <div className="send__chat__button">
                        <button className="button button-block button__rect button__theme__yellow" onClick={this.onModify}>확인</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PopupPhoneNumber;
