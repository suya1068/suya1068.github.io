import "./product.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import classNames from "classnames";
import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";
import A from "shared/components/link/A";
import PopModal from "shared/components/modal/PopModal";

const LIMIT = 6;

export default class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nick_name: props.nick_name || "",
            product: props.product,
            list: [],
            render_list: [],
            profile_img: props.profile_img || "",
            offset: 0,
            isMore: false,
            checked: false,
            isLoading: true,
            //
            enter_list: [],
            has_enter_product: false,
            has_ordinary_product: false
        };
        this.onMore = this.onMore.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.composeProductData = this.composeProductData.bind(this);
        this.setLoadingFlag = this.setLoadingFlag.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }
    componentWillMount() {
        const { product } = this.state;
        this.initProductData(product);
        window.addEventListener("scroll", this.onScroll);
        // this.composeProductData(this.state.product);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    /**
     * 스크롤 이벤트
     * @param e
     */
    onScroll(e) {
        const { render_list, list, checked, isMore } = this.state;
        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);

        // if ((scrollTop + clientHeight) === scrollHeight && list.length > render_list.length) {
        //     this.onMore();
        // }
        if (clientHeight + scrollTop >= (scrollHeight - 290) && list.length > render_list.length && isMore) {
            // this.onMore();
            this.setLoadingFlag();
        }
    }

    /**
     * 기업촬영모아보기 체크 이벤트
     */
    onCheck() {
        this.composeProductData(!this.state.checked);
    }

    /**
     * 더보기 기능
     */
    onMore() {
        PopModal.progress();
        const { list, enter_list, checked } = this.state;
        let { render_list } = this.state;
        let _list = list;

        if (checked) {
            _list = enter_list;
        }

        const max = this.state.offset + LIMIT > _list.length ? _list.length : this.state.offset + LIMIT;
        let offset = this.state.offset;

        if (offset < max) {
            for (let i = this.state.offset; i < max; i += 1) {
                render_list.push(_list[i]);
                offset += 1;
            }
        } else {
            render_list = _list;
        }

        const isMore = _list.length > offset + 1;

        this.setState({
            render_list,
            offset,
            isMore,
            isLoading: true
        }, () => {
            PopModal.closeProgress();
        });
    }

    setLoadingFlag() {
        if (this.state.isLoading) {
            this.setState({
                isLoading: false
            }, () => {
                if (!this.state.isLoading) {
                    this.onMore();
                }
            });
        }
    }

    /**
     * 상품 데이터 초기화
     * @param product
     */
    initProductData(product = this.state.products) {
        const _list = product.list;           // 임시배열
        const _enter_list = _list.filter(item => utils.checkCategoryForEnter(item.category_code));
        const _ordinary_product = _list.filter(item => !utils.checkCategoryForEnter(item.category_code));
        let has_enter_product = false;        // 기업카테고리 상품 보유 여부 상태값
        let has_ordinary_product = false;
        const { list, offset } = this.setInitList(_list, this.state.offset);
        const isMore = this.setIsMore(_list);

        if (_enter_list.length > 0) {
            _enter_list.total_cnt = _enter_list.length;
            has_enter_product = true;
        }

        if (_ordinary_product.length > 0) {
            has_ordinary_product = true;
        }

        this.setState({
            list: _list,
            render_list: list,
            enter_list: _enter_list,
            offset,
            has_enter_product,
            has_ordinary_product,
            isMore
        });
    }


    /**
     * 리스트를 초기화한다.
     * @param list
     * @param offset
     * @returns {{list: Array, offset: *}}
     */
    setInitList(list, offset) {
        const _list = [];
        const limit = list.length > LIMIT ? LIMIT : list.length;

        for (let i = 0; i < limit; i += 1) {
            _list.push(list[i]);
            offset += 1;
        }

        return { list: _list, offset };
    }

    /**
     * 더보기 여부 판단
     * @param list
     * @returns {boolean}
     */
    setIsMore(list) {
        return list.length > LIMIT;
    }

    /**
     * 기업상품모아보기 로직
     */
    composeProductData(checked) {
        const { product, enter_list } = this.state;
        let _list = [];

        if (checked) {
            _list = enter_list;
        } else {
            _list = product.list;
        }

        const { list, offset } = this.setInitList(_list, this.state.offset);

        const isMore = this.setIsMore(_list);

        this.setState({
            render_list: list,
            offset,
            isMore,
            checked
        }, () => {
            PopModal.closeProgress();
        });
    }

    render() {
        const { render_list, profile_img, nick_name, has_enter_product, has_ordinary_product } = this.state;

        let content = "";
        if (utils.isArray(render_list) && render_list.length > 0) {
            content = (
                <ul className="artist_product_list">
                    {render_list.map((obj, idx) => {
                        const category = obj.category_code || "";
                        let url = `/portfolio/${obj.product_no}`;
                        if (!utils.checkCategoryForEnter(category)) {
                            url = `/products/${obj.product_no}?new=true`;
                        }
                        return (
                            <li className="product_unit" key={`about-artist_product__${idx}`}>
                                <a
                                    role="button"
                                    href={url}
                                    target="_blank"
                                >
                                    <div className="image-part">
                                        <Img image={{ src: obj.thumb_img, content_width: 200, content_height: 200 }} />
                                    </div>
                                    <div className="content-part">
                                        <div className="profile">
                                            <Img image={{ src: profile_img, content_width: 90, content_height: 90 }} isCrop />
                                        </div>
                                        <div className="info">
                                            <div className="title">{obj.title}</div>
                                            {/*<div className="price">{utils.format.price(obj.price)}원</div>*/}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            );
        } else {
            const props = {
                mainCaption: "작가의 상품이 아직 없습니다.",
                subCaption: "",
                src: "/mobile/imges/f_img_bg_01.png",
                noneKey: "artist_product_list"
            };

            content = (
                <NoneList {...props} />
            );
        }

        return (
            <section className="about-artist_product">
                <h2 className="sr-only">{nick_name}작가님의 상품</h2>
                {content}
                {has_enter_product && has_ordinary_product &&
                    <div className="ignore-show-checkbox" onClick={this.onCheck}>
                        <div className={classNames("checkbox", this.state.checked ? "active" : "")}>
                            <i className={classNames("m-icon", this.state.checked ? "m-icon-check-white" : "m-icon-check")} />
                        </div>
                        기업촬영모아보기
                    </div>
                }
            </section>
        );
    }
}

Product.propTypes = {
    nick_name: PropTypes.string,
    product: PropTypes.shape([PropTypes.node]),
    profile_img: PropTypes.string
};

Product.defaultProps = {
    nick_name: "",
    product: {},
    profile_img: ""
};
