import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import regular from "shared/constant/regular.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";

class ImageSizeChange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: Number(props.width),
            origin_width: Number(props.origin_width),
            height: Number(props.height),
            origin_height: Number(props.origin_height),
            type: props.type,
            typeList: [{ name: "비율", value: "resize" }, { name: "자르기", value: "crop" }]
        };

        this.onChangeSize = this.onChangeSize.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentWillMount() {
        const { width, height, origin_width, origin_height } = this.props;

        if ((!width || !height) && origin_width && origin_height) {
            const resize = utils.image.resize(origin_width, origin_height, origin_width > 740 ? 740 : origin_width, 1, true);
            this.state = Object.assign({}, this.state, {
                width: resize.width,
                height: resize.height
            });
        } else if (width && height && (!origin_width || !origin_height)) {
            this.state = Object.assign({}, this.state, {
                origin_width: width,
                origin_height: height
            });
        }
    }

    onChangeSize(name, value) {
        this.setState(({ type, width, height, origin_width, origin_height }) => {
            const prop = { [name]: value };
            if (type === "resize" && width && height && value > 0) {
                const b = name === "width";
                let resize = null;

                if (name === "width") {
                    resize = utils.image.resize(origin_width, origin_height, origin_width > value ? value : origin_width, 1, true);
                } else {
                    resize = utils.image.resize(origin_width, origin_height, 1, value, false);
                }

                if (resize.width > 740 || resize.width > origin_width) {
                    resize = utils.image.resize(origin_width, origin_height, origin_width > 740 ? 740 : origin_width, height, true);
                }

                prop.width = resize.width;
                prop.height = resize.height;
            }

            return prop;
        });
    }

    onConfirm(e) {
        if (e && e.preventDefault && e.stopPropagation) {
            e.preventDefault();
            e.stopPropagation();
        }
        const { onConfirm } = this.props;
        const { width, height, type } = this.state;
        let message = "";

        if (width < 1) {
            message = "넓이를 입력해주세요.";
        } else if (width > 740) {
            message = "넓이를 740이하로 입력해주세요";
        } else if (height < 1) {
            message = "높이를 입력해주세요.";
        } else if (height > 2000) {
            message = "높이를 2,000이하로 입력해주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            onConfirm(width, height, type);
        }
    }

    render() {
        const { onClose } = this.props;
        const { width, height, type, typeList } = this.state;

        return (
            <div className="self__review__image__size__modal">
                <div className="image__size__row">
                    <span>이미지 타입</span>
                    <div className="text__input">
                        <DropDown
                            data={typeList}
                            select={type}
                            textAlign="left"
                            onSelect={value => this.setState({ type: value })}
                        />
                    </div>
                </div>
                <form className="image__size__form" onSubmit={this.onConfirm}>
                    <div className="image__size__row">
                        <span>이미지 넓이</span>
                        <div className="text__input">
                            <Input
                                type="text"
                                name="width"
                                value={width}
                                regular={regular.INPUT.NUMBER}
                                onChange={(e, n, v) => this.onChangeSize(n, v)}
                            />
                        </div>
                    </div>
                    <div className="image__size__row">
                        <span>이미지 높이</span>
                        <div className="text__input">
                            <Input
                                type="text"
                                name="height"
                                value={height}
                                regular={regular.INPUT.NUMBER}
                                onChange={(e, n, v) => this.onChangeSize(n, v)}
                            />
                        </div>
                    </div>
                    <div className="image__size__buttons">
                        <button className="_button _button__black" onClick={this.onConfirm}>확인</button>
                        <button className="_button _button__default" onClick={onClose}>취소</button>
                    </div>
                </form>
            </div>
        );
    }
}

ImageSizeChange.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    origin_width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    origin_height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

ImageSizeChange.defaultProps = {
    type: "resize"
};

export default ImageSizeChange;
