import "./registBasicInfo.scss";
import React, { Component, PropTypes } from "react";

import Input from "desktop/resources/components/form/Input";
import Dropdown from "desktop/resources/components/form/Dropdown";
import CONSTANT from "shared/constant";

export default class RegistBasicInfo extends Component {
    constructor(props) {
        super(props);

        const category = CONSTANT.PRODUCTS_CATEGORY.reduce((result, obj) => {
            if (["광고", "의상대여"].indexOf(obj.name) === -1) {
                result.push(obj);
            }

            return result;
        }, []);

        this.state = {
            title: props.title,
            select_category: props.category_code,
            category,
            category_name: props.category_name,
            category_code: props.category_code
        };
        this.onSelectCategory = this.onSelectCategory.bind(this);
    }

    componentWillMount() {
        const { category, category_name, category_code } = this.state;
        if (category_code && category_name) {
            this.onSelectCategory(category_code);
        } else if (category[0].code !== "") {
            category.unshift({
                name: "선택해주세요",
                code: ""
            });
            this.setState({ category });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.setState({ ...nextProps });
        }
    }

    /**
     * 기본정보 입력 수정되었는지 체크
     * @returns {boolean}
     */
    getChangeBasicInfo() {
        const { title, select_category } = this.state;
        const is_change_title = title !== this.props.title;
        const is_change_category = select_category !== this.props.select_category;

        return is_change_category || is_change_title;
    }

    /**
     * 기본정보 유효성 체크
     * @returns {string}
     */
    validate() {
        const { title, select_category } = this.state;
        let message = "";
        if (!title) {
            message = "상품명을 입력해주세요.";
        } else if (!select_category) {
            message = "카테고리를 선택해주세요.";
        }

        return message;
    }

    /**
     * 카테고리 선택
     * @param value
     */
    onSelectCategory(value) {
        const category = this.state.category;
        const props = {
            select_category: value
        };

        if (this.state.select_category === "") {
            const index = category.findIndex(obj => {
                return obj.code === "";
            });

            if (index !== -1) {
                category.splice(index, 1);
                props.category = category;
            }
        }

        this.setState(props, () => {
            const c = category.find(o => o.code === value);
            if (c) {
                if (typeof this.props.onSelectCategory === "function") {
                    this.props.onSelectCategory(c.code);
                }
            }
        });
    }

    /**
     * 선택된 카테고리 반환
     * @returns {boolean|number|string|*}
     */
    getSelectCategory() {
        return this.state.select_category;
    }

    /**
     * 포트폴리오 타이틀 반환
     * @returns {String|*}
     */
    getTitle() {
        return this.state.title;
    }

    /**
     * 옵션명 입력 및 체크
     * @param e
     * @param value
     */
    replaceChar(e, value) {
        if (value.match(/[^{\s\d}{a-zA-Z}{{가-힣ㄱ-ㅎㅏ-ㅣ}{(),+\-}]+/) !== null) {
            const caption = e.currentTarget.parentNode.querySelector(".caption");
            const isChar = caption.getAttribute("data-is-char") === false;
            if (caption && !isChar) {
                caption.setAttribute("data-is-char", true);
                caption.textContent = "한글, 영문, 숫자, 특수문자 ( ) , + -만 입력가능합니다.";
            }
        } else {
            const caption = e.currentTarget.parentNode.querySelector(".caption");
            if (caption && caption.getAttribute("data-is-char")) {
                caption.setAttribute("data-is-char", false);
                caption.textContent = caption.getAttribute("title");
            }
        }

        if (typeof this.props.stateSet === "function") {
            this.props.stateSet("title", value.replace(/[^{\s\d}{a-zA-Z}{{가-힣ㄱ-ㅎㅏ-ㅣ}{(),+\-}]+/gi, ""));
        }

        return value.replace(/[^{\s\d}{a-zA-Z}{{가-힣ㄱ-ㅎㅏ-ㅣ}{(),+\-}]+/gi, "");
    }

    render() {
        const { title, category, select_category } = this.state;
        return (
            <div className="regist-basic-info-page">
                <div className="regist-content-row">
                    <div className="content-columns">
                        <span className="title required">상품명</span>
                        <Input
                            inputStyle={{ size: "small", width: "w412" }}
                            inline={{
                                type: "text",
                                id: "input-product-title",
                                value: title,
                                placeholder: "촬영명을 입력하세요.",
                                maxLength: 25,
                                onChange: (e, value) => this.setState({ title: this.replaceChar(e, value) })
                            }}
                        />
                        <span className="text-count">{title.length}/25</span>
                        <span className="caption" title="상품제목을 입력해주세요.">상품제목을 입력해주세요.</span>
                    </div>
                </div>
                <div className="regist-content-row">
                    <div className="content-columns">
                        <span className="title required">카테고리</span>
                        <div style={{ display: "inline-block" }}>
                            <Dropdown list={category} keys={{ name: "name", value: "code" }} select={select_category} size="small" resultFunc={this.onSelectCategory} />
                        </div>
                        <span className="caption">상품의 카테고리를 선택해주세요.</span>
                    </div>
                </div>
            </div>
        );
    }
}

RegistBasicInfo.propTypes = {
    title: PropTypes.string,
    category_name: PropTypes.string,
    category_code: PropTypes.string,
    select_category: PropTypes.string,
    onSelectCategory: PropTypes.func
};

RegistBasicInfo.defaultProps = {
    title: "",
    category_name: "",
    category_code: "",
    select_category: ""
};
