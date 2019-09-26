import "./image.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Img from "shared/components/image/Img";

// small 45px
// medium 52px
// default 75px
// large 110px
const classSize = {
    default: "",
    small: "img-small",
    medium: "img-medium",
    large: "img-large",
    block: "img-block"
};

const imagePath = __SERVER__.img;
const dataPath = __SERVER__.data;

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileSize: props.size
        };
    }

    componentWillMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.image.src !== this.props.image.src) {
            return true;
        }

        return false;
    }

    render() {
        const image = this.props.image;

        if (!(image.default) || image.default === "null") {
            image.default = "/common/default_profile_img.jpg";
        }

        return (
            <div className={classNames("profile-img", classSize[this.state.profileSize])}>
                <Img image={{ ...image, content_width: 110, content_height: 110 }} isCrop />
            </div>
        );
    }
}

/**
 image - src: PropTypes.string,
     type: PropTypes.oneOf(["image", "data", "base64"]),
     width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
     height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
 */
Profile.propTypes = {
    image: PropTypes.shape([PropTypes.node]),
    size: PropTypes.oneOf(Object.keys(classSize))
};

Profile.defaultProps = {
    size: "default"
};

export default Profile;
