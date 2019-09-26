import React, { Component, PropTypes } from "react";

import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

export default class InformationContainer extends Component {
    componentWillMount() {
    }

    render() {
        return (
            <div className="information-container">
                <div>
                    {this.props.children}
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

InformationContainer.propTypes = {
    children: PropTypes.node
};
