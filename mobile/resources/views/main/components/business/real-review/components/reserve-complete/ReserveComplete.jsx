import "./reserveComplete.scss";
import React, { Component } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";
import A from "shared/components/link/A";

const MAX_COUNT = 10;

export default class ReserveComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.reserve.list || []
        };
        this.gaEvent_bizMain = this.gaEvent_bizMain.bind(this);
    }

    componentWillMount() {
        const list = this.state.list;
        this.setState({
            newList: this.setMainReserveList(list)
        });
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    /**
     * Swiper 옵션을 설정한다.
     */
    setSwiperConfig() {
        this.mainReserve = new Swiper(".reserve-complete-container__swiper-container", {
            slidesPerView: 2,
            loop: true,
            spaceBetween: 5,
            setWrapperSize: true,
            autoplay: 2000
        });
    }

    /**
     * 상품 클릭 시 페이지 전환
     * @param e
     */
    movePage(e) {
        // e.preventDefault();
        this.gaEvent_bizMain();
        // const node = e.currentTarget;
        // location.href = node.href;
    }

    /**
     * 예약상품의 갯수를 10개로 제한
     * @param list
     * @returns {*}
     */
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

    gaEvent_bizMain() {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = "최근예약상품선택";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(eLabel);
        }
    }

    render() {
        const { newList } = this.state;
        return (
            <article className="biz-reserve-complete-component reserve-complete">
                <h3 className="sr-only">최근 예약된 상품</h3>
                <div className="reserve-complete-container">
                    <p className="reserve-complete-container__title">최근 예약된 상품</p>
                    <div className="reserve-complete-container__swiper-container swiper-container">
                        <div className="reserve-complete-container__swiper-wrapper swiper-wrapper">
                            {Array.isArray(newList) && newList.length > 0 ?
                                newList.map((obj, idx) => {
                                    const type_order_flag = obj.reserve_type === "order";
                                    const title = type_order_flag ? `견적상품 - [ ${obj.category_name} ]` : obj.title;
                                    const gaData = {};
                                    if (type_order_flag) {
                                        gaData.category_name = obj.category_name;
                                        gaData.nick_name = obj.nick_name;
                                    } else {
                                        gaData.title = obj.title;
                                        gaData.product_no = obj.product_no;
                                    }

                                    let url = "";
                                    let target = "_self";
                                    if (type_order_flag) {
                                        url = utils.query.addQuery(`/@${obj.nick_name}`, this.props.enter);
                                    } else {
                                        url = utils.query.addQuery(`/portfolio/${obj.product_no}`, this.props.enter);
                                        target = "_blank";
                                    }

                                    return (
                                        <a
                                            role="button"
                                            className="reserve-complete-container__slide swiper-slide"
                                            onClick={e => this.movePage(e)}
                                            href={url}
                                            target={target}
                                            key={`reserve-complete__idx${idx}`}
                                        >
                                            <div className="slide-image">
                                                <img role="presentation" src={`${__SERVER__.thumb}/normal/crop/200x200${obj.thumb_img}`} />
                                            </div>
                                            <div className="slide-content">
                                                <p className="slide-title">{title}</p>
                                                <p className="slide-nick_name">{obj.nick_name}</p>
                                            </div>
                                        </a>
                                    );
                                }) : null
                            }
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}
