import "./excard_panel_list.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelList extends Component {
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
        const item_style = {};
        const c_style = container_style;
        if (text_data.wrap) {
            item_style.backgroundColor = "#fff";
            item_style.padding = "40px 40px 0";

            c_style.width = "100%";
            c_style.padding = "0 40px";
            c_style.transform = "translateY(-85px)";
            c_style.position = "relative";
        }

        return (
            <div className={classNames("ex_card__panel__type", text_type)} style={c_style}>
                <div style={item_style}>
                    <p className={classNames(`${text_type}__title`, text_data.title_bar)}>{utils.linebreak(text_data.title)}</p>
                    <ul className={`${text_type}__content`}>
                        {text_data.content.map((obj, idx) => {
                            return (
                                <li
                                    className={`${text_type}__content-key`}
                                    style={{ marginBottom: text_data.grid_dist }}
                                    key={`${text_type}__content-key__${idx}`}
                                >
                                    {obj.title && <p className="title">{obj.title}</p>}
                                    <p className="desc">{utils.linebreak(obj.desc)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

