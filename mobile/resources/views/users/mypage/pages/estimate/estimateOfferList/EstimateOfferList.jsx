import "./estimateOfferList.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import redirect from "mobile/resources/management/redirect";
import PopModal from "shared/components/modal/PopModal";
import Panel from "mobile/resources/components/estimate/panel/Panel";
import NoneList from "../../../component/none-list/NoneList";
import { CATEGORY_VALUE } from "mobile/resources/components/estimate/estimate_content";
import { History } from "react-router";
import Pagination from "mobile/resources/components/estimate/pagination/Pagination";

const PAGE_LIMIT = 6;

export default class EstimateOfferList extends Component {
    constructor(props) {
        super(props);
        const { offset, limit } = this.parseToOffsetFromPage(props.page, PAGE_LIMIT);
        this.state = {
            list: [],
            category: props.category,
            order_no: props.order_no,
            orderData: props.orderData,
            accept_options: [],
            limit,
            offset,
            page: 1,
            total: 0
        };
        this.getOfferList = this.getOfferList.bind(this);
    }

    componentWillMount() {
        this.state.accept_options = CATEGORY_VALUE[this.props.category];
    }

    componentDidMount() {
        this.getOfferList(this.state.offset);
        // this.state.accept_options = CATEGORY_VALUE[this.props.category];
    }

    getOfferList(offset = 0) {
        const { limit } = this.state;
        const order_no = this.props.order_no;
        const request = API.orders.getOfferList(order_no, { limit, offset });
        request.then(response => {
            const data = response.data;
            const list = data.list;
            const total = data.total_cnt;
            this.setState({
                list,
                total,
                isLoading: true
            });
        }).catch(error => {
            PopModal.alert("본인의 촬영요청서가 아닙니다.", { callBack: () => redirect.back() });
            // PopModal.alert("offer-list error");
            // PopModal.alert(error.data);
        });
    }

    getState(data) {
        const accept_options = this.state.accept_options;
        const orderData = this.state.orderData;
        const accordData = [];

        if (!accept_options || accept_options.length < 1) {
            return false;
        }

        const enableOptions = accept_options.map(obj => {
            obj.subtitle = data[obj.key];
            return obj;
        }).filter((value, index) => {
            if (orderData[value.key] === "N") {
                return false;
            }
            return value;
        });

        enableOptions.reduce((result, obj) => {
            result.push(obj.subtitle);
            return result;
        }, accordData);

        return accordData;
    }

    setAccordData() {
        const accordData = [];
        accordData.push(this.state.category);
        // accordData.push(offerData.region);
        // accordData.push(offerData.date);
        // accordData.push(offerData.time);

        return accordData;
    }

    /**
     * page를 사용하여, offset과 limit를 반환한다.
     * @param {number} [page = 1]
     * @param {number} [limit = PAGE_LIMIT]
     * @returns {{offset: number, limit: *}}
     */
    parseToOffsetFromPage(page = 1, limit = PAGE_LIMIT) {
        return { offset: (page - 1) * limit, limit };
    }

    calcPercent(data) {
        const total = data.length;
        const count = data.filter(obj => {
            return obj !== "N" && obj !== "NA";
        }).length;

        return Math.round((count / total) * 100);
    }

    detailOffer(data, type) {
        const redriect = `/users/estimate/${data.order_no}/offer/${data.no}`;
        // this.props.onRedirect(redriect);
        location.href = redriect;
        // browserHistory.push(redriect);
    }

    paging({ page }) {
        const { offset } = this.parseToOffsetFromPage(page);
        this.setState({ page, offset });
        this.getOfferList(offset, page);
        window.scrollTo(0, 0);
    }

    /**
     * 견적서를 쓴 작가들의 리스트를 그린다.
     * @returns {Array}
     */
    drawAuthorList() {
        const orderData = this.state.orderData;
        const { page, total, limit, list, isLoading } = this.state;
        const exposureData = {
            block_dt: orderData.block_dt,
            stop_dt: orderData.stop_dt
        };
        const listContet = [];
        if (isLoading && list) {
            if (list.length > 0) {
                listContet.push(
                    <div key="user-estimate-artists-list">
                        {list.map((obj, idx) => {
                            const status = orderData.status === "COMPLETE" ? obj.status : "";
                            const accordData = this.setAccordData(obj).concat(this.getState(obj));
                            const percent = this.calcPercent(accordData);
                            return (
                                <div key={`artistList__${idx}`} className="panel-unit">
                                    {status !== "COMPLETE" ? <div className="wrap-white-beam" /> : null}
                                    <Panel
                                        percent={percent}
                                        receiveStatus={this.detailOffer}
                                        type="offer"
                                        //status={orderData.status === "COMPLETE" ? obj.status : ""}
                                        data={obj}
                                        {...exposureData}
                                    />
                                </div>
                            );
                        })}
                        <div className="estimate-artistsList-pagination">
                            <Pagination
                                page={page}
                                total={total}
                                limit={limit}
                                query={movePage => this.paging(movePage)}
                            />
                        </div>
                    </div>
                );
            } else {
                const props = {
                    mainCaption: "아직 참여작가가 없어요.",
                    subCaption: "조금만 기다려 주세요.",
                    src: "/mobile/imges/f_img_bg_03.png",
                    noneKey: "artist-list"
                };
                listContet.push(
                    <NoneList {...props} key="artist-list" />
                );
            }
            return listContet;
        }

        return listContet;
    }

    render() {
        return (
            <div className={classNames("users-estimate__offer-list", { "complete": this.state.orderData.status === "COMPLETE" })}>
                {this.drawAuthorList()}
            </div>
        );
    }
}
