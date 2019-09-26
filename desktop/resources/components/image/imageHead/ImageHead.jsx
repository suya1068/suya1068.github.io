import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import "./imageHead.scss";

const classSide = {
    left: "pull-left",
    center: "",
    right: "pull-right"
};

const classSize = {
    small: "short-height"
};

class ImageHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: this.props.imgUrl,
            sideOf: classSide[this.props.sideOf],
            size: classSize[this.props.size]
        };
    }

    getClassNames() {
        return classNames("imageHead__info", this.state.sideOf);
    }

    render() {
        const bgStyle = {
            background: `url(${this.state.imgUrl}) center center / cover no-repeat`
        };
        const exFlag = this.state.size;
        const content = [];
        if (exFlag !== undefined) {
            content.push(
                <div key="imageHead" className={classNames(this.state.size)} style={bgStyle}>
                    <div className="short-height__bg-reg">
                        <div className="container">
                            <div className="short-height__info-reg">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            content.push(
                <div key="imageHead2" className="imageHead" style={bgStyle}>
                    <div className="imageHead__bg">
                        <div className="container">
                            <div className={this.getClassNames()}>
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key="contentImageHeader">
                {content}
            </div>
        );
    }
}

ImageHead.defaultProps = {
    children: "",
    sideOf: "center"
};

ImageHead.propTypes = {
    children: PropTypes.node,
    imgUrl: PropTypes.string.isRequired,
    sideOf: PropTypes.oneOf(Object.keys(classSide)),
    size: PropTypes.string
};

export default ImageHead;
