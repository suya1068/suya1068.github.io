import React, { Component, PropTypes } from "react";

import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";

export const contentPosition = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    MIDDLE: "middle",
    BOTTOM: "bottom",
    TOP_LEFT: "top_left",
    TOP_RIGHT: "top_right",
    BOTTOM_LEFT: "bottom_left",
    BOTTOM_RIGHT: "bottom_right"
};

class ImageSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            renderSlider: [],
            renderArrow: [],
            renderNav: [],
            // renderThumb: [],
            isProcess: false
            // scrollWidth: 25
        };

        this.initData(this.state.data);

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.clearTimer = this.clearTimer.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.moveIndex = this.moveIndex.bind(this);

        this.calculNavPosition = this.calculNavPosition.bind(this);
        this.calculArrowPosition = this.calculArrowPosition.bind(this);
        // this.calculThumbPosition = this.calculThumbPosition.bind(this);
    }

    componentWillMount() {
        this.calculLayoutSlider();
        this.calculLayoutArrow();
    }

    componentDidMount() {
        const index = this.state.data.index;

        this.startTimer(this.state.data.interval);

        if (index === this.slider.children.length - 1) {
            this.sliderbox.classList.add("last");
        }
        if (index === 0) {
            this.sliderbox.classList.add("first");
        }

        this.slider.children[index].classList.add("active");
        if (this.state.data.nav) {
            this.nav.children[index].classList.add("active");
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    /**
     * 슬라이더에 마우스가 들어왔을때 타이머 정지
     */
    onMouseEnter() {
        this.clearTimer();
    }

    /**
     * 슬라이더에서 마우스가 나갔을때 타이머 재시작
     */
    onMouseLeave() {
        this.startTimer(this.state.data.interval);
    }

    /**
     * 데이터 초기화
     */
    initData(data) {
        // 데이터값 초기화
        if (!data) {
            data = {};
        }

        // 썸네일 서버 크롭 여부
        if (data.crop === undefined) {
            data.crop = true;
        }

        // 이미지 컴포넌트 크롭
        if (data.imageCrop === undefined) {
            data.imageCrop = true;
        }

        // 이미지 컴포넌트 리사이즈
        if (data.imageResize === undefined) {
            data.imageResize = false;
        }

        // 이미지 컴포넌트 크기 리사이즈
        if (data.contentResize === undefined) {
            data.contentResize = false;
        }

        // 시작 인덱스값 초기화
        if (!data.index) {
            data.index = 0;
        }

        // 자동넘김 초기화
        if (!data.interval) {
            data.interval = 0;
        }

        // 슬라이더 배경색 초기화
        if (!data.bgcolor) {
            data.bgcolor = "#000";
        }

        // 화살표 초기화
        if (data.arrow) {
            if (!data.arrow.icon_left || data.arrow.icon_left === "") {
                data.arrow.icon_left = "lt_shadow";
            }
            if (!data.arrow.icon_right || data.arrow.icon_right === "") {
                data.arrow.icon_right = "gt_shadow";
            }
            if (!data.arrow.position || data.arrow.position === "") {
                data.arrow.position = "middle";
            }
            if (!data.arrow.posX || data.arrow.posX === "") {
                data.arrow.posX = 0;
            }
            if (!data.arrow.posY || data.arrow.posY === "") {
                data.arrow.posY = 0;
            }
        }

        // 네비게이션 초기화
        if (data.nav) {
            if (!data.nav.position || data.nav.position === "") {
                data.nav.position = "bottom";
            }
            if (!data.nav.inout || data.nav.inout === "") {
                data.nav.inout = "in";
            }
            if (!data.nav.posX || data.nav.posX === "") {
                data.nav.posX = 0;
            }
            if (!data.nav.posY || data.nav.posY === "") {
                data.nav.posY = 0;
            }
        }

        // 썸네일 초기화
        // if (data.thumb) {
        //     if (!data.thumb.position || data.thumb.position === "") {
        //         data.thumb.position = "right";
        //     }
        //     if (!data.thumb.inout || data.thumb.inout === "") {
        //         data.thumb.inout = "in";
        //     }
        //     if (!data.thumb.width || data.thumb.width === "") {
        //         data.thumb.width = 100;
        //     }
        //     if (!data.thumb.height || data.thumb.height === "") {
        //         data.thumb.height = 100;
        //     }
        //     if (!data.thumb.posX || data.thumb.posX === "") {
        //         data.thumb.posX = 10;
        //     }
        //     if (!data.thumb.posY || data.thumb.posY === "") {
        //         data.thumb.posY = 10;
        //     }
        // }
    }

    /**
     * 타이머 제거
     */
    clearTimer() {
        clearInterval(this.state.intervalId);
        this.state.intervalId = "";
    }

    /**
     * 타이머 시작
     */
    startTimer(interval = 0) {
        if (interval > 0) {
            if (interval < 500) {
                interval = 500;
            }

            if (this.state.intervalId !== "") {
                this.clearTimer();
            }

            this.state.intervalId = setInterval(() => this.moveIndex(this.state.data.index + 1), interval);
        }
    }

    /**
     * 슬라이더 이동
     */
    moveIndex(index) {
        const data = this.state.data;
        const children = this.slider.children;

        if (!this.state.isProcess) {
            this.state.isProcess = true;

            if (children && children.length > 0) {
                const length = children.length;

                let status = true;

                if (index < data.index) {
                    status = false;
                }

                // 인덱스 증감
                if (index > length - 1) {
                    index = 0;
                } else if (index <= -1) {
                    index = length - 1;
                }

                // 화살표 처음, 끝 체크
                this.sliderbox.classList.remove("last", "first");
                if (index === length - 1) {
                    this.sliderbox.classList.add("last");
                }
                if (index === 0) {
                    this.sliderbox.classList.add("first");
                }

                // 슬라이더 인덱스 이동
                const nc = children[index];
                const oc = children[data.index];
                const nscl = nc.classList;

                oc.classList.remove("active");
                if (!nscl.contains("active")) {
                    nscl.add("active");
                }

                oc.style.opacity = "1";
                if (status) {
                    oc.style.right = "0%";
                    nc.style.left = "100%";
                    setTimeout(() => {
                        nc.style.left = "0%";
                        oc.style.right = "100%";
                        setTimeout(() => {
                            oc.style.removeProperty("opacity");
                            oc.style.removeProperty("right");
                            nc.style.removeProperty("left");
                        }, 600);
                    }, 100);
                } else {
                    oc.style.left = "0%";
                    nc.style.right = "100%";
                    setTimeout(() => {
                        oc.style.left = "100%";
                        nc.style.right = "0%";
                        setTimeout(() => {
                            oc.style.removeProperty("opacity");
                            oc.style.removeProperty("left");
                            nc.style.removeProperty("right");
                        }, 600);
                    }, 100);
                }

                // 네비게이션 인덱스 이동
                if (data.nav) {
                    const navChildren = this.nav.children;
                    if (navChildren && navChildren.length > 0) {
                        navChildren[data.index].classList.remove("active");

                        const nncl = navChildren[index].classList;
                        if (!nncl.contains("active")) {
                            nncl.add("active");
                        }
                    }
                }

                data.index = index;
            }

            // 처리상태 변경
            // this.state.isProcess = false;
            setTimeout(() => { this.state.isProcess = false; }, 600);

            // 슬라이더 이동 콜벡
            if (typeof this.props.onMove === "function") {
                this.props.onMove(index);
            }
        }
    }

    /**
     * 네이게이션 위치 설정
     */
    calculNavPosition(nav) {
        const style = {};
        const inout = nav.inout === "in" ? 0 : 100;

        switch (nav.type) {
            case contentPosition.LEFT:
                style.left = nav.posX;
                style.top = "50%";
                style.transform = `translate(${inout}%, -50%)`;
                break;
            case contentPosition.RIGHT:
                style.right = nav.posX;
                style.top = "50%";
                style.transform = `translate(-${inout}%, -50%)`;
                break;
            case contentPosition.TOP:
                style.top = nav.posY;
                style.left = "50%";
                style.transform = `translate(-50%, -${inout}%)`;
                break;
            case contentPosition.TOP_LEFT:
                style.top = nav.posY;
                style.left = nav.posX;
                break;
            case contentPosition.TOP_RIGHT:
                style.top = nav.posY;
                style.right = nav.posX;
                break;
            case contentPosition.BOTTOM_LEFT:
                style.bottom = nav.posY;
                style.left = nav.posX;
                break;
            case contentPosition.BOTTOM_RIGHT:
                style.bottom = nav.posY;
                style.right = nav.posX;
                break;
            case contentPosition.BOTTOM:
            default:
                style.bottom = nav.posY;
                style.left = "50%";
                style.transform = `translate(-50%, ${inout}%)`;
                break;
        }

        return style;
    }

    /**
     * 화살표 위치 설정
     */
    calculArrowPosition(arrow) {
        const style = {
            left: {
                left: arrow.posX,
                top: "50%"
            },
            right: {
                right: arrow.posX,
                top: "50%"
            }
        };

        if (arrow.position === contentPosition.TOP
            || arrow.position === contentPosition.BOTTOM) {
            style.left[arrow.position] = arrow.posY;
            style.right[arrow.position] = arrow.posY;
        } else {
            style.left.transform = "translateY(-50%)";
            style.right.transform = "translateY(-50%)";
        }

        return style;
    }

    /**
     * 썸네일 위치 설정
     */
    // calculThumbPosition(thumb) {
    //     const style = {
    //         width: thumb.width + this.state.scrollWidth,
    //         top: 0
    //     };
    //
    //     switch (thumb.position) {
    //         case contentPosition.LEFT:
    //             style.right = "100%";
    //             style.marginRight = thumb.posX;
    //             break;
    //         case contentPosition.TOP:
    //             style.left = 0;
    //             style.bottom = "100%";
    //             style.marginBottom = thumb.posY;
    //             break;
    //         case contentPosition.BOTTOM:
    //             style.left = 0;
    //             style.top = "100%";
    //             style.marginTop = thumb.posY;
    //             break;
    //         case contentPosition.RIGHT:
    //         default:
    //             style.left = "100%";
    //             style.marginLeft = thumb.posX;
    //             break;
    //     }
    //
    //     return style;
    // }

    /**
     * 슬라이더, 네비게이션, 썸네일 레이아웃 처리
     */
    calculLayoutSlider() {
        const data = this.state.data;
        const list = this.props.children || data.images;

        if (this.props.children) {
            this.state.renderSlider = list;
        } else {
            // const renderThumb = [];
            this.state.renderSlider = list.map((obj, i) => {
                // if (data.thumb) {
                //     renderThumb.push(
                //         <li key={`image-list-${i}`}>
                //             <Img image={{ src: obj.src, type: obj.type }} isCrop={data.crop} />
                //         </li>
                //     );
                // }

                return (
                    <li key={`image-list-${i}`}>
                        <Img image={{ src: obj.src, type: obj.type }} isCrop={data.crop} isImageCrop={data.imageCrop} isImageResize={data.imageResize} isContentResize={data.contentResize} />
                    </li>
                );
            });

            // if (data.thumb) {
            //     this.state.renderThumb = renderThumb;
            //     this.state.thumbStyle = this.calculThumbPosition(data.thumb);
            // }
        }

        if (data.nav) {
            this.state.navStyle = this.calculNavPosition(data.nav);
            this.state.renderNav = list.map((obj, i) => {
                return (
                    <li key={`image-nav-${i}`} className="nav-dotted" onMouseUp={e => this.moveIndex(i)}>&nbsp;</li>
                );
            });
        }
    }

    /**
     * 좌우 화살표 레이아웃 처리
     */
    calculLayoutArrow() {
        const data = this.state.data;
        const arrow = data.arrow;

        if (arrow) {
            const style = this.calculArrowPosition(arrow);

            this.state.renderArrow = [
                <div key="slider-arrow-left" className="slider-arrow-left" onMouseUp={() => this.moveIndex(data.index - 1)} style={style.left}>
                    <div className="arrow">
                        <Icon name="lt_shadow" />
                    </div>
                </div>,
                <div key="slider-arrow-right" className="slider-arrow-right" onMouseUp={() => this.moveIndex(data.index + 1)} style={style.right}>
                    <div className="arrow">
                        <Icon name="gt_shadow" />
                    </div>

                </div>
            ];
        }
    }

    render() {
        const data = this.state.data;

        return (
            <div className="image-slider-box-desktop" key="image-slider" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} ref={ref => { this.sliderbox = ref; }}>
                <div className="image-slider">
                    <ul className="image-list" ref={ref => { this.slider = ref; }} style={{ backgroundColor: data.bgcolor }}>
                        {this.state.renderSlider}
                    </ul>
                </div>
                {this.state.renderArrow}
                {data.nav ?
                    <div key="image-slider-navigation" className="image-slider-navigation" style={this.state.navStyle}>
                        <ul className="navigation-list" ref={ref => { this.nav = ref; }}>
                            {this.state.renderNav}
                        </ul>
                    </div>
                    : null}
                {/* !this.props.children && data.thumb ?
                    <div key="image-slider-thumbs" className="image-thumbs" style={this.state.thumbStyle}>
                        <ul className="thumb-list" ref={ref => { this.thumbs = ref; }} style={{ width: data.thumb.width }}>
                            {this.state.renderThumb}
                        </ul>
                    </div>
                    : null */}
            </div>
        );
    }
}

