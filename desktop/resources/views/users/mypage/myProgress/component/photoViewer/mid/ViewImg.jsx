import "./view_img.scss";
import React, { Component } from "react";
// import ImageController from "desktop/resources/components/image/image_controller";
// import utils from "forsnap-utils";
// import constant from "shared/constant";

export default class ViewImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            isUnMount: false
        };
        // this._xhrStack = [];
        // this.onLoading = this.onLoading.bind(this);
    }

    componentDidMount() {
        // const { image } = this.state;
        // const image_src = image.thumb_key || image.custom_thumb_key;
        // const src = `${__SERVER__.thumb}/signed/resize/1400x1000/${image_src}`;
        // const obj = { src, count: 0 };
        //
        // this.onLoading(obj);
    }

    componentWillUnmount() {
    }

    // onLoading(image) {
    //     return new Promise((resolve, reject) => {
    //         const result = {
    //             ...image,
    //             status: false
    //         };
    //
    //         // let img = new Image();
    //         //
    //         // img.onload = function () {
    //         //     result.status = true;
    //         //     resolve(result);
    //         //     img = null;
    //         // };
    //         // img.onerror = function () {
    //         //     resolve(result);
    //         //     img = null;
    //         // };
    //         //
    //         // img.src = image.src;
    //
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("GET", result.src, true);
    //         xhr.timeout = 3000;
    //         xhr.onreadystatechange = e => {
    //             if (xhr.readyState === 4) {
    //                 result.code = xhr.status;
    //                 if (xhr.status === 200) {
    //                     result.status = true;
    //                 }
    //             }
    //         };
    //
    //         xhr.onabort = e => {
    //             resolve(result);
    //         };
    //         xhr.onloadend = e => {
    //             // console.log("onloaded", e);
    //             if ([206, 404, 0, ""].indexOf(result.code) === -1 && result.count < 30 && (!result.status || result.code === 202)) {
    //                 console.log(">>>>>>", result);
    //                 const index = this._xhrStack.findIndex(obj => {
    //                     return obj.uid === result.uid;
    //                 });
    //
    //                 if (index !== -1) {
    //                     setTimeout(() => {
    //                         result.count += 1;
    //                         result.retrySrc = `${result.src}?v=${result.count}`;
    //                         xhr.open("GET", result.retrySrc, true);
    //                         xhr.timeout = 3000;
    //                         xhr.send();
    //                     }, 1000);
    //                 } else {
    //                     xhr.abort();
    //                 }
    //             } else {
    //                 resolve(result);
    //             }
    //         };
    //         xhr.ontimeout = e => {
    //             console.log("timeout", e);
    //             result.code = "timeout";
    //         };
    //         xhr.send();
    //
    //         this._xhrStack.push({ xhr });
    //     }).then(response => {
    //         // this._result(response);
    //         // console.log("<<<<<<<result>>>>>>>>", response, this.image.dataset);
    //         this.image.src = response.src;
    //     }).catch(error => {
    //         console.log("fail", error);
    //         // this._result(error);
    //     });
    // }

    // onError(e) {
    //     const node = e.currentTarget;
    //     node.src = `${__SERVER__.img}${constant.DEFAULT_IMAGES.BACKGROUND}`;
    //     return null;
    // }

    render() {
        const { image } = this.state;
        const image_src = image.thumb_key || image.custom_thumb_key;
        const src = `${__SERVER__.thumb}/signed/resize/1400x1000/${image_src}`;

        return (
            <li className="photo-viewer-middle__images-box swiper-slide">
                <img role="presentation" data-src={src} className="swiper-lazy" ref={node => { this.image = node; }} />
                <div className="swiper-lazy-preloader forsnap-loading-img">
                    <img role="presentation" src={`${__SERVER__.img}/common/loading.gif`} />
                </div>
            </li>
        );
    }
}
