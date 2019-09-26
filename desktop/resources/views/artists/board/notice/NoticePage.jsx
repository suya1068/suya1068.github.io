import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./NoticePage.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";
import classNames from "classnames";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";

import API from "forsnap-api";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";
import Pagelist from "desktop/resources/components/table/Pagelist";

import mewtime from "forsnap-mewtime";


// 포스냅_개발_최진석, [07.12.17 15:22]
// const contentBlock = htmlToDraft(content);
// const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
// return EditorState.createWithContent(contentState);
//
// 포스냅_개발_최진석, [07.12.17 15:22]
// <Editor
// readOnly
// wrapperClassName="board-editor-read-only"
// editorClassName="board-editor"
// editorState={parseContentToEditor(data.get("content"))}
// />

class NoticePage extends Component {
    constructor(props) {
        super(props);

        const { params } = props;

        this.state = {
            isProgress: false,
            list: [],
            limit: 10,
            total: 0,
            page: 1,
            boardType: "ARTIST_NOTICE",
            renderLayout: null,
            today: mewtime(),
            no: params ? params.no || "" : ""
        };

        this.onProgress = this.onProgress.bind(this);
        this.onPage = this.onPage.bind(this);
        this.onDetail = this.onDetail.bind(this);

        this.getNoticeList = this.getNoticeList.bind(this);
        this.getNoticeDetail = this.getNoticeDetail.bind(this);

        this.renderList = this.renderList.bind(this);
    }

    componentWillMount() {
        // if (window.history) {
        //     window.history.replaceState(null, null, "/artists/board/notice");
        // }
    }

    componentDidMount() {
        this.onProgress(true);
        const { limit } = this.state;

        this.getNoticeList(0, limit).then(response => {
            this.onProgress(false);
            let prop = {};

            prop = Object.assign(prop, response);
            prop.renderLayout = this.renderList(prop.list, this.state.page, prop.total, limit);
            this.setState(prop);
        });
    }

    componentWillReceiveProps(nextProps, nextState) {
        // const { list, page, total, limit, boardType } = this.state;
        // const params = nextProps.params;
        //
        // if (params && params.no) {
        //     this.getNoticeDetail(params.no, boardType).then(result => {
        //         if (result) {
        //             this.setState({
        //                 renderLayout: this.renderDetail(result.no, result.title, result.content, result.reg_dt)
        //             });
        //         }
        //     });
        // } else {
        //     this.state.renderLayout = this.renderList(list, page, total, limit);
        // }
    }

    onPage(page, offset) {
        const p = page > 0 ? page : 1;
        const { limit } = this.state;
        this.state.no = null;
        this.getNoticeList(offset, this.state.limit).then(result => {
            this.setState({
                ...result,
                page: p,
                renderLayout: this.renderList(result.list, p, result.total, limit)
            });
        });
    }

    onDetail(boardNo) {
        // this.context.router.push(`/artists/board/notice/${no}`);

        const { list, page, total, limit, no } = this.state;

        if (boardNo === no) {
            this.state.no = "";
        } else {
            this.state.no = boardNo;
            let title = "";

            if (utils.isArray(list)) {
                const obj = list.find(o => {
                    return o.no === boardNo;
                });

                title = obj ? obj.title : "";
            }

            utils.ad.gaEvent("작가페이지", "작가-공지사항 상세선택", `번호: ${boardNo} | 제목: ${title}`);
        }

        this.setState({
            renderLayout: this.renderList(list, page, total, limit)
        });
    }

    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    getNoticeList(offset, limit) {
        const { boardType, no, page } = this.state;
        return API.cs.selectBoardList(boardType, null, offset, limit).then(response => {
            if (response.status === 200) {
                const data = response.data;
                const dataList = data.list || [];

                if (no && utils.isArray(dataList)) {
                    const isEqual = dataList.find(t => {
                        return t.no === no;
                    });

                    if (!isEqual) {
                        const ofs = offset + dataList.length;

                        if (data.total_cnt > ofs) {
                            return this.getNoticeList(ofs, limit);
                        }

                        this.state.no = null;
                        return this.getNoticeList((page > 0 ? page - 1 : 0) * this.state.limit, limit);
                    }

                    this.state.page = (offset / limit) + 1;
                }

                return {
                    list: dataList,
                    total: data.total_cnt || 0
                };
            }

            return null;
        }).catch(error => {
            if (error) {
                PopModal.alert(error.data || "오류가 발생했습니다.\n잠시 후 다시 시도해주세요");
            }
            return null;
        });
    }

    getNoticeDetail(no, boardType) {
        if (!this.state.isProgress) {
            this.onProgress(true);

            return API.cs.selectOneBoard(no, boardType).then(response => {
                this.onProgress(false);
                if (response.status === 200) {
                    const data = response.data;

                    return {
                        no,
                        title: data.title,
                        content: data.content,
                        reg_dt: data.reg_dt
                    };
                }

                return null;
            }).catch(error => {
                this.onProgress(false);
                if (error) {
                    PopModal.alert(error.data || "오류가 발생했습니다.\n잠시후 다시 시도해주세요.");
                }

                return null;
            });
        }

        return null;
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

    renderList(list, page, total, limit) {
        return (
            <div>
                <div className="layout__header">
                    <h2 className="board__page__title">
                        공지사항
                    </h2>
                </div>
                <div className="layout__body">
                    <div className="layout__body__main">
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
                                {this.itemLayout(list)}
                            </div>
                            <div className="board__notice__page">
                                <Pagelist page={page} totalCount={total} listCount={limit} pageCount="5" callBack={this.onPage} isJump />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.state.renderLayout;
    }
}

NoticePage.contextTypes = {
    router: routerShape
};

export default NoticePage;