/**
 * children - array (li태그로된 React Element)
 *
 * data 객체 정의
 *
 * images - array (object - src, type)
 * index - number (시작 인덱스값, 디폴트 0)
 * arrow - object (icon_left, icon_right, position, posX, posY)
 * thumb - object (position, posX, posY)
 * nav - object (position, inout, posX, posY)
 * interval - number (자동넘김, 마이크로초, 0은 정지)
 */
ImageSlider.propTypes = {
    children: PropTypes.node,
    data: PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
        crop: PropTypes.bool,
        imageCrop: PropTypes.bool,
        imageResize: PropTypes.bool,
        contentResize: PropTypes.bool,
        index: PropTypes.number,
        interval: PropTypes.number,
        bgcolor: PropTypes.string,
        arrow: PropTypes.shape({
            icon_left: PropTypes.string,
            icon_right: PropTypes.string,
            position: PropTypes.string,
            posX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            posY: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        }),
        thumb: PropTypes.shape({
            position: PropTypes.string,
            inout: PropTypes.string,
            posX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            posY: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        }),
        nav: PropTypes.shape({
            position: PropTypes.string,
            inout: PropTypes.string,
            posX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            posY: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })
    }),
    onMove: PropTypes.func
};

ImageSlider.defaultProps = {
    children: null,
    data: null,
    onMove: undefined
};

export default ImageSlider;
