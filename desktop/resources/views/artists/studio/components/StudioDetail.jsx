import "../scss/studio_detail.scss";
import React, { Component, PropTypes } from "react";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";

import API from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import constant from "shared/constant";
import { STATUS_TYPE } from "shared/constant/crewstudio.const";
import PopModal from "shared/components/modal/PopModal";
import FTextarea from "shared/components/ui/input/FTextarea";

import ColumnHeader from "./ColumnHeader";
import CommentItem from "./CommentItem";

class StudioDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProgress: false,
            boardNo: props.boardNo,
            limit: 10,
            detail: null,
            commentMsg: "",
            commentList: [],
            totalCount: 0
        };

        this.onProgress = this.onProgress.bind(this);
        this.onConfirmPhone = this.onConfirmPhone.bind(this);
        this.getDetail = this.getDetail.bind(this);
        this.getComment = this.getComment.bind(this);
        this.setComment = this.setComment.bind(this);

        this.combineData = this.combineData.bind(this);
        this.combineComment = this.combineComment.bind(this);
        this.registerComment = this.registerComment.bind(this);
        this.goList = this.goList.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { boardNo } = this.state;
        this.getDetail(boardNo);
    }

    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    onConfirmPhone(crew_order_no) {
        this.onProgress(true);
        API.orders.updatePhoneConfirm(crew_order_no).then(response => {
            this.onProgress(false);
            this.setState(this.combineData({ ...this.state.detail, phone_confirm_dt: mewtime().format("YYYY-MM-DD HH:mm:ss") }));
        }).catch(error => {
            this.onProgress(false);
            if (error.data) {
                PopModal.alert(error.data);
            }
        });
    }

    getDetail() {
        const { boardNo } = this.state;
        if (!this.state.isProgress && boardNo) {
            this.onProgress(true);

            API.orders.findCrewByNo(boardNo).then(response => {
                this.onProgress(false);
                if (response.status === 200) {
                    const data = response.data;
                    const prop = this.combineData(data);

                    this.setState(prop);
                }
            }).catch(error => {
                this.onProgress(false);
                if (error) {
                    PopModal.alert(error.data || "오류가 발생했습니다.\n잠시후 다시 시도해주세요.", { callBack: () => history.back() });
                }
            });
        }

        return null;
    }

    getComment() {
        const { boardNo, commentList, limit } = this.state;

        API.orders.findCrewCommentsByNo(boardNo, commentList.length, limit)
            .then(response => {
                const data = response.data;
                const prop = this.combineComment(data);

                this.setState(prop);
            });
    }

    setComment(e, value) {
        this.state.commentMsg = value;
    }

    combineData(data) {
        let prop = {
            detail: {
                crew_order_no: data.crew_order_no || "",
                reg_dt: data.reg_dt || "",
                user_name: data.user_name || "",
                user_phone: data.user_phone || "",
                category: data.category || "",
                price: data.price || "",
                content: data.content,
                status: data.status || "",
                display_user_phone: data.display_user_phone || "N",
                phone_confirm_dt: data.phone_confirm_dt || "",
                attach: data.attach || []
            }
        };

        if (data.comment) {
            prop = Object.assign(prop, { ...this.combineComment(data.comment) });
        }

        return prop;
    }

    combineComment(comment) {
        const { commentList } = this.state;
        const merge = utils.mergeArrayTypeObject(commentList, comment.list, ["comment_no"], ["reg_dt"], true);

        return {
            commentList: merge.list || [],
            totalCount: Number(comment.total_cnt || 0)
        };
    }

    registerComment() {
        const { boardNo, commentMsg } = this.state;

        if (!commentMsg || !commentMsg.replace(/\s/gi, "")) {
            PopModal.alert("내용을 입력해주세요");
        } else if (!this.state.isProgress) {
            this.onProgress(true);
            API.orders.insertCrewComment(boardNo, { comment: commentMsg })
                .then(response => {
                    this.onProgress(false);
                    if (response.status === 200) {
                        const data = response.data;
                        const prop = {
                            ...this.combineData(data),
                            commentMsg: ""
                        };

                        this.setState(prop);
                    }
                })
                .catch(error => {
                    this.onProgress(false);
                    PopModal.alert(error.data ? error.data : "진행상황 등록중 에러가 발생했습니다.");
                });
        }
    }

    goList() {
        if (this.props.routes) {
            this.context.router.push("/artists/studio");
        } else {
            document.location.href = "/artists/studio";
        }
    }

    render() {
        const { detail, commentList, commentMsg, totalCount } = this.state;

        if (!detail) {
            return null;
        }

        const {
            crew_order_no,
            user_name,
            user_phone,
            category,
            content,
            price,
            reg_dt,
            status,
            display_user_phone,
            phone_confirm_dt,
            attach
        } = detail;

        let regDt = "";
        let userPhone = "";

        if (reg_dt && typeof reg_dt === "string") {
            regDt = reg_dt.substr(0, 10);
        }

        if (display_user_phone === "N") {
            userPhone = "일정 확인 후 연락처가 공개 됩니다.";
        } else if (phone_confirm_dt) {
            if (user_phone && typeof user_phone === "string") {
                userPhone = `${user_phone.substr(0, 3)} ${user_phone.substr(3, 4)} ${user_phone.substr(7, 4)}`;
            }
        } else {
            userPhone = (
                <button key="confirm-phone" className="f__button" onClick={() => this.onConfirmPhone(crew_order_no)}>연락처 확인하기</button>
            );
        }

        const statusType = STATUS_TYPE[status] || null;

        const contentBlock = htmlToDraft(content);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);

        return (
            <div className="board__notice">
                <div className="board__notice__list studio__notice">
                    <ColumnHeader />
                    <div className="list__item show">
                        <div className="list__item__title">
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
                    <div className="list__item">
                        <div className="studio__attach">
                            <div className="title">
                                첨부파일
                            </div>
                            <div className="attach">
                                {utils.isArray(attach) ?
                                    attach.map((a, i) => {
                                        return (
                                            <div key={`crew-attach-${i}`}>
                                                <a href={`${__SERVER__.data}${a.path}`} download={a.file_name}>{a.file_name}</a>
                                            </div>
                                        );
                                    }) : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="list__item">
                        <div className="list__item__title studio__detail">
                            <div className="title">
                                고객 연락처
                            </div>
                            <div className="phone">
                                {userPhone}
                            </div>
                            <div className="caption">
                                주문 처리나 원할한 상담을 위해 고객님의 연락처를 공유해 드립니다.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="studio__comment">
                    <div className="studio__comment__title">
                        진행상황
                    </div>
                    <div className="studio__comment__input">
                        <div className="comment__message">
                            <FTextarea
                                value={commentMsg}
                                onChange={this.setComment}
                                inline={{
                                    placeholder: "고객님과의 진행상황을 남겨주세요."
                                }}
                            />
                        </div>
                        <div className="comment__send">
                            <button className="f__button f__button__theme__fill-black" onClick={this.registerComment}>등록</button>
                        </div>
                    </div>
                    {utils.isArray(commentList) ?
                        <div className="studio__comment__list">
                            {commentList.map(c => {
                                return <CommentItem key={`column-item-${c.comment_no}`} data={c} />;
                            })}
                            {commentList.length < totalCount ?
                                <div className="studio__comment__more">
                                    <button className="f__button f__button__block" onClick={this.getComment}>더보기
                                    </button>
                                </div> : null
                            }
                        </div> : null
                    }
                </div>
                <div className="studio__buttons">
                    <button className="f__button" onClick={this.goList}>목록보기</button>
                </div>
            </div>
        );
    }
}

StudioDetail.propTypes = {
    boardNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default StudioDetail;
