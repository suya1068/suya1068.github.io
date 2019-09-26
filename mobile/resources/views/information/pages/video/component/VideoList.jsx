import "./videoList.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";

export default class VideoList extends Component {
    constructor(props) {
        super(props);
        this.createState = this.createState.bind(this);

        this.state = {
            data: props.data || {},
            list: props.list || [],
            UUID: utils.getUUID(),
            activeIndex: 1
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setSwiperConfig(this.state.UUID);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.createState(nextProps));
    }

    onShowVimeo(id, title) {
        this.gaEvent(title);
        const name = "test";
        const content = (
            <div className="show-vimeo" style={{ width: "100%", height: "auto" }}>
                <iframe
                    src={`https://player.vimeo.com/video/${id}??color=ffffff&title=0&byline=0&portrait=0`}
                    width="100%"
                    height="250"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        );
        PopModal.createModal(name, content, { className: "mobile-vimeo-show" });
        PopModal.show(name);
    }

    setSwiperConfig(UUID) {
        // this.videoList = new Swiper(".video-list-body", {
        this.videoList = new Swiper(`#${UUID}`, {
            slidesPerView: 1,
            nextButton: ".video-navigation-right",
            prevButton: ".video-navigation-left",
            touchMoveStopPropagation: true,
            lazyLoading: true,
            lazyLoadingInPrevNext: false,
            paginationClickable: true,
            preloadImages: false,
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

    gaEvent(title) {
        const eCategory = "영상 소개페이지";
        const eAction = "영상 재생";
        const eLabel = title;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    createState({ data, list }) {
        return {
            data: data || {},
            list: list || []
        };
    }

    render() {
        const { data, list, UUID } = this.state;
        return (
            <div className="video-list-component">
                <div className="video-list-body swiper-container" id={UUID}>
                    <div className="video-list-head">
                        <h4 className="video-list-title">{data.list_name}</h4>
                        <span className="video-list-description">{data.description}</span>
                    </div>
                    <div className="wrapper swiper-wrapper">
                        {Array.isArray(list) ?
                            list.map((obj, idx) => {
                                return (
                                    <div className="portfolio__list__item swiper-slide" key={`video_list${data.list_code}__${idx}`} style={{ width: "100%" }}>
                                        <div className="video-thumbnail" style={{ width: "100%" }}>
                                            <div className="thumbnail-over">
                                                <div className="play-box" onClick={() => this.onShowVimeo(obj.id, obj.title)}>
                                                    <icon className="m-icon m-icon-video_play" />
                                                </div>
                                            </div>
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
                    <div className="video-navigation">
                        <div className="video-navigation-left"><i className="m-icon m-icon-gt_b" /></div>
                        <div className="video_count">
                            <span className="active-index">{this.state.activeIndex}</span>
                            <span className="total">{list.length}</span>
                        </div>
                        <div className="video-navigation-right"><i className="m-icon m-icon-gt_b" /></div>
                    </div>
                </div>
            </div>
        );
    }
}
