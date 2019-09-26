import "./footer.scss";
import React from "react";

const Footer = ({ children }) => {
    return (
        <div className="mobile-information-footer">
            <div className="mobile-information-inner">
                <div className="mobile-information-contents">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Footer;
