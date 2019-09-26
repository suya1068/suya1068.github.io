import "./chargeArtist.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import * as EstimateSession from "../extraInfoSession";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";

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

    componentWillReceiveProps(np) {
        // if (this.props.list.length !== np.list.length) {
        //     const { list } = np;
        //     const { limit } = this.state;
        //     const renderList = [];
        //     const max = list.length > limit ? limit : list.length;
        //
        //     for (let i = 0; i < max; i += 1) {
        //         renderList.push(list[i]);
        //     }
        //
        //     this.setState({ renderList });
        // }
    }

    onMoveProductDetailPage(e, data) {
        e.preventDefault();
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        utils.ad.gaEvent("기업_리스트", "유료_포폴", `${data.category}_${data.nick_name}_${data.product_no}`);
        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        // location.href = `/portfolio/${data.product_no}`;
        const myWindow = window.open("", "_blank");
        myWindow.location.href = `/products/${data.product_no}`;
    }

    render() {
        const { list } = this.state;
        const { totalPrice, isAlpha, category } = this.props;

        // const { renderList } = this.state;
        return (
            <section className="product_list__charge-artist charge-artist" style={{ paddingTop: category === "PRODUCT" ? "50px" : "20px" }}>
                <div className="container">
                    <div className="charge-artist__head">
                        <div className="container">
                            <div className="charge-artist__head__text">
                                <h2 className="section-title">포스냅 견적가로 촬영 가능한 작가님들의 포트폴리오입니다.</h2>
                            </div>
                        </div>
                    </div>
                    <div className="charge-artist__content">
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
