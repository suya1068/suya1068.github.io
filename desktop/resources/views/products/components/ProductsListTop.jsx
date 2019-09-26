import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import { PRODUCT_LIST_TOP_CATEGORY } from "shared/constant/product.const";

import Img from "shared/components/image/Img";

class ProductsListTop extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true
        };

        this.onConsult = this.onConsult.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onConsult() {
        const { category, onConsult } = this.props;

        if (typeof onConsult === "function") {
            onConsult(`PLT_${category}`, () => {
                utils.ad.gaEvent("기업_리스트", "상단상담신청", `category=${category}`);
            });
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setStateData(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { category } = this.props;
        const top = category ? PRODUCT_LIST_TOP_CATEGORY[category.toUpperCase()] : null;

        if (!category || !top) {
            return null;
        }

        const style = {
            background: `url(${__SERVER__.img}/products/list_${category.toLowerCase()}_bg_new.jpg) center center no-repeat`
        };

        return (
            <div className="products__list__top">
                <div className="list__top__bg" style={style} />
                <div className="list__top__container">
                    <div className="list__top__content">
                        <div className="top__content__box">
                            <div className="box__content">
                                <div className="title">{top.title}</div>
                                <div className="description">{utils.linebreak(top.description)}</div>
                                <div className="consult__button" style={{ marginTop: top.distance || "" }}>
                                    <button className={`_button _button__${top.button}`} onClick={this.onConsult}>간편견적 신청하기</button>
                                </div>
                            </div>
                        </div>
                        {top.artist_name ?
                            <span className="artist__name">
                                by {top.artist_name}
                            </span> : null
                        }
                    </div>
                    <div className="list__top__bar">
                        <div>
                            {top.bars.map((o, i) => {
                                return (
                                    <div key={`bar_${i}`} className="bar__item">
                                        <div className="title">{o.title}</div>
                                        <div className="description">{utils.linebreak(o.description)}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProductsListTop.propTypes = {
    category: PropTypes.string,
    onConsult: PropTypes.func.isRequired
};

export default ProductsListTop;
