import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import PortfolioImg from "../PortfolioImg";
import regular from "../../../../../../shared/constant/regular.const";
import constant from "../../../../../../shared/constant";

export default class PortfolioItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullSize: props.fullSize,
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
        this.setStateData = this.setStateData.bind(this);
        this.setDefault = this.setDefault.bind(this);
    }

    componentWillMount() {
        // `${__SERVER__.thumb}/normal/crop/${axis_type === "x" ? "320x320" : "0x320"}${image.src}`
        const { data, axis_type } = this.props;
        let { src, isVimeo, key } = this.state;
        if (data.type === "image") {
            src = `${__SERVER__.thumb}/normal/crop/${axis_type === "x" ? "320x320" : "0x320"}${data.url}`;
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
                        // this.setStateData(() => {
                        //     return {
                        //         src: data.thumbnail_large
                        //     };
                        // });
                        this.setState({
                            src: data.thumbnail_large
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


    render() {
        const { index, is_active, vertical_type, xhr, fullSize } = this.props;
        const { is_hover, src, key } = this.state;
        return (
            <div
                className={classNames("forsnap-portfolio__unit", { "hover": is_hover }, vertical_type ? "is_ver" : "is_hor")}
                onClick={() => this.props.onShowSlider(index)}
            >
                {is_active && <div id="item_active" className="item_active" />}
                {key &&
                <div className="video-icon">
                    <div className="play__button" />
                </div>
                }
                <PortfolioImg src={src} isVideo={!!key} className={classNames("portfolio-image", fullSize ? "full_size" : "")} xhr={xhr} />
            </div>
        );
    }
}

PortfolioItem.propTypes = {
    // src: PropTypes.string,
    vertical_type: PropTypes.bool,
    xhr: PropTypes.bool,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool
};
