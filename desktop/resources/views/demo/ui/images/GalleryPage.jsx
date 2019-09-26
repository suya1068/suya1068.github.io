import React, { Component, PropTypes } from "react";

import ImageGallery from "shared/components/gallery/ImageGallery";

const images = [
    { src: "/product/2a/359/portfolio595a40d09720a.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e0261573.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e02c2e9c.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e036d537.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e03d4afb.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e043caae.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e04af07f.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b2e0544856.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bb0474a.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bb59ac2.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bbbdcdc.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bc28f54.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bc75688.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bcf3f9b.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bd54365.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bdc6e46.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63be323d2.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bea1123.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bf2ef9d.jpg", width: 1616, height: 1080 },
    { src: "/product/2a/359/portfolio595b63bf850d1.jpg", width: 1616, height: 1080 }
];

class GalleryPage extends Component {
    render() {
        return (
            <div>
                <ImageGallery images={images} />
            </div>
        );
    }
}

export default GalleryPage;
