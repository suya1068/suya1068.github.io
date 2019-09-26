import "./interview.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";

export default class Interview extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.createYTPlayer().then(r => {
            this.player = new r.Player("player", {
                width: "100%",
                height: "580",
                videoId: "-ISrz1GI-3Y",
                playerVars: {
                    enablejsapi: 1,
                    // origin: location.origin,
                    // autoplay: 1,
                    // loop: 1,
                    playlist: "-ISrz1GI-3Y"
                },
                events: {
                    "onStateChange": this.onPlayerStateChange
                }
            });
        });
    }

    /**
     * 플레이어 상태 이벤트
     * data = 1 - 재생
     * data = 2 - 멈춤
     * data = 0 - 종료
     * @param e
     */
    onPlayerStateChange(e) {
        if (e.data && e.data === 1) {
            // 동영상 재생 버튼 클릭
            this.gaEvent();
        }
    }

    gaEvent() {
        utils.ad.gaEvent("기업_메인", "인터뷰재생", "클릭");
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("인터뷰재생");
        }
    }

    // onPlayerReady(e) {
    //     e.target.playVideo();
    // }

    stdOnEnd(script) {
        script.onload = function () {
            this.onerror = this.onload = null;
        };

        script.onerror = function () {
            this.onerror = this.onload = null;
        };
    }

    ieOnEnd(script) {
        script.onreadystatechange = function () {
            if (this.readyState !== "complete" && this.readyState !== "loaded") return;
            this.onreadystatechange = null;
        };
    }

    createYTPlayer() {
        return new Promise((resolve, reject) => {
            if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
                resolve(window.YT);
            } else {
                const protocol = window.location.protocol === "http" ? "http" : "https";
                const tag = document.createElement("script");
                tag.type = "text/javascript";
                tag.charset = "utf8";
                tag.src = "https://www.youtube.com/iframe_api";
                // tag.src = `${protocol}://www.youtube.com/iframe_api`;

                const onend = "onload" in tag ? this.stdOnEnd : this.ieOnEnd;

                onend(tag);

                if (!tag.onload) {
                    this.stdOnEnd(tag);
                }

                const firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            const previous = window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady = () => {
                if (previous) {
                    previous();
                } else {
                    resolve(window.YT);
                }
            };
        });
    }

    render() {
        return (
            <section className="biz-interview biz-panel__dist">
                <h3 className="biz-panel__title">포스냅이 궁금하세요?</h3>
                <p className="biz-panel__descr">포스냅 고객님의 촬영 후기를 들어보세요.</p>
                <div className="biz-interview__box">
                    <div className="biz-interview__box-player">
                        <div id="player" />
                    </div>
                    <div className="biz-interview__box-customer">
                        <div className="biz-interview__box-customer__who">
                            <div className="who">
                                <p className="who_name">변준혁님</p>
                                <p className="who_co">리우어패럴 대표</p>
                            </div>
                        </div>
                        <div className="customer-prev">
                            어떻게 진행되었는지 자세한 상담과, 저렴한 비용으로 촬영을 진행하게 되었습니다. <br />
                            벌써 두번째 촬영과정이고 앞으로도 포스냅에서 촬영할 계획입니다.
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
