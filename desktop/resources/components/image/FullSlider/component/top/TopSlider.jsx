import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Img from "shared/components/image/Img";
// import Img from "desktop/resources/components/image/Img";
// import ImageCheck from "desktop/resources/components/image/ImageCheck";
// import update from "immutability-helper";
// component
// import ImageController from "desktop/resources/components/image/image_controller";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            activeIndex: props.activeIndex,
            photoType: props.photoType,
            checkList: props.checkList,
            topScrollLeft: 0
            //////////////
            //isProcess: false,
            //onLoadCount: 1
        };

        this.onWheelSliderTop = this.onWheelSliderTop.bind(this);
        this.onClickTopImage = this.onClickTopImage.bind(this);
        //this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount() {
        // ImageController.setMaxThread(1);
    }

    componentDidMount() {
        this.setActiveIndex(this.props.activeIndex);
    }

    componentWillReceiveProps(nextProps) {
        //const images = this.state.images;
        // this.setActiveIndex(nextProps.activeIndex);
        // if (JSON.stringify(images.length) !== JSON.stringify(nextProps.images.length)) {
        //     const length = images.length;
        //     const test = nextProps.images.slice(length);
        //     if (this.state.isProcess) {
        //         this.setState({
        //             isProcess: false,
        //             images: update(this.state.images, { $push: test })
        //         });
        //     }
        // }

        // activeIndex가 다르면 setActiveIndex 메서드 수행
        if (nextProps.activeIndex !== this.props.activeIndex) {
            this.setActiveIndex(nextProps.activeIndex);
        }
    }


    componentWillUnmount() {
    }

    /**
     * top slider 스크롤 이벤트
     * @param e
     */
    onWheelSliderTop(e) {
        const targetScroll = document.getElementsByClassName("top-slider-images")[0];
        const scrollWidth = targetScroll.scrollWidth;
        const clientWidth = targetScroll.clientWidth;
        let topScrollLeft = this.state.topScrollLeft;

        if (e.deltaY > 0 && clientWidth + topScrollLeft < scrollWidth) {
            topScrollLeft += 100;
        } else if (e.deltaY < 0 && topScrollLeft > 0) {
            topScrollLeft -= 100;
        }
        targetScroll.scrollLeft = topScrollLeft;
        this.setState({
            topScrollLeft
        });
    }

    /**
     * TopSlider 이미지 클릭 이벤트 발생
     * @param e
     */
    onClickTopImage(e) {
        const target = e.currentTarget;
        const targetIndex = parseInt(target.id.substr(10), 10);

        if (typeof this.props.onChangeIndex === "function") {
            this.props.onChangeIndex(targetIndex);
        }

        this.setActiveIndex(targetIndex);
    }

    onScroll(e) {
        const target = e.currentTarget;
        const scrollLeft = target.scrollLeft;
        const scrollWidth = target.scrollWidth;
        const clientWidth = target.clientWidth;

        // if (scrollLeft + clientWidth === scrollWidth) {
        //     this.setState({
        //         isProcess: true
        //     }, () => {
        //         if (typeof this.props.onScroll === "function") {
        //             this.props.onScroll(e, true);
        //         }
        //     });
        // }
    }

    /**
     * 클릭한 이미지 활성화
     * @param activeIndex
     */
    setActiveIndex(activeIndex) {
        const targetScroll = document.getElementsByClassName("top-slider-images")[0];
        const thumbs = document.getElementsByClassName("wrap-list")[0];
        const thumb = thumbs.querySelector(":first-child");
        const thumbWidth = thumb.offsetWidth;
        const thumbListWidth = targetScroll.offsetWidth;
        const topScrollLeft = ((thumbWidth + 5) * activeIndex) - ((thumbListWidth / 2) - (thumbWidth / 2));
        targetScroll.scrollLeft = topScrollLeft;

        this.setState({
            topScrollLeft,
            activeIndex
        });
    }

    isActive(idx) {
        return (this.state.activeIndex === idx);
    }

    /**
     * top slider 를 그린다.
     * 이벤트 : wheel
     * @returns {XML}
     */
    drawTopSlider() {
        return (
            <div
                onWheel={this.onWheelSliderTop}
                className="top-slider"
            >
                {this.createTopSlider()}
            </div>
        );
    }

    // test() {
    //     const images = this.state.images;
    //     const imageLength = images.length;
    //     if (this.state.onLoadCount === imageLength) {
    //         if (typeof this.props.lastLoading === "function") {
    //             this.props.lastLoading();
    //         }
    //     } else {
    //         this.state.onLoadCount += 1;
    //     }
    // }

    /**
     * top slider 의 imageList 을 구성한다.
     * 이벤트: mouseUp
     * @returns {XML}
     */
    createTopSlider() {
        const images = this.state.images;
        const photoType = this.props.photoType;
        const checkedList = this.props.checkList;
        return (
            <div className="top-slider-images" onScroll={this.onScroll}>
                <ul className="wrap-list" /*key="wrap_list"*/>
                    {images.map((image, idx) => {
                        let url = image.src;
                        if (photoType === "private" && (image.custom_thumb_key || image.thumb_key)) {
                            let isCustom = false;
                            if (image.custom_thumb_key) {
                                isCustom = true;
                            }
                            url = !isCustom ? `/${image.thumb_key}` : `/${image.custom_thumb_key}`;
                        }
                        const checked = checkedList.findIndex(chk => {
                            return chk.photo_no === image.photo_no;
                        });

                        return (
                            <li
                                className={classNames("images-unit", this.isActive(idx) ? "active" : "")}
                                id={`top-image_${idx}`}
                                onMouseUp={this.onClickTopImage}
                                key={`top-image_${idx}`}
                            >
                                {/*<ImageCheck image={{ src: url, type: photoType }} size="small" checked={checked !== -1} />*/}
                                <Img image={{ src: url, type: photoType, content_width: 90, content_height: 90 }} /*onLoad={() => this.test(idx)}*/ />
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    render() {
        return (
            <section className="photoViewer-top">
                <h2 className="sr-only">TopSlider</h2>
                {this.drawTopSlider()}
            </section>
        );
    }
}

PhotoViewer.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    activeIndex: PropTypes.number
    //onScroll: PropTypes.func
};

PhotoViewer.defaultProps = {
    images: [],
    activeIndex: 0
};

export default PhotoViewer;
