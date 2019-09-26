import "./excard_panel_chat.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            container_style: props.container_style
        };
    }

    componentWillMount() {

    }

    render() {
        const { data, container_style } = this.props;
        const text_data = data.text;
        const text_type = text_data.type;
        return (
            <div className={classNames("ex_card__panel__type", text_type)} style={container_style}>
                <p className={classNames(`${text_type}__title`, data.photo_position)}>{utils.linebreak(text_data.title)}</p>
                <div className={`${text_type}__content`} style={{ width: `calc(100% - ${data.photo.width}px)` }}>
                    {text_data.content.map((obj, idx) => {
                        return (
                            <div
                                className={classNames(`${text_type}__content-key`, { "end": obj.end })}
                                key={`${text_type}__content-key__${idx}`}
                            >
                                {obj.name && <p className="user">{obj.name}</p>}
                                <div className="desc-box">
                                    {obj.desc.map((d, i) => {
                                        const text = obj.end ? d : `"${d}"`;
                                        return (
                                            <p className="desc" key={`desc-box__${i}`}>{text}</p>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

