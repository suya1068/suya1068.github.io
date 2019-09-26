import React, { Component, PropTypes } from "react";

import regular from "shared/constant/regular.const";
import constant from "shared/constant";
import axios from "axios";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

class PortfolioVideoThumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            runTime: null,
            backgroundImage: `url(${__SERVER__.img}${constant.PROGRESS.COLOR_CAT})`
        };

        this.setDefault = this.setDefault.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const { url } = this.props;
        const key = url.replace(regular.VIDEO_URL_REPLACE, "");
        const isVimeo = url.indexOf("vimeo") !== -1;

        if (!isVimeo) {
            axios.get(`/products/youtube_parser/${key}`)
                .then(res => {
                    const duration = res.data && res.data.videoDetails && res.data.videoDetails.lengthSeconds;
                    this.setStateData(() => {
                        return {
                            runTime: duration || ""
                        };
                    });
                })
                .catch(err => {
                    PopModal.alert("정보 조회중 오류가 발생했습니다.\n문제가 지속될 시 고객센터에 문의해주세요.");
                });
        }

        this.setState({
            backgroundImage: !isVimeo ? `url(https://img.youtube.com/vi/${key}/0.jpg)` : null,
            key,
            isVimeo
        });
    }

    componentDidMount() {
        const { key, isVimeo } = this.state;
        if (isVimeo) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://vimeo.com/api/v2/video/${key}.json`);
            xhr.onloadend = e => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.response);
                    if (response[0]) {
                        const data = response[0];
                        this.setStateData(() => {
                            return {
                                runTime: data.duration,
                                backgroundImage: `url(${data.thumbnail_medium})`
                            };
                        });
                    } else {
                        this.setDefault();
                    }
                } else {
                    this.setDefault();
                }
            };
            xhr.send();
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }


    setDefault() {
        this.setStateData(() => {
            return {
                backgroundImage: `url(${__SERVER__.img}${constant.DEFAULT_IMAGES.BACKGROUND})`
            };
        });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { backgroundImage, runTime } = this.state;

        // if (!runTime) {
        //     return null;
        // }

        return (
            <div className="portfolio__video__thumb" style={{ backgroundImage }}>
                <div className="video_run-time">
                    <p>{runTime ? utils.format.exchangeTime(runTime) : "0:00"}</p>
                </div>
            </div>
        );
    }
}

PortfolioVideoThumb.propTypes = {
    url: PropTypes.string
};

export default PortfolioVideoThumb;
