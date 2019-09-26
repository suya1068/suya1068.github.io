import "./IntroVideoPage.scss";
import React, { Component, PropTypes } from "react";
import { Banner } from "desktop/resources/views/information/components";
import api from "forsnap-api";
import utils from "forsnap-utils";
import { Footer } from "mobile/resources/containers/layout";
import { INFORMATION, VIDEO_LIST_CODE } from "shared/constant/information.const";
import Img from "shared/components/image/Img";
import VideoList from "./component/VideoList";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import PopModal from "shared/components/modal/PopModal";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

class IntroVideoPage extends Component {
    constructor() {
        super();

        this.state = {
            videoList: INFORMATION.VIDEO,
            videoListTag: INFORMATION.VIDEO_LIST_TAG,
            render_list: INFORMATION.PORTFOLIO,
            list: {
                ad: {
                    list: [],
                    isSetData: false
                },
                event: {
                    list: [],
                    isSetData: false
                },
                etc: {
                    list: [],
                    isSetData: false
                }
            }
        };
        this.requestVimeoXML = this.requestVimeoXML.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.setVimeoVideoXML = this.setVimeoVideoXML.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { videoList, videoListTag } = this.state;
        const ad_list = videoList[VIDEO_LIST_CODE.AD];
        const event_list = videoList[VIDEO_LIST_CODE.EVENT];
        const etc_list = videoList[VIDEO_LIST_CODE.ETC];
        this.setVimeoVideoXML(VIDEO_LIST_CODE.AD, ad_list);
        this.setVimeoVideoXML(VIDEO_LIST_CODE.EVENT, event_list);
        this.setVimeoVideoXML(VIDEO_LIST_CODE.ETC, etc_list);

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "영상촬영 이용안내" });
        }, 0);
    }

    setVimeoVideoXML(code, list) {
        const _list = this.state.list;
        const videoList = this.state.videoList;
        if (Array.isArray(list) && list.length > 0) {
            // let xmlSetData;
            Promise.all(list.map(item => this.requestVimeoXML("GET", `https://vimeo.com/api/v2/video/${item.video_id}.xml`)))
                .then(result => {
                    const test = result.reduce((res, obj) => {
                        const findIndex = videoList[code].findIndex(chk => {
                            return chk.video_id === obj.id;
                        });

                        let title;
                        if (findIndex !== -1) {
                            title = videoList[code][findIndex].title;
                        }

                        const item = {
                            id: obj.id,
                            title,
                            thumb_nail: obj.thumb_nail
                        };

                        res.push(item);

                        return res;
                    }, []);

                    _list[code].list = test;
                    _list[code].isSetData = true;
                    this.setState({ list: _list });
                })
                .catch(reject => {
                    // PopModal.alert(reject.err_message);
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: reject.err_message
                    });
                });
        }
    }

    onConsult() {
        // PopModal.progress();
        this.gaEvent();
        //
        // const modal_name = "personal_consult";
        //
        // PopModal.createModal(modal_name, <PersonalConsult device_type="mobile" category="VIDEO" access_type={CONSULT_ACCESS_TYPE.VIDEO_INFO.CODE} />, { className: modal_name });
        // PopModal.show(modal_name);

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.VIDEO_INFO.CODE} device_type="mobile" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.VIDEO_INFO.CODE} device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: CONSULT_ACCESS_TYPE.VIDEO_INFO.CODE,
                        device_type: "mobile",
                        page_type: "biz"
                    }, data);

                    // 상담요청 api
                    api.orders.insertAdviceOrders(params)
                        .then(response => {
                            // utils.ad.fbqEvent("InitiateCheckout");
                            utils.ad.wcsEvent("4");
                            utils.ad.gtag_report_conversion(location.href);
                            utils.ad.gaEvent("기업고객", "상담전환");
                            utils.ad.gaEventOrigin("기업고객", "상담전환");
                            PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => PopModal.close(modal_name) });
                        })
                        .catch(error => {
                            if (error && error.date) {
                                PopModal.alert(error.data);
                            }
                        });
                }}
                onClose={() => PopModal.close(modal_name)}
            />,
            { modal_close: false }
        );

        PopModal.show(modal_name);
    }

    gaEvent() {
        const eCategory = "영상 소개페이지";
        const eAction = "무료견적요청";
        const eLabel = "";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    requestVimeoXML(method = "GET", url) {
        return new Promise((resolve, reject) => {
            // axios.get(url).then(response => {
            //     if (response.status === 200) {
            //         const data = response.data;
            //         const parser = new DOMParser();
            //         const test = parser.parseFromString(data, "text/xml");
            //         console.log(test);
            //         PopModal.alert("성공 - 1");
            //     } else {
            //         PopModal.alert("실패");
            //     }
            // }).catch(error => {
            //     PopModal.alert("통신 실패 - 1", error, error.data, error);
            // });
            const xhttp = new XMLHttpRequest();
            xhttp.open(method, url, true);
            xhttp.onload = function () {
            // xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 307)) {
                    const xmlDoc = this.responseXML;
                    const xmlSetData = {
                        id: xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue,
                        // title: xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue,
                        thumb_nail: xmlDoc.getElementsByTagName("thumbnail_large")[0].childNodes[0].nodeValue
                    };
                    resolve(xmlSetData);
                } else if (this.readyState === 4 && this.status !== 200) {
                    reject({ err_message: "영상이 존재하지 않습니다." });
                }
            };
            xhttp.send();
        });
    }

    render() {
        const { videoList, videoListTag, list } = this.state;

        if (!list[VIDEO_LIST_CODE.AD].isSetData &&
            !list[VIDEO_LIST_CODE.EVENT].isSetData &&
            !list[VIDEO_LIST_CODE.ETC].isSetData) {
            return null;
        }

        return (
            <div className="information__video__page">
                <div className="information__video__header">
                    <div className="information__video__header__bg">
                        <Img image={{ src: "/video/vid_top_img.jpg", type: "image", width: 1.4, height: 1 }} isContentResize />
                    </div>
                    <div className="information__video__header__content">
                        <div className="title">영상촬영</div>
                        <div className="description">
                            직접 제작 및 시행을 하기 때문에 내역에 맞는 합당한 견적서를 드립니다.<br />
                            목적에 맞는 영상제작에 대한 이해도가 높고, 필요 이상의 고퀄리티 작업으로 인한 비용상승을 지양합니다.
                        </div>
                        <button className="information__video__button" onClick={this.onConsult} style={{ margin: 0 }}>무료견적요청하기</button>
                        {/*<a className="information__video__button" onClick={this.gaEvent} href="/users/quotation/video" style={{ margin: 0 }}>무료견적요청하기</a>*/}
                        {/*<div className="description">들은 것의 20%, 본 것의 30%, 보고 들은 것의 70%를 기억!</div>*/}
                    </div>
                </div>
                <div className="information__video">
                    <div className="information__video__portfolio">
                        <h1 className="information__video__portfolio__title">영상 포트폴리오</h1>
                        <p className="information__video__portfolio__description">
                            다양한 분야의 촬영영상을 확인해보세요.
                        </p>
                        <div className="information__video__portfolio__list" style={{ width: "100%" }}>
                            {Array.isArray(videoListTag) ? videoListTag.map((obj, idx) => {
                                if (list[obj.list_code].list && list[obj.list_code].list.length > 0) {
                                    const _list = list[obj.list_code].list;
                                    return (
                                        <div className="video-list" key={`video-list__${idx}`}>
                                            <VideoList list={_list} data={obj} />
                                        </div>
                                    );
                                }
                                return null;
                                // let _list;
                                // if (Array.isArray(list[obj.list_code].list) && list[obj.list_code].list.length > 0) {
                                //     _list = list[obj.list_code].list;
                                // }
                                // const _list = list[obj.list_code].list;
                                // return (
                                //     <div className="container video-list" key={`video-list__${idx}`}>
                                //         <VideoList list={_list} data={obj} />
                                //     </div>
                                // );
                            }) : null}
                            {/*{Array.isArray(videoListTag) ? videoListTag.map((obj, idx) => {*/}
                            {/*const list = videoList[obj.list_code] || [];*/}
                            {/*return (*/}
                            {/*<div className="video-list" key={`video-list__${idx}`}>*/}
                            {/*<VideoList list={list} data={obj} />*/}
                            {/*</div>*/}
                            {/*);*/}
                            {/*}) : null}*/}
                        </div>
                    </div>
                </div>
                <div className="information__video__panel">
                    <div className="information__video__panel__one">
                        <div className="information__video__panel__number">01</div>
                        <div className="information__video__panel__title">체계화된 자체 시스템을<br />보유하고 있습니다.</div>
                        <div className="information__video__panel__description">사용하려는 채널의 성격과 마케팅을 모르고 제작하는 영상은 사용성이 모호하고 진정한 바이럴이 일어나지 않습니다.</div>
                    </div>
                    <div className="information__video__panel__two">
                        <div className="information__video__panel__image">
                            <Img image={{ src: "/video/vid_img_01.png", type: "image" }} isContentResize isImageResize />
                        </div>
                    </div>
                </div>
                <div className="information__video__panel">
                    <div className="information__video__panel__one">
                        <div className="information__video__panel__number">02</div>
                        <div className="information__video__panel__title">연락이 안되거나 피드백이 늦는 회사 체계는 그만!</div>
                        <div className="information__video__panel__description">프로젝트별 전담 TF팀을 구성합니다. 메인 촬영 및 편집 PD가 팀장이 되어 모든 내역을 총괄하여 요청 사항에 대해 빠르게 적용이 가능 합니다.</div>
                    </div>
                    <div className="information__video__panel__two">
                        <div className="information__video__panel__image">
                            <Img image={{ src: "/video/vid_img_02.png", type: "image" }} isContentResize isImageResize />
                        </div>
                    </div>
                </div>
                <div className="information__video__panel">
                    <div className="information__video__panel__one">
                        <div className="information__video__panel__number">03</div>
                        <div className="information__video__panel__title">다양한 범위의 제작 이력</div>
                        <div className="information__video__panel__description">국내외 대기업, 유니콘 스타트업, 국가기관의 제작물 연간 시행, 포트폴리오 다량 보유!<br />연출촬영, 모션그래픽, 3D 렌더링, 드론촬영, 360도영상제작기술 자체 보유</div>
                    </div>
                    <div className="information__video__panel__two">
                        <div className="information__video__panel__image">
                            <Img image={{ src: "/video/vid_img_03.png", type: "image" }} isContentResize isImageResize />
                        </div>
                    </div>
                </div>
                <Banner image={{ src: "/video/vid_mid_img.jpg" }}>
                    <div className="information__video">
                        <div className="information__video__process">
                            <h1 className="information__video__process__title">
                                <font color="#78e0ef">포스냅의 영상은</font> 이렇게 진행됩니다!
                            </h1>
                            <div className="information__video__process__flow">
                                <div className="flow__circle">
                                    <div>
                                        시나리오 및<br />스토리보드 제작
                                    </div>
                                </div>
                                <div className="flow__arrow">
                                    →
                                </div>
                                <div className="flow__circle">
                                    <div>
                                        모델 배우 섭외
                                    </div>
                                </div>
                                <div className="flow__arrow">
                                    →
                                </div>
                                <div className="flow__circle">
                                    <div>
                                        촬영 장소 헌팅
                                    </div>
                                </div>
                                <div className="flow__arrow">
                                    →
                                </div>
                                <div className="flow__circle">
                                    <div>
                                        촬영팀<br />구성 및 준비
                                    </div>
                                </div>
                            </div>
                            <div className="information__video__process__flow direction__column">
                                <div className="flow__row">
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__round">촬영 진행</div>
                                    </div>
                                </div>
                                <div className="flow__row">
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__rect">편집 진행</div>
                                    </div>
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__rect">BGM 음원 구매 및 제작</div>
                                    </div>
                                </div>
                                <div className="flow__row">
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__rect">후반 D.I 모션그래픽 제작</div>
                                    </div>
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__rect">나레이션 및 사운드 구성</div>
                                    </div>
                                </div>
                                <div className="flow__row">
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__rect">1차 시사 및 피드백 수렵</div>
                                    </div>
                                </div>
                                <div className="flow__row">
                                    <div>
                                        <div className="flow__arrow">↓</div>
                                        <div className="flow__round" style={{ backgroundColor: "#fff", color: "#000" }}>최종 편집 후 완성본 납품</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Banner>
                <Banner>
                    <h1 className="information-heading">포스냅 영상 촬영</h1>
                    <p className="information-description">
                        언제 어디서나 쉽고 빠른 무료 견적을 요청해보세요.
                    </p>
                    <button className="information__video__button" onClick={this.onConsult}>무료견적요청하기</button>
                    {/*<a className="information__video__button" onClick={this.gaEvent} href="/users/quotation/video">무료견적요청하기</a>*/}
                </Banner>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

export default IntroVideoPage;
