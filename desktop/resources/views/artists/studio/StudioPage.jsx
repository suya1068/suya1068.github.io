import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./StudioPage.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";

import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

import constant from "shared/constant";
import { STATUS_TYPE } from "shared/constant/crewstudio.const";
import PopModal from "shared/components/modal/PopModal";

import Pagelist from "desktop/resources/components/table/Pagelist";

import ColumnHeader from "./components/ColumnHeader";
import StudioAgree from "./components/StudioAgree";
import StudioDetail from "./components/StudioDetail";

class StudioPage extends Component {
    constructor(props) {
        super(props);

        const { params } = props;

        this.state = {
            isMount: true,
            isProgress: false,
            list: [],
            limit: 10,
            total: 0,
            page: 1,
            renderLayout: null,
            no: params ? params.no || "" : ""
        };

        this.onProgress = this.onProgress.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onPage = this.onPage.bind(this);
        this.onDetail = this.onDetail.bind(this);

        this.getCrewList = this.getCrewList.bind(this);

        this.renderList = this.renderList.bind(this);
        this.renderDetail = this.renderDetail.bind(this);
    }

    componentWillMount() {
        // if (window.history) {
        //     window.history.replaceState(null, null, "/artists/board/notice");
        // }
    }

    componentDidMount() {
        this.onProgress(true);
        const { limit } = this.state;

        API.auth.session("A").then(res => {
            if (res.status === 200) {
                const data = res.data;
                const sessionInfo = data.session_info;
                const prop = {};

                if (!sessionInfo.crew_set_dt) {
                    this.onProgress(false);
                    document.location.href = "/artists";
                    return;
                }

                if (sessionInfo.crew_set_dt !== undefined && !this.state.crew_set_dt && sessionInfo.crew_set_dt) {
                    prop.crew_set_dt = sessionInfo.crew_set_dt;
                }

                if (sessionInfo.crew_agree_dt !== undefined && !this.state.crew_agree_dt && sessionInfo.crew_agree_dt) {
                    prop.crew_agree_dt = sessionInfo.crew_agree_dt;
                }

                if (Object.keys(prop).length > 0) {
                    if (this.state.isMount) {
                        this.setState(prop, () => {
                            if (this.state.crew_agree_dt) {
                                this.getCrewList(0, limit).then(response => {
                                    this.onProgress(false);

                                    if (response) {
                                        if (response.data) {
                                            this.onDetail(response.data);
                                            this.state.list = response.list || [];
                                            this.state.total = response.total || 0;
                                            this.state.page = response.page || 1;
                                        } else if (this.state.isMount) {
                                            this.setState({
                                                no: null,
                                                ...response,
                                                renderLayout: this.renderList(response.list, response.page, response.total)
                                            });
                                        }
                                    } else if (this.state.isMount) {
                                        this.setState({
                                            renderLayout: this.renderList([], 1, 0)
                                        });
                                    }
                                });
                            } else {
                                this.onProgress(false);
                            }
                        });
                    }
                }
            }
        });
    }

