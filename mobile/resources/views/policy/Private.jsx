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
import utils from "forsnap-utils";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class Private extends Component {
    constructor() {
        super();
        this.state = {
            accordion_list: POLICY_CONSTANT.PRIVACY_POLICY.INFO
        };
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "개인정보 취급방침" });
        }, 0);
    }

    render() {
        const { accordion_list } = this.state;
        return (
            <div className="policy policy-private">
                <div className="policy-private__container">
                    <AccordionBox title={POLICY_CONSTANT.POLICY_TITLE.PRIVACY}>
                        {accordion_list.map((obj, idx) => {
                            let describe = (<p className="accordion-describe">{utils.linebreak(obj.DESCRIBE)}</p>);
                            if (obj.ORDER === "9") {
                                describe = (
                                    <div className="policy-table">
                                        <div className="policy-table__row">
                                            <p className="title">이름</p>
                                            <p className="content">박현철</p>
                                        </div>
                                        <div className="policy-table__row">
                                            <p className="title">소속</p>
                                            <p className="content">포스냅</p>
                                        </div>
                                        <div className="policy-table__row">
                                            <p className="title">직위</p>
                                            <p className="content">대표</p>
                                        </div>
                                        <div className="policy-table__row">
                                            <p className="title">연락처</p>
                                            <p className="content">070-4060-4406</p>
                                        </div>
                                        <div className="policy-table__row">
                                            <p className="title">이메일</p>
                                            <p className="content">hcpark@forsnap.com</p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Accordion key={`policy-private__${idx}`} title={`${obj.ORDER}. ${obj.TITLE}`}>
                                    {describe}
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
            <Private />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
