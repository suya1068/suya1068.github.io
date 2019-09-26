import React, { Component, PropTypes } from "react";

import Img from "shared/components/image/Img";

class ProductsConceptImages extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.gaEvent = this.gaEvent.bind(this);
    }

    gaEvent(nick_name) {
        const { category_code, category_name, depth1, title, gaEvent } = this.props;
        gaEvent("포폴더보기", `${category_name}_${depth1}_${title}_${nick_name}`);
    }

    render() {
        const { title, description, data, onShowConsultModal } = this.props;

        if (!Array.isArray(data) || !data.length) {
            return null;
        }

        return (
            <div className="concept__images__container">
                <div className="images__header">
                    <div className="title">{title}</div>
                    <div className="description">{description}</div>
                </div>
                <div className="images__body">
                    <div className="images__list">
                        {data.map((o, i) => {
                            if (i > 2) {
                                return null;
                            }

                            return (
                                <div key={o.no} className="images__item">
                                    <Img image={{ src: o.portfolio_img, content_width: 640, content_height: 640 }} />
                                    <div className="item__overlay">
                                        <a href={`/products/${o.product_no}`} target="_blank" onClick={() => this.gaEvent(o.nick_name)}><button>포트폴리오 더보기</button></a>
                                        <button onClick={() => onShowConsultModal(o)}>이 컨셉으로 문의하기</button>
                                    </div>
                                    <div className="artist_name">Photo by {o.nick_name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

ProductsConceptImages.propTypes = {
    category_code: PropTypes.string,
    category_name: PropTypes.string,
    depth1: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.shape({
        depth1: PropTypes.string,
        depth2: PropTypes.string,
        list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
    })),
    gaEvent: PropTypes.func.isRequired,
    onShowConsultModal: PropTypes.func.isRequired
};

export default ProductsConceptImages;
