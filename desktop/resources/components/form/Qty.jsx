import "./scss/qty.scss";
import React, { Component, PropTypes } from "react";

class Qty extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onChange = this.onChange.bind(this);

        this.changeCount = this.changeCount.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.state.count = nextProps.count;
    }

    onChange(e) {
        const { resultFunc } = this.props;
        const target = e.target;
        let value = target.value;

        const maxLength = target.maxLength;
        value = value.replace(/[,\D]+/g, "");
        value = value && !isNaN(value) ? parseInt(value, 10) : "";

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        this.setState({
            count: value
        }, () => {
            if (typeof resultFunc === "function") {
                resultFunc(value);
            }
        });
    }

    // 카운터 증감 처리
    changeCount(isPlus) {
        const { min, max, resultFunc } = this.props;
        let count = this.state.count || min;

        if (isPlus && (isNaN(max) || (!isNaN(max) && count < max))) {
            count += 1;
        }

        if (!isPlus && (isNaN(min) || (!isNaN(min) && count > min))) {
            count -= 1;
        }

        this.setState({
            count
        });

        if (typeof resultFunc === "function") {
            resultFunc(count);
        }
    }

    render() {
        const { count } = this.props;

        return (
            <div className="qty-box" >
                <button className="qty__minus" onClick={() => this.changeCount(false)} />
                <input type="text" value={count} onChange={this.onChange} />
                <button className="qty__plus" onClick={() => this.changeCount(true)} />
            </div>
        );
    }
}

Qty.propTypes = {
    count: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    resultFunc: PropTypes.func.isRequired
};

Qty.defaultProps = {
    count: 1,
    max: 0,
    min: 1,
    resultFunc: undefined
};

export default Qty;
