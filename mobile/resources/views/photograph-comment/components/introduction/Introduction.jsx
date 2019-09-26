import "./Introduction.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";

function Introduction({ artist }) {
    return (
        <section className="photograph-comment-introduction" style={{ marginBottom: "25px" }}>
            <div className="photograph-comment-introduction__thumb">
                <Img image={{ src: artist.profile_image, width: 70, height: 70, default: "/common/default_profile_img.jpg" }} />
            </div>
            <div className="photograph-comment-introduction__content">
                <h5>
                    <div className="photograph-comment-introduction-leading">
                        <span className="leading-emphasis">{ artist.nick_name }</span>님과 함께한
                    </div>
                    <div className="photograph-comment-introduction-leading leading-large">
                        촬영후기를 등록하는 공간입니다.
                    </div>
                </h5>
            </div>
        </section>
    );
}

Introduction.propTypes = {
    artist: PropTypes.shape({
        nick_name: PropTypes.isRequied,
        profile_image: PropTypes.isRequied
    }).isRequired
};

export default Introduction;
