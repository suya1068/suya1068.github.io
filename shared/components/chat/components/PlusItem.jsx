import "../scss/plus_item.scss";
import React, { Component, PropTypes, createElement } from "react";

class PlusItem extends Component {
    render() {
        const { children, onClick, onLink, target, bg_color, text } = this.props;
        const prop = {
            className: "chat__plus__item"
        };

        if (typeof onClick === "function") {
            prop.role = "button";
            prop.onClick = onClick;
        }

        if (onLink) {
            prop.role = "";
            prop.href = onLink;
            prop.target = target || "_blank";
        }

        return createElement("a", prop,
            [
                <div key="plus__item__icon" className="plus__item__icon" style={{ backgroundColor: bg_color }}>
                    {children}
                </div>,
                <div key="plus__item__text" className="plus__item__text">
                    {text}
                </div>
            ]);
    }
}

PlusItem.propTypes = {
    children: PropTypes.node,
    bg_color: PropTypes.string.isRequired,
    text: PropTypes.string,
    onClick: PropTypes.func
};

PlusItem.defaultProps = {
    onClick: null
};

export default PlusItem;
