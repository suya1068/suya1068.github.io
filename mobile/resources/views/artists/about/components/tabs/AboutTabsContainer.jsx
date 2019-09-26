import "./aboutTabsContainer.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
// import utils from "forsnap-utils";
import Review from "./review/Review";
import Product from "./product/Product";
import OutsideReview from "./outside_review/OutsideReview";

const TABS = {
    PRODUCT: "product",
    REVIEW: "review",
    OUTSIDEREVIEW: "outsideReview"
};

export default class AboutTabsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: TABS.PRODUCT
        };

        this.onSelectTabs = this.onSelectTabs.bind(this);
        this.onSwitchTabs = this.onSwitchTabs.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {}

    onSelectTabs(tab) {
        this.setState({
            tab
        });
    }

    onSwitchTabs() {
        const { data, getArtistAbout } = this.props;
        const { outsideReviewData, reviewData, productData, artist_id } = data;
        const { tab } = this.state;

        switch (tab) {
            case TABS.PRODUCT: return <Product {...productData} />;
            case TABS.REVIEW: return <Review {...reviewData} artist_id={artist_id} getArtistAbout={getArtistAbout} />;
            case TABS.OUTSIDEREVIEW: return <OutsideReview {...outsideReviewData} />;
            default:
        }
        return null;
    }

    isTabActive(selectTab) {
        const { tab } = this.state;
        return tab === selectTab;
    }

    render() {
        return (
            <section className="aboutTabs-container">
                <div className="aboutTabs-tabs">
                    <div className={classNames("tabs", { "active": this.isTabActive(TABS.PRODUCT) })} onClick={() => this.onSelectTabs(TABS.PRODUCT)}>등록상품</div>
                    <div className={classNames("tabs", { "active": this.isTabActive(TABS.REVIEW) })} onClick={() => this.onSelectTabs(TABS.REVIEW)}>촬영후기</div>
                    <div
                        className={classNames("tabs", { "active": this.isTabActive(TABS.OUTSIDEREVIEW) })}
                        onClick={() => this.onSelectTabs(TABS.OUTSIDEREVIEW)}
                    >경력사항</div>
                </div>
                {this.onSwitchTabs()}
            </section>
        );
    }
}
