import "./consultingJoin.scss";
import React, { Component } from "react";
import classNames from "classnames";
// import AppDispatcher from "mobile/resources/AppDispatcher";
// import { GLOBAL_SESSION_SAVE } from "mobile/resources/stores/constants";

import Join from "./helper/Join";

export default class ConsultingJoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_click: false,
            social: "",
            // moreHeight: 0,
            is_agree: false
            //is_mobile: props.is_mobile
        };
        this.joinManager = Join.create();
        this.onChangeAgree = this.onChangeAgree.bind(this);
        this.onActive = this.onActive.bind(this);
        this.getSocial = this.getSocial.bind(this);
    }

    /**
     * 상태에 따라 소셜 로그인 버튼을 노출 / 비노출 한다.
     */
    onActive() {
        const currentTarget = this.join;
        const showDiv = currentTarget.querySelector(".consulting-content__item-content__join");
        currentTarget.classList.toggle("clicked");

        if (currentTarget.classList[2] === "clicked") {
            showDiv.classList.add("show");
            showDiv.style.height = currentTarget.scrollHeight ? `${currentTarget.scrollHeight}px` : "45px";
        } else {
            showDiv.classList.remove("show");
            showDiv.style.height = 0;
        }
    }

    /**
     * 로그아웃한다.
     */
    logout() {
        this.setState({
            is_click: false,
            social: ""
        }, () => {
            this.joinManager.logout();
        });
    }

    /**
     * 로그인
     */
    login(type) {
        this.joinManager.login(type);
        this.setState({
            is_click: false
        });
    }

    /**
     * 로그인 / 회원가입을 선택한다.
     * @param type 소셜 로그인 타입 (네이버 / 카카오톡 / 페이스북)
     */
    onJoinOrLoginSelect(type) {
        const { is_click } = this.state;
        if (!is_click) {
            let social = type;
            if (type === this.getSocial()) {
                social = "";
            }

            this.setState({
                social,
                is_click: true
            }, () => {
                if (this.state.is_click === true) {
                    if (this.getSocial()) {
                        this.login(social.toUpperCase());
                    } else {
                        this.logout();
                    }
                }
            });
        }
    }

    /**
     * 로그인 / 회원가입 동의 상태값을 변경한다.
     * @param e
     */
    onChangeAgree(e) {
        this.setState({
            is_agree: !this.state.is_agree
        }, () => {
            this.onActive();
        });
    }

    /**
     * 소셜정보를 반환한다.
     */
    getSocial() {
        return this.state.social;
    }

    render() {
        const { social, is_agree } = this.state;

        return (
            <div className="consulting-content__item">
                <div className="consulting-content__item-heading">
                    <div className="consulting-content__item-heading__wrapper">
                        <h3 className="consulting-content__item-heading__title">
                            <span className="gray_text">[선택]</span>
                            포스냅에도 가입할께요.
                        </h3>
                        <div className="consulting__agree-button" onClick={this.onChangeAgree}>
                            <div className={classNames("icon__round", is_agree && "show")}>
                                <i className={classNames("m-icon", is_agree ? "m-icon-check-white" : "m-icon-check")} />
                            </div>
                            <span>가입방법선택</span>
                            {/*<Checkbox checked={is_agree} type="yellow_small" resultFunc={this.onChangeAgree}>가입 방법 선택</Checkbox>*/}
                            {/*<span className={classNames("agree-button", { "is-active": is_agree })} onClick={this.onChangeAgree}>*/}
                            {/*가입방법*/}
                            {/*</span>*/}
                        </div>
                    </div>
                    <div className="consulting-content__item-content__description" style={{ marginTop: 10 }}>
                        <p className="consulting-content__item-content__description__text description">
                            <span className="exclamation">!</span>
                            별도의 절차없이 네이버, 페이스북, 카카오톡으로 가입 가능합니다.
                        </p>
                    </div>
                </div>
                <div className="consulting-content__item-content consulting-join" ref={ref => { this.join = ref; }}>
                    <div className="consulting-content__item-content__join">
                        <div className="join-wrapper">
                            <div className={classNames("join", { "active": social === "naver" })} onClick={() => this.onJoinOrLoginSelect("naver")}>
                                <span className="icon__circle">
                                    <span className={classNames("m-icon", social === "naver" ? "m-icon-check-white" : "m-icon-check")} />
                                </span>
                                <h4 className="consulting-content__item-content__social">네이버</h4>
                            </div>
                            <div className={classNames("join", { "active": social === "facebook" })} onClick={() => this.onJoinOrLoginSelect("facebook")}>
                                <span className="icon__circle">
                                    <span className={classNames("m-icon", social === "facebook" ? "m-icon-check-white" : "m-icon-check")} />
                                </span>
                                <h4 className="consulting-content__item-content__social">페이스북</h4>
                            </div>
                            <div className={classNames("join", { "active": social === "kakao" })} onClick={() => this.onJoinOrLoginSelect("kakao")}>
                                <span className="icon__circle">
                                    <span className={classNames("m-icon", social === "kakao" ? "m-icon-check-white" : "m-icon-check")} />
                                </span>
                                <h4 className="consulting-content__item-content__social">카카오톡</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
