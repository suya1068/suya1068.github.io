import "./productSelect.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import DropDown from "desktop/resources/components/form/Dropdown";

export default class ProductSelect_bak extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { name: "상품을 선택해주세요.", value: "" }
            ],
            selectProduct: "",
            freeCategory: ["INTERIOR", "VIDEO_BIZ", "PROFILE_BIZ"]
        };
        this.onSelect = this.onSelect.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.combineProducts = this.combineProducts.bind(this);
        this.checkFreeCategoryProduct = this.checkFreeCategoryProduct.bind(this);
    }

    componentWillReceiveProps(np) {
        if (this.props.list.length !== np.list.length) {
            const { list } = this.state;
            const p = this.combineProducts(np.list);
            this.setState({
                list: list.concat(p)
            });
        }
    }

    /**
     * 드랍박스 형식에 맞게 리스트를 조정한다.
     */
    combineProducts(list) {
        const data = list.reduce((result, p) => {
            if (p.display_yn === "Y" && utils.checkCategoryForEnter(p.category_code)) {
                result.push({ value: p.product_no, name: `[${p.category_name}] ${p.title}`, category: p.category_code });
            }
            return result;
        }, []);
        return data;
    }

    /**
     * 셀렉트 박스 선택 상품 저장
     */
    onSelect(value) {
        this.setState({
            selectProduct: value
        }, () => {
            if (typeof this.props.onSelectProduct === "function") {
                this.props.onSelectProduct(this.getProduct());
            }
        });
    }

    /**
     * 선택 상품 조회
     */
    getProduct() {
        const { list, selectProduct } = this.state;
        const target = list.filter(p => p.value === selectProduct)[0];
        return { product_no: selectProduct, title: target.name, category: target.category };
    }

    /**
     * 무료 카테고리 항목인지 체크
     * @returns {boolean}
     */
    checkFreeCategoryProduct() {
        const { list, selectProduct, freeCategory } = this.state;
        const target = list.filter(p => p.value === selectProduct)[0];
        return freeCategory.includes(target.category);
    }

    render() {
        const { selectProduct, list } = this.state;
        return (
            <div className="charge-artist__row charge-artist__select">
                <div className="charge-artist__column">
                    <p className="column__title">상품선택</p>
                    <div className="column__content">
                        <DropDown list={list} select={selectProduct} size="small" width="w412" icon="triangle_dt" resultFunc={value => this.onSelect(value)} />
                    </div>
                    <div className="column__caption">
                        <span className="column__caption__title">현재 노출 중인 상품만 신청가능합니다.</span>
                    </div>
                </div>
                {this.checkFreeCategoryProduct() &&
                <div className="charge-artist__column">
                    <p className="column__title">{}</p>
                    <div className="column__content">
                        <ul className="free-category-info">
                            <li className="free-info">해당 상품은 무료등록 이벤트 카테고리에 해당됩니다.</li>
                            <li className="free-info">최대 2주간 무료로 등록가능하며, 관리자 승인과 함께 결제단계없이 바로 광고영역에 등록됩니다.</li>
                            <li className="free-info">해당이벤트는 선착순진행되며 당사 사정에 의해 임의 종료될 수 있습니다.</li>
                        </ul>
                    </div>
                    <div className="column__caption">
                        <span className="column__caption__title">{}</span>
                    </div>
                </div>
                }
            </div>
        );
    }
}
