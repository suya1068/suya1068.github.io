import "./detail.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import PhotoViewerM from "mobile/resources/components/photoViewer/PhotoViewerM_swiper";
import PortfolioList from "./PortfolioList";

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offerData: props.offerData,
            orderData: props.orderData,
            portfolio: props.portfolio,
            outside: props.outside || false,
            reserve: this.setReserveData(props.orderData),
            accordData: [],
            percent: 0,
            activeIndex: 1,
            isMount: !this._calledComponentWillUnmount,
            isMobile: utils.agent.isMobile()
        };

        this.initAccordData = this.initAccordData.bind(this);
        this.sliderResize = this.sliderResize.bind(this);
    }

    componentWillMount() {
        this.getState();
        window.addEventListener("resize", this.sliderResize);
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        const { isMobile, offerData } = this.state;
        if (isMobile) {
            const scrollTopButton = document.querySelector(".scroll-top");
            if (scrollTopButton) {
                scrollTopButton.style.display = "none";
            }
        }
        this.swiperSetting();
        this.sliderResize();
        this.gaEventTrackForOfferPFview(offerData.order_no, offerData.no);
    }

    componentWillUnmount() {
        if (utils.agent.isMobile()) {
            const scrollTopButton = document.querySelector(".scroll-top");
            if (scrollTopButton) {
                scrollTopButton.style.display = "flex";
            }
        }
        window.removeEventListener("resize", this.sliderResize);
    }

    onError(e) {
        const isMobile = utils.agent.isMobile();
        let url = "/common/forsnap_bg_default.jpg";

        if (isMobile) {
            url = "/mobile/common/forsnap_bg_default.jpg";
        }
        e.target.src = `${__SERVER__.img}${url}`;
    }

    /**
     * 첨부파일 전체 화면을 닫는다.
     */
    onCloseFullSlide() {
        PopModal.close();
    }

    /**
     * 첨부사진을 풀슬라이드로 띄운다.
     * @param attachImageData
     */
    onShowAttachImg(attachImageData) {
        const popName = "attachImage-slider";
        PopModal.createModal(popName,
            <PhotoViewerM
                images={attachImageData.images}
                total_cnt={attachImageData.total_cnt}
                data="none"
                activeIndex={this.state.activeIndex}
                onClose={this.onCloseFullSlide}
                //onChangeIndex={idx => this.onMoveSlide(idx)}
            />
        );
        PopModal.show(popName);
    }

    /**
     * 예약 정보를 반환한다.
     * @param data
     * @returns {{CATEGORY: *}}
     */
    setReserveData(data) {
        return {
            CATEGORY: data.category
        };
    }

    /**
     * 예약정보를 가져온다.
     */
    getState() {
        const { offerData, orderData } = this.state;
        const accordData = this.initAccordData(offerData);
        const prop = {
            accordData
        };

        this.setState(prop);
    }

    /**
     *  AttachImage 의 주소만을 가져온다.
     **/
    getPhotosSrc(photos) {
        if (photos.length > 0) {
            const photo = photos.reduce((result, src) => {
                if (src) {
                    result.push({ src: src.photo });
                }
                return result;
            }, []);
            return photo;
        }
        return null;
    }

    /**
     * 첨부사진의 화면 비율을 고정한다.
     **/
    sliderResize() {
        const slider = this.slider;

        if (slider) {
            const offerDetail = this.offer;
            const rs = utils.resize(4, 3, offerDetail.offsetWidth, 0, true);

            slider.style.width = `${rs.width}px`;
            slider.style.height = `${rs.height}px`;
        }
    }

    /**
     * 첨부파일 스와이핑 기능을 설정한다.
     */
    swiperSetting() {
        this.offerDetail = new Swiper(".swiper-offerDetail", {
            nextButton: ".slider-arrow-right",
            prevButton: ".slider-arrow-left",
            paginationClickable: true,
            slidesPerView: 1,
            speed: 200,
            onSlideNextStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;
                this.setState({
                    activeIndex
                });
            },
            onSlidePrevStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;
                this.setState({
                    activeIndex
                });
            }
        });
    }

    /**
     * 견적서 화면이 노출될 때 ga이벤트를 발송한다.
     * @param order_no
     * @param no
     */
    gaEventTrackForOfferPFview(order_no, no) {
        const { userType, read_dt } = this.props;
        if (userType === "U" && !read_dt) {
            const eCategory = "견적서자세히보기";
            const eAction = "";
            const eLabel = `order_no: ${order_no}, offer_no: ${no}`;
            utils.ad.gaEvent(eCategory, eAction, eLabel);
        }
    }

    /**
     *
     * @param data
     * @returns {Array}
     */
    initAccordData(data) {
        const accordData = [];
        accordData.push(data.category);
        return accordData;
    }

    /**
     * 작가소개페이지로 이동
     * @param nick
     */
    moveArtistIntroPage(nick) {
        location.href = `/@${nick}`;
    }

    /**
     * 견적서를 그린다.
     * @param data
     * @returns {Array}
     */
    drawOffer(data) {
        const { portfolio, outside, offerData } = this.props;
        const { reserve } = this.state;
        const content = [];
        const portfolioTypeIsProduct = portfolio.portfolio_type === "product";
        const img_type = portfolioTypeIsProduct ? "" : "private";
        content.push(
            <div className="offer-cover" key="offer-cover" /*ref={ref => (this.slider = ref)}*/>
                <Img image={{ src: "/introduce/int_top_img.jpg", type: "image" }} />
                {outside
                    ? <div className="offer-cover-inner">
                        <p style={{ color: "#fff", fontSize: "3rem", wordSpacing: "3px" }}>포스냅 견적서</p>
                    </div>
                    : <div className="offer-cover-inner">
                        <div className="offer_artist-profile">
                            <Img image={{ src: data.profile_img, content_width: 110, content_height: 110 }} />
                        </div>
                        <p className="nick_name">{data.nick_name}</p>
                        <div className="button-actions">
                            <button
                                className="button button__theme__transparent conf"
                                onClick={() => this.moveArtistIntroPage(data.nick_name)}
                            >작가소개
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
        content.push(
            <div className="offer-content" key="offer-detailContent">
                {portfolio.images.length > 0 ?
                    <div className="offer-portfolio">
                        <p className="title" style={{ fontSize: "1.2em" }}>포트폴리오 <span style={{ color: "#ffba00" }}>{portfolio.images.length}장</span></p>
                        <PortfolioList list={portfolio.images} imageType={img_type} onMorePortfolio={() => this.onMorePortfolio()} />
                    </div> : null
                }
                <div className="offer-panel-box">
                    <div className="offer-panel-head">
                        <p className="detail-comment-title">상세내용</p>
                    </div>
                    <div className="offer-panel-body text">
                        <p className="detail-comment-text">
                            {utils.linebreak(data.content)}
                        </p>
                    </div>
                </div>
                {this.renderOptionPrice(data.option)}
                <div className="offer-panel-box">
                    <div className="offer-panel-head">
                        <p className="detail-comment-title">촬영종류
                        </p>
                    </div>
                    <div className="offer-panel-body _table">
                        <div className="reserve">
                            <div className="content-row">
                                <p className="content-left">{utils.format.categoryCodeToName(reserve.CATEGORY)}</p>
                                <p className="content-right pink-text">{offerData.category === reserve.CATEGORY ? "가능" : "불가"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        // }
        return content;
    }

    /**
     * 첨부그림을 그린다.
     * @param data
     * @returns {string}
     */
    renderAttachImg(data) {
        const { activeIndex } = this.state;
        let content = "";
        if (data.attach_img.length > 0) {
            const images = this.getPhotosSrc(data.attach_img);
            const total_cnt = images.length;
            const attachImageData = {
                images,
                total_cnt
            };
            content = (
                <div className="offer-attach-images">
                    <div className="wrap-portfolio">
                        <div className="test-wrap">
                            <span className="current-count">{activeIndex}</span>
                            <span className="total_count">{total_cnt}</span>
                        </div>
                        <div key="offerDetail_attach_img" className="swiper-container swiper-offerDetail" ref={ref => (this.slider = ref)}>
                            <div className="swiper-wrapper attach-img">
                                {images.map((image, idx) => {
                                    return (
                                        <div key={`mslider_${idx}`} className="swiper-slide mSlider" onClick={() => this.onShowAttachImg(attachImageData)}>
                                            <img role="presentation" src={`${__SERVER__.thumb}/normal/resize/640x640${image.src}`} onError={this.onError} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div key="slider-arrow-left" className={classNames("slider-arrow-left", this.state.activeIndex === 1 ? "hide" : "")} style={{ left: 0 }}>
                                &lt;
                            </div>
                            <div key="slider-arrow-right" className={classNames("slider-arrow-right", this.state.activeIndex === images.length ? "hide" : "")} style={{ right: 0 }}>
                                &gt;
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return content;
    }

    /**
     * 옵션 가격 정보를 그린다.
     * @param options
     * @returns {*}
     */
    renderOptionPrice(options) {
        const content = [];
        let totalPrice = 0;
        options.map((obj, idx) => {
            totalPrice += parseInt(obj.option_price, 10);
            return (
                content.push(
                    <div className="content-row" key={`offer-detail-option${idx}-price`}>
                        <div className="content-left">
                            <p><i className="m-icon m-icon-check-yellow" />{obj.option_name}</p>
                        </div>
                        <div className="content-right">
                            <p>{`${utils.format.price(obj.option_price)}원`}</p>
                        </div>
                    </div>
                )
            );
        });
        content.push(
            <div className="content-row" key="options-total-price">
                <div className="content-left">
                    <p><i className="m-icon m-icon-check-pink" />총가격</p>
                </div>
                <div className="content-right">
                    <p className="pink-text">{`${utils.format.price(totalPrice)}원`}</p>
                </div>
            </div>
        );
        return (
            <div className="offer-panel-box">
                <div className="offer-panel-head">
                    <p className="detail-comment-title">옵션가격</p>
                </div>
                <div className="offer-panel-body _table">
                    {content}
                </div>
            </div>
        );
    }

    /**
     * 첨부 파일 영역을 그린다.
     * @param data
     * @returns {*}
     */
    renderAttachFile(data) {
        let attach = data.attach;
        if (typeof attach === "string") {
            attach = JSON.parse(attach);
        }
        if (Array.isArray(attach) && attach.length > 0) {
            return (
                <div className="offer-content" style={{ paddingTop: "1.4rem" }}>
                    <div className="offer-panel-box">
                        <div className="offer-panel-head">
                            <p className="detail-comment-title">첨부파일</p>
                        </div>
                        <div className="offer-panel-body _table">
                            <div className="reserve">
                                {attach.map((obj, idx) => {
                                    return (
                                        <div className="content-row" key={`offer_detail_attach-file__${idx}`}>
                                            <a
                                                style={{ color: "#000", textOverflow: "ellipsis", overflow: "hidden" }}
                                                id={`attach_${idx}`}
                                                href={`${__SERVER__.data}${obj.path}`}
                                                target="_black" download={`attach_${idx}`}
                                            >{`[다운로드] ${obj.file_name}`}</a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        const { offerData } = this.state;
        return (
            <div
                className="estimate__offer-detail desktop-estimate"
                ref={ref => (this.offer = ref)}
                style={{ border: !utils.agent.isMobile() ? "1px solid #e1e1e1" : "" }}
            >
                {this.drawOffer(offerData)}
                {this.renderAttachImg(offerData)}
                {this.renderAttachFile(offerData)}
            </div>
        );
    }
}
