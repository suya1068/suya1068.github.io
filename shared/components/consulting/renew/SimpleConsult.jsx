import "./simple_consult.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import SimpleConsultContent from "./SimpleConsultContent";
// import PriceTagContainer from "./pricetag/PriceTagContainer";

export default class SimpleConsult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_name: props.modal_name,
            onClose: props.onClose,
            is_agree: false,
            access_type: props.access_type,
            device_type: props.device_type,
            product_no: props.product_no,
            category: props.category,
            page_type: "biz",
            user_name: "",
            user_phone: "",
            counsel_time: "",
            user_email: "",
            ///
            referer: "",
            referer_keyword: "",
            // 20190228 a/b test
            //categorys: props.categorys,
            //randomType: props.randomType,
            message: "촬영에 대한 정보를 남겨 주시면, 담당자가 친절히 안내해 드리겠습니다.",
            extra_info: props.extra_info
            //ext_click: false,
            //isWideScreen: props.isWideScreen
        };

        // this.onAgree = this.onAgree.bind(this);
        this.init = this.init.bind(this);
        this.onSubmitConsult = this.onSubmitConsult.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onExtClick = this.onExtClick.bind(this);
    }

    componentWillMount() {
        // const { randomType, isWideScreen } = this.props;
        // if (isWideScreen && randomType === "B") {
        //     this.state.message = "위의 단가표로 상담 및 견적을 받아보시려면 이름과 연락처를 남겨주세요.";
        // }
    }

    componentDidMount() {
        this.setReferrerData();
    }

    /**
     * 유입경로 분석에 필요한 데이터를 저장한다.
     */
    setReferrerData() {
        const session = sessionStorage;
        const params = {};

        if (session) {
            const referer = session.getItem("referer");
            const referer_keyword = session.getItem("referer_keyword");

            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }
            this.setState({ ...params });
        }
    }

    init() {
        this.setState({
            user_name: "",
            is_agree: false,
            user_phone: "",
            counsel_time: "가능한 빨리"
        });
    }

    onChangeHandler(name, value) {
        this.setState({ [name]: value });
    }

    onClose() {
        this.init();
        PopModal.close(this.props.modal_name);
    }

    onSubmitConsult() {
        PopModal.progress();
        const { access_type, device_type, category, product_no, onSubmit, extra_info } = this.props;
        const { page_type, is_agree, user_email, user_name, counsel_time, user_phone, referer, referer_keyword } = this.state;
        const data = { access_type, device_type, page_type, user_name, user_email, counsel_time, user_phone };
        const info_inst = this.SimpleConsultContent;
        const valid = info_inst.valid();

        if (!valid) {
            if (!is_agree) {
                PopModal.alert("개인정보 수집 및 이용동의에 동의해주셔야\n상담신청이 가능합니다.");
                return;
            }

            if (category) {
                data.category = category;
            }

            if (product_no) {
                data.product_no = product_no;
            }

            if (!counsel_time) {
                data.counsel_time = "가능한 빨리";
            }

            if (referer) {
                data.referer = referer;
            }

            if (referer_keyword) {
                data.referer_keyword = referer_keyword;
            }

            if (extra_info) {
                data.extra_info = JSON.stringify({ ...extra_info });
            }

            if (typeof onSubmit === "function") {
                onSubmit();
            }

            this.setApiAdviceOrders({ ...data }).then(response => {
                if (response.status === 200) {
                    PopModal.closeProgress();
                }
                return response.data;
            })
                .then(res_data => {
                    PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => this.onClose() });
                })
                .catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data);
                });
        } else if (valid) {
            PopModal.alert(valid);
        }
    }

    /**
     * 상담신청 등록 api
     * @param data
     * @returns {*}
     */
    setApiAdviceOrders(data) {
        return API.orders.insertAdviceOrders(data);
    }

    onExtClick(e) {
        this.setState({ ext_click: true }, () => {
            setTimeout(() => {
                this.setState({ ext_click: false });
            }, 100);
        });
    }

    render() {
        const { is_agree, user_name, user_email, user_phone, counsel_time, message, ext_click } = this.state;
        const { device_type, randomType, isWideScreen } = this.props;
        return (
            <div className={classNames("simple-consult-container", device_type)} onClick={this.onExtClick}>
                <div className="simple-consult__head">
                    <div className="forsnap-logo">
                        {/*<img src={`${__SERVER__.img}/common/f_logo_black.png`} role="presentation" alt="f_logo_black" />*/}
                        <Img image={{ src: "/common/f_logo_black.png", type: "image" }} />
                    </div>
                    <div className="modal_close_btn" onClick={this.props.onClose} style={{ cursor: "pointer" }}>
                        <img src={`${__SERVER__.img}/common/cancel_black.png`} role="presentation" alt="cancel_black" />
                    </div>
                </div>
                <div className="simple-consult__body">
                    <div className="simple-consult__body__info-img">
                        <div className="test">
                            {this.props.device_type === "pc"
                                ? <img src={`${__SERVER__.img}/common/counsel/renew_consult.jpg`} style={{ width: 560, height: 167 }} role="presentation" alt="f_logo_black" />
                                : <Img image={{ src: "/common/counsel/renew_consult.jpg", type: "image" }} />

                            }
                        </div>
                        <div className="simple-consult__body__info-img__text-box">
                            <div className="check__desc">
                                <div className="check__desc__row">
                                    <div className="yellow_check" />
                                    <span>중개수수료 0%</span>
                                </div>
                                <div className="check__desc__row">
                                    <div className="yellow_check" />
                                    <span>촬영 품질 보증</span>
                                </div>
                                <div className="check__desc__row">
                                    <div className="yellow_check" />
                                    <span>무료 상세 비교 견적</span>
                                </div>
                                <div className="check__desc__row">
                                    <div className="yellow_check" />
                                    <span>촬영 원스탑 서비스</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*{device_type === "pc" && randomType === "B" && isWideScreen &&*/}
                    {/*<PriceTagContainer categorys={this.props.categorys} ext_click={ext_click} device_type={device_type} />*/}
                    {/*}*/}
                    <div className="simple-consult__body__content">
                        <p className="simple-consult__body__content-title">
                            <span className="require">[필수]</span>{message}
                        </p>
                        <SimpleConsultContent
                            ref={instance => (this.SimpleConsultContent = instance)}
                            user_name={user_name}
                            counsel_time={counsel_time}
                            user_phone={user_phone}
                            user_email={user_email}
                            onChangeHandler={this.onChangeHandler}
                        />
                    </div>
                    <div className="simple-consult__body__agree" style={{ paddingTop: 0 }}>
                        <div className="simple-consult__body__agree-head">
                            <p>개인정보 수집 및 이용동의</p>
                            <div className={classNames("agree_check", { "agree": is_agree })} onClick={() => this.onChangeHandler("is_agree", !is_agree)}>
                                <div className="check-circle" />동의합니다.
                            </div>
                        </div>
                        <div className="simple-consult__body__agree-info">
                            <div className="agree-info__row">
                                <p className="dash">-</p>
                                <p className="desc">포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다.</p>
                            </div>
                            <div className="agree-info__row">
                                <p className="dash">-</p>
                                <p className="desc">개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리</p>
                            </div>
                            <div className="agree-info__row">
                                <p className="dash">-</p>
                                <p className="desc">수집하는 개인정보 항목: 이름, 전화번호</p>
                            </div>
                            <div className="agree-info__row">
                                <p className="dash">-</p>
                                <p className="desc">수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="simple-consult__foot">
                    <div className="simple-consult__foot-able-consult-time">
                        <div className="exc" />
                        상담가능시간 : 평일 오전 10시 ~ 오후 5시
                    </div>
                    <div className="simple-consult__foot-button">
                        <button
                            className="simple-consult-button"
                            //ref={node => { this.submitConsultButton = node; }}
                            onClick={this.onSubmitConsult}
                        >상담신청하기</button>
                    </div>
                </div>
            </div>
        );
    }
}

SimpleConsult.propTypes = {
    categorys: PropTypes.string,
    randomType: PropTypes.string,
    isWideScreen: PropTypes.bool
};

SimpleConsult.defaultProps = {
    categorys: "",
    randomType: "",
    isWideScreen: false
};
