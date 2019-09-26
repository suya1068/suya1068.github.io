import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import Img from "desktop/resources/components/image/Img";
import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJS, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";
import PopOfferContents from "./PopOfferContents";

class QuotationContent extends Component {
    constructor() {
        super();

        this.state = {
            [REQ_STATE.ORDER_NO]: RequestJS.getState(REQ_STATE.ORDER_NO),
            [RES_STATE.OFFER_NO]: ResponseJS.getState(RES_STATE.OFFER_NO),
            [RES_STATE.CONTENT]: ResponseJS.getState(RES_STATE.CONTENT),
            [RES_STATE.ATTACH]: ResponseJS.getState(RES_STATE.ATTACH),
            [RES_STATE.ATTACH_FILE]: ResponseJS.getState(RES_STATE.ATTACH_FILE),
            files: [],
            isUpload: false,
            isProcess: false,
            attachLimit: 3
        };

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);

        this.addFile = this.addFile.bind(this);
        this.fileUpload = this.fileUpload.bind(this);

        // 최근 제출한 촬영내용 리스트 관련 메서드
        this.previousContent = this.previousContent.bind(this);
        this.onSubmitContent = this.onSubmitContent.bind(this);
        //
        this.addFileAndIgnoreImage = this.addFileAndIgnoreImage.bind(this);
        this.fileUploadAll = this.fileUploadAll.bind(this);
        this.deleteAttachFile = this.deleteAttachFile.bind(this);
    }

    componentDidMount() {
        window.scroll(0, 0);
    }

    /**
     * 요청사항에 포커스가오면 탑으로 이동
     * @param e
     */
    onFocus(e) {
        // if (utils.agent.isMobile()) {
        //     const target = e.target;
        //     setTimeout(() => {
        //         target.scrollIntoView();
        //         setTimeout(() => {
        //             window.scrollTo(0, 0);
        //         }, 0);
        //     }, 500);
        // }
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

        this.setState(ResponseJS.setState(key, value));
    }

    onSubmitContent(content) {
        this.setState(ResponseJS.setState(RES_STATE.CONTENT, content), () => {
            this.closeModalOfferContents();
        });
    }

    addFile(e) {
        const { attachLimit } = this.state;
        const attach = this.state[RES_STATE.ATTACH];
        const target = e.currentTarget;
        const files = target.files;

        if (files !== null && files.length > 0) {
            let isExt = false;
            let count = 0;

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
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
        const offer_no = this.state[RES_STATE.OFFER_NO];

        PopModal.progressCount(length - files.length, length);
        if (files !== null && files.length > 0 && isUpload) {
            const file = files[0];

            ResponseJS.uploadS3(file, false).then(res => {
                if (res.status) {
                    API.offers.attachFile(offer_no, { key: res.uploadKey, file_name: res.file_name }).then(response => {
                        if (response.status === 200) {
                            const data = response.data;
                            const list = data.attach;
                            this.state.files.shift();
                            this.setState(ResponseJS.setState(RES_STATE.ATTACH_FILE, list));

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
        const offerNo = this.state[RES_STATE.OFFER_NO];

        PopModal.progressCount(length - files.length, length);
        if (files !== null && files.length > 0 && isUpload) {
            const attach = this.state[RES_STATE.ATTACH];

            if (attach.length > 2) {
                this.state.isUpload = false;
                this.state.files = [];
                this.inputFile.value = "";
                PopModal.closeProgressCount();
                PopModal.toast("첨부파일은 최대 3개까지 가능합니다");
                return;
            }

            const file = files[0];

            ResponseJS.uploadS3(file).then(res => {
                if (res.status) {
                    API.offers.attach(offerNo, { key: res.uploadKey }).then(response => {
                        if (response.status === 200) {
                            const data = response.data;

                            this.state.files.shift();
                            this.setState(ResponseJS.setState(RES_STATE.ATTACH, data.list));
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
                // PopModal.toast("업로드가 완료되었습니다");
            }, 500);
        }
    }

    deleteAttach(offerNo, attachNo) {
        ResponseJS.deleteAttach(offerNo, attachNo).then(response => {
            if (response.status === 200) {
                const data = response.data;

                this.setState(ResponseJS.setState(RES_STATE.ATTACH, data.list));
            }
        });
    }

    deleteAttachFile(offer_no, attach_no) {
        ResponseJS.deleteAttachFile(offer_no, attach_no).then(response => {
            if (response.status === 200) {
                const data = response.data;
                const list = data.attach;

                this.setState(ResponseJS.setState(RES_STATE.ATTACH_FILE, list || []));
            }
        }).catch(error => {
        });
    }

    previousContent() {
        const user = auth.getUser();
        if (user) {
            ResponseJS.previousContentLoad(user.id).then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    const list = this.combineOfferContentsList(data.list);
                    if (list.length > 0) {
                        this.renderOfferContentsPop(list);
                    } else {
                        PopModal.toast("최근 발송한 내역이 없습니다.");
                    }
                }
            });
        }
    }

    closeModalOfferContents(name = "") {
        PopModal.close(name);
    }

    combineOfferContentsList(list) {
        const { offer_no } = this.state;
        const _list = list.reduce((result, obj) => {
            if (Number(obj.offer_no) !== Number(offer_no)) {
                result.push(obj);
            }
            return result;
        }, []);

        return _list;
    }

    renderOfferContentsPop(list) {
        const isMobile = utils.agent.isMobile() ? "mobile" : "desktop";
        const modalName = `previous-offer-contents ${isMobile}`;
        PopModal.createModal(modalName, <PopOfferContents list={list} onClose={this.closeModalOfferContents} onSubmitContent={this.onSubmitContent} />, { className: modalName });
        PopModal.show(modalName);
    }

    render() {
        const { attachLimit } = this.state;
        const content = this.state[RES_STATE.CONTENT];
        const attach = this.state[RES_STATE.ATTACH];
        const attach_file = this.state[RES_STATE.ATTACH_FILE];
        const offer_no = this.state[RES_STATE.OFFER_NO];
        return (
            <div className="quotation__content">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1 style={{ flex: 1 }}>촬영내용을 자세히 설명해주세요.</h1>
                        <button className="button button__default pre-content" onClick={this.previousContent}>최근내용 불러오기</button>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <textarea
                                    className="_textarea"
                                    rows="6"
                                    maxLength="1000"
                                    placeholder="연락처, 카톡아이디, 인스타그램, 스튜디오명 등 개인정보를 노출하여 직거래를 유도할 경우 서비스 이용에 즉각 제재를 받을 수 있습니다. 직거래 불량회원으로 이용자격 제한된 회원의 경우 재가입이 불가능하니 유의하시기 바랍니다."
                                    value={content}
                                    onFocus={this.onFocus}
                                    onChange={e => this.onChange(e, RES_STATE.CONTENT)}
                                />
                            </div>
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <span><span style={{ color: "#ffba00" }}>[ 선택 ]</span> 촬영 컨셉을 설명할 수 있는 사진을 등록해주세요.</span>
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
                                    <div className="column__row" key={`attach-${obj.offer_no}-${obj.no}`}>
                                        <div className={classNames("row__content", "align-end")}>
                                            <button className="attach__del button button__default" onClick={() => this.deleteAttach(obj.offer_no, obj.no)}><i className="m-icon m-icon-cancel" /></button>
                                            <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} isContentResize />
                                        </div>
                                    </div>];
                            })}
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="caption text-center">
                                    {utils.linebreak("JPG, PNG 파일의 형식의 이미지를 최대 3장까지 첨부할 수 있습니다. (20MB 이하)\n이미지 첨부는 필수 항목이 아닙니다.")}
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
                                    <div className="upload-file-test-div" key={`attach-file-${offer_no}-${idx}`}>
                                        <a href={`${__SERVER__.data}${obj.path}`} id={`attach_${idx}`} download={`attach_${idx}`} target="_blank">{obj.file_name}</a>
                                        <button className="attach__del button button__default" onClick={() => this.deleteAttachFile(offer_no, idx)}><i className="m-icon m-icon-cancel" /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="caption text-left">
                                    {utils.linebreak("PDF, PPT, PPTX, XLS, XLSX, ZIP 파일을 첨부할 수 있습니다.(20MB 이하)")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationContent;
