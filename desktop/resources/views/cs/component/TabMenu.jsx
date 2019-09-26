import "./tabMenu.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import classNames from "classnames";
import tempData from "./tabMenu_data";

class TabMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHover: ""
        };

        this.isActive = this.isActive.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {}

    onMouseEnter(value) {
        this.setState({
            isHover: value
        });
    }

    onMouseLeave() {
        this.setState({
            isHover: ""
        });
    }

    isActive(value) {
        return ((value === this.props.value || value === this.state.isHover));
        // return ((value === this.props.value || value === this.state.isHover));
    }

    render() {
        const data = this.props.data;
        return (
            <ul className="tabMenu-box">
                {data.map((obj, idx) => {
                    return (
                        <li className="tabMenu-child" key={`tabLi_${idx}`}>
                            <div
                                className={classNames("tabMenu-content", this.isActive(obj.value) ? "active" : "")}
                                onMouseEnter={() => this.onMouseEnter(obj.value)}
                                onMouseLeave={this.onMouseLeave}
                                onMouseUp={typeof obj.callback === "function" ? () => obj.callback(obj) : undefined}
                            >
                                <div className="tabMenu-icon">
                                    <Icon name={obj.icon} active={this.isActive(obj.value) ? "active" : ""} />
                                </div>
                                <h3 className="tabMenu-text h6">{obj.name}</h3>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default TabMenu;
