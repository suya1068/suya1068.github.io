import "./landingFooter.scss";
import React, { Component } from "react";

const LandingFooter = () => {
    return (
        <section className="landing__footer">
            <p className="landing__footer__copyright">
                Copyright
                <span className="copy_c" />
                Forsnap. All rights reserved.
            </p>
        </section>
    );
};

export default LandingFooter;
