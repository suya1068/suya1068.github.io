import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Icon from "../icon/Icon";

import "./breadcrumb.scss";

class Breadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: ""
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.isActive !== this.state.isActive) {
        //     this.setState({
        //         isActive: nextProps.isActive
        //     });
        // }
    }

    onMouseEnter(value) {
        this.setState({
            isHover: value
        });
    }

    onMouseLeave(e) {
        this.setState({
            isHover: ""
        });
    }

    isActive(value) {
        return ((value === this.props.value || value === this.state.isHover));
    }

    render() {
        const data = this.props.data;
        const isCount = this.props.isCount;

        return (
            <ul className="breadcrumb-box">
                {data.map((obj, i) => {
                    return (
                        <li key={i} className="breadcrumb-child">
                            {i !== 0 ?
                                <div className="breadcrumb-arrow">
                                    <Icon name="gt_s" />
                                </div>
                                :
                                ""
                            }
                            <div
                                className={classNames("breadcrumb-content", this.isActive(obj.value) ? "active" : "")}
                                onMouseEnter={() => this.onMouseEnter(obj.value)}
                                onMouseLeave={this.onMouseLeave}
                                onClick={typeof obj.callBack === "function" ? () => obj.callBack(obj) : undefined}
                            >
                                <div className="breadcrumb-icon">
                                    <Icon name={obj.icon} active={this.isActive(obj.value) ? "active" : ""} />
                                </div>
                                <p className={classNames("breadcrumb-text", isCount ? "badge" : "")} data-count={obj.count}>{obj.name}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

Breadcrumb.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    isCount: PropTypes.oneOf([true, false]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Breadcrumb.defaultProps = {
    data: [],
    isCount: false
};

export default Breadcrumb;
