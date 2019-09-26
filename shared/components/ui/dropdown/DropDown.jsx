import "./DropDown.scss";
import React, { Component, PropTypes, createElement } from "react";
import { findDOMNode } from "react-dom";
import classNames from "classnames";

// import Icon from "desktop/resources/components/icon/Icon";

class DropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            select: null,
            isShow: false
        };

        this.onSelect = this.onSelect.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onClickWindow = this.onClickWindow.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.selectDefault = this.selectDefault.bind(this);
    }

    componentWillMount() {
        const { data, select, value } = this.props;
        this.state.select = this.selectDefault(data, select, value);
        window.addEventListener("click", this.onClickWindow);
        window.addEventListener("touchstart", this.onClickWindow);
    }

    componentWillReceiveProps(nextProps) {
        const { data, select, value } = nextProps;
        this.setStateData(() => {
            return {
                select: this.selectDefault(data, select, value)
            };
        });
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("click", this.onClickWindow);
        window.removeEventListener("touchstart", this.onClickWindow);
    }

    onToggle() {
        if (this.props.disabled) {
            this.setStateData(({ isShow }) => {
                return { isShow: false };
            });
        } else {
            this.setStateData(({ isShow }) => {
                return { isShow: !isShow };
            });
        }
    }

    onShow() {
        if (!this.props.disabled) {
            this.setStateData(() => {
                return { isShow: true };
            });
        }
    }

    onHide() {
        this.setStateData(() => {
            return { isShow: false };
        });
    }

    onSelect(value) {
        this.setStateData(() => {
            return { select: value };
        }, () => {
            this.props.onSelect(value);
            this.onHide();
        });
    }

    onClickWindow(e) {
        if (this.state.isShow) {
            const node = findDOMNode(this);
            if (e.target !== node && !node.contains(e.target)) {
                this.onHide();
            }
        }
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    selectDefault(data, select, value) {
        if (Array.isArray(data) && data.length > 1) {
            if ((select === this.state.select || select !== this.state.select) && data.find(d => d[value] === select)) {
                return select;
            }

            return data[0][value];
        }

        return null;
    }

    renderValue() {
        const { data, name, value, disabled, renderValue, error_msg, textAlign, border } = this.props;
        const { select } = this.state;
        const prop = {
            key: "dropdown__select",
            className: classNames("dropdown__select", { disabled }, border ? `border-${border}` : ""),
            onClick: this.onToggle
        };

        if (Array.isArray(data) && data.length > 1 && select !== null && select !== undefined) {
            const obj = data.find(d => d[value] === select);

            if (obj) {
                if (typeof renderValue === "function") {
                    return createElement("div", prop, renderValue(obj));
                }
                //<Icon key="select_icon" name="dt_m" active="active" />
                return createElement(
                    "div",
                    prop,
                    [
                        <span style={{ textAlign, color: error_msg ? "#d0021b" : "" }} key="select_name">{error_msg || obj[name]}</span>,
                        <i className="m-icon m-icon__dt-black_s" key="select_icon" />
                    ]
                );
            }
        }

        return createElement("div", prop, <span />);
    }

    renderOption() {
        const { data, name, value, renderOption, textAlign } = this.props;
        const { select } = this.state;

        if (Array.isArray(data)) {
            return (
                <div key="dropdown__list" className="dropdown__list">
                    {data.map(d => {
                        const n = d[name];
                        const v = d[value];
                        let content = null;
                        if (typeof renderOption === "function") {
                            content = renderOption(d);
                        } else {
                            content = <div>{n}</div>;
                        }

                        return (
                            <button
                                key={`dropdown_${v}`}
                                className={classNames("dropdown__item", { active: select === v })}
                                style={{ textAlign }}
                                onClick={() => this.onSelect(v)}
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            );
        }

        return (
            <div key="dropdown__list" className="dropdown__list" />
        );
    }

    render() {
        const { isShow } = this.state;

        return (
            <div className={classNames("dropdown__container", { show: isShow })}>
                {this.renderValue()}
                {this.renderOption()}
            </div>
        );
    }
}

DropDown.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    select: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    renderValue: PropTypes.func,
    renderOption: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    error_msg: PropTypes.string
};

DropDown.defaultProps = {
    name: "name",
    value: "value",
    disabled: false,
    textAlign: "center",
    error_msg: ""
};

export default DropDown;
