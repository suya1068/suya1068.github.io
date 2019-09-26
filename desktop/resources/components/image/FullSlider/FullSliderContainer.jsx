import "./fullSlider.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import PopModal from "shared/components/modal/PopModal";
import TopSlider from "./component/top/TopSlider";
import MiddleSlider from "./component/middle/MiddleSlider";
import BottomInfo from "./component/bottom/BottomInfo";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            isViewType: props.isViewType,
            activeIndex: props.activeIndex,
            data: props.data || null,
            middleHeight: 0,
            photoType: props.photoType,
            ////////////////////////
            checkList: props.checkList,
            isLastLoading: false
        };

        this.resizeHeight = this.resizeHeight.bind(this);
        this.setActiveIndex = this.setActiveIndex.bind(this);
        this.onClickPhoto = this.onClickPhoto.bind(this);
        this.lastLoading = this.lastLoading.bind(this);
    }

    componentWillMount() {
        history.pushState(null, null, location.href);
        // 브라우저 크기 조절시 middle height 계산
        window.addEventListener("resize", this.resizeHeight, false);
    }

    componentDidMount() {
        this.resizeHeight();
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        // 슬라이더 창 종료 시 발생시켰던 이벤트 삭제
        window.removeEventListener("resize", this.resizeHeight, false);
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    onScrollPlusImages(e, flag) {
        // console.log("vieserFlag: ", flag);
        if (typeof this.props.onScroll === "function") {
            this.props.onScroll(e, flag);
        }
    }

    onClickPhoto(obj) {
        const checkList = this.props.checkList;
        const infoData = this.state.infoData;
        const customCount = parseInt(infoData.custom_cnt, 10);

        const index = checkList.findIndex(chk => {
            return chk.photo_no === obj.photo_no;
        });

        if (index === -1) {
            if (customCount === checkList.length) {
                return;
            }
            checkList.push(obj);
        } else {
            checkList.splice(index, 1);
        }

        this.setState({
            checkList
        }, () => {
            if (customCount === this.props.checkList.length) {
                PopModal.toast("보정사진을 전부 선택하셨습니다.");
            }
        });
    }

    setActiveIndex(activeIndex) {
        this.setState({
            activeIndex
        });
    }

    modifySliderPrarms() {
        // 각 슬라이더에 필요한 파라미터를 만든다.
    }

    /**
     *  top과 bottom의 길이를 구해 middle의 height를 산출한다.
     */
    resizeHeight() {
        const clientHeight = window.innerHeight;
        const bottom_node = document.getElementsByClassName("photoViewer-bottom")[0];
        const topHeight = document.getElementsByClassName("photoViewer-top")[0].offsetHeight;
        // const middleHeight = document.getElementsByClassName("photoViewer-middle")[0];
        const bottomHeight = bottom_node ? bottom_node.offsetHeight : 100;

        let height = clientHeight - (topHeight + bottomHeight);
        if (height < 400) {
            height = 400;
        }
        // middleHeight.style.height = `${height - 5}px`;
        this.setState({
            middleHeight: height - 5
        });
    }

    lastLoading() {
        this.setState({
            isLastLoading: true
        });
    }

    render() {
        const { photoType, checkList, images, isViewType, viewType, lazy, isCustom, data } = this.props;
        const { activeIndex, middleHeight } = this.state;

        return (
            <div className={classNames("photoViewer-component photoViewer")}/* key="photoViewer"*/>
                <TopSlider
                    images={images}
                    activeIndex={activeIndex}
                    onChangeIndex={idx => this.setActiveIndex(idx)}
                    onScroll={(e, flag) => this.onScrollPlusImages(e, flag)}
                    lastLoading={this.lastLoading}
                    photoType={photoType}
                    checkList={checkList}
                />
                <MiddleSlider
                    images={images}
                    activeIndex={activeIndex}
                    onChangeIndex={idx => this.setActiveIndex(idx)}
                    isViewType={isViewType}
                    photoType={photoType}
                    onCheckPhoto={this.onClickPhoto}
                    isCustom={isCustom}
                    checkList={checkList}
                    middleHeight={middleHeight}
                    //topImageLastLoading={this.state.isLastLoading}
                    lazy={lazy}
                />
                {data &&
                    <BottomInfo
                        images={images}
                        infoData={data}
                        isViewType={isViewType}
                        photoType={photoType}
                        checkList={checkList}
                        isCustom={isCustom}
                        onDeleteCheck={this.onClickPhoto}
                        viewType={viewType}
                    />
                }
            </div>
        );
    }
}

PhotoViewer.propTypes = {
    isViewType: PropTypes.oneOf(["viewOnly", "select"]),
    photoType: PropTypes.oneOf(["private", "thumb1", "thumb"]),
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    activeIndex: PropTypes.number,
    data: PropTypes.shape([PropTypes.node]),
    checkList: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

PhotoViewer.defaultProps = {
    isViewType: "viewOnly",
    photoType: "thumb1",
    images: [],
    activeIndex: 0,
    data: {},
    checkList: []
};

export default PhotoViewer;
