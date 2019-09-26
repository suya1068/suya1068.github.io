import "../ArtistReviewPage.scss";
import React, { Component } from "react";
import { routerShape } from "react-router";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import { ARTIST_SELF_REVIEW_STATUS } from "shared/constant/aritst.const";
import Pagelist from "desktop/resources/components/table/Pagelist";

class ArtistReviewListPage extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true,
            limit: 7,
            page: 1,
            total: 0,
            list: [],
            category: []
        };

        this.onDetail = this.onDetail.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onRequestStatus = this.onRequestStatus.bind(this);

        this.fetch = this.fetch.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentDidMount() {
        this.fetchCategory();
        this.fetch();
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onDetail(self_review_no) {
        this.context.router.push(`/artists/photograph/review/edit/${self_review_no}`);
    }

    onRegister() {
        this.context.router.push("/artists/photograph/review/edit");
    }

    onDelete(no) {
        const user = auth.getUser();

        if (user) {
            api.artists.deleteSelfReview(user.id, no)
                .then(res => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "촬영사례가 삭제되었습니다."
                    });
                    this.fetch(this.state.page);
                });
        }
    }

    onRequestStatus(no) {
        const user = auth.getUser();

        if (user) {
            api.artists.updateRequestSelfReview(user.id, no)
                .then(res => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "승인요청을 신청했습니다."
                    });
                    this.fetch(this.state.page);
                });
        }
    }

    fetch(page = 1) {
        const { limit } = this.state;
        const user = auth.getUser();

        if (user) {
            api.artists.fetchAllSelfReview(user.id, { offset: (page - 1) * limit, limit })
                .then(res => {
                    return res.data;
                })
                .then(data => {
                    const { list, total_cnt } = data;
                    this.setStateData(state => {
                        return {
                            page: page || state.page,
                            list,
                            total: total_cnt
                        };
                    });
                });
        }
    }

    fetchCategory() {
        api.products.categorys()
            .then(res => {
                return res.data;
            })
            .then(data => {
                if (data && Array.isArray(data.category) && data.category.length) {
                    this.setStateData(() => {
                        return {
                            category: data.category
                        };
                    });
                }
            });
    }

    createStatusButton(no, status = "") {
        const content = [];

        if (status === ARTIST_SELF_REVIEW_STATUS.READY.code) {
            content.push(<button key="write" className="_button write" onClick={() => this.onDetail(no)}>글수정</button>);
            content.push(<button key="request" className="_button request" onClick={() => this.onRequestStatus(no)}>승인요청</button>);
        } else if (status === ARTIST_SELF_REVIEW_STATUS.REQUEST.code) {
            content.push(<button key="write" className="_button disable">글수정</button>);
        } else if (status === ARTIST_SELF_REVIEW_STATUS.COMPLETE.code) {
            content.push(<button key="write" className="_button disable">글수정</button>);
        } else if (status === ARTIST_SELF_REVIEW_STATUS.CANCEL.code) {
            content.push(<button key="write" className="_button write" onClick={() => this.onDetail(no)}>글수정</button>);
            content.push(<button key="request" className="_button request" onClick={() => this.onRequestStatus(no)}>승인요청</button>);
        }

        return content;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { limit, page, total, list, category } = this.state;

        return (
            <div className="artists__review__page">
                <div className="page__header">
                    <h1 className="header__title">촬영사례등록</h1>
                    <div className="header__description">
                        <p>등록하신 사례는 해당카테고리의 상품페이지에 기본으로 노출되며,<br />광고 신청 시 메인 및 카테고리리스트페이지에 랜덤 노출됩니다.</p>
                    </div>
                    <div className="review__write">
                        <button className="_button _button__trans__black write__review" onClick={this.onRegister}>사례작성하기</button>
                    </div>
                </div>
                <div className="page__body">
                    <div className="review__container">
                        <h1 className="list__title">촬영사례등록현황</h1>
                        <div>
                            <table className="fixed">
                                <colgroup>
                                    <col width="18%" />
                                    <col width="50%" />
                                    <col width="25%" />
                                    <col width="7%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>카테고리</th>
                                        <th>제목</th>
                                        <th className="text-left">상태</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map(o => {
                                        const ctg = category.find(c => c.code === o.category);
                                        const status = ARTIST_SELF_REVIEW_STATUS[o.request_status];
                                        return (
                                            <tr key={o.no}>
                                                <td>{ctg ? ctg.name : "-"}</td>
                                                <td className="text-left">{o.title}</td>
                                                <td className="status text-left">
                                                    <span className={o.request_status === ARTIST_SELF_REVIEW_STATUS.CANCEL.code ? "status__cancel" : ""}>
                                                        {status ? status.name : "-"}
                                                    </span>

                                                    {this.createStatusButton(o.no, o.request_status)}
                                                </td>
                                                <td><button className="_button _button__close" onClick={() => this.onDelete(o.no)} /></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="review__paging">
                            <Pagelist
                                page={page}
                                totalCount={total}
                                listCount={limit}
                                pageCount="10"
                                callBack={this.fetch}
                                isJump
                                render={value => {
                                    if (value.length > 2) {
                                        return value;
                                    }

                                    return utils.fillSpace(value, 2, 0);
                                }}
                            />
                        </div>
                    </div>
                    <div className="review__info">
                        <h1 className="info__title">사례등록 안내사항</h1>
                        <div className="info__description">
                            <p>등록된 사례는 관리자의 검수 후 노출되며, 미승인된 경우 글 수정 후 재승인요청할 수 있습니다.</p>
                            <p>작성된 사례가 허위사실유포, 저작권 및 초상권침해 등 서비스 이용에 문제가 되는 경우 즉시 삭제될 수 있으며 이로인한 책임은 작성자에게 있습니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ArtistReviewListPage.contextTypes = {
    router: routerShape
};

export default ArtistReviewListPage;
