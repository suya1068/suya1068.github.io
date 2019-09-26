import "./productDetailBusiness.scss";
import React, { Component } from "react";
import ProductDetailPortfolio from "../components/portfolio/ProductDetailPortfolio";
import ProductInformation from "../components/info/ProductInformation";
import PopModal from "shared/components/modal/PopModal";
import API from "forsnap-api";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import auth from "forsnap-authentication";
import VirtualEstimate from "mobile/resources/views/products/list/open/virtual_estimate/VirtualEstimate";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS
} from "mobile/resources/views/products/list/open/virtual_estimate/virtual_estimate.const";
import * as virtualEstimateHelper
    from "mobile/resources/views/products/list/open/virtual_estimate/virtualEstimateHelper";
import * as EstimateSession from "mobile/resources/views/products/list/open/extraInfoSession";
import AboutArtist from "../components/artist/AboutArtist";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import ExampleReviewDetail from "../../../main/business/example_review/ExampleReviewDetail";
import ChargeProducts from "../components/charge/ChargeProducts";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import FirstPhase from "../../../../components/popup/message/FirstPhase";
import ChargeCount from "shared/helper/charge/ChargeCount";
import AnotherRecommendArtist
    from "mobile/resources/views/products/list/open/pop/PopRecommendArtist";
