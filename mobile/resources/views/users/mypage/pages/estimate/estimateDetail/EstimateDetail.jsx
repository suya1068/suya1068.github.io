import "./estimateDetail.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import API from "forsnap-api";
import redirect from "mobile/resources/management/redirect";
import PopModal from "shared/components/modal/PopModal";
import EstimateContent from "mobile/resources/components/estimate/content/Content";
import EstimateOfferList from "../estimateOfferList/EstimateOfferList";
import EstimateDetailFooter from "./component/Footer/EstimateDetailFooter";
import utils from "forsnap-utils";

const alertMsg = "본인의 촬영요청이 아닙니다.";

export default class EstimateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: props.params.type,
            isLoading: false,
            offerCnt: 0,
            commentCnt: 0
        };
        this.onActive = this.onActive.bind(this);
        this.selectOrderNo = this.selectOrderNo.bind(this);
        this.onLink = this.onLink.bind(this);
    }

    componentWillMount() {
        const searchStr = this.props.location.search;
        if (searchStr) {
            const searchQuery = utils.query.querySearchParse(searchStr);
            if (searchQuery.ga) {
                this.gaEvent(searchQuery.ga);
            }
        }
    }

    componentDidMount() {
        this.selectOrderNo();
    }

    componentWillReceiveProps(nextProps) {
        this.setData({
            isActive: nextProps.params.type
        });
    }

    onActive(status) {
        this.setData({ isActive: status }, () => {
            // browserHistory.replace(`/users/estimate/${this.props.params.order_no}/${status}`);
        });
    }

    onLink(event) {
        event.preventDefault();
        utils.history.replace(event.currentTarget.href);
    }

    setData(data, callback) {
        if (this._calledComponentWillUnmount) {
            return;
        }

        this.setState(data, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    selectOrderNo() {
        const { order_no } = this.props.routeParams;
        const request = API.orders.find(order_no);
        request.then(response => {
            const data = response.data;
            this.setData({
                data,
                offerCnt: data.offer.total_cnt,
                commentCnt: data.comment_cnt,
                isLoading: true
            });
        }).catch(error => {
            // PopModal.alert("user estimate-detail error");
            PopModal.alert(alertMsg, { callBack: () => redirect.back() });
        });
    }

    isActive(status) {
        return status === this.state.isActive;
    }

    switchComponent() {
        const isActive = this.state.isActive;
        const data = this.state.data;

        if (!this.state.isLoading) {
            return false;
        }

        switch (isActive) {
            case "offerlist":
                return <EstimateOfferList orderData={data} category={data.category} order_no={data.no} />;
            case "content": return <EstimateContent orderData={data} userType="U" />;
            default: return null;
        }
    }

    gaEvent(no) {
        utils.ad.gaEvent("SMS견적서확인", "모바일", `요청서번호: ${no}`);
    }

    render() {
        const { offerCnt, commentCnt, isActive, isLoading, data } = this.state;
        const params = this.props.params;
        let offerCountText = "";
        let contentCountText = "";
        if (offerCnt > 0) {
            offerCountText = `[${offerCnt}]`;
        }

        if (commentCnt > 0) {
            contentCountText = `[${commentCnt}]`;
        }

        return (
            <div className="users-estimate__detail">
                <div className="estimate-list__head-button">
                    <Link to={`/users/estimate/${params.order_no}/offerlist`} onClick={this.onLink}>
                        <div
                            onClick={() => this.onActive("offerlist")}
                            className={`button button__rect offerlist ${this.isActive("offerlist") ? "active" : ""}`}
                        >
                            견적서리스트<span className="pink-text">{offerCountText}</span>
                        </div>
                    </Link>
                    <Link to={`/users/estimate/${params.order_no}/content`} onClick={this.onLink}>
                        <div
                            onClick={() => this.onActive("content")}
                            className={`button button__rect content ${this.isActive("content") ? "active" : ""}`}
                        >
                            나의요청내용<span className="pink-text">{contentCountText}</span>
                        </div>
                    </Link>
                </div>
                {this.switchComponent()}
                {isActive === "content" && isLoading && !data.stop_dt ?
                    <EstimateDetailFooter data={this.state.data} /> : null
                }
            </div>
        );
    }
}

EstimateDetail.contextTypes = {
    router: PropTypes.object
};
