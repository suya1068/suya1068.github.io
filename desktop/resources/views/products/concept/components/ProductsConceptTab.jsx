import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import { CATEGORY, CATEGORY_CODE, BIZ_CATEGORY } from "shared/constant/product.const";

class ProductsConceptTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            biz_category: BIZ_CATEGORY.reduce((r, o) => { if (o !== CATEGORY_CODE.VIDEO_BIZ) r.push(o); return r; }, [])
        };
    }

    render() {
        const { category_code, onSelectTab } = this.props;
        const { biz_category } = this.state;

        return (
            <div className="concept__tab__container">
                <div className="tab__list">
                    {biz_category.map(c => {
                        const category = CATEGORY[c];
                        return (
                            <button key={c} className={classNames("tab__item", { selected: c === category_code })} onClick={() => onSelectTab(c, category.name)}>
                                <div className="category">{category.name}</div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
}

ProductsConceptTab.propTypes = {
    category_code: PropTypes.string,
    onSelectTab: PropTypes.func.isRequired
};

export default ProductsConceptTab;
