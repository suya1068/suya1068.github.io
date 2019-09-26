import "./accordion_box.scss";
import React from "react";

/**
 * 어코디언 박스
 * @param props - title : 메인 타이틀, children : 어코디언 아이템
 * @returns {*}
 * @constructor
 */

const AccordionBox = props => {
    return (
        <section className="accordion-box">
            <div className="accordion-box__heading">
                <h3 className="accordion-box__main-title">{props.title}</h3>
            </div>
            <div className="accordion-box__list-content">
                {props.children}
            </div>
        </section>
    );
};

export default AccordionBox;
