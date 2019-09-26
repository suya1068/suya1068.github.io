import React, { Component, PropTypes } from "react";

import ProductPortfolioItem from "./ProductPortfolioItem";

import PopModal from "shared/components/modal/PopModal";
import FullSlider from "desktop/resources/components/image/FullSlider/FullSliderContainer";
// import FullSlider from "desktop/resources/components/image/FullSlider_bk/FullSliderContainer";
// import FullSlider from "desktop/resources/components/image/FullSlider/FullSliderContainer_originBK";
// import FullSlider from "desktop/resources/components/image/photoViewer/PhotoViewer";

class ProductPortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.showPortfolio = this.showPortfolio.bind(this);
    }

    /**
     * 포트폴리오 튼화면으로 보기 & 더보기
     */
    showPortfolio(idx) {
        if (this.props.enable_event) {
            const portfolio = this.props.list;
            const modalName = "product-portfolio";
            const data = this.props.data;
            const images = portfolio.reduce((result, obj) => {
                const image = {
                    src: obj.portfolio_img,
                    type: "thumb1",
                    width: obj.width,
                    height: obj.height
                };

                result.push(image);
                return result;
            }, []);
            //PopModal.createModal(modalName, <ImageSlider images={images} activeIndex={idx} isThumb />, { className: "modal-portfolio" });
            PopModal.createModal(modalName, <FullSlider images={images} viewType="portfolio" activeIndex={idx} data={data} />, { className: "modal-fullscreen slider", callBack: () => history.back() });
            PopModal.show(modalName);
        }
    }

    render() {
        const { total_cnt, list } = this.props;
        const total = total_cnt > 4 ? 4 : total_cnt;
        const items = [];

        for (let i = 0; i < total; i += 1) {
            const item = list[i];
            items.push(
                <ProductPortfolioItem
                    key={item.portfolio_no}
                    total_cnt={total_cnt}
                    {...item}
                    showPortfolio={this.showPortfolio}
                />
            );
        }

        return (
            <div className="products-detail__goodsInfo-left__image">
                { items }
            </div>
        );
    }
}

ProductPortfolio.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    total_cnt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({
        portfolio_no: PropTypes.string.isRequired,
        portfolio_img: PropTypes.string.isRequired,
        display_order: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired
    })).isRequired,
    enable_event: PropTypes.bool
};

ProductPortfolio.defaultProps = {
    enable_event: true
};

export default ProductPortfolio;
