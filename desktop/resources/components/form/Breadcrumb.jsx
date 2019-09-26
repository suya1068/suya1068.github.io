import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Icon from "../icon/Icon";

const breadcrumbData = [
    { icon: "people_list", title: "상품정보입력", count: 0 },
    { icon: "people_list", title: "상품정보입력" },
    { icon: "people_list", title: "상품정보입력", count: 0 },
    { icon: "people_list", title: "상품정보입력" },
    { icon: "people_list", title: "상품정보입력", count: 0 },
    { icon: "people_list", title: "상품정보입력" }
];


class Breadcrumb extends Component {
    constructor() {
        super();
        this.state = {
            breadcrumb: breadcrumbData
        };
    }

    createBreadcrumb() {
        return (
            this.state.breadcrumb.map((breadcrumb, i) => {
                return (
                    <li key={i} className="breadcrumb-child">
                        <div className="breadcrumb-arrow">
                            <Icon name="gt_s" />
                        </div>
                        <div className="breadcrumb-content">
                            <div className="breadcrumb-icon">
                                <Icon name="people_list" />
                            </div>
                            <span className="breadcrumb-text">상품정보입력</span>
                        </div>
                    </li>
                );
            })
        );
    }

    render() {
        return (
            <ul className="breadcrumb-box">
                {this.createBreadcrumb()}
            </ul>
        );
    }
}

Breadcrumb.propTypes = {

};

Breadcrumb.defaultProps = {

};

export default Breadcrumb;
