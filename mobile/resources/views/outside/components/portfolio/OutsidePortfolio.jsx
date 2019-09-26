import React, { Component, PropTypes } from "react";

import PortfolioList from "./components/PortfolioList";
import PortfolioThumbList from "./components/PortfolioThumbList";

class OutsidePortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            index: 0
        };

        this.onIndex = this.onIndex.bind(this);
        this.onLoad = this.onLoad.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    onIndex(index) {
        this.setStateData(() => {
            return {
                index
            };
        });
    }

    onLoad(no, src) {
        if (this.refThumb) {
            this.refThumb.onLoad(no, src);
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { images, videos } = this.props;
        const { index } = this.state;

        return (
            <div className="outside__portfolio__container">
                <div className="outside__portfolio__list">
                    <PortfolioList
                        images={images}
                        videos={videos}
                        index={index}
                        onIndex={this.onIndex}
                        onLoad={this.onLoad}
                    />
                </div>
                <div className="outside__portfolio__thumb">
                    <PortfolioThumbList
                        images={images}
                        videos={videos}
                        index={index}
                        onIndex={this.onIndex}
                        ref={ref => (this.refThumb = ref)}
                    />
                </div>
            </div>
        );
    }
}

OutsidePortfolio.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    videos: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default OutsidePortfolio;
