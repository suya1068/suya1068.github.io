import "./main_consult_dev.scss";
import React, { Component, PropTypes } from "react";
import { CONSULT_ROW_TEMPLATE, CONSULT_MIC_ITEMS } from "./consult.const";
import { PLACE_HOLDER } from "../personal/status/progress/component/step/content/example_content";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import DropDown from "shared/components/ui/dropdown/DropDown";
import classNames from "classnames";
import utils from "forsnap-utils";
// import PopModal from "shared/components/modal/PopModal";
// import FileUpload from "../helper/FileUpload";
import CONSTANT from "shared/constant";

export default class MainConsult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category_list: [{
                code: "",
                name: "촬영종류를 선택해 주세요."
            }],
            form: this.createFormState(),
            place_holder: props.category && PLACE_HOLDER[props.category],
            is_example: false,
            is_upload: false,
            max_upload: 3,
            files: [],
            size: 0,
            phone_number_start: CONSTANT.AREA_CODE,
            phone_start: "010",
            phone_center: { value: "", error: "" },
            phone_end: { value: "", error: "" },
            counselTimeOption: ["가능한빨리", "1~2시간이내", "직접입력"],
            counselTimeTempMsg: "",
            counselTimeSelect: "",
            counsel_time: "",
            is_agree: false,
            agree_height: 0,
            category: props.category
        };

        // this.FileUpload = new FileUpload();

        this.onExample = this.onExample.bind(this);
        this.onCloseExample = this.onCloseExample.bind(this);
        // this.addFile = this.addFile.bind(this);
        this.onSelectAgree = this.onSelectAgree.bind(this);
    }

    componentWillMount() {
        this.combineCategoryList();
        // this.FileUpload.setUploadInfo();
    }

    /**
     * 폼 핸들러
     * @param value
     * @param name
     */
    onChangeFormHandler(name, value) {
        this.setForm({ [name]: value });
    }

    /**
     * 예문보기를 활성화한다.
     * @param e
     */
    onExample(e) {
        this.setState({ is_example: !this.state.is_example });
    }

    /**
     * 예문보기를 비활성화한다.
     */
    onCloseExample() {
        this.setState({ is_example: false });
    }

    /**
     * 카테고리를 선택한다.
     * @param name
     * @param value
     */
    setCategory(name, value) {
        this.state.place_holder = PLACE_HOLDER[value];
        if (value !== "") {
            this.onCloseExample();
        }
        this.onChangeFormHandler(name, value);
    }

    /**
     * 참고사이트를 입력한다.
     * 입력한 문자열은 한글을 제외한다.
     * @param name
     * @param value
     */
    setUrl(name, value) {
        if (typeof value !== "string") {
            throw new TypeError("The data must be a string type.");
        }
        this.onChangeFormHandler(name, value.replace(/[^{\d}{a-zA-Z}{!@#$%^&*()_+=/:;.₩,?"'<>~\-}]+/gi, ""));
    }

    /**
     * 파일을 첨부한다.
     * @param e
     */
    // addFile(e) {
    //     const target = e.currentTarget;
    //     const files = target.files;
    //     const { form, max_upload } = this.state;
    //     const attach_info = form.attach_info;
    //
    //     if (files !== null && files.length > 0) {
    //         let isExt = false;
    //         let count = 0;
    //         for (let i = 0; i < files.length; i += 1) {
    //             const file = files.item(i);
    //             const ext = utils.fileExtension(file.name);
    //
    //             if (!file.size) {
    //                 PopModal.alert("잘못된 파일이거나 접근 권한이 설정되어있지 않습니다.");
    //                 break;
    //             } else if ((/(pdf|xls|xlsx|ppt|pptx|zip|jpg|jpeg|png|bmp)$/i).test(ext)) {
    //                 if (attach_info.length < max_upload) {
    //                     this.state.files.push(file);
    //                     count += 1;
    //                 } else {
    //                     PopModal.alert(`첨부할 수 있는 파일 수를 넘겼습니다. (${attach_info.length}/${max_upload})`);
    //                     break;
    //                 }
    //             } else {
    //                 isExt = true;
    //             }
    //
    //             if (isExt) {
    //                 PopModal.alert("파일은 PFD, XLS, XLSX, PPT, PPTX, ZIP\n이미지는 JPG, JPEG, PNG, BMP 확장자만 가능합니다.");
    //                 return;
    //             }
    //         }
    //         if (!this.state.is_upload) {
    //             if (count > 0) {
    //                 this.state.is_upload = true;
    //                 this.fileUpload(this.state.files.length);
    //             }
    //         }
    //     }
    // }

    /**
     * 파일을 업로드 한다.
     * @param length
     */
    // fileUpload(length) {
    //     const { files, is_upload, form } = this.state;
    //     const attach_info = form.attach_info;
    //
    //     PopModal.progressCount(length - files.length, length);
    //     if (files !== null && files.length > 0 && is_upload) {
    //         if (attach_info.length > 2) {
    //             this.state.is_upload = false;
    //             this.state.files = [];
    //             PopModal.closeProgressCount();
    //             PopModal.toast("첨부파일은 최대 3개까지 가능합니다");
    //             return;
    //         }
    //
    //         const file = files[0];
    //         this.FileUpload.process(file).then(res => {
    //             if (res.status) {
    //                 this.state.files.shift();
    //                 const file_name = res.file_name;
    //                 const key = res.uploadKey;
    //                 attach_info.push({ file_name, key });
    //                 this.setState({ attach_info }, () => {
    //                     this.fileUpload(length);
    //                 });
    //             }
    //         }).catch(error => {
    //             let message = "20MB이하 파일을 업로드해 주세요.";
    //             if (error && error.message) {
    //                 message = error.message;
    //             }
    //
    //             PopModal.alert(message, { key: "quotation-content-upload-error" });
    //             this.state.files.shift();
    //             if (this.state.files.length > 0) {
    //                 this.fileUpload(length - 1);
    //             } else {
    //                 this.state.is_upload = false;
    //                 //this.inputFile_all.value = "";
    //                 PopModal.closeProgressCount();
    //             }
    //         });
    //     } else {
    //         this.state.is_upload = false;
    //         setTimeout(() => {
    //             PopModal.closeProgressCount();
    //         }, 500);
    //     }
    // }

    /**
     * 파일 인덱스의 배열을 삭제한다.
     * @param idx
     */
    // deleteAttachFile(idx) {
    //     const { form } = this.state;
    //     const attach_info = form.attach_info;
    //
    //     PopModal.alert("파일을 삭제하시겠습니까?", { callBack: () => {
    //         attach_info.splice(idx, 1);
    //         this.setState({ attach_info });
    //     } });
    // }

    /**
     * form 데이터를 반환한다.
     * @returns {Array}
     */
    getFormData() {
        // const valid = this.validateFormData();
        // if (valid !== "") {
        //     PopModal.alert(valid);
        //     return null;
        // }
        return this.conversionFormData();
    }

    /**
     * 폼데이터 검증
     */
    validate() {
        const { form, size, phone_end, phone_center, is_agree } = this.state;

        let message = "";
        // if (!form.category) {
        //     message = "촬영종류를 선택해 주세요.";
        // } else if (!form.content) {
        //     message = "문의내용을 작성해 주세요.";
        // } else if (size < 10) {
        //     message = "문의내용은 10글자 이상 작성해 주셔야 합니다.";
        // } else
        if (!form.user_name) {
            message = "이름을 입력해 주세요.";
        } else if (!form.user_phone) {
            message = "연락받으실 전화번호를 입력해 주세요.";
        } else if (!phone_center.value || phone_center.value.length < 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (!phone_end.value || phone_end.value.length <= 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (form.user_email && !utils.isValidEmail(form.user_email)) {
            message = "이메일을 정확히 입력해주세요.";
        } else if (!form.counsel_time) {
            message = "상담가능 시간을 선택해주세요.";
        } else if (!is_agree) {
            message = "개인정보 수집 및 이용에 동의해주셔야 신청 가능합니다.";
        }

        return message;
    }

    /**
     * 신청하기 전 폼 데이터 조합 후 전송
     * @returns {{category: string, user_name: string, user_phone: string, content: string, counsel_time: string, counsel_type: string, url: string, attach_info: Array, user_email: string}}
     */
    conversionFormData() {
        const { form } = this.state;
        return {
            // category: form.category,
            user_name: form.user_name,
            user_phone: form.user_phone,
            // content: form.content,
            counsel_time: form.counsel_time,
            // url: form.url || "",
            // attach_info: form.attach_info.length > 0 ? JSON.stringify(form.attach_info) : "",
            user_email: form.user_email || ""
            // temp_user_id: this.FileUpload.getTempUserId() || ""
        };
    }

    /**
     * 폼 데이터를 초기화 한다.
     */
    initData() {
        this.setState({
            form: this.createFormState(),
            phone_start: "010",
            phone_center: { value: "", error: "" },
            phone_end: { value: "", error: "" },
            counselTimeTempMsg: "",
            counselTimeSelect: "",
            counsel_time: "",
            // place_holder: "",
            is_agree: false
        });
    }

    /**
     * 폼 데이터를 설정한다.
     * @param {Object} data
     */
    setForm(data) {
        this.setState(({ form }) => ({ form: { ...form, ...data } }));
    }

    /**
     * 상담내용을 입력한다.
     * 입력한 문자열의 길이를 저장한다.
     * @param name
     * @param value
     */
    setComment(name, value) {
        if (typeof value !== "string") {
            throw new TypeError("The data must be a string type.");
        }
        const check = value.replace(/\s/gi, "");
        this.state.size = check.length;
        this.onChangeFormHandler(name, value);
    }

    /**
     * 연락처 중 지역번호를 저장한다.
     * @param value
     * @param name
     */
    onSetPhoneNumberStart(value, name) {
        this.setState({ [name]: value }, () => { this.phoneToString(); });
    }

    /**
     * 연락처를 입력받는다.
     * 저장시 숫자를 제외한 문자의 입력은 배제한다.
     * @param e
     * @param name
     */
    onSetPhoneData(e, name) {
        const value = e.target.value && e.target.value.replace(/,/gi, "").replace(/\D/gi, "");
        this.validatePhoneNumber(value, name);
        this.setPhoneData(value, name);
    }

    // /**
    //  * 상담가능방법을 선택한다.
    //  * 기본은 전화상담 가능, 체크박스 선택하면 sms로 상담
    //  */
    // onClickConsultType() {
    //     const { form } = this.state;
    //     const counsel_type = form.counsel_type;
    //
    //     this.onChangeFormHandler("counsel_type", counsel_type === "tel" ? "sms" : "tel");
    // }

    /**
     * 연락처 입력 시 유효성 체크를 한다.
     * @param data - String (폰번호)
     * @param name - String (저장할 프로퍼티 명)
     * @returns {string}
     */
    validatePhoneNumber(data, name) {
        if (!data) {
            const message = "연락처를 입력해주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        }

        if (name === "phone_center" && data.length < 3) {
            const message = "연락처를 전부 입력해 주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        } else if (name === "phone_end" && data.length < 4) {
            const message = "연락처를 전부 입력해 주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        }

        this.setErrorMessageForPhoneNumber("", name);
        return "";
    }


    /**
     * 연락처 유효성 오류에 에러메시지를 저장한다.
     * @param message
     * @param name
     */
    setErrorMessageForPhoneNumber(message, name) {
        if (typeof message !== "string") {
            throw new TypeError("The message parameter must be a string type");
        }
        const targetData = this.state[name];
        this.setState({
            [name]: Object.assign(targetData, { error: message })
        });
    }


    /**
     * 연락처를 저장한다.
     * @param value - String (연락처 3 ~ 4자리)
     * @param name - String (저장할 프로퍼티 명)
     */
    setPhoneData(value, name) {
        const target_data = this.state[name];
        if (target_data) {
            Object.assign(target_data, { value });
        }

        this.setState({ [name]: target_data }, () => { this.phoneToString(); });
    }

    /**
     * 저장된 연락처를 합친다.
     */
    phoneToString() {
        const { phone_start, phone_center, phone_end } = this.state;

        const phone = {
            phone_start,
            phone_center: phone_center.value,
            phone_end: phone_end.value
        };
        this.onChangeFormHandler("user_phone", `${phone["phone_start"]}${phone["phone_center"]}${phone["phone_end"]}`);
    }

    /**
     * 카테고리 리스트를 조합한다.
     */
    combineCategoryList() {
        const { category_list } = this.state;
        const business_category = BUSINESS_MAIN.CATEGORY;
        this.setState({
            category_list: business_category.reduce((result, category) => {
                if (category.code !== "MODEL") {
                    const item = { code: category.code, name: category.name };
                    result.push(item);
                }
                return result;
            }, category_list)
        });
    }

    /**
     * 상담내용입력 위한 폼을 설정한다.
     */
    createFormState() {
        const { category } = this.props;
        return {
            // category: category || "",
            user_name: "",
            user_phone: "",
            // content: "",
            counsel_time: "",
            // url: "",
            // attach_info: [],
            user_email: ""
            // temp_user_id: ""
        };
    }

    /**
     * 상담내용 창에 활성상태를 없앤다.
     * @param e
     * @param target
     */
    onBlur(e, target) {
        if (target) {
            target.style.border = "1px solid #e1e1e1";
        }
    }

    /**
     * 상담내용 창을 활성상태로 변경한다.
     * @param e
     * @param target
     */
    onFocus(e, target) {
        if (target) {
            target.style.border = "2px solid #000";
        }
    }

    /**
     * 상담 key값에 따라 content를 그린다.
     */
    renderColumnContent(key) {
        switch (key) {
            // case "category": return this.renderCategory();
            // case "content": return this.renderContent();
            // case "url": return this.renderUrl();
            // case "attach_info": return this.renderAttachInfo();
            case "user_name": return this.renderUserName();
            case "user_phone": return this.renderUserPhone();
            case "user_email": return this.renderUserEmail();
            case "counsel_time": return this.renderCounselTime();
            default: return null;
        }
    }

    /**
     * 카테고리 row를 그린다.
     */
    renderCategory() {
        const { category_list, form } = this.state;
        return (
            <div className="width-400">
                <DropDown
                    data={category_list}
                    select={form.category}
                    name="name"
                    value="code"
                    onSelect={value => this.setCategory("category", value)}
                />
            </div>
        );
    }

    /**
     * 내용 row 를 그린다.
     */
    renderContent() {
        const { form, place_holder, size, is_example } = this.state;
        return (
            <div className="width-block">
                <div
                    className="textarea"
                    ref={node => { this.content_content = node; }}
                    onFocus={e => this.onFocus(e, this.content_content)}
                    onBlur={e => this.onBlur(e, this.content_content)}
                >
                    <textarea
                        value={form.content}
                        // cols="30"
                        rows="5"
                        name="content"
                        maxLength={3000}
                        placeholder={place_holder || "내용을 간단히 입력해주세요."}
                        onChange={e => this.setComment(e.target.name, e.target.value)}
                    />
                    <div className="text-size">
                        <div />
                        <span><span className={size < 10 ? "red-text" : ""}>{`${size}`}</span>{" / 3000"}</span>
                    </div>
                    {is_example && form.category !== "" ?
                        <div className="show-example" ref={node => { this.focus = node; }} onBlur={this.onCloseExample} tabIndex={0}>
                            <p>{place_holder}</p>
                            <button className="button example-close" onClick={this.onCloseExample}>{}</button>
                        </div> : null
                    }
                </div>
            </div>
        );
    }

    /**
     * 참고사이트 row 를 그린다.
     */
    renderUrl() {
        const { form } = this.state;
        return (
            <div className="width-block">
                <div
                    className="consult-input"
                    ref={node => { this.url_content = node; }}
                    onFocus={e => this.onFocus(e, this.url_content)}
                    onBlur={e => this.onBlur(e, this.url_content)}
                >
                    <input
                        //className="f__input"
                        placeholder="예시) forsnap.com"
                        value={form.url}
                        maxLength={200}
                        name="url"
                        type="text"
                        onChange={e => this.setUrl(e.target.name, e.target.value)}
                    />
                    <div className="text-size" style={{ textAlign: "right" }}>
                        <div />
                        <span><span>{`${form.url.length}`}</span>{" / 200"}</span>
                    </div>
                </div>
            </div>
        );
    }


    /**
     * 첨부파일 row 를 그린다.
     */
    renderAttachInfo() {
        const { form } = this.state;
        return (
            <div className="attach_info_content flex-basic flex-direction_column">
                <div className="width-block flex-basic">
                    <div className="width-400">
                        <div className="consult-input">
                            {/*<div>{}</div>*/}
                            <input
                                type="file"
                                style={{ display: "none" }}
                                multiple="multiple"
                                accept={
                                    "application/vnd.ms-excel," +   // xls
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +  // xlsx
                                    "application/vnd.openxmlformats-officedocument.presentationml.presentation," +  // pptx
                                    "application/pdf," +    // pdf
                                    "application/vnd.ms-powerpoint," +  // ppt
                                    "application/zip," +    // zip
                                    "image/jpeg, image/png, image/bmp" // images
                                }
                                onChange={this.addFile}
                                ref={ref => (this.inputFile = ref)}
                            />
                            <div className="upload-static-info width-block flex-basic justify-between">
                                <span>참고할 파일이 있다면 첨부해주세요.</span>
                                <span>{`[${form.attach_info.length} / 3]`}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginLeft: "5px", height: "45px", width: "90px" }}>
                        <button
                            className="_button"
                            style={{ height: "100%" }}
                            onClick={() => this.inputFile.click()}
                        >업로드</button>
                    </div>
                </div>
                <div className="upload_display_box width-block">
                    {form.attach_info && Array.isArray(form.attach_info) && form.attach_info.length > 0 &&
                        form.attach_info.map((obj, idx) => {
                            return (
                                <div
                                    key={`df__${idx}`}
                                    className="upload_display_row flex-basic justify-between"
                                >
                                    <span className="upload_display_filename">{obj.file_name}</span>
                                    <button className="upload_display_button _button" onClick={() => this.deleteAttachFile(idx)}>x</button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

        );
    }


    /**
     * 고객 이름 row 를 그린다.
     */
    renderUserName() {
        const { form } = this.state;
        return (
            <div className="width-220">
                <div
                    className="consult-input"
                    ref={node => { this.name_content = node; }}
                    onFocus={e => this.onFocus(e, this.name_content)}
                    onBlur={e => this.onBlur(e, this.name_content)}
                >
                    <input
                        type="text"
                        name="user_name"
                        value={form.user_name}
                        placeholder="이름"
                        maxLength={10}
                        onChange={e => this.onChangeFormHandler(e.target.name, e.target.value)}
                    />
                </div>
            </div>
        );
    }


    /**
     * 고객연락처 row 를 그린다.
     */
    renderUserPhone() {
        const { phone_number_start, phone_start, phone_center, phone_end } = this.state;
        return (
            <div className="width-block flex-basic flex_align-center">
                <div className="flex-basic">
                    <div className="width-120">
                        <DropDown
                            data={phone_number_start}
                            select={phone_start}
                            name="name"
                            value="value"
                            onSelect={value => this.onSetPhoneNumberStart(value, "phone_start")}
                        />
                    </div>
                    <div
                        className={classNames("consult-input", "width-120", phone_center.error && "error_input")}
                        style={{ marginLeft: 30 }}
                        ref={node => { this.phone_center_content = node; }}
                        onFocus={e => this.onFocus(e, this.phone_center_content)}
                        onBlur={e => this.onBlur(e, this.phone_center_content)}
                    >
                        <input
                            type="tel"
                            name="phone_center"
                            value={phone_center.value}
                            maxLength={4}
                            onChange={e => this.onSetPhoneData(e, "phone_center")}
                        />
                        <span className="phone-dash">-</span>
                    </div>
                    <div
                        className={classNames("consult-input", "width-120", phone_end.error && "error_input")}
                        style={{ marginLeft: 30 }}
                        ref={node => { this.phone_end_content = node; }}
                        onFocus={e => this.onFocus(e, this.phone_end_content)}
                        onBlur={e => this.onBlur(e, this.phone_end_content)}
                    >
                        <input
                            type="tel"
                            name="phone_end"
                            value={phone_end.value}
                            maxLength={4}
                            onChange={e => this.onSetPhoneData(e, "phone_end")}
                        />
                        <span className="phone-dash">-</span>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 고객이메일 row 를 그린다.
     */
    renderUserEmail() {
        const { form } = this.state;
        return (
            <div className="width-400">
                <div
                    className="consult-input"
                    ref={node => { this.email_content = node; }}
                    onFocus={e => this.onFocus(e, this.email_content)}
                    onBlur={e => this.onBlur(e, this.email_content)}
                >
                    <input
                        type="text"
                        name="user_email"
                        value={form.user_email}
                        maxLength={200}
                        onChange={e => this.onChangeFormHandler(e.target.name, e.target.value)}
                    />
                </div>
            </div>
        );
    }

    /**
     * 상담가능시간 row 를 그린다.
     */
    renderCounselTime() {
        const { counselTimeOption, counselTimeTempMsg, counselTimeSelect } = this.state;
        const COUNSEL_TIME = "counsel_time";

        return (
            <div className="consult-time__content">
                {counselTimeOption.map((obj, idx) => {
                    // const isSelect = true;
                    const isSelect = obj === counselTimeSelect;
                    const counselContent = [];

                    if (idx === 2) {
                        counselContent.push(
                            <div
                                className={classNames("button__check", { active: isSelect })}
                                key={`counsel_content__button__${idx}`}
                                onClick={() => this.onSelectToCounselTime(COUNSEL_TIME, obj)}
                                style={{ flex: "1 1 auto" }}
                            >
                                <div className="icon__circle">
                                    <i className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                </div>
                                <span style={{ marginRight: 7 }}>{obj}</span>
                                <div
                                    className="consult-input"
                                    style={{ flex: "0 1 auto" }}
                                    ref={node => { this.direct_time_content = node; }}
                                    onFocus={e => this.onFocus(e, this.direct_time_content)}
                                    onBlur={e => this.onBlur(e, this.direct_time_content)}
                                >
                                    <input
                                        //className="counsel_msg"
                                        type="text"
                                        maxLength="30"
                                        value={counselTimeTempMsg}
                                        onChange={e => this.onChangeCounselTime(e, COUNSEL_TIME)}
                                    />
                                </div>
                            </div>
                        );
                    } else {
                        counselContent.push(
                            <div
                                className={classNames("button__check", { active: isSelect })}
                                key={`counsel_content__button__${idx}`}
                                onClick={() => this.onSelectToCounselTime(COUNSEL_TIME, obj)}
                            >
                                <div className="icon__circle">
                                    <i className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                </div>
                                <span>{obj}</span>
                            </div>
                        );
                    }
                    return counselContent;
                })}
            </div>
        );
    }

    /**
     * 연락가능시간 체크버튼 클릭
     * @param name
     * @param value
     */
    onSelectToCounselTime(name, value) {
        this.setState({
            counselTimeSelect: value,
            counselTimeTempMsg: ""
        }, () => {
            this.onChangeFormHandler("counsel_time", value !== "직접입력" ? value : "");
        });
    }

    onSelectAgree(e) {
        const { agree_height } = this.state;
        let height = agree_height;

        if (this.refAgreeHeight) {
            height = this.refAgreeHeight.offsetHeight + 20;
        }

        this.setState({ is_agree: !this.state.is_agree, agree_height: height });
    }

    /**
     * 연락가능시간을 저장한다.
     * @param e
     * @param name
     */
    onChangeCounselTime(e, name) {
        const target = e.target;
        const value = target.value;
        this.setState({
            counselTimeTempMsg: value
        }, () => {
            this.onChangeFormHandler("counsel_time", value !== "직접입력" ? value : "");
        });
    }

    render() {
        const { place_holder, form, is_agree, agree_height } = this.state;
        return (
            <div className="counsel_box">
                {CONSULT_ROW_TEMPLATE.map(obj => {
                    return (
                        <div className="counsel_box__inner_box" key={`counsel_template__${obj.KEY}`}>
                            <div className="counsel_box__row">
                                <div className={classNames("counsel_box__column", { "content-row": obj.KEY === "content" })}>
                                    <div className="column-title" style={{ textAlign: "left" }}>
                                        <div style={{ width: "100%" }}>
                                            <p className="title">{obj.NAME}
                                                {obj.REQUIRED && <span className="required">*</span>}
                                            </p>
                                        </div>
                                        {form.category !== "" && obj.KEY === "content" &&
                                            <div className="content-example-button">
                                                <button className="_button" disabled={!place_holder && "disabled"} onMouseUp={this.onExample}>예시보기</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="counsel_box__column" style={{ width: "100%", borderLeft: "1px solid #e9e9e9", height: "100%", backgroundColor: "#fff" }}>
                                    <div className="column-content" style={{ height: obj.KEY === "content" && 180 }}>
                                        <div className="width-block">
                                            {this.renderColumnContent(obj.KEY)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="counsel-notice">
                    <div className="left">
                        <span className="exclamation">!</span>
                        상담가능시간 : 평일 오전 10시 ~ 오후 5시
                    </div>
                    <div className="right">
                        <div
                            className={classNames("button__check", { "active": is_agree })}
                            onClick={this.onSelectAgree}
                            style={{ flex: "1 1 auto" }}
                        >
                            <div className="icon__circle" />
                            <p>개인정보 수집 및 이용 동의하기</p>
                        </div>
                    </div>
                </div>
                <div style={{ overflow: "hidden", height: is_agree ? `${agree_height}px` : "0", transition: "height 0.6s" }}>
                    <div className="test" ref={node => { this.refAgreeHeight = node; }}>
                        <p className="notice-agree" style={{ textAlign: "left" }}>
                            포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해<br />
                            필요한 최소한의 개인정보를 수집하고 있습니다.<br /><br />
                            개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리<br />
                            수집하는 개인정보 항목: 이름, 전화번호<br />
                            수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

MainConsult.propTypes = {};

MainConsult.defaultProps = {};
