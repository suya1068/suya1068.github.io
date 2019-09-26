import "./PhotographCommentRegister.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";

import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";

import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import App from "desktop/resources/components/App";
import PopModal from "shared/components/modal/PopModal";
import Button from "desktop/resources/components/button/Buttons";
import Checkbox from "desktop/resources/components/form/Checkbox";

import Introduction from "../components/introduction/Introduction";
import User from "../components/user/User";
import Review from "../components/review/Review";
import Service from "../components/service/Service";
import Photos from "../components/photo/Photos";

import PhotographCommentManager from "../utils/PhotographCommentManager";
import Icon from "desktop/resources/components/icon/Icon";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

/**
 * 1. 로그인이 안되어 있으면, 로그인 페이지로 이동한다.
 * 2. 로그인 사용자와 작성될 촬영후기 작가가 동일한 사용자이면, 알림 메세지 이후 메인 페이지로 이동한다
 */
class PhotographCommentRegister extends Component {
    constructor(props) {
        super(props);

        const user = auth.getUser();

        this.state = {
            user_id: user ? user.id : "",
            artist: {
                nick_name: props.params.nick_name,
                artist_id: null,
                profile_image: null
            },
            is_agree: false,
            is_mount: false,
            onShowAgreeContent: false
        };

        this.manager = PhotographCommentManager.create(this.state.user_id);

        this.onRegister = this.onRegister.bind(this);
        this.onChangeAgree = this.onChangeAgree.bind(this);

        this.uploadImages = this.uploadImages.bind(this);
        this.register = this.register.bind(this);

        this.validate = this.validate.bind(this);
        this.createParameters = this.createParameters.bind(this);
    }

    componentDidMount() {
        this.manager.getUploadPolicyAndPhotographer(this.state.artist.nick_name)
            .then(
                () => this.setState(state => ({ artist: this.manager.getPhotographer(), is_mount: true })),
                error => PopModal.alert(error.data, { callBack: () => redirect.main() })
            );
    }

    /**
     * 동의 여부를 변경한다.
     * @param agree
     */
    onChangeAgree(agree) {
        this.setState({ is_agree: agree });
    }

    /**
     * 이미지 업로드와 촬영후기를 등록한다.
     */
    onRegister() {
        const { artist, is_agree } = this.state;
        const is_valid = this.validate();

        if (is_valid) {
            if (!is_agree) {
                PopModal.alert("후기 이용 동의에 동의하셔야 등록 가능합니다. ");
                return;
            }

            PopModal.progress();

            this.register()
                .then(() => {
                    PopModal.closeProgress();
                    PopModal.alert("후기가 등록되었습니다. 감사합니다.", {
                        callBack: () => redirect.main(`/@${artist.nick_name}`)
                    });
                })
                .catch(() => {
                    PopModal.closeProgress();
                });
        }
    }

    /**
     * 등록된 이미지를 업로드한다.
     * @return {Promise.<TResult>}
     */
    uploadImages() {
        return Promise.all(this.PhotosForm.getImages().map(image => this.manager.uploadS3(image.file)))
            .then(response => response);
    }

    /**
     * 서버에 후기 등록을 요청한다.
     * @return {*}
     */
    register() {
        const { artist, user_id } = this.state;
        const params = this.createParameters();
        params.artist_id = artist.artist_id;

        if (!user_id) {
            params.name = this.UserForm.getUserName();
        }

        if (this.PhotosForm.size() > 0) {
            return this.uploadImages().then(keys => this.manager.registerPhotographReview(Object.assign(params, { key: JSON.stringify(keys) })));
        }
        return this.manager.registerPhotographReview(params);
    }

    /**
     * 등록 폼 데이터를 생성한다.
     * @returns {object}
     */
    createParameters() {
        return Object.assign({},
            this.ReviewForm.createParameters(),
            this.ServiceForm.createParameters()
        );
    }

