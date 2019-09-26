import "../scss/artist_another_products.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
// import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
import A from "shared/components/link/A";

const LIMIT = 4;

export default class ArtistanotherProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            nick_name: props.nick_name,
            category: props.category,
            is_more: false
        };
        this.composeList = this.composeList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { list } = this.state;
        this.composeList(list);
    }

    composeList(list) {
        const _list = [];
        if (list && list.length > 0) {
            const max = list.length > 4 ? LIMIT : list.length;
            for (let i = 0; i < max; i += 1) {
                _list.push(list[i]);
            }
        }
        this.setState({
            render_list: _list,
            is_more: list.length > LIMIT
        });
    }

    gaEvent(no, title) {
        const { nick_name } = this.state;

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("작가의 다른상품", `작가명: ${nick_name} / 상품번호: ${no} / 상품명: ${title}`);
        }
    }

    render() {
        const { render_list, nick_name, list, is_more } = this.state;
        if (render_list && render_list.length > 0) {
            return (
                <div className="products__detail__another-products">
                    <div>
                        <div className="another-products__title">
                            <h2>{nick_name}작가의 다른상품</h2>
                            {is_more ?
                                <div className="more_products">
                                    <button
                                        className="f__button f__button__tiny f__button__round"
                                        onClick={() => { location.href = `/@${nick_name}`; }}
                                    >더 많은 상품보기</button>
                                </div>
                            : null}
                        </div>
                        <div>
                            {render_list.map((obj, idx) => {
                                const is_biz = utils.checkCategoryForEnter(obj.category_code);
                                const url = is_biz ? `/portfolio/${obj.product_no}` : `/products/${obj.product_no}?new=true`;
                                return (
                                    <a
                                        className="review-unit"
                                        key={`artist_another_products_${idx}`}
                                        onClick={() => this.gaEvent(obj.product_no, obj.title)}
                                        href={url}
                                        //target="_blank" rel="noopener"
                                    >
                                        <div className="review-unit__image">
                                            <Img image={{ src: obj.thumb_img }} />
                                        </div>
                                        <div className="review-unit__info">
                                            <p className="review-unit__info-title">{obj.title}</p>
                                            <p className="review-unit__info-blog" style={{ textAlign: "right" }}>{obj.category_name}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
