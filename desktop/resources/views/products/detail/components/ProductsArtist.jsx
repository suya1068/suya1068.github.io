import "../scss/products_artist.scss";
import React, { Component, PropTypes } from "react";
// import classNames from "classnames";

import API from "forsnap-api";
// import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";
import Img from "shared/components/image/Img";

import Buttons from "desktop/resources/components/button/Buttons";
// import Icon from "desktop/resources/components/icon/Icon";

import ProductsQuestion from "./ProductsQuestion";
import UserCheck from "shared/helper/UserCheck";

class ProductsArtist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isQuick: false,
            isProcess: false,
            height: 145,
            defaultHeight: 145,
            contentHeight: 0
        };
        this.UserCheck = new UserCheck();
        this.onProgress = this.onProgress.bind(this);
        this.onQuickMessage = this.onQuickMessage.bind(this);
        this.onQuestion = this.onQuestion.bind(this);
        this.onMoreAbout = this.onMoreAbout.bind(this);
        // this.isLogin = this.isLogin.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const content = this.content;

        if (content) {
            setTimeout(() => {
                const { defaultHeight } = this.state;
                this.setState({
                    contentHeight: content.offsetHeight,
                    height: content.offsetHeight > (defaultHeight * 1.5) ? defaultHeight : content.offsetHeight
                });
            }, 100);
        }
    }

    onMoveArtistAbout(nick) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("작가정보보기", "", true);
        }
        location.href = `/@${nick}`;
    }

    /**
     * 백그라운드 프로그래스
     * @param b
     */
    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    onQuestion() {
        const user = this.UserCheck.isLogin();
        const { user_id, product_no, phone, nick_name, profile_img, IFSideBar } = this.props.data;

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("1:1문의", "", true);
        }

        if (user) {
            if (user.id === user_id) {
                PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
            } else {
                const modalName = "popup-products-question";
                PopModal.createModal(modalName, <ProductsQuestion data={{ user_id, product_no, phone, nick_name, profile_img }} />, { callBack: phone ? null : IFSideBar.checkUser });
                PopModal.show(modalName);
            }
        }
    }

    /**
     * 원클릭 간편문의
     * @param type
     */
    onQuickMessage(type) {
        const { isProcess, isQuick } = this.state;

        if (!isQuick) {
            let message = "";
            const user = this.UserCheck.isLogin();

            if (user) {
                const { user_id, product_no, phone, IFSideBar } = this.props.data;

                switch (type) {
                    case "date":
                        message = "일정문의합니다.";
                        break;
                    case "photo":
                        message = "촬영문의합니다.";
                        break;
                    case "option":
                        message = "옵션문의합니다.";
                        break;
                    default:
                        break;
                }

                if (user.id === user_id) {
                    PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
                } else if (!phone) {
                    const modalName = "popup-products-question";
                    PopModal.createModal(modalName, <ProductsQuestion data={{ user_id, product_no, phone, message }} />, {
                        callBack: phone ? null : () => {
                            this.setState({
                                isQuick: true
                            });
                            IFSideBar.checkUser();
                        }
                    });
                    PopModal.show(modalName);
                } else if (!isProcess && message && user_id && product_no) {
                    this.onProgress(true);
                    API.talks.send(user_id, product_no, "U", "PRODUCT_BOT", message).then(response => {
                        this.onProgress(false);
                        if (response.status === 200) {
                            PopModal.close();
                            //utils.ad.wcsEvent("5");
                            PopModal.confirm(
                                "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                                () => {
                                    document.location.href = `/users/chat/${user_id}/${product_no}`;
                                }
                            );
                            this.setState({
                                isQuick: true
                            });
                            // this.wcsEvent();
                        }
                    }).catch(error => {
                        this.onProgress(false);
                        if (error.status === 412) {
                            PopModal.alert(error.data);
                        } else if (error.status === 400) { // 작가가 자기자신의 상품에 대화하기를 하였을 경우 에러
                            PopModal.alert(error.data);
                        }
                    });
                }
            }
        }
    }

    onMoreAbout() {
        const { height, defaultHeight, contentHeight } = this.state;
        this.setState({
            height: height === defaultHeight ? contentHeight : defaultHeight
        });
    }

    render() {
        const { isQuick, height, defaultHeight, contentHeight } = this.state;

        if (!this.props.data) {
            return null;
        }

        const { profile_img, nick_name, intro, is_corp, user_id, category } = this.props.data;

        return (
            <div className="products__artist" ref={ref => (this.container = ref)}>
                <div className="products__artist__basic">
                    <div className="profile">
                        <Img image={{ src: profile_img }} />
                    </div>
                    <div className="info">
                        {is_corp === "Y" ? <div className="badge__corp"><span>세금계산서가능</span></div> : null}
                        <div className="nickname">
                            <div className="text">{nick_name}</div>
                        </div>
                        <div className="buttons">
                            <Buttons buttonStyle={{ size: "tiny", shape: "round", theme: "bg-white" }} inline={{ onClick: () => this.onMoveArtistAbout(nick_name) }}>작가정보보기</Buttons>
                        </div>
                    </div>
                </div>
                {intro ?
                    <div className="products__artist__about">
                        <div className="about__content" style={{ height: `${height}px` }}>
                            <div className="content" ref={ref => (this.content = ref)}>
                                {utils.linebreak(intro)}
                            </div>
                        </div>
                        {contentHeight > (defaultHeight * 1.5) ?
                            <div className="about__arrow">
                                <button onClick={this.onMoreAbout}>{height === defaultHeight ? "소개 더보기" : "소개 접기"}</button>
                            </div> : null
                        }
                    </div> : null
                }
                {!utils.checkCategoryForEnter(category) &&
                    <div className="products__artist__message">
                        <button className="_button _button__block _button__fill__yellow" onClick={this.onQuestion}>작가에게 1:1문의</button>
                    </div>
                }
            </div>
        );
    }
}

// data - user_id(artist_id), product_no, profile_img, nick_name, phone, about
ProductsArtist.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default ProductsArtist;
