import "./shot_example.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import Swiper from "swiper";

export default class ShotExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            onShowExample: props.onShowExample,
            gaEvent: props.gaEvent
        };
    }

    componentDidMount() {
        this.shot_example = new Swiper(".shot-example__content", {
            slidesPerView: 2.3,
            spaceBetween: 10,
            slidesOffsetAfter: 20
        });
    }

    render() {
        const { data, onShowExample } = this.props;
        return (
            <section className="products__list__page__shot-example shot-example product__dist gray-background-color" id="shot_example">
                <div className="shot-example__head">
                    <div className="shot-example__head__text">
                        <h2 className="section-title">실제촬영사례를 살펴보세요.</h2>
                    </div>
                </div>
                <div className="shot-example__content swiper-container">
                    <div className="shot-example__content__wrap swiper-wrapper">
                        {data.list.map((exam, idx) => {
                            const d = {
                                no: idx + 1,
                                title: exam.title,
                                images: exam.images,
                                images_2x: exam.images_2x,
                                price: exam.price,
                                content: exam.content
                            };

                            if (exam.video && exam.video.src) {
                                d.video = { src: exam.video.src };
                            }
                            if (exam.width) {
                                d.width = exam.width;
                            }
                            return (
                                <div className="shot-example__content-item swiper-slide" key={`example__shot__${idx}`} onClick={() => onShowExample(d)}>
                                    <div className="shot-example__content-item__image">
                                        <img src={`${__SERVER__.img}${exam.bg_img}`} role="presentation" style={{ width: exam.width || "" }} />
                                    </div>
                                    <div className="shot-example__content-item__text">
                                        <p className="title">{utils.linebreak(exam.title)}</p>
                                        <p className="check">예산확인하기</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
