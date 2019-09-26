import "./breadCrumbM.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class BreadCrumbM extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isActive !== this.state.isActive) {
            this.setState({
                isActive: nextProps.isActive
            });
        }
    }

    isActive(obj) {
        const type = this.state.type;
        let flag = "";
        if (type === "normal") {
            flag = (obj.value === this.props.value);
        } else if (type === "mypage") {
            flag = (obj.count > 0);
        }

        return flag;
    }
    // isActive(value) {
    //     return value === this.props.value;
    // }

    render() {
        const data = this.props.data;

        return (
            <div className="breadCrumb-component">
                <div className="title-outer">
                    <span className="title">진행상황</span>
                    <div className="title-inner">
                        <a href="">
                            <p>전체보기 &gt;</p>
                        </a>
                    </div>
                </div>
                <div className="state">
                    <ul className="state-inner">
                        {
                            data.map((obj, idx) => {
                                return (
                                    <li
                                        key={`breadcrumb_${obj.value}`}
                                        className="state-inner-unit"
                                        //onClick={typeof obj.callBack === "function" ? () => obj.callBack(obj) : undefined}
                                    >
                                        {idx !== 0 ?
                                            <div className="arrow">
                                                <i className="m-icon m-icon-gray-gt_b" />
                                            </div>
                                            : null
                                        }
                                        <div className={classNames("state-info", this.isActive(obj) ? "active" : "")}>
                                            <p className={classNames("count", this.isActive(obj) ? "active" : "")}>{obj.count}</p>
                                            <p className="progress">{obj.name}</p>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

BreadCrumbM.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    type: PropTypes.string
    // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

BreadCrumbM.defaultProps = {
    data: [],
    type: "normal",
    isCount: false
};

export default BreadCrumbM;
