import "./portfolioList.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
// import Img from "shared/components/image/Img";
import Img from "desktop/resources/components/image/Img";
import ImageController from "shared/components/image/image_controller";
import utils from "forsnap-utils";

class PortfolioList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: props.list,
            imageType: props.imageType,
            portfolio: [],
            limit: 3,
            def_width: utils.agent.isMobile() ? 504 : 1400,
            def_height: utils.agent.isMobile() ? 504 : 1000
        };

        this.onMore = this.onMore.bind(this);
        this.moreTest = this.moreTest.bind(this);
    }

    componentWillMount() {
        this.moreTest();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.list !== this.state.list) {
            this.moreTest();
        }
    }

    onMore() {
        // if (typeof this.props.onMorePortfolio === "function" && this.props.imageType === "private") {
        //     this.props.onMorePortfolio();
        // }
        this.moreTest();

        // if (this.props.imageType !== "private") {
        //     this.moreTest();
        // }
    }

    moreTest() {
        const { list } = this.props;
        const { portfolio, limit, def_width, def_height, imageType } = this.state;

        if (Array.isArray(list) && list.length > 0) {
            // const length = 0;
            const length = Array.isArray(portfolio) ? portfolio.length : 0;
            const maxLength = list.length;

            if (length < maxLength) {
                for (let i = length; i < (length + limit); i += 1) {
                    const item = list[i];
                    const early = list[i + limit];

                    if (item) {
                        portfolio.push(item);
                    }

                    if (early) {
                        let src;
                        if (imageType === "private") {
                            src = `${__SERVER__.thumb}/signed/resize/${def_width}x${def_height}/${early.thumb_key}`;
                        } else {
                            src = `${__SERVER__.thumb}/normal/resize/${def_width}x${def_height}${early.portfolio_img}`;
                        }
                        ImageController.addImage({ src });
                    }
                }

                this.setState({
                    portfolio
                });
            }
        }
    }

    render() {
        const { portfolio, def_width, def_height, imageType } = this.state;
        const { list } = this.props;
        let length = 0;
        let maxLength = 0;

        if (Array.isArray(list)) {
            maxLength = list.length;
        }

        if (Array.isArray(portfolio)) {
            length = portfolio.length;
        }

        const isMore = length < maxLength;
        const isImageTypePrivate = imageType === "private";

        return (
            <div className={classNames("products__portfolio__list", { show: length })}>
                {portfolio.map((p, idx) => {
                    const src = isImageTypePrivate ? `/${p.thumb_key}` : p.portfolio_img;
                    const img_key = isImageTypePrivate ? p.photo_no : p.portfolio_no;
                    return <Img key={`portfolio-item-${img_key}`} image={{ src, type: imageType, content_width: def_width, content_height: def_height }} isCrop={false} isContentResize />;
                })}
                {isMore ?
                    <button
                        className={classNames("button button-block button__rect", isMore ? "button__theme__white" : "button__theme__muted")}
                        onClick={() => this.onMore()}
                        style={{ cursor: "pointer" }}
                    >더보기<span className="portfolio__count">{length} / {maxLength}</span></button> : null
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
