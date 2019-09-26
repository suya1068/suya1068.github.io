import React, { Component, PropTypes } from "react";
import { Footer } from "mobile/resources/containers/layout";
import { MainNavigation } from "../components";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

export default class PageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        const check = typeof window.scrollTo === "function";
        if (check) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div className="information-page_container">
                <MainNavigation />
                <div className="information-page_item">
                    {this.props.children}
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

PageContainer.propTypes = {
    children: PropTypes.node.isRequired
};
