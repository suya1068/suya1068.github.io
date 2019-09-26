import "./product.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import Profile from "desktop/resources/components/image/Profile";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
// import CONSTANT from "shared/constant";
import Icon from "desktop/resources/components/icon/Icon";
import Checkbox from "desktop/resources/components/form/Checkbox";
// import cookie from "forsnap-cookie";
import A from "shared/components/link/A";

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
            checkList: {
                enter: false
            },
            //
            enter_list: [],
            has_enter_product: false,
            has_ordinary_product: false
        };
        this.onMore = this.onMore.bind(this);
        this.composeProductData = this.composeProductData.bind(this);
        this.onCheckProduct = this.onCheckProduct.bind(this);
    }

    componentWillMount() {
        const { product } = this.state;
        this.initProductData(product);
    }

    /**
     * 기업상품 모아보기
     * @param value
     */
    onCheckProduct(value) {
        const { checkList } = this.state;
        PopModal.progress();

        if (checkList) {
            checkList.enter = !!value;

            this.composeProductData(checkList);
        }
    }

    /**
     * 더보기 버튼 액션
     */
    onMore() {
        PopModal.progress();
        const { list, enter_list, checkList } = this.state;
        let { render_list } = this.state;
        let _list = list;

        if (checkList.enter) {
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


        setTimeout(() => {
            this.setState({
                render_list,
                offset,
                isMore
            }, () => {
                PopModal.closeProgress();
            });
        }, 200);
    }

    /**
     * 상품정보 초기화
     */
    initProductData(product = this.state.product) {
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
    composeProductData(checkList) {
        const { product, enter_list } = this.state;
        let _list = [];

        if (checkList.enter) {
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
            checkList
        }, () => {
            PopModal.closeProgress();
        });
    }


    render() {
        const { render_list, profile_img, isMore, has_enter_product, has_ordinary_product } = this.state;
        let content = "";
        if (utils.isArray(render_list) && render_list.length > 0) {
            content = (
                <div className="product-list">
                    {render_list.map((obj, idx) => {
                        const category = obj.category_code || "";
                        let url = "";
                        if (!utils.checkCategoryForEnter(category)) {
                            url = `/products/${obj.product_no}?new=true`;
                        } else {
                            url = `/portfolio/${obj.product_no}`;
                        }
                        return (
                            <A
                                className="product-item"
                                href={url}
                                target="_blank"
                                key={`about-artist-product-item__${idx}`}
                            >
                                <div className="image-part">
                                    <Img image={{ src: obj.thumb_img, content_width: 504, content_height: 504 }} isCrop />
                                </div>
                                <div className="content-part">
                                    <div className="content-part_profile">
                                        <Profile image={{ src: profile_img }} size="small" />
                                    </div>
                                    <div className="product-id">
                                        <p className="title">{obj.title}</p>
                                        {/*<p className="price">{utils.format.price(obj.price)}원</p>*/}
                                    </div>
                                </div>
                                <div className="category-name">{ obj.category_name }</div>
                            </A>
                        );
                    })}
                </div>
            );
        } else {
            content = (
                <div className="about-artist-product-list_none">
                    <p className="text">상품이 없습니다.</p>
                    <div className="image-wrap">
                        <Icon name="camera_disabled" />
                    </div>
                </div>
            );
        }

        return (
            <section className="about-artist-rightside_product">
                <h2 className="title">등록상품</h2>
                {has_enter_product && has_ordinary_product &&
                    <div className="product-check-box">
                        <Checkbox type="yellow_small" checked={false} resultFunc={this.onCheckProduct}>기업촬영모아보기</Checkbox>
                    </div>
                }
                {content}
                {isMore ? <button className="f__button f__button__block" onClick={this.onMore}>상품 더보기</button> : null}
            </section>
        );
    }
}
