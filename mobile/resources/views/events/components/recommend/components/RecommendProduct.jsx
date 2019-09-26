import "./recommedProduct.scss";
import React, { Component } from "react";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";

export default class RecommendProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list
        };
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        if (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)) {
            this.setState({
                list: nextProps.list
            });
        }
    }

    onRecommendEvent(e) {
        e.preventDefault();
        const node = e.currentTarget;
        const eCategory = "페이백이벤트";
        const eAction = "";
        const eLabel = "촬영상품";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        location.href = node.href;
    }

    renderRecommendList(list) {
        let contents = "";
        if (Array.isArray(list) && list.length > 0) {
            contents = (
                list.map((obj, idx) => {
                    return (
                        <a
                            className="event-recommend-unit"
                            key={`event_recommend__category-${obj.category}__${idx}`}
                            href={`/products/${obj.product_no}`}
                            onClick={this.onRecommendEvent}
                        >
                            <div className="unit-box">
                                <div className="unit-box-imageSide">
                                    <Img image={{ src: obj.thumb_img }} isCrop />
                                </div>
                                <div className="unit-box-contentSide">
                                    <p className="title">{obj.title}</p>
                                    <p className="price">{`${utils.format.price(obj.price)} 원`}</p>
                                </div>
                            </div>
                        </a>
                    );
                })
            );
        } else {
            contents = (
                <div className="none-list">
                    <p>리스트가 없어용</p>
                </div>
            );
        }

        return contents;
    }

    render() {
        const { list } = this.state;
        return (
            <article className="event-recommend-product">
                <h4 className="sr-only">상품이름</h4>
                <div className="event-recommend-product__heading">
                    <p className="event-recommend-product__heading-title">나에게 꼭 맞는 촬영상품</p>
                    <p className="event-recommend-product__heading-description">예약하고 <strong>페이백 받기</strong></p>
                </div>
                <div className="event-recommend-list">
                    {this.renderRecommendList(list)}
                </div>
            </article>
        );
    }
}
