import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";

import regular from "shared/constant/regular.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

class LicensePage extends Component {
    constructor() {
        super();

        this.state = {
            form: {
                ceo_name: "",
                corp_name: "",
                corp_num: ""
            },
            ceo_name: "",
            corp_name: "",
            corp_num: "",
            isCorp: false,
            loading: false
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const user = auth.getUser();

        if (user) {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
            API.artists.artistCorp(user.id)
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    const data = response.data;
                    this.setState({
                        form: {
                            ceo_name: data.corp_ceo_name || "",
                            corp_name: data.corp_name || "",
                            corp_num: data.corp_num || ""
                        },
                        isCorp: !!data.corp_num,
                        loading: true
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        }
    }

    onChangeForm(name, v) {
        let value = v;

        if (name === "corp_num") {
            value = value.replace(/[^0-9-]+/g, "");
        }

        this.setState(state => {
            return {
                form: Object.assign({}, state.form, { [name]: value })
            };
        });
    }

    onSave() {
        const { form, agree, isCorp } = this.state;
        let message = "";

        if (!form.ceo_name || form.ceo_name.replace(/\s/g, "") === "") {
            message = "대표자명을 입력해주세요";
        } else if (!form.corp_name || form.corp_name.replace(/\s/g, "") === "") {
            message = "회사명을 입력해주세요";
        } else if (!form.corp_num || !form.corp_num.match(/[0-9]{3}-[0-9]{2}-[0-9]{5}/)) {
            message = "사업자등록번호 10자를 '-'포함하여 입력해주세요";
        } else if (!agree) {
            message = "세금계산서 발행 의무에 동의하셔야 사업자 인증이 가능합니다.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(message)
            });
        } else {
            const user = auth.getUser();
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
            API.artists.artistSaveCorp(user.id, form)
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    this.setState({
                        isCorp: true
                    }, () => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak("사업자등록정보가 저장되었습니다.\n정산정보를 변경된 사업자로 수정하시려면\n사업자등록증을 이메일(acct@forsnap.com)로 접수해주세요.")
                        });
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        }
    }

    render() {
        const { form, agree, isCorp, loading } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <div className="artists-page-account artists-license">
                <div className="artist-content-row text-center">
                    <h1 className="h4-sub"><strong>사업자 인증</strong></h1>
                    <p className="content">사업자 정보 등록 시 세금계산서 발급 가능한 작가님으로 고객님들께 안내됩니다.<br />사업자 정보를 등록하지 않아도 작가활동은 가능합니다.</p>
                </div>
                <div className="artist-content-row">
                    <div className="content-columns">
                        <span className="title">대표자명</span>
                        <Input
                            type="text"
                            name="ceo_name"
                            value={form.ceo_name}
                            max="50"
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                        />
                        <span className="caption">사업자 등록증상에 기재된 대표자명을 입력해 주세요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">회사명</span>
                        <Input
                            type="text"
                            name="corp_name"
                            value={form.corp_name}
                            max="50"
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                        />
                        <span className="caption">사업자 등록증상에 기재된 회사명을 입력해 주세요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">사업자등록번호</span>
                        <Input
                            type="text"
                            name="corp_num"
                            value={form.corp_num}
                            max="12"
                            regular={/[^0-9-]+/g}
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                        />
                        <span className="caption">사업자 등록 번호를 정확하게 입력해주세요.</span>
                    </div>
                </div>
                <div key="agree" className="artist-content-row bg-white">
                    <p className="title sub">세금계산서 발행 의무 동의</p>
                    <p className="content">{utils.linebreak("포스냅은 중개서비스 수수료에 대한 세금계산서만 작가님께 발급합니다.\n서비스 자체에 대한 세금계산서는 재화와 용역의 실제적인 공급자(작가)가 공급받는 자(고객)에게 발행해 주어야 합니다.\n사업자 인증 시 세금계산서 발행 가능한 작가로 고객님께 노출되며 고객요청시 세금계산서를 발급해주어야 합니다.")}</p>
                </div>
                <div key="agree_button" className="artist-content-row text-center">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })}>동의합니다.<span className="agree__required">(필수)</span></CheckBox>
                </div>
                <div className="artist-content-row bg-white">
                    <p className="title sub">사업자 변경 안내</p>
                    <p className="content">정산정보를 변경된 사업자로 수정하시려면 사업자등록증을 이메일(acct@forsnap.com)로 접수해주세요.</p>
                </div>
                <div className="artist-content-row text-center">
                    <button className="_button _button__trans__black" onClick={this.onSave}>{isCorp ? "변경하기" : "저장하기"}</button>
                </div>
            </div>
        );
    }
}

export default LicensePage;
