import React, { Component, PropTypes } from "react";

import Img from "desktop/resources/components/image/Img";


class ProductPortfolioItem extends Component {
    constructor(props) {
        super(props);

        this.showPortfolio = this.showPortfolio.bind(this);
    }

    showPortfolio(order) {
        this.props.showPortfolio(order - 1);
    }

    render() {
        const { total_cnt, display_order, portfolio_img } = this.props;
        const total = total_cnt * 1;
        const order = display_order * 1;

        return (
            <div className="columns col-4" onMouseUp={() => this.showPortfolio(order)}>
                <Img image={{ src: portfolio_img }} />
                {/* total > 4 && order === 4
                    ? <div className="addPortFoilo"><p className="h5">+ {total - 4 } 장</p></div>
                    : null
                */}
            </div>
        );
    }
}

ProductPortfolioItem.propTypes = {
    total_cnt: PropTypes.string.isRequired,
    display_order: PropTypes.string.isRequired,
    portfolio_img: PropTypes.string.isRequired,

    showPortfolio: PropTypes.func.isRequired
};

export default ProductPortfolioItem;
