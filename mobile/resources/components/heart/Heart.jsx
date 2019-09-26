import "./heart.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class Heart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            total: Number(props.total),
            score: Number(props.score),
            disable: props.disable,
            size: props.size
        };

        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            total: Number(nextProps.total),
            score: Number(nextProps.score),
            disable: nextProps.disable
        });
    }

    onClick(e, score) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();

        if (rect) {
            const half = rect.width / 2;
            const posX = e.pageX - rect.left;
            let sc = score;

            if (posX < half) {
                sc = score - 0.5;
            }

            this.setState({
                score: sc
            }, () => {
                if (typeof this.props.onSelect === "function") {
                    this.props.onSelect(sc);
                }
            });
        }
    }

    render() {
        const { total, score, disable, size } = this.state;
        const hearts = [];

        for (let i = 1; i < total + 1; i += 1) {
            let className = "";
            let _size = "";

            if (score >= i) {
                className = "full";
            } else if (score >= (i - 0.5)) {
                className = "half";
            }

            if (size === "tiny") {
                _size = "tiny-";
            }

            hearts.push(
                <div key={`heart-item-${i}`} className="heart__score__item" onClick={disable ? null : e => this.onClick(e, i)}>
                    <i className={classNames("m-icon", className ? `m-icon-score-${_size}heart-${className}` : `m-icon-score-${_size}heart`)} />
                </div>
            );
        }

        return (
            <div className="heart__score">
                <div className="heart__score__content">
                    {hearts}
                </div>
            </div>
        );
    }
}

Heart.propTypes = {
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disable: PropTypes.bool,
    onSelect: PropTypes.func
};

Heart.defaultProps = {
    total: 5,
    score: 5,
    disable: true,
    onSelect: undefined
};

export default Heart;
