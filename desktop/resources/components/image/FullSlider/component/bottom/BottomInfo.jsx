import React, { Component, PropTypes } from "react";
import Profile from "desktop/resources/components/image/Profile";
// import ImageCheck from "desktop/resources/components/image/ImageCheck";
// import update from "immutability-helper";
// import ImageSliderTest from "desktop/resources/components/image/ImageSliderTest";
// component
import SelectSlider from "./component/SelectSlider";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isViewType: this.props.isViewType,
            infoData: this.props.infoData
        };

        this.drawBottomInfo = this.drawBottomInfo.bind(this);
        // test
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

    onActivePhoto(activeIndex) {
        // if (typeof this.props.onCheckPhoto === "function") {
        //     console.log("entry");
        //     this.props.onCheckPhoto(activeIndex);
        // }
    }

    onDelPhoto(obj) {
        if (typeof this.props.onDeleteCheck === "function") {
            this.props.onDeleteCheck(obj);
        }
    }

    /**
     * bottom info 를 그린다.
     * @returns {XML}
     */
    drawBottomInfo() {
        /*
        <ImageSliderTest images={checkList} type="photo">
            {
                checkList.map((image, idx) => {
                    const url = `/${image.thumb_key}`;
                    const checked = images.findIndex(chk => {
                        return chk.photo_no === image.photo_no;
                    });

                    return (
                        <ImageCheck
                            image={{ src: url, type: "private" }}
                            checked={(checked !== -1)}
                            size="small"
                            key={`fullScreenSlider${idx}`}
                            resultFunc={chk => this.onClickPhoto(image)}
                        />
                    );
                })
            }
        </ImageSliderTest>
        */
        const infoData = this.props.infoData;
        const checkList = this.props.checkList;
        const isViewType = this.props.isViewType;
        const isCustom = this.props.isCustom;
        const viewType = this.props.viewType;

        const pContent = [];

        if (isViewType === "select") {
            pContent.push(
                <p className="text" key="select-version">원본사진 {infoData.originMaxCount}장 중 {checkList.length}장을 선택하셨어요. <span className="pinkText">보정요청 갯수{infoData.custom_cnt - checkList.length}장 남음</span></p>
            );
        } else {
            let sliderName = "포트폴리오";
            let photoCount = infoData.portfolio_cnt;
            if (!isCustom && viewType !== "portfolio" && viewType !== "estimate") {
                sliderName = "원본사진";
            } else if (isCustom && viewType !== "portfolio" && viewType !== "estimate") {
                sliderName = "보정사진";
                photoCount = infoData.custom_cnt;
            } else if (viewType === "estimate") {
                sliderName = "견적용 포트폴리오";
                photoCount = infoData.total;
            }

            pContent.push(
                <p className="text" key="onlyView-version">{sliderName} <span className="pinkText">사진 {photoCount}장</span></p>
            );
        }

        return (
            <div className="bottom-info">
                <div className="leftSide">
                    <div className="artistProfile">
                        <Profile image={{ src: infoData.profile_img }} size="medium" />
                    </div>
                    <div className="artistContent">
                        <p className="title">[{infoData.nick_name}] {infoData.title}</p>
                        {pContent}
                    </div>
                </div>
                <div className="rightSide">
                    {isViewType === "select"
                        ? <div className="photo-slide">
                            <SelectSlider images={checkList} onDelete={obj => this.onDelPhoto(obj)} />
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }

    render() {
        return (
            <section className="photoViewer-bottom">
                <h2 className="sr-only">BottomInfo</h2>
                {this.drawBottomInfo()}
            </section>
        );
    }
}

PhotoViewer.propTypes = {
    isViewType: PropTypes.oneOf(["select", "viewOnly"]),
    infoData: PropTypes.shape([PropTypes.node])
};

PhotoViewer.defaultProps = {
    isViewType: "viewOnly",
    infoData: {},
    checkList: []
};

export default PhotoViewer;
