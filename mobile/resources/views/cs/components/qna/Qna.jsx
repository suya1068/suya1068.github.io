import "./qna.scss";
import React, { Component } from "react";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AccordionBox from "mobile/resources/views/policy/component/AccordionBox";
import Accordion from "mobile/resources/views/policy/component/Accordion";
import utils from "forsnap-utils";

export default class Qna extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list || [],
            title: props.title || ""
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "고객센터" });
        }, 0);
    }

    render() {
        const { list, title } = this.props;
        return (
            <div className="qna-accordion">
                <AccordionBox title={title}>
                    {list.map((obj, idx) => {
                        return (
                            <Accordion key={`policy-private__${idx}`} order_no={""} title={obj.title}>
                                <p className="qna-accordion-content">{utils.linebreak(obj.content)}</p>
                            </Accordion>
                        );
                    })}
                </AccordionBox>
            </div>
        );
    }
}
