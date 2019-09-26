import "babel-polyfill";
import React, { Component, PropTypes } from "react";
import PosterVisual from "./PosterVisual";
import PosterText from "./PosterText";
import "./poster.scss";

const VISUAL_ATTRIBUTE = ["type", "img"];
const TEXT_ATTRIBUTE = ["title", "caption"];

class Poster extends Component {
    constructor() {
        super();

        this.filter = this.filter.bind(this);
    }

    filter(data, names) {
        return Object.entries(data)
            .filter(([key, name]) => names.includes(key))
            .reduce((box, [key, value]) => {
                box[key] = value;
                return box;
            }, {});
    }

    render() {
        const data = this.props.data;

        return (
            <div className="poster">
                <div className="poster-outer">
                    <div className="poster__easel">
                        <PosterVisual data={this.filter(data, VISUAL_ATTRIBUTE)} />
                    </div>
                    <PosterText data={this.filter(data, TEXT_ATTRIBUTE)} />
                </div>
            </div>
        );
    }
}

Poster.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        img: PropTypes.string,
        title: PropTypes.string,
        caption: PropTypes.string
    })
};

export default Poster;
