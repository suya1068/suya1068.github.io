import "./artistInquireArtist.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import ArtistPanel from "./panel/ArtistPanel";
import ArtistVideoPanel from "./panel/video/ArtistVideoPanel";
import Img from "desktop/resources/components/image/Img";
// import NoneArtistPanel from "./panel/NoneArtistPanel";
import Icon from "desktop/resources/components/icon/Icon";
import Swiper from "swiper";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import PopArtistReview from "../../../components/pop/review/PopArtistReview";

export default class AfterInquireArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            category: props.category,
            artistLimit: 30,
            activeIndex: 0
        };
        this.setActiveIndex = this.setActiveIndex.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
        this.onConsultArtist = this.onConsultArtist.bind(this);
        this.onPopArtistReview = this.onPopArtistReview.bind(this);

        this.configSwiper = this.configSwiper.bind(this);
    }

    componentWillMount() {
        const { category, getReceiveList } = this.props;
        const { artistLimit } = this.state;
        if (category) {
            getReceiveList({ category, limit: artistLimit, offset: 0 })
                .then(response => {
                    const data = response.data;
                    this.setState({
                        list: data.list
                    }, () => {
                        setTimeout(() => {
                            this.configSwiper();
                        }, 200);
                        if (typeof this.props.checkState === "function") {
                            this.props.checkState(true);
                        }
                    });
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }
    }

    componentDidMount() {
    }

    configSwiper() {
        const { category } = this.props;

        const params = {
            slidesPerView: 6,
            spaceBetween: 40,
            slidesPerGroup: 6,
            nextButton: ".arrow-right",
            prevButton: ".arrow-left",
            onSlideChangeStart: swiper => {
                const { activeIndex } = this.state;
                const act_idx = swiper.activeIndex;
                this.gaEvent("추천_꺽쇠", category);
                if (activeIndex < act_idx || activeIndex > act_idx + 5) {
                    this.setState({ activeIndex: swiper.activeIndex });
                }
            }
        };

        this.recommendArtist = new Swiper(".after-inquire-artist__content-head", params);
    }

    setActiveIndex(index) {
        const { activeIndex } = this.state;
        this.setState({
            activeIndex: index
        }, () => {
            if (activeIndex !== index) {
                this.recommendArtist.slideTo(index);
            }
        });
    }

    /**
     *
     * @param index
     * @param item
     * @param action
     */
    onSelectArtist(index, item, action) {
        const { category } = this.props;
        this.setState({ activeIndex: index }, () => {
            if (item) {
                this.gaEvent(action, `${category}_${item.nick_name}_${item.product_no}`);
            }
        });
    }

    /**
     * 작가에게 한꺼번에 문의하기 기능
     */
    onConsultArtist(data) {
        if (typeof this.props.onConsultArtist === "function") {
            this.props.onConsultArtist(data);
        }
    }

    /**
     * ga이벤트
     * @param action
     * @param label
     */
    gaEvent(action, label) {
        utils.ad.gaEvent("기업_리스트", action, label);
    }

    /**
     * 작가리뷰 팝업
     */
    onPopArtistReview(data) {
        const modalName = "pop-review";
        PopModal.createModal(modalName,
            <PopArtistReview
                list={data.review.list}
                nickName={data.nick_name}
                onClose={() => PopModal.close(modalName)}
            />
            , { modal_close: false, className: modalName });
        PopModal.show(modalName);
    }

    renderPanelSwitch(category) {
        const { list, activeIndex } = this.state;
        const isVideoCategory = category === "VIDEO_BIZ";
        let content = (
            <ArtistPanel
                list={list}
                activeIndex={activeIndex}
                setActiveIndex={this.setActiveIndex}
                onShowReview={this.onPopArtistReview}
                onConsultArtist={this.onConsultArtist}
                gaEvent={this.gaEvent}
            />
        );
        if (isVideoCategory) {
            content = (
                <ArtistVideoPanel
                    list={list}
                    activeIndex={activeIndex}
                    setActiveIndex={this.setActiveIndex}
                    onShowReview={this.onPopArtistReview}
                    onConsultArtist={this.onConsultArtist}
                    gaEvent={this.gaEvent}
                />
            );
        }

        return content;
    }

    render() {
        const { category } = this.props;
        const { list, activeIndex, selectArtist } = this.state;
        return (
            <section className="products__list__page__after-inquire-artist product__dist after-inquire-artist" id="pre_recommend_artist">
                <div className="container">
                    <div className="after-inquire-artist__head">
                        <h2 className="section-title title">추천 작가의 포트폴리오를 확인해보세요.</h2>
                        {/*<h2 className="section-title title">{list.length > 0 ? "추천 작가의 포트폴리오를 확인해보세요." : "견적산출 후 촬영가능한 작가님을 확인하실 수 있습니다."}</h2>*/}
                    </div>
                    {list.length > 0 &&
                        <div className="after-inquire-artist__content">
                            <div className="after-inquire-artist__content__swiper">
                                {list.length > 6 ? <div className="arrow-left" /> : null}
                                <div className="after-inquire-artist__content-head swiper-container">
                                    <div className="swiper-wrapper">
                                        {list.map((o, idx) => {
                                            const params = {
                                                host: __SERVER__.thumb,
                                                type1: "normal",
                                                type2: "crop",
                                                width: 320,
                                                height: 320,
                                                src: o.thumb_img
                                            };
                                            const src = utils.image.make2(params);
                                            const active = idx === activeIndex;
                                            return (
                                                <div className="after-inquire-artist__content__box swiper-slide" key={`product__list__${idx}`} onClick={() => this.onSelectArtist(idx, o, "추천_썸네일")}>
                                                    <div className="after-inquire-artist__content__box__thumb">
                                                        <div className="thumb_image">
                                                            {active ?
                                                                <div className="profile_circle">
                                                                    <div className="yb" />
                                                                    <i className="_icon _icon__yellow__check" />
                                                                </div> : null
                                                            }
                                                            <div className="image">
                                                                <img alt="thumb" src={src} />
                                                            </div>
                                                        </div>
                                                        <p className="artist__nick-name">{o.nick_name}</p>
                                                        <p className="author">작가님</p>
                                                    </div>
                                                    <div className={classNames("arrow", { "show": active })} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {list.length > 6 ? <div className="arrow-right" /> : null}
                            </div>
                            {this.renderPanelSwitch(category)}
                        </div>
                    }
                </div>
            </section>
        );
    }
}

AfterInquireArtist.propTypes = {
    getReceiveList: PropTypes.func
};

AfterInquireArtist.defaultProps = {
    getReceiveList: null
};

