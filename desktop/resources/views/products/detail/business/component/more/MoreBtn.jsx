import "./moreBtn.scss";
import React, { PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";

const MoreBtn = ({ title, onMore, moreStyle }) => {
    return (
        <div className="section__more-btn">
            <button className="more-btn" onClick={onMore}>
                <p style={{ ...moreStyle }}>{title}</p>
                <Icon name="disable_dt" />
            </button>
        </div>
    );
};

export default MoreBtn;
