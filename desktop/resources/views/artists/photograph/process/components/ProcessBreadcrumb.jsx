import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Icon from "desktop/resources/components/icon/Icon";
import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";

class ProcessBreadcrumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            hover: ""
        };

        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.setStateData = this.setStateData.bind(this);
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

    onMouseEnter(status) {
        this.setStateData(() => ({ hover: status }));
    }

    onMouseLeave() {
        this.setStateData(() => ({ hover: "" }));
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { status, breadcrumb } = this.props;
        const { hover } = this.state;

        return (
            <div className="process__breadcrumb">
                <div className="list">
                    {Object.keys(COMBINE_PROCESS_BREADCRUMB).map(key => {
                        const obj = COMBINE_PROCESS_BREADCRUMB[key];

                        const total = obj.status.reduce((r, o) => {
                            return r + Number(breadcrumb[o]);
                        }, 0);

                        return (
                            <div
                                key={key}
                                className={classNames("item", { active: key === status })}
                                onMouseEnter={() => this.onMouseEnter(key)}
                                onMouseLeave={this.onMouseLeave}
                                onClick={() => this.onClick(key)}
                            >
                                <Icon name={obj.icon} active={key === status || key === hover ? "active" : ""} />
                                <div className="title" data-count={total || 0}>{obj.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ProcessBreadcrumb.propTypes = {
    status: PropTypes.string,
    breadcrumb: PropTypes.shape([PropTypes.node]),
    onClick: PropTypes.func
};

ProcessBreadcrumb.defaultProps = {
    status: PROCESS_BREADCRUMB_CODE.READY
};

export default ProcessBreadcrumb;
