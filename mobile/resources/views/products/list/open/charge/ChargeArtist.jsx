import "./chargeArtist.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import * as EstimateSession from "../extraInfoSession";
import PopModal from "shared/components/modal/PopModal";

export default class ChargeArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            limit: 100,
            totalPrice: props.totalPrice || 0,
            isAlpha: props.isAlpha || false
        };
        this.onMoveProductDetailPage = this.onMoveProductDetailPage.bind(this);
    }

    componentWillMount() {
        const { getReceiveList, category } = this.props;
        const { limit } = this.state;
        if (category) {
            getReceiveList({ category, limit, offset: 0 })
                .then(response => {
                    const data = response.data;
                    this.setState({
                        list: data.list
                    });

                    if (typeof this.props.checkFetch === "function") {
                        this.props.checkFetch();
                    }
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }
    }

    onMoveProductDetailPage(e, data) {
        e.preventDefault();
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        utils.ad.gaEvent("M_기업_리스트", "유료_포폴", `${data.category}_${data.nick_name}_${data.product_no}`);
        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        window.open(`/products/${data.product_no}`, "_blank");
        // location.href = `/portfolio/${data.product_no}`;
    }

    render() {
        const { totalPrice, isAlpha } = this.props;
        const { list } = this.state;
        // const { renderList } = this.state;
        return (
            <section className="product_list__portfolio-list charge-artist" id="charge-artist">
                <div className="charge-artist__head">
                    <div className="charge-artist__head__text">
                        <h2 className="section-title">포스냅 견적가로 촬영 가능한<br />작가님들의 포트폴리오입니다.</h2>
                    </div>
                </div>
                <div className="portfolio-list__content section__padding">
                    {list.map((product, idx) => {
                        return (
                            <div className="portfolio_item" key={`category__portfolio__${idx}`}>
                                <a href={`/products/${product.product_no}`} target="_blank" onClick={e => this.onMoveProductDetailPage(e, product)}>
                                    <div className="portfolio_item__thumb">
                                        <Img image={{ src: product.thumb_img, content_width: 504, content_height: 504 }} />
                                    </div>
                                    <div className="portfolio_item__info">
                                        <div className={classNames("portfolio_item__info-title", { "te": totalPrice })}>{product.title}</div>
                                        <div className="portfolio_item__info-artist">by {product.nick_name}</div>
                                        {!!totalPrice &&
                                        <div className="portfolio_item__info-price">
                                            <span className="price-before">예상견적</span>
                                            <span className="price">{utils.format.price(totalPrice)}</span>
                                            {isAlpha &&
                                            <span className="plus-alpha">{"+ a"}</span>
                                            }
                                            <span className="won">원</span>
                                        </div>
                                        }
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }
}

ChargeArtist.propTypes = {
    getReceiveList: PropTypes.func
};

ChargeArtist.defaultProps = {
    getReceiveList: null
};
