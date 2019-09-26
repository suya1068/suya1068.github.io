import "./tyep.scss";
import React, { Component } from "react";
// import Img from "shared/components/image/Img";
import utils from "forsnap-utils";

export default class Type extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            width: props.width,
            height: props.height,
            button_pa: props.button_pa,
            onConsult: props.onConsult,
            main: props.main
        };
    }

    componentWillMount() {
    }

    render() {
        const { data, width, height, button_pa, onConsult, main } = this.props;
        return (
            <div className="wide-screen__test_banner" style={{ width, height }}>
                {/*<Img image={{ src: data.src, type: "image" }} />*/}
                <img src={`${__SERVER__.img}/${data.src}`} role="presentation" style={{ width: "100%", height: "100%" }} />
                <div className="wide-screen__test_banner__wrapper">
                    <div className="wrapper-text" style={{ top: main && 60 }}>
                        <p className="title" style={{ fontSize: main ? 24 : data.title_size }}>{`${data.title}촬영`}</p>
                        <p className="desc">{utils.linebreak(main ? data.main_desc : data.desc)}</p>
                    </div>
                    <p className="artist">{`by ${data.artist}`}</p>
                </div>
                <div className="test-banner" style={{ width: `calc(100% - ${button_pa * 2}px)`, fontSize: data.btn_font_size }} onClick={() => onConsult(data)}>
                    <button className="_button _button__block" style={{ backgroundColor: data.button_color }}>{data.button}</button>
                </div>
            </div>
        );
    }
}
