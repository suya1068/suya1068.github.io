import "./excard_panel_text.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelText extends Component {
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
        const type = data.type;
        return (
            <div className={classNames("ex_card__panel__type", type)} style={container_style}>
                <p className={`${type}__title`}>{utils.linebreak(text_data.title)}</p>
                <div className={`${type}__content`}>
                    {text_data.map((obj, idx) => {
                        return (
                            <ul
                                className={classNames(`${type}__content-key`)}
                                key={`${type}__content-key__${idx}`}
                            >
                                <p className="title">{utils.linebreak(obj.title)}</p>
                                {obj.content.map((o, i) => {
                                    return (
                                        <li key={`excard__text_v__${idx}__${i}`}>{utils.linebreak(o.desc)}</li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
            </div>
        );
    }
}

