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
            videos: props.videos,
            images: props.images,
            active_index: props.active_index,
            axis_type: props.axis_type,
            xhr: props.xhr,
            category: props.category,
            is_direct: props.is_direct,
            list_type: ""
        };
        this.onShowSlider = this.onShowSlider.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        this.onResize(true);
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("resize", this.onResize);
    }

    onResize(b) {
        // const target = e.target;
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

        const htmlDiv = document.querySelector("html");
        if (htmlDiv) {
            htmlDiv.style.height = "calc(100vh + 1px)";
            htmlDiv.style.backgroundColor = "#000";
            htmlDiv.scrollTo(0, 1);
        }
        if (this.state.isMount) {
            this.setState({ list_type }, () => {
                if (b) {
                    this.onInitPosition();
                    this.onConfigLazy();
                }
            });
        }
    }

    onScroll(e) {
        const { category, is_direct } = this.props;
        const informationDiv = document.querySelector(".forsnap-portfolio__information");
        // const list = this.list_container;
        if (e.target.scrollTop > 60) {
            if (informationDiv) {
                informationDiv.classList.add("fixed");
                e.target.style.paddingTop = "60px";
                e.target.style.paddingBottom = (category && is_direct) ? "60px" : "none";
            }
        } else {
            informationDiv.classList.remove("fixed");
            e.target.style.paddingTop = "0";
            e.target.style.paddingBottom = (category && is_direct) ? "0" : "none";
        }
    }

    onConfigLazy() {
        if (!this.myLazyLoad) {
            setTimeout(() => {
                this.myLazyLoad = new LazyLoad({
                    // elements_selector: ".lazy"
                    container: this.list_container
                });
            }, 100);
        }
    }

    /**
     * 초기 스크롤 포지션 설정
     */
    onInitPosition() {
        const init_target = document.getElementById("item_active");
        if (init_target) {
            const target_rect = init_target.getBoundingClientRect();

            if (this.list_container && target_rect) {
                this.list_container.scrollTop = target_rect.top - (60 * 2);
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
        const { list, videos, active_index, axis_type, xhr } = this.props;
        const { list_type } = this.state;
        const isVideo = utils.isArray(videos) && videos.length > 0;

        return (
            <div
                className={classNames("forsnap-portfolio__list", axis_type === "x" || isVideo ? "xAxis" : "yAxis")}
                // className={classNames("forsnap-portfolio__list", axis_type === "x" ? "xAxis" : "yAxis")}
                onScroll={this.onScroll}
                ref={node => (this.list_container = node)}
            >
                <div className={classNames("forsnap-portfolio__list-wrap", list_type)}>
                    {
                        list.length > 0 && list.map((item, idx) => {
                            const is_active = active_index === idx + 1;
                            return (
                                <PortfolioItem
                                    fullSize={item.full_size}
                                    data={item}
                                    vertical_type={item.vertical_type}
                                    axis_type={isVideo ? "x" : axis_type}
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
        );
    }
}

PortfolioList.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    axis_type: PropTypes.string.isRequired,
    xhr: PropTypes.bool
};

PortfolioItem.defaultProps = {
    xhr: true
};
