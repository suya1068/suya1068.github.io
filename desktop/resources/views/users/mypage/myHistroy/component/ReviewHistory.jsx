import React, { Component, PropTypes } from "react";
// Global
import utils from "forsnap-utils";
import API from "forsnap-api";
import Auth from "forsnap-authentication";
import mewtime from "forsnap-mewtime";

// Component
import Buttons from "desktop/resources/components/button/Buttons";
import Heart from "desktop/resources/components/form/Heart";
import PopModal from "shared/components/modal/PopModal";
import Img from "desktop/resources/components/image/Img";

class ReviewHistory extends Component {
    constructor() {
        super();
        const today = mewtime();
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(1, mewtime.const.MONTH).format("YYYY-MM-DD");

        this.state = {
            userID: Auth.getUser().id,
            list: [],
            isMore: true,
            offset: 0,
            limit: 10,
            totalCount: 0,
            userType: "U",
            searchProp: {
                startDate,
                endDate
            },
            isLoading: false
        };

        this.apiCommentList = this.apiCommentList.bind(this);
        this.resetSearchState = this.resetSearchState.bind(this);
        this.onMoreList = this.onMoreList.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const searchProp = this.state.searchProp;
        const startDate = searchProp.startDate.replace(/-/gi, "");
        const endDate = searchProp.endDate.replace(/-/gi, "");
        this.apiCommentList(startDate, endDate, this.state.offset, this.state.limit);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.searchProp) !== JSON.stringify(nextProps.searchProp)) {
            this.resetSearchState();
            this.setState({
                searchProp: nextProps.searchProp
            }, () => {
                const searchProp = this.state.searchProp;
                this.apiCommentList(searchProp.startDate, searchProp.endDate, this.state.offset, this.state.limit);
            });
        }
    }

    onMoreList() {
        const { searchProp, offset, limit } = this.state;
        this.apiCommentList(searchProp.startDate, searchProp.endDate, offset, limit);
    }

    resetSearchState() {
        this.setState({
            offset: 0,
            limit: 10
        });
    }

    /**
     * 후기목록 불러오는 api
     */
    apiCommentList(startDt, endDt, offset, limit) {
        const userID = this.state.userID;
        const request = API.users.getCommentList(userID, startDt, endDt, offset, limit);
        request.then(response => {
            if (response.status === 200) {
                const data = response.data;
                let dataList = data.list;
                let length = dataList.length;

                if (offset > 0) {
                    const list = utils.mergeArrayTypeObject(this.state.list, dataList, ["buy_no"], ["buy_no"], true);
                    dataList = list.list;
                    length = list.count;
                }

                this.setState({
                    list: dataList,
                    offset: offset + length,
                    totalCount: data.total_cnt,
                    isLoading: true
                });
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    render() {
        const { totalCount, list, isLoading } = this.state;
        const content = [];

        if (!isLoading) {
            return false;
        }

        if (list.length > 0) {
            content.push(
                <div key="photograph-title" className="photograph-title">
                    <h3 className="h4-sub" data-count={totalCount}>나의 후기</h3>
                    <p className="h5-caption text-normal">내가 쓴 후기를 확인해 보세요.</p>
                </div>
            );

            content.push(
                <div key="photograph-list" className="photograph-list">
                    <table className="table text-center">
                        <colgroup>
                            <col width="150px" />
                            <col width="480px" />
                            <col width="150px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="th-order-no">주문번호</th>
                                <th className="th-product">후기 내용</th>
                                <th className="th-process-state">평점</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map(obj => {
                                    const reviewImgContent = [];
                                    if (obj.review_img !== null) {
                                        reviewImgContent.push(
                                            <div className="simple-reviewImg pull-left" key={utils.getUUID()}>
                                                <Img image={{ src: obj.review_img, content_width: 140, content_height: 75 }} size="medium" />
                                            </div>
                                        );
                                    }
                                    return (
                                        <tr key={utils.getUUID()}>
                                            <td className="td-order-no">{utils.format.formatByNo(obj.buy_no)}</td>
                                            <td className="td-product">
                                                <div className="product-simple">
                                                    {reviewImgContent}
                                                    <div className="simple-reviewContent">
                                                        <p className="simple-comment">{utils.linebreak(obj.comment)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="td-process-state">
                                                <Heart count={obj.rating_avg} disabled="disabled" size="small" />
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <div className="photograph-button-group">
                        <Buttons buttonStyle={{ width: "block", shape: "round", theme: "bg-white" }} inline={{ className: totalCount > list.length ? "" : "hide", onClick: this.onMoreList }} >더보기</Buttons>
                    </div>
                </div>
            );
        } else {
            const noneText = "최근 후기가 없어요.";
            content.push(
                <div key="empty-list" className="empty-list">
                    <h4 className="h4 text-bold">{noneText}</h4>
                    <p className="h5-caption empty-cpation">조회기간을 통해 날짜를 선택해주세요.</p>
                </div>
            );
        }
        return (
            <div className="serviceHistory-page">
                {content}
            </div>
        );
    }
}

export default ReviewHistory;
