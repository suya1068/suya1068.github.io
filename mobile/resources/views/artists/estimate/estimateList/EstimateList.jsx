import "./estimateList.scss";
import React, { Component, PropTypes } from "react";
import Panel from "mobile/resources/components/estimate/panel/Panel";
import Pagination from "mobile/resources/components/estimate/pagination/Pagination";
import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";

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
            isBlock: props.isBlock
        };

        this.redirectStatus = this.redirectStatus.bind(this);
    }

    /**
     * 작가페이지 촬영의뢰서 리스트 panel 유닛
     * @param data
     * @param type
     */
    redirectStatus(data, type) {
        const no = data.no;
        const offer_no = data.offer_no;
        const offer_status = data.offer_status;

        let locationState = "";
        if (type === "offer") {         // 견적서 페이지에서 리다이렉트 이벤트시
            if (offer_status === "REQUEST" || offer_status === "COMPLETE") {
                locationState = `/artists/estimate/${no}/offer/${offer_no}`;
            } else {
                locationState = `/artists/quotation/${no}`;
            }

            this.props.onRedirect(locationState);
        } else {
            const { tab, page } = this.props;
            switch (data.status) {
                // 촬영의뢰서 상세보기
                case "REQUEST":
                case "PROGRESS":
                case "COMPLETE":
                    {
                        const p_url = (tab && page) ? `?p_tab=${tab}&p_page=${page}` : "";
                        locationState = `/artists/estimate/${no}${p_url}`;
                        break;
                    }
                default: locationState = `/artists/quotation/${no}`; break;
            }
            this.props.onRedirect(locationState);
        }
    }

    /**
     * 촬영요청 리스트를 그린다.
     * @returns {string}
     */
    drawEstimate() {
        const { list, tab } = this.props;
        let content = "";

        if (list.length > 0) {
            content = this.drawList(list);
        } else if (list.length < 1) {
            content = this.drawNone(tab);
        }

        return content;
    }

    /**
     * 리스트 페이징
     * @param page
     */
    paging({ page }) {
        if (typeof this.props.onQuery === "function") {
            this.props.onQuery(page);
        }
    }

    /**
     * 리스트가 있는 경우
     * @param list
     * @returns {*}
     */
    drawList(list) {
        const { page, limit, total, tab, isBlock } = this.props;
        const pageData = { page, limit, total };
        const panelData = { tab, isBlock, type: "estimate", userType: "A" };
        return (
            <div className="artists-estimate__list--container">
                {list.map((obj, idx) => {
                    return (
                        <div key={`estimate-unit__${idx}`} className="panel-unit">
                            {obj.user_id === "" && <div className="wrap-white-beam" />}
                            <Panel
                                data={obj}
                                receiveStatus={this.redirectStatus}
                                {...panelData}
                            />
                        </div>
                    );
                })}
                <div className="estimate-comment-pagination">
                    <Pagination
                        {...pageData}
                        query={movePage => this.paging(movePage)}
                    />
                </div>
            </div>
        );
    }

    /**
     * 리스트가 없을 경우
     * @param type
     * @returns {*}
     */
    drawNone(type) {
        const is_progress = type === "progress";
        const props = {
            mainCaption: is_progress ? "진행중인 촬영요청이 없어요." : "내가 작성한 견적서가 없어요.",
            subCaption: is_progress ? "조금만 기다려 주세요." : "",
            src: "/mobile/imges/f_img_bg_05.png",
            noneKey: "artist-list"
        };
        return (
            <div className="estimate__none__list">
                <NoneList {...props} key="artist-list" />
            </div>
        );
    }

    render() {
        return (
            <div className="artists-estimate__list">
                {this.drawEstimate()}
            </div>
        );
    }
}

EstimateList.propTypes = {
    onRedirect: PropTypes.func,
    onQuery: PropTypes.func,
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tab: PropTypes.string,
    isBlock: PropTypes.string
};

EstimateList.defaultProps = {
    onRedirect: undefined,
    onQuery: undefined,
    list: [],
    page: 1,
    total: 0,
    tab: "progress",
    isBlock: ""
};
