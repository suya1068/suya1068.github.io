import "./portfolioProduct.scss";
import React, { Component, PropTypes } from "react";
import Profile from "desktop/resources/components/image/ProfileXHR";
import Img from "desktop/resources/components/image/Img";
import Buttons from "desktop/resources/components/button/Buttons";

export default class PortfolioProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            profile_img: props.profileImg,
            onMove: props.onMove,
            onDeleteToProduct: props.onDeleteToProduct
        };
    }

    onClick(pNo) {
        if (typeof this.props.onMove === "function") {
            this.props.onMove(pNo);
        }
    }

    onDelete(pNo) {
        if (typeof this.props.onDeleteToProduct === "function") {
            this.props.onDeleteToProduct(pNo);
        }
    }

    onPortfolioView(pNo) {
        if (typeof this.props.onViewToPortfolio === "function") {
            this.props.onViewToPortfolio(pNo);
        }
    }

    render() {
        const { list, profile_img } = this.state;
        return (
            <div className="estimate-portfolio-product">
                {this.props.list.map((obj, idx) => {
                    return (
                        <div className="product" key={`estimate-portfolio-product__${obj.portfolio_no}`}>
                            <div className="box" onClick={() => this.onPortfolioView(obj.portfolio_no)}>
                                <div className="image-part">
                                    <div className="background-wrap">
                                        <p>포트폴리오 보기</p>
                                    </div>
                                    <Img image={{ src: `/${obj.thumb_key}`, type: "private", default: "/common/forsnap_bg_default.jpg" }} isCrop />
                                    <div className="profile">
                                        <Profile image={{ src: profile_img }} />
                                    </div>
                                </div>
                                <div className="content-part">
                                    <p className="category-name">카테고리: {obj.category_name}</p>
                                    <p className="product-title">{obj.title}</p>
                                </div>
                            </div>
                            <div className="product-button">
                                <Buttons buttonStyle={{ size: "small", width: "w68", shape: "circle", theme: "default" }} inline={{ className: "del", onClick: () => this.onDelete(obj.portfolio_no) }}>삭제</Buttons>
                                <Buttons buttonStyle={{ size: "small", width: "w68", shape: "circle", theme: "default" }} inline={{ className: "edit", onClick: () => this.onClick(obj.portfolio_no) }}>변경</Buttons>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