    /**
     * 후기 등록 유효성을 체크한다.
     * 유효하지 않은 경우, 포커스를 준다.
     * @returns {boolean}
     */
    validate() {
        const { user_id } = this.state;

        if (!user_id && this.UserForm.validate()) {
            this.UserForm.focus();
            return false;
        }

        if (this.ReviewForm.validate()) {
            this.ReviewForm.focus();
            return false;
        }

        return true;
    }

    onShowAgreeContent(flag) {
        this.setState({ onShowAgreeContent: flag }, () => { this.onShow(flag); });
    }

    onShow(flag) {
        const target = this.agreeContent;
        const icon = this.iconNode.children[0];
        if (flag) {
            target.style.height = target.scrollHeight ? `${target.scrollHeight + 5}px` : "45px";
            target.style.marginBottom = "20px";
            icon.style.transform = "rotate(180deg)";
            target.style.transition = "all 0.4s ease";
        } else {
            target.style.height = "0";
            target.style.marginBottom = "0";
            icon.style.transform = "rotate(0deg)";
        }
    }

    render() {
        const { artist, user_id, is_mount, is_agree, onShowAgreeContent } = this.state;

        if (!is_mount) {
            return null;
        }

        return (
            <div className="photograph-comment-register-page">
                <HeaderContainer />
                <main id="site-main">
                    <div className="container">
                        <div className="row">
                            <div className="columns col-12">
                                <Introduction artist={artist} />
                            </div>
                        </div>
                        { !user_id && (
                            <div className="row">
                                <div className="columns col-12">
                                    <User ref={instance => { this.UserForm = instance; }} />
                                </div>
                            </div>
                        ) }
                        <div className="row">
                            <div className="columns col-12">
                                <div className="row">
                                    <div className="columns col-6">
                                        <Review ref={instance => { this.ReviewForm = instance; }} />
                                    </div>
                                    <div className="columns col-6">
                                        <Service ref={instance => { this.ServiceForm = instance; }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="columns col-12">
                                <Photos ref={instance => { this.PhotosForm = instance; }} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="columns col-12">
                                <section className="photograph-comment-agree">
                                    <div className="photograph-comment-agree-row">
                                        <div className="static-box">
                                            <h6 className="photograph-comment-agree-heading">
                                                <span className="photograph-comment-badge is-require">[필수]</span>후기 이용 동의
                                            </h6>
                                            <span ref={node => { this.iconNode = node; }} onClick={() => this.onShowAgreeContent(!onShowAgreeContent)}>
                                             자세히보기
                                                <Icon name="dt" />
                                            </span>
                                        </div>
                                        <Checkbox
                                            type="yellow_circle"
                                            checked={is_agree}
                                            resultFunc={this.onChangeAgree}
                                        >동의합니다.</Checkbox>
                                    </div>
                                    <div className="photograph-comment-agree-content" ref={node => { this.agreeContent = node; }}>
                                        <p>등록된 후기는 포스냅 SNS에 광고용으로 게시될 수 있습니다.</p>
                                        <p>내용이 운영방침에 어긋나는 경우 삭제되거나 수정될 수 있습니다.</p>
                                    </div>
                                    {/*<div className="photograph-comment-agree-button">*/}
                                    {/*<Checkbox*/}
                                    {/*type="yellow_circle"*/}
                                    {/*checked={is_agree}*/}
                                    {/*resultFunc={this.onChangeAgree}*/}
                                    {/*>동의합니다.</Checkbox>*/}
                                    {/*</div>*/}
                                </section>
                            </div>
                        </div>
                        <div className="row">
                            <div className="columns col-12 text-center">
                                <Button
                                    buttonStyle={{ width: "w179", theme: "yellow", shape: "circle" }}
                                    inline={{ onClick: this.onRegister }}
                                >확인</Button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

PhotographCommentRegister.propTypes = {
    params: PropTypes.shape({
        nick_name: PropTypes.string.isRequired
    }).isRequired
};


ReactDOM.render(
    <App>
        <Router history={browserHistory}>
            <Route path="/@:nick_name/review" component={PhotographCommentRegister} />
        </Router>
    </App>,
    document.getElementById("root")
);
