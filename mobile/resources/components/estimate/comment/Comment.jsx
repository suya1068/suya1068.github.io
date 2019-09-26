import "./comment.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "mobile/resources/management/redirect";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import Pagination from "mobile/resources/components/estimate/pagination/Pagination";
// import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";
import classnames from "classnames";

export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser(),
            comment: "",
            reply_comment: "",
            orderNo: props.orderNo,
            isComplete: props.status === "COMPLETE",
            list: [],
            limit: 10,
            offset: 0,
            page: 1,
            total: 0,
            showActive: false
        };
        this.sendComment = this.sendComment.bind(this);
        this.paging = this.paging.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.showReComment = this.showReComment.bind(this);
        this.closeReplyComment = this.closeReplyComment.bind(this);
    }

    componentWillMount() {
        if (!this.state.user) {
            PopModal.alert("로그인 후 이용해 주세요.", { callBack: () => redirect.main() });
        }
    }

    componentDidMount() {
        this.getCommentList();
    }

    /**
     * 컴포넌트의 마운트 여부 체크 후 setState를 실행합니다.
     * @param data
     * @param callback
     */
    setData(data, callback) {
        if (this._calledComponentWillUnmount) {
            return;
        }

        this.setState(data, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    /**
     * 해당 의뢰서의 댓글 정보를 조회합니다.
     * @param offset
     */
    getCommentList(offset = 0) {
        const { limit, orderNo } = this.state;
        const request = API.orders.getCommentList(orderNo, { limit, offset });
        request.then(response => {
            const data = response.data;
            const list = data.list;
            this.state.total = response.data.total_cnt;
            this.setData({
                list
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 의뢰서의 댓글을 작성합니다.
     */
    sendComment() {
        return new Promise((resolve, reject) => {
            const { comment, orderNo } = this.state;
            const copy_comment = comment;

            if (comment === "") {
                PopModal.toast("댓글을 입력해 주세요.");
                reject({ result: false });
            } else {
                this.setState({ comment: "" });
                const request = API.orders.regComment(orderNo, { comment: copy_comment });
                request.then(response => {
                    if (response.status === 200) {
                        const data = response.data;
                        const list = data.comment.list;
                        // this.getCommentList();
                        this.setData({
                            page: 1,
                            list,
                            total: data.comment.total_cnt
                        }, () => {
                            resolve({ result: true });
                        });
                        reject({ result: false, response });
                    }
                }).catch(error => {
                    if (!(error instanceof Error)) {
                        PopModal.alert(error.data);
                    }
                    reject({ result: false, error });
                });
            }
        });
    }

    /**
     * 댓글의 대댓글을 작성합니다.
     * @param comment_no - Number (댓글 번호, group)
     */
    sendReplyComment(comment_no) {
        return new Promise((resolve, reject) => {
            const { reply_comment, orderNo, limit, page } = this.state;
            const copy_reply_comment = reply_comment;
            const replyData = {
                comment_no,
                reply_comment: copy_reply_comment
            };

            if (reply_comment === "") {
                PopModal.toast("댓글을 입력해 주세요.");
                reject({ result: false });
            } else {
                this.setState({ reply_comment: "" });
                const request = API.orders.regReplyComment(orderNo, { ...replyData });
                request.then(response => {
                    if (response.status === 200) {
                        this.setData({ reply_comment: "" }, () => {
                            this.getCommentList(limit * (page - 1));
                            resolve({ result: true });
                        });
                        reject({ result: false, response });
                    }
                }).catch(error => {
                    if (!(error instanceof Error)) {
                        PopModal.alert(error.data);
                    }
                    reject({ result: false, error });
                });
            }
        });
    }

    /**
     * 댓글달기 버튼 클릭 시 대댓글을 보여줍니다.
     * @param e - Event (대댓글의 영역을 찾기 위해 div 이벤트를 가져옵니다.)
     * @param no - Number (현재 댓글의 번호로 활성화 상태를 나타냅니다.)
     * @param count - Number (대댓글의 갯수가 없으면 클릭 이벤트를 발생시키지 않습니다.)
     */
    showReComment(e, no, count) {
        this.closeComments();
        const target = e.currentTarget.parentNode.parentNode.nextSibling;

        if (this.state.isComplete && count === "") {
            return;
        }

        if (this.state.showActive === no) {
            this.closeReplyComment();
            return;
        }

        // target.style.maxHeight = `${target.scrollHeight}px`;
        target.style.display = "block";

        this.setData({
            showActive: no
        });
    }

    /**
     * 열려있는 대댓글의 영역을 닫습니다.
     */
    closeReplyComment(isBlock = "", type = "comment") {
        if (type === "comment" && isBlock) {
            PopModal.alert("계정블럭 상태로 댓글입력이 불가합니다.");
        } else {
            this.closeComments();
            this.setData({
                showActive: false
            });
        }
    }


    /**
     * 대댓글의 영역이 홝성화 되어있을 때 댓글 input 창에 포커스가 있거나,
     * 페이지 이동시 활성화된 영역을 숨깁니다.
     */
    closeComments() {
        const replys = document.getElementsByClassName("reply-area");
        for (let i = 0, max = replys.length; i < max; i += 1) {
            replys[i].style.display = "none";
            // replys[i].style.maxHeight = null;
        }
    }

    /**
     * 댓글 unit을 그립니다
     * @param obj - Object (댓글 데이터)
     * @param idx - div의 키값
     * @returns {XML}
     */
    drawCommentUnit(obj, idx) {
        const isBlock = this.props.isBlock;
        const reply = obj.reply;
        let count = "";
        let checkMsg = "답글달기";
        if (obj.reply_cnt > 0) {
            count = obj.reply_cnt;
        }

        if (this.state.isComplete || this.props.isBlock) {
            checkMsg = "답글확인";
        }
        return (
            <div className="comment__panel" key={`estimate__comment__${idx}`}>
                <div className="comment__panel__wrap">
                    <div className="comment__panel__wrap__name">
                        <p>{obj.name ? obj.name : "작가"}</p>
                    </div>
                    <div className="comment__panel__wrap__comment">
                        <p>{utils.linebreak(obj.comment)}</p>
                    </div>
                    <div className="comment__panel__wrap__regdt">
                        <p>{obj.reg_dt}</p>
                    </div>
                    <div className={classnames("comment__panel__wrap__reply-btn", { "active": obj.no === this.state.showActive })}>
                        <button
                            className="button button__default"
                            onClick={e => this.showReComment(e, obj.no, count)}
                        >
                            {`${checkMsg} ${count}`}
                        </button>
                    </div>
                </div>
                {this.replyContent(reply, obj.no)}
            </div>
        );
    }

    /**
     * 댓글들을 그립니다.
     * 만약 구매가 완료되었다면 input 영역을 제거하고
     * 댓글달기 버튼을 댓글확인하기로 텍스트를 변경합니다.
     * @param list - Array (댓글 목록)
     * @returns {XML}
     */
    drawComment(list) {
        const { comment, total, limit, page, isComplete, user } = this.state;
        const { isBlock } = this.props;
        const commentContent = [];
        let isCompleteForPlaceHorderText = "개인정보 노출 시 서비스 이용에 제한이 있을 수 있습니다.";
        if (user.data.is_artist) {
            isCompleteForPlaceHorderText = "연락처 및 가격노출 시 서비스 이용에 불이익을 받을 수 있습니다.";
        }
        let isCompleteForDisabled = "";
        if (isComplete) {
            isCompleteForPlaceHorderText = "";
            isCompleteForDisabled = "disabled";
        }
        if (Array.isArray(list) && list.length > 0) {
            commentContent.push(
                list.map((obj, idx) => {
                    return this.drawCommentUnit(obj, idx);
                })
            );
        }
        // else {
            // let subCaption = "댓글 입력시 요청서를 열람하는 모든 작가님들께 노출됩니다.";
            // if (user.data.is_artist) {
            //     subCaption = "요청 내용 중 궁금한 점을 남겨주세요.";
            // }
            // const props = {
            //     mainCaption: "아직 댓글이 없어요",
            //     subCaption,
            //     src: "/mobile/imges/f_img_bg_04.png",
            //     noneKey: "estimate-comment"
            // };
            // commentContent.push(
            //     <NoneList {...props} key="estimate__comment" />
            // );
        // }

        return (
            <div className="estimate-content__comment" id="bookmark">
                <div className="estimate-content__comment--head">
                    {!this.state.isComplete ?
                        <div className="outer">
                            <div
                                className="input-comment"
                            //    style={{ borderBottom: user.data.is_artist ? "" : "1px solid #e1e1e1" }}
                            >
                                <textarea
                                    className="textarea"
                                    placeholder={isCompleteForPlaceHorderText}
                                    disabled={isCompleteForDisabled}
                                    value={comment}
                                    onFocus={() => this.closeReplyComment(isBlock, "comment")}
                                    onChange={e => this.setData({ comment: e.currentTarget.value })}
                                    rows="2"
                                />
                                <button className="button" onClick={this.sendComment}>확인</button>
                            </div>
                            {user.data.is_artist ?
                                <div className="alert-text" style={{ "borderBottom": list.length > 0 ? "1px solid #e1e1e1" : "" }}>
                                    <p>촬영 요청은 해당 카테고리의 모든 작가님들께 공개되며 촬영제안과 가격은 견적서를 작성하면 고객님께 전달됩니다.</p>
                                    <p>댓글로는 촬영요청에 대한 단순 문의만 가능하며 질문내용과 답변은 모든 작가님들께 공개됩니다.</p>
                                </div> : null
                            }
                        </div> : null
                    }
                </div>
                {commentContent}
                {total > 0 ?
                    <div className="estimate-comment-pagination">
                        <Pagination
                            page={page}
                            total={total}
                            limit={limit}
                            query={movePage => this.paging(movePage)}
                        />
                    </div> : null
                }
            </div>
        );
    }

    /**
     * 댓글의 페이징입니다.
     * 페이징 이동 시 댓글 입력창으로 스크롤을 이동시킵니다. - 개선필요.
     * @param page - Number (페이지)
     */
    paging(page) {
        this.closeComments();
        // 스크롤 이동... 추후에 개선해보기.
        let scrollY = 110;
        const scrollTop = document.getElementsByClassName("estimate-content__comment")[0];
        scrollTop.scrollIntoView(true);
        if (!utils.agent.isMobile()) {
            scrollY = 150;
        }
        window.scrollTo(0, window.pageYOffset - scrollY);

        const { limit } = this.state;
        let offset = this.state.offset;
        this.setData({ page: page.page });
        const calcPage = () => {
            offset = limit * (page.page - 1);
            return offset;
        };
        this.getCommentList(calcPage());
    }

    /**
     * 댓글이 활성화 되어있다면 true을 뱐환합니다.
     * @returns {boolean}
     */
    // isActive() {
    //     const showActive = this.state.showActive;
    //     return showActive;
    // }

    replyContent(reply, no) {
        const { isComplete, isBlock, user } = this.state;
        const replyContnet = [];
        let isCompleteForPlaceHorderText = "개인정보 노출 시 서비스 이용에 제한이 있을 수 있습니다.";
        if (user.data.is_artist) {
            isCompleteForPlaceHorderText = "연락처 및 가격노출 시 서비스 이용에 불이익을 받을 수 있습니다.";
        }
        // let isCompleteForPlaceHorderText = "개인정보 노출 시 서비스 이용에 제한이 있을 수 있습니다.";
        let isCompleteForDisabled = "";
        if (isComplete) {
            // isCompleteForPlaceHorderText = "구매가 완료되었습니다.";
            isCompleteForDisabled = "disabled";
        }
        if (reply) {
            replyContnet.push(
                <div className="test" key={`reply_${no}`}>
                    {reply.map((obj, idx) => {
                        return (
                            <div className="comment__panel__reply-content" key={`reply__${obj.reply_no}`}>
                                <p>┗</p>
                                <div>
                                    <div className="reply__panel__name">
                                        <p>{obj.reply_name ? obj.reply_name : "작가"}</p>
                                    </div>
                                    <div className="reply__panel__comment">
                                        <p>{utils.linebreak(obj.reply_comment)}</p>
                                    </div>
                                    <div className="reply__panel__regdt">
                                        <p>{obj.reply_reg_dt}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            replyContnet.push(
                <div key="none-recomment" />
            );
        }

        return (
            <div className={classnames("reply-area" /*, { "active": no === this.isActive(no) }*/)}>
                {replyContnet}
                {!this.state.isComplete && !this.props.isBlock ? <div className="comment__panel__reply-input">
                    <p>┗</p>
                    <div className="input-comment">
                        <textarea
                            className="textarea"
                            placeholder={isCompleteForPlaceHorderText}
                            disabled={isCompleteForDisabled}
                            value={this.state.reply_comment}
                            onChange={e => this.setData({ reply_comment: e.currentTarget.value })}
                            rows="2"
                        />
                        <button className="button reply" onClick={() => this.sendReplyComment(no)}>확인</button>
                    </div>
                </div> : null
                }
                <div className="comment__panel__reply-close" onClick={() => this.closeReplyComment(isBlock, "reply")}>
                    <p>답글접기<i className="m-icon m-icon-up" /></p>
                </div>
            </div>
        );
    }

    render() {
        const list = this.state.list;
        return this.drawComment(list);
    }
}
