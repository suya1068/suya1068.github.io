import React, { Component, PropTypes } from "react";
import { routerShape, browserHistory } from "react-router";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import classNames from "classnames";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import api from "forsnap-api";

import constant from "shared/constant";
import PopModal from "shared/components/modal/PopModal";

import Buttons from "desktop/resources/components/button/Buttons";
import DashboardBreadcrumb from "./components/DashboardBreadcrumb";
import mewtime from "forsnap-mewtime";

class ArtistsMainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: {},
            alarm: constant.NOTIFY.ARTISTS_MAIN,
            info: constant.NOTIFY.INFO_MAIN,
            notice: null,
            isProcess: false,
            today: mewtime()
        };

        this.onDetail = this.onDetail.bind(this);

        this.apiArtistDashboard = this.apiArtistDashboard.bind(this);

        this.moveRouter = this.moveRouter.bind(this);
        this.itemLayout = this.itemLayout.bind(this);

        this.setDashInfo = this.setDashInfo.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.apiArtistDashboard();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.isProcess) {
            this.state.isProcess = true;
            this.apiArtistDashboard();
        }
    }

    onMoveInfo(url) {
        const router = this.context.router;
        router.push(url);
    }

    onDetail(boardNo) {
        // this.context.router.push(`/artists/board/notice/${no}`);

        const { notice, no } = this.state;

        if (notice) {
            if (boardNo === no) {
                this.state.no = "";
            } else {
                this.state.no = boardNo;
                let title = "";

                if (utils.isArray(notice.list)) {
                    const obj = notice.list.find(o => {
                        return o.no === boardNo;
                    });

                    title = obj ? obj.title : "";
                }

                utils.ad.gaEvent("작가페이지", "작가-공지사항 상세선택", `번호: ${boardNo} | 제목: ${title}`);
            }

            this.setState({
                notice
            });
        }
    }

    apiArtistDashboard() {
        const user = auth.getUser();
        if (user) {
            const request = api.artists.artistDashboard(user.id);
            request.then(response => {
                // console.log(response);
                const data = response.data;
                const dataAlarm = data.alarm;
                const notice = data.notice;
                let alarm = this.state.alarm;
                const info = this.setDashInfo(dataAlarm);

                alarm = alarm.reduce((result, obj) => {
                    const count = dataAlarm[obj.key];

                    if (count) {
                        obj.count = count;
                    } else {
                        obj.count = 0;
                    }

                    result.push(obj);
                    return result;
                }, []);

                this.setState({
                    breadcrumb: data.reserve_cnt,
                    alarm,
                    info,
                    notice
                }, () => { this.state.isProcess = false; });
            }).catch(error => {
                this.state.isProcess = false;
                PopModal.alert(error.data);
            });
        }
    }

    setDashInfo(data) {
        const { info } = this.state;
        return info.reduce((result, obj) => {
            const count = data[obj.CODE.toLowerCase()];
            if (count) {
                obj.COUNT = count;
            } else {
                obj.COUNT = 0;
            }

            result.push(obj);
            return result;
        }, []);
    }

    /**
     * 작가 페이지내 라우터 이동
     */
    moveRouter(url) {
        this.context.router.push(url);
    }

    itemLayout(list) {
        const { today } = this.state;

        if (utils.isArray(list)) {
            const { no } = this.state;
            return list.map(obj => {
                let regDt = "";

                if (obj.reg_dt && typeof obj.reg_dt === "string") {
                    regDt = obj.reg_dt.substr(0, 10);
                }

                const after_seven_date = mewtime(regDt).clone().add(7).format("YYYY-MM-DD");
                const is_bold_notice = today.isBefore(after_seven_date);

                const contentBlock = htmlToDraft(obj.content);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

                return (
                    <div key={`board_notice_${obj.no}`} className={classNames("list__item cursor", { show: obj.no === no })}>
                        <div className="list__item__title cursor" onClick={() => this.onDetail(obj.no)}>
                            <div className="title">
                                {is_bold_notice ? <strong>{obj.title}</strong> : obj.title}
                                {is_bold_notice && <span className="new-badge" style={{ top: 10 }}>N</span>}
                            </div>
                            <div className="date">
                                {regDt}
                            </div>
                        </div>
                        <div className="list__item__content">
                            <div className="content">
                                <Editor
                                    readOnly
                                    wrapperClassName="board-editor-read-only"
                                    editorClassName="board-editor"
                                    editorState={EditorState.createWithContent(contentState)}
                                />
                            </div>
                        </div>
                    </div>
                );
            });
        }

        return null;
    }

    render() {
        const { alarm, breadcrumb, notice, info } = this.state;

        return (
            <div className="artists-page-main">
                <div className="artist-content-row">
                    <h3 className="head-title">알림</h3>
                    <div className="grid-list">
                        {alarm.map(obj => {
                            return (
                                <div className="grid-conetnt" key={obj.value} onMouseUp={() => browserHistory.replace(obj.link)}>
                                    <div className="notify-item">
                                        <p className="notify-count">{obj.count}</p>
                                        <p className="notify-title" title={obj.caption}>{obj.name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="artist-content-row">
                    <h3 className="head-title">정보</h3>
                    <div className="management-content">
                        <div className="management-content__info">
                            {info.map(obj => {
                                return (
                                    <div className="info-box" key={obj.CODE} onClick={() => this.onMoveInfo(obj.LINK)}>
                                        <div className="info-box__content">
                                            <p className="count">{utils.format.price(obj.COUNT)}</p>
                                            <p style={{ fontSize: 18 }}>{obj.CAPTION}</p>
                                            <p style={{ fontSize: 28 }}>{obj.NAME}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="artist-content-row">
                    <h3 className="head-title">촬영관리</h3>
                    <div className="management-content">
                        <DashboardBreadcrumb breadcrumb={breadcrumb} onClick={status => this.context.router.push(`/artists/photograph/process/${status.toLowerCase()}`)} />
                    </div>
                </div>
                {notice ?
                    <div className="artist-content-row">
                        <h3 className="head-title">
                            공지사항
                            <Buttons buttonStyle={{ size: "small", shape: "round", theme: "bg-white" }} inline={{ className: "more__button", onClick: () => this.moveRouter("/artists/board/notice") }}>
                                더보기&nbsp;&nbsp;+{notice.total_cnt - notice.list.length}
                            </Buttons>
                        </h3>
                        <div className="board__notice">
                            <div className="board__notice__list artist__notice">
                                <div className="list__item">
                                    <div className="list__item__title notice__column">
                                        <div className="title">
                                            제목
                                        </div>
                                        <div className="date">
                                            작성일자
                                        </div>
                                    </div>
                                </div>
                                {this.itemLayout(notice.list)}
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

ArtistsMainPage.contextTypes = {
    router: routerShape
};

export default ArtistsMainPage;
