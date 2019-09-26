import "./PopDownContent.scss";
import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";

class PopDownContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible ? props.visible : false,
            arrowStyle: {
                left: "50%",
                transform: "translateX(-50%)"
            },
            contentStyle: {
                left: "50%",
                transform: "translateX(-50%)"
            }
        };

        this.onLoad = this.onLoad.bind(this);
        this.onClickCheck = this.onClickCheck.bind(this);
        this.contentVisible = this.contentVisible.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(this.onLoad, 10);
    }

    componentWillReceiveProps(nextProp, nextState) {
    }

    componentWillUnmount() {
    }

    onLoad() {
        const { align, reverse, posy } = this.props;
        const arrowStyle = {};
        const contentStyle = {};

        const current = this.container;
        if (current) {
            const target = current.querySelector(".popdown-target");
            const arrow = current.querySelector(".popdown-arrow");
            const half = target.offsetWidth / 2;
            const margin = 16;
            let arrowX = half;
            let contentX = 0;

            switch (align) {
                case "left":
                case "right":
                    if (arrowX < margin) {
                        const x = arrowX - margin;
                        arrowX -= x;
                        contentX = x;
                    }

                    if (align === "left") {
                        arrowStyle.right = `${arrowX}px`;
                        arrowStyle.transform = "translateX(50%)";
                        contentStyle.right = `${contentX}px`;
                    } else {
                        arrowStyle.left = `${arrowX}px`;
                        arrowStyle.transform = "translateX(-50%)";
                        contentStyle.left = `${contentX}px`;
                    }
                    break;
                default:
                    arrowStyle.left = "50%";
                    arrowStyle.transform = "translateX(-50%)";
                    contentStyle.left = "50%";
                    contentStyle.transform = "translateX(-50%)";
                    break;
            }

            if (reverse) {
                contentStyle.marginBottom = `${posy}px`;
                arrowStyle.transform += "rotate(180deg)";
            } else {
                contentStyle.marginTop = `${posy}px`;
            }

            this.state.arrowStyle = arrowStyle;
            this.state.contentStyle = contentStyle;
        }
    }

    onClickCheck(e) {
        if (e && e.path) {
            const index = e.path.findIndex(el => {
                return el.className === "popdown-contents show";
            });

            if (index === -1) {
                this.contentVisible(false);
            }
        } else {
            this.contentVisible(false);
        }
    }

    contentVisible(b) {
        let visible = this.state.visible;
        let callback = null;

        if (b !== visible) {
            visible = b;
        }

        this.setState({ visible }, () => {
            if (b) {
                setTimeout(() => {
                    window.addEventListener("click", this.onClickCheck);
                }, 0);
                callback = this.props.visibleFunc;
            } else {
                setTimeout(() => {
                    window.removeEventListener("click", this.onClickCheck);
                }, 0);
                callback = this.props.invisibleFunc;
            }

            if (typeof callback === "function") {
                callback();
            }

            if (typeof this.props.onToggle === "function") {
                this.props.onToggle(b);
            }
        });
    }

    render() {
        const { reverse, arrowStyle, contentStyle } = this.props;
        const { visible } = this.state;
        const _contentStyle = contentStyle ? Object.assign(this.state.contentStyle, contentStyle) : this.state.contentStyle;
        const _arrowStyle = arrowStyle ? Object.assign(this.state.arrowStyle, arrowStyle) : this.state.arrowStyle;

        return (
            <div className={classNames("popdown-container", { reverse })} ref={ref => (this.container = ref)}>
                <div className="popdown-target" onClick={() => this.contentVisible(!visible)}>
                    {this.props.target}
                </div>
                <div
                    className={classNames("popdown-contents", visible ? "show" : "")}
                    style={_contentStyle}
                >
                    <div className="popdown-content">
                        {this.props.children}
                    </div>
                    <span
                        className="popdown-arrow"
                        style={_arrowStyle}
                    >
                        <span className="popdown-arrow" />
                    </span>
                </div>
            </div>
        );
    }
}

PopDownContent.propTypes = {
    target: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    align: PropTypes.oneOf(["left", "right", "center"]),
    posy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    visible: PropTypes.bool,
    visibleFunc: PropTypes.func,
    invisibleFunc: PropTypes.func,
    reverse: PropTypes.bool
};

PopDownContent.defaultProps = {
    posy: 15,
    align: "center",
    visible: undefined,
    reverse: false
};

export default PopDownContent;
