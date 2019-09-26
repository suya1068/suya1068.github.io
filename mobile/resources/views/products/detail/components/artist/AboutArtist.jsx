import "./aboutArtist.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import classNames from "classnames";
import MoreBtn from "../../business/component/more/MoreBtn";
// import Stickyfill from "stickyfilljs";

export default class AboutArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCorp: props.isCorp,
            nickName: props.nickName,
            detailHeight: 0,
            isMore: false,
            isShowBtn: false
        };
        this.onMore = this.onMore.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollToEstimate = this.onScrollToEstimate.bind(this);
    }

    componentWillMount() {
        window.addEventListener("scroll", this.onScroll);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.refDetailContent) {
                let height = this.refDetailContent.offsetHeight + 20;
                let isMore = this.state.isMore;

                if (height > 158) {
                    height = 158;
                    isMore = true;
                }

                this.setState({
                    detailHeight: height,
                    isMore
                });
            }
        }, 400);
    }

    onScroll(e) {
        // const target = document.querySelector("#virtual_estimate");
        // const targetBound = target.getBoundingClientRect();
        //
        // if (targetBound.bottom < (60 + 50 + 60)) {
        //     this.setState({ isShowBtn: true });
        // } else {
        //     this.setState({ isShowBtn: false });
        // }
    }

    onScrollToEstimate(e) {
        this.gaEvent("유료_하단견적_문의");
        const target = document.querySelector("#virtual_estimate");
        const targetBound = target.getBoundingClientRect();
        // console.log(targetBound);

        scrollBy(0, targetBound.top - 50);
    }

    /**
     * ga이벤트 전달
     * @param action
     */
    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    onMore() {
        const { detailHeight } = this.state;

        if (this.refDetailContent) {
            let height = this.refDetailContent.offsetHeight + 20;

            if (detailHeight > 158) {
                height = 158;
            }

            this.setState({
                detailHeight: height,
                isMore: false
            });
        }
    }

    /**
     * 상담하기 이벤트 전달
     * @param access_type
     */
    onConsult(access_type) {
        this.gaEvent("유료_작가문의");
        if (typeof this.props.onConsult === "function") {
            // access_type === "detail_artist" // 상세_작가문의
            this.props.onConsult(access_type);
        }
    }

    render() {
        const { isCorp, profile, nickName, region, intro } = this.props;
        const { detailHeight, isMore, isShowBtn } = this.state;

        return (
            <div className="about-artist">
                <h3 className="sr-only">작가소개</h3>
                <div className="about-artist__inner">
                    <div className="about-artist__content">
                        <div className="about-artist__content__inner">
                            <div className="about-artist__content__profile">
                                <p className="about-artist__iscorp">{isCorp === "Y" ? "세금계산서가능" : ""}</p>
                                <div className="artist__profile">
                                    <Img image={{ src: profile, content_width: 90, content_height: 90 }} />
                                </div>
                                <p className="photographer">photographer</p>
                                <p className="artist__nickname">{nickName}</p>
                            </div>
                            <div className="about-artist__content__region">
                                <p className="region-title">촬영가능지역</p>
                                <p className="regions">{Array.isArray(region) && region.length > 0 ? region.join(", ") : "촬영가능지역이 설정되어있지 않습니다."}</p>
                            </div>
                            <div
                                className="about-artist__content__comment"
                                style={{ overflow: "hidden", height: `${detailHeight}px`, transition: "height 0.2s" }}
                            >
                                <div ref={ref => (this.refDetailContent = ref)}>
                                    <p className="comment">{intro ? utils.linebreak(intro) : ""}</p>
                                </div>
                            </div>
                            {isMore &&
                                <MoreBtn title="작가소개 더보기" onMore={this.onMore} />
                            }
                        </div>
                    </div>
                </div>
                <div className="fixed-bottom-btn-box">
                    <div className="move-btn" style={{ backgroundColor: "#000" }} onClick={() => this.onConsult("detail_artist")}>
                        <button>작가에게 무료상담</button>
                    </div>
                    <div className="move-btn" style={{ backgroundColor: "#f5a623" }} onClick={this.onScrollToEstimate}>
                        <button>견적계산하기</button>
                    </div>
                </div>
            </div>
        );
    }
}
