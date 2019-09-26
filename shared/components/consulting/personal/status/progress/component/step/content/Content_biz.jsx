import "./content.scss";
import React, { Component, PropTypes } from "react";
import { PLACE_HOLDER } from "./example_content";
import FileUpload from "shared/components/consulting/helper/FileUpload";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,                                               // 현재 단계
            content: props.content || "",                                   // 상담내용
            advice_order_no: props.advice_order_no,                         // 상담요청 번호
            place_holder: PLACE_HOLDER[props.category],                     // 카테고리별 예문
            temp_user_id: props.temp_user_id || "",                         // 임시 유저 아이디
            category: props.category,                                       // 선택된 카테고리
            is_change_category: props.is_change_category,                   // 이전 단계에서 카테고리를 변경했는지 여부
            size: 0,                                                        // 상담내용 문자열 개수
            // 상담신청하기 개선 2018-07-05
            refer_site: props.url || "",                                      // 참고사이트
            is_example: false,                                                // 예문보기 선택여부
            attach_info: props.attach_info || [],                             // 업로드 된 파일
            is_upload: false,                                                 // 업로드 상태값
            files: [],                                                        // 업로드 선택창에서 선택한 파일들
            max_upload: 3,                                                    // 최대 업로드 갯수
            upload_info: props.upload_info || {},                             // 업로드 정책
            user_email: props.user_email || "",
            error: {}
        };

        this.FileUpload = new FileUpload();
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onExample = this.onExample.bind(this);
        this.onCloseExample = this.onCloseExample.bind(this);
        this.addFile = this.addFile.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount() {
        const { content, upload_info } = this.state;
        this.initData(content);
        this.FileUpload.setUploadPolicy(upload_info);
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.onCheckState(nextState.size);
        return true;
    }

    /**
     * 값을 초기화한다.
     * @param options
     * @param time
     * @param content
     */
    initData(content) {
        const init_data = {};
        init_data.size = content.length || 0;

        this.setState({ ...init_data }, () => { this.onCheckState(init_data.size); });
    }


    /**
     * 밸리데이션 완료 시 신청하기 버튼 활성화
     * @param size
     */
    onCheckState(size) {
        let flag = true;
        const button = this.button;
        if (size > 9) {
            flag = false;
            button.classList.remove("disabled");
        } else {
            button.classList.add("disabled");
        }

        button.disabled = flag;
    }

    /**
     * 이전단계
     * @param e
     */
    onPrev(e) {
        if (typeof this.props.onPrev === "function") {
            this.props.onPrev(2);
        }
    }

    /**
     * 다음단계
     * @param e
     */
    onNext(e) {
        if (typeof this.props.onNext === "function") {
            this.props.onNext(3);
        }
    }

    /**
     * 상담내용을 가져온다.
     * @returns {*}
     */
    getContent() {
        return this.state.content;
    }

    getUserEmail() {
        return this.state.user_email;
    }

    /**
     * 입력내용 폼 핸들러.
     * @param value
     * @param name
     */
    onChangeFormHandler(value, name) {
        let handler = "";

        if (name === "content") {
            handler = this.setComment(value);
        } else if (name === "refer_site") {
            handler = ({ [name]: value.replace(/[^{\d}{a-zA-Z}{!@#$%^&*()_+=/:;.₩,?"'<>~\-}]+/gi, "") });
            this.isValid(name, value);
        } else if (name === "user_email") {
            handler = ({ [name]: value });
        }

        this.setState(handler);
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
     * 예문보기를 활성화한다.
     * @param e
     */
    onExample(e) {
        if (!this.state.is_example) {
            this.setState({ is_example: true }, () => {
                this.focus.focus();
            });
        }
    }

    /**
     * 예문보기를 비활성화한다.
     */
    onCloseExample() {
        this.setState({ is_example: false });
    }

    /**
     * 파일을 첨부한다.
     * @param e
     */
    addFile(e) {
        const target = e.currentTarget;
        const files = target.files;
        const { attach_info, max_upload } = this.state;

        if (files !== null && files.length > 0) {
            let isExt = false;
            let count = 0;

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if (!file.size) {
                    PopModal.alert("잘못된 파일이거나 접근 권한이 설정되어있지 않습니다.");
                    break;
                } else if ((/(pdf|xls|xlsx|ppt|pptx|zip|jpg|jpeg|png|bmp)$/i).test(ext)) {
                    if (attach_info.length < max_upload) {
                        this.state.files.push(file);
                        count += 1;
                    } else {
                        PopModal.alert(`첨부할 수 있는 파일 수를 넘겼습니다. (${attach_info.length}/${max_upload})`);
                        break;
                    }
                } else {
                    isExt = true;
                }

                if (isExt) {
                    PopModal.alert("파일은 PFD, XLS, XLSX, PPT, PPTX, ZIP\n이미지는 JPG, JPEG, PNG, BMP 확장자만 가능합니다.");
                    return;
                }
            }

            if (!this.state.is_upload) {
                this.state.is_upload = true;
                this.fileUpload(this.state.files.length);
            }
        }
    }

    /**
     * 업로드된 파일 정보를 내보낸다.
     * @returns {*|Array}
     */
    getAttachInfo() {
        return this.state.attach_info;
    }

    /**
     * 파일을 업로드한다.
     * @param length
     */
    fileUpload(length) {
        const { files, is_upload, attach_info } = this.state;
        PopModal.progressCount(length - files.length, length);

        if (files !== null && files.length > 0 && is_upload) {
            if (attach_info.length > 2) {
                this.state.is_upload = false;
                this.state.files = [];
                PopModal.closeProgressCount();
                PopModal.toast("첨부파일은 최대 3개까지 가능합니다");
                return;
            }

            const file = files[0];
            this.FileUpload.process(file).then(res => {
                if (res.status) {
                    this.state.files.shift();
                    const file_name = res.file_name;
                    const key = res.uploadKey;
                    attach_info.push({ file_name, key });
                    this.setState({ attach_info }, () => {
                        this.fileUpload(length);
                    });
                }
            }).catch(error => {
                let message = "20MB이하 파일을 업로드해 주세요.";
                if (error && error.message) {
                    message = error.message;
                }

                PopModal.alert(message, { key: "quotation-content-upload-error" });
                this.state.files.shift();
                if (this.state.files.length > 0) {
                    this.fileUpload(length - 1);
                } else {
                    this.state.is_upload = false;
                    //this.inputFile_all.value = "";
                    PopModal.closeProgressCount();
                }
            });
        } else {
            this.state.is_upload = false;
            setTimeout(() => {
                PopModal.closeProgressCount();
            }, 500);
        }
    }


    /**
     * 파일 인덱스의 배열을 삭제한다.
     * @param idx
     */
    deleteAttachFile(idx) {
        const { attach_info } = this.state;
        PopModal.confirm("파일을 삭제하시겠습니까?",
            () => {
                attach_info.splice(idx, 1);
                this.setState({ attach_info });
            },
            null
        );
    }

    /**
     * 참고사이트 정보를 내보낸다.
     * @returns {String|string}
     */
    getUrl() {
        return this.state.refer_site;
    }

    /**
     * 상담내용 창에 활성상태를 없앤다.
     * @param e
     * @param target
     */
    onBlur(e, target) {
        if (target) {
            target.style.borderColor = "#e1e1e1";
        }
    }

    /**
     * 상담내용 창을 활성상태로 변경한다.
     * @param e
     * @param target
     */
    onFocus(e, target) {
        if (target) {
            target.style.borderColor = "#000";
        }
    }

    /**
     * 유효성을 판단한다.
     * @return {{valid: boolean, error: any}}
     */
    isValid(name, value) {
        const error = Object.create(null);

        if (name === "refer_site" && (/[^{\d}{a-zA-Z}{!@#$%^&*()_+=/:;.₩,?"'<>~\-}]+/gi).test(value)) {
            error[name] = "영문, 숫자, 일부 특수문자만 입력가능합니다.";
        }

        this.setState({ error });
    }

    render() {
        const { content, size, is_example, place_holder, refer_site, attach_info, user_email, error } = this.state;
        return (
            <div className="consult_progress__step-content">
                <div className="step-content biz">
                    <div className="step-content__row">
                        <div className="step-content__row-title" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h4 className="title"><span style={{ color: "#ff326c" }}>[필수]</span> 문의하실 내용을 간단히 남겨주세요.</h4>
                            <button className="button button__theme__white button__rect" style={{ fontSize: "0.8rem" }} onClick={this.onExample}>예시보기</button>
                        </div>
                        <div className="step-content-inner">
                            <div className="step-content__content" style={{ position: "relative" }} ref={node => { this.write_content = node; }}>
                                <textarea
                                    className="textarea"
                                    value={content}
                                    rows="4"
                                    maxLength={3000}
                                    placeholder={place_holder}
                                    name="content"
                                    onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                                    onFocus={e => this.onFocus(e, this.write_content)}
                                    onBlur={e => this.onBlur(e, this.write_content)}
                                />
                                {is_example ?
                                    <div className="show-example" ref={node => { this.focus = node; }} onBlur={this.onCloseExample} tabIndex={0}>
                                        <p>{place_holder}</p>
                                        <button className="button example-close" onClick={this.onCloseExample}>{}</button>
                                    </div> : null
                                }
                                <div className="text-area-size">
                                    <div />
                                    <span><span className={size < 10 ? "red-text" : ""}>{`${size}`}</span>{" / 3000"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div className="step-content__row-title">
                            <h4 className="title"><span style={{ color: "#0581f7" }}>[선택]</span> 참고할 사이트가 있으면 알려주세요.</h4>
                        </div>
                        <div className="step-content__row-content">
                            <div className="step-content__info-refer_site" style={{ width: "100%", marginBottom: "0.5rem" }}>
                                <div className="consult_input" ref={node => { this.refer_site = node; }}>
                                    <input
                                        placeholder="예시) forsnap.com"
                                        value={refer_site}
                                        maxLength={200}
                                        name="refer_site"
                                        type="text"
                                        onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                                        onFocus={e => this.onFocus(e, this.refer_site)}
                                        onBlur={e => this.onBlur(e, this.refer_site)}
                                    />
                                    <div className="text-area-size">
                                        <div />
                                        <span><span>{`${refer_site.length}`}</span>{" / 200"}</span>
                                    </div>
                                </div>
                                <div className="error-input">
                                    {error.refer_site &&
                                        <span>영문, 숫자, 일부 특수문자만 입력가능합니다.</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div
                            className="step-content__row-title"
                            style={{ display: "flex", flex: "1 1 auto", justifyContent: "space-between", alignItems: "center" }}
                        >
                            <h4 className="title">
                                <span style={{ color: "#0581f7" }}> [선택]</span>
                                참고할 파일이 있다면 첨부해주세요. [
                                <span style={{ color: "#0581f7" }}>{attach_info.length}</span>
                                <span>{" / 3]"}</span>
                            </h4>
                            <button
                                className="button button__theme__white button__rect"
                                style={{ fontSize: "0.8rem", minWidth: 55 }}
                                onClick={() => this.inputFile.click()}
                            >업로드</button>
                        </div>
                        <div className="row__content direction__row">
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
                        </div>
                        {(Array.isArray(attach_info) && attach_info.length > 0) || (Array.isArray(attach_info) && attach_info.length > 0) ?
                            <div className="step-content" style={{ marginTop: "5px", padding: "0 1rem", border: "1px solid #e1e1e1" }}>
                                {Array.isArray(attach_info) && attach_info.length > 0 && attach_info.map((obj, idx) => {
                                    return (
                                        <div className="download-list" key={`consult-attach-file__${idx}`}>
                                            <h5 className="download-list-row">{obj.file_name}</h5>
                                            <button className="button step-attach-file__delete-button" onClick={() => this.deleteAttachFile("attach", idx)}>x</button>
                                        </div>
                                    );
                                })}
                            </div> :
                            <div className="step-content" style={{ padding: "0", marginBottom: "10px" }} />
                        }
                    </div>
                    <div className="step-content__row">
                        <div className="step-content__row-title" style={{ marginBottom: 10 }}>
                            <h4 className="title"><span style={{ color: "#0581f7" }}>[선택]</span> 견적서를 받아보실 이메일을 알려주세요.</h4>
                        </div>
                        <div className="step-content__row-content">
                            <div className="step-content__info-name" style={{ width: "100%", marginBottom: "0.5rem" }}>
                                <div className="consult_input" ref={node => { this.user_email = node; }}>
                                    <input
                                        placeholder=""
                                        value={user_email}
                                        maxLength={200}
                                        name="user_email"
                                        type="text"
                                        onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                                        onFocus={e => this.onFocus(e, this.user_email)}
                                        onBlur={e => this.onBlur(e, this.user_email)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="consult_progress__step-button">
                    <div className="button-box two-button">
                        <button className="theme_black" style={{ width: "calc(50% - 5px)" }} onClick={this.onPrev}>이전</button>
                        <button
                            className="theme_black"
                            style={{ width: "calc(50% - 5px)" }}
                            ref={node => { this.button = node; }}
                            onClick={this.onNext}
                        >다음단계로 진행</button>
                    </div>
                </div>
            </div>
        );
    }
}
