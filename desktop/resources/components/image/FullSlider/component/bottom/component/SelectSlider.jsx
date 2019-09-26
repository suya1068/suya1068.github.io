import "./selectSlider.scss";
import React, { Component, PropTypes } from "react";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";
import classNames from "classnames";

class SelectSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images,
            type: this.props.type,
            page: 1,
            maxPage: 1,
            count: this.props.type === "photo" ? 5 : 3,
            leftMove: this.props.type === "photo" ? 475 : 786,
            left: 0,
            isUpdate: true,
            /////////////////////
            imageCount: this.props.images.length,
            isHover: ""
        };

        this.slideMove = this.slideMove.bind(this);
        this.autoSlide = this.autoSlide.bind(this);
        this.getCalcMaxPage = this.getCalcMaxPage.bind(this);

        this.getMoveLeft = this.getMoveLeft.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentWillMount() {
        // checkList 대비 현재 페이지 계산.
        // const count = this.state.count;
        // const length = this.props.images.length;
        // const leftMove = this.state.leftMove;
        // const maxPage = length > 5 ? Math.ceil(length / count) : this.state.maxPage;
        // let page = this.state.page;
        // let left = 0;
        // if (page > 2) {
        //     if (maxPage > page) {
        //         page = maxPage;
        //         left = -(maxPage - 1) * leftMove;
        //     }
        //     this.setState({
        //         left,
        //         page,
        //         maxPage
        //     });
        // }
    }

    componentDidMount() {
        this.getMoveLeft();
        // this.autoSlide();
    }

    componentWillReceiveProps(nextProps) {
        // if (this.state.isUpdate) {
        if (this.state.type === "photo") {
            if ((this.state.imageCount !== nextProps.images.length) && !this.state.isUpdate) {
                const maxPage = this.state.maxPage;
                const leftMove = this.state.leftMove;
                this.setState({
                    left: -(maxPage - 1) * leftMove,
                    page: maxPage,
                    isUpdate: true
                });
            }
        }

        this.getCalcMaxPage();

        // }
    }

    componentWillUnmount() {
    }

    onMouseEnter(idx) {
        this.setState({
            isHover: idx
        });
    }

    onMouseLeave() {
        this.setState({
            isHover: ""
        });
    }

    onDeletePhoto(obj) {
        if (typeof this.props.onDelete === "function") {
            this.props.onDelete(obj);
        }
    }

    onClickPhoto(activeIndex) {
    }

    getMoveLeft() {
        const page = this.state.page;
        const length = this.state.images.length;
        const count = this.state.count;
        const maxPage = Math.ceil(length / count);
        const leftMove = this.state.leftMove;

        if (maxPage > 1) {
            this.setState({
                page: maxPage,
                maxPage,
                left: -(maxPage - 1) * leftMove
            });
        }
    }

    getCalcMaxPage() {
        const count = this.state.count;
        const length = this.props.images.length;
        const maxPage = Math.ceil(length / count);
        // let page = this.state.page;
        // if (maxPage > page) {
        //     page = maxPage;
        // }
        this.setState({
            maxPage,
            imageCount: length
        }, () => {
            this.autoSlide();
        });
    }

    getCreatePhotos() {
        // const images = this.state.images;
        const images = this.props.images;
        // console.log(images);
        return images.map((image, idx) => {
            const realIndex = parseInt(image.display_order, 10) - 1;
            const url = `/${image.thumb_key}`;
            return (
                <div
                    className="wrap-selectPhoto"
                    key={`selectPhoto_${idx}`}
                    onMouseEnter={() => this.onMouseEnter(idx)}
                    onMouseLeave={this.onMouseLeave}
                >
                    <div className={classNames("photo-bg", this.isHover(idx) ? "hover" : "")} />
                    <Buttons buttonStyle={{ size: "small", isActive: this.isHover(idx), icon: "close_tiny" }} inline={{ className: "close", onClick: () => this.onDeletePhoto(image) }} />
                    <li className="selectPhoto">
                        <ImageCheck image={{ src: url, type: "private" }} size="small" />
                    </li>
                </div>
            );
        });
    }

    isHover(idx) {
        return this.state.isHover === idx;
    }

    slideMove(e) {
        // const imageLength = this.props.images.length;
        // const count = this.state.count;
        const leftMove = this.state.leftMove;
        const currentTarget = e.target;
        const className = currentTarget.className;
        let left = this.state.left;
        let page = this.state.page;
        const maxPageIndex = this.state.maxPage;

        if (className === "icon-lt") {
            if (page > 1) {
                page -= 1;
                left += leftMove;
            }
        } else if (className === "icon-gt") {
            if (page < maxPageIndex && page !== maxPageIndex) {
                page += 1;
                left -= leftMove;
            }
        }
        this.setState({
            left,
            page
        }, () => {
            if (page !== maxPageIndex) {
                this.setState({
                    isUpdate: false
                });
            } else {
                this.setState({
                    isUpdate: true
                });
            }
        });
    }

    autoSlide() {
        const imageLength = this.props.images.length;
        const count = this.state.count;
        const leftMove = this.state.leftMove;
        let left = this.state.left;
        let page = this.state.page;
        const maxPageIndex = this.state.maxPage;

        if (imageLength > 2 && this.state.isUpdate) {
            if (page < maxPageIndex && imageLength % count === 1) {
                page += 1;
                left -= leftMove;
            } else if (page > 1 && maxPageIndex - page === -1 && imageLength % count === 0) {
                page -= 1;
                left += leftMove;
            }
        }

        this.setState({
            page,
            left
        });
    }

    render() {
        const page = this.state.page;
        const maxPage = this.state.maxPage;
        const type = this.state.type;
        const widthSize = type === "photo" ? 95 : 265;
        return (
            <div className={classNames("selectSlider-component", type)}>
                <div className="wrap-div">
                    <div className="testClass" style={{ width: this.props.images.length * widthSize, left: this.state.left }}>
                        <ul className="photo-list">
                            {this.getCreatePhotos()}
                        </ul>
                    </div>
                    <div className={classNames("selectSlider-arrow")} onMouseUp={e => this.slideMove(e)}>
                        <Icon name="lt" hide={page === 1 ? "hide" : ""} />
                        <Icon name="gt" hide={(page === maxPage) || (maxPage === 0) ? "hide" : ""} />
                    </div>
                </div>
            </div>
        );
    }
}

SelectSlider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    type: PropTypes.oneOf(["photo", "comment"])
};

SelectSlider.defaultProps = {
    images: [],
    type: "photo"
};

export default SelectSlider;
