import "./scrollTop.scss";
import React, { Component, PropTypes } from "react";
import CONSTANT from "shared/constant";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
//
// import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";

class ScrollTop extends Component {
    constructor(props) {
        super(props);
        this.ENTER = "ENTER";
        const path = window.location.pathname;
        const search = location.search;

        this.state = {
            is_enter: !(cookie.getCookies(CONSTANT.USER.ENTER) && sessionStorage.getItem(CONSTANT.USER.ENTER)),
            main: path === "/",
            products: path === "/products",
            products_detail: path.match(/\/products\/[0-9]+/),
            category: props.category,
            product_no: props.product_no,
            nick_name: props.nick_name,
            search_param: search ? utils.query.parse(search) : {}
        };
        this.onKakaoTalk = this.onKakaoTalk.bind(this);
    }

    componentWillMount() {
        this.setState({
            parameter: this.createParameter()
        });
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            parameter: this.createParameter()
        });
    }

    onKakaoTalk() {
        const { main, products, products_detail, search_param } = this.state;
        const { category, nick_name, product_no } = this.props;

        let label = category;
        if (products_detail) {
            if (category && nick_name && product_no) {
                label = `${category}_${nick_name}_${product_no}`;
            }
        }

        const category_pos =
            (main && "M_기업_메인") ||
            (products && "M_기업_리스트") ||
            (products_detail && "M_기업_상세");

        if (products_detail && !utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            const is_biz = utils.checkCategoryForEnter(category);

            utils.ad.gaEvent(`M_페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || "", "카카오톡 상담신청");
        }

        utils.ad.gaEvent(category_pos, "카카오톡 상담신청", label);
        return true;
    }

    createParameter() {
        if (window.location) {
            // const { is_enter } = this.state;
            const user = auth.getUser();
            const parameter = {
                yid: "%40forsnap",
                site_id: "4000000720",
                category_id: "81350",
                division_id: "81351",
                site_uid: user ? user.id : ""
            };
            const { pathname, search } = window.location;
            const query = utils.query.parse(search);
            const path = {
                main: pathname === "/",
                products: pathname === "/products",
                products_detail: pathname.match(/\/products\/[0-9]+/)
            };

            if (path.main || path.products || path.products_detail) {
                parameter.parameter1 = pathname;
                // 기업메인, 기업리스트, 기업상세만
                // parameter.parameter2 = is_enter ? "CORP" : "USER";
                parameter.parameter2 = "CORP";
                parameter.parameter3 = query.category || "";
                parameter.parameter4 = query.keyword || "";
                delete query.category;
                delete query.keyword;
                parameter.parameter5 = utils.query.stringify(query);

                let pathName = "";
                const enter = "기업";
                if (path.main) {
                    pathName = `${enter} 메인`;
                } else if (path.products) {
                    pathName = `${enter} 상품리스트`;
                } else if (path.products_detail) {
                    pathName = `${enter} 상품상세`;
                }
                // else if (path.video) {
                //     pathName = `${enter} 영상촬영`;
                // }

                this.state.pathName = pathName;
            } else {
                return null;
            }

            return parameter;
        }

        return null;
    }

    render() {
        const { is_enter, parameter, main, products, products_detail } = this.state;

        return (
            <div className="scroll-top__inner-container">
                {this.props.children}
                {is_enter && parameter && (main || products || products_detail) ?
                    <a
                        className="float__button"
                        href={`https://api.happytalk.io/api/kakao/chat_open?${utils.query.stringify(parameter)}`}
                        onClick={() => this.onKakaoTalk()}
                        target="_blank"
                    >
                        <div className="float__icon">
                            {/*<img className="kakaotalk__icon" alt="kakaotalk" src="//happytalk.io/assets/main/img/btn-chat-kakao.png" />*/}
                            <img role="presentation" alt="kakaotalk" src={`${__SERVER__.img}/mobile/icon/kakao_s.png`} />
                            {/*<i className="m-icon m-icon-kakao_s" />*/}
                        </div>
                    </a> : null
                }
                {/*
                {!is_enter &&
                    <div className="float__button" onClick={() => this.onConsult(is_enter)}>
                        <div className="float__icon consult"><i className="m-icon m-icon-consulting" /></div>
                    </div>
                }
                */}
            </div>
        );
    }
}


ScrollTop.propTypes = {
};

ScrollTop.defaultProps = {
};

export default ScrollTop;
