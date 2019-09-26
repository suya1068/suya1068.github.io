import "./portfolioRegistContainer.scss";
import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import RegistBasicInfo from "./RegistBasicInfo";
import RegistPortfolio from "./RegistPortfolio";
import RegistVideo from "./RegistVideo";
import Buttons from "desktop/resources/components/button/Buttons";

export default class PortfolioRegistContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            params: {
                portfolio_no: props.params.portfolio_no || undefined
            },
            category_code: "",
            category_name: "",
            title: "",
            photo_list: [],
            portfolio_video: [],
            upload_info: {},
            select_category: ""
        };
        this.basicInfo = null;
        this.portfolio = null;

        this.isVideo = this.isVideo.bind(this);
        this.onNextContainer = this.onNextContainer.bind(this);
        this.updateBasicInfo = this.updateBasicInfo.bind(this);
        this.onNextComplete = this.onNextComplete.bind(this);
        this.onSelectCategory = this.onSelectCategory.bind(this);
    }

    componentWillMount() {
        const portfolioVideo = this.state.portfolio_video;

        while (portfolioVideo.length < 3) {
            const length = portfolioVideo.length;
            portfolioVideo.push({ key: Date.now(), display_order: length + 1, portfolio_video: "" });
        }

        this.state.portfolio_video = portfolioVideo;
    }

    componentDidMount() {
        const { params } = this.state;
        if (params.portfolio_no) {
            const user = this.setUser();
            this.getAPIPortfolioDetail(user.id, params.portfolio_no);
        }
    }

    /**
     * 등록
     * @param promises
     */
    onPromise(promises) {
        Promise.all(promises).then(res => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "등록 되었습니다"
            });
            const portfolio_instance = this.portfolio;
            if (portfolio_instance) {
                portfolio_instance.completeUpdate();
            }
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "등록 중에 에러가 발생했습니다. 잠시 후 다시 등록해주세요"
            });
        });
    }

    /**
     * 다음단계 및 완료단계 기능 컨테이너
     */
    onNextContainer() {
        const user = this.setUser();
        if (this.state.params.portfolio_no) {
            this.onNextComplete({ user, portfolio_no: this.state.params.portfolio_no });
        } else {
            this.onNextBasicInfo({ user, portfolio_no: this.state.params.portfolio_no });
        }
    }

    /**
     * 기본정보 입력 단계
     * @param data
     */
    onNextBasicInfo(data = {}) {
        const basic_instance = this.basicInfo;
        const basic_valid = basic_instance.validate();
        if (!basic_valid) {
            const basic_data = this.setBasicInfoData(basic_instance);
            if (!data.portfolio_no) {
                this.registBasicInfo({ user: data.user, data: basic_data });
            } else {
                this.updateBasicInfo({ user: data.user, portfolio_no: data.portfolio_no, data: basic_data });
            }
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(basic_valid)
            });
        }
    }

    /**
     * 포트폴리오 수정 및 완료 기능 컨테이너
     * @param data
     */
    onNextComplete(data = {}) {
        const basic_instance = this.basicInfo;
        const portfolio_instance = this.portfolio;
        const portfolio_video_instance = this.portfolioVideo;
        const basic_valid = basic_instance && basic_instance.validate();
        const portfolio_valid = portfolio_instance && portfolio_instance.validate();
        const portfolio_video_valid = portfolio_video_instance && portfolio_video_instance.validateVideo();
        let error_message = "";
        if (basic_instance && basic_valid) {
            error_message = basic_valid;
        } else if (portfolio_instance && portfolio_valid) {
            error_message = portfolio_valid;
        } else if (portfolio_video_instance && !portfolio_video_valid.status) {
            error_message = portfolio_video_valid.message;
        }

        if (!error_message) {
            this.onPromise(this.completeContainer(data, { basic_instance, portfolio_instance, portfolio_video_instance }));
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error_message)
            });
        }
    }

    onSelectCategory(code) {
        this.setState({
            select_category: code
        });
    }

    isVideo(category) {
        return ["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1;
    }

    /**
     * 유저정보를 저장한다.
     * @returns {*}
     */
    setUser() {
        const user = auth.getUser();
        this.state.user = user;
        return user;
    }

    /**
     * 견적서용 포트폴리오 기본정보 등록
     * @param params
     */
    registBasicInfo(params) {
        this.apiCreateBasicInfo(params).then(response => {
            const res = response.data;
            this.setState({
                upload_info: res.upload_info,
                params: { portfolio_no: res.portfolio_no },
                category_code: res.category_code,
                select_category: res.category_code
            });
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    /**
     * 견적서용 포트폴리오 기본정보 수정
     * @param params
     */
    updateBasicInfo(params) {
        this.apiUpdateBasicInfo(params).then(response => {
            const res = response.data;
            this.setState({
                upload_info: res.upload_info,
                params: { portfolio_no: res.portfolio_no },
                category_code: res.category_code,
                select_category: res.category_code
            });
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    /**
     * 완료 단계에서 수정사항 발생 필요 api 등록 후 반환
     * @param params
     * @param instances
     * @returns {Array}
     */
    completeContainer(params, instances) {
        const portfolio_instance = instances.portfolio_instance;
        const basic_instance = instances.basic_instance;
        const portfolio_video_instance = instances.portfolio_video_instance;
        const promise = [];
        if (basic_instance && basic_instance.getChangeBasicInfo()) {
            params.data = this.setBasicInfoData(basic_instance);
            promise.push(this.apiUpdateBasicInfo(params));
        }

        if (portfolio_instance && portfolio_instance.getChangeDisplayOrder()) {
            promise.push(this.apiUpdateDisplayOrder(params, portfolio_instance));
        }

        if (portfolio_video_instance) {
            const result = portfolio_video_instance.validateVideo();
            if (result.status) {
                const user = auth.getUser();
                if (user) {
                    promise.push(API.offers.updatePortfolioVideo(user.id, params.portfolio_no, { video_list: JSON.stringify(result.video_list) }));
                }
            }
        }

        return promise;
    }

    /**
     * 기본정보 컴포넌트에 필요한 데이터 셋
     * @param instance
     * @returns {{category: *, title: *}}
     */
    setBasicInfoData(instance) {
        return { category: instance.getSelectCategory(), title: instance.getTitle() };
    }

    /**
     * 견적용 포트폴리오 상세 조회
     * @param id
     * @param no
     */
    getAPIPortfolioDetail(id, no) {
        const request = API.offers.getEstimatePortfolioDetail(id, no);
        request.then(response => {
            const data = response.data;
            const portfolioVideo = data.portfolio_video ? data.portfolio_video.list : [];

            while (portfolioVideo.length < 3) {
                const length = portfolioVideo.length;
                portfolioVideo.push({ key: Date.now(), display_order: length + 1, portfolio_video: "" });
            }

            this.setState({
                photo_list: data.list,
                portfolio_video: portfolioVideo,
                category_code: data.category_code,
                category_name: data.category_name,
                select_category: data.category_code,
                title: data.title,
                params: { portfolio_no: data.portfolio_no },
                upload_info: data.upload_info
            });
        });
    }

    /**
     * 견적서용 포트폴리오 수정 api를 호출한다.
     * @param params
     * @returns {*}
     */
    apiUpdateBasicInfo(params) {
        return API.offers.updateEstimatePortfolioBasicInfo(params.user.id, params.portfolio_no, params.data);
    }

    /**
     * 견적서용 포트폴리오 등록 api를 호출한다.
     * @param params
     * @returns {*}
     */
    apiCreateBasicInfo(params) {
        return API.offers.registEstimatePortfolioBasicInfo(params.user.id, params.data);
    }

    /**
     * 견적서용 포트폴리오 노출 순서 변경 api를 호출한다.
     * @param params
     * @param instance
     * @returns {IDBRequest|Promise<void>}
     */
    apiUpdateDisplayOrder(params, instance) {
        const list = instance.getPhotoList();
        const photo_list = list.reduce((result, obj) => { delete obj.thumb_key; result.push(obj); return result; }, []);
        return API.offers.updateDisplayOrder(params.user.id, params.portfolio_no, { photo_list: JSON.stringify(photo_list) });
    }

    /**
     * 포트폴리오 수정 및 등록 api parameter 조합한다.
     * @param data
     * @returns {{title: *, category_name: (string|*), category_code: (string|*), select_category: (string|*)}}
     */
    combineBasicData(data = {}) {
        return {
            title: data.title,
            category_name: data.category_name,
            category_code: data.category_code,
            select_category: data.category_code,
            onSelectCategory: this.onSelectCategory
        };
    }

    /**
     * 포트폴리오 사진 순서 변경 api parameter 를 조합한다.
     * @param data
     * @returns {{user: *, list: (Array|string|*), portfolio_no: *, upload_info: ({}|PortfolioRegistContainer.state.upload_info|*|Content.state.upload_info|StepContainer.state.upload_info)}}
     */
    combinePortfolio(data = {}) {
        return {
            user: data.user,
            list: data.photo_list,
            portfolio_no: data.portfolio_no,
            upload_info: data.upload_info,
            category_code: data.category_code,
            select_category: data.category_code
        };
    }

    /**
     * 포트폴리오 등록 및 수정 뷰를 렌더링한다.
     * @returns {*}
     */
    onRenderContent() {
        const { params, category_code, category_name, select_category, title, upload_info, user, photo_list, portfolio_video } = this.state;
        const { portfolio_no } = params;
        const prop_param = this.props.params;
        if (!prop_param.portfolio_no) {
            if (portfolio_no) {
                return this.onRenderPortfolio({ upload_info, portfolio_no, category_code, select_category, photo_list, portfolio_video, user });
            }

            if (!portfolio_no) {
                return this.onRenderBasicInfo({ title, category_code, category_name, onSelectCategory: this.onSelectCategory });
            }
        }

        return this.onRenderUpdateContent({ title, category_name, category_code, select_category, upload_info, portfolio_no, photo_list, portfolio_video, user });
    }

    /**
     * 견적서용 포트폴리오 기본정보 입력 화면을 렌더링한다.
     * @param data
     * @returns {*}
     */
    onRenderBasicInfo(data = {}) {
        return <RegistBasicInfo {...data} ref={instance => { this.basicInfo = instance; }} />;
    }

    /**
     * 견적서용 포트폴리오 포트폴리오 사진 업로드 화면을 렌더링한다.
     * @param data
     * @returns {*}
     */
    onRenderPortfolio(data = {}) {
        return (
            <div>
                {this.isVideo(data.select_category) ?
                    <RegistVideo data={data.portfolio_video} category={data.select_category} ref={ref => (this.portfolioVideo = ref)} />
                    : null
                }
                <RegistPortfolio {...data} ref={instance => { this.portfolio = instance; }} />
            </div>
        );
    }

    /**
     * 견적서용 포트폴리오 수정화면을 렌더링한다.
     * @param data
     * @returns {*}
     */
    onRenderUpdateContent(data = {}) {
        return (
            <div className="test">
                <RegistBasicInfo {...this.combineBasicData(data)} ref={instance => { this.basicInfo = instance; }} />
                {this.isVideo(data.select_category) ?
                    <RegistVideo data={data.portfolio_video} category={data.select_category} ref={ref => (this.portfolioVideo = ref)} />
                    : null
                }
                <RegistPortfolio {...this.combinePortfolio(data)} ref={instance => { this.portfolio = instance; }} />
            </div>
        );
    }


    /**
     * 버튼 제목을 결정한다.
     * @returns {string}
     */
    buttonTitle() {
        const { params } = this.state;
        const prop_params = this.props;
        return !prop_params.portfolio_no && !params.portfolio_no ? "다음단계 진행하기" : "완료";
    }

    render() {
        return (
            <div className="portfolio-regist-container">
                <h1 className="page-title h3-sub">견적서 포트폴리오 등록</h1>
                <div className="page-description">
                    <p>
                        비노출 포트폴리오는 촬영요청의 견적서 작성, 포스냅 상담요청건의 견적제안 시 고객님에게 전달되며 다른 곳에는 노출되지 않습니다.<br />
                        고객님에게 전달 시 일주일간만 노출되기 때문에 외부로 공개하기 어려운 포트폴리오도 등록이 가능합니다.<br />
                        카테고리별/컨셉별로 포트폴리오를 등록하시면 포스냅으로 직접 상담요청한 고객에게 작가님 안내 시 소개되며,<br />
                        촬영요청의 견적서 작성시에도 해당 포트폴리오를 첨부하실 수 있습니다.
                    </p>
                </div>
                <div className="portfolio-regist-step">
                    {this.onRenderContent()}
                </div>
                <div className="portoflio-regist__buttons">
                    <div className="artist-content-row text-center">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.onNextContainer }}>{this.buttonTitle()}</Buttons>
                    </div>
                </div>
            </div>
        );
    }
}
