import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
// import { Router, routerShape, Link, browserHistory } from "react-router";
import { Footer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class EstimateContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: !this._calledComponentWillUnmount
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.showFooter();
    }

    componentWillReceiveProps(nextProps) {
    }

    onRedirect(url) {
    }

    showFooter() {
        let content = "";
        const isMobile = utils.agent.isMobile();
        const isMobileHost = location.host.startsWith("m.");
        if (isMobile && isMobileHost) {
            content = (
                <Footer>
                    <ScrollTop />
                </Footer>
            );
        }

        return content;
    }

    render() {
        return (
            <div>
                {this.props.children}
                {this.showFooter()}
            </div>
        );
    }
}

EstimateContainer.propTypes = {
    children: PropTypes.node
};

export default EstimateContainer;
