import React, { Component, PropTypes } from "react";

import regular from "shared/constant/regular.const";
import constant from "shared/constant";

class PortfolioVideoThumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            backgroundImage: `url(${__SERVER__.img}${constant.PROGRESS.COLOR_CAT})`
        };

        this.setDefault = this.setDefault.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const { url } = this.props.data;
        const key = url.replace(regular.VIDEO_URL_REPLACE, "");
        const isVimeo = url.indexOf("vimeo") !== -1;

        this.setState({
            backgroundImage: !isVimeo ? `url(https://img.youtube.com/vi/${key}/2.jpg)` : null,
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
                                backgroundImage: `url(${data.thumbnail_small})`
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
        const { backgroundImage } = this.state;

        return (
            <div className="portfolio__video__thumb" style={{ backgroundImage }}>
                <div className="video__play__button">
                    <span className="play__button" />
                </div>
            </div>
        );
    }
}

PortfolioVideoThumb.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        no: PropTypes.number,
        display_order: PropTypes.number,
        url: PropTypes.string
    })
};

export default PortfolioVideoThumb;
