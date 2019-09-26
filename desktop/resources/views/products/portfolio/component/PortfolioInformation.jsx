import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import constant from "shared/constant";

class PortfolioInformation extends Component {
    render() {
        const { data } = this.props;

        if (!data) {
            return null;
        }

        let src = `${__SERVER__.img}/${constant.DEFAULT_IMAGES.PROFILE}`;
        if (data.profile_img) {
            src = `${__SERVER__.thumb}/normal/crop/64x64/${data.profile_img}`;
        }

        return (
            <div className={classNames("portfolio__information", { show: true })}>
                <div className="profile__img">
                    <img alt="profile" src={src} />
                </div>
                <div className="portfolio__content">
                    <div>[{data.artist_name}] {data.title}</div>
                    <div>포트폴리오<span className="count">{data.total}장</span></div>
                </div>
            </div>
        );
    }
}

PortfolioInformation.propTypes = {
    data: PropTypes.shape({
        profile_img: PropTypes.string,
        artist_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
};

export default PortfolioInformation;
