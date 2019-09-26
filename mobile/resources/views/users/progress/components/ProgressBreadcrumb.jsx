import "../scss/ProgressBreadcrumb.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";

class ProgressBreadcrumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true
        };

        this.onClick = this.onClick.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onClick(status) {
        const { onClick } = this.props;
        if (typeof onClick === "function") {
            onClick(status);
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { status, breadcrumb, zero } = this.props;

        return (
            <div className="progress__breadcrumb">
                <div className="breadcrumb__list">
                    {Object.keys(COMBINE_PROCESS_BREADCRUMB).map((key, i) => {
                        const obj = COMBINE_PROCESS_BREADCRUMB[key];

                        const total = obj.status.reduce((r, o) => {
                            return r + Number(breadcrumb ? breadcrumb[o] || 0 : 0); //
                        }, 0);

                        const active = key === status && !zero;

                        return [i > 0 ?
                            <div key={`gt_${i}`} className="item__gt">
                                <i className="m-icon m-icon-gray-gt_b" />
                            </div> : null,
                            <div
                                key={key}
                                className={classNames("item", { active })}
                                onClick={() => this.onClick(key)}
                            >
                                <div className="count">{total}</div>
                                <div className="title">{obj.name}</div>
                            </div>
                        ];
                    })}
                </div>
            </div>
        );
    }
}

ProgressBreadcrumb.propTypes = {
    status: PropTypes.string,
    breadcrumb: PropTypes.shape([PropTypes.node]),
    zero: PropTypes.bool,
    onClick: PropTypes.func
};

ProgressBreadcrumb.defaultProps = {
    status: PROCESS_BREADCRUMB_CODE.READY,
    zero: false
};

export default ProgressBreadcrumb;
