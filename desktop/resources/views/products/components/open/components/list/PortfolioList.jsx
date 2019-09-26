import "./portfolio_list.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";
import A from "shared/components/link/A";
import utils from "forsnap-utils";

export default class PortfolioList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: props.products,
            params: props.params,
            tags: utils.search.parse(props.params.tag)
        };
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        const tag = nextProps.params.tag;
        const { tags } = this.state;
        const prop = {};

        if (tag !== utils.search.params(tags)) {
            prop.tags = utils.search.parse(tag);
        }

        this.setState(prop);
    }

    onMoveProductDetailPage(event, data) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("상품클릭");
        }
    }

    onRecommend(tag, isDelete) {
        const { onRecommend } = this.props;
        const { tags } = this.state;

        if (tag) {
            this.allTag.classList.remove("selected");
        } else {
            this.allTag.classList.add("selected");
        }

        if (tags) {
            const index = tags.findIndex(t => {
                return t === tag;
            });

            if (isDelete) {
                tags.splice(index, 1);
            } else if (index === -1) {
                tags.push(tag);
            }

            if (!tag) {
                tags.splice(0, tags.length);
            }

            if (typeof onRecommend === "function") {
                onRecommend(utils.search.params(tags));
            }

            if (utils.type.isEmpty(tags)) {
                this.allTag.classList.add("selected");
            }
        }
    }

    render() {
        const { products } = this.props;
        const { tags } = this.state;

        return (
            <section className="product_list__portfolio-list portfolio-list product__dist">
                <div className="container">
                    <div className="portfolio-list__head">
                        <div className="portfolio-list__head__text">
                            <h2 className="section-title">전체 포트폴리오</h2>
                        </div>
                    </div>
                    <div className="portfolio-list__tags">
                        <div className="tags-link">
                            <div className={classNames("tag", "selected")} onClick={() => this.onRecommend("")} ref={node => (this.allTag = node)}>전체</div>
                            {products.category_tag.map((tag, idx) => {
                                let className = "";

                                if (tags && Array.isArray(tags) && tags.length > 0) {
                                    const index = tags.findIndex(t => {
                                        return t === tag;
                                    });

                                    if (index !== -1) {
                                        className = "selected";
                                    }
                                }

                                return (
                                    <div className={classNames("tag", className)} key={`tag__${idx}`} onClick={() => this.onRecommend(tag, !!className)}>{tag}</div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="portfolio-list__content">
                        {products.list.map((product, idx) => {
                            return (
                                <div className="portfolio_item" key={`category__portfolio__${idx}`}>
                                    <a href={`/portfolio/${product.product_no}`} target="_blank" onClick={e => this.onMoveProductDetailPage(e, product)}>
                                        <div className="portfolio_item__thumb">
                                            <Img image={{ src: product.thumb_img, content_width: 504, content_height: 504 }} />
                                        </div>
                                        <div className="portfolio_item__info">
                                            <div className="portfolio_item__info-title">{product.title}</div>
                                            <div className="portfolio_item__info-artist">by {product.nick_name}</div>
                                        </div>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                    <div className="product-alert">결과물은 포스냅 홈페이지 및 홍보용으로 게시될 수 있습니다. 게시를 원치 않는 경우 미리 말씀해주시면 노출되지 않습니다.</div>
                </div>
            </section>
        );
    }
}
