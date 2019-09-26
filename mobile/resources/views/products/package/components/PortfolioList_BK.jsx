import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import ImageGallery from "shared/components/gallery/ImageGallery";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import PortfolioContainer from "mobile/resources/views/products/portfolio/PortfolioContainer";
import PortfolioView from "./PortfolioView";

import Portfolio from "mobile/resources/components/portfolio/PortfolioContainer";
import PopModal from "shared/components/modal/PopModal";

class PortfolioList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view_list: [],
            isLoading: true,
            limit: 12
        };

        this.onMorePortfolio = this.onMorePortfolio.bind(this);
        this.portfolioView = this.portfolioView.bind(this);
        this.getPortfolioList = this.getPortfolioList.bind(this);
    }

    componentWillMount() {
        const { list, data, category } = this.props;
        const images = [];
        let total = 0;
        let axis_type = "x";

        if (list && utils.isArray(list)) {
            let vertical_type_count = 0;

            list.reduce((r, o) => {
                const width = Number(o.width);
                const height = Number(o.height);

                const vertical_ratio = width < height; // ? 세로형 : 가로형
                let fullVertical = false;

                // console.log(i, "width:", width, "\theight: ", height, "\tratio:", vertical_ratio);

                if (vertical_ratio) {
                    vertical_type_count += 1;
                    if (width / height > 0.75) {
                        fullVertical = true;
                    }
                }

                r.push({
                    type: "image",
                    no: Number(o.portfolio_no),
                    display_order: Number(o.display_order),
                    url: o.portfolio_img,
                    src: o.portfolio_img,
                    width: 138,
                    height: 138,
                    thumb: false,
                    vertical_type: vertical_ratio,
                    full_size: fullVertical
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
            product_no: data.product_no,
            title: data.title,
            category: category,
            total
        };

        this.setState({
            images,
            information,
            axis_type
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                view_list: this.getPortfolioList(0, this.state.limit)
            });
        }, 1000);
    }

    componentWillUnmount() {
    }

    onMorePortfolio() {
        this.setState(state => {
            return {
                view_list: state.view_list.concat(this.getPortfolioList(state.view_list.length, state.limit))
            };
        });
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("포트폴리오 더보기", "", true);
        }
    }

    portfolioView(idx) {
        // const { images, information } = this.state;
        const { images, information, axis_type } = this.state;
        const { data, category } = this.props;
        // const modalName = "portfolio_preview";
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("포트폴리오", `카테고리: ${category} / 작가명: ${information.artist_name} / 상품번호: ${data.no}, 이미지주소: ${images[idx].url}`);
        }

        const modal_name = "forsnap-portfolio";
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     name: modalName,
        //     full: true,
        //     content: (
        //         <PortfolioView name={modalName}>
        //             <PortfolioContainer images={images} information={information} index={idx} />
        //         </PortfolioView>
        //     )
        // });
        const content = <Portfolio images={images} axis_type={axis_type} information={information} active_index={idx + 1} onClose={() => PopModal.close(modal_name)} />;

        PopModal.createModal(modal_name, content, { modal_close: false, className: modal_name });
        PopModal.show(modal_name);
    }

    getPortfolioList(offset, limit) {
        const { images } = this.state;
        const tempList = [];

        for (let i = offset; i < offset + limit; i += 1) {
            const item = images[i];

            if (item) {
                tempList.push(item);
            }
        }

        return tempList;
    }

    render() {
        const { images, view_list } = this.state;

        if (!utils.isArray(view_list)) {
            return null;
        }

        return (
            <div className="product-detail-portfolio-wrapper" id="target-scroll">
                <ImageGallery images={view_list} thumbHeight={138} imageHeight={320} min={3} max={3} radius="0" thumbCrop thumbGap={3} onClick={this.portfolioView} isSame />
                {images.length > view_list.length ?
                    <button className="f__button f__button__block f__button__round" onClick={this.onMorePortfolio}>더보기</button> : null
                }
            </div>
        );
    }
}

PortfolioList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired
};

PortfolioList.defaultProps = {
    list: []
};

export default PortfolioList;
