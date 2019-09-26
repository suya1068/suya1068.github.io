import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import utils from "forsnap-utils";
import Img from "desktop/resources/components/image/Img";
import { CATEGORY_CAPTIONS } from "shared/constant/quotation.const";
import RequestJS, { STATE, CONST } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";

class QuotationContent extends Component {
    constructor() {
        super();

        //const reserve = RequestJS.getState(STATE.RESERVE.key);
        // const category = reserve[STATE.RESERVE.CATEGORY];
        // if (RequestJS.isExcept()) {
        //     RequestJS.setState(STATE.COUNSEL, "Y");
        // } else {
        //     RequestJS.setState(STATE.COUNSEL, "N");
        // }
        // RequestJS.setState(STATE.COUNSEL, "Y");

        this.state = {
            [STATE.ORDER_NO]: RequestJS.getState(STATE.ORDER_NO),
            [STATE.CONTENT]: RequestJS.getState(STATE.CONTENT),
            //[STATE.BUDGET]: RequestJS.getState(STATE.BUDGET),
            //[STATE.COUNSEL]: RequestJS.getState(STATE.COUNSEL),
            //[STATE.MEETING]: RequestJS.getState(STATE.MEETING),
            [STATE.ATTACH]: RequestJS.getState(STATE.ATTACH),
            [STATE.ATTACH_FILE]: RequestJS.getState(STATE.ATTACH_FILE),
            //[STATE.COUNSEL_TIME]: RequestJS.getState(STATE.COUNSEL_TIME),
            files: [],
            isUpload: false,
            isProcess: false,
            attachLimit: 3
            //counselTimeOption: CONST.counselTimeOption,
            //counselTimeTempMsg: "",
            //counselTimeSelect: ""
        };

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.onChangePrice = this.onChangePrice.bind(this);
        this.onSwitch = this.onSwitch.bind(this);

        this.addFile = this.addFile.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.deleteAttach = this.deleteAttach.bind(this);
        this.makeSwitchOption = this.makeSwitchOption.bind(this);
        //
        this.addFileAndIgnoreImage = this.addFileAndIgnoreImage.bind(this);
        this.fileUploadAll = this.fileUploadAll.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        // const { counselTimeOption } = this.state;
        // this.initCounselSelect(counselTimeOption, this.state[STATE.COUNSEL_TIME]);
        window.scroll(0, 0);
    }

    // initCounselSelect(counselTimeOption, msg) {
    //     const selectMsg = counselTimeOption.filter(obj => {
    //         return msg === obj;
    //     })[0];
    //     let changeMsg = msg;
    //     if (msg !== "" && !selectMsg) {
    //         changeMsg = "직접입력";
    //     }
    //     this.setState({
    //         counselTimeSelect: changeMsg,
    //         counselTimeTempMsg: !selectMsg ? msg : changeMsg
    //     });
    // }

    /**
     * 요청사항에 포커스가오면 탑으로 이동
     * @param e
     */
    onFocus(e) {
        // const target = e.target;
        // setTimeout(() => {
        //     target.scrollIntoView();
        //     setTimeout(() => {
        //         window.scrollTo(0, 0);
        //     }, 0);
        // }, 500);
    }

    /**
     * 요청사항 변경
     * @param e
     */
    onChange(e, key) {
        const target = e.target;
        const value = target.value;
        const maxLength = target.maxLength;

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        this.setState(RequestJS.setState(key, value));
    }

    // /**
    //  * 옵션 가격 변경
    //  * @param e - Object (이벤트 객체)
    //  * @param name - String (키값)
    //  */
    // onChangePrice(e, name) {
    //     const target = e.target;
    //     let value = target.value;
    //
    //     const maxLength = target.maxLength;
    //     value = value.replace(/[,\D]+/g, "");
    //
    //     if (maxLength && maxLength > -1 && value.length > maxLength) {
    //         return;
    //     }
    //
    //     this.setState(RequestJS.setState(name, value && !isNaN(value) ? parseInt(value, 10) : ""));
    // }

