import "./panel.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import Img from "shared/components/image/Img";

export default class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.data,
            userType: props.userType,
            isBlock: props.isBlock,
            tab: props.tab,
            receiveStatus: props.receiveStatus,
            onExposure: props.onExposure,
            orderDisplay: props.data.stop_dt && props.data.stop_dt === null,
            is_show: false,
            is_show_click: false,
            is_mobile: utils.agent.isMobile()
        };
        this.onShow = this.onShow.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onShowClick = this.onShowClick.bind(this);
    }

    /**
     * ==
     * @param data
     * @param type
     */
    onClick(data, type = "") {
        if (typeof this.props.receiveStatus === "function") {
            this.props.receiveStatus(data, type);
        }
    }

    /**
     * 노출 / 비노출 선택 기능
     * @param data
     */
    onExposure(data) {
        if (typeof this.props.onExposure === "function") {
            this.props.onExposure(data);
        }
    }

    /**
     * 촬영요청서 상태 코드를 대응 문자로 변경합니다.
     * @param status
     * @returns {*}
     */
    getStatusFromData(status) {
        switch (status) {
            case "BASIC": case "OPTIONS": case "CONTENT": case "CATEGORY": case "QUANTITY": return "작성중";
            case "REQUEST": return "진행중";
            case "PROGRESS": return "진행중";
            case "COMPLETE": return "마감";
            default: return status;
        }
    }

    /**
     * 유저타입 : 고객 일 시 촬영요청서 상태코드별 대응 문자열로 변경합니다.
     * @param status
     * @returns {*}
     */
    getButtonTextFromStatus(status) {
        switch (status) {
            case "BASIC": return "촬영유형 작성중";
            case "CATEGORY": return "세부사항 작성중";
            // case "QUANTITY": return "요청사항 작성중";
            case "CONTENT": return "입력정보 확인중";
            case "OPTIONS": return "옵션 작성중";
            case "REQUEST": case "PROGRESS": case "COMPLETE":
                return "견적서리스트 보기";
            default: return status;
        }
    }

    /**
     * 유저타입 : 작가 일 시 견적서 상태코드별 대응 문자열로 변경합니다.
     * @param status
     * @returns {*}
     */
    getButtonTextFromOffer(status) {
        switch (status) {
            case "BASIC": return "세부사항 작성중";
            case "QUANTITY": return "견적정보 작성중";
            case "OPTION": return "촬영 설명 작성중";
            case "CONTENT": return "입력정보 확인중";
            case "REQUEST": case "PROGRESS": case "COMPLETE":
                return "나의 견적서";
            case "CATEGORY": return "촬영유형 작성중";
            default: return status;
        }
    }

    /**
     * 등록일 포맷을 변경합니다.
     * @param dt
     * @param type
     * @returns {*}
     */
    modifyRegDate(dt, type) {
        const reg_dt = dt.substr(0, 10);
        if (type === "estimate") {
            return reg_dt;
        } else if (type === "offer") {
            return reg_dt.split("-").join("/");
        }
        return null;
    }

    /**
     * 패널 정보를
     * @param data
     * @returns {*}
     */
    drawPanelBody(data) {
        const { type } = this.props;
        let content = data.content;
        if (content === "" && data.category && (data.status === "REQUEST" || data.status === "COMPLETE")) {
            content = `${utils.format.categoryCodeToName(data.category)} 촬영요청입니다.`;
        }

        if (type === "estimate") {
            return (
                <div className="panel__body estimate">
                    <div className="estimate--text" onClick={() => this.onClick(data, "content")}>
                        <p>{utils.linebreak(content)}</p>
                    </div>
                </div>
            );
        } else if (type === "offer") {
            return (
                <div className="panel__body offer">
                    <div className="offer--info">
                        <div className="offer--info__profile">
                            <Img image={{ src: data.profile_img, content_width: 90, content_height: 90 }} />
                        </div>
                        <div className="offer--info__text">
                            <p className="nick_name">{data.nick_name}</p>
                            <p className="content">{utils.linebreak(data.content)}</p>
                        </div>
                    </div>
                    <div className="offer--etc">
                        <p className="regdt">{`작성일자: ${this.modifyRegDate(data.reg_dt, type)}`}</p>
                        <p className="price">{data.price ? utils.format.price(data.price) : 0}원</p>
                    </div>
                </div>
            );
        }
        return false;
    }

    drawPanelFooter(data) {
        if (this.props.userType === "U") {
            return this.drawPanelFooterUser(data);
        }
        return this.drawPanelFooterArtist(data);
    }

    drawPanelFooterUser(data) {
        const { type, tab } = this.props;
        const propData = this.props.data;
        const offerCnt = data.offer_cnt ? data.offer_cnt : "";
        let isExposureText = "요청서 비노출 중";                      // 요청서 노출 || 비노출 버튼 텍스트
        let isExposureButtonStyle = "button__theme__full__pink";      // 요청서 노출 || 비노출 버튼 스타일
        let isExposureFlag = false;                                   // 요청서 노출 || 비노출 버튼 노출 값
        let onClick = () => this.onExposure(data);

        let isAdviceText = "";
        const isAdviceButtonStyle = "button__theme__gray";
        const isAdvice = propData.advice !== null && propData.advice !== "CANCEL";

        if (!propData.stop_dt) {     // 요청서 노출 기준 값 - stop_dt의 값이 있으면 비노출, 값이 null 이면 노출
            isExposureText = "요청서 노출 중";
            isExposureButtonStyle = "button__theme__pink";
        }
        if (data.status === "REQUEST") {
            isExposureFlag = true;
        }

        if (isAdvice && propData.advice === "REQUEST") {
            isAdviceText = "상담 요청 중";
            onClick = null;
        } else if (isAdvice && propData.advice === "COMPLETE") {
            isAdviceText = "상담 완료";
            onClick = null;
        }

        return (
            <div className={classNames("footer-buttons", /*{ "is_exposure": isExposureFlag && tab !== "complete" }&*/)}>
                {type === "estimate" ?      // 촬영요청서
                    <div style={{ display: "table", width: "100%" }}>
                        <div className="offer-view-button">
                            <button
                                className="button button-block button__rect button__default"
                                //className={`button button-block button__rect ${buttonTheme}`}
                                onClick={() => this.onClick(data, "offerlist")}
                            >
                                {this.getButtonTextFromStatus(data.status)} {offerCnt > 0 && tab !== "complete" ? <span className="pink-text">[{offerCnt}]</span> : null}
                            </button>
                        </div>
                        {isExposureFlag && tab !== "complete" ?
                            <div className="exposure-button">
                                <button
                                    className={`button button-block button__rect ${isAdvice ? isAdviceButtonStyle : isExposureButtonStyle}`}
                                    //className={`button button-block button__rect ${buttonTheme}`}
                                    style={{ cursor: isAdvice ? "default" : "pointer" }}
                                    disabled={isAdvice ? "disabled" : ""}
                                    onClick={onClick}
                                >{isAdvice ? isAdviceText : isExposureText}
                                </button>
                            </div> : null
                        }
                    </div> :             // 견적서
                    <button
                        className="button button-block button__rect button__default"
                        //className={classNames("button button-block button__rect", [buttonTheme])}
                        onClick={() => this.onClick(data, "offerlist")}
                    ><span>견적서 자세히 보기</span></button>
                }
            </div>
        );
    }

    drawPanelFooterArtist(data) {
        const { isBlock } = this.props;

        return (
            <div className={classNames("footer-buttons", { "is_offer": data.offer_no && !isBlock })} /*style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px", paddingBottom: "0.7rem" }}*/>
                <div style={{ display: "table", width: "100%" }}>
                    <div className="estimate-button" /*style={{ float: "left", width: "50%", paddingLeft: "15px", paddingRight: "15px" }}*/>
                        <button
                            className="button button-block button__rect button__default estimate"
                            onClick={() => this.onClick(data)}
                        >상세내용 보기</button>
                    </div>
                    { data.offer_no && !isBlock
                        ? (
                            <div className="offer-button"/* style={{ float: "left", width: "50%", paddingLeft: "15px", paddingRight: "15px" }}*/>
                                <button
                                    className="button button-block button__rect button__theme__pink offer"
                                    onClick={() => this.onClick(data, "offer")}
                                >
                                    {this.getButtonTextFromOffer(data.offer_status)}
                                </button>
                            </div>
                        )
                        : null
                    }
                </div>
            </div>
        );
    }

    onShow(e) {
        if (!this.state.is_mobile) {
            this.setState({ is_show: true });
        }
    }

    onLeave(e) {
        if (!this.state.is_mobile) {
            this.setState({ is_show: false });
        }
    }

    onShowClick(e) {
        const { is_show_click, is_show } = this.state;
        this.setState({ is_show_click: !is_show_click });
    }

    render() {
        const { data, type } = this.props;
        const { is_show, is_show_click } = this.state;
        const is_type_estimate = type === "estimate";
        return (
            <div className={classNames("panel-component panel")}>
                <div className="panel__head" style={{ position: "relative" }}>
                    <div className="panel__head_left">
                        <p className="panel__head--category">
                            {is_type_estimate ? utils.format.categoryCodeToName(data.category) : "신청작가"}
                            <span className="panel__head--state">
                                {is_type_estimate ? `[${this.getStatusFromData(data.status)}]` : ""}
                            </span>
                        </p>
                    </div>
                    <div className="panel__head_right">
                        {
                            is_type_estimate && data.open_type === "private" &&
                                <div
                                    onMouseEnter={this.onShow}
                                    onMouseLeave={this.onLeave}
                                    onClick={this.onShowClick}
                                >
                                    지정작가
                                    <span className="exclamation">!</span>
                                </div>
                        }
                    </div>
                    {(is_show || is_show_click) &&
                        <div className="show_info">
                            <div className="diamond" />
                            일부작가님에게만 노출됩니다.
                        </div>
                    }
                </div>
                {this.drawPanelBody(data)}
                <div className="panel__foot">
                    {this.drawPanelFooter(data)}
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    tab: PropTypes.string,
    receiveStatus: PropTypes.func.isRequired,
    type: PropTypes.oneOf(["estimate", "offer"]).isRequired,
    isBlock: PropTypes.string,
    userType: PropTypes.string
};

Panel.defaultProps = {
    userType: "U",
    percent: "",
    tab: "",
    isBlock: "",
    onExposure: null
};
