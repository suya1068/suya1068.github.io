import "../scss/PortfolioView.scss";
import React, { Component, PropTypes } from "react";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class PortfolioView extends Component {
    render() {
        return (
            <div className="artist__portfolio__preview">
                <div className="preview__close">
                    <button className="_button _button__close white" onClick={() => Modal.close(this.props.name)} />
                </div>
                {this.props.children}
            </div>
        );
    }
}

PortfolioView.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node
};

export default PortfolioView;
