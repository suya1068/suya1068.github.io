import "./photoThumbnail.scss";
import React, { Component } from "react";
import utils from "forsnap-utils";
import Img from "desktop/resources/components/image/Img";
import Swiper from "swiper";
import classNames from "classnames";

export default class PhotoThumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            activeIndex: props.activeIndex,
            type: props.type || "thumb",
            lazy: props.lazy || true
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeIndex !== nextProps.activeIndex) {
            this.setState({
                activeIndex: nextProps.activeIndex
            });
            this.photoThumbnail.slideTo(nextProps.activeIndex - 1);
        }
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
     * 모바일 포토뷰어 썸네일 스와이퍼 환경을 설정한다.
     */
    setSwiperConfig() {
        this.photoThumbnail = new Swiper(".photo-thumbnail-container", {
            slidesPerView: "auto",
            spaceBetween: 5,
            initialSlide: this.props.activeIndex - 1
        });
    }

    setActiveIndex(activeIndex) {
        this.setState({ activeIndex });
        if (typeof this.props.onPhotoThumbnailClick === "function") {
            this.props.onPhotoThumbnailClick(activeIndex);
        }
    }

    isActive(index) {
        return index === this.state.activeIndex;
    }

    render() {
        const { images, type } = this.props;
        const { activeIndex } = this.state;
        return (
            <div className="photo-thumbnail-component">
                <div className="swiper-container photo-thumbnail-container">
                    <div className="swiper-wrapper photo-thumbnail-wrapper">
                        {images.map((obj, idx) => {
                            return (
                                <div
                                    className={classNames("swiper-slide photo-thumbnail-slide", { "active": this.isActive(idx + 1) })}
                                    key={`photo-thumbnail-slide__portfolio_no-${idx}`}
                                    onClick={() => this.setActiveIndex(idx + 1)}
                                >
                                    <Img image={{ src: obj.src, type, content_width: 90, content_height: 90 }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