    // onChangeCounselTime(e, time) {
    //     const target = e.target;
    //     const value = target.value;
    //
    //     this.setState({
    //         counselTimeTempMsg: value
    //     }, () => {
    //         this.setState(RequestJS.setState(time, value));
    //     });
    // }
    //
    // onSelectToCounselTime(time, value) {
    //     this.setState({
    //         counselTimeSelect: value,
    //         counselTimeTempMsg: ""
    //     }, () => {
    //         this.setState(RequestJS.setState(time, value === "직접입력" ? "" : value));
    //     });
    // }

    /**
     * 필요해요/괜찮아요 변경
     * @param b
     * @param key
     */
    onSwitch(b, key, sub) {
        let value;
        if (b) {
            if (sub) {
                value = "NA";
            } else {
                value = "Y";
            }
        } else {
            value = "N";
        }

        this.setState(RequestJS.setState(key, value));
    }

    addFile(e) {
        const { attachLimit } = this.state;
        const attach = this.state[STATE.ATTACH];
        const target = e.currentTarget;
        const files = target.files;

        if (files !== null && files.length > 0) {
            let isExt = false;
            let count = 0;

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if (!file.size) {
                    PopModal.alert("잘못된 이미지이거나 접근 권한이 설정되어있지 않습니다.");
                    break;
                } else if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                    if (attach.length < attachLimit) {
                        this.state.files.push(file);
                        count += 1;
                    } else {
                        PopModal.alert(`첨부할 수 있는 파일 수를 넘겼습니다. (${attach.length}/${attachLimit})`);
                        break;
                    }
                } else {
                    isExt = true;
                }
            }

            if (isExt) {
                PopModal.alert("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.");
            }

