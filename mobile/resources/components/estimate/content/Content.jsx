import "./content.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";
// import Img from "shared/components/image/Img";
import PopModal from "shared/components/modal/PopModal";
// import { CATEGORY_VALUE } from "mobile/resources/components/estimate/estimate_content";
import PhotoViewerM from "mobile/resources/components/photoViewer/PhotoViewerM_swiper";
// import Comment from "mobile/resources/components/estimate/comment/Comment";
import classNames from "classnames";

export default class EstimateContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reserve: this.setReserveData(props.orderData),
            userType: props.userType,
            activeIndex: 1
        };
        this.sliderResize = this.sliderResize.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.sliderResize);
    }

    componentDidMount() {
        this.swiperSetting();
        this.sliderResize();
        if (utils.agent.isMobile()) {
            const scrollTopButton = document.querySelector(".scroll-top");
            if (scrollTopButton) {
                scrollTopButton.style.display = "none";
            }
        }
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

    /**
     * photoViwer 의 모달 창을 닫습니다.
     */
    onCloseFullSlide() {
        PopModal.close();
    }

    /**
     * 고객이 첨부한 사진들을 photoViwer로 봅니다.
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
     * 고객의 촬영요청 정보중 category, regioin, date, time의 요청 정보를 저장합니다.
     * @param data - object : orderData (촬영요청서 전체 데이터)
     * @returns {{CATEGORY, REGION: *, DATE: *, TIME}} - String
     */
    setReserveData(data) {
        return {
            CATEGORY: data.category,
            REGION: data.region,
            DATE: data.date,
            TIME: data.time
        };
    }

    /**
     * 사용자가 업로드한 사진들의 경로값만 가져옵니다.
     * @param photos
     * @returns {*}
     */
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
     * 사용자가 업로드한 사진에 슬라이더를 적용합니다.
     */
    swiperSetting() {
        this.offerDetail = new Swiper(".swiper-content", {
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 20,
            setWrapperSize: true,
            nextButton: ".slider-arrow-right",
            prevButton: ".slider-arrow-left",
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
     * 문서의 크기가 변할 시 슬라이더의 크기도 변경합니다. (4:3비율)
     */
    sliderResize() {
        const slider = this.slider;

        if (slider) {
            const content = this.content;
            const rs = utils.resize(4, 3, content.offsetWidth, 0, true);

            slider.style.width = `${rs.width}px`;
            slider.style.height = `${rs.height}px`;
        }
    }

    /**
     * 기본예약정보의 테이블을 그립니다.
     * @param reserve
     * @returns {XML}
     */
    drawReservePanel(reserve) {
        return (
            <div className="reserve">
                <div className="content-row">
                    <p className="content-title">촬영종류</p>
                    <p className="content-text">{utils.format.categoryCodeToName(reserve.CATEGORY)}</p>
                </div>
            </div>
        );
    }

    /**
     * 사용자가 업로드한 파일들을 그립니다.
     * @param images
     * @returns {string}
     */
    renderAttachImg(images) {
        const { activeIndex } = this.state;
        let content = "";
        if (images) {
            const total_cnt = images.length;
            const attachImageData = {
                images,
                total_cnt
            };
            content = (
                <div className="content-attach-images">
                    <div className="wrap-portfolio">
                        <div className="test-wrap">
                            <span className="current-count">{activeIndex}</span>
                            <span className="total_count">{total_cnt}</span>
                        </div>
                        <div className="swiper-container swiper-content" ref={ref => (this.slider = ref)}>
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

    renderAttachFile(files) {
        if (Array.isArray(files) && files.length > 0) {
            return (
                <div className="content__body__basic" style={{ margin: "0.8rem" }}>
                    {files.map((obj, idx) => {
                        return (
                            <div className="content-row" key={`attach-file__${idx}`}>
                                <p className="content-title">
                                    <a className="attach-files-name" href={`${__SERVER__.data}${obj.path}`} download={`attach__${idx}`} target="_blank">{`[다운로드] ${obj.file_name}`}</a>
                                </p>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return null;
    }

    render() {
        const { orderData, userType } = this.props;
        const { reserve } = this.state;
        const images = this.getPhotosSrc(orderData.attach_img);
        const attach_files = orderData.attach;
        const userInfoContent = [];
        let userText = "나의견적요청";
        if (userType === "A") {
            userText = `${orderData.name} 촬영요청`;
        } else {
            if (orderData.phone !== "") {
                userInfoContent.push(
                    <div className="content-row none-hr" key="userInfo-phone">
                        <p className="content-title">연락처</p>
                        <p className="content-text">{orderData.phone}</p>
                    </div>
                );
            }
            if (orderData.email !== "") {
                userInfoContent.push(
                    <div className="content-row none-hr" key="userInfo-email">
                        <p className="content-title">이메일</p>
                        <p className="content-text">{orderData.email}</p>
                    </div>
                );
            }
        }
        return (
            <div
                className="estimate-content-component desktop-estimate"
                ref={ref => (this.content = ref)}
                style={{ border: !utils.agent.isMobile() ? "1px solid #e1e1e1" : "" }}
            >
                <div className="estimate-content__content">
                    <div className="content__head">
                        <p className="title">{userText}</p>
                        <p className="regDate">작성일자: {orderData.reg_dt.substr(0, 10)}</p>
                    </div>
                    <div className="content__body">
                        <div className="content__body__basic info">
                            {this.drawReservePanel(reserve)}
                            {userInfoContent}
                        </div>
                        {orderData.content !== "" ?
                            <div className="content__body__basic">
                                <div className="content-row">
                                    <p className="content-textarea">{utils.linebreak(orderData.content)}</p>
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
                {this.renderAttachImg(images)}
                {this.renderAttachFile(attach_files)}
            </div>
        );
    }
}

EstimateContent.propTypes = {
    userType: PropTypes.oneOf(["U", "A"]),
    orderData: PropTypes.shape([PropTypes.node]).isRequired
};

EstimateContent.defaultProps = {
    userType: "U",
    orderData: {}
};
