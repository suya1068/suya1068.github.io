import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class Heart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hearts: {
                heart1: "",
                heart2: "",
                heart3: "",
                heart4: "",
                heart5: ""
            }
        };

        this.checkHeart = this.checkHeart.bind(this);
    }

    // 하트 숫자에 따라 각 초기값 설정
    componentWillMount() {
        this.calculHeart(this.props.count);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.count !== this.props.count) {
            this.calculHeart(nextProps.count);
        }
    }

    // 하트표시 계산처리
    calculHeart(count) {
        Object.keys(this.state.hearts).map((key, i) => {
            const index = i + 1;

            if (count >= index) {
                this.state.hearts[key] = "heart-full";
            } else if (count >= (index - 0.5)) {
                this.state.hearts[key] = "heart-half";
            } else {
                this.state.hearts[key] = "";
            }

            return null;
        });

        this.setState({
            hearts: this.state.hearts
        }, () => {
            if (typeof this.props.resultFunc === "function") {
                this.props.resultFunc(count);
            }
        });
    }

    // 하트를 눌렀을때 어디를 클릭했는지 처리
    checkHeart(e) {
        const evt = e;
        const currentTarget = e.currentTarget;
        const offsetX = e.nativeEvent.offsetX;
        const halfWidth = currentTarget.offsetWidth / 2;
        const buttons = currentTarget.parentNode.querySelectorAll("button");
        const nodeList = Array.prototype.slice.call(buttons);
        const index = nodeList.indexOf(currentTarget) + 1;

        if (offsetX > halfWidth) {
            this.calculHeart(index);
        } else {
            this.calculHeart(index - 0.5);
        }
    }

    render() {
        return (
            <div className={classNames("heart-box", (this.props.size === "small" ? "heart-small" : ""))}>
                {Object.keys(this.state.hearts).map((key, i) => {
                    return (
                        <button key={i} className={this.state.hearts[key]} onClick={this.props.disabled === "disabled" ? "" : this.checkHeart} ><icon className={this.props.size === "small" ? "icon-heart_s" : "icon-heart"} /></button>
                    );
                })}
                { this.props.visibleContent && <span className="heart-count">{this.props.count}</span> }
            </div>
        );
    }
}

Heart.propTypes = {
    count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.oneOf(["disabled", ""]),
    size: PropTypes.oneOf(["small", ""]),
    visibleContent: PropTypes.bool,
    resultFunc: PropTypes.func
};

Heart.defaultProps = {
    count: 0,
    disabled: "",
    size: "",
    visibleContent: true,
    resultFunc: undefined
};

export default Heart;
