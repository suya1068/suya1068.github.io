import "./ExampleReview.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import api from "forsnap-api";
import utils from "forsnap-utils";

import { CATEGORY } from "shared/constant/product.const";
import regular from "shared/constant/regular.const";
import Img from "shared/components/image/Img";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ExampleReviewDetail from "./ExampleReviewDetail";

class ExampleReview extends Component {
    constructor(props) {
        super(props);
        const later_artist = props.artist_list ? props.artist_list.reduce((r, o) => {
            if (r.indexOf(o.user_id) === -1) {
                r.push(o.user_id);
            }

            return r;
        }, []) : [];

        this.state = {
            isMount: true,
            category: props.category,
            later_artist: later_artist.join(","),
            review_list: []
        };

        this.onShowDetail = this.onShowDetail.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.createList = this.createList.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.fetchAll();
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onShowDetail(data) {
        const { category } = this.state;
        const category_name = CATEGORY[category] ? CATEGORY[category].name : "";
        this.gaEvent(category_name, data.nick_name);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ExampleReviewDetail
                    data={data}
                    category={category}
                    onClose={() => Modal.close()}
                />
            ),
            full: true,
            overflow: false
        });
    }

    fetchAll() {
        const { category, later_artist } = this.state;
        const params = {
            category,
            later_artist
        };

        api.products.findArtistReview(params)
            .then(response => {
                const data = response.data;
                const list = data.list && Array.isArray(data.list) ? data.list : [];
                const review_list = [];

                if (list.length) {
                    while (review_list.length < 3 && list.length > 0) {
                        const splice = list.splice(0, 1);
                        if (splice.length) {
                            const item = splice[0];

                            review_list.push(item);
                            // if (Math.round(Math.random())) {
                            //     review_list.push(item);
                            // } else {
                            //     review_list.unshift(item);
                            // }
                        }
                    }
                }

                this.setStateData(() => {
                    return {
                        review_list
                    };
                }, () => {
                    if (typeof this.props.checkFetch === "function") {
                        this.props.checkFetch();
                    }

                    if (this.state.review_list.length > 1) {
                        const option = {
                            slidesPerView: "auto",
                            spaceBetween: 15,
                            initialSlide: 0
                        };

                        this.SwiperList = new Swiper(".example__list .swiper-container", option);
                    }
                });
            });
    }

    gaEvent(category_name, nick_name) {
        utils.ad.gaEvent("M_기업_리스트", "작가후기", `${category_name}_${nick_name}`);
    }

    createReviewContent(content) {
        const t1 = "<p>";
        const t2 = "</p>";
        let s = 0;
        let e = 0;
        let str = "";
        for (let i = 0; i < 3; i += 1) {
            s = content.indexOf(t1, e);
            e = content.indexOf(t2, s);

            if (s === -1 || e === -1) {
                str = content;
                break;
            }

            str += content.substring(s, e + t2.length);
        }

        return str;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    createList() {
        const { review_list } = this.state;

        if (review_list.length < 2) {
            const o = review_list[0];
            const regexp = new RegExp(regular.HTML_TAG, "gi");
            const regexp_img = new RegExp(regular.HTML_IMG, "gi");
            const content = o.content;
            const str = content.replace(regexp, "");
            const str2 = str.replace(/&nbsp;/gi, " ");
            const matchImage = content.match(regexp_img);

            return (
                <div className="example__item__single" onClick={() => this.onShowDetail(o)}>
                    <div className="example__row">
                        <div className="profile">
                            <Img image={{ src: o.profile_img, content_width: 110, content_height: 110 }} />
                        </div>
                        <div className="artist_name">{o.nick_name}</div>
                        <span className="interpunct">·</span>
                        <div className="txt_click">CLICK</div>
                    </div>
                    <div className="example__row">
                        <div className="thumb_img">
                            <Img image={{ src: o.thumb_img }} />
                        </div>
                    </div>
                    <div className="example__row justify__center">
                        <div className="button_count">
                            <img alt="i" src={`${__SERVER__.img}/common/icon/icon_picture.png`} />
                            <span>{matchImage && Array.isArray(matchImage) ? matchImage.length : 0}</span>
                        </div>
                        <div className="button_chat">
                            <img alt="i" src={`${__SERVER__.img}/common/icon/icon_chat.png`} />
                        </div>
                    </div>
                    <div className="example__row">
                        <div className="content">
                            {str2}
                        </div>
                    </div>
                </div>
            );
        }

        return review_list.map((o, i) => {
            if (o) {
                const regexp = new RegExp(regular.HTML_TAG, "gi");
                const regexp_img = new RegExp(regular.HTML_IMG, "gi");
                const content = o.content;
                const str = content.replace(regexp, "");
                const str2 = str.replace(/&nbsp;/gi, " ");
                const matchImage = content.match(regexp_img);

                return (
                    <div key={`example__item__${o.no}`} className="swiper-slide">
                        <div className="example__item" onClick={() => this.onShowDetail(o)}>
                            <div className="example__row">
                                <div className="profile">
                                    <Img image={{ src: o.profile_img, content_width: 110, content_height: 110 }} />
                                </div>
                                <div className="artist_name">{o.nick_name}</div>
                                <span className="interpunct">·</span>
                                <div className="txt_click">CLICK</div>
                            </div>
                            <div className="example__row">
                                <div className="thumb_img">
                                    <Img image={{ src: o.thumb_img }} />
                                </div>
                            </div>
                            <div className="example__row justify__center">
                                <div className="button_count">
                                    <img alt="i" src={`${__SERVER__.img}/common/icon/icon_picture.png`} />
                                    <span>{matchImage && Array.isArray(matchImage) ? matchImage.length : 0}</span>
                                </div>
                                <div className="button_chat">
                                    <img alt="i" src={`${__SERVER__.img}/common/icon/icon_chat.png`} />
                                </div>
                            </div>
                            <div className="example__row">
                                <div className="content">
                                    {str2}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div key={`coming_soon_${i}`} className="swiper-slide">
                    <div className="example__item coming_soon">
                        <i className="_icon _icon__pencil" />
                        <span className="txt_coming_soon">coming soon</span>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { review_list } = this.state;

        if (!review_list || !Array.isArray(review_list) || !review_list.length) {
            return null;
        }

        return (
            <section className="product__example__review product__hr">
                <div className="section-title text-center"><h1>포스냅 작가님들의<br />촬영사례를 살펴보세요!</h1></div>
                <div className="example__review">
                    <div className="example__list">
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {this.createList()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

ExampleReview.propTypes = {
    category: PropTypes.string.isRequired,
    artist_list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default ExampleReview;
