import "./accordion.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";
import classNames from "classnames";
import update from "immutability-helper";

class Accordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            isHover: "",
            isActive: ""
            // isActives: []
        };

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        const doc = document;
        const target = doc.querySelector(".context-section__text.active");
        if (target !== null) {
            target.classList.remove("active");
        }
        this.setState({
            isActive: ""
        });
    }

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

    onMouseUp(e, idx) {
        const target = e.currentTarget;
        const panel = target.nextElementSibling;
        const doc = document;
        const targetAll = doc.querySelectorAll(".context-section__text");
        const isActive = this.state.isActive;

        if (isActive === idx) {
            panel.classList.toggle("active");
        } else {
            for (let i = 0, max = targetAll.length; i < max; i += 1) {
                targetAll[i].classList.remove("active");
            }

            panel.classList.add("active");
        }

        let changeIdx = idx;
        if (this.state.isActive === idx) {
            changeIdx = "";
        }

        this.setState({
            isActive: changeIdx
        });
    }

    isActive(idx) {
        return (idx === this.state.isActive);
    }
    isHover(idx) {
        return (idx === this.state.isHover);
    }

    render() {
        const data = this.props.data;
        // const isActives = this.state.isActives;
        const content = [];
        const type = this.props.type;
        // console.log(type);

        return (
            <ul className="accordion-box" key="accordion-box">
                {data.map((obj, index) => {
                    const icon = this.state.isActive === index ? "dt" : "gt_s";
                    return (
                        <li className="context-section" key={`accor_unit${index}`}>
                            <div
                                className={classNames("context-section__title", this.isActive(index) ? "active" : "")}
                                onMouseUp={e => this.onMouseUp(e, index)}
                                onMouseEnter={() => this.onMouseEnter(index + 1)}
                                onMouseLeave={this.onMouseLeave}
                            >
                                {type === "notice" ?
                                    <span className="reg_date">{obj.reg_dt}</span> : null
                                }
                                {obj.title}
                                <span className="accordion-icon">
                                    <Icon name={icon} active={this.isHover(index + 1) ? "active" : ""} />
                                </span>
                            </div>
                            <div className="context-section__text">{utils.linebreak(obj.content)}</div>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

Accordion.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.string
    })),
    type: PropTypes.oneOf(["notice", "qna"])
};

Accordion.defaultProps = {
    data: [],
    type: "qna"
};

export default Accordion;
