import "../ArtistReviewPage.scss";
import React, { Component } from "react";
import { routerShape } from "react-router";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import { ARTIST_SELF_REVIEW_STATUS } from "shared/constant/aritst.const";
import { BIZ_CATEGORY } from "shared/constant/product.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import regular from "shared/constant/regular.const";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";
import UploadController from "shared/components/upload/UploadController";
import UploadItem from "shared/components/upload/components/UploadItem";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";

import ImageList from "../modal/ImageList";
import ImageSizeChange from "../modal/ImageSizeChange";
import ReviewExample from "../../pop/review/ReviewExample";

class ArtistReviewEditPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            isLoad: false,
            self_review_no: props.params.self_review_no || "",
            category_list: [],
            imageList: [],
            upload_info: null,
            uploadThumb: null,
            length: 0,
            form: {
                category: "",
                title: "",
                content: "",
                thumb_img: "",
                tag: ""
            },
            intervalId: null,
            agree: false
        };

        this.oEditors = [];

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onThumbReady = this.onThumbReady.bind(this);
        this.onThumbLoad = this.onThumbLoad.bind(this);

        this.fetch = this.fetch.bind(this);
        this.fetchCategory = this.fetchCategory.bind(this);
        this.fetchList = this.fetchList.bind(this);
        this.addFile = this.addFile.bind(this);
        this.pasteImage = this.pasteImage.bind(this);
        this.pasteHTML = this.pasteHTML.bind(this);
        this.uploadThumb = this.uploadThumb.bind(this);
        this.insertSelfReviewImage = this.insertSelfReviewImage.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.contentUpdate = this.contentUpdate.bind(this);
        this.layoutThumb = this.layoutThumb.bind(this);
    }

    componentWillMount() {
        UploadController.setMaxThread(1);
    }

    componentDidMount() {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        Promise.all([this.fetchCategory(), this.fetch()])
            .then(response => {
                if ((response[0] && response[1]) || !this.state.self_review_no) {
                    this.setStateData(state => {
                        return {
                            isLoad: true,
                            form: Object.assign({}, state.form, {
                                category: state.form.category ? state.form.category : (state.category_list ? state.category_list[0].code : null) || "PRODUCT"
                            })
                        };
                    }, () => {
                        nhn.husky.EZCreator.createInIFrame({
                            oAppRef: this.oEditors,
                            elPlaceHolder: "ir1",
                            sSkinURI: "/smarteditor2/SmartEditor2Skin.html",
                            fCreator: "createSEditor2",
                            htParams: {
                                bUseToolbar: true,
                                bUesVerticalResizer: true,
                                bUseModeChanger: false,
                                aAdditionalFontList: [["Spoqa Han Sans", "스포카"]],
                                fOnBeforeUnload: () => {}
                            },
                            fOnAppLoad: () => {
                                if (this.oEditors) {
                                    this.oEditors.getById["ir1"].setDefaultFont("Spoqa Han Sans", 12);
                                    if (this.oEditors[0]) {
                                        this.oEditors[0].registerPlugin({
                                            $ON_EVENT_EDITING_AREA_DROP: e => {
                                                console.log(1);
                                                const files = e._event.dataTransfer.files;
                                                this.addFile(files);
                                            },
                                            $ON_ATTACHPHOTO_OPEN_WINDOW: e => {
                                                console.log(2);
                                                Modal.show({
                                                    type: MODAL_TYPE.CUSTOM,
                                                    content: (
                                                        <ImageList
                                                            imageList={this.state.imageList}
                                                            upload_info={this.state.upload_info}
                                                            insertSelfReviewImage={data => {
                                                                return this.insertSelfReviewImage(data)
                                                                    .then(res => {
                                                                        this.setStateData(({ imageList }) => {
                                                                            imageList.push(res);

                                                                            return {
                                                                                imageList
                                                                            };
                                                                        });
                                                                        return res;
                                                                    });
                                                            }}
                                                            pasteImage={this.pasteImage}
                                                        />
                                                    )
                                                });
                                            },
                                            $ON_EVENT_EDITING_AREA_CLICK: e => {
                                                console.log(3);
                                                const selection = document.getElementById("ir1");
                                                console.log(selection.selectionStart, selection.selectionEnd);
                                                const element = e.element;
                                                if (element.tagName.toLowerCase() === "img") {
                                                    const a = document.createElement("a");
                                                    a.href = element.src;
                                                    if (`${a.protocol}//${a.hostname}${a.port ? `:${a.port}` : ""}` === __SERVER__.thumb) {
                                                        const src = element.src.split("/");
                                                        const size = src[5].split("x");

                                                        Modal.show({
                                                            type: MODAL_TYPE.CUSTOM,
                                                            content: (
                                                                <ImageSizeChange
                                                                    width={size[0]}
                                                                    height={size[1]}
                                                                    origin_width={size[0]}
                                                                    origin_height={size[1]}
                                                                    onConfirm={(w, h, t) => this.onSizeChangeConfirm(element, w, h, t)}
                                                                    onClose={() => Modal.close()}
                                                                />
                                                            )
                                                        });
                                                    }
                                                }
                                            },
                                            $ON_EVENT_EDITING_AREA_PASTE: e => {
                                                console.log(4);
                                                const event = e._event;
                                                event.preventDefault();
                                                const clipboard = event.clipboardData;
                                                const types = clipboard.types;
                                                const items = clipboard.items;
                                                const files = clipboard.files;

                                                if (files && files.length) {
                                                    this.addFile(files);
                                                } else if (items && items.length) {
                                                    let type = "text/plain";
                                                    if (types.indexOf("text/html") !== -1) {
                                                        type = "text/html";
                                                    }

                                                    this.pasteHTML(clipboard.getData(type));
                                                }
                                            },
                                            $ON_EVENT_EDITING_AREA_KEYUP: e => {
                                                console.log(5);
                                                this.contentUpdate();
                                            }
                                        });
                                    }
                                }
                            }
                        });

                        Modal.close(MODAL_TYPE.PROGRESS);
                    });
                }
            });

        if (!this.state.self_review_no) {
            this.fetchList();
        }

        this.state.intervalId = setInterval(() => {
            this.fetchList();
        }, 60 * 50 * 1000);
    }

    componentWillUnmount() {
        this.state.isMount = false;
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
            this.state.intervalId = null;
        }
    }

    onChangeForm(name, value) {
        this.setStateData(state => {
            return {
                form: Object.assign({}, state.form, { [name]: value })
            };
        });
    }

    onSizeChangeConfirm(e, w, h, t) {
        const a = document.createElement("a");
        a.href = e.src;
        const src = e.src.split("/");
        src[4] = t;
        src[5] = `${w}x${h}`;

        e.src = src.join("/");
        Modal.close();
    }

    onConfirm() {
        const user = auth.getUser();

        if (user) {
            const { self_review_no, form, agree } = this.state;
            this.oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);
            const regexp = new RegExp(regular.HTML_TAG, "gi");
            const content = document.getElementById("ir1").value;
            const params = Object.assign({}, form, { content, tag: utils.search.params(form.tag) });
            const tag_length = utils.search.parse(form.tag).length;
            const str = content.replace(regexp, "");
            const str2 = str.replace(/&nbsp;/gi, " ");
            let message = "";

            if (!form.thumb_img) {
                message = "썸네일을 등록해주세요.";
            } else if (!form.title.replace(/\s/gi, "")) {
                message = "제목을 입력해주세요.";
            } else if (tag_length < 3 || tag_length > 5) {
                message = "태그는 최소 3개 이상, 최대 5개 이하로 입력해주세요.";
            } else if (!str2.replace(/\s/gi, "")) {
                message = "내용을 입력해주세요.";
            } else if (str2.length < 200 || str2.length > 10000) {
                message = "내용은 최소 200자 이상, 최대 10,000자 이하로 입력해주세요.";
            } else if (!agree) {
                message = "서비스 이용약관동의가 필요합니다.";
            }

            if (message) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: message
                });
            } else if (self_review_no) {
                api.artists.updateSelfReview(user.id, self_review_no, params)
                    .then(res => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "촬영사례가 수정되었습니다",
                            onSubmit: this.onCancel
                        });
                    })
                    .catch(error => {
                        if (error && error.data) {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: error.data
                            });
                        }
                    });
            } else {
                api.artists.insertSelfReview(user.id, params)
                    .then(res => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "촬영사례가 등록되었습니다",
                            onSubmit: this.onCancel
                        });
                    })
                    .catch(error => {
                        if (error && error.data) {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: error.data
                            });
                        }
                    });
            }
        }
    }

    onCancel() {
        this.context.router.push("/artists/photograph/review");
    }

    onThumbReady(callBack) {
        const { upload_info } = this.state;

        return UploadController.addPending({
            uploadInfo: upload_info,
            ...callBack
        });
    }

    onThumbLoad(result, data) {
        if (result && result.status && data) {
            const { userId, productNo } = data;

            const params = {
                key: result.uploadKey,
                file_name: data.file.name
            };

            this.insertSelfReviewImage(params)
                .then(res => {
                    this.setStateData(state => {
                        return {
                            uploadThumb: null,
                            form: Object.assign({}, state.form, { thumb_img: res.path })
                        };
                    });
                });
        }
    }

    fetch() {
        const { self_review_no } = this.state;
        const user = auth.getUser();

        if (user && self_review_no) {
            return api.artists.fetchSelfReview(user.id, self_review_no)
                .then(res => {
                    delete res.data.session_info;
                    return res.data;
                })
                .then(data => {
                    const b = [ARTIST_SELF_REVIEW_STATUS.REQUEST.code, ARTIST_SELF_REVIEW_STATUS.COMPLETE.code].indexOf(data.request_status ? data.request_status.toUpperCase() : "");
                    if (b !== -1) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "승인중, 승인완료 상태에서는 수정이 불가능 합니다.",
                            onSubmit: () => {
                                redirect.back();
                            }
                        });
                        return null;
                    }

                    this.setStateData(state => {
                        const prop = {
                            upload_info: data.upload_info,
                            self_review_no: data.no || ""
                        };

                        if (!state.upload_info) {
                            prop.form = Object.assign({}, state.form, {
                                category: data.category || state.form.category,
                                title: data.title || "",
                                content: data.content || "",
                                thumb_img: data.thumb_img || "",
                                tag: data.tag || ""
                            });
                        }

                        return prop;
                    });

                    return data;
                })
                .catch(error => {
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }

                    this.setStateData(state => {
                        return {
                            self_review_no: ""
                        };
                    });
                });
        }

        return null;
    }

    fetchCategory() {
        return api.products.categorys()
            .then(res => {
                return res.data;
            })
            .then(data => {
                if (data && Array.isArray(data.category) && data.category.length) {
                    this.setStateData(state => {
                        return {
                            category_list: data.category.reduce((r, o) => {
                                if (BIZ_CATEGORY.indexOf(o.code) !== -1) r.push(o);
                                return r;
                            }, [])
                        };
                    });
                }
                return data;
            });
    }

    // upload_info 조회용
    fetchList() {
        const user = auth.getUser();
        if (user) {
            api.artists.fetchAllSelfReview(user.id, { offset: 0, limit: 1 })
                .then(res => {
                    return res.data;
                })
                .then(data => {
                    this.setStateData(() => ({
                        upload_info: data.upload_info
                    }));
                });
        }
    }

    addFile(files) {
        const { upload_info } = this.state;

        if (files && files.length > 0) {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });

            let isExt = false;
            const names = [];

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                    UploadController.addItem({
                        file,
                        uploadInfo: upload_info,
                        onLoad: result => {
                            const data = result.data;
                            const params = {
                                key: result.uploadKey,
                                file_name: data.file.name
                            };

                            if (!UploadController.getCount()) {
                                Modal.close(MODAL_TYPE.PROGRESS);
                            }

                            this.insertSelfReviewImage(params)
                                .then(res => {
                                    this.setStateData(({ imageList }) => {
                                        imageList.push(res);

                                        return {
                                            imageList
                                        };
                                    });
                                    this.pasteImage({ ...res, type: "resize" });
                                });
                        }
                    });
                } else {
                    names.push(file.name);
                    isExt = true;
                }
            }

            if (isExt) {
                Modal.close(MODAL_TYPE.PROGRESS);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.\n\n${names.join("\n")}`)
                });
            }
        }
    }

    pasteImage(data) {
        const { path, origin_width, origin_height, type } = data;
        if (this.oEditors[0]) {
            const img = document.createElement("img");
            const resize = utils.image.resize(origin_width, origin_height, origin_width > 740 ? 740 : origin_width, 1, true);
            img.src = `${__SERVER__.thumb}/normal/${type === "crop" ? "crop" : "resize"}/${resize.width}x${resize.height}${path}`;
            this.oEditors[0].exec("PASTE_HTML", [img.outerHTML]);
        }
    }

    pasteHTML(data) {
        if (data) {
            const regexp = new RegExp(regular.HTML_EDITOR, "gi");
            const str = data.replace(regexp, "");
            this.oEditors[0].exec("PASTE_HTML", [str]);
            return str;
        }

        return "";
    }

    uploadThumb(e) {
        const { upload_info } = this.state;
        const target = e.currentTarget;
        const files = target.files;
        const file = files.item(0);

        if (upload_info && file) {
            const ext = utils.fileExtension(file.name);

            if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                if (!this.state.isUnMount) {
                    this.setState({
                        uploadThumb: {
                            file
                        }
                    });
                }
            } else {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.\n\n${file.name}`)
                });
            }
        }
    }

    insertSelfReviewImage(data) {
        const user = auth.getUser();

        if (user) {
            return api.artists.insertSelfReviewImage(user.id, data)
                .then(response => {
                    delete response.session_info;
                    return response.data;
                })
                .then(res => {
                    return {
                        key: data.key,
                        path: res.path,
                        origin_width: res.width,
                        origin_height: res.height
                    };
                });
        }

        return null;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    contentUpdate() {
        if (this.oEditors) {
            this.oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);
            const regexp = new RegExp(regular.HTML_TAG, "gi");
            const content = document.getElementById("ir1").value;
            const str = content.replace(regexp, "");
            const str2 = str.replace(/&nbsp;/gi, " ");
            this.setStateData(state => {
                return {
                    length: str2.length
                };
            });
        }
    }

    layoutThumb() {
        const { uploadThumb, form } = this.state;
        const content = [];

        if (uploadThumb) {
            content.push(
                <UploadItem
                    key={`upload-item-${uploadThumb.file.name}`}
                    data={uploadThumb}
                    onMount={this.onThumbReady}
                    onLoad={this.onThumbLoad}
                    onAbort={() => this.setState({ uploadThumb: null })}
                />
            );
        } else if (form.thumb_img) {
            content.push(
                <Img key="thumb-item-img" image={{ src: form.thumb_img, content_width: 90, content_height: 90 }} />
            );
        } else {
            content.push(
                <Icon key="thumb-item-empty" name="opt_print" />
            );
        }

        return content;
    }

    onShowExampleArtistReview() {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: <ReviewExample onClose={() => Modal.close()} />
        });
    }

    render() {
        const { isLoad, category_list, form, length, agree } = this.state;

        if (!isLoad) {
            return null;
        }

        return (
            <div className="artists__review__page">
                <div className="page__header">
                    <h1 className="header__title">촬영사례 작성 시 참고해주세요!</h1>
                    <div className="header__description">
                        <p>사례 작성 시 5장이상의 이미지와 200자 이상의 설명이 필수로 입력되어야 합니다.</p>
                        <p>사례에 등록된 이미지 사용에 대한 책임은 작성자에게 있습니다.</p>
                        <p>작성된 사례는 광고용으로 게시될 수 있습니다.</p>
                        <p>운영방침에 어긋나는 내용의 사례는 삭제되거나 수정될 수 있습니다.</p>
                        <button
                            style={{ width: 160, height: 34, border: "1px solid #e1e1e1", backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: "500", marginTop: 20 }}
                            onClick={this.onShowExampleArtistReview}
                        >예시보기</button>
                    </div>
                </div>
                <div className="page__body">
                    <div className="review__container review__edit">
                        <div className="edit__row">
                            <div className="title">썸네일</div>
                            <div className="content">
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/bmp"
                                    ref={ref => (this.refInputThumb = ref)}
                                    onChange={this.uploadThumb}
                                    style={{ display: "none" }}
                                />
                                <div className="thumb__item" onClick={() => this.refInputThumb.click()}>
                                    {this.layoutThumb()}
                                </div>
                            </div>
                        </div>
                        <div className="edit__row">
                            <div className="title">카테고리선택</div>
                            <div className="content">
                                <DropDown
                                    data={category_list}
                                    value="code"
                                    select={form.category}
                                    textAlign="left"
                                    onSelect={value => this.onChangeForm("category", value)}
                                />
                            </div>
                        </div>
                        <div className="edit__row">
                            <div className="title">제목입력</div>
                            <div className="content">
                                <Input
                                    name="title"
                                    value={form.title}
                                    placeholder="제목을 입력해주세요."
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                        <div className="edit__row">
                            <div className="title">태그입력<span className="length">( {utils.search.parse(form.tag).length} / 5 )</span></div>
                            <div className="content">
                                <Input
                                    name="tag"
                                    value={form.tag}
                                    placeholder="태그를 (,)로 구분해 입력해 주세요."
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                        <div className="editor">
                            <textarea name="ir1" id="ir1" rows="20" style={{ width: "100%" }} value={form.content} readOnly />
                            <div className="editor__length">{utils.format.price(length)} / 10,000</div>
                        </div>
                    </div>
                    <div className="review__container review__agree">
                        <div className="agree__header">서비스 이용 준수사항</div>
                        <div className="agree__content">
                            <span>
                                등록된 사례는 포스냅 SNS에 광고용으로 게시될 수 있습니다.<br />
                                저작권으로 인한 분쟁이 발생할 경우 모든 민,형사상 책임을 게시자가 부담합니다.
                            </span>
                        </div>
                        <div className="agree__buttons">
                            <CheckBox checked={agree} onChange={b => this.setState({ agree: b })}>동의합니다.</CheckBox>
                            <span>
                                <a className="sub" id="terms_of_obedience" href="/policy/term" rel="noopener noreferrer" target="_blank">(포스냅 서비스 이용약관 전문 보기)</a>
                            </span>
                        </div>
                    </div>
                    <div className="review__buttons">
                        <button className="_button _button__white" onClick={this.onCancel}>취소</button>
                        <button className="_button _button__black" onClick={this.onConfirm}>확인</button>
                    </div>
                </div>
            </div>
        );
    }
}

ArtistReviewEditPage.contextTypes = {
    router: routerShape
};

export default ArtistReviewEditPage;
