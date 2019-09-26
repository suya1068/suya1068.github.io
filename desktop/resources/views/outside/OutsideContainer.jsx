import React, { Component } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import { Route, Router, browserHistory, IndexRoute } from "react-router";
import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import OutsideMain from "./components/OutsideMain";
import Outside from "./components/Outside";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

class OutsideContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.params.param && props.params.param,
            is_check_outside: false,
            is_login: false,
            password: "",
            offer_data: {},
            order_data: {},
            portfolio: {}
        };
        this.onChangeFormHandler = this.onChangeFormHandler.bind(this);
        this.onOutsideInfo = this.onOutsideInfo.bind(this);
    }

    componentDidMount() {
        this.onCheckOutsideTimeLimit(this.state.url);
    }

    /**
     * 유효한 견적서 주소인지 체크한다.
     * 유효하지 않다면 에러메시지를 띄우고 메인으로 보낸다.
     * @param url
     */
    onCheckOutsideTimeLimit(url) {
        this.getOutsideInfoTimeLimit(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({ is_check_outside: true });
                }
            }).catch(error => {
                PopModal.alert(error.data, { callBack: () => { location.href = "/"; } });
            });
    }

    /**
     * 외부전달 견적서 유효기간 체크 API
     * @param url
     */
    getOutsideInfoTimeLimit(url) {
        return API.offers.getOutsideTimeLimit(url);
    }

    /**
     * 외부전달 견적서 정보 조회 API
     * @param url
     * @param param
     * @returns {*|{"Content-Type"}}
     */
    fetchOutsideInfo(url, param) {
        return API.offers.fetchOutsideInfo(url, param);
    }

    /**
     * 외부전달 견적서 메인화면으로 넘어간다.
     * 로그인 성공시 외부견적서 화면을 출력한다.
     * @param is_check
     * @param is_login
     * @returns {*}
     */
    renderOutside(is_check, is_login) {
        const { offer_data, order_data, portfolio } = this.state;

        if (is_check && !is_login) {
            return <OutsideMain password={this.state.password} onChangeFormHandler={this.onChangeFormHandler} onOutsideInfo={this.onOutsideInfo} />;
        }

        if (!is_check && is_login && !!offer_data) {
            return <Outside offer_data={offer_data} order_data={order_data} portfolio={portfolio} />;
        }

        return null;
    }

    /**
     * 외부전달 견적서 정보 조회
     * @returns {*}
     */
    onOutsideInfo() {
        PopModal.progress();
        const { password, url } = this.state;
        const message = this.validate({ password, url });
        if (message) {
            PopModal.closeProgress();
            PopModal.alert(message);
            return false;
        }

        this.fetchOutsideInfo(url, { password })
            .then(response => {
                const data = response.data;
                const offer_data = data.offer_info;
                const order_data = data.order_info;
                this.setState({ offer_data, order_data }, () => {
                    this.getOutsideInfoData(offer_data);
                });
            }).catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });

        return null;
    }

    /**
     * api 통합
     * @param portfolio_no
     * @param product_no
     * @returns {Array}
     */
    setPromiseArray({ portfolio_no, product_no }) {
        const { url, password } = this.state;
        const promise = [];
        if (!product_no) {
            const params = { url, password, portfolio_no };
            promise.push(this.getPortfolioInfo(params, false));
        } else {
            promise.push(this.getPortfolioInfo(product_no));
        }

        return promise;
    }

    /**
     * 외부전달용 견적서 데이터 조회
     * @param data
     */
    getOutsideInfoData(data) {
        const promise = this.setPromiseArray({
            product_no: data.product_no,
            portfolio_no: data.portfolio_no
        });
        Promise.all(promise)
            .then(response => {
                PopModal.closeProgress();
                const offer_data = data;
                let portfolio = {};
                if (offer_data.product_no) {
                    portfolio = {
                        images: response[0].data.portfolio.list,
                        total_cnt: response[0].data.portfolio.total_cnt,
                        data: {
                            profile_img: offer_data.profile_img,
                            title: offer_data.title,
                            nick_name: offer_data.nick_name
                        },
                        portfolio_type: "product"
                    };
                } else {
                    portfolio = {
                        images: response[0].data.list,
                        total_cnt: response[0].data.total_cnt,
                        portfolio_type: "estimate"
                    };
                }

                this.setState({
                    portfolio,
                    is_login: true,
                    is_check_outside: false
                });
            }).catch(error => {
                PopModal.closeProgress();
                PopModal.alert(
                    error.data || "견적서를 불러오는 중 에러가 발생했습니다.\n문제가 지속되면 고객센터로 문의해주세요", { callBack: () => { location.reload(); } }
                );
            });
    }

    /**
     * 외부전달용 견적서 포트폴리오 조회
     * product_no를 기준으로 있으면 상품포트폴리오를
     * 없으면 외부전달용 포트폴리오 api를 조회한다.
     * @param params
     * @param is_product_no
     * @returns {*|string}
     */
    getPortfolioInfo(params, is_product_no = true) {
        let request = "";
        if (!is_product_no) {
            request = API.offers.getOutsidePortfolio(params.url, params.portfolio_no, { password: params.password });
        } else {
            request = API.products.selectPortfolio(params);
        }

        return request;
    }

    /**
     * 비밀번호 유효성 체크
     * @param param
     * @returns {string}
     */
    validate(param) {
        const password = param.password;
        let message = "";
        if (password.length < 1) {
            message = "비밀번호를 입력하세요.";
        } else if (password.length < 4) {
            message = "비밀번호는 4자이상 입력하셔야합니다.";
        }
        return message;
    }

    /**
     * 정보입력 폼 핸들러
     * @param e
     * @param value
     */
    onChangeFormHandler(e, value) {
        const node = e.currentTarget;
        const name = node.name;
        this.setState({ [name]: node.value });
    }

    render() {
        const { is_check_outside, is_login } = this.state;
        return (
            <section className="forsnap-outside">
                <h2 className="sr-only">견적서 외부전달</h2>
                {this.renderOutside(is_check_outside, is_login)}
            </section>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <div className="site-main">
            <Router history={browserHistory}>
                <Route path="/estimate/:param" component={OutsideContainer}>
                    <IndexRoute component={OutsideContainer} />
                    <Route path={"*"} component={null} />
                </Route>
            </Router>
        </div>
    </App>,
    document.getElementById("root")
);
