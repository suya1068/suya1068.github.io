import React, { Component, PropTypes } from "react";
import LazyLoad from "vanilla-lazyload/dist/lazyload";
import classNames from "classnames";
import PortfolioItem from "../item/PortfolioItem";
import utils from "forsnap-utils";

const LIST_MIDEA_QUERY = {
    UNIQUE: "unique",   // 1
    SHOT: "shot",       // 2
    MIDDLE: "middle",   // 3
    LARGE: "large",     // 4
    FULL: "full"        // 5
};

export default class PortfolioList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            list: props.list,
            images: props.images,
            videos: props.videos,
            active_index: props.active_index,
            axis_type: props.axis_type,
            xhr: props.xhr,
            ext_page: props.ext_page,
            list_type: "",
            setTimer: undefined
        };
        this.onShowSlider = this.onShowSlider.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", () => this.onResize(false));
    }

    componentDidMount() {
        this.onResize(true);
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("resize", this.onResize);
    }

    onResize(b = false) {
        // const target = e.target;
        const { ext_page } = this.props;
        const target_width = window.innerWidth;
        let list_type = LIST_MIDEA_QUERY.MIDDLE;

        if (target_width < 240) {
            list_type = LIST_MIDEA_QUERY.UNIQUE;
        } else if (target_width < 480) {
            list_type = LIST_MIDEA_QUERY.SHOT;
        } else if (target_width < 780) {
            list_type = LIST_MIDEA_QUERY.MIDDLE;
        } else if (target_width < 1080) {
            list_type = LIST_MIDEA_QUERY.LARGE;
        } else if (target_width > 1080) {
            list_type = LIST_MIDEA_QUERY.FULL;
        }

        if (this.state.isMount) {
            this.setState({ list_type }, () => {
                if (b) {
                    this.onInitPosition(ext_page);
                    this.state.setTimer = setTimeout(() => {
                        this.onConfigLazy();
                        if (this.state.setTimer) {
                            clearTimeout(this.state.setTimer);
                        }
                    }, 15);
                }
            });
        }
    }

    onConfigLazy() {
        setTimeout(() => {
            const myLazyLoad = new LazyLoad({
                // elements_selector: ".lazy"
                container: this.list_container
            });
        }, 100);
    }

    /**
     * 초기 스크롤 포지션 설정
     */
    onInitPosition(ext_page = false) {
        const init_target = document.getElementById("item_active");
        if (init_target) {
            const target_rect = init_target.getBoundingClientRect();

            if (this.list_container && target_rect) {
                let scroll_top_p = target_rect.top - 162;
                if (ext_page) {
                    scroll_top_p = 0;
                }

                this.list_container.scrollTop = scroll_top_p;
            }
        }
    }

    /**
     * 이미지 선택
     * @param idx
     */
    onShowSlider(idx) {
        if (typeof this.props.onShowSlider === "function") {
            this.props.onShowSlider(idx);
        }
    }

    render() {
        const { list, videos, active_index, axis_type, xhr, ext_page } = this.props;
        const { list_type } = this.state;
        const isVideo = utils.isArray(videos) && videos.length > 0;

        return (
            <div
                className={classNames("forsnap-portfolio__list", axis_type === "x" || isVideo ? "xAxis" : "yAxis", { "ext_page": ext_page })}
            >
                <div
                    className="test-wrap"
                    ref={node => (this.list_container = node)}
                >
                    <div className={classNames("forsnap-portfolio__list-wrap", list_type)}>
                        {
                            list.length > 0 && list.map((item, idx) => {
                                const is_active = active_index === idx + 1;

                                return (
                                    <PortfolioItem
                                        vertical_type={item.vertical_type}
                                        data={item}
                                        axis_type={isVideo ? "x" : axis_type}
                                        //src={`${__SERVER__.thumb}/normal/crop/${axis_type === "x" ? "320x320" : "0x320"}${item.src}`}
                                        key={`forsnap-portfolio__image_${idx}`}
                                        index={idx + 1}
                                        is_active={is_active}
                                        onShowSlider={this.onShowSlider}
                                        xhr={xhr}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

PortfolioList.propTypes = {
    // images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    axis_type: PropTypes.string.isRequired,
    xhr: PropTypes.bool
};

PortfolioItem.defaultProps = {
    xhr: true
};
