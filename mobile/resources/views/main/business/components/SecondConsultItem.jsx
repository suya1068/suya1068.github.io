import React, { Component, PropTypes } from "react";
//
// import utils from "forsnap-utils";
//
// import Img from "shared/components/image/Img";

class SecondConsultItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }

    render() {
        const { data } = this.state;

        return (
            <div className="item">
                <a className="thumb" href={`/products?category=${data.code.toLowerCase()}`} onClick={() => this.props.gaEvent(data.name)}>
                    <img
                        src={`${__SERVER__.img}/main/second_consult/20190828/output/second_${data.code.toLowerCase()}.jpg`}
                        style={{ width: ["PRODUCT", "PROFILE_BIZ"].includes(data.code) && "100%", height: !["PRODUCT", "PROFILE_BIZ"].includes(data.code) && "100%" }}
                    />
                    {/*<Img image={{ src: `/main/second_consult/20190828/output/second_${data.code.toLowerCase()}.jpg`, type: "image", width: 1, height: 1 }} isImageCrop />*/}
                    <div className="thumb__overlay">
                        <div className="title">{data.name}</div>
                        <div className="tag">{data.tag.map((t, i) => <span key={`tag_${data.code}__${i}`}>#{t}</span>)}</div>
                    </div>
                    {/*<div className="artist_name">Photo by {data.artist_name}</div>*/}
                </a>
            </div>
        );
    }
}

SecondConsultItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    gaEvent: PropTypes.func.isRequired
};

export default SecondConsultItem;
