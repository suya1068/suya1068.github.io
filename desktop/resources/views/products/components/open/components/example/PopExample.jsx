import "./pop_example.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import Swiper from "swiper";
// import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class PopExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            activeIndex: 0
        };
        this.onConsult = this.onConsult.bind(this);
    }

    componentDidMount() {
        const exmaple_swiper = new Swiper(".pop_example__content__images", {
            slidesPerView: "1",
            spaceBetween: 70,
            // setWrapperSize: true,
            nextButton: ".right-arrow",
            prevButton: ".left-arrow",
            onSlideChangeStart: swiper => {
                this.setState({ activeIndex: swiper.activeIndex });
            }
        });
    }

    onConsult(data) {
        if (typeof this.props.onConsult === "function") {
            const no = data.no;
            let category = "";
            switch (this.props.category) {
                case "PRODUCT": category = "exam_p_"; break;
                case "FOOD": category = "exam_f_"; break;
                case "INTERIOR": category = "exam_i_"; break;
                case "BEAUTY": category = "exam_b_"; break;
                case "PROFILE_BIZ": category = "exam_pb_"; break;
                case "FASHION": category = "exam_fs_"; break;
                case "EVENT": category = "exam_e_"; break;
                case "VIDEO_BIZ": category = "exam_v_"; break;
                default: break;
            }
            this.props.onConsult(null, `${category}${no}`);
        }
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("촬영사례상담신청");
        }
    }

    render() {
        const { data } = this.props;
        const { activeIndex } = this.state;
        return (
            <div className="pop_example-container">
                <div className="pop_example__head">
                    <p className="pop-title">
                        {data.title}
                    </p>
                    <div className="pop_example__close-btn" onClick={this.props.onClose}>
                        <Icon name="big_black_close" />
                    </div>
                </div>
                <div className="pop_example__content">
                    <div className="pop_example__content__info">
                        <div className="pop_example__content__info__desc">
                            <div className="info-title">촬영내용</div>
                            <p className="info-desc">{data.content}</p>
                        </div>
                        <div className="pop_example__content__info__price">
                            <div className="info-title">촬영비용</div>
                            {data.price.map((p, idx) => {
                                return (
                                    <div className="info-price__row" key={`example__price__${idx}`}>
                                        <div className="info-price__title">{p.title}</div>
                                        <div className="info-price__content">{p.info}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pop_example__content__info__consult-btn" onClick={() => this.onConsult(data)}>
                            <button>비슷한 견적 상담신청하기</button>
                        </div>
                    </div>
                    <div className="pop_example__content__images swiper-container">
                        <div className="swiper-wrapper">
                            {data.images.length > 0
                                ?
                                    data.images.map(image => {
                                        return (
                                            <div className="example-image swiper-slide" key={`example_image__${image.no}`}>
                                                <img role="presentation" src={`${__SERVER__.img}${image.src}`} style={{ width: this.props.category === "EVENT" ? "auto" : "" }} />
                                            </div>
                                        );
                                    })
                                :
                                    <div className="wrap_video_box">
                                        <iframe
                                            src={data.video.src}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                            }
                        </div>
                        <div className="arrow">
                            <div className="left-arrow">
                                {activeIndex > 0 &&
                                    <i className="_icon _icon__arrow__ll" />
                                }
                            </div>
                            <div className="right-arrow">
                                {activeIndex < data.images.length - 1 &&
                                <i className="_icon _icon__arrow__lr" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
