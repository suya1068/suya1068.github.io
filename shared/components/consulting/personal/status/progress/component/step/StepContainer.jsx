import "./step.scss";
import React, { Component, PropTypes } from "react";
import Category from "./category/Category";
// import Info from "./info/Info";
import InfoBiz from "./info/Info_biz";
// import Content from "./content/Content";
import ContentBiz from "./content/Content_biz";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import ConsultHelper from "shared/components/consulting/helper/ConsultHelper";
// import AdviceChoice from "./choice/AdviceChoice";
// import classNames from "classnames";
// import auth from "forsnap-authentication";

export default class StepContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 2,                                        // 현재 단계
            // is_enter: props.is_enter,                       // 기업고객 체크
            ///// category - 단계시 필요 state
            product_no: props.product_no || "",             // 상품 번호
            referer: props.referer || {},                   // 유입 사이트
            referer_keyword: props.referer_keyword || {},   // 유입 키워드
            category: props.category,                       // 카테고리
            access_type: props.access_type,                 // 상담요청 유입 유형
            device_type: props.device_type,                 // 상담요청 기기 (pc, mobile)
            status: "",                                     // 진행상태 (category, content, info)
            advice_order_no: "",                            // 상담요청 번호
            temp_user_id: "",                               // 임시 유저 아이디
            page_type: "biz",                               // 무조건 기업고객
            // page_type: props.is_enter ? "personal" : "biz", // 기업, 개인고객 유형
            upload_info: {},                                // 업로드 정책
            // extra_info: {},
            ///// content - 단계시 필요 state
            content: "",                                    // 상담 내용
            attach_info: [],                                // 업로드 임시배열
            attach: [],                                     // 내려받은 파일 데이터
            url: "",                                        // 참고사이트
            user_email: "",                                 // 이메일
            ///// info - 단계시 필요 state
            user_name: "",                                  // 유저 이름
            user_phone: "",                                 // 연락처
            counsel_time: "",                               // 상담가능 시간
            ///// finish
            is_complete: false,
            is_change_category: false,
            ///////
            is_exit: false,
            href: "",
            kakao_parameter: ""
        };
        this.helper = new ConsultHelper();
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        // this.onKaKao = this.onKaKao.bind(this);
        this.onSubmitConsult = this.onSubmitConsult.bind(this);
        this.currentStepToRenderConsult = this.currentStepToRenderConsult.bind(this);
        // api
        this.setCategory = this.setCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updateContent = this.updateContent.bind(this);
        // this.updateContentTrans = this.updateContentTrans.bind(this);
        // this.updateInfoTrans = this.updateInfoTrans.bind(this);
        //
        this.nextStepToCategory = this.nextStepToCategory.bind(this);
        this.nextStepToContent = this.nextStepToContent.bind(this);
        this.onDeleteAttach = this.onDeleteAttach.bind(this);
        // this.createParameter = this.createParameter.bind(this);
    }

    componentDidMount() {
        const { device_type } = this.state;
        if (localStorage && device_type === "mobile") {
            const advice_order_no = localStorage.getItem("advice_order_no");
            const temp_user_id = localStorage.getItem("temp_user_id");
            if (advice_order_no) {
                this.fetchAdviceOrder(advice_order_no, temp_user_id);
            }
        }
    }

    componentWillUnmount() {
        // this.state.extra_info = {};
    }

    /**
     * 임시 유저 아이디가 있는지 체크한다.
     * @param id
     * @returns {boolean | *}
     */
    checkUserId(id) {
        return id.startsWith("temp");
    }

    getCategory() {
        return this.state.category;
    }

    /**
     * 상담요청 내용을 저장한다.
     * @param data
     */
    setAdviceData(data) {
        const user_id = data.user_id;
        const is_temp_user = this.checkUserId(user_id);
        const advice_data = {
            advice_order_no: data.advice_order_no,
            attach: data.attach || [],
            category: data.category,
            content: data.content || "",
            counsel_time: data.counsel_time || "",
            // extra_info: data.extra_info || null,
            status: data.status,
            url: data.url || "",
            user_name: data.user_name || "",
            user_phone: data.user_phone || "",
            user_email: data.user_email || ""
        };
        if (is_temp_user) {
            advice_data.temp_user_id = data.user_id;
        }
        if (!this._calledComponentWillUnmount) {
            this.setState({ ...advice_data });
        }
    }

    /**
     * 상담요청 내용을 가져오는 API를 호출한다.
     * @param no
     * @param id
     * @returns {Promise<T>}
     */
    fetchAdviceOrder(no, id = "") {
        return this.helper.getAdviceOrder(no, id)
            .then(response => {
                const res_data = response.data;
                this.setAdviceData(res_data);
            }).catch(error => {
                // 상담요청 내용을 불러오기 실패하면 메인화면으로 리다이렉트 시킨다.
                PopModal.alert(error.data, { callBack: () => { location.href = "/"; } });
            });
    }

    /**
     * 상담요청 첫번째 단계
     * @param category
     */
    nextStepToCategory(category) {
        const { status, page_type, temp_user_id, advice_order_no } = this.state;
        const { device_type, access_type, product_no, referer, referer_keyword } = this.props;

        if (!status) {      // 최초 상담등록
            const set_category_data = { device_type, access_type, page_type, category };    // 필수
            if (product_no) {
                set_category_data.product_no = product_no;
            }

            if (referer) {
                set_category_data.referer = referer;
            }

            if (referer_keyword) {
                set_category_data.referer_keyword = referer_keyword;
            }
            this.setCategory(set_category_data);
        } else {            // 카테고리 수정
            const update_category_data = { category };
            if (temp_user_id) {         // 비 로그인 상담신청 이라면
                update_category_data.temp_user_id = temp_user_id;
            }
            this.updateCategory(advice_order_no, update_category_data);
        }
    }

    /**
     * 상담요청 두번째 단계
     * @param instance
     */
    nextStepToContent(instance) {
        const { advice_order_no, temp_user_id } = this.state;
        const content_info_data = { content: instance.getContent() };
        const url = instance.getUrl && instance.getUrl();

        if (temp_user_id) {         // 비 로그인 상담신청 이라면
            content_info_data.temp_user_id = temp_user_id;
        }
        if (url) {
            content_info_data.url = url;
        }

        const user_email = instance.getUserEmail();

        if (user_email) {
            if (utils.isValidEmail(user_email)) {
                content_info_data.user_email = user_email;
            } else {
                PopModal.toast("이메일을 정확히 입력해주세요.");
                return;
            }
        }
        this.updateContent(advice_order_no, content_info_data);

        // if (utils.checkCategoryForEnter(this.state.category)) {
        //     const user_email = instance.getUserEmail();
        //
        //     if (user_email) {
        //         if (utils.isValidEmail(user_email)) {
        //             content_info_data.user_email = user_email;
        //         } else {
        //             PopModal.toast("이메일을 정확히 입력해주세요.");
        //             return;
        //         }
        //     }
        //     this.updateContent(advice_order_no, content_info_data);
        // } else {
        //     const extra_info = instance.getExtraInfo();
        //     const attach_info = instance.getAttachInfo();
        //     const content = instance.getContent();
        //     content_info_data.extra_info = JSON.stringify(extra_info);
        //     if (Array.isArray(attach_info) && attach_info.length > 0) {
        //         content_info_data.attach_info = JSON.stringify(attach_info);
        //     }
        //     if (content) {
        //         content_info_data.content = content;
        //     }
        //     this.updateContentTrans(advice_order_no, content_info_data);
        // }
    }

    /**
     * 다음단계
     * @param step
     */
    onNext(step) {
        PopModal.progress();
        if (step === 2) {       // 카테고리 등록 스텝
            const category = this.category_inst.getCategory();
            this.nextStepToCategory(category);
        } else if (step === 3) {        // 상담내용 입력 단계
            const content_inst = this.content_inst;
            this.nextStepToContent(content_inst);
        } else if (step === 4) {
            this.onChangeStep(step);
        }
    }

    /**
     * 상담신청을 등록한다.
     * @param data
     * @returns {Promise<T>}
     */
    setCategory(data) {
        return this.helper.setAdviceOrdersCategory(data)
            .then(response => {
                PopModal.closeProgress();
                const res_data = response.data;
                const advice_order_no = res_data.advice_order_no;
                const temp_user_id = res_data.temp_user_id;

                // if (localStorage) {
                //     localStorage.setItem("advice_order_no", response.data.advice_order_no);
                //     if (temp_user_id) {
                //         localStorage.setItem("temp_user_id", response.data.temp_user_id);
                //     }
                // }

                this.setState({
                    upload_info: res_data.upload_info,
                    step: 3,
                    advice_order_no,
                    // extra_info: null,
                    temp_user_id: temp_user_id || "",
                    category: data.category,
                    status: "CATEGORY"
                }, () => {
                    this.onChangeStep(this.state.step);
                });
            }).catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 단계변경을 부모 컨테이너에 전달한다.
     * @param step
     */
    onChangeStep(step) {
        PopModal.closeProgress();
        const { advice_order_no, temp_user_id } = this.state;
        if (advice_order_no && step < 4) {
            this.fetchAdviceOrder(advice_order_no, temp_user_id);
        }
        if (typeof this.props.onChangeStep === "function") {
            this.props.onChangeStep(step);
        }
    }

    /**
     * 카테고리를 수정한다.
     * @param no
     * @param data
     * @returns {Promise<T>}
     */
    updateCategory(no, data) {
        return this.helper.fetchAdviceOrdersCategory(no, data)
            .then(response => {
                PopModal.closeProgress();
                const res_data = response.data;
                const is_change_category = this.state.category !== res_data.category;
                // this.setAdviceData(res_data);
                this.setState({
                    upload_info: res_data.upload_info,
                    attach: res_data.attach,
                    category: res_data.category,
                    is_change_category,
                    status: res_data.status,
                    step: 3
                }, () => {
                    this.onChangeStep(this.state.step);
                });
            }).catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 기본정보를 등록 및 수정한다.
     * @param no
     * @param data
     * @returns {Promise<T>}
     */
    updateInfo(no, data) {
        return this.helper.fetchAdviceOrderInfo(no, data)
            .then(response => {
                const res_data = response.data;
                PopModal.closeProgress();
                this.setState({
                    user_name: res_data.user_name,
                    user_phone: res_data.user_phone,
                    status: res_data.status,
                    is_change_category: false,
                    is_complete: true
                    // step: 3
                }, () => {
                    this.onChangeStep(this.state.step);
                    if (typeof this.props.onSubmitConsult === "function") {
                        this.props.onSubmitConsult({ is_complete: true, status: res_data.status, attach_info: this.state.attach_info });
                    }
                });
            }).catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 상담내용을 등록 및 수정한다.
     * @param no
     * @param data
     * @returns {Promise<T>}
     */
    updateContent(no, data) {
        return this.helper.fetchAdviceOrderContent(no, data)
            .then(response => {
                const res_data = response.data;
                PopModal.closeProgress();
                // const attach = this.content_inst.getAttachInfo();
                this.setState({
                    content: res_data.content,
                    status: res_data.status,
                    counsel_time: res_data.counsel_time,
                    url: res_data.url || "",
                    // attach: attach || [],
                    is_change_category: false,
                    user_email: res_data.user_email || "",
                    step: 4
                    // href: `https://api.happytalk.io/api/kakao/chat_open?${utils.query.stringify(this.createParameter(res_data))}`
                    // is_complete: true
                }, () => {
                    this.onChangeStep(this.state.step);
                });
            }).catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 개선된 상담내용 등록 및 수정
     * @param no
     * @param data
     * @returns {Promise<T>}
     */
    // updateContentTrans(no, data) {
    //     return this.helper.updateAdviceOrderContentTrans(no, data)
    //         .then(response => {
    //             const res_data = response.data;
    //             PopModal.closeProgress();
    //             const attach = this.content_inst.getAttachInfo();
    //             this.setState({
    //                 content: res_data.content,
    //                 status: res_data.status,
    //                 // counsel_time: res_data.counsel_time,
    //                 url: res_data.url || "",
    //                 attach: attach || [],
    //                 is_change_category: false,
    //                 step: 4
    //                 // is_complete: true
    //             }, () => {
    //                 this.onChangeStep(this.state.step);
    //             });
    //         }).catch(error => {
    //             PopModal.alert(error.data);
    //             PopModal.closeProgress();
    //         });
    // }

    /**
     * 개선된 상담요청 정보를 등록한다.
     * @param no
     * @param data
     * @returns {Promise<T>}
     */
    // updateInfoTrans(no, data) {
    //     return this.helper.updateAdviceOrderInfoTrans(no, data)
    //         .then(response => {
    //             const res_data = response.data;
    //             PopModal.closeProgress();
    //             this.setState({
    //                 user_name: res_data.user_name,
    //                 user_phone: res_data.user_phone,
    //                 status: res_data.status,
    //                 is_change_category: false,
    //                 is_complete: true
    //                 // step: 3
    //             }, () => {
    //                 this.onChangeStep(this.state.step);
    //                 if (typeof this.props.onSubmitConsult === "function") {
    //                     this.props.onSubmitConsult({ is_complete: true, status: res_data.status, attach_info: this.state.attach_info });
    //                 }
    //             });
    //         }).catch(error => {
    //             PopModal.alert(error.data);
    //             PopModal.closeProgress();
    //         });
    // }

    /**
     * 이전단계
     * @param step
     */
    onPrev(step) {
        PopModal.progress();
        this.setState({ step }, () => {
            this.onChangeStep(this.state.step);
        });
        // this.setState(this.stepChange(step));
    }

    /**
     * 파일 삭제
     * @param idx
     */
    onDeleteAttach(idx) {
        PopModal.progress();
        const { advice_order_no, temp_user_id } = this.state;
        const param = {};
        if (temp_user_id) {
            param.temp_user_id = temp_user_id;
        }
        this.helper.deleteAttachFile(advice_order_no, idx, param)
            .then(response => {
                PopModal.closeProgress();
                this.setAdviceData(response.data);
            }).catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }


    /**
     * 상담신청 버튼 클릭
     */
    onSubmitConsult() {
        PopModal.progress();
        const { temp_user_id, advice_order_no, attach_info } = this.state;
        const info_inst = this.info_inst;
        const update_info_data = {
            counsel_time: info_inst.getCounselTime(),
            user_name: info_inst.getName(),
            user_phone: info_inst.getPhone()
            // counsel_type: info_inst.getCounselType()
        };
        // const content_inst = this.content_inst;
        // const attach_info = content_inst.getAttachInfo();
        if (temp_user_id) {         // 비 로그인 상담신청 이라면
            update_info_data.temp_user_id = temp_user_id;
        }

        if (Array.isArray(attach_info) && attach_info.length > 0) {
            update_info_data.attach_info = JSON.stringify(attach_info);
        }

        this.updateInfo(advice_order_no, update_info_data);

        // if (utils.checkCategoryForEnter(this.state.category)) {
        //     if (Array.isArray(attach_info) && attach_info.length > 0) {
        //         update_info_data.attach_info = JSON.stringify(attach_info);
        //     }
        //     this.updateInfo(advice_order_no, update_info_data);
        // } else {
        //     this.updateInfoTrans(advice_order_no, update_info_data);
        // }
    }

    /**
     * 상담신청하기 진행과정 렌더링 컨테이너
     * @param step
     * @returns {*}
     */
    renderStep(step) {
        return (
            <div className="container-box">
                {this.currentStepToRenderConsult(step)}
            </div>
        );
    }

    getCurrentState() {
        return this.choice_inst && this.choice_inst.getCurrentState();
    }

    /**
     * 카카오톡 상담진행
     * @param no
     */
    // onKaKao(no = undefined) {
    //     const { temp_user_id, attach_info, url, user_email, content } = this.state;
    //     const choice_inst = this.choice_inst;
    //     const data = {};
    //     const href = `https://api.happytalk.io/api/kakao/chat_open?${utils.query.stringify(this.createParameter({ url, user_email, content }))}`;
    //
    //     if (temp_user_id) {
    //         data.temp_user_id = temp_user_id;
    //     }
    //
    //     if (attach_info) {
    //         data.attach_info = JSON.stringify(attach_info);
    //     }
    //
    //     if (choice_inst.getTestFlag()) {
    //         this.fetchInfoForKaKao(no, data);
    //     }
    //
    //     this.setState({ href });
    //     return href;
    // }

    /**
     * 카카오톡 상담진행
     * @param no
     * @param data
     */
    // fetchInfoForKaKao(no, data) {
    //     this.helper.fetchAdviceOrderInfoForKaKao(no, data)
    //         .then(response => {
    //             // 카카오톡 상담가능 API 호출한다.
    //             if (typeof this.props.onSubmitConsult === "function") {
    //                 this.props.onSubmitConsult({ is_complete: true, status: null });
    //             }
    //         })
    //         .catch(error => {
    //             PopModal.alert(error.data);
    //         });
    // }

    /**
     * 카카오톡 상담을 위한 파라미터를 생성한다.
     * advice_order_no : 상담요청 번호
     * category: 카테고리
     * content: 상담내용
     * url: 참고사이트 - optional
     * user_email: 고객 이메일 - optional
     * @returns {*}
     */
    // createParameter(data) {
    //     const { advice_order_no, category } = this.state;
    //     const user = auth.getUser();
    //     const parameter = {
    //         yid: "%40forsnap",
    //         site_id: "4000000720",
    //         category_id: "82199",
    //         division_id: "82202",
    //         site_uid: user ? user.id : ""
    //     };
    //
    //     parameter.parameter1 = advice_order_no;
    //     parameter.parameter2 = category;
    //     parameter.parameter3 = data.content;
    //     if (data.url) {
    //         parameter.parameter4 = data.url;
    //     }
    //
    //     if (data.user_email) {
    //         parameter.parameter5 = data.user_email;
    //     }
    //
    //     return parameter;
    // }

    /**
     * 상담신청하기 진행과정 렌더링
     * @param step
     * @returns {*}
     */
    currentStepToRenderConsult(step) {
        // const { is_enter } = this.props;
        const {
            user_email,
            category,
            user_name,
            user_phone,
            content,
            attach,
            counsel_time,
            is_change_category,
            advice_order_no,
            attach_info,
            url,
            // extra_info,
            temp_user_id,
            //href,
            upload_info } = this.state;
        const info_data = { category, user_name, user_phone, counsel_time, attach_info };
        const content_data = { content, user_email, attach, url, attach_info, counsel_time, category, is_change_category, advice_order_no, temp_user_id, upload_info };
        // const is_enter_category = utils.checkCategoryForEnter(category);

        switch (step) {
            case 2: return <Category ref={instance => { this.category_inst = instance; }} category={category} onNext={this.onNext} />;
            case 3: return (
                <ContentBiz ref={instance => { this.content_inst = instance; }} step={step} {...content_data} onPrev={this.onPrev} onNext={this.onNext} />
            );
                // {/*<Content*/}
                // {/*ref={instance => { this.content_inst = instance; }}*/}
                // {/*step={step}*/}
                // {/*{...content_data}*/}
                // {/*onPrev={this.onPrev}*/}
                // {/*onNext={this.onNext}*/}
                // {/*onDeleteAttach={this.onDeleteAttach}*/}
                // {/*/>;*/}
            case 4: return (
                <InfoBiz
                    ref={instance => { this.info_inst = instance; }}
                    step={step}
                    {...info_data}
                    onPrev={this.onPrev}
                    onSubmitConsult={this.onSubmitConsult}
                />);
                // :
                // <Info
                //     ref={instance => { this.info_inst = instance; }}
                //     step={step}
                //     {...info_data}
                //     onPrev={this.onPrev}
                //     onSubmitConsult={this.onSubmitConsult}
                // />;
            // case 5: return is_enter_category && <InfoBiz ref={instance => { this.info_inst = instance; }} step={step} {...info_data} onPrev={this.onPrev} onSubmitConsult={this.onSubmitConsult} />;
                /*
                     <AdviceChoice
                    ref={instance => { this.choice_inst = instance; }}
                    step={step}
                    kakao_href={href}
                    advice_order_no={advice_order_no}
                    onPrev={this.onPrev}
                    onNext={this.onNext}
                    onKaKao={this.onKaKao}
                    />
                 */
            default: return null;
        }
    }

    render() {
        const { step } = this.props;
        return (
            <div className="consult_progress__step-container">
                {this.renderStep(step)}
            </div>
        );
    }
}
