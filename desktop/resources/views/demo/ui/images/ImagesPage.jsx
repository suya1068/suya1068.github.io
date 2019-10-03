import React, { Component, PropTypes } from "react";

import Image from "desktop/resources/components/image/Image";
import Profile from "desktop/resources/components/image/Profile";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import ImageSlider from "desktop/resources/components/image/ImageSlider";
import PopModal from "shared/components/modal/PopModal";
// import FullSlider from "desktop/resources/components/image/FullSlider/FullSliderContainer";
// import Horizontal from "desktop/resources/components/image/FullSlider/component/HorizontalSlider";
import Img from "desktop/resources/components/image/Img";

import ImageSliderTest from "desktop/resources/components/image/ImageSliderTest";

const imageData = [
    { src: "/common/test_img_161227.jpg", type: "image", photo_no: "10" },
    { src: "/main/m_mid_pic.jpg", type: "image", photo_no: "12" },
    { src: "/main/m_top_pic.jpg", type: "image", photo_no: "13" },
    { src: "/main/m_pic_01.jpg", type: "image", photo_no: "14" },
    { src: "/main/m_pic_02.jpg", type: "image", photo_no: "15" },
    { src: "/main/m_pic_03.jpg", type: "image", photo_no: "16" },
    { src: "/main/m_pic_04.jpg", type: "image", photo_no: "17" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_05.jpg", type: "image", photo_no: "18" },
    { src: "/main/m_pic_06.jpg", type: "image", photo_no: "19" },
    { src: "/main/m_pic_07.jpg", type: "image", photo_no: "20" },
    { src: "/main/m_pic_08.jpg", type: "image", photo_no: "21" },
    { src: "/main/m_pic_09.jpg", type: "image", photo_no: "22" }
];

/**
 * 이미지 데모 페이지
 */
class ImagesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // fullSlider() {
    //     PopModal.createModal("test", <FullSlider images={imageData} />, { className: "modal-fullscreen slider" });
    //     PopModal.show("test");
    // }
    // horizontalSlider() {
    //     PopModal.createModal("horizon", <Horizontal images={imageData} />, { className: "modal-horizon" });
    //     PopModal.show("horizon");
    // }

    render() {
        const componentList = [
            <li key="test-1">
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                </div>
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                </div>
            </li>,
            <li key="test-2">
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                </div>
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                </div>
            </li>,
            <li key="test-3">
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                </div>
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                </div>
            </li>,
            <li key="test-4">
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                </div>
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                </div>
            </li>,
            <li key="test-5">
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                </div>
                <div style={{ width: "328px", height: "328px", display: "inline-block" }}>
                    <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                </div>
            </li>
        ];

        return (
            <div>
                <div className="demo-content">
                    <h2>Image Component</h2>
                    <hr />
                    <div>
                        <Profile image={{ src: "/common/l_tum_img.jpg", type: "image" }} />
                    </div>
                    <div style={{ width: "328px", height: "328px" }}>
                        {/*<Image type="artist" image={{ src: "/main/m_pic_04.jpg", type: "image" }} profile="/common/l_tum_img.jpg" title="Editer Pick" caption="by 보리" resultFunc={() => console.log("IMAGE CLICK")} />*/}
                    </div>
                    <div style={{ width: "328px", height: "328px" }}>
                        <Image type="composite" image={{ src: "/main/m_pic_03.jpg", type: "image" }} title="오구오구\n내아이의 성장사진" caption="내아이의 풀스토리 앨범" />
                    </div>
                    <div style={{ width: "680px", height: "328px" }}>
                        <Image image={{ src: "/main/m_pic_02.jpg", type: "image" }} title="요즘대세'답사고'제안 포즈 촬영" caption="답도없는 사진고자 탈출기" />
                    </div>
                    <div style={{ width: "328px", height: "328px" }}>
                        <Image image={{ src: "/main/m_pic_01.jpg", type: "image" }} title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="image" radius="left" />
                    </div>
                    <div style={{ width: "328px", height: "328px" }}>
                        <Image title="한채아도 찍었던\n셀프웨딩" caption="내 남편은 어디있어? 태어는 났니?" type="text" radius="right" />
                    </div>
                    <hr />
                    <h2>Image Check Component</h2>
                    <hr />
                    <div>
                        <div style={{ width: "90px", height: "90px" }}>
                            <ImageCheck image={{ src: "/main/m_pic_04.jpg", type: "image" }} size="small" checked={this.state.checked1} resultFunc={checked => this.setState({ checked1: checked })} />
                        </div>
                        <div style={{ width: "150px", height: "150px" }}>
                            <ImageCheck image={{ src: "/main/m_pic_04.jpg", type: "image" }} checked={this.state.checked2} resultFunc={checked => this.setState({ checked2: checked })} />
                        </div>
                        <div style={{ width: "250px", height: "250px" }}>
                            <ImageCheck image={{ src: "/main/m_pic_04.jpg", type: "image" }} size="large" checked={this.state.checked3} resultFunc={checked => this.setState({ checked3: checked })} />
                        </div>
                    </div>
                    <hr />
                    <h2>Image Slider Component</h2>
                    {/*
                     <ImageSliderTest images={imageData} type="photo" />
                     <ImageSliderTest images={imageData} type="comment">
                     {
                     imageData.map((obj, idx) =>
                     <ImageCheck image={{ src: obj.src, type: obj.type, photo_no: obj.photo_no }} />
                     )
                     }
                     <ImageCheck image={imageData} />
                     </ImageSliderTest>
                     */}
                    <hr />
                    <div style={{ width: "500px", height: "500px", position: "relative" }}>
                        <ImageSlider data={{ images: imageData, interval: 3000, imageCrop: false, arrow: { posX: 10 }, nav: { position: "bottom" } }} />
                    </div>
                    <div style={{ width: "656px", height: "328px", position: "relative" }}>
                        <ImageSlider data={{ arrow: { position: "top", posX: 10, posY: 10 }, interval: 3000, bgcolor: "transpalent", nav: { position: "bottom", inout: "in" } }}>
                            {componentList}
                        </ImageSlider>
                    </div>
                    <div>
                        <ImageSlider data={{ bgcolor: "transpalent", nav: { position: "bottom", inout: "out" } }}>
                            {[<Img key="img-slider-test-1" image={{ src: "/main/m_top_pic.jpg", type: "image" }} isImageCrop={false} isImageResize isContentResize />]}
                        </ImageSlider>
                    </div>
                    <div style={{ width: "500px", height: "500px", position: "relative" }}>
                        <ImageSlider data={{ images: [{ src: "/main/m_top_pic.jpg", type: "image" }], imageCrop: false, imageResize: true, bgcolor: "transpalent", nav: { position: "bottom", inout: "in" } }} />
                    </div>
                    <h2>FullSlider Test</h2>
                    <hr />
                    {/*<div className="FullSliderTest" onMouseUp={this.fullSlider}>FULL SLIDER TEST</div>*/}
                    {/*<div className="horizontalSlider" onMouseUp={this.horizontalSlider}>horizontalSlider</div>*/}
                </div>
            </div>
        );
    }
}

export default ImagesPage;
