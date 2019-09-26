import "./moreBtn.scss";
import React, { PropTypes } from "react";

const MoreBtn = ({ title, onMore, moreStyle }) => {
    return (
        <div className="section__more-btn">
            <button className="more-btn" onClick={onMore}>
                <p>{title}</p>
                <img src={`${__SERVER__.img}/common/icon/black_dt_2.png`} alt="화살표" width={12} height={8} />
            </button>
        </div>
    );
};

export default MoreBtn;
