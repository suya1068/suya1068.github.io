import "./videoList.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import Swiper from "swiper";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

export default class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || {},
            list: props.list || [],
            UUID: utils.getUUID(),
            randomClassName: utils.uniqString(4)
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setSwiperConfig(this.state.UUID, this.state.randomClassName);
    }

    componentWillReceiveProps(nextProps) {
    }

    onMouseEnter(e, idx) {
        this.setState({
            hover: idx
        });
    }

    onMouseLeave(e) {
        this.setState({
            hover: ""
        });
    }

    onShowVimeo(id, title) {
        this.gaEvent(title);
        const name = "test";
        const content = (
            <div className="show-vimeo" style={{ width: 640, height: 360 }}>
                <iframe
                    src={`https://player.vimeo.com/video/${id}?color=ffffff&title=0&byline=0&portrait=0&autoplay=1`}
                    width="640px"
                    height="360px"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        );
        PopModal.createModal(name, content);
        PopModal.show(name);
    }

    setSwiperConfig(UUID, className) {
        // this.videoList = new Swiper(".video-list-body", {
        this.videoList = new Swiper(`#${UUID}`, {
            // slidesPerView: 3,
            slidesPerView: "auto",
            slidesPerGroup: 3,
            // slidesPerColumn: 3,
            spaceBetween: 10,
            setWrapperSize: false,
            nextButton: `.${className}-right`,
            prevButton: `.${className}-left`,
            loop: true,
            lazyLoading: true,
            lazyLoadingInPrevNext: false,
            paginationClickable: true,
            preloadImages: false,
            noSwiping: true,
            noSwipingClass: "swiper-slide"
        });
    }

    gaEvent(title) {
        const eCategory = "영상 소개페이지";
        const eAction = "영상 재생";
        const eLabel = title;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    isHover(idx) {
        return idx === this.state.hover;
    }

    render() {
        const { data, list, UUID, randomClassName } = this.state;
        return (
            <section className="video-list-component">
                <div className="list-wrapper">
                    <div className="video-list-body swiper-container" id={UUID}>
                        <div className="wrapper swiper-wrapper">
                            {Array.isArray(list) ?
                                list.map((obj, idx) => {
                                    return (
                                        <div className="portfolio__list__item swiper-slide" key={`video_list${randomClassName}__${idx}`}>
                                            <div className="video-thumbnail" onMouseEnter={e => this.onMouseEnter(e, idx)} onMouseLeave={e => this.onMouseLeave(e, idx)}>
                                                {this.isHover(idx) ?
                                                    <div className="thumbnail-over">
                                                        <div className="play-box" onClick={() => this.onShowVimeo(obj.id, obj.title)}>
                                                            <Icon name="video_play" />
                                                        </div>
                                                    </div>
                                                    : null
                                                }
                                                <img role="presentation" src={obj.thumb_nail} />
                                            </div>
                                            <div className="video-title">
                                                <p>{obj.title}</p>
                                            </div>
                                        </div>
                                    );
                                }) : null
                            }
                        </div>
                    </div>
                    <div className="video-navigation">
                        <div className={`video-navigation-left ${randomClassName}-left`}><Icon name="lt" /></div>
                        <div className={`video-navigation-right ${randomClassName}-right`}><Icon name="gt" /></div>
                    </div>
                </div>
            </section>
        );
    }
}
