import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import Panel from "mobile/resources/components/estimate/panel/Panel";
import Img from "shared/components/image/Img";
import Pagination from "mobile/resources/components/estimate/pagination/Pagination";
import utils from "forsnap-utils";

export default class EstimateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            onRedirect: props.onRedirect,
            onQuery: props.onQuery,
            page: props.page,
            total: props.total,
            tab: props.tab,
            enter: props.enter,
            is_mobile: utils.agent.isMobile()
        };
        this.redirectStatus = this.redirectStatus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            const props = { ...nextProps };
            this.setState({
                props
            });
        }
    }

    onExposure(data, index) {
        const stop_dt = data.stop_dt;
        const display = stop_dt ? "Y" : "N";
        const order_no = data.no;
        const request = API.orders.updateOrderDisplay(order_no, { display });
        request.then(response => {
            const list = this.state.list;
            list[index].stop_dt = response.data.stop_dt;
            this.setState({
                list
            }, () => {
                if (response.data.stop_dt === null) {
                    PopModal.toast("요청서가 노출되었습니다.");
                } else {
                    PopModal.toast("요청서가 비노출되었습니다.");
                }
            });
            // location.href = `/users/quotation/${order_no}/category`;
        }).catch(error => {
            if (parseInt(data.offer_cnt, 10) === 0) {
                PopModal.alert(error.data, { callBack: () => { location.href = `/users/quotation/${order_no}/category`; } });
            } else {
                const alertMsg = "촬영요청일이 만료되었습니다.\n 새로운 요청서를 작성해주세요.";
                PopModal.alert(alertMsg);
            }
            // const alertMsg = "촬영요청일이 만료되었습니다.\n 새로운 요청서를 작성해주세요.";
            // console.log(error.data);
        });
    }

    redirectStatus(data, type) {
        const no = data.no;
        const offer_no = data.offer_no;
        const offer_status = data.offer_status;
        const category = data.category;
        let locationState = "";

        if (type === "offer") {
            if (offer_status === "REQUEST") {
                // browserHistory.push(`/artists/estimate/${no}/offer/${offer_no}`);
                locationState = `/artists/estimate/${no}/offer/${offer_no}`;
            } else {
                locationState = `/artists/quotation/${no}`;
            }
            this.props.onRedirect(locationState, category);
            // location.href = redirect;
        } else {
            switch (data.status) {
                case "REQUEST": case "PROGRESS": case "COMPLETE": locationState = `/users/estimate/${no}/${type}`; break;
                default: locationState = `/users/quotation/${no}/`; break;
            }
            this.props.onRedirect(locationState, category);
            // this.props.onRedirect(locationState);
        }
    }

    drawEstimate() {
        const { list, tab } = this.props;
        let content = "";

        if (list.length > 0) {
            content = this.drawList(list);
        } else if (tab === "progress") {
            content = this.drawNone();
        }

        return content;
    }

    paging({ page }) {
        if (typeof this.props.onQuery === "function") {
            this.props.onQuery(page);
        }
    }

    drawList(data) {
        const { page, limit, total, tab } = this.props;
        return (
            <div>
                {data.map((obj, idx) => {
                    return (
                        <div key={`estimate-unit__${idx}`} className="panel-unit">
                            {tab === "complete" ? <div className="wrap-white-beam" /> : null}
                            <Panel
                                data={obj}
                                type="estimate"
                                tab={tab}
                                receiveStatus={this.redirectStatus}
                                onExposure={item => this.onExposure(item, idx)}
                            />
                        </div>
                    );
                })}
                <div className="estimate-comment-pagination">
                    <Pagination
                        page={page}
                        total={total}
                        limit={limit}
                        query={movePage => this.paging(movePage)}
                    />
                </div>
                <div className="wrap-quotation-button">
                    <button className="button button-block button__theme__skyblue quotation-button" onClick={this.onConsult}>
                        <i className="m-icon m-icon-thunder" /><span>무료견적 요청하기</span>
                    </button>
                </div>
            </div>
        );
    }

    drawNone() {
        return (
            <div className="estimate__none__list desktop-estimate">
                <div className="wrap-img">
                    <div className="inner-content">
                        <p className="title">시작하기</p>
                        <p className="text">
                            당신을 기다리고 있는<br />
                            수백명의 다양한 사진작가들,<br />
                            그리고 멋진 사진들,<br />
                            포스냅 안에서 모두 만나세요.
                        </p>
                    </div>
                </div>
                <Img image={{ src: "/mobile/imges/m_estimate_bg.jpg", type: "image" }} />
            </div>
        );
    }

    render() {
        return (
            <div className="users-estimate__list">
                {this.drawEstimate()}
            </div>
        );
    }
}

EstimateList.defaultProps = {
    onRedirect: undefined,
    onQuery: undefined,
    list: [],
    page: 1,
    total: 0,
    tab: "progress"
};

EstimateList.propTypes = {
    onRedirect: PropTypes.func,
    onQuery: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tab: PropTypes.string
};
