import React, { Component, PropTypes } from "react";

class ModalProgress extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { count, total } = this.props;

        const divide = total / 100;
        const per = (count / divide).toFixed(3);

        return (
            <div className="_modal__progress__bar">
                <div className="progress__bar" style={{ width: `${per}%` }} />
            </div>
        );
    }
}

ModalProgress.propTypes = {
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default ModalProgress;
