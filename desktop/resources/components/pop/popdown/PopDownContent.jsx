import "../pop_common.scss";
import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";

class PopDownContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible ? props.visible : false,
            PropStyle: props.PropStyle || null,
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
        this.onLoad();
    }

    componentWillUnmount() {
    }

    onLoad() {
        const align = this.props.align;
        const arrowStyle = {
        };
        const contentStyle = {
            marginTop: `${this.props.posy}px`
        };

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
        let callback;

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

            if (typeof this.props.toggleBtn === "function") {
                this.props.toggleBtn(visible);
            }
        });
    }

    render() {
        const { visible, contentStyle } = this.state;
        let style = contentStyle;

        if (this.props.PropStyle) {
            style = Object.assign(style, this.props.PropStyle);
        }

        return (
            <div className="popdown-container" ref={ref => (this.container = ref)}>
                <div className="popdown-target" onClick={e => this.contentVisible(!visible)}>
                    {this.props.target}
                </div>
                <div
                    className={classNames("popdown-contents", visible ? "show" : "")}
                    style={style}
                >
                    <div className="popdown-content">
                        {this.props.children}
                    </div>
                    <span className="popdown-arrow" style={this.state.arrowStyle}>
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
    invisibleFunc: PropTypes.func
};

PopDownContent.defaultProps = {
    posy: 15,
    align: "center",
    visible: undefined
};

export default PopDownContent;
