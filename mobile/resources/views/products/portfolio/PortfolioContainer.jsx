import "./PortfolioContainer.scss";
import React, { Component, PropTypes } from "react";

import PortfolioList from "./component/PortfolioList";
import PortfolioThumbList from "./component/PortfolioThumbList";
import PortfolioInformation from "./component/PortfolioInformation";

class PortfolioContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            index: props.index || 0,
            toggle: true
        };

        this.onIndex = this.onIndex.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onClick = this.onClick.bind(this);

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

    onClick() {
        this.setStateData(state => {
            return {
                toggle: !state.toggle
            };
        });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { images, videos, information } = this.props;
        const { index, toggle } = this.state;

        return (
            <div className="products__portfolio__container">
                <div className="products__portfolio__list">
                    <PortfolioList
                        images={images}
                        videos={videos}
                        index={index}
                        onIndex={this.onIndex}
                        onLoad={this.onLoad}
                        onClick={this.onClick}
                    />
                </div>
                <div className="products__portfolio__thumb">
                    <PortfolioThumbList
                        images={images}
                        videos={videos}
                        index={index}
                        toggle={toggle}
                        onIndex={this.onIndex}
                        ref={ref => (this.refThumb = ref)}
                    />
                </div>
                <div className="products__portfolio__information">
                    <PortfolioInformation data={information} toggle={toggle} />
                </div>
            </div>
        );
    }
}

PortfolioContainer.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    videos: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    information: PropTypes.shape([PropTypes.node]),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PortfolioContainer;
