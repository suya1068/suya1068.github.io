import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import classNames from "classnames";
import Img from "shared/components/image/Img";

class SecondConsult extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.gaEvent = this.gaEvent.bind(this);
    }

    gaEvent(category) {
        utils.ad.gaEvent("기업_메인", "카테고리이동", category);
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
                            <div className="item" key={`item_${o.code}`}>
                                <a className="thumb" href={`/products?category=${o.code.toLowerCase()}`} onClick={() => this.gaEvent(o.name)}>
                                    <div className="overlay">
                                        <img alt="icon" src={`${__SERVER__.img}/common/icon/icon_circle_plus.png`} />
                                        <div className="title">포트폴리오 확인하기</div>
                                    </div>
                                    <Img image={{ src: `/main/second_consult/20190828/output/second_${o.code.toLowerCase()}.jpg`, type: "image" }} />
                                    {/*<img alt="thumb" src={`${__SERVER__.img}/main/second_consult/20190828/second_${o.code.toLowerCase()}.jpg`} />*/}
                                    {/*<div className="artist_name">Photo by {o.artist_name}</div>*/}
                                </a>
                                <div className="text">
                                    <div className="title">{o.name}</div>
                                    <div className="tag">{o.tag.map((t, i) => <span key={`tag_${o.code}__${i}`}>#{t}</span>)}</div>
                                </div>
                            </div>
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
