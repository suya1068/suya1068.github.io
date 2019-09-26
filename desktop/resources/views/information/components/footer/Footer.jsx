import "./Footer.scss";
import React, { PropTypes } from "react";

const Footer = ({ children }) => {
    return (
        <footer className="information-footer">
            <div className="information-inner">
                <div className="container">
                    <div className="information-contents">
                        {children}
                    </div>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    children: PropTypes.node.isRequired
};

export default Footer;
