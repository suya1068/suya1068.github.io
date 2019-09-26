import "./reserveComplete.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";

const MAX_COUNT = 10;

export default class ReserveComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reserve_list: props.reserve_list,
            enter: props.enter
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const list = this.state.reserve_list;
        this.setState({
            newList: this.setMainReserveList(list)
        });
    }

    componentDidMount() {
        const { reserve_list } = this.props;
        if (reserve_list && Array.isArray(reserve_list) && reserve_list.length) {
            this.mainReserve = new Swiper(".complete_list", {
                // slidesPerView: 2.5,
                slidesPerView: "auto",
                loop: true,
                spaceBetween: 5,
                setWrapperSize: true
            });
        }
    }

    setMainReserveList(list) {
        let changeList = list;
        const emptyList = [];
        if (list.length > MAX_COUNT) {
            for (let i = 0; i < MAX_COUNT; i += 1) {
                emptyList.push(list[i]);
            }
            changeList = emptyList;
        }

        return changeList;
    }

    moveProduct(e, data, type) {
        // e.preventDefault();
        this.gaEvent(data);
        // const node = e.currentTarget;
        // location.href = node.href;
    }

    gaEvent(data) {
        const { category, nick_name, product_no } = data;
        let label = "";
        if (category && nick_name && product_no) {
            label = `${category}_${nick_name}_${product_no}`;
        }

        utils.ad.gaEvent("M_개인_메인", "최근예약된상품", label);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("최근예약상품");
        }
    }

    render() {
        const { newList } = this.state;

        return (
            <div className="m_main-reserve-complete">
                <h3 className="recently_text">최근 예약된 상품</h3>
                <div className="complete_list swiper-container">
                    <div className="test swiper-wrapper">
                        {newList.map((obj, idx) => {
                            let topContent;
                            let bottomContent;
                            const gaData = {};
                            const type_order_flag = obj.reserve_type === "order";
                            if (!type_order_flag) { // type : product
                                gaData.title = obj.title;
                                gaData.product_no = obj.product_no;
                                if (obj.thumb_img) {
                                    topContent = (
                                        <div className="top-content">
                                            <img role="presentation" src={`${__SERVER__.thumb}/normal/crop/200x200${obj.thumb_img}`} />
                                        </div>
                                    );
                                    bottomContent = (
                                        <p className="title">{obj.title}</p>
                                    );
                                }
                            } else {   // type : order
                                gaData.category_name = obj.category_name;
                                gaData.nick_name = obj.nick_name;
                                topContent = (
                                    <div className="top-content">
                                        <img role="presentation" src={`${__SERVER__.thumb}/normal/crop/200x200${obj.thumb_img}`} />
                                        {/*<p className="order_content">*/}
                                        {/*{obj.content}*/}
                                        {/*</p>*/}
                                    </div>
                                );
                                bottomContent = (
                                    <p className="title">
                                        {`견적상품 - [ ${obj.category_name} ]`}
                                    </p>
                                );
                            }

                            let url = "";
                            let target = "_self";
                            if (type_order_flag) {
                                url = `/@${obj.nick_name}`;
                            } else {
                                url = `/products/${obj.product_no}`;
                                target = "_blank";
                            }

                            return (
                                <a
                                    role="button"
                                    onClick={e => this.moveProduct(e, gaData, obj.reserve_type)}
                                    //onClick={() => this.gaEvent(gaData, obj.reserve_type)}
                                    className="list-unit swiper-slide"
                                    key={`complete-unit__${idx}`}
                                    href={url}
                                    target={target}
                                    // href={type_order_flag ? `/artists/${artist_id}/about` : `/products/${obj.product_no}`}
                                >
                                    {topContent}
                                    <div className="bottom-content">
                                        {bottomContent}
                                        <div className="content-inner">
                                            <div className="content-foot">
                                                <p className="nick">{obj.nick_name}</p>
                                                <p className="test">작가님</p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
