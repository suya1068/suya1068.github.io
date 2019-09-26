import "./TicketPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import utils from "forsnap-utils";
// import redirect from "mobile/resources/management/redirect";
import CONSTANT from "shared/constant";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import PopModal from "shared/components/modal/PopModal";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import TicketTabList from "./components/TicketTabList";
import TicketList from "./components/TicketList";
import TicketNoneList from "./components/TicketNoneList";
import TicketConfirm from "./components/TicketConfirm";

const { TICKET_LIST_FILTER_CODE, TICKET_PRODUCT } = CONSTANT.TICKET;
const TICKET_FILTER_LIST = Object.keys(TICKET_LIST_FILTER_CODE).map(key => TICKET_LIST_FILTER_CODE[key]);
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

/**
 * 유효한 필터코드인지 판단한다.
 * @param status
 * @returns {boolean}
 */
function isValidStatusCode(status = "") {
    const code = status.toUpperCase();
    return code && TICKET_FILTER_LIST.findIndex(filter => filter.code === code) > -1;
}

class TicketPage extends Component {
    constructor(props) {
        super(props);

        const params = utils.query.parse(window.location.href);

        this.state = {
            params: { status: isValidStatusCode(params.status) ? params.status.toUpperCase() : TICKET_LIST_FILTER_CODE.PAYMENT.code, offset: 0, limit: 10 },
            total: 0,
            data: {},
            ids: []
        };

        this.onSelctTab = this.onSelctTab.bind(this);
        this.onSelectTicket = this.onSelectTicket.bind(this);
        this.onMoreTicketList = this.onMoreTicketList.bind(this);
        this.onUseTicket = this.onUseTicket.bind(this);
        this.onUseTickets = this.onUseTickets.bind(this);

        this.renderTicketList = this.renderTicketList.bind(this);

        this.setTicketList = this.setTicketList.bind(this);
        this.updateTicketList = this.updateTicketList.bind(this);
        this.isEnableUseTicket = this.isEnableUseTicket.bind(this);

        this.fetchTicketList = this.fetchTicketList.bind(this);
        this.useTickets = this.useTickets.bind(this);
    }

    componentDidMount() {
        PopModal.alert("잘못된 경로로 접근하셨습니다. 다시한번 확인해 주세요.", { callBack: () => { location.href = "/"; } });
        // this.fetchTicketList(this.state.params).then(data => this.setTicketList(this.state.params, data));
        //
        // setTimeout(() => {
        //     AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "나의티켓" });
        // }, 0);
    }

    /**
     * 탭을 선택한다.
     * @param {{code:String, name:String}} tab
     */
    onSelctTab(tab) {
        const params = Object.assign(this.state.params, { status: tab.code, offset: 0 });
        this.fetchTicketList(params).then(data => this.setTicketList(params, data));
    }

    /**
     * 티켓을 선택한다.
     * @param ticket
     */
    onSelectTicket(ticket) {
        const { data } = this.state;
        this.setState({
            data: {
                ...data,
                [ticket.ticket_code]: {
                    ...ticket,
                    checked: !ticket.checked
                }
            }
        });
    }

    /**
     * 추가적인 티켓 리스트를 가져온다.
     */
    onMoreTicketList(params) {
        this.fetchTicketList(params).then(data => this.setTicketList(params, data, true));
    }

    /**
     * 한장의 티켓을 사용한다.
     * @param ticket
     */
    onUseTicket(ticket) {
        this.showConfirm([ticket]);
    }

    /**
     * 선택된 티켓을 사용한다..
     */
    onUseTickets() {
        const { data, ids } = this.state;
        this.showConfirm(ids.filter(code => data[code].checked).map(code => data[code]));
    }

    /**
     * 티켓 리스트를 셋한다.
     * @param params
     * @param data
     * @param isMerge
     */
    setTicketList(params, data, isMerge = false) {
        let { entity, ids } = this.normalize(data.list);
        if (isMerge) {
            entity = { ...this.state.data, ...entity };
            ids = [...this.state.ids, ...ids];
        }

        this.setState({ params, total: Number(data.total_count), data: entity, ids });
    }

    updateTicketList(tickets) {
        const { params, total, data, ids } = this.state;
        const normalize = this.normalize(tickets);

        if (params.status === TICKET_LIST_FILTER_CODE.PAYMENT.code) {
            const updateIds = ids.filter(id => !normalize.ids.includes(id));

            this.setState({
                params: { ...params, offset: params.offset - tickets.length },
                total: total - tickets.length,
                ids: updateIds,
                data: updateIds.reduce((result, id) => Object.assign(result, { [id]: data[id] }), {})
            });
        } else {
            this.setState({ data: { ...data, ...normalize.entity } });
        }
    }

    /**
     * 티켓리스트를 가져온다
     * @param params
     * @returns {Promise}
     */
    fetchTicketList(params) {
        return API.life.findTicketList(params).then(response => response.data);
    }

    /**
     * 여러건의 티켓을 사용한다.
     * @param {Array.<Object>} data
     */
    useTickets(data) {
        API.life.useTickets({ ticket_code: data.map(item => item.ticket_code).join(",") })
            .then(response => {
                this.updateTicketList(response.data.list);

                PopModal.close();
                PopModal.toast(`티켓 ${response.data.list.length} 장이 사용되었습니다.`, () => {
                    history.back();
                }, 1000);
            });
    }

    showConfirm(data) {
        const modalName = "mobile-ticket-use";
        PopModal.createModal(
            modalName,
            <TicketConfirm
                data={data}
                onUseTicket={this.useTickets}
            />,
            { className: "modal-fullscreen", modal_close: false }
        );

        utils.history.push(`${location.href}/use`);
        PopModal.show(modalName);
    }

    /**
     * noramlize 데이터를 생성한다.
     * @param data
     * @returns {{entity}|{entity, access}|{access}|*|{tag}|{keywordList}}
     */
    normalize(data) {
        return data.reduce((result, item) => {
            result.entity[item.ticket_code] = Object.assign(item, { checked: false }, TICKET_PRODUCT.product_1);
            result.ids.push(item.ticket_code);
            return result;
        }, { entity: {}, ids: [] });
    }

    /**
     * 선택된 티켓이 있는지 판단한다.
     * @returns {boolean}
     */
    isEnableUseTicket() {
        const { data, ids } = this.state;
        return ids.filter(code => data[code].checked).length > 0;
    }

    /**
     * 티켓 리스트를 랜더링한다.
     * @returns {XML}
     */
    renderTicketList() {
        const { params, total, data, ids } = this.state;

        return total > 0
            ? (
                <TicketList
                    params={params}
                    total={total}
                    data={ids.map(code => data[code])}
                    onQuery={this.onMoreTicketList}
                    onSelect={this.onSelectTicket}
                    onUseTicket={this.onUseTicket}
                />
            )
            : <TicketNoneList />;
    }

    render() {
        const { params } = this.state;

        if (true) {
            return null;
        }

        return (
            <div>
                <div className="ticket-app">
                    <div className="ticket-app__body">
                        <TicketTabList list={TICKET_FILTER_LIST} selected={params.status} onClick={this.onSelctTab} />
                        { this.renderTicketList() }
                        <Footer>
                            <ScrollTop />
                        </Footer>
                    </div>
                    <div className="ticket-app__footer">
                        { this.isEnableUseTicket()
                            ? <button className="button button-block button__theme__yellow" onClick={this.onUseTickets}>티켓 사용하기</button>
                            : <button className="button button-block button__theme__yellow" disabled >티켓을 선택해주세요.</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <TicketPage />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
