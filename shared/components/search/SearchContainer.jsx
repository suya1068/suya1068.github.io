import "./SearchContainer.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import { REGION_LIST } from "shared/constant/address.const";
import { PRODUCT_SORT } from "shared/constant/product.const";

import PopModal from "shared/components/modal/PopModal";

import SearchCategoryList from "./components/SearchCategoryList";

class SearchContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            form: Object.assign({}, this.composeParams(props.params)),
            category: [],
            regionList: REGION_LIST.reduce((r, o) => { r.push(o); return r; }, [{ title: "전체" }])
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onChangeFormPrice = this.onChangeFormPrice.bind(this);
        this.onFetch = this.onFetch.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.createParams = this.createParams.bind(this);
        this.composeParams = this.composeParams.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setStateData(() => {
            return {
                form: Object.assign({}, this.composeParams(nextProps.params))
            };
        });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onChangeForm(name, value) {
        this.setStateData(
            ({ form }) => {
                const { auto, onFetch } = this.props;
                const prop = {
                    form: Object.assign(form, { [name]: value })
                };

                if (auto[name] && typeof onFetch === "function") {
                    onFetch(this.createParams(prop.form));
                }

                return prop;
            }
        );
    }

    onChangeFormPrice(name, value) {
        this.onChangeForm(name, value.replace(/[,\D]+/g, ""));
    }

    onFetch(e) {
        e.preventDefault();
        const { onFetch } = this.props;

        const params = this.createParams(this.initState(this.state.form));
        if (!params.keyword || params.keyword.replace(/\s/gi, "") === "") {
            PopModal.alert("검색어를 입력해주세요");
        } else if (typeof onFetch === "function") {
            onFetch(params);
        } else {
            location.href = `/products?${utils.query.stringify(params)}`;
        }

        if (this.refSearch) {
            this.refSearch.focus();
        }
    }

    initState(params = {}) {
        return {
            keyword: params.keyword || "",
            tag: "",
            category: "",
            region: "",
            min_price: "",
            max_price: "",
            is_corp: "",
            reserve_date: "",
            sort: params.sort || PRODUCT_SORT.RECOMM.value,
            enter: params.enter === "Y" ? "Y" : "N",
            new: ""
        };
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    createParams(data) {
        let form;
        if (data) {
            form = data;
        } else {
            form = this.state.form;
        }
        return Object.keys(form).reduce((r, k) => {
            if (form[k]) {
                r[k] = form[k];
            }
            return r;
        }, {});
    }

    composeParams(params = {}) {
        return {
            keyword: params.keyword || "",
            tag: params.tag || "",
            category: params.category || "",
            region: params.region || "",
            min_price: Number(params.min_price) || "",
            max_price: Number(params.max_price) || "",
            is_corp: params.is_corp === "Y" ? "Y" : "",
            reserve_date: utils.isDate(params.reserve_date) ? params.reserve_date : "",
            enter: params.enter === "Y" ? "Y" : "N",
            sort: params.sort || PRODUCT_SORT.RECOMM.value,
            new: params.new || ""
        };
    }

    render() {
        const { option, search_count } = this.props;
        const { form } = this.state;

        return (
            <div className="search__container">
                <form
                    name="search_form"
                    action="/products"
                    method="get"
                    onSubmit={this.onFetch}
                >
                    <div className="search__keyword">
                        <input
                            className="search__input"
                            name="keyword"
                            type="text"
                            maxLength="38"
                            placeholder="검색어를 입력해주세요."
                            value={form.keyword}
                            onChange={e => this.onChangeForm(e.target.name, e.target.value)}
                            ref={ref => (this.refKeyword = ref)}
                        />
                        {/*<input
                            className="search__input"
                            name="tag"
                            type="text"
                            placeholder="태그를 입력해주세요."
                            value={form.tag}
                            onChange={e => this.onChangeForm(e.target.name, e.target.value)}
                        />*/}
                        <button
                            className="search__button"
                            ref={ref => (this.refSearch = ref)}
                        >
                            검색
                        </button>
                    </div>
                </form>
                {option ?
                    <div className="search__options">
                        <SearchCategoryList data={search_count} category={form.category} onChange={value => this.onChangeForm("category", value)} />
                    </div> : null
                }
            </div>
        );
    }
}

SearchContainer.propTypes = {
    search_count: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    params: PropTypes.shape({
        keyword: PropTypes.string,
        tag: PropTypes.string,
        category: PropTypes.string,
        region: PropTypes.string,
        min_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        is_corp: PropTypes.oneOf(["Y", ""]),
        reserve_date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        enter: PropTypes.oneOf(["Y", "N"]),
        sort: PropTypes.string,
        new: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    }).isRequired,
    auto: PropTypes.shape({
        keyword: PropTypes.bool,
        tag: PropTypes.bool,
        category: PropTypes.bool,
        region: PropTypes.bool,
        min_price: PropTypes.bool,
        max_price: PropTypes.bool,
        is_corp: PropTypes.bool,
        reserve_date: PropTypes.bool,
        enter: PropTypes.bool,
        sort: PropTypes.bool
    }),
    option: PropTypes.bool,
    onFetch: PropTypes.func
};

SearchContainer.defaultProps = {
    params: {
        keyword: "",
        tag: "",
        category: "",
        region: "",
        min_price: "",
        max_price: "",
        is_corp: "",
        reserve_date: "",
        enter: "N",
        sort: PRODUCT_SORT.RECOMM.value
    },
    auto: {
        keyword: false,
        tag: false,
        category: false,
        region: false,
        min_price: false,
        max_price: false,
        is_corp: false,
        reserve_date: false,
        enter: false,
        sort: false
    },
    option: false
};

export default SearchContainer;
