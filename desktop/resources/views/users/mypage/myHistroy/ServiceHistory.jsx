import "./serviceHistory.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";
// import Icon from "desktop/resources/components/icon/Icon";

import OrderHistory from "./component/OrderHistory";
import SearchHistory from "./component/SearchHistory";
import ReviewHistory from "./component/ReviewHistory";
// import HistoryTicketPaymentPage from "./ticket_payment/HistoryTicketPaymentPage";
// import HistoryTicketPage from "./ticket/HistoryTicketPage";
import PopModal from "shared/components/modal/PopModal";

const PAGE_CODE = {
    RESULT: "RESULT",
    COMMENT: "COMMENT",
    TICEKT_PAYMENT: "TICKET_PAYMENT",
    TICKET: "TICKET"
};

class ServiceHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: [
                { code: PAGE_CODE.RESULT, url: "result", name: "촬영구매내역", active: true, able: true },
                { code: PAGE_CODE.COMMENT, url: "comment", name: "나의후기", active: false, able: true }
                // { code: PAGE_CODE.TICEKT_PAYMENT, url: "ticket-payment", name: "티켓구매내역", active: false, able: false },
                // { code: PAGE_CODE.TICKET, url: "ticket", name: "나의티켓", active: false, able: false }
            ],
            status: "COMPLETE",
            stepValue: PAGE_CODE.RESULT,
            searchProp: {},
            enter: props.enter
        };

        this.onClickNavigation = this.onClickNavigation.bind(this);
        this.searchList = this.searchList.bind(this);

        this.hasPage = this.hasPage.bind(this);
        this.setPage = this.setPage.bind(this);
        this.isActive = this.isActive.bind(this);

        this.renderNavigation = this.renderNavigation.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    componentWillMount() {
        this.setPage(this.props.params.type);
    }

    componentDidMount() {
        const invalid_type = ["ticket", "ticket-payment"];
        if (invalid_type.includes(this.props.params.type)) {
            PopModal.alert("잘못된 경로로 접근하셨습니다. 다시한번 확인해 주세요.", { callBack: () => { location.href = "/"; } });
        } else {
            this.searchList();
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.params.type !== this.state.stepValue) {
        //     this.setPage(nextProps.params.type);
        // }
    }

    /**
     * 서브메뉴를 클릭한다.
     * @param event
     * @param item
     */
    onClickNavigation(event, item) {
        event.preventDefault();

        if (item.url !== this.state.stepValue) {
            utils.history.push(`/users/history/${item.url}`);
        }
        this.setPage(item.url);
    }

    /**
     * 선택된 페이지를 설정한다.
     * @param {String} type
     */
    setPage(type) {
        const { navigation } = this.state;
        const url = type || navigation[0].url;

        this.setState({
            stepValue: url,
            navigation: this.state.navigation.map(item => item.able && Object.assign(item, { active: item.url === url }))
        });
    }

    /**
     * 현재 페이지 정보를 가져온다.
     * @param {String} step
     * @returns {Boolean}
     */
    hasPage(step) {
        return this.state.navigation
            .map(item => item.url)
            .includes(step);
    }

    /**
     * 조회가간을 설정한다.
     * @param startDate
     * @param endDate
     */
    searchList(startDate, endDate) {
        const searchProp = { startDate, endDate };
        this.setState({ searchProp });
    }

    /**
     * 현재 페이지인지 판단한다.
     * @param item
     * @returns {boolean}
     */
    isActive(item) {
        return this.state.stepValue === item.url;
    }

    /**
     * 서브메뉴를 랜더링한다.
     * @returns {XML}
     */
    renderNavigation() {
        return (
            <div className="sideMenu-navigation">
                <ul>
                    { this.state.navigation.map(item => (
                        <li key={item.url} className={classNames("sideMenu", { "active": item.active })}>
                            <div onClick={e => this.onClickNavigation(e, item)}>
                                <p className="menu">{ item.name }</p>
                            </div>
                        </li>
                    )) }
                </ul>
            </div>
        );
    }

    /**
     * URL에 따라 페이지 컨텐츠를 랜더링한다.
     * @returns {*}
     */
    renderContent() {
        const page = this.state.navigation.find(item => item.active);

        switch (page && page.code) {
            case PAGE_CODE.RESULT: return (
                <div className="serviceHistory-page__container">
                    <SearchHistory searchFunc={this.searchList} stepValue={this.state.stepValue} />
                    <OrderHistory searchProp={this.state.searchProp} key="orderHistory-container" enter={this.props.enter} />
                </div>
            );
            case PAGE_CODE.COMMENT: return (
                <div className="serviceHistory-page__container">
                    <SearchHistory searchFunc={this.searchList} stepValue={this.state.stepValue} />
                    <ReviewHistory searchProp={this.state.searchProp} key="reviewHistory-container" />
                </div>
            );
            // case PAGE_CODE.TICEKT_PAYMENT: return (
            //     <div className="serviceHistory-page__container">
            //         <HistoryTicketPaymentPage />
            //     </div>
            // );
            // case PAGE_CODE.TICKET: return (
            //     <div className="serviceHistory-page__container">
            //         <HistoryTicketPage />
            //     </div>
            // );
            default: return null;
        }
    }

    render() {
        return (
            <div className="serviceHistory-page">
                <div className="serviceHistory-page__sideMenu">
                    <div className="sideMenu-title">
                        <div className="title-chunk">
                            {/*<Icon name="people" />*/}
                            <p className="h6 text-bold">서비스 이용내역</p>
                            {/*<p className="sidetext">service use history</p>*/}
                        </div>
                    </div>
                    { this.renderNavigation() }
                </div>
                { this.renderContent() }
            </div>
        );
    }
}

// ServiceHistory.propTypes = {
//     stepValue: PropTypes.string
// };

// ServiceHistory.defaultProps = {
//     stepValue: "result"
// };

export default ServiceHistory;
