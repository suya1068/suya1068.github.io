import "../scss/hashtag_list.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import A from "shared/components/link/A";

class HashtagList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };

        this.gaEvent = this.gaEvent.bind(this);
    }

    gaEvent(tag) {
        utils.ad.gaEvent("M_공통", "추천_키워드검색", tag);
    }

    render() {
        const { data } = this.state;

        return (
            <div className="header__search__keyword">
                <ul>
                    {utils.isArray(data.list) ?
                        data.list.map((obj, i) => {
                            return (
                                <li key={`search-hashtag-${i}`}>
                                    <A role="button" href={`/products?tag=${obj}`} onClick={() => this.gaEvent(obj)}>{obj}</A>
                                </li>
                            );
                        }) : null
                    }
                </ul>
            </div>
        );
    }
}

HashtagList.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default HashtagList;
