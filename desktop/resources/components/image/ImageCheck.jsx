import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Checkbox from "../form/Checkbox";
import Img from "shared/components/image/Img";
import ImgDesk from "desktop/resources/components/image/Img";

class ImageCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type
        };

        this.onMouseDown = this.onMouseDown.bind(this);
    }

    componentWillMount() {
    }

    onMouseDown(e) {
        if (typeof this.props.resultFunc === "function") {
            this.props.resultFunc(!this.props.checked);
        }
    }

    render() {
        return (
            <div className={classNames("image-box check-image radius-all", this.props.checked ? "checked" : "")} onClick={this.onMouseDown}>
                <div className="box-bg" />
                <Checkbox type="yellow_small" checked={this.props.checked} disabled productNo={this.props.pno} />
                <div className="box-image">
                    {this.props.type === "desk" ?
                        <ImgDesk image={this.props.image} isCrop /> :
                        <Img image={this.props.image} isCrop />
                    }
                </div>
            </div>
        );
    }
}

ImageCheck.propTypes = {
    image: PropTypes.shape([PropTypes.node]),
    resultFunc: PropTypes.func,
    pno: PropTypes.string,
    checked: PropTypes.oneOf([true, false])
};

ImageCheck.defaultProps = {
    resultFunc: undefined
};

export default ImageCheck;