            if (!this.state.isUpload) {
                if (count > 0) {
                    this.state.isUpload = true;
                    this.fileUpload(this.state.files.length);
                }
            }
        }
    }

    addFileAndIgnoreImage(e) {
        const target = e.currentTarget;
        const files = target.files;

        if (files !== null && files.length > 0) {
            let isExt = false;

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if (!file.size) {
                    PopModal.alert("잘못된 파일이거나 접근 권한이 설정되어있지 않습니다.");
                    break;
                } else if ((/(pdf|xls|xlsx|ppt|pptx|zip)$/i).test(ext)) {
                    this.state.files.push(file);
                } else {
                    isExt = true;
                }
            }

            if (isExt) {
                PopModal.alert("파일 업로드는\nPFD, XLS, XLSX, PPT, PPTX, ZIP 확장자만 가능합니다.");
            }

            if (!this.state.isUpload && this.state.files.length > 0) {
                this.state.isUpload = true;
                this.fileUploadAll(this.state.files.length);
            }
        }
    }

    fileUploadAll(length) {
        const { files, isUpload } = this.state;
        const orderNo = this.state[STATE.ORDER_NO];

        PopModal.progressCount(length - files.length, length);
        if (files !== null && files.length > 0 && isUpload) {
            const file = files[0];

            RequestJS.uploadS3(file, false).then(res => {
                if (res.status) {
                    API.orders.attachFile(orderNo, { key: res.uploadKey, file_name: res.file_name }).then(response => {
                        if (response.status === 200) {
                            const data = response.data;
                            const list = data.attach;
                            this.state.files.shift();
                            this.setState(RequestJS.setState(STATE.ATTACH_FILE, list));

                            this.fileUploadAll(length);
                        }
                    }).catch(error => {
                        let message = "업로드중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.";
                        if (error && error.data) {
                            message = error.data;
                        }

                        PopModal.alert(message, { key: "quotation-content-upload-error" });
                        this.state.files.shift();
                        if (this.state.files.length > 0) {
                            this.fileUploadAll(length - 1);
                        } else {
                            this.state.isUpload = false;
                            //this.inputFile_all.value = "";
                            PopModal.closeProgressCount();
                        }
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
                    this.fileUploadAll(length - 1);
                } else {
                    this.state.isUpload = false;
                    //this.inputFile_all.value = "";
                    PopModal.closeProgressCount();
                }
            });
        } else {
            this.state.isUpload = false;
            //this.inputFile_all.value = "";
            setTimeout(() => {
                PopModal.closeProgressCount();
                // PopModal.toast("업로드가 완료되었습니다.");
            }, 500);
        }
    }

    // 이미지 업로드 처리
    fileUpload(length) {
        const { files, isUpload } = this.state;
        const orderNo = this.state[STATE.ORDER_NO];
        PopModal.progressCount(length - files.length, length);

        if (files !== null && files.length > 0 && isUpload) {
            const attach = this.state[STATE.ATTACH];

            if (attach.length > 2) {
                this.state.isUpload = false;
                this.state.files = [];
                this.inputFile.value = "";
                PopModal.closeProgressCount();
                PopModal.toast("첨부파일은 최대 3개까지 가능합니다");
                return;
            }

            const file = files[0];

            RequestJS.uploadS3(file).then(res => {
                if (res.status) {
                    API.orders.attach(orderNo, { key: res.uploadKey }).then(response => {
                        if (response.status === 200) {
                            const data = response.data;

                            this.state.files.shift();
                            this.setState(RequestJS.setState(STATE.ATTACH, data.list));
                            this.fileUpload(length);
                        }
                    }).catch(error => {
                        let message = "업로드중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.";
                        if (error && error.data) {
                            message = error.data;
                        }

                        PopModal.alert(message, { key: "quotation-content-upload-error" });
                        this.state.files.shift();
                        if (this.state.files.length > 0) {
                            this.fileUpload(length - 1);
                        } else {
                            this.state.isUpload = false;
                            this.inputFile.value = "";
                            PopModal.closeProgressCount();
                        }
                    });
                }
            }).catch(error => {
                let message = "JPG, PNG 파일의 형식의 20MB이하 이미지를 업로드해 주세요.";
                if (error && error.message) {
                    message = error.message;
                }

                PopModal.alert(message, { key: "quotation-content-upload-error" });
                this.state.files.shift();
                if (this.state.files.length > 0) {
                    this.fileUpload(length - 1);
                } else {
                    this.state.isUpload = false;
                    this.inputFile.value = "";
                    PopModal.closeProgressCount();
                }
            });
        } else {
            this.state.isUpload = false;
            this.inputFile.value = "";
            setTimeout(() => {
                PopModal.closeProgressCount();
                // PopModal.toast("업로드가 완료되었습니다.");
            }, 500);
        }
    }

    deleteAttach(orderNo, attachNo) {
        RequestJS.deleteAttach(orderNo, attachNo).then(response => {
            if (response.status === 200) {
                const data = response.data;

                this.setState(RequestJS.setState(STATE.ATTACH, data.list));
            }
        }).catch(error => {
        });
    }

    deleteAttachFile(order_no, attach_no) {
        RequestJS.deleteAttachFile(order_no, attach_no).then(response => {
            if (response.status === 200) {
                const data = response.data;
                const list = data.attach;

                this.setState(RequestJS.setState(STATE.ATTACH_FILE, list || []));
            }
        }).catch(error => {
        });
    }

    makeSwitchOption(title, subtitle, data, key) {
        const isNeed = data !== null && (data > 0 || data === "NA" || data === "Y");
        const isUndefined = data === "NA";
        const value = data === null ? "" : data;

        return (
            <div key={`quotation-options-${key}`} className={classNames("column__box inline__box option__switch", isNeed ? "option__show" : "")}>
                <div className="column__row">
                    <div className="row__title">
                        <span>{title}</span>
                    </div>
                    <div className="row__content direction__row">
                        <button className={classNames("button button__theme__gray", "need", isNeed ? "active" : "")} onClick={() => { if (!isNeed) { this.onSwitch(true, key, subtitle); } }}>필요해요</button>
                        <button className={classNames("button button__theme__gray", data === "N" ? "active" : "")} onClick={() => { this.onSwitch(false, key, subtitle); }}>필요없어요</button>
                    </div>
                </div>
                {subtitle ?
                    <div className="column__row hr" />
                    : null}
                {subtitle ?
                    <div className="column__row">
                        <div className="row__title">
                            <span>{subtitle}</span>
                        </div>
                        <div className="row__content direction__row">
                            <div className="quotation__qty">
                                <button className="qty__button" onClick={() => this.onQty(false, key, data)}><span>-</span></button>
                                <div className="qty__text">
                                    <input
                                        type={isUndefined ? "text" : "tel"}
                                        value={isUndefined ? "미정" : value}
                                        onFocus={e => this.onFocus(e, key)}
                                        onChange={e => this.onChangeQty(key, e.target.value)}
                                    />
                                </div>
                                <button className="qty__button" onClick={() => this.onQty(true, key, data)}><span>+</span></button>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        );
    }

    render() {
        const { attachLimit } = this.state;
        // const { attachLimit, counselTimeOption, counselTimeTempMsg, counselTimeSelect } = this.state;
        const content = this.state[STATE.CONTENT];
        // const budget = this.state[STATE.BUDGET];
        // const counsel = this.state[STATE.COUNSEL];
        // const meeting = this.state[STATE.MEETING];
        const attach = this.state[STATE.ATTACH];
        const attach_file = this.state[STATE.ATTACH_FILE];
        const reserve = RequestJS.getState(STATE.RESERVE.key);
        const category = reserve[STATE.RESERVE.CATEGORY];
        const order_no = RequestJS.getState(STATE.ORDER_NO);
        // const isCounsel = false; // ["PRODUCT", "FOOD", "INTERIOR"].indexOf(category) !== -1;
        // const isMeeting = false; // ["PRODUCT", "FOOD", "INTERIOR"].indexOf(category) !== -1;
        // const counselTime = this.state[STATE.COUNSEL_TIME];

        return (
            <div className="quotation__content">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>자세한 촬영 내용을 입력해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <textarea
                                    className="textarea"
                                    rows="6"
                                    maxLength="1000"
                                    placeholder={`예시) ${CATEGORY_CAPTIONS[category]}`}
                                    value={content}
                                    onFocus={this.onFocus}
                                    onChange={e => this.onChange(e, STATE.CONTENT)}
                                />
                            </div>
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <span><span style={{ color: "#ffba00" }}>[ 선택 ]</span> 촬영하고싶은 컨셉의 사진을 등록해 주세요.</span>
                                    <span className="count">{attach.length}/{attachLimit}</span> 장
                                </div>
                                <div className="row__content direction__row">
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        multiple="multiple"
                                        accept="image/jpeg, image/png, image/bmp"
                                        onChange={this.addFile}
                                        ref={ref => (this.inputFile = ref)}
                                    />
                                    <button className={classNames("button", "button__round", "button__default")} onClick={() => this.inputFile.click()}>업로드</button>
                                </div>
                            </div>
                            {attach.map(obj => {
                                return [<div className="column__row hr" />,
                                    <div className="column__row" key={`attach-${obj.order_no}-${obj.no}`}>
                                        <div className={classNames("row__content", "align-end")}>
                                            <button className="attach__del button button__default" onClick={() => this.deleteAttach(obj.order_no, obj.no)}><i className="m-icon m-icon-cancel" /></button>
                                            <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} isContentResize />
                                        </div>
                                    </div>];
                            })}
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="content__caption text-left">
                                    {utils.linebreak("JPG, PNG 파일의 형식의 이미지를 최대 3장까지 첨부할 수 있습니다. (20MB 이하) 이미지 첨부는 필수 항목이 아닙니다.")}
                                </span>
                            </div>
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <span><span style={{ color: "#ffba00" }}>[ 선택 ]</span> 파일을 첨부해주세요.</span>
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
                                            "application/zip"    // zip
                                        }
                                        onChange={this.addFileAndIgnoreImage}
                                        ref={ref => (this.inputFile_all = ref)}
                                    />
                                    <button className={classNames("button", "button__round", "button__default")} onClick={() => this.inputFile_all.click()}>업로드</button>
                                </div>
                            </div>
                            {attach_file.map((obj, idx) => {
                                return (
                                    <div className="upload-file-test-div" key={`attach-file-${order_no}-${idx}`}>
                                        <a href={`${__SERVER__.data}${obj.path}`} id={`attach_${idx}`} download={`attach_${idx}`} target="_blank">{obj.file_name}</a>
                                        <button className="attach__del button button__default" onClick={() => this.deleteAttachFile(order_no, idx)}><i className="m-icon m-icon-cancel" /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="content__caption text-left">
                                    {utils.linebreak("PDF, PPT, PPTX, XLS, XLSX, ZIP 파일을 첨부할 수 있습니다.(20MB 이하)")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        /*  백업
        return (
            <div className="quotation__content">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>자세한 촬영 내용을 입력해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <textarea
                                    className="textarea"
                                    rows="6"
                                    maxLength="1000"
                                    placeholder={`예시) ${CATEGORY_CAPTIONS[category]}`}
                                    value={content}
                                    onFocus={this.onFocus}
                                    onChange={e => this.onChange(e, STATE.CONTENT)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="content__column__head">
                        <h1>최대예산을 입력해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <input
                                    className="input border__none quotation__price"
                                    type="tel"
                                    maxLength="11"
                                    value={utils.format.price(budget)}
                                    onChange={e => this.onChangePrice(e, STATE.BUDGET)}
                                /><span>원</span>
                            </div>
                        </div>
                        {isCounsel ? this.makeSwitchOption("전화상담이 필요한가요?", null, counsel, STATE.COUNSEL) : null}
                        {isCounsel ?
                            <div className="column__row">
                                <div className="row__content direction__row justify-center">
                                    <span className="exclamation">!</span>
                                    <span className="content__caption text-left">
                                        촬영 진행이 익숙하지 않으시거나, 촬영 세부사항(옵션)이나 컨셉에 대한 상담이 필요한 경우 전화상담을 통해 자세한 견적이 가능합니다.
                                    </span>
                                </div>
                            </div> : null
                        }
                        {isMeeting ? this.makeSwitchOption("직접만나서 협의하시겠습니까?", null, meeting, STATE.MEETING) : null}
                    </div>
                    <div className="content__column__head">
                        <h1>상담가능시간</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="consulting-able-time">
                            {counselTimeOption.map((obj, idx) => {
                                const isSelect = obj === counselTimeSelect;
                                const counselContent = [];

                                if (idx === 2) {
                                    counselContent.push(
                                        <button
                                            className={classNames("button__check", { active: isSelect })}
                                            key={`counsel_content__button__${idx}`}
                                            onClick={() => this.onSelectToCounselTime(STATE.COUNSEL_TIME, obj)}
                                        >
                                            <div className="icon__circle">
                                                <span className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                            </div>
                                            <span>{obj}</span>
                                            <div className="content-row">
                                                <input
                                                    className="input border__none counsel_msg"
                                                    type="text"
                                                    maxLength="30"
                                                    value={counselTimeTempMsg}
                                                    onChange={e => this.onChangeCounselTime(e, STATE.COUNSEL_TIME)}
                                                />
                                            </div>
                                        </button>
                                    );
                                } else {
                                    counselContent.push(
                                        <button
                                            className={classNames("button__check", { active: isSelect })}
                                            key={`counsel_content__button__${idx}`}
                                            onClick={() => this.onSelectToCounselTime(STATE.COUNSEL_TIME, obj)}
                                        >
                                            <div className="icon__circle">
                                                <span className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                            </div>
                                            <span>{obj}</span>
                                        </button>
                                    );
                                }
                                return counselContent;
                            })}
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영하고싶은 컨셉의 사진을 등록해 주세요.</span>
                                    <span className="count">{attach.length}/{attachLimit}</span> 장
                                </div>
                                <div className="row__content direction__row">
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        multiple="multiple"
                                        accept="image/jpeg, image/png, image/bmp"
                                        onChange={this.addFile}
                                        ref={ref => (this.inputFile = ref)}
                                    />
                                    <button className={classNames("button", "button__round", "button__default")} onClick={() => this.inputFile.click()}>업로드</button>
                                </div>
                            </div>
                            {attach.map(obj => {
                                return [<div className="column__row hr" />,
                                    <div className="column__row" key={`attach-${obj.order_no}-${obj.no}`}>
                                        <div className={classNames("row__content", "align-end")}>
                                            <button className="attach__del button button__default" onClick={() => this.deleteAttach(obj.order_no, obj.no)}><i className="m-icon m-icon-cancel" /></button>
                                            <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} isContentResize />
                                        </div>
                                    </div>];
                            })}
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="content__caption text-left">
                                    {utils.linebreak("JPG, PNG 파일의 형식의 이미지를 최대 3장까지 첨부할 수 있습니다. (20MB 이하) 이미지 첨부는 필수 항목이 아닙니다.")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
         */
    }
}

// 전화상담이 필요한가요?
// 직접만나서 협의하시겠습니까?

export default QuotationContent;
