import "./BrandGuide.scss";
import React, { Component, PropTypes } from "react";

import { Header, Banner, Panel, Footer } from "../../components";
import { strongPoint } from "../../information.const";


const imgPath = __SERVER__.img;

const BrandGuide = props => {
    document.title = "브랜드 가이드";

    return (
        <section className="brand-guide">
            <Header image={{ src: "/brandguide/bra_top_img.jpg" }}>
                <h1 className="information-heading">브랜드 가이드</h1>
                <p className="information-description">포스냅의 디자인 이야기</p>
            </Header>
            <Banner>
                <h2 className="information-heading">포스냅 디자인은?</h2>
                <p className="information-description">
                    사용자에게 어떤 가치를 제공해야 하는지,<br />
                    사용자에게 어떤 매력 요소를 제공해야하는지 고민합니다.<br />
                    사용자의 편의성에 중점을 둔 심플한 디자인을 지양합니다.
                </p>
            </Banner>
            <section className="information-panel">
                <div className="information-inner">
                    <div className="container information-contents">
                        <h2 className="information-heading">색상</h2>
                        <div className="information-description">
                            <div className="brand-item">
                                <div className="brand-box brand-box--yellow">
                                    <span>Main Color</span>
                                </div>
                                <div className="brand-item-contents">
                                    <h3 className="brand-item-title">YELLOW</h3>
                                    <div className="brand-item-description">
                                        <p>RGB 255/186/0</p>
                                        <p>CMYK 0/30/100/0</p>
                                        <p>HEX #ffba00</p>
                                    </div>
                                </div>
                            </div>
                            <div className="brand-item">
                                <div className="brand-box brand-box--dark-gray">
                                    <span>Main Mono Color</span>
                                </div>
                                <div className="brand-item-contents">
                                    <h3 className="brand-item-title">DARK GRAY</h3>
                                    <div className="brand-item-description">
                                        <p>RGB 73/79/89</p>
                                        <p>CMYK 71/61/49/31</p>
                                        <p>HEX #494f59</p>
                                    </div>
                                </div>
                            </div>
                            <div className="brand-item">
                                <div className="brand-box brand-box--black">
                                    <span>Main Text Color</span>
                                </div>
                                <div className="brand-item-contents">
                                    <h3 className="brand-item-title">BLACK</h3>
                                    <div className="brand-item-description">
                                        <p>RGB 0/0/0</p>
                                        <p>CMYK 75/68/67/90</p>
                                        <p>HEX #000000</p>
                                    </div>
                                </div>
                            </div>
                            <div className="brand-item">
                                <div className="brand-box brand-box--gray">
                                    <span>Sub Text Color</span>
                                </div>
                                <div className="brand-item-contents">
                                    <h3 className="brand-item-title">GRAY</h3>
                                    <div className="brand-item-description">
                                        <p>RGB 150/150/150</p>
                                        <p>CMYK 44/36/36/3</p>
                                        <p>HEX #969696</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="information-panel">
                <div className="information-inner">
                    <div className="container information-contents">
                        <h2 className="information-heading">로고타입</h2>
                        <div className="information-description">
                            <div className="brand-row brand-logo">
                                <img src={`${imgPath}/brandguide/bra_img_01.png`} alt="whiteBar" />
                                <img src={`${imgPath}/brandguide/bra_img_02.png`} alt="blackBar" />
                            </div>
                            <div className="brand-row">
                                <img src={`${imgPath}/brandguide/bra_img_05.png`} alt="fIcon" />
                                <img src={`${imgPath}/brandguide/bra_img_06.png`} alt="blackIcon" />
                                <img src={`${imgPath}/brandguide/bra_img_07.png`} alt="YellowIcon" />
                            </div>
                            <div className="brand-row brand-log-box">
                                <div className="brand-item">
                                    <div className="brand-box brand-box-border">
                                        <img src="https://image.forsnap.com/brandguide/bra_img_03.png" alt="blackRect" />
                                    </div>
                                    <div className="brand-item-contents">
                                        <h3 className="brand-item-title">GRAY</h3>
                                        <div className="brand-item-description">
                                            <p>RGB 150/150/150</p>
                                            <p>CMYK 44/36/36/3</p>
                                            <p>HEX #969696</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="brand-item">
                                    <div className="brand-box brand-box--yellow">
                                        <img src="https://image.forsnap.com/brandguide/bra_img_04.png" alt="whiteRect" />
                                    </div>
                                    <div className="brand-item-contents">
                                        <h3 className="brand-item-title">GRAY</h3>
                                        <div className="brand-item-description">
                                            <p>RGB 150/150/150</p>
                                            <p>CMYK 44/36/36/3</p>
                                            <p>HEX #969696</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer>
                <h1 className="information-heading">작가로 활동하는 방법이 궁금하신가요?</h1>
                <div className="information-description">
                    <a href={strongPoint.url}>작가로 활동하기 페이지 가기</a>
                </div>
            </Footer>
        </section>
    );
};

export default BrandGuide;
