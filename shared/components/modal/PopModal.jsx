import "./popmodal.scss";

import React, { Component, PropTypes, createElement } from "react";
import ReactDOM from "react-dom";
import update from "immutability-helper";
import classNames from "classnames";

import utils from "shared/helper/utils";
import constant from "shared/constant";

const modalType = {
    MODAL_SINGLE: "SINGLE",
    MODAL_MULTIPLE: "MULTIPLE"
};

/**
 * 모달 컨트롤러
 */
class PopModal extends Component {
    constructor() {
        super();
        this.state = this.initState();

        this.createModal = this.createModal.bind(this);
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.alert = this.alert.bind(this);
        this.confirm = this.confirm.bind(this);
        this.toast = this.toast.bind(this);
        this.clickOkCancel = this.clickOkCancel.bind(this);
        this.progress = this.progress.bind(this);
        this.progressCount = this.progressCount.bind(this);
        this.onPopstate = this.onPopstate.bind(this);
        // this.onMouseMove = this.onMouseMove.bind(this);
    }

    componentWillMount() {
        // window.addEventListener("mousemove", this.onMouseMove, false);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
        const active = document.activeElement;
        if (active && typeof active.blur === "function") {
            active.blur();
        }
    }

    componentWillUnmount() {
        // window.removeEventListener("mousemove", this.onMouseMove, false);
    }

    // onMouseMove(e) {
    //     if (e && e instanceof MouseEvent && e.clientX && e.clientY) {
    //         this.state.posX = e.clientX;
    //         this.state.posY = e.clientY;
    //     }
    // }

    onPopstate() {
        this.setState(this.initState());
    }

    /**
     * 모달 데이터 초기화
     * @returns {{modals: {}, layers: Array, modalLayer: Array, isModalShow: boolean}}
     */
    initState() {
        return {
            modals: {},
            layers: [],
            modalLayer: [],
            isModalShow: false,
            isFullCategory: false,
            posX: 0,
            posY: 0
        };
    }

