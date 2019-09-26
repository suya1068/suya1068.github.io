import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import SecondConsultItem from "./SecondConsultItem";
import classNames from "classnames";

class SecondConsult extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.gaEvent = this.gaEvent.bind(this);
    }

    gaEvent(category) {
        utils.ad.gaEvent("M_기업_메인", "카테고리이동", category);
    }

    render() {
        const { data, title, desc, test } = this.props;

        return (
            <div className="main__second__consult">
                <div className="title__one">{title}</div>
                <div className={classNames("title__two", { "test": test })}>{desc}</div>
                <div className="list">
                    {data.map(o => {
                        return (
                            <SecondConsultItem data={o} key={`item_${o.code}`} gaEvent={this.gaEvent} />
                        );
                    })}
                </div>
            </div>
        );
    }
}

SecondConsult.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
        tag: PropTypes.arrayOf(PropTypes.string)
    }))
};

export default SecondConsult;
