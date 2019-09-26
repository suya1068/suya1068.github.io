import "./ExampleReview.scss";
import React, { Component, PropTypes } from "react";

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

        this.state = {
            isMount: true,
            page_type: props.page_type || null,
            review_list: []
        };

        this.onShowDetail = this.onShowDetail.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.fetchAll();
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onShowDetail(data, type) {
        const category_name = CATEGORY[data.category] ? CATEGORY[data.category].name : "";
        this.gaEvent(category_name, data.nick_name);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            full: true,
            overflow: false,
            content: (
                <ExampleReviewDetail
                    data={data}
                    page_type={type}
                    onClose={() => Modal.close()}
                />
            )
        });
    }

    fetchAll() {
        api.products.findMainArtistReview()
            .then(response => {
                const data = response.data;
                const list = data.list && Array.isArray(data.list) ? data.list : [];
                const review_list = [];

                while (review_list.length < 3) {
                    const splice = list.splice(0, 1);
                    if (splice.length) {
                        const item = splice[0];
                        const obj = review_list.find(o => {
                            return o.category === item.category;
                        });

                        if (!obj) {
                            if (Math.round(Math.random())) {
                                review_list.push(item);
                            } else {
                                review_list.unshift(item);
                            }
                        }
                    } else {
                        review_list.push(null);
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
                });
            });
    }

    gaEvent(category_name, nick_name) {
        utils.ad.gaEvent("기업_메인", "작가후기", `${category_name}_${nick_name}`);
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
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

    render() {
        const { page_type } = this.props;
        const { review_list } = this.state;

        if (!review_list || !Array.isArray(review_list) || !review_list.length) {
            return null;
        }

        return (
            <div className="main__example__review">
                <div className="section-title text-center"><h1>포스냅 작가님들의 촬영사례를 살펴보세요!</h1></div>
                <div className="example__review">
                    <div className="example__list">
                        {review_list.map((o, i) => {
                            if (o) {
                                const regexp = new RegExp(regular.HTML_TAG, "gi");
                                const regexp_img = new RegExp(regular.HTML_IMG, "gi");
                                const content = o.content;
                                const str = content.replace(regexp, "");
                                const str2 = str.replace(/&nbsp;/gi, " ");
                                const category_name = CATEGORY[o.category] ? CATEGORY[o.category].name : "";
                                const matchImage = content.match(regexp_img);

                                return (
                                    <div key={`example__item__${o.no}`} className="example__item" onClick={() => this.onShowDetail(o, page_type)}>
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
                                            <div className="category">
                                                {category_name}
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

                            return (
                                <div key={`coming_soon__${i}`} className="example__item coming_soon">
                                    <i className="_icon _icon__pencil" />
                                    <span className="txt_coming_soon">coming soon</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

ExampleReview.propTypes = {
};

export default ExampleReview;
