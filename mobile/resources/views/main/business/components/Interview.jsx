import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class Interview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            send: false
        };

        this.YTPlayer = null;

        this.onResize = this.onResize.bind(this);
        this.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
    }

    componentDidMount() {
        this.onResize();
    }

    onResize() {
        const frame = this.refFrame;

        if (frame) {
            const resize = utils.image.resize(16, 9, frame.clientWidth, 1, true);

            this.setState({
                loading: true,
                height: resize.height
            }, () => {
                const { browser, version } = utils.getBrowser();
                if (browser !== "whale") {
                    new Promise((resolve, reject) => {
                        if (!window.YT) {
                            const ytScript = document.createElement("script");
                            ytScript.onload = () => {
                                resolve(true);
                            };
                            ytScript.onerror = () => {
                                reject(false);
                            };
                            ytScript.src = "https://www.youtube.com/iframe_api";
                            document.body.appendChild(ytScript);
                        } else {
                            resolve(true);
                        }
                    }).then(() => {
                        setTimeout(() => {
                            this.onYouTubeIframeAPIReady();
                        }, 1000);
                    });
                }
            });
        }
    }

    onYouTubeIframeAPIReady() {
        if (window.YT && window.YT.Player) {
            this.YTPlayer = new window.YT.Player("interview_video", {
                events: {
                    "onReady": event => this.onPlayerReady(event),
                    "onStateChange": event => this.onPlayerStateChange(event)
                }
            });
        } else {
            setTimeout(this.onYouTubeIframeAPIReady, 100);
        }
    }

    onPlayerReady(event) {
    }

    onPlayerStateChange(event) {
        if (event.data === window.YT.PlayerState.PLAYING) {
            if (!this.state.send) {
                this.state.send = true;
                this.gaEvent();
            }
        }
    }

    gaEvent() {
        utils.ad.gaEvent("M_기업_메인", "후기영상", "재생");
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("인터뷰재생");
        }
    }

    render() {
        const { loading, height } = this.state;

        return (
            <div className="main__interview" ref={ref => (this.refFrame = ref)} style={{ height: `${height}px` }}>
                {loading ?
                    <iframe
                        id="interview_video"
                        src={`https://www.youtube.com/embed/-ISrz1GI-3Y?enablejsapi=1&modestbranding=1&rel=0&origin=${__MOBILE__}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                    />
                    : null
                }
            </div>
        );
    }
}

Interview.propTypes = {
    gaEvent: PropTypes.func
};

export default Interview;
