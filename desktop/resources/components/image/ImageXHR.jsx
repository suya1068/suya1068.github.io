import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "shared/helper/utils";

import Profile from "./Profile";
import Img from "desktop/resources/components/image/Img";
import "./image.scss";

const imageType = {
    artist: "image-type-artist",
    text: "image-type-text",
    image: "image-type-image",
    composite: "image-type-composite"
};

const radiusType = {
    all: "radius-all",
    left: "radius-left",
    right: "radius-right",
    top: "radius-top",
    bottom: "radius-bottom"
};

/**
 * @param type - 컴포넌트 구성 타입 (키값 참조)
 * @param radius - 보더 라운드 (키값 참조)
 * @param bg - 이미지 배경
 * @param profile - 작가상품 및 포트폴리오 일때 작가 이미지
 * @param title - 타이틀
 * @param cpation - 설명
 * @param resultFunc - 클릭시 함수 또는 이동할 링크
 */
class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boxType: props.type,
            profileUrl: props.profile,
            boxArtists: props.artist,
            boxTitle: props.title,
            boxCaption: props.caption,
            boxRadius: props.radius,
            resultFunc: props.resultFunc
        };
    }

    componentWillMount() {
    }

    getImageHost() {
        const type = this.state.image.type;
        let host = __SERVER__.data;

        if (type === "base64") {
            host = "data:image/*;base64,";
        } else if (type === "image") {
            host = __SERVER__.img;
        }

        return host;
    }

    boxType() {
        if (this.state.boxType === "artist") {
            return (
                <div className="box-content">
                    <div className="box-content-artist">
                        <Profile image={this.state.profileUrl} size="large" />
                        <h3 className="h6">{utils.linebreak(this.state.boxTitle)}</h3>
                        <p className="h6-caption">{utils.linebreak(this.state.boxCaption)}</p>
                    </div>
                </div>
            );
        } else if (["text", "composite"].indexOf(this.state.boxType) !== -1) {
            return (
                <div className="box-content">
                    <div className="box-content-text">
                        <h3 className="cap-bar">
                            {
                                this.state.boxArtists &&
                                <p className="caption">{utils.linebreak(this.state.boxArtists)}</p>
                            }
                            <p className="h5">{utils.linebreak(this.state.boxTitle)}</p>
                        </h3>
                        <p className="h5-caption">{utils.linebreak(this.state.boxCaption)}</p>
                    </div>
                </div>
            );
        }

        return "";
    }

    render() {
        let children = [];
        const image = this.props.image;
        const bg = <div className="box-bg" />;
        const content = this.boxType();
        let img = [];

        if (image !== undefined) {
            img = (
                <div className="box-image">
                    <Img image={image} />
                </div>
            );
        }

        const props = { className: classNames("image-box", imageType[this.state.boxType], radiusType[this.state.boxRadius]) };

        if (["function", "undefined"].indexOf(typeof this.state.resultFunc) !== -1) {
            props.onClick = this.state.resultFunc;
        }

        children = [bg, content, img];

        return React.createElement("div", props, ...children);
    }
}

Image.propTypes = {
    type: PropTypes.oneOf(Object.keys(imageType)),
    image: PropTypes.shape([PropTypes.node]),
    profile: PropTypes.shape([PropTypes.node]),
    artist: PropTypes.string,
    title: PropTypes.string,
    caption: PropTypes.string,
    radius: PropTypes.oneOf(Object.keys(radiusType)),
    resultFunc: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

Image.defaultProps = {
    type: "composite",
    artist: "",
    title: "",
    caption: "",
    radius: "all",
    resultFunc: undefined
};

export default Image;
