import "./statusComplete.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import utils from "forsnap-utils";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import Heart from "desktop/resources/components/form/Heart";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import update from "immutability-helper";
import ImageSliderTest from "desktop/resources/components/image/ImageSliderTest";
import Checkbox from "desktop/resources/components/form/Checkbox";
import Icon from "desktop/resources/components/icon/Icon";

class StatusComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentData: {
                buy_no: 0,
                comment: "",
                kind: 0,
                quality: 0,
                service: 0,
                price: 0,
                talk: 0,
                trust: 0,
                photo_no: ""
            },
            customLoad: {
                list: [],
                offset: 0,
                isMore: true
            },
            limit: 50,
            userType: "U",
            checkedNumber: [],
            commentLength: 0,
            isLoading: false,
            is_agree: false,
            onShowAgreeContent: false
        };

        // 사진 원본 및 보정 목록 불러오기
        this.apiReservePhotosCustom = this.apiReservePhotosCustom.bind(this);
        this.checkImage = this.checkImage.bind(this);
        this.regComments = this.regComments.bind(this);
        this.setComment = this.setComment.bind(this);
        this.setCommentData = this.setCommentData.bind(this);
        this.calculContentLength = this.calculContentLength.bind(this);
        this.onChangeAgree = this.onChangeAgree.bind(this);

        this.onShowAgreeContent = this.onShowAgreeContent.bind(this);
    }

    componentWillMount() {
        const customCount = this.props.customCount;
        if (customCount > 0) {
            this.apiReservePhotosCustom();
        }
        this.setState({
            commentData: update(this.state.commentData, { buy_no: { $set: this.props.buyNo } })
        });
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    setCommentData(key, count) {
        // kind, quality, service, price, talk, trust
        const commentData = this.state.commentData;
        commentData[key] = count;
        this.setState({
            commentData
        });
    }

    setComment(e) {
        const current = e.currentTarget;
        const value = current.value;

        // console.log(current);
        this.setState({
            commentData: update(this.state.commentData, { comment: { $set: value } })
        });
    }

    /**
     * 동의 여부를 변경한다.
     * @param agree
     */
    onChangeAgree(agree) {
        this.setState({ is_agree: agree });
    }

    /**
     * API 보정요청 목록
     */
    apiReservePhotosCustom() {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const userType = this.state.userType;
        const offset = this.state.customLoad.offset;
        const limit = this.state.limit;

        const request = API.reservations.reservePhotosCustom(buyNo, productNo, userType, offset, limit);
        request.then(response => {
            // console.log(response);
            const data = response.data;
            const dataList = data.list;
            const length = dataList.length;

            const obj = utils.mergeArrayTypeObject(this.state.customLoad.list, dataList, ["origin_no"], ["origin_no"], true);
            this.state.customLoad.offset = offset + obj.count;
            this.state.customLoad.isMore = !(length < limit);

            this.setState({
                customLoad: update(this.state.customLoad, { list: { $push: obj.list } })
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    validationCheck() {
        const data = this.state.commentData;
        let msg = "";
        if (data.comment === "") {
            msg = "후기내용을 적어주세요.";
        } else if (data.comment.trim().length < 10) {
            PopModal.toast("후기를 10자 이상 적어주세요.");
        } else if (data.kind === 0) {
            msg = "친절 점수를 입력해주세요.";
        } else if (data.quality === 0) {
            msg = "품질 점수를 입력해주세요.";
        } else if (data.service === 0) {
            msg = "서비스 점수를 입력해주세요.";
        } else if (data.price === 0) {
            msg = "가격 점수를 입력해주세요.";
        } else if (data.talk === 0) {
            msg = "소통 점수를 입력해주세요.";
        } else if (data.trust === 0) {
            msg = "신뢰 점수를 입력해주세요.";
        } else {
            return true;
        }

        if (msg !== "") {
            PopModal.toast(msg);
        }

        return false;
    }

    /**
     * 후기 등록
     * 등록 후 완료 테이블로 이동
     */
    regComments() {
        const { isLoading, is_agree } = this.state;
        const is_valid = this.validationCheck();
        if (isLoading) {
            return;
        }

        if (is_valid) {
            if (!is_agree) {
                PopModal.alert("후기 이용에 동의하셔야 등록 가능합니다.");
                return;
            }
            const checkList = this.state.checkedNumber;
            const productNo = this.props.productNo;
            const offerNo = this.props.offerNo;
            const reserveType = this.props.reserveType;
            const customNumbers = checkList.join(",");

            this.setState({
                commentData: update(this.state.commentData, { photo_no: { $set: customNumbers } })
            }, () => {
                // console.log(this.state.commentData);
                this.setState({ isLoading: true });

                let request;
                if (reserveType === "OFFER") {
                    request = API.offers.comments(offerNo, this.state.commentData);
                } else {
                    request = API.products.productRegistComment(productNo, this.state.commentData);
                }

                request.then(response => {
                    if (response.status === 200) {
                        PopModal.toast("후기가 등록되었습니다. 감사합니다.");
                        this.setState({
                            isLoading: false
                        }, () => {
                            if (typeof this.props.closeFunc === "function") {
                                this.props.closeFunc();
                            }
                        });
                    }
                    // this.setState({ isLoading: false });
                }).catch(error => {
                    PopModal.toast(error.data);
                    this.setState({ isLoading: false });
                });
            });
        }
    }

    /**
     * 상품내용 글자수 처리
     * @param e
     */
    calculContentLength(e) {
        const current = e.currentTarget;
        const value = e.target.value;
        const maxLength = current.getAttribute("maxLength");

        if (value.length < maxLength + 1) {
            this.setState({
                commentData: update(this.state.commentData, { comment: { $set: value } }),
                commentLength: value.length
            });
        }
    }

    checkImage(checked, obj) {
        const checkList = this.state.checkedNumber;
        const custom_no = obj.custom_no;
        let option = "";

        if (checked) {
            option = { $push: [custom_no] };
        } else {
            const index = checkList.indexOf(custom_no);
            option = { $splice: [[index, 1]] };
        }

        this.setState({
            checkedNumber: update(this.state.checkedNumber, option)
        });
    }

    /**
     * 후기이용동의 자세히보기 상태값을 저장한다
     * @param flag
     */
    onShowAgreeContent(flag) {
        this.setState({ onShowAgreeContent: flag }, () => { this.onShow(flag); });
    }

    /**
     * 자세히 보기 상태값에 따라 css를 변경한다.
     * @param flag
     */
    onShow(flag) {
        const target = this.agreeContent;
        const icon = this.iconNode.children[0];
        if (flag) {
            target.style.height = target.scrollHeight ? `${target.scrollHeight + 5}px` : "45px";
            target.style.marginBottom = "20px";
            icon.style.transform = "rotate(180deg)";
            target.style.transition = "all 0.4s ease";
        } else {
            target.style.height = "0";
            target.style.marginBottom = "0";
            icon.style.transform = "rotate(0deg)";
        }
    }

    render() {
        const { is_agree, onShowAgreeContent } = this.state;
        const checkList = this.state.checkedNumber;
        const list = this.state.customLoad.list;
        let textChange = "상품에 대한 후기를 등록해 주세요.";
        const content = [];

        if (utils.isArray(list) && list.length) {
            textChange = "마음에 드는 사진과 후기를 등록해 주세요.";
            content.push(
                <div className="complete__sharePhoto" key="completeRender">
                    <ImageSliderTest images={list} type="comment">
                        {
                            list.map((obj, idx) => {
                                const checked = checkList.indexOf(obj.custom_no);
                                return (
                                    <ImageCheck
                                        image={{ src: `/${obj.custom_thumb_key}`, type: "private" }}
                                        checked={(checked !== -1)}
                                        size="small"
                                        resultFunc={chk => this.checkImage(chk, obj)}
                                        key={`commentPhoto${idx}`}
                                        type="desk"
                                    />
                                );
                            })
                        }
                    </ImageSliderTest>
                </div>
            );
        } else {
            content.push(<div key="completeRender-origin" />);
        }


        return (
            <div className="complete" key="completePage">
                <section className="complete_layout">
                    <div className="progress-title">
                        <h3 className="h4-sub">당신의 후기를 추가해 주세요.</h3>
                        <p className="h5-caption text-normal">{textChange}</p>
                    </div>
                    {content}
                    <div className="complete__comment">
                        <textarea className="comment-textarea" maxLength="1000" onChange={this.calculContentLength} value={this.state.commentData.comment} placeholder={textChange} />
                        <p className="text-count">{this.state.commentLength}/1000</p>
                    </div>
                    <div className="complete__summary">
                        <div className="summary-circle pull-left">
                            <p>요약</p>
                        </div>
                        <div className="summary-table">
                            <table className="com-table">
                                <tbody>
                                <tr>
                                    <td>친절</td>
                                    <td><Heart count={this.state.commentData.kind} resultFunc={e => this.setCommentData("kind", e)} /></td>
                                    <td>품질</td>
                                    <td><Heart count={this.state.commentData.quality} resultFunc={e => this.setCommentData("quality", e)} /></td>
                                    <td>서비스</td>
                                    <td><Heart count={this.state.commentData.service} resultFunc={e => this.setCommentData("service", e)} /></td>
                                </tr>
                                <tr>
                                    <td>가격</td>
                                    <td><Heart count={this.state.commentData.price} resultFunc={e => this.setCommentData("price", e)} /></td>
                                    <td>소통</td>
                                    <td><Heart count={this.state.commentData.talk} resultFunc={e => this.setCommentData("talk", e)} /></td>
                                    <td>신뢰</td>
                                    <td><Heart count={this.state.commentData.trust} resultFunc={e => this.setCommentData("trust", e)} /></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="columns col-12">
                            <div className="regist-review-agree">
                                <div className="regist-review-agree-row">
                                    <div className="static-box">
                                        <h6 className="regist-review-agree-heading">후기 이용 동의</h6>
                                        <span ref={node => { this.iconNode = node; }} onClick={() => this.onShowAgreeContent(!onShowAgreeContent)}>
                                             자세히보기
                                            <Icon name="dt" />
                                        </span>
                                    </div>
                                    <Checkbox
                                        type="yellow_circle"
                                        chekced={is_agree}
                                        resultFunc={this.onChangeAgree}
                                    >동의합니다.</Checkbox>
                                </div>
                                <div className="regist-review-agree-content" ref={node => { this.agreeContent = node; }}>
                                    <p>등록된 후기는 포스냅 SNS에 광고용으로 게시될 수 있습니다.</p>
                                    <p>내용이 운영방침에 어긋나는 경우 삭제되거나 수정될 수 있습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="complete__checkBtn">
                        <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.regComments() }}>확인</Buttons>
                    </div>
                </section>
            </div>
        );
    }
}

export default StatusComplete;
