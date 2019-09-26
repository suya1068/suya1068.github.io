import "./freeArtist.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";
import classNames from "classnames";

export default class FreeArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            category: props.category,
            renderList: [],
            pageLimit: 5,
            limit: 5,
            offset: 0,
            page: 1
        };
        this.onShow = this.onShow.bind(this);
    }

    componentWillMount() {
        const { data } = this.props;
        const { pageLimit } = this.state;
        const list = data.list;
        const maxPage = Math.ceil(list.length / pageLimit);
        this.setState({
            maxPage,
            renderList: this.setRenderList(list, maxPage)
        });
    }

    componentDidMount() {
        // this.configSwiper();
    }

    /**
     * 리스트를 조합한다.
     * @param list
     * @param max
     * @returns {Array}
     */
    setRenderList(list, max) {
        const { pageLimit } = this.state;
        const renderList = [];
        for (let i = 0; i < max; i += 1) {
            let pageIndex = 0;
            const items = [];
            const mod = list.length % pageLimit;

            const inNumber = list.length > (pageLimit * (i + 1)) + pageIndex;
            const realPageLimit = !inNumber && mod !== 0 ? mod : pageLimit;

            while (pageIndex < realPageLimit) {
                items.push(list[(pageLimit * i) + pageIndex]);
                pageIndex += 1;
            }
            renderList.push(items);
        }

        return renderList;
    }

    /**
     * 스와이퍼 설정
     */
    configSwiper() {
        this.freeArtist = new Swiper(".free-artist__swiper-container", {
            slidesPerView: 1,
            height: 0,
            onSlideChangeStart: swiper => {
                utils.ad.gaEvent("기업_리스트", "무료_페이징", this.props.category);
            },
            paginationClickable: true,
            pagination: ".free-artist__pages",
            paginationBulletRender: (swiper, index, className) => {
                return `<span class="slide_page ${className}">${utils.fillSpace(index + 1)}</span>`;
            }
        });
    }

    /**
     * 무료작가 상세페이지로 이동
     * @param item
     */
    onMoveDetail(item) {
        const baseURL = `/portfolio/${item.product_no}`;
        utils.ad.gaEvent("기업_리스트", "무료_리스트", `${item.category}_${item.nick_name}_${item.product_no}`);
        // location.href = baseURL;
        const myWindow = window.open("", "_blank");
        myWindow.location.href = baseURL;
    }

    /**
     * 무료 상품보기 클릭
     */
    onShow() {
        const { category } = this.props;
        this.setState({ isShow: true }, () => {
            utils.ad.gaEvent("기업_리스트", "무료_상품보기", `${category}`);
            this.configSwiper();
        });
    }

    render() {
        const { renderList, isShow } = this.state;
        return (
            <section className={classNames("product_list__free-artist free-artist", { "product__dist": isShow }, { "isShow": isShow })}>
                {!isShow ?
                    <div className="invisible-box">
                        <div className="invisible-box__head">
                            <h2 className="section-title">포스냅 제휴상품</h2>
                            <p className="caption">제휴상품은 포스냅 견적가가 보장되지 않습니다.</p>
                        </div>
                        <div className="invisible-box__content">
                            <div className="invisible-box__button">
                                <button className="_button" onClick={this.onShow}>상품보기</button>
                            </div>
                        </div>
                    </div> :
                    <div className="container">
                        <div className="free-artist__head">
                            <div className="free-artist__head__text">
                                <h2 className="section-title">포스냅 제휴상품</h2>
                                <span className="caption">제휴상품은 포스냅 견적가가 보장되지 않습니다.</span>
                            </div>
                        </div>
                        <div className="free-artist__swiper-container swiper-container">
                            <div className="free-artist__content swiper-wrapper">
                                {renderList.map((product, idx) => {
                                    return (
                                        <div className="free-artist__content__item-row swiper-slide" key={`free-artist__${idx}`}>
                                            {product.map((item, i) => {
                                                return (
                                                    <div className="free-artist__content__item" key={`free-artist__${idx}__${i}`} onClick={() => this.onMoveDetail(item)}>
                                                        <span className="title">{item.title}</span>
                                                        <span className="nick_name">By {item.nick_name}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="free-artist__pages" />
                    </div>
                }
            </section>
        );
    }
}
