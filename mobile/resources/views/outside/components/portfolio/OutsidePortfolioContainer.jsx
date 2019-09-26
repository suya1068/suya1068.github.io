import "./OutsidePortfolioContainer.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Route, Router, browserHistory, IndexRoute } from "react-router";

import API from "forsnap-api";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";

import OutsidePortfolio from "./OutsidePortfolio";
import OutsideMain from "../OutsideMain";

class OutsidePortfolioContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.params.param && props.params.param,
            is_check_outside: false,
            type: "portfolio",
            is_login: false,
            password: "",
            portfolio_no: ""
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
                    this.setState({ is_check_outside: true, portfolio_no: response.data.portfolio_no });
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
        const { type } = this.state;
        return API.offers.getOutsideTimeLimit(url, type);
    }

    /**
     * 외부전달 데이터 정보 조회 API
     * @param url
     * @param no
     * @param param
     * @returns {*|{"Content-Type"}}
     */
    fetchOutsideInfo(url, no, param) {
        return API.offers.getOutsidePortfolio(url, no, param);
    }


    /**
     * 외부전달 견적서 메인화면으로 넘어간다.
     * 로그인 성공시 외부견적서 화면을 출력한다.
     * @param is_check
     * @param is_login
     * @returns {*}
     */
    renderOutside(is_check, is_login) {
        const { images, videos } = this.state;

        if (is_check && !is_login) {
            return <OutsideMain portfolio password={this.state.password} onChangeFormHandler={this.onChangeFormHandler} onOutsideInfo={this.onOutsideInfo} />;
        } else if (is_check && is_login) {
            return <OutsidePortfolio images={images} videos={videos} />;
        }
        return null;
    }

    /**
     * 외부전달 견적서 정보 조회
     * @returns {*}
     */
    onOutsideInfo() {
        PopModal.progress();
        const { password, url, type, portfolio_no } = this.state;
        const message = this.validate({ password });
        if (message) {
            PopModal.closeProgress();
            PopModal.alert(message);
            return false;
        }

        this.fetchOutsideInfo(url, portfolio_no, { password, outside_type: type })
            .then(response => {
                PopModal.closeProgress();
                const data = response.data;
                const images = [];
                const videos = [];
                let total = 0;

                if (utils.isArray(data.list)) {
                    data.list.reduce((r, o) => {
                        r.push({
                            type: "image",
                            no: Number(o.photo_no),
                            display_order: Number(o.display_order),
                            url: `/${o.thumb_key}`,
                            signed: true,
                            thumb: false
                        });
                        return r;
                    }, images);
                    total += images.length;
                }

                if (data.portfolio_video && utils.isArray(data.portfolio_video.list)) {
                    data.portfolio_video.list.reduce((r, o) => {
                        r.push({
                            type: "video",
                            no: Number(o.portfolio_no),
                            display_order: Number(o.display_order),
                            url: o.portfolio_video,
                            thumb: false
                        });
                        return r;
                    }, videos);
                    total += videos.length;
                }

                this.setState({
                    images,
                    videos,
                    total,
                    is_login: true
                });
            }).catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });

        return null;
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
                <h2 className="sr-only">포트폴리오 외부전달</h2>
                {this.renderOutside(is_check_outside, is_login)}
            </section>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <Router history={browserHistory}>
            <Route path="/outside/portfolio/:param" component={OutsidePortfolioContainer}>
                <IndexRoute component={OutsidePortfolioContainer} />
                <Route path={"*"} component={null} />
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