    componentWillReceiveProps(nextProps, nextState) {
        const { list, page, total } = this.state;
        const params = nextProps.params;

        if (params && params.no) {
            if (this.state.isMount) {
                this.setState({
                    no: params.no,
                    renderLayout: this.renderDetail(params.no)
                });
            }
        } if (!utils.isArray(list)) {
            this.onPage(1, 0);
        } else {
            this.state.no = null;
            this.state.renderLayout = this.renderList(list, page, total);
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onPage(page, offset) {
        const { limit } = this.state;
        this.getCrewList(offset, limit).then(result => {
            if (this.state.isMount) {
                this.setState({
                    ...result,
                    renderLayout: this.renderList(result.list, result.page, result.total)
                });
            }
        });
    }

    onDetail(obj) {
        const boardNo = obj.crew_order_no;
        const url = `/artists/studio/${boardNo}`;
        const location = document.location;

        utils.ad.gaEvent("작가-크루스튜디오 상세선택", "데스크탑", `번호: ${boardNo} | 제목: ${obj.title}`);

        if (location.pathname === url) {
            if (this.state.isMount) {
                this.setState({
                    no: boardNo,
                    renderLayout: this.renderDetail(boardNo)
                });
            }
        } else {
            this.context.router.push(url);
        }
    }

    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    onAgree(id, agree) {
        API.artists.updateAgreeCrew(id, { agree: agree ? "Y" : "N" }).then(response => {
            if (response.status === 200) {
                const data = response.data;
                const sessionInfo = data.session_info;

                if (this.state.isMount) {
                    this.setState({
                        crew_agree_dt: sessionInfo.crew_agree_dt
                    }, () => {
                        this.context.router.push("/artists/studio");
                    });
                }
            }
        }).catch(error => {
            if (error) {
                PopModal.alert(error.data || "오류가 발생했습니다.\n잠시 후 다시 시도해주세요", { callBack: () => redirect.back() });
            }
        });
    }

    getCrewList(offset, limit) {
        const { no, page, crew_set_dt, crew_agree_dt } = this.state;

        return API.orders.findCrew(offset, limit).then(response => {
            if (response.status === 200) {
                const data = response.data;
                const dataList = data.list || [];
                const prop = {
                    list: dataList,
                    total: Number(data.total_cnt || 0),
                    page: (offset / limit) + 1
                };

                if (no && utils.isArray(dataList)) {
                    prop.data = dataList.find(t => {
                        return t.crew_order_no === no;
                    });

                    if (!prop.data) {
                        const ofs = offset + dataList.length;

                        if (prop.total > ofs) {
                            return this.getCrewList(ofs, limit);
                        }

                        this.state.no = null;
                        return this.getCrewList((page > 0 ? page - 1 : 0) * this.state.limit, limit);
                    }
                }

                return prop;
            }

            return null;
        }).catch(error => {
            if (error) {
                PopModal.alert(error.data || "오류가 발생했습니다.\n잠시 후 다시 시도해주세요");
            }
            return null;
        });
    }

    itemLayout(list, total) {
        if (utils.isArray(list)) {
            return list.map(obj => {
                const { crew_order_no, user_name, category, price, reg_dt, status } = obj;
                let regDt = "";

                if (reg_dt && typeof reg_dt === "string") {
                    regDt = reg_dt.substr(0, 10);
                }

                const statusType = STATUS_TYPE[status] || null;

                return (
                    <div key={`board_notice_${crew_order_no}`} className="list__item cursor">
                        <div className="list__item__title cursor" onClick={() => this.onDetail(obj)}>
                            <div className="date">
                                {regDt}
                            </div>
                            <div className="nickname">
                                {user_name}
                            </div>
                            <div className="category">
                                {category ?
                                    category.replace(/\s/g, "").split(",").map(c => (constant.PRODUCTS_CATEGORY.find(pc => (pc.code === c)) || { name: "" }).name).join(", ") : ""
                                }
                            </div>
                            <div className="price">
                                {utils.format.price(price)}
                            </div>
                            <div className="status">
                                {statusType ? statusType.name : ""}
                            </div>
                        </div>
                    </div>
                );
            });
        } else if (total > 0) {
            return null;
        }

        return (
            <div key="board_notice_empty" className="list__item">
                <div className="list__item__title">
                    <div className="empty">
                        <div className="empty__title">
                            촬영 리스트가 없습니다
                        </div>
                        <div className="empty__caption">
                            촬영 리스트가 없습니다
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderList(list, page, total) {
        const { limit } = this.state;

        return (
            <div className="board__notice">
                <div className="board__notice__list studio__notice">
                    <ColumnHeader />
                    {this.itemLayout(list, total)}
                </div>
                <div className="board__notice__page">
                    <Pagelist page={page} totalCount={total} listCount={limit} pageCount="5" callBack={this.onPage} isJump />
                </div>
            </div>
        );
    }

    renderDetail(boardNo) {
        return <StudioDetail boardNo={boardNo} />;
    }

    render() {
        const { renderLayout, no, crew_agree_dt, crew_set_dt } = this.state;

        if (crew_set_dt && !crew_agree_dt) {
            return <StudioAgree onAgree={this.onAgree} />;
        }

        if (!renderLayout) {
            return null;
        }

        return (
            <div>
                {!no ?
                    <div className="layout__header">
                        <h2 className="board__page__title">
                            요청 리스트
                        </h2>
                    </div> : null
                }
                <div className="layout__body">
                    <div className="layout__body__main">
                        {renderLayout}
                    </div>
                </div>
            </div>
        );
    }
}

StudioPage.contextTypes = {
    router: routerShape
};

export default StudioPage;
