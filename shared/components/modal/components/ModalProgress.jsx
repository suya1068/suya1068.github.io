import React, { Component, PropTypes } from "react";

import constant from "shared/constant";

class ModalProgress extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="_modal__progress">
                <img alt="progress" src={`${__SERVER__.img}${constant.PROGRESS.COLOR_CAT}`} />
            </div>
        );
    }
}

ModalProgress.propTypes = {
};

export default ModalProgress;
