import "./excard_panel_info.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelInfo extends Component {
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
                <div className={`${text_type}__content`}>
                    {text_data.content.map((obj, idx) => {
                        return (
                            <p
                                className={`${text_type}__content-key`}
                                style={{ color: obj.color }}
                                key={`${text_type}__content-key__${idx}`}
                            >
                                <span className="name">{obj.name}</span>
                                <span className="desc">{obj.desc}</span>
                            </p>
                        );
                    })}
                </div>
            </div>
        );
    }
}

