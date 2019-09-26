import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class ModalContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillUnmount() {
        const { onClose } = this.props;
        if (typeof onClose === "function") {
            onClose();
        }
    }

    render() {
        const { name, content, close, bg, overflow, full, width, height, align, onModalClose, opacity } = this.props;

        return (
            <div className={classNames("_modal__container", { _modal__full: full })}>
                <div className={classNames("_modal__bg", { show: bg })} style={{ opacity }} />
                <div className={classNames("_modal__wrap", { overflow })}>
                    <div className="_modal__table">
                        <div className="_modal__cell">
                            <div className="_modal__view" style={{ width, height }}>
                                {close ?
                                    <div className="_modal__view__close">
                                        <button className="_button _button__close white" onClick={onModalClose} />
                                    </div>
                                    : null
                                }
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ModalContainer.propTypes = {
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.node,
    bg: PropTypes.bool.isRequired,
    overflow: PropTypes.bool,
    full: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    align: PropTypes.string,
    close: PropTypes.bool,
    onModalClose: PropTypes.func.isRequired
};

ModalContainer.defaultProps = {
    name: Date.now(),
    content: null,
    bg: true,
    overflow: true,
    full: false,
    width: null,
    height: null,
    align: null
};

export default ModalContainer;
