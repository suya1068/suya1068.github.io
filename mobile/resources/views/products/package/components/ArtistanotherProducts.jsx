import "../scss/artist_another_products.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import A from "shared/components/link/A";
import utils from "forsnap-utils";

const LIMIT = 4;

class ArtistanotherProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            nick_name: props.nick_name,
            category: props.category
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { list } = this.state;
        this.combineList(list);
    }

    componentDidMount() {
    }

    combineList(list) {
        const _list = [];
        if (list && list.length > 0) {
            const max = list.length > 4 ? LIMIT : list.length;
            for (let i = 0; i < max; i += 1) {
                _list.push(list[i]);
            }
        }
        this.setState({
            render_list: _list
        });
    }

    /**
     * 작가의 다른상품 ga이벤트
     * @param no
     * @param title
     */
    gaEvent(no, title) {
        const { nick_name } = this.state;

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("작가의 다른상품", `작가명: ${nick_name} / 상품번호: ${no} / 상품명: ${title}`);
        }
    }

    render() {
        const { render_list, nick_name, list } = this.state;

        if (render_list && render_list.length > 0) {
            return (
                <div className="products__detail__another-products">
                    <h1 className="another-products__title"><span className="nick_name">{nick_name}</span><span className="fix-str">작가의 다른상품</span></h1>
                    <div className="products__detail__another-products__list">
                        {render_list.map((obj, idx) => {
                            const is_biz = utils.checkCategoryForEnter(obj.category_code);
                            const url = is_biz ? `/portfolio/${obj.product_no}` : `/products/${obj.product_no}?new=true`;
                            return (
                                <a
                                    className="review-unit"
                                    key={`artist_another_products_${idx}`}
                                    onClick={() => this.gaEvent(obj.product_no, obj.title)}
                                    href={url}
                                    // target="_blank"
                                    // rel="noopener"
                                >
                                    <div className="review-unit__image">
                                        <Img image={{ src: obj.thumb_img, content_width: 200, content_height: 200, width: 4, height: 3 }} isContentResize />
                                    </div>
                                    <div className="review-unit__info">
                                        <p className="review-unit__info-title">{obj.title}</p>
                                        <p className="review-unit__info-blog" style={{ textAlign: "right" }}>{obj.category_name}</p>
                                    </div>
                                </a>
                            );
                        })}
                        {list.length > 4 ?
                            <a className="more-slide review-unit" role="button" href={`/@${nick_name}`}>
                                <div className="moreProduct">
                                    <div className="moreIcon">
                                        <i className="m-icon m-icon-gt_b" />
                                    </div>
                                    <p className="moreView">더 많은<br />상품보기</p>
                                </div>
                            </a> : null
                        }
                    </div>
                </div>
            );
        }
        return null;
    }
}

ArtistanotherProducts.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default ArtistanotherProducts;
