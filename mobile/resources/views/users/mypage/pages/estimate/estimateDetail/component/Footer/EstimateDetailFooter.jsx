import "./estimateDetailFooter.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import { History, browserHistory } from "react-router";

export default class EstimateDetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ableToEstimate: true,
            data: this.props.data,
            isMobile: utils.agent.isMobile()
        };
        this.onRequestEstimate = this.onRequestEstimate.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        if (this.props.data) {
            this.setData(this.props.data);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.state.data = nextProps.data;
            this.setData(nextProps.data);
        }
    }

    onRequestEstimate() {
        const { ableToEstimate, data } = this.state;
        if (ableToEstimate) {
            return;
        }
        if (utils.agent.isMobile()) {
            location.href = `/users/quotation/${data.no}/basic`;
        } else {
            const url = `/users/quotation/${data.no}/basic`;
            // utils.history.push(url);
            browserHistory.replace(url);
        }
    }

    setData(data) {
        // const offerList = data.offer.list;
        const isComplete = (data.status === "COMPLETE") || (data.offer.list.length > 0);

        // if (!isComplete) {
        this.setState({
            ableToEstimate: isComplete
        });
        // }
    }

    render() {
        return (
            <div
                className={classNames("user__estimate-detail-footer", { "disable": this.state.ableToEstimate }, { "isMobile": this.state.isMobile })}
                onClick={this.onRequestEstimate}
            >
                <div className="modify-estimate">
                    <p>요청서 수정</p>
                </div>
            </div>
        );
    }
}

EstimateDetailFooter.propTypes = {
    // no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // offerNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
