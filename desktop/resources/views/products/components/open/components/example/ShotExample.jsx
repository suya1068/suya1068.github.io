import "./shot_example.scss";
import React, { Component, PropTypes } from "react";
import { EXAMPLES } from "../product_list.const";

export default class ShotExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            onShowExample: props.onShowExample,
            gaEvent: props.gaEvent
        };
    }

    render() {
        const { data, onShowExample } = this.props;
        return (
            <section className="product_list__shot-example shot-example product__dist">
                <div className="container">
                    <div className="shot-example__head">
                        <div className="shot-example__head__text">
                            <h2 className="section-title">촬영사례</h2>
                        </div>
                    </div>
                    <div className="shot-example__content">
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
                                <div className="shot-example__content-item" key={`example__shot__${idx}`} onClick={() => onShowExample(d)}>
                                    <div className="shot-example__content-item__image">
                                        <img src={`${__SERVER__.img}${exam.bg_img}`} role="presentation" style={{ width: exam.width || "" }} />
                                    </div>
                                    <div className="shot-example__content-item__text">
                                        <p className="title">{exam.title}</p>
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
