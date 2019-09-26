import "./consulting_user_info.scss";
import React, { Component, PropTypes } from "react";
import DropDown from "mobile/resources/components/dropdown/DropDown";
// import ConsultingCategory from "../../helper/Category";
import utils from "forsnap-utils";
// import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import classNames from "classnames";
import { CONST } from "shared/components/quotation/request/QuotationRequest";
import { PLACE_HOLDER } from "../../personal/status/progress/component/step/content/example_content";
// import FileUpload from "../../helper/FileUpload";
// import PopModal from "../../../modal/PopModal";

export default class ConsultingUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // categoryList: [{
            //     code: "",
            //     display_order: "0",
            //     name: "촬영종류를 선택해 주세요.",
            //     tag: null
            // }],
            phone_number_start: CONSTANT.AREA_CODE,
            phone_start: "010",
            phone_center: { value: "", error: "" },
            phone_end: { value: "", error: "" },
            user_name: "",
            user_phone: "",
            user_email: "",
            // content: "",
            counselTimeOption: CONST.counselTimeOption,
            counselTimeTempMsg: "",
            counselTimeSelect: "",
            counsel_time: "",
            error: ""
            // size: 0,
            // category: props.category,
            // place_holder: PLACE_HOLDER[props.category] || "",
            // 상담신청하기 개선 20180705
            // url: "",
            // is_example: false,
            // is_upload: false,
            // max_upload: 3,
            // files: [],
            // attach_info: []
        };
        // this.categorys = new ConsultingCategory();
        // this.FileUpload = new FileUpload();
        this.renderCounselTime = this.renderCounselTime.bind(this);
        this.onChangeCounselTime = this.onChangeCounselTime.bind(this);
        this.onSelectToCounselTime = this.onSelectToCounselTime.bind(this);
        this.onChangeFormHandler = this.onChangeFormHandler.bind(this);

        // this.onExample = this.onExample.bind(this);
        // this.onCloseExample = this.onCloseExample.bind(this);
        // this.addFile = this.addFile.bind(this);
        // this.deleteAttachFile = this.deleteAttachFile.bind(this);
        // this.onClickConsultType = this.onClickConsultType.bind(this);
        // this.getCounselType = this.getCounselType.bind(this);
    }

    componentWillMount() {
        // this.FileUpload.setUploadInfo();
    }

    componentDidMount() {
        // const { categoryList, category } = this.state;
        // const enter = cookie.getCookies(CONSTANT.USER.ENTER);
        // const enter_session = sessionStorage.getItem(CONSTANT.USER.ENTER);
        // const combineCategoryList = obj => {
        //     if (obj.tag) {
        //         const a = obj.tag.split(/[ ]*,[ ]*/);
        //         const tag = [];
        //         if (utils.isArray(a)) {
        //             for (let i = 0; i < 3; i += 1) {
        //                 const item = a[i];
        //
        //                 if (!item) {
        //                     break;
        //                 }
        //
        //                 tag.push(item);
        //             }
        //         }
        //         obj.sub_caption = tag.join(" / ");
        //     }
        //     return obj;
        // };
        //
        // this.categorys.getCategorys()
        //     .then(res => {
        //         const data = res;
        //         let addCategoryList = [];
        //
        //         if (utils.isArray(data.category)) {
        //             addCategoryList = data.category.reduce((result, obj) => {
        //                 if (!enter && !enter_session && utils.checkCategoryForEnter(obj.code)) {
        //                     result.push(combineCategoryList(obj));
        //                 } else if ((enter && enter_session) && obj.code !== "AD" && obj.code !== "DRESS_RENT") {
        //                     result.push(combineCategoryList(obj));
        //                 }
        //
        //                 return result;
        //             }, []);
        //
        //             addCategoryList.unshift(categoryList[0]);
        //
        //             const check_category = this.onCheckCategory(data.category, category);
        //             let change_category = "";
        //             if (check_category) {
        //                 change_category = check_category.code;
        //             }
        //
        //             this.setState({ categoryList: addCategoryList, category: change_category });
        //         }
        //     });
    }

    // onCheckCategory(list, category) {
    //     return list.find(obj => { return obj.code === category; });
    // }

    /**
     * 기본입력 데이터 초기화
     */
    initData() {
        this.setState({
            user_name: "",
            user_phone: "",
            phone_start: "010",
            phone_center: { value: "", error: "" },
            phone_end: { value: "", error: "" },
            counselTimeTempMsg: "",
            counselTimeSelect: "",
            counsel_time: "",
            user_email: ""
        });
    }

    // getTempUserId() {
    //     return this.FileUpload.getTempUserId();
    // }

    /**
     * 기본정보 입력의 유효성 체크
     **/
    validate() {
        const { user_email, user_name, user_phone, counsel_time, phone_start, phone_center, phone_end } = this.state;
        // const { content, user_email, category, user_name, user_phone, size, counsel_time, phone_start, phone_center, phone_end } = this.state;
        let message = "";
        // if (!category) {
        //     message = "촬영종류를 선택해 주세요.";
        // } else
        // if (!user_name) {
        //     message = "이름을 입력해 주세요.";
        // } else
        if (!user_phone) {
            message = "연락받으실 전화번호를 입력해 주세요.";
        } else if (!phone_start) {
            message = "지역번호를 선택해 주세요.";
        } else if (!phone_center.value || phone_center.value.length < 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (!phone_end.value || phone_end.value.length <= 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (user_email && !utils.isValidEmail(user_email)) {
            message = "이메일을 정확히 입력해주세요.";
        }
        // else if (!content) {
        //     message = "문의내용을 작성해 주세요.";
        // } else if (size < 10) {
        //     message = "문의내용은 10글자 이상 작성해 주셔야 합니다.";
        // } else if (!counsel_time) {
        //     message = "상담가능 시간을 선택해주세요.";
        // }

        return message;
    }

    /**
     * 입력내용 폼 핸들러.
     * @param e
     */
    onChangeFormHandler(e) {
        let handler = "";
        const node = e.target;
        const value = node.value;
        const name = node.name;

        if (name === "content") handler = this.setComment(value);
        else handler = ({ [name]: value.replace(/[^{\d}{a-zA-Z}{!@#$%^&*()_+=/:;.₩,?"'<>~\-}]+/gi, "") });

        this.setState(handler);
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
     * 기본정보를 설정.
     **/
    onSetConsultData(e, name) {
        const value = e.target.value;
        this.setState(this.setConsultData(value, name));
    }

    /**
     * 연락처 중 지역번호를 저장한다.
     * @param value
     * @param name
     */
    onSetPhoneNumberStart(value, name) {
        this.setState(this.setConsultData(value, name), () => { this.phoneToString(); });
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
        this.state.user_phone = `${phone["phone_start"]}${phone["phone_center"]}${phone["phone_end"]}`;
    }

    /**
     * 선택한 카테고리 저장
     * @param value
     * @param name
     */
    onSetCategory(value, name) {
        this.setState(this.setConsultData(value, name), () => {
            if (name === "category") {
                this.setState({
                    place_holder: PLACE_HOLDER[value]
                });
            }
        });
    }

    /**
     * 상담신청 내용 반환한다.
     * @param value
     * @param name
     * @returns {function(*): {}}
     */
    setConsultData(value, name) {
        if (typeof value !== "string") {
            throw new TypeError("The data must be a string type.");
        }

        return state => ({ [name]: value });
    }

    /**
     * 문의내용을 반환한다.
     * @param data
     * @returns {function(*): {content: string, size: number}}
     */
    setComment(data) {
        if (typeof data !== "string") {
            throw new TypeError("The data must be a string type.");
        }
        const check = data.replace(/\s/gi, "");
        return state => ({ content: data, size: check.length });
    }

    /**
     * 입력된 고객정보를 불러온다.
     */
    getApplyInfo() {
        const { user_name, user_phone, counsel_time } = this.state;
        return {
            user_name, user_phone, counsel_time
        };
    }

    getUserEmail() {
        return this.state.user_email;
    }

    /**
     * 참고사이트 url을 반환한다.
     * @returns {string}
     */
    getUrl() {
        return this.state.url;
    }

    /**
     * 예문보기를 활성화한다.
     * @param e
     */
    // onExample(e) {
    //     this.setState({ is_example: true }, () => {
    //         this.focus.focus();
    //     });
    // }

    /**
     * 예문보기를 비활성화한다.
     */
    // onCloseExample() {
    //     this.setState({ is_example: false });
    // }

    /**
     * 파일을 첨부한다.
     * @param e
     */
    // addFile(e) {
    //     const target = e.currentTarget;
    //     const files = target.files;
    //     const { attach_info, max_upload } = this.state;
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
    //     const { files, is_upload, attach_info } = this.state;
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
    //     const { attach_info } = this.state;
    //     PopModal.alert("파일을 삭제하시겠습니까?", { callBack: () => {
    //         attach_info.splice(idx, 1);
    //         this.setState({ attach_info });
    //     } });
    // }

    /**
     * 파일 리스트를 반환한다.
     * @returns {Array}
     */
    // getAttachFiles() {
    //     return this.state.attach_info;
    // }

    /**
     * 카테고리 영역을 그린다.
     * @param list - Array
     * @param category - String
     * returns {*}
     */
    // renderRowToCategory(list, category) {
    //     return (
    //         <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__category">
    //             <div className="consulting-content__item-content__row-left">
    //                 <h4 className="consulting-content__item-content__row_title">카테고리</h4>
    //             </div>
    //             <div className="consulting-content__item-content__row-right">
    //                 <DropDown
    //                     list={list}
    //                     select={category}
    //                     keys={{ value: "code" }}
    //                     resultFunc={value => this.onSetCategory(value, "category")}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }

    /**
     * 유저이름 입력 영역을 그린다.
     * @param name - String
     * returns {*}
     */
    renderRowToName(name) {
        return (
            <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__name">
                <div className="consulting-content__item-content__row-left">
                    <h4 className="consulting-content__item-content__row_title">이름<span className="required">*</span></h4>
                </div>
                <div className="consulting-content__item-content__row-right">
                    <div className="input consulting-content__item-content__row_input">
                        <input
                            type="text"
                            placeholder="이름"
                            value={name}
                            maxLength={10}
                            onChange={e => this.onSetConsultData(e, "user_name")}
                        />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 핸드폰 입력 영역을 그린다.
     * @param phone_start
     * @param phone_center
     * @param phone_end
     * @param phone_number_start
     * returns {*}
     */
    renderRowToPhone({ phone_start, phone_center, phone_end, phone_number_start }) {
        return (
            <div className="consulting-content__item-content__row " key="consulting-content__item-content__row__phone">
                <div className="consulting-content__item-content__row-left">
                    <h4 className="consulting-content__item-content__row_title">연락처<span className="required">*</span></h4>
                </div>
                <div className="consulting-content__item-content__row-right phone">
                    <DropDown
                        list={phone_number_start}
                        icon="triangle_dt"
                        select={phone_start}
                        keys={{ value: "value" }}
                        resultFunc={value => this.onSetPhoneNumberStart(value, "phone_start")}
                    />
                    <div
                        className={classNames("input consulting-content__item-content__row_input", phone_center.error && "error_input")}
                        style={{ marginLeft: 5 }}
                    >
                        <input
                            type="tel"
                            name="phone_center"
                            value={phone_center.value}
                            maxLength={4}
                            onChange={e => this.onSetPhoneData(e, "phone_center")}
                        />
                    </div>
                    <div
                        className={classNames("input consulting-content__item-content__row_input", phone_end.error && "error_input")}
                        style={{ marginLeft: 5 }}
                    >
                        <input
                            type="tel"
                            name="phone_end"
                            value={phone_end.value}
                            maxLength={4}
                            onChange={e => this.onSetPhoneData(e, "phone_end")}
                        />
                    </div>
                </div>
                {/*<Input type="number" inline={{ type: "number", maxLength: 10, value: user_phone, onChange: e => this.onSetConsultData(e, "user_phone") }} />*/}
            </div>
        );
    }

    /**
     * 상담신청 내용 영역을 그린다.
     * @param is_example
     * @param place_holder
     * @param content
     * @param size
     * @returns {*}
     */
    // renderRowToContent({ is_example, place_holder, content, size }) {
    //     return (
    //         <div className="consulting-content__item-content__row" style={{ alignItems: "flex-start" }} key="consulting-content__item-content__row__content">
    //             <div className="consulting-content__item-content__row-left">
    //                 <h4 className="consulting-content__item-content__row_title" style={{ marginTop: 10 }}>내용</h4>
    //                 <button
    //                     className={classNames("button button__rect", place_holder ? "button__theme__white " : "disabled")}
    //                     style={{ position: "relative", top: 10, width: "100%", fontSize: "0.8rem" }}
    //                     disabled={!place_holder && "disabled"}
    //                     onClick={this.onExample}
    //                 >예시보기</button>
    //             </div>
    //             <div className="consulting-content__item-content__row-right">
    //                 <div className="consulting-content__item-content__row_body">
    //                     <div className="textarea">
    //                         <textarea
    //                             //className="textarea"
    //                             value={content}
    //                             // cols="30"
    //                             rows="5"
    //                             name="content"
    //                             maxLength={3000}
    //                             placeholder={place_holder || "내용을 간단히 입력해주세요."}
    //                             onChange={this.onChangeFormHandler}
    //                         />
    //                     </div>
    //                     {is_example ?
    //                         <div className="show-example" ref={node => { this.focus = node; }} onBlur={this.onCloseExample} tabIndex={0}>
    //                             <p>{place_holder}</p>
    //                             <button className="button example-close" onClick={this.onCloseExample}>{}</button>
    //                         </div> : null
    //                     }
    //                     <div className="text-area-size">
    //                         <div />
    //                         <span><span className={size < 10 ? "red-text" : ""}>{`${size}`}</span>{" / 3000"}</span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    /**
     * url 입력 영역을 그린다.
     * @param url
     * @returns {*}
     */
    // renderRowToUrl(url) {
    //     return (
    //         <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__refer_site">
    //             <div className="consulting-content__item-content__row-left">
    //                 <h4 className="consulting-content__item-content__row_title">[선택]참고사이트</h4>
    //             </div>
    //             <div className="consulting-content__item-content__row-right">
    //                 <div className="input consulting-content__item-content__row_input">
    //                     <input
    //                         //className="f__input"
    //                         placeholder="예시) forsnap.com"
    //                         value={url}
    //                         maxLength={200}
    //                         name="url"
    //                         type="text"
    //                         onChange={this.onChangeFormHandler}
    //                     />
    //                 </div>
    //                 <div className="text-area-size" style={{ textAlign: "right" }}>
    //                     <div />
    //                     <span><span>{`${url.length}`}</span>{" / 200"}</span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    /**
     * 파일업로드 영역을 그린다.
     * @returns {*}
     */
    // renderRowToAttachFile() {
    //     return (
    //         <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__attach_file--">
    //             <div className="consulting-content__item-content__row-right choice" style={{ width: "100%" }}>
    //                 <h4 className="consulting-content__item-content__row_title">[선택]참고할 파일이 있다면 첨부해주세요. [<span style={{ color: "#ff326c" }}>{`${this.state.attach_info.length}`}</span>/3]</h4>
    //                 <button className="button button__rect button__theme__white" onClick={() => this.inputFile.click()}>업로드</button>
    //             </div>
    //             <div className="upload-input-area">
    //                 <input
    //                     type="file"
    //                     style={{ display: "none" }}
    //                     multiple="multiple"
    //                     accept={
    //                         "application/vnd.ms-excel," +   // xls
    //                         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +  // xlsx
    //                         "application/vnd.openxmlformats-officedocument.presentationml.presentation," +  // pptx
    //                         "application/pdf," +    // pdf
    //                         "application/vnd.ms-powerpoint," +  // ppt
    //                         "application/zip," +    // zip
    //                         "image/jpeg, image/png, image/bmp" // images
    //                     }
    //                     onChange={this.addFile}
    //                     ref={ref => (this.inputFile = ref)}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }

    /**
     * 업로드된 파일의 리스트 영역을 그린다.
     * @param attach_info
     * @returns {*}
     */
    // renderRowToAttachFileView(attach_info) {
    //     return (
    //         <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__attach_file-list">
    //             {Array.isArray(attach_info) && attach_info.length > 0 &&
    //             <div className="attach-file-list">
    //                 {attach_info.map((obj, idx) => {
    //                     return (
    //                         <div className="attach-file-list__inner" key={`advice_order_attach-file__${idx}`}>
    //                             <p className="file_name">{obj.file_name}</p>
    //                             <button
    //                                 className="button button__rect button__theme__white delete-attach-file"
    //                                 onClick={() => this.deleteAttachFile(idx)}
    //                             >x</button>
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //             }
    //         </div>
    //     );
    // }

    /**
     * 상담가능영역을 그린다.
     * @returns {*}
     */
    renderRowToConsult() {
        return (
            <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__counsel-time">
                <div className="consulting-content__item-content__row-left">
                    <h4 className="consulting-content__item-content__row_title">상담 가능시간<span className="required">*</span></h4>
                </div>
                <div className="consulting-content__item-content__row-right">
                    {this.renderCounselTime()}
                </div>
            </div>
        );
    }

    renderRowToUserEmail(user_email) {
        return (
            <div className="consulting-content__item-content__row" key="consulting-content__item-content__row__user_email">
                <div className="consulting-content__item-content__row-left">
                    <h4 className="consulting-content__item-content__row_title">이메일</h4>
                </div>
                <div className="consulting-content__item-content__row-right">
                    <div className="input consulting-content__item-content__row_input">
                        <input
                            //className="f__input"
                            placeholder=""
                            value={user_email}
                            maxLength={200}
                            name="user_email"
                            type="text"
                            onChange={this.onChangeFormHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 상담신청 입력 폼을 그린다.
     */
    renderUserInfo(isDM) {
        const {
            // categoryList,
            // attach_info,
            // url,
            // category,
            // content,
            // is_example,
            // place_holder,
            // size,
            user_email,
            user_name,
            phone_number_start,
            phone_start,
            phone_center,
            phone_end } = this.state;
        const render_data_phone = { phone_start, phone_center, phone_end, phone_number_start };
        // const render_data_content = { is_example, place_holder, content, size };
        const user_info_content = [];
        if (isDM) {
            // user_info_content.push(
            //     <div className="consulting-content__item-content__left" key="isDM-left">
            //         {this.renderRowToCategory(categoryList, category)}
            //         {this.renderRowToName(user_name)}
            //         {this.renderRowToPhone({ ...render_data_phone })}
            //         {/*{this.renderToCounselType()}*/}
            //         {this.renderRowToConsult()}
            //     </div>
            // );
            // user_info_content.push(
            //     <div className="consulting-content__item-content__right" key="isDM-right">
            //         {this.renderRowToContent({ ...render_data_content })}
            //         {this.renderRowToUrl(url)}
            //         {this.renderRowToUserEmail(user_email)}
            //         {this.renderRowToAttachFile()}
            //         {this.renderRowToAttachFileView(attach_info)}
            //     </div>
            // );
        } else {
            // user_info_content.push(this.renderRowToCategory(categoryList, category));
            // user_info_content.push(this.renderRowToName(user_name));
            user_info_content.push(this.renderRowToPhone({ ...render_data_phone }));
            user_info_content.push(this.renderRowToUserEmail(user_email));
            // user_info_content.push(this.renderToCounselType());
            // user_info_content.push(this.renderRowToContent({ ...render_data_content }));
            // user_info_content.push(this.renderRowToUrl(url));
            // user_info_content.push(this.renderRowToAttachFile());
            // user_info_content.push(this.renderRowToAttachFileView(attach_info));
            // user_info_content.push(this.renderRowToConsult());
        }
        return (user_info_content);
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
            this.setState({
                [name]: value
            });
        });
    }

    /**
     * 연락가능시간 체크버튼 클릭
     * @param name
     * @param value
     */
    onSelectToCounselTime(name, value) {
        this.setState({
            counselTimeSelect: value,
            counselTimeTempMsg: "",
            [name]: value !== "직접입력" ? value : ""
        });
    }

    /**
     * 연락가능시간 입력 폼을 그린다.
     * @returns {*}
     */
    renderCounselTime() {
        const { counselTimeOption, counselTimeTempMsg, counselTimeSelect } = this.state;
        const COUNSEL_TIME = "counsel_time";
        return (
            <div className="consulting-able-time">
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
                                <span style={{ marginRight: 5 }}>{obj}</span>
                                <div className="input consulting-content__item-content__row_input content-row">
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

    render() {
        const { accessType, deviceType } = this.props;
        const isDM = (accessType === "main") && (deviceType === "pc");
        return (
            <div className="consulting-content__item">
                <div className="consulting-content__item-heading">
                    <h3 className="consulting-content__item-heading__title">
                        <span className="yellow_text">[필수]</span>
                        고객정보를 입력해주세요.
                    </h3>
                </div>
                <div className={classNames("consulting-content__item-content", "user_info", { "dm": isDM })}>
                    {this.renderUserInfo(isDM)}
                </div>
                <div className="consulting-content__item-content__description">
                    <p className="consulting-content__item-content__description__text description">
                        <span className="exclamation">!</span>
                        상담가능시간: 평일 오전 10시 ~ 오후 5시
                    </p>
                </div>
            </div>
        );
    }
}

ConsultingUserInfo.propTypes = {
    accessType: PropTypes.string.isRequired,
    deviceType: PropTypes.string.isRequired
};

ConsultingUserInfo.defaultProps = {
    accessType: "float",
    deviceType: "pc"
};
