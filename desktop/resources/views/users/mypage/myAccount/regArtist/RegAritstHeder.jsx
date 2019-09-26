import React, { Component, PropTypes } from "react";
import ImageHeader from "desktop/resources/components/image/imageHead/ImageHead";

const RegArtistHeader = props => {
    const headerInfo = {
        imgTitle: "작가등록하기",
        imgText: "작가활동에 필요한 정보를 적어주세요.",
        imgTitleUrl: `${__SERVER__.img}/artist/artist_top_img.jpg`,
        btnTitle: ""
    };

    return (
        <section>
            <ImageHeader imgUrl={headerInfo.imgTitleUrl} size="small">
                <h1 className="h1">{headerInfo.imgTitle}</h1>
                <p className="h6">{headerInfo.imgText}</p>
            </ImageHeader>
        </section>
    );
};

export default RegArtistHeader;