import Portfolio from "mobile/resources/components/portfolio/PortfolioContainer";
import { Footer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

export default class ProductDetailBusiness extends Component {
    constructor(props) {
        super(props);
        const _data = props.data;
        this.chargeCount = new ChargeCount();

        this.state = {
            data: _data,
            portfolioData: this.combinePortfolioData(_data),
            isLike: _data && _data.is_like === "Y",
            review: [],
            chargeProducts: [],
            images: [],
            device_type: "mobile",
            access_type: "detail"
        };
        this.onShare = this.onShare.bind(this);
        this.onLike = this.onLike.bind(this);
        this.apiGetArtistInfo = this.apiGetArtistInfo.bind(this);
        this.apiGetArtistSelfReview = this.apiGetArtistSelfReview.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        // this.onShowPortfolio = this.onShowPortfolio.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.onConsultContainer = this.onConsultContainer.bind(this);
        this.onConsultDirectArtist = this.onConsultDirectArtist.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.composeList = this.composeList.bind(this);
        this.onShowPortfolio = this.onShowPortfolio.bind(this);
        this.setPortfolioData = this.setPortfolioData.bind(this);
        if (window.Kakao) {
            // 상용
            window.Kakao.init("0f3f2a76a0b596812e6cac5b79b6a9f8");

            // 개발
            // window.Kakao.init("2e50b5025b866909ce06c3fdd8dd9425");
        }
    }

    componentWillMount() {
        const { data } = this.props;
        this.chargeCount.init();

        const chargeMaxCount = this.chargeCount.getMaxCount();
        const crc = this.chargeCount.getCRC();
        this.setState({
            crc,
            chargeMaxCount
        });

        this.apiGetArtistInfo(data.nick_name, data.product_no);
        this.apiGetArtistSelfReview(data.user_id);
        this.apiGetChargeArtistProduct(data.category);
        this.setPortfolioData();
    }

    componentDidMount() {
        this.getSessionReferer();
    }

    onChargeArtistConsult(consult, list, select_list) {
        const { device_type } = this.state;
        const { category } = this.props.data;
        const agent = cookie.getCookies("FORSNAP_UUID");

        const prop = {
            ...consult,
            category,
            device_type
        };

        if (agent) {
            prop.agent = agent;
        }

        Modal.close();
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        const promise = select_list.map(no => {
            const artist = list.find(o => o.no === no);
            if (artist) {
                return API.orders.insertArtistOrder(Object.assign(prop, { artist_id: artist.user_id, product_no: artist.product_no }))
                    .then(() => {
                        this.chargeCount.setCRC();
                        this.setState({
                            crc: this.chargeCount.getCRC()
                        });
                        this.externalEvents();
                    });
            }
            return null;
        });

        Promise.all(promise)
            .then(() => {
                this.renderLastPhase();
            });
    }

    setPortfolioData() {
        const { data } = this.props;
        if (data && typeof data === "object") {
            const { portfolio, portfolio_video } = data;
            let images = [];
            let re_data = {};
            let axis_type = "";
            const videos = [];
            let total = 0;

            if (portfolio && utils.isArray(portfolio.list)) {
                // if (["VIDEO", "VIDEO_BIZ"].indexOf(data.category) === -1) {
                re_data = this.composeList(data.portfolio.list);
                images = re_data.images;
                axis_type = re_data.axis_type;
                total += images.length;
                // } else {
                //     portfolio.list.reduce((r, o) => {
                //         r.push({
                //             type: "image",
                //             no: Number(o.portfolio_no),
                //             display_order: Number(o.display_order),
                //             url: o.portfolio_img,
                //             thumb: false
                //         });
                //         return r;
                //     }, images);
                //     total += images.length;
                // }
            }

            if (portfolio_video && utils.isArray(portfolio_video.list)) {
                portfolio_video.list.reduce((r, o) => {
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

                switch (data.category) {
                    case "VIDEO":
                    case "VIDEO_BIZ":
                        total += 1;
                        videos.unshift({
                            type: "video",
                            no: null,
                            display_order: 1,
                            url: data.main_img,
                            thumb: false
                        });
                        break;
                    default:
                        break;
                }
            }
            const information = {
                profile_img: data.profile_img,
                artist_name: data.nick_name,
                title: data.title,
                total,
                artist_id: data.user_id,
                product_no: data.product_no
            };

            this.setState({
                images,
                axis_type,
                videos,
                information
            });
        }
    }

    composeList(list) {
        const images = [];
        let axis_type = "x";

        if (list && utils.isArray(list)) {
            let vertical_type_count = 0;
            list.reduce((r, o, i) => {
                const width = Number(o.width);
                const height = Number(o.height);

                const vertical_ratio = width < height; // ? 세로형 : 가로형

                if (vertical_ratio) {
                    vertical_type_count += 1;
                }
                r.push({
                    type: "image",
                    no: Number(o.portfolio_no),
                    display_order: Number(o.display_order),
                    url: o.portfolio_img,
                    src: o.portfolio_img,
                    width: 206,
                    height: 206,
                    thumb: false,
                    vertical_type: vertical_ratio
                });
                return r;
            }, images);

            if (Math.round((list.length / 2)) < vertical_type_count) {
                axis_type = "y";
            }
        }

        return { images, axis_type };
    }

    onShowPortfolio(index) {
        const { images, videos, information, axis_type } = this.state;
        const { data } = this.props;
        const modal_name = "forsnap-portfolio";

        // if (typeof this.props.gaEvent === "function") {
        //     this.props.gaEvent("포트폴리오", `카테고리: ${category} / 작가명: ${information.artist_name} / 상품번호: ${data.no}, 이미지주소: ${images[index].url}`);
        // }

        const content = (
            <Portfolio
                renewDetail
                ext_page={false}
                chargeArtistNo={data.charge_artist_no}
                images={images}
                videos={videos}
                category={data.category}
                axis_type={axis_type}
                information={information}
                active_index={videos.length > 0 ? (index * 1) + 1 : index * 1}
                onClose={() => PopModal.close(modal_name)}
            />
        );

        PopModal.createModal(modal_name, content, { modal_close: false, className: modal_name });
        PopModal.show(modal_name);
    }

    renderLastPhase() {
        Modal.close(MODAL_TYPE.PROGRESS);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <div className="pop-recommend-artist__last_phase" style={{ textAlign: "center" }}>
                    <div style={{ color: "#fff" }}>
                        <p style={{ fontSize: 21, fontWeight: "bold", marginBottom: 10 }}>작가님께 전달이 완료되었습니다.</p>
                        <p style={{ fontSize: 16, marginBottom: 26 }}>
                            빠르게 연락드리겠습니다.<br />감사합니다.
                        </p>
                    </div>
                    <button
                        style={{
                            width: 150,
                            height: 42,
                            cursor: "pointer",
                            color: "#fff",
                            backgroundColor: "#f5a623",
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                        onClick={() => Modal.close()}
                    >확인</button>
                </div>
            )
        });

        setTimeout(() => {
            Modal.close();
        }, 5000);
    }

    fetchChargeArtist(params) {
        const { data } = this.state;
        if (!params.ignore_artist_id) {
            params.ignore_artist_id = data.user_id;
        }

        if (!params.limit) {
            params.limit = 10;
            params.offset = 0;
        }
        return virtualEstimateHelper.apiGetChargeArtistProduct(params);
    }

    setCRC() {
        this.chargeCount.setCRC();
        this.setState({
            crc: this.chargeCount.getCRC()
        });
    }


    /**
     * 작가 리뷰 데이터 조회
     * @param id
     */
    apiGetArtistSelfReview(id) {
        API.products.findArtistSelfReview(id)
            .then(response => {
                const data = response.data;
                this.setState({ artistReview: data.list });
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    apiGetChargeArtistProduct(category) {
        API.products.findChargeArtist({ category })
            .then(response => {
                const data = response.data;
                this.setState({ chargeProducts: data.list });
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    /**
     * 작가 정보 데이터 조회
     */
    apiGetArtistInfo(nick, no) {
        API.artists.getArtistsIntroPublicNew({ nick_name: nick, product_no: no })
            .then(response => {
                const data = response.data;
                this.setState({
                    career: this.combineCareerData(data.career),
                    region: data.region,
                    review: this.combineReviewData(data.review)

                });
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    /**
     * 리뷰데이터 세팅
     * @param data
     * @returns {*}
     */
    combineReviewData(data) {
        const list = data.list;
        const _list = list.reduce((result, obj) => {
            if (obj.user_type === "U") {
                result.push(obj);
            }

            return result;
        }, []);

        // const test = _list.sort((a, b) => {
        //     console.log(a.review_img.length, b.review_img.length);
        //     return a.review_img.length < b.review_img.length;
        // });
        //
        // console.log(">>>:", test);

        return _list;
    }

    /**
     * 작가경력 세팅
     * @param list
     * @returns {*}
     */
    combineCareerData(list) {
        const test = utils.mergeArrayTypeObject(list, [], [], ["date"], true);

        return test.list;
    }

    /**
     * 페이지를 공유한다.
     * @param type
     */
    onShare(type) {
        let sns;
        let params;
        const { data } = this.state;
        const url = `${__DESKTOP__}/products/${data.product_no}`;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "kakao":
                // template_msg : Object
                // 링크 메시지 (Link JSON 참고용)
                // warning_msg : Object
                // 링크 메시지를 검증한 결과
                // argument_msg : Object
                // argument를 검증한 결과
                params = {
                    requestUrl: url,
                    // templateId: 4756
                    templateArgs: {
                        name: "포스냅",
                        url: "https://forsnap.com"
                    },
                    fail: messageObj => {
                        PopModal.alert("카카오링크 공유에 실패했습니다.");
                    }
                    // success: messageObj => {
                    //     console.log("KAKAO SUCCESS");
                    // }
                };
                break;
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: url
                };
                break;
            default:
                break;
        }

        if (type === "kakao") {
            window.Kakao.Link.sendScrap(params);
        } else {
            window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup");
        }
    }

    /**
     * 하트를 등록 또는 취소한다.
     */
    onLike() {
        const { data, isLike } = this.state;
        const user = this.isLogin();

        if (data && user) {
            if (data.user_id === user.id) {
                PopModal.toast("본인 상품은 하트를 등록 할 수 없습니다");
            } else {
                let request = null;
                const params = [user.id, data.product_no];

                if (data.user_id === user.id) {
                    PopModal.alert("본인 상품은 하트를 등록 할 수 없습니다.");
                } else if (!isLike) {
                    request = API.users.like(...params);
                } else {
                    request = API.users.unlike(...params);
                }

                if (request) {
                    request.then(response => {
                        if (response.status === 200) {
                            if (!isLike) {
                                //window.fbq("track", "AddToWishlist");
                                PopModal.toast("하트 상품은 <br /> 마이페이지 > 내 하트 목록<br />에서 확인가능합니다.");
                            } else {
                                PopModal.toast("하트를 취소하셨습니다.", 1000);
                            }

                            this.setState({
                                isLike: !isLike
                            });
                        }
                    }).catch(error => {
                        PopModal.alert(error.data);
                    });
                }
            }
        }
    }

    isLogin() {
        const user = auth.getUser();

        if (user) {
            return user;
        }

        PopModal.alert("로그인 후 이용해주세요");
        return false;
    }

    /**
     * 포트폴리오 섹션 데이터를 조합합니다.
     * @param data
     * @returns {{list: *, totalCount: *, title: *, product_no: *}}
     */
    combinePortfolioData(data) {
        const videoList = data.portfolio_video ? data.portfolio_video.list : [];
        const param = {
            list: videoList.concat(data.portfolio.list),
            title: data.title,
            product_no: data.product_no
        };


        return { ...param };
    }

    /**
     * 견적을 산출한다.
     * @param form
     * @param agent
     * @param category
     * @param hasAlphas
     * @param total_price
     */
    onConsultEstimate({ form, agent, category, hasAlphas, totalPrice }) {
        const { device_type, data, access_type } = this.state;
        // form 데이터를 복사한다.
        const _form = Object.assign({}, form);

        // // 복사한 객체에 sub_code가 존재하는지 체크
        // if (Object.prototype.hasOwnProperty.call(_form, "sub_code")) {
        //     // sub_code를 제거한다.
        //     delete _form.sub_code;
        // }

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        // 견적산출 파라미터 설정
        const params = {
            extra_info: JSON.stringify({ ..._form }),
            agent,
            category,
            device_type,
            access_type
        };

        if (totalPrice) {
            // total_price 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form: _form, totalPrice, hasAlphas, agent });
        }

        // 견적정보를 state에 저장한다.
        this.setState({
            form,
            agent,
            totalPrice,
            hasAlphas
        });
    }

    /**
     * 견적산출 api를 호출합니다.
     * @param params
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @param agent
     */
    callAPIInsertOrderEstimate(params, { form, totalPrice, hasAlphas, agent }) {
        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                const data = response.data;

                const recommendParams = this.createRecommendArtistParams({ form, totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams
                });
            })
            .catch(error => {
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 작가상담 파라미터 생성
     * @param form
     * @param total_price
     * @param hasAlphas
     * @returns {{agent: *, category: string, extra_info: string, extra_text: string}}
     */
    createRecommendArtistParams({ form, total_price, hasAlphas }) {
        const { agent, data } = this.state;
        const category = data.category ? data.category.toUpperCase() : "";
        const _form = Object.assign({}, form);
        const user = auth.getUser();
        if (total_price) {
            _form.total_price = hasAlphas ? `${total_price}+a` : total_price;
        }

        if (_form.sub_code) {
            delete _form.sub_code;
        }

        // 코드에서 한글로 치환
        const exchangeCodeToText = this.exchangeCodeToText(form);

        const params = {
            agent,
            category,
            extra_info: JSON.stringify(form),
            extra_text: JSON.stringify(exchangeCodeToText)
        };

        if (user) {
            params.user_id = user.id;
        }

        return { ...params };
    }

    /**
     * extra_info 데이터를 한글로 치환합니다.
     * @param form
     * @returns {{}}
     */
    exchangeCodeToText(form) {
        return Object.keys(form).reduce((result, key) => {
            const keyUpperCase = key.toUpperCase();
            const formKeyUpperCase = typeof form[key] === "string" ? form[key].toUpperCase() : form[key];
            let value = Object.prototype.hasOwnProperty.call(ADVICE_EXTRA_TEXT, formKeyUpperCase) ? ADVICE_EXTRA_TEXT[formKeyUpperCase].NAME : form[key];

            // key가 video_length 이면 텍스트를 치환한다.
            if (key === PROPERTYS.VIDEO_LENGTH.CODE) {
                switch (value) {
                    case "1": value = "1분미만"; break;
                    case "2": value = "1분~3분"; break;
                    case "3": value = "3분~5분"; break;
                    case "4+a": value = "5분이상"; break;
                    default: value = form[key]; break;
                }
            }

            return Object.assign(result, { [PROPERTYS[keyUpperCase].NAME]: value });
        }, {});
    }

    onShowSelfReview(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            full: true,
            overflow: false,
            content: (
                <ExampleReviewDetail
                    data={data}
                    onClose={() => Modal.close()}
                />
            )
        });
    }

    onConsultContainer() {
        this.gaEvent("유료_우측견적_문의");
        this.onConsult("detail_add");
    }

    onConsult(access_type) {
        const { data } = this.props;
        const { totalPrice, information, order_no, crc, device_type } = this.state;
        const modal_name = "simple__consult";
        const estimateData = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        const p = Object.assign({}, estimateData);
        p.access_type = access_type;
        p.device_type = device_type;
        p.category = data.category;

        if (!totalPrice) {
            delete p.extra_info;
            delete p.extra_text;
        }

        if (data.product_no) {
            p.product_no = data.product_no;
        }

        if (data.user_id) {
            p.artist_id = data.user_id;
        }

        PopModal.createModal(
            modal_name,
            <ConsultModal
                onConsult={d => {
                    const params = Object.assign({}, d, {
                        ...p
                    });
                    PopModal.progress();
                    this.insertAdvice(params, access_type, modal_name);
                }}
                nickName={data.nick_name}
                requestAbleCount={3 - crc}
                isTypeRecommendArtist
                onClose={() => PopModal.close(modal_name)}
            />,
            {
                modal_close: false
            }
        );
        PopModal.show(modal_name);
    }

    getSessionReferer() {
        if (sessionStorage) {
            const referParam = {};
            if (sessionStorage.getItem("referer")) {
                referParam.referer = sessionStorage.getItem("referer");
            }

            if (sessionStorage.getItem("referer_keyword")) {
                referParam.referer_keyword = sessionStorage.getItem("referer_keyword");
            }

            this.setState({
                referParam
            });
        }
    }

    /**
     * 작가에게 상담신청
     * @param params
     * @param access_type
     * @param modal_name
     */
    insertAdvice(params, access_type, modal_name) {
        const { chargeMaxCount, crc } = this.state;
        if (chargeMaxCount - crc === 0) {
            PopModal.closeProgress();
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: <p>포스냅에서는 최대 3명의 작가님께 견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담 혹은 고객센터로 문의내용을 접수해주세요.</p>,
                onSubmit: () => {
                    PopModal.close(modal_name);
                }
            });
        } else {
            const { referParam } = this.state;
            const _params = Object.assign({}, params);
            if (!utils.type.isEmpty(referParam)) {
                Object.assign(_params, referParam);
            }

            virtualEstimateHelper.apiInsertArtistOrder(_params)
                .then(response => {
                    PopModal.closeProgress();
                    // setCRC();
                    const phaseModalName = "phase-modal";
                    this.chargeCount.setCRC();
                    this.externalEvents();
                    PopModal.close(modal_name);
                    let nextAccessType = null;
                    if (access_type === "detail_add") {
                        nextAccessType = "detail_add_estimate";
                    } else if (access_type === "detail_artist") {
                        nextAccessType = "detail_artist_add";
                    }

                    this.setState({ crc: this.chargeCount.getCRC() });

                    PopModal.createModal(phaseModalName, (
                        <FirstPhase
                            onClose={() => PopModal.close(phaseModalName)}
                            consultAbleCount={chargeMaxCount - (Number(crc) + 1)}
                            callBack={() => this.onAnotherRecommend(_params, nextAccessType, modal_name, this.chargeCount.getCRC())}
                        />)
                    , { className: phaseModalName, modal_close: false });

                    PopModal.show(phaseModalName);
                })
                .catch(error => {
                    PopModal.closeProgress();
                    if (error && error.date) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    externalEvents() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    onAnotherRecommend(params, access, modalName, crc) {
        const { chargeMaxCount } = this.state;
        const { data } = this.props;

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        if (chargeMaxCount - crc > 0) {
            this.fetchChargeArtist({ category: data.category })
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    const _data = response.data;
                    const prop = {
                        list: _data.list || [],
                        // title,
                        // desc,
                        selectArtistSendConsult: select_list => this.onChargeArtistConsult(Object.assign({}, params, { access_type: access }), _data.list, select_list)
                    };

                    Modal.show({
                        type: MODAL_TYPE.CUSTOM,
                        name: "another_artist",
                        overflow: false,
                        //full: true,
                        content: <AnotherRecommendArtist {...prop} count={crc} onClose={() => Modal.close()} />
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        } else {
            this.renderLastPhase();
        }
    }

    onConsultDirectArtist(access_type) {
        this.onConsult(access_type);
    }

    gaEvent(action) {
        const { data } = this.props;
        utils.ad.gaEvent("M_기업_상세", action, `${data.category}_${data.nick_name}_${data.product_no}`);
    }

    render() {
        const { data } = this.props;
        const { portfolioData, isLike, career, review, artistReview, region, chargeProducts } = this.state;
        return (
            <div className="product-detail-business business__detail">
                <div className="business__detail__content-box">
                    <div className="business__detail__content">
                        <ProductDetailPortfolio
                            {...portfolioData}
                            isLike={isLike}
                            onShare={this.onShare}
                            onLike={this.onLike}
                            onShow={this.onShowPortfolio}
                            gaEvent={this.gaEvent}
                        />
                    </div>
                    <div className="business__detail__content">
                        <div className="content-box flex-area column-flex">
                            <ProductInformation
                                nickName={data.nick_name}
                                review={review}
                                career={career}
                                artistReview={artistReview}
                                onShow={this.onShowSelfReview}
                                gaEvent={this.gaEvent}
                            />
                            <AboutArtist
                                intro={data.intro}
                                nickName={data.nick_name}
                                isCorp={data.is_corp}
                                profile={data.profile_img}
                                region={region}
                                onConsult={this.onConsultDirectArtist}
                                gaEvent={this.gaEvent}
                            />
                            <VirtualEstimate
                                onConsultSearchArtist={this.onConsultContainer}
                                onConsultEstimate={this.onConsultEstimate}
                                gaEvent={this.gaEvent}
                                renewDetail
                                category={data.category}
                            />
                        </div>
                    </div>
                    <div className="business__detail__another-products">
                        <ChargeProducts list={chargeProducts} category={data.category} gaEvent={this.gaEvent} />
                    </div>
                </div>
                <div className="layout__footer">
                    <Footer>
                        <ScrollTop category={data.category} product_no={data.product_no} nick_name={data.nick_name} />
                    </Footer>
                </div>
            </div>
        );
    }
}
