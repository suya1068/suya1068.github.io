import "./Accordion.scss";
import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import classNames from "classnames";

class Accordion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            selected: props.selected,
            overflow: false,
            height: 0
        };

        this.onToggle = this.onToggle.bind(this);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.getContentHeight = this.getContentHeight.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        if (this.state.selected) {
            this.show();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selected !== this.props.selected) {
            if (nextProps.selected) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    componentDidUpdate() {
        const { height } = this.state;
        const h = this.getContentHeight();
        if (this.state.selected && (height < h || height !== h)) {
            this.setStateData(() => {
                return {
                    height: h,
                    overflow: false
                };
            }, () => {
                setTimeout(() => {
                    this.setStateData(({ selected }) => {
                        return {
                            overflow: selected
                        };
                    });
                }, 400);
            });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onToggle() {
        const { selected } = this.state;
        if (selected) {
            this.hide();
        } else {
            this.show();
        }

        if (typeof this.props.onSelect === "function") {
            this.props.onSelect(!selected);
        }

        return !selected;
    }

    show() {
        this.setStateData(() => {
            return {
                selected: true,
                height: this.getContentHeight()
            };
        }, () => {
            setTimeout(() => {
                this.setStateData(({ selected }) => {
                    return {
                        overflow: selected
                    };
                });
            }, 400);
        });
    }

    hide() {
        this.setStateData(() => {
            return {
                selected: false,
                height: 0
            };
        }, () => {
            this.setStateData(({ selected }) => {
                return {
                    overflow: selected
                };
            });
        });
    }

    isSelected() {
        return this.state.selected;
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    getContentHeight() {
        if (this.refContent && this.refContent.children[0]) {
            return this.refContent.children[0].offsetHeight;
        }

        return 0;
    }

    render() {
        const { selected, height, overflow } = this.state;

        return (
            <div className={classNames("accordion__container", { show: selected })}>
                <div className="accordion__title" onClick={this.onToggle}>
                    {this.props.children[0]}
                </div>
                <div
                    className="accordion__content"
                    ref={ref => (this.refContent = ref)}
                    style={{ height, overflow: overflow ? "visible" : null }}
                >
                    {this.props.children[1]}
                </div>
            </div>
        );
    }
}

Accordion.propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    onSelect: PropTypes.func
};

Accordion.defaultProps = {
    selected: false
};

export default Accordion;
