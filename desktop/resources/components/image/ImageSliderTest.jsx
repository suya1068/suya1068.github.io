import "./imageSliderTest.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Icon from "../icon/Icon";
// import ImageCheck from "desktop/resources/components/image/ImageCheck";
import update from "immutability-helper";

class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectImageIndex: 0,
            left: 0,
            count: 0,
            checked: [],
            pageIndex: 1,
            maxPageIndex: 1,
            moveWidth: this.props.type === "photo" ? 475 : 786
        };
        this.sliderMove = this.sliderMove.bind(this);
    }

    componentWillMount() {
        let cnt = 0;
        if (this.props.type === "photo") {
            cnt = 5;
        } else {
            cnt = 3;
        }
        const imageCount = this.props.images.length;
        const moveWidth = this.state.moveWidth;
        const maxPageIndex = Math.ceil(imageCount / cnt);
        let left = 0;
        if (maxPageIndex > 0) {
            left = -(maxPageIndex - 1) * moveWidth;
        }
        this.setState({
            // currenIndex: cnt,
            count: cnt,
            left,
            pageIndex: imageCount > 1 ? maxPageIndex : 1,
            maxPageIndex
        });
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const length = nextProps.images.length;
        this.setState({
            selectImageIndex: update(this.state.selectImageIndex, { $set: length })
        }, () => {
            if (this.props.type === "photo") {
                this.autoSlide();
            }
        });
    }

    /**
     * 타입별 한계 갯수만큼 클릭시 자동으로 좌 우로 이동
     */
    autoSlide() {
        const selectImageIndex = this.state.selectImageIndex;
        let left = this.state.left;
        const type = this.props.type;
        const count = this.state.count;
        const testClassvaildation = document.querySelector(`.${type}Slider`).getElementsByClassName("image-list-test");

        let pageIndex = this.state.pageIndex;
        const maxPageIndex = Math.ceil(selectImageIndex / count);

        let typeWidth = 0;
        if (type === "photo") {
            typeWidth = 475;
        }

        if (selectImageIndex > 2) {
            if (pageIndex < maxPageIndex && selectImageIndex % count === 1) {
                pageIndex += 1;
                left -= typeWidth;
            } else if (pageIndex > 1 && maxPageIndex - pageIndex === -1 && selectImageIndex % count === 0) {
                pageIndex -= 1;
                left += typeWidth;
            }
        }

        testClassvaildation[0].style.left = `${left}px`;
        this.setState({
            pageIndex,
            left
        });
    }

    /**
     * < > 클릭 시 해당 길이만큼 좌우로 이동
     * @param e
     */
    sliderMove(e) {
        const selectImageIndex = this.state.selectImageIndex;
        const count = this.state.count;
        const target = e.target;
        const className = target.className;
        let left = this.state.left;
        const type = this.props.type;
        const typeWidth = this.state.moveWidth;
        const testClassvaildation = document.querySelector(`.${type}Slider`).getElementsByClassName("image-list-test");

        let pageIndex = this.state.pageIndex;
        const maxPageIndex = Math.ceil(selectImageIndex / count);

        // if (className === "icon-arrow_l") {
        if (className === "icon-lt") {
            if (pageIndex > 1) {
                pageIndex -= 1;
                left += typeWidth;
            }
        // } else if (className === "icon-arrow_r") {
        } else if (className === "icon-gt") {
            if (pageIndex < maxPageIndex && pageIndex !== maxPageIndex) {
                pageIndex += 1;
                left -= typeWidth;
            }
        }
        this.setState({
            pageIndex,
            left
        });
    }

    render() {
        const { images, type } = this.props;
        const { pageIndex, left } = this.state;
        const maxPageIndex = Math.ceil(images.length / this.state.count);
        let canvasWidth = 0;

        if (type === "photo" && pageIndex > 1) {
            canvasWidth = images.length * 95;
        } else if (type === "comment") {
            canvasWidth = images.length * 265;
        }
        return (
            <div className={classNames("image-slider-box-test", `${type}Slider`)} onMouseDown={this.sliderMove}>
                <div className="image-slider-test">
                    <div className="image-list-test" style={{ width: `${canvasWidth}px`, left: `${left}px` }}>
                        {this.props.children}
                    </div>
                </div>
                <div className="image-slider-arrow-test">
                    <Icon name="lt" hide={pageIndex === 1 ? "hide" : ""} />
                    <Icon name="gt" hide={(pageIndex === maxPageIndex) || (maxPageIndex === 1) ? "hide" : ""} />
                </div>
            </div>
        );
    }
}

ImageSlider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({ src: PropTypes.string, type: PropTypes.string })),
    type: PropTypes.string,
    children: PropTypes.node
};

ImageSlider.defaultProps = {
    images: []
};

export default ImageSlider;