    /**
     * 유저 커스텀 모달 만들기
     * @param name
     * @param content
     * @param options
     */
    createModal(name, content, options = {}) {
        const modals = this.state.modals;
        let btnClose = null;

        if (options.className === undefined) {
            options.className = "modal-default";
        }

        if (options.modal_close !== false) {
            btnClose = (
                <button key={`modal-close-${name}`} className="modal-close" onClick={() => this.close(name)} />
            );
        }

        const modal = (
            <div className={classNames("modal-layer", options.full_category ? "full_category" : "")} key={name}>
                <div className="modal-bg" />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className={classNames("modal-contents", options.className)}>
                            <div className="modal-content">
                                {btnClose}
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        modals[name] = { content: modal, callBack: options.callBack };

        this.state.modals = modals;
    }

    /**
     * 마우스 위치에 팝업 생성
     * @param content - ReactElement
     */
    pop(content, posX = 0, posY = 0) {
        const modalLayer = this.state.modalLayer;
        const key = `modal_context_${utils.uniqId()}`;

        const modal = (
            <div className="modal-layer" key={key} id={key}>
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div
                            className={classNames("modal-contents", "modal-position")}
                            onClick={e => { if (e.target === e.currentTarget) { this.close(key); } }}
                            onMouseDown={e => { if (e.target === e.currentTarget) { this.close(key); } }}
                        >
                            <div className="modal-content" style={{ left: posX, top: posY }}>
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        modalLayer.push({ name: key, content: modal });

        this.setState({
            modalLayer,
            isModalShow: true
        }, () => {
            const pop = document.getElementById(key);
            const mc = pop.querySelector(".modal-content");
            const cw = window.innerWidth;
            const ch = window.innerHeight;

            if ((mc.offsetWidth + posX) > cw) {
                mc.style.left = `${cw - mc.offsetWidth}px`;
            }

            if ((mc.offsetHeight + posY) > ch) {
                mc.style.top = `${posY - mc.offsetHeight}px`;
            }
        });

        return key;
    }

    /**
     * 알림창
     * @param text
     * @param options - Object
     */
    alert(text, options = { key: undefined, callBack: undefined }) {
        const modalLayer = this.state.modalLayer;
        const key = options.key || `modal_alert_${utils.uniqId()}`;

        const content = (
            <div className="modal-layer" key={key}>
                <div className="modal-bg" />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className="modal-contents modal-default">
                            <div className="modal-content">
                                <div className="modal-text">
                                    {utils.linebreak(text)}
                                </div>
                                <div className="modal-button-group">
                                    <button className="modal-btn" onClick={() => this.clickOkCancel(key, true, options.callBack)}>확인</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const index = modalLayer.findIndex(obj => {
            return obj.name === key;
        });

        if (index === -1) {
            modalLayer.push({ name: key, content });

            this.setState({
                modalLayer,
                isModalShow: true
            });
        }
    }

    /**
     * 확인, 취소창
     * @param text - String or RectElement
     * @param okCallback - Function
     * @param cancelCallback - Function
     * @param textAlign - String (left, right, center, justify)
     * @param options - Object (
     */
    confirm(text, okCallback = undefined, cancelCallback = undefined, textAlign = "center", options = { key: "", titleOk: "확인", titleCancel: "취소" }) {
        const modalLayer = this.state.modalLayer;
        const key = options.key || `modal_confirm_${utils.uniqId()}`;

        const content = (
            <div className="modal-layer" key={key}>
                <div className="modal-bg" />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className="modal-contents modal-default">
                            <div className="modal-content">
                                <div className={classNames("modal-text", `text-${textAlign.toLowerCase()}`)}>
                                    {typeof text === "object" ?
                                        text
                                        : utils.linebreak(text)}
                                </div>
                                <div className="modal-button-group">
                                    <button className="modal-btn" onClick={() => this.clickOkCancel(key, true, okCallback, cancelCallback)}>
                                        {options.titleOk ? options.titleOk : "확인"}
                                    </button>
                                    <button className="modal-btn" onClick={() => this.clickOkCancel(key, false, okCallback, cancelCallback)}>
                                        {options.titleCancel ? options.titleCancel : "취소"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        modalLayer.push({ name: key, content });

        this.setState({
            modalLayer,
            isModalShow: true
        });
    }

    /**
     * 토스트 알림
     * @param text
     * @param callBack
     * @param time
     */
    toast(text, callBack = undefined, time = 1500) {
        const modalLayer = this.state.modalLayer;
        const key = `modal_toast_${utils.uniqId()}`;

        const content = (
            <div className="modal-layer" key={key}>
                <div className="modal-bg" />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className="modal-contents modal-default">
                            <div className="modal-content">
                                <div className="modal-text">
                                    {utils.linebreak(text)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        modalLayer.push({ name: key, content });

        this.setState({
            modalLayer,
            isModalShow: true
        }, () => {
            setTimeout(() => {
                this.close(key);

                if (typeof callBack === "function") {
                    callBack();
                }
            }, time);
        });
    }

    /**
     * 프로그래스
     * @param text
     */
    progress(option = { isBg: true, text: undefined }) {
        const modalLayer = this.state.modalLayer;
        const key = "modal_progress";
        const text = option.text;

        const content = (
            <div className="modal-layer" key={key}>
                <div className={classNames("modal-bg", option.isBg ? "" : "bg-none")} />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className="modal-contents">
                            <div className="modal-content">
                                <div className="modal-progress loading-progress">
                                    <img alt="loading-progress" className="loading-progress" src={__SERVER__.img + constant.PROGRESS.COLOR_CAT} />
                                </div>
                            </div>
                        </div>
                        { text && <div>{text}</div> }
                    </div>
                </div>
            </div>
        );

        const updateProps = {};

        const index = modalLayer.findIndex(obj => {
            return obj.name === key;
        });

        if (index !== -1) {
            updateProps[index] = { content };
        } else {
            updateProps.$push = [{ name: key, content }];
        }

        this.setState({
            modalLayer: update(this.state.modalLayer, updateProps),
            isModalShow: true
        });
    }

    /**
     * 프로그래스 닫기
     */
    closeProgress() {
        this.close("modal_progress");
    }

    /**
     * 진행바 프로그래스
     * @param count
     * @param max
     */
    progressCount(count, max) {
        const modalLayer = this.state.modalLayer;
        const key = "modal_progress_count";

        const divide = max / 100;
        const per = (count / divide).toFixed(3);

        const content = (
            <div className="modal-layer" key={key}>
                <div className="modal-bg" />
                <div className="modal-wrap">
                    <div className="modal-box">
                        <div className="modal-contents">
                            <div className="modal-progress-count">
                                <div className="progress-bar" style={{ width: `${per}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const updateProps = {};

        const index = modalLayer.findIndex(obj => {
            return obj.name === key;
        });

        if (index !== -1) {
            updateProps[index] = { content: { $set: content } };
        } else {
            updateProps.$push = [{ name: key, content }];
        }

        this.setState({
            modalLayer: update(this.state.modalLayer, updateProps),
            isModalShow: true
        });
    }

    /**
     * 진행바 프로그래스 닫기
     */
    closeProgressCount() {
        this.close("modal_progress_count");
    }

    /**
     * 커스텀 모달 띄우기
     * @param name
     * @param type
     */
    show(name = "", type = modalType.MODAL_MULTIPLE, full_category = false) {
        const modals = this.state.modals;
        let modalLayer = this.state.modalLayer;
        const isModalShow = this.state.isModalShow;
        let alreadyShow = false;
        const props = {};

        window.addEventListener("popstate", () => this.onPopstate(), false);

        for (let i = 0; i < modalLayer.length; i += 1) {
            if (modalLayer[i].name === name) {
                alreadyShow = true;
                break;
            }
        }

        if (Object.keys(modals).indexOf(name) !== -1 && !alreadyShow) {
            if (type === modalType.MODAL_SINGLE && modalLayer.length > 0) {
                const layers = this.state.layers;
                layers.push(modalLayer);
                props.layers = layers;
                modalLayer = [];
            }

            const modalContent = modals[name];

            modalLayer.push({ name, content: modalContent.content, callBack: modalContent.callBack });
            props.modalLayer = modalLayer;

            if (!isModalShow) {
                props.isModalShow = true;

                if (full_category) {
                    props.isFullCategory = true;
                }
            }

            this.setState(props);
        }
    }

    /**
     * 모달 닫기
     * @param name - String (모달명, 없을시 최상위 모달 닫음)
     */
    close(name = "", closeCallBack = undefined) {
        const layers = this.state.layers;
        let modalLayer = this.state.modalLayer;
        const isModalShow = this.state.isModalShow;
        const length = modalLayer.length;
        const props = {};
        let callBack = null;

        if (isModalShow) {
            if (length > 0) {
                if (name === "") {
                    callBack = modalLayer[length - 1].callBack;
                    modalLayer.splice(length - 1, 1);
                } else {
                    let index = -1;
                    for (let i = 0; i < modalLayer.length; i += 1) {
                        if (name === modalLayer[i].name) {
                            index = i;
                            break;
                        }
                    }

                    if (index !== -1) {
                        callBack = modalLayer[index].callBack;
                        modalLayer.splice(index, 1);
                    }
                }
            }

            if (modalLayer.length < 1 && layers.length < 1) {
                props.isModalShow = false;
                props.isFullCategory = false;
                window.removeEventListener("popstate", () => this.onPopstate(), false);
            } else if (modalLayer.length < 1) {
                modalLayer = layers[layers.length - 1];
                layers.splice(layers.length - 1, 1);
            }

            props.layers = layers;
            props.modalLayer = modalLayer;

            this.setState(props, () => {
                if (typeof callBack === "function") {
                    callBack();
                }

                if (typeof closeCallBack === "function") {
                    closeCallBack();
                }
            });
        }
    }

    /**
     * 확인, 취소버튼 클릭시 함수호출
     * @param name
     * @param isOk
     * @param okCallback
     * @param cancelCallback
     */
    clickOkCancel(name, isOk, okCallback = undefined, cancelCallback = undefined) {
        let callBack = null;
        if (isOk && typeof okCallback === "function") {
            callBack = okCallback;
        } else if (!isOk && typeof cancelCallback === "function") {
            callBack = cancelCallback;
        }

        this.close(name, callBack);
    }

    /**
     * 모달 그리기
     * @returns {*}
     */
    modalLayers() {
        const modalLayer = this.state.modalLayer;

        if (modalLayer.length > 0) {
            return modalLayer.map(obj => { return obj.content; });
        }

        return null;
    }

    render() {
        // const isModalShow = this.state.isModalShow;
        const { isFullCategory, isModalShow } = this.state;

        if (isModalShow) {
            document.getElementsByTagName("html")[0].style.overflow = "hidden";
        } else {
            document.getElementsByTagName("html")[0].style.overflow = "auto";
        }

        const content = (
            <div className={classNames("modal-container", isModalShow ? "show" : "", isFullCategory ? "full_category" : "")}>
                {this.modalLayers()}
            </div>
        );

        return content;
    }
}

export default ReactDOM.render(
    <PopModal />,
    document.getElementById("modal")
);
