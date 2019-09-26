import "./policy.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import * as CONST from "../../stores/constants";
import AppDispatcher from "../../AppDispatcher";
import * as POLICY_CONSTANT from "shared/constant/policy.const";
import AccordionBox from "./component/AccordionBox";
import Accordion from "./component/Accordion";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class Term extends Component {
    constructor() {
        super();
        this.state = {
            accordion_list: POLICY_CONSTANT.TERM_POLICY.INFO
        };
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "이용약관" });
        }, 0);
    }

    /**
     * 태그에 따라 메서드를 선택한다.
     * @param item
     * @param idx
     * @returns {*}
     */
    setChangeForTagToJSON(item, idx) {
        switch (item.TAG) {
            case "p": return this.createTagToP(item.TEXT, idx);
            case "ol": return this.createTagToOl(item.TEXT, idx);
            case "ul": return this.createTagToUl(item.TEXT, idx);
            default: break;
        }

        return "";
    }

    /**
     * p 태그를 생성한다.
     * @param text
     * @param index
     * @returns {*}
     */
    createTagToP(text, index) {
        return React.createElement("p", { key: `create_p-${index}`, className: "accordion-describe" }, text);
    }

    /**
     * ol 태그를 생성한다.
     * 하위태그가 있다면 하위태그도 생성한다.
     * @param text
     * @param index
     * @returns {*}
     */
    createTagToOl(text, index) {
        const content = [];

        text.map((obj, idx) => {
            if (!obj.TAG) {
                content.push(React.createElement("li", { key: `create_li-${index}__${idx}-from_ol` }, obj));
            } else {
                content.push(this.setChangeForTagToJSON(obj, idx));
            }
            return null;
        });

        return React.createElement("ol", { key: `create_ol-${index}`, className: "accordion-describe" }, content);
    }

    /**
     * ul태그를 생성한다.
     * 하위태그가 있다면 하위태그도 생성한다.
     * @param text
     * @param index
     * @returns {*}
     */
    createTagToUl(text, index) {
        const content = [];
        text.map((obj, idx) => {
            if (!obj.TAG) {
                content.push(React.createElement("li", { key: `create_li-${index}__${idx}-from_ul` }, obj));
            } else {
                content.push(this.setChangeForTagToJSON(obj, idx));
            }
            return null;
        });
        return React.createElement("ul", { key: `create_ul-${index}`, className: "accordion-describe" }, content);
    }

    /**
     * 이용약관 데이터를 파싱한다.
     * @param describe
     * @returns {*}
     */
    setIteratorArrayForDescribe(describe) {
        if (Array.isArray(describe) && describe.length > 0) {
            return describe.map((obj, idx) => {
                return this.setChangeForTagToJSON(obj, idx);
            });
        }
        return "";
    }

    render() {
        return (
            <div className="policy policy-term">
                <div className="policy-private__container">
                    <AccordionBox title={POLICY_CONSTANT.POLICY_TITLE.TERM}>
                        {this.state.accordion_list.map((obj, idx) => {
                            return (
                                <Accordion key={`policy-term__${idx}`} order_no={obj.ORDER} title={obj.TITLE}>
                                    {this.setIteratorArrayForDescribe(obj.DESCRIBE)}
                                </Accordion>
                            );
                        })}
                    </AccordionBox>
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <Term />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);

