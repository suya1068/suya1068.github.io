import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import ImageGallery from "shared/components/gallery/ImageGallery";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
//
// import PortfolioView from "desktop/resources/views/artists/estimateManager/portfolio/components/PortfolioView";
// import PortfolioContainer from "desktop/resources/views/products/portfolio/PortfolioContainer";

import Portfolio from "desktop/resources/components/portfolio/PortfolioContainer";
import PopModal from "shared/components/modal/PopModal";

class PortfolioList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: props.list,
            category: props.category,
            portfolio: [],
            limit: 6,
            def_width: 1400,
            def_height: 1000
        };
        this.composeList = this.composeList.bind(this);
        this.portfolioView = this.portfolioView.bind(this);
    }

    componentWillMount() {
        this.composeList(this.state.list);
    }

    composeList(list) {
        const { data } = this.props;
        const images = [];
        let total = 0;
        let axis_type = "x";

        if (list && utils.isArray(list)) {
            let vertical_type_count = 0;
            list.reduce((r, o, i) => {
                const width = Number(o.width);
                const height = Number(o.height);

                const vertical_ratio = width < height; // ? 세로형 : 가로형

                // console.log(i, "width:", width, "\theight: ", height, "\tratio:", vertical_ratio);

                if (vertical_ratio) {
                    vertical_type_count += 1;
                }
                r.push({
                    type: "image",
                    no: Number(o.portfolio_no),
                    display_order: Number(o.display_order),
                    url: o.portfolio_img,
                    src: o.portfolio_img,
                    width: 206,
                    height: 206,
                    thumb: false,
                    vertical_type: vertical_ratio
                });
                return r;
            }, images);
            total += images.length;

            if (Math.round((list.length / 2)) < vertical_type_count) {
                axis_type = "y";
            }
        }

        const information = {
            profile_img: data.profile_img,
            artist_name: data.nick_name,
            title: data.title,
            category: data.category,
            product_no: data.product_no,
            total
        };

        this.setState({
            images,
            information,
            axis_type
        });
    }

    // portfolioView(idx) {
    //     const { images, information } = this.state;
    //     const { data, category } = this.props;
    //     const modalName = "portfolio_preview";
    //
    //     if (typeof this.props.gaEvent === "function") {
    //         this.props.gaEvent("포트폴리오", `카테고리: ${category} / 작가명: ${information.artist_name} / 상품번호: ${data.no}, 이미지주소: ${images[idx].url}`);
    //     }
    //
    //     Modal.show({
    //         type: MODAL_TYPE.CUSTOM,
    //         name: modalName,
    //         full: true,
    //         content: (
    //             <PortfolioView name={modalName}>
    //                 <PortfolioContainer images={images} information={information} index={idx} />
    //             </PortfolioView>
    //         )
    //     });
    // }

    portfolioView(idx) {
        const { images, information, axis_type } = this.state;
        const { data, category } = this.props;
        const modal_name = "forsnap-portfolio";

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("포트폴리오", `카테고리: ${category} / 작가명: ${information.artist_name} / 상품번호: ${data.no}, 이미지주소: ${images[idx].url}`);
        }

        const content = <Portfolio images={images} axis_type={axis_type} information={information} active_index={idx + 1} onClose={() => PopModal.close(modal_name)} />;

        PopModal.createModal(modal_name, content, { modal_close: false, className: modal_name });
        PopModal.show(modal_name);
    }

    render() {
        const { images } = this.state;
        return (
            <ImageGallery images={images} thumbHeight={206} imageHeight={320} min={3} max={3} radius="0" onClick={this.portfolioView} thumbCrop isSame />
        );
    }
}

PortfolioList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    data: PropTypes.shape([PropTypes.node])
};

PortfolioList.defaultProps = {
    list: []
};

export default PortfolioList;
