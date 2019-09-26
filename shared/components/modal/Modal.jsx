import "./Modal.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import ModalContainer from "./components/ModalContainer";
import ModalAlert from "./components/ModalAlert";
import ModalConfirm from "./components/ModalConfirm";
import ModalProgress from "./components/ModalProgress";
import ModalProgressBar from "./components/ModalProgressBar";

export const MODAL_TYPE = {
    ALERT: "ALERT",
    CONFIRM: "CONFIRM",
    CUSTOM: "CUSTOM",
    PROGRESS: "PROGRESS",
    PROGRESS_BAR: "PROGRESS_BAR"
};

export const MODAL_ALIGN = {
    TOP_LEFT: "top left",
    TOP_CENTER: "top center",
    TOP_RIGHT: "top right",
    MIDDLE_LEFT: "middle left",
    MIDDLE_RIGHT: "middle right",
    BOTTOM_LEFT: "bottom left",
    BOTTOM_CENTER: "bottom center",
    BOTTOM_RIGHT: "bottom right"
};

class Modal extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true,
            modal: []
        };

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    /**
     * 모달 열기
     * @param data {type, name, content, close, bg, overflow, full, width, height, align, onSubmit, onCancel, onClose}
     */
    show(data, onLoad) {
        const { type, name, content, close, txt_submit, txt_cancel, onSubmit, onCancel, onClose, count, total } = data;
        this.setStateData(({ modal }) => {
            let modalName = name || Date.now();
            let modalContent = "";
            const cl = () => this.close(modalName);

            switch (type) {
                case MODAL_TYPE.ALERT:
                    modalContent = <ModalAlert content={content} onModalClose={cl} onSubmit={onSubmit} />;
                    break;
                case MODAL_TYPE.CONFIRM:
                    modalContent = <ModalConfirm content={content} onModalClose={cl} onSubmit={onSubmit} onCancel={onCancel} />;
                    break;
                case MODAL_TYPE.CUSTOM:
                    modalContent = content;
                    break;
                case MODAL_TYPE.PROGRESS:
                    modalName = MODAL_TYPE.PROGRESS;
                    modalContent = <ModalProgress />;
                    break;
                case MODAL_TYPE.PROGRESS_BAR:
                    modalName = MODAL_TYPE.PROGRESS_BAR;
                    modalContent = <ModalProgressBar count={count} total={total} />;
                    break;
                default:
                    break;
            }

            const item = modal.find(o => (o.name === modalName));

            if (item) {
                item.render = (
                    <ModalContainer
                        key={modalName}
                        {...data}
                        name={modalName}
                        content={modalContent}
                        onModalClose={cl}
                    />
                );
            } else {
                modal.push({
                    name: modalName,
                    render: <ModalContainer
                        key={modalName}
                        {...data}
                        name={modalName}
                        content={modalContent}
                        onModalClose={cl}
                    />
                });
            }

            return {
                modal
            };
        }, onLoad);
    }

    close(name, callback) {
        this.setStateData(({ modal }) => {
            const rs = modal.reduce((r, o, i) => {
                if (name && name !== o.name) {
                    r.push(o);
                } else if (!name && i < (modal.length - 1)) {
                    r.push(o);
                }

                return r;
            }, []);

            if (typeof callback === "function") {
                callback();
            }

            return {
                modal: rs
            };
        });
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { modal } = this.state;
        const isShow = modal && Array.isArray(modal) && modal.length;

        if (isShow) {
            document.querySelector("html").style.overflow = "hidden";
        } else {
            document.querySelector("html").style.overflow = "auto";
        }

        return (
            <div className={classNames("_modal", { show: isShow })}>
                {modal && Array.isArray(modal) ?
                    modal.map(obj => {
                        return obj.render;
                    }) : null
                }
            </div>
        );
    }
}

export default ReactDOM.render(
    <Modal />,
    document.getElementById("_modal")
);
