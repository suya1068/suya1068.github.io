import "./reserveComplete.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";

const MAX_COUNT = 10;

export default class ReserveComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enter: props.enter
        };

        this.renderList = this.renderList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    /**
     * 스와이프 환경 설정
     */
    setSwiperConfig() {
        const { reserve_list } = this.props;
        if (reserve_list && Array.isArray(reserve_list) && reserve_list.length) {
            const option = {
                slidesPerView: "auto",
                spaceBetween: 6,
                setWrapperSize: true,
                nextButton: ".main-reserve-arrow.right",
                prevButton: ".main-reserve-arrow.left"
            };

            if (reserve_list.length > 5) {
                option.grabCursor = true;
                option.loop = true;
                option.autoplay = 5000;
                option.autoplayDisableOnInteraction = false;
            }

            this.mainReserve = new Swiper(".complete_list", option);
        }
    }

    /**
     * 클릭 시 해당 상품으로 이동한다.
     */
    movePage(e, data, type) {
        // e.preventDefault();
        this.gaEvent(data);
        // const node = e.currentTarget;
        // location.href = node.href;
    }

    /**
     * ga이벤트 값을 설정한다.
     */
    gaEvent(data) {
        // const isOrder =
        //     type === "order" ? `견적상품: ${data.category_name} / 작가: ${data.nick_name}` : `상품번호: ${data.product_no} / 상품명: ${data.title}`;
        // const eCategory = "메인최근예약상품선택";
        // const eAction = "";
        // const eLabel = isOrder;
        utils.ad.gaEvent("개인_메인", "최근예약상품", `${data.category}_${data.nick_name}_${data.product_no}`);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("최근예약상품");
        }
    }

    renderList() {
        const { reserve_list } = this.props;
        const content = [];

        for (let i = 0; i < MAX_COUNT; i += 1) {
            if (i > (reserve_list.length - 1)) {
                break;
            }

            const obj = reserve_list[i];
            let topContent;
            let bottomContent;
            const gaData = {};

            const type_order_flag = obj.reserve_type === "order";
            if (!type_order_flag) { // type : product
                gaData.title = obj.title;
                gaData.category = obj.category;
                if (obj.thumb_img) {
                    topContent = (
                        <div className="top-content">
                            <img role="presentation" src={`${__SERVER__.thumb}/normal/crop/300x200${obj.thumb_img}`} />
                        </div>
                    );
                    bottomContent = (
                        <div className="bottom-content">
                            <p className="title">{obj.title}</p>
                        </div>
                    );
                }
            } else {   // type : order
                gaData.category_name = obj.category_name;
                gaData.category = obj.category_name;
                topContent = (
                    <div className="top-content">
                        <img role="presentation" src={`${__SERVER__.thumb}/normal/crop/300x200${obj.thumb_img}`} />
                        {/*<p className="order_content">*/}
                        {/*{obj.content}*/}
                        {/*</p>*/}
                    </div>
                );
                bottomContent = (
                    <div className="bottom-content">
                        <p className="title">
                            {`견적상품 - [ ${obj.category_name} ]`}
                        </p>
                    </div>
                );
            }
            gaData.product_no = obj.product_no;
            gaData.nick_name = obj.nick_name;

            content.push(
                <a
                    role="button"
                    //onClick={() => this.gaEvent(gaData, obj.reserve_type)}
                    onClick={e => this.movePage(e, gaData, obj.reserve_type)}
                    className="list-unit swiper-slide"
                    key={`complete-unit__${i}`}
                    href={utils.query.addQuery(type_order_flag ? `/@${obj.nick_name}` : `/products/${obj.product_no}`, this.props.enter)}
                    target="_blank"
                    // href={type_order_flag ? `/artists/${artist_id}/about` : `/products/${obj.product_no}`}
                >
                    {topContent}
                    {bottomContent}
                    <div className="content-foot">
                        <p className="nick">{obj.nick_name}</p>
                        <p className="test">작가님</p>
                    </div>
                </a>
            );
        }

        return content;
    }

    render() {
        const { reserve_list } = this.props;

        return (
            <div className="main-reserve-complete">
                <div className="container">
                    <h1 className="section-title">최근 예약 상품</h1>
                    <div className="main-reserve-list">
                        <div className="complete_list swiper-container">
                            <div className="test swiper-wrapper">
                                {this.renderList()}
                            </div>
                        </div>
                        {reserve_list && Array.isArray(reserve_list) && reserve_list.length > 5 ? [
                            <div key="btn_prev" className="main-reserve-arrow left"><i className="_icon__arrow__ml action" /></div>,
                            <div key="btn_next" className="main-reserve-arrow right"><i className="_icon__arrow__mr action" /></div>] : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ReserveComplete.propTypes = {
    reserve_list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    enter: PropTypes.string
};
