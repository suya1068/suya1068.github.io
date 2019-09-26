import "./noneList.scss";
import React, { Component, PropTypes } from "react";

const NoneList = props => {
    const base = `${__SERVER__.img}`;
    return (
        <div className="none-list desktop-estimate" key={`none-list-${props.noneKey}`}>
            <p className="none-main-caption">{props.mainCaption}</p>
            <p className="none-sub-caption">{props.subCaption}</p>
            <div>
                <img role="presentation" src={`${base}${props.src}`} />
            </div>
        </div>
    );
};

export default NoneList;
