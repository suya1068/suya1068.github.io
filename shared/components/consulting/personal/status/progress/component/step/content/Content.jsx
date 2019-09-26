import "./content.scss";
import React, { Component, PropTypes } from "react";
import { CONTENT, PLACE_HOLDER } from "./example_content";
import FileUpload from "shared/components/consulting/helper/FileUpload";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import {
    CATEGORY_CONTENT_TEXT,
    EXTRA_INFO_DATA_SET,
    EXTRA_INFO_SUB_CONTENT,
    KEYS_TEXT,
    CATEGORY_TITLE,
    INIT_DATA
} from "../advice_order.const";

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,                                   // 현재 단계
            content: props.content || "",                       // 상담내용 - 선택
            advice_order_no: props.advice_order_no,             // 상담번호 - 필수
            temp_user_id: props.temp_user_id || "",             // 임시 유저 아이디
            category: props.category,                           // 선택한 카테고리
            is_change_category: props.is_change_category,       // 이전 단계로 돌아가서 카테고리를 변경시켰는지 여부
            size: 0,                                            // 상담내용 문자열 개수
            place_holder: PLACE_HOLDER[props.category],         // 카테고리별 예문
            // 상담신청하기 개선 2018-07-05
            attach_info: [],                                    // 업로드 전 임시 파일 배열
            attach: props.attach || [],                         // 업로드 후 서버에서 받아온 파일
            is_upload: false,                                   // 업로드 상태값
            files: [],                                          // 파일선택창에서 선택된 파일들
            max_upload: 3,                                      // 최대 업로드 갯수
            refer_site: "",                                     // 참고사이트 (개인카테고리에선 안쓰기로 함)
            upload_info: props.upload_info || {},               // 파일업로드 정책
            //// 개인상담신청 개선 데이터 셋
            extra_info_content: CATEGORY_CONTENT_TEXT[props.category],      // 질의내용 모음
            extra_info_category: CATEGORY_TITLE[props.category],            // 카테고리 코드에 따라 카테고리명 전환
            extra_info: props.extra_info || {},                             // API 호출용 값
            extra_info_keys: EXTRA_INFO_DATA_SET[props.category],           // 각 카테고리별 추가질문 키 값
            extra_info_sub: EXTRA_INFO_SUB_CONTENT[props.category],         // 각 카테고리별 추가질문 세부사항
            extra_info_init_data: INIT_DATA,                                // 추가질문 초기 데이터
            is_loading: false       // 데이터 로딩 여부 체크
        };
        this.FileUpload = new FileUpload();
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        ///
        this.addFile = this.addFile.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.initData = this.initData.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
    }

    componentWillMount() {
        const { content, upload_info } = this.state;
        this.initData(content);
        this.FileUpload.setUploadPolicy(upload_info);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        // 추가질문 내용이 존재하고
        // state와 nextProps의 내용이 다를 경우 현재값으로 저장 및 disabled 체크
        if (nextProps.extra_info && JSON.stringify(this.state.extra_info) !== JSON.stringify(nextProps.extra_info)) {
            if (!nextProps.is_change_category) {
                this.setState({ extra_info: nextProps.extra_info }, () => {
                    this.onCheckState(nextProps.extra_info);
                });
            }
        }
    }

    /**
     * 추가 질문을 카테고리에 맞게 변형한다.
     * @param params
     * @param target
     */
    combineExtraInfo(params, target) {
        const category_extra_info = {};
        target.map(key => {
            if (typeof params[key] === "boolean") {
                category_extra_info[key] = params[key] ? "예" : "아니오";
            } else {
                category_extra_info[key] = params[key];
            }
            return null;
        });
        return category_extra_info;
    }

    /**
     * 파일정보를 내보낸다.
     * @returns {Array}
     */
    getAttachInfo() {
        return this.state.attach_info;
    }

    /**
     * 값을 초기화한다.
     * @param content
     */
    initData(content) {
        const { extra_info_keys, extra_info_init_data, extra_info_sub } = this.state;

        const init_data = {};
        init_data.size = content.length || 0;
        init_data.extra_info = this.combineExtraInfo(extra_info_init_data, extra_info_keys);

        this.setState({ ...init_data, is_loading: true }, () => {
            this.onCheckState(this.state.extra_info);
        });
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
     * 참고사이트 정보를 내보낸다. - 개인카테고리에선 사용안함
     * @returns {string}
     */
    // getUrl() {
    //     return this.state.refer_site;
    // }

    /**
     * 추가질문 정보를 내보낸다.
     * @returns {*|{}|StepContainer.state.extra_info}
     */
    getExtraInfo() {
        return this.state.extra_info;
    }

    /**
     * 상담내용을 가져온다.
     * @returns {*}
     */
    getContent() {
        return this.state.content;
    }

    /**
     * 밸리데이션 완료 시 신청하기 버튼 활성화
     * @param extra_info
     */
    onCheckState(extra_info) {
        const { extra_info_keys } = this.state;
        const check = extra_info_keys.filter(key => typeof extra_info[key] !== "boolean");
        let flag = true;
        const button = this.button;

        const empty_check = check.filter(key => extra_info[key] === "");

        if (empty_check.length < 1) {
            button.classList.remove("disabled");
            flag = false;
        } else {
            button.classList.add("disabled");
        }
        button.disabled = flag;
        // const { extra_info_keys } = this.state;
        // const is_nec_data = ["how_shot", "shot_place"];
        //
        // const check = is_nec_data.filter(key => {
        //     return extra_info[key];
        // });
        //
        // console.log(check, extra_info[check]);

        // let flag = true;
        // const button = this.button;

        // console.log(">>>", check);
        //
        // const empty_check = check.filter(key => extra_info[key] === "");
        //
        // console.log("empty_check", empty_check);
        //
        // if (empty_check.length < 1) {
        //     button.classList.remove("disabled");
        //     flag = false;
        // } else {
        //     button.classList.add("disabled");
        // }
        // button.disabled = flag;
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
     * 입력내용 폼 핸들러.
     * @param value
     * @param name
     */
    onChangeFormHandler(value, name) {
        let handler = "";

        if (name === "content") handler = this.setComment(value);
        else if (name === "refer_site") handler = ({ [name]: value.replace(/[^{\d}{a-zA-Z}{!@#$%^&*()_+=/:;.₩,?"'<>~\-}]+/gi, "") });

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
     * 추가 질문 선택 데이터 저장한다.
     * @param key
     * @param item
     */
    onSelectItem(key, item, idx) {
        //extra_info : DB에 저장될 자료, extra_info_int_data: 기본 자료
        const { extra_info, extra_info_init_data, extra_info_sub } = this.state;
        // const is_nec_data = ["how_shot", "shot_place"];
        if (!item.pick) {       // 옵션을 선택했다면
            if (typeof extra_info_init_data[key] === "boolean") {
                extra_info[key] = "예";
            } else {
                extra_info[key] = item.CAPTION;
            }
        }

        if (item.pick) {        // 옵션을 취소한다면
            if (typeof extra_info_init_data[key] === "boolean") {
                extra_info[key] = "아니오";
            } else {
                extra_info[key] = "";
            }
        }

        extra_info_sub[key][idx].pick = !item.pick;

        extra_info_sub[key].map((obj, i) => {
            if (idx !== i) {
                obj.pick = false;
            }
            return null;
        });

        this.setState({
            extra_info,
            extra_info_sub
        }, () => {
            this.onCheckState(this.state.extra_info);
        });
        // if (typeof extra_info_init_data[key] === "boolean") {
        //     extra_info[key] = !extra_info_init_data[key] ? "예" : "아니오";
        //     extra_info_init_data[key] = !extra_info_init_data[key];
        // } else {
        //     extra_info[key] = value;
        // }
        // this.setState({ extra_info }, () => {
        //     console.log("onSelectItme");
        //     this.onCheckState(this.state.extra_info);
        // });
    }


    /**
     * 파일 인덱스의 배열을 삭제한다.
     * @param key
     * @param idx
     */
    deleteAttachFile(key, idx) {
        const { attach_info } = this.state;
        PopModal.confirm("파일을 삭제하시겠습니까?",
            () => {
                if (key === "attach_info") {
                    attach_info.splice(idx, 1);
                    this.setState({ attach_info });
                } else if (key === "attach") {
                    if (typeof this.props.onDeleteAttach === "function") {
                        this.props.onDeleteAttach(idx);
                    }
                }
            },
            null
        );
    }

    render() {
        const {
            content,
            size,
            attach_info,
            place_holder,
            extra_info_keys,
            extra_info_content,
            extra_info,
            extra_info_sub,
            extra_info_category,
            is_loading } = this.state;
        const { attach } = this.props;

        if (!is_loading) {
            return null;
        }
        return (
            <div className="consult_progress__step-content">
                <div className="consult_progress__step-category">
                    <p className="consult_progress__step-category-name">{extra_info_category}</p>
                </div>
                <div className="step-content">
                    {Array.isArray(extra_info_keys) && extra_info_keys.length > 0 &&
                        extra_info_keys.map((obj, idx) => {
                            return (
                                <div className="step-content__row" key={`advice-orders-content-row__${idx}`}>
                                    <div className="step-content__row-title">
                                        <h4 className="title">{`${idx + 1}. ${KEYS_TEXT[obj]}`}</h4>
                                    </div>
                                    <div className="step-content__row-content">
                                        {Array.isArray(extra_info_sub[obj]) && extra_info_sub[obj].length &&
                                            extra_info_sub[obj].map((sub_obj, sub_idx) => {
                                                return (
                                                    <div className="step-content__row-content-pick-container" key={`type-object__${sub_idx}`} onClick={() => { this.onSelectItem(obj, sub_obj, sub_idx); }}>
                                                        <div className="step-content__row-content-pick">
                                                            <Img image={{ src: sub_obj.IMG, type: "image" }} isCrop />
                                                            {/*{(extra_info[obj] === sub_obj.CAPTION || (extra_info[obj] === true || extra_info[obj] === "예")) &&*/}
                                                            {sub_obj.pick &&
                                                                <div className="select-box">
                                                                    <div className="check-div">
                                                                        <div />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="step-content__row-content-pick__text">
                                                            <h5 className="step-content__row-content-pick__sub-text" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>{sub_obj.CAPTION}</h5>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                    <div className="step-content__row">
                        <div className="step-content__row-title">
                            <h4 className="title">4.<span style={{ color: "#0581f7" }}> [선택]</span>{extra_info_content}</h4>
                        </div>
                        <div className="step-content-inner">
                            <div className="step-content__content" ref={node => { this.write_content = node; }}>
                                <textarea
                                    className="textarea"
                                    value={content}
                                    // ref={node => { this.text_area = node; }}
                                    rows="4"
                                    maxLength={3000}
                                    placeholder={place_holder}
                                    name="content"
                                    onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                                    onFocus={e => this.onFocus(e, this.write_content)}
                                    onBlur={e => this.onBlur(e, this.write_content)}
                                />
                                <div className="text-area-size">
                                    <div />
                                    <span><span>{`${size}`}</span>{" / 3000"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div
                            className="step-content__row-title"
                            style={{ display: "flex", flex: "1 1 auto", justifyContent: "space-between", alignItems: "center" }}
                        >
                            <h4 className="title">5.
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
                        {(Array.isArray(attach) && attach.length > 0) || (Array.isArray(attach_info) && attach_info.length > 0) ?
                            <div className="step-content" style={{ marginTop: "5px", padding: "0 1rem", border: "1px solid #e1e1e1" }}>
                                {Array.isArray(attach) && attach.length > 0 && attach.map((obj, idx) => {
                                    return (
                                        <div className="download-list" key={`consult-attach-file__${idx}`}>
                                            <h5 className="download-list-row">{obj.file_name}</h5>
                                            <button className="button step-attach-file__delete-button" onClick={() => this.deleteAttachFile("attach", idx)}>x</button>
                                        </div>
                                    );
                                })}
                                {Array.isArray(attach_info) && attach_info.length > 0 && attach_info.map((obj, idx) => {
                                    return (
                                        <div className="download-list" key={`consult-attach-file__${idx}`}>
                                            <h5 className="download-list-row">{obj.file_name}</h5>
                                            <button className="button step-attach-file__delete-button" onClick={() => this.deleteAttachFile("attach_info", idx)}>x</button>
                                        </div>
                                    );
                                })}
                            </div> :
                            <div className="step-content" style={{ padding: "0", marginBottom: "10px" }} />
                        }
                    </div>
                </div>
                <div className="consult_progress__step-button">
                    <div className="button-box two-button">
                        <button className="theme_black" style={{ width: "calc(50% - 5px)" }} onClick={this.onPrev}>이전</button>
                        <button
                            className="theme_black"
                            style={{ width: "calc(50% - 5px)" }}
                            //disabled={is_disabled && "disabled"}
                            ref={node => { this.button = node; }}
                            onClick={this.onNext}
                        >다음단계로 진행</button>
                    </div>
                </div>
            </div>
        );
    }
}
