import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import PortfolioImg from "../PortfolioImg";
import regular from "shared/constant/regular.const";
import constant from "shared/constant";

export default class PortfolioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // src: props.src,
            isMount: true,
            src: "",
            data: props.data,
            is_active: props.is_active,
            index: props.index,
            vertical_type: props.vertical_type,
            xhr: props.xhr,
            axis_type: props.axis_type,
            isVimeo: false,
            key: ""
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.setDefault = this.setDefault.bind(this);
    }

    componentWillMount() {
        const { data, axis_type } = this.props;
        let { src, isVimeo, key } = this.state;
        if (data.type === "image") {
            src = `${__SERVER__.thumb}/normal/crop/${axis_type === "x" ? "640x640" : "0x640"}${data.src}`;
        } else if (data.type === "video") {
            key = data.url.replace(regular.VIDEO_URL_REPLACE, "");
            isVimeo = data.url.indexOf("vimeo") !== -1;

            src = !isVimeo ? `https://img.youtube.com/vi/${key}/hqdefault.jpg` : null;
        }

        this.setState({
            src,
            isVimeo,
            key
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
                                src: data.thumbnail_large
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
                src: `${__SERVER__.img}${constant.DEFAULT_IMAGES.BACKGROUND}`
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

    onMouseEnter(e) {
        this.setState({
            is_hover: true
        });
    }

    onMouseLeave(e) {
        this.setState({
            is_hover: false
        });
    }

    render() {
        const { index, data, is_active, vertical_type, xhr } = this.props;
        const { is_hover, src, key } = this.state;
        return (
            <div
                className={classNames("forsnap-portfolio__unit", { "hover": is_hover }, vertical_type ? "is_ver" : "is_hor")}
                onClick={() => this.props.onShowSlider(index)}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                {is_active && <div id="item_active" className="item_active" />}
                <div className="item_hover">
                    <div className="add-icon" />
                </div>
                {key &&
                <div className="video-icon">
                    <div className="play__button" />
                </div>
                }
                <PortfolioImg isVideo={!!key} src={src} className="portfolio-image" xhr={xhr} />
            </div>
        );
    }
}

PortfolioItem.propTypes = {
    //src: PropTypes.string,
    vertical_type: PropTypes.bool,
    xhr: PropTypes.bool,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool
};
