import "./excard_panel_normal.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelNormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            container_style: props.container_style
        };
    }

    componentWillMount() {

    }

    renderMixImage(data) {
        const text_data = data.text;
        const text_type = text_data.type;
        const sub_photo = data.sub_photo;
        return (
            <div>
                <p className={classNames(`${text_type}__title`, data.photo_position)}>{utils.linebreak(text_data.title)}</p>
                <div className="sub_photo">
                    <div className="sub_photo__image" style={{ width: sub_photo.width, height: sub_photo.height }}>
                        <Img image={{ src: sub_photo.src, type: "image" }} />
                    </div>
                    <div className="sub_photo__content">
                        {text_data.content.map((obj, idx) => {
                            return (
                                <p
                                    className={classNames(`${text_type}__content-key`)}
                                    key={`${text_type}__content-key__${idx}`}
                                >{utils.linebreak(obj.desc)}</p>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { data, container_style } = this.props;
        const text_data = data.text;
        const text_type = text_data.type;
        const style = container_style;

        if (data.photo_position === "mix") {
            style.transform = "translateY(120px)";
            style.flexDirection = "column-reverse";
            style.width = "100%";
        }

        return (
            <div className={classNames("ex_card__panel__type", text_type)} style={container_style}>
                {data.photo_position === "mix" ?
                    this.renderMixImage(data) :
                    <div>
                        <p className={classNames(`${text_type}__title`, data.photo_position)}>{utils.linebreak(text_data.title)}</p>
                        <div className={`${text_type}__content`}>
                            {text_data.content.map((obj, idx) => {
                                return (
                                    <p
                                        className={classNames(`${text_type}__content-key`)}
                                        key={`${text_type}__content-key__${idx}`}
                                    >{utils.linebreak(obj.desc)}</p>
                                );
                            })}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

