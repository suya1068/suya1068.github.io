import "./estimateDetail.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "mobile/resources/management/redirect";
import PopModal from "shared/components/modal/PopModal";
import EstimateContent from "mobile/resources/components/estimate/content/Content";
import DetailFooter from "../component/Footer/DetailFooter";

const alertMsg = "잘못된 의뢰서 번호입니다.";

export default class EstimateDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.selectOrderNo = this.selectOrderNo.bind(this);
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        const searchStr = this.props.location.search;
        if (searchStr) {
            const searchQuery = utils.query.querySearchParse(searchStr);
            if (searchQuery.ga) {
                this.gaEvent(searchQuery.ga);
            }
        }
        // PopModal.progress();
    }

    componentDidMount() {
        this.selectOrderNo();
    }

    componentWillUnmount() {
    }

    selectOrderNo() {
        const { order_no } = this.props.routeParams;
        const request = API.orders.find(order_no);
        request.then(response => {
            const data = response.data;
            this.setState({
                data,
                isLoading: true,
                order_no,
                offer_no: data.offer_no,
                status: data.status,
                category: data.category,
                offer_status: data.offer_status,
                isBlock: data.session_info.block_dt,
                is_read: data.is_read
            });
            PopModal.closeProgress();
        }).catch(error => {
            if (error && error.data && error.data.startsWith("해당")) {
                PopModal.alert(error.data, { callBack: () => redirect.back() });
            } else {
                PopModal.alert("올바른 경로로 접근해 주세요.", { callBack: () => redirect.back() });
            }
        });
    }

    gaEvent(no) {
        utils.ad.gaEvent("SMS요청서확인", "모바일", `요청서번호: ${no}`);
    }

    renderContent() {
        const data = this.state.data;
        if (!this.state.isLoading) {
            return false;
        }

        return (
            <EstimateContent orderData={data} userType="A" />
        );
    }

    render() {
        const { order_no, offer_no, status, category, offer_status, isBlock, isLoading, is_read } = this.state;
        const data = { order_no, offer_no, status, category, offer_status, isBlock, is_read };

        if (!isLoading) {
            return null;
        }

        return (
            <div className="artists-estimate__detail">
                <div className="artists-estimate__detail--inner">
                    {this.renderContent()}
                </div>
                <DetailFooter {...data} />
            </div>
        );
    }
}

EstimateDetail.contextTypes = {
    router: PropTypes.object
};
