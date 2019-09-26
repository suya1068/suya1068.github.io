import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Img from "shared/components/image/Img";

class ProductsTop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: props.category,
            portfolio: props.portfolio,
            main_img: props.main_img
        };
    }

    componentWillMount() {
        const { category, main_img } = this.state;

        if (category === "VIDEO") {
            const a = document.createElement("a");
            a.href = main_img;
            const query = Object.assign(utils.query.parse(a.search), {
                modestbranding: 1,
                rel: 0,
                showinfo: 0
            });
            this.setState({
                main_img: `${a.protocol}//${a.hostname}${a.pathname}?${utils.query.stringify(query)}`
            });
        }
    }

    render() {
        const { category, portfolio, main_img } = this.state;

        if (["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1) {
            return (
                <div className="products__detail__main__image">
                    <iframe
                        src={main_img}
                        width="680"
                        height="383"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            );
        } else if (portfolio && utils.isArray(portfolio.list) && portfolio.list.length > 3) {
            return (
                <div className="products__detail__main__image">
                    <div className="image__line">
                        <Img image={{ src: portfolio.list[0].portfolio_img, content_width: 680, content_height: 340 }} />
                    </div>
                    <div className="image__line">
                        <Img image={{ src: portfolio.list[1].portfolio_img, content_width: 320, content_height: 320 }} />
                        <Img image={{ src: portfolio.list[2].portfolio_img, content_width: 320, content_height: 320 }} />
                        <Img image={{ src: portfolio.list[3].portfolio_img, content_width: 320, content_height: 320 }} />
                    </div>
                </div>
            );
        }

        return null;
    }
}

ProductsTop.propTypes = {
    category: PropTypes.string,
    portfolio: PropTypes.shape([PropTypes.node]),
    main_img: PropTypes.string
};

export default ProductsTop;
