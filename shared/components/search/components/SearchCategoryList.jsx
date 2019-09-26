import React, { Component, PropTypes } from "react";

import CheckBox from "shared/components/ui/checkbox/CheckBox";

class SearchCategoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
    }

    render() {
        const { data, category, onChange } = this.props;

        if (!Array.isArray(data) || !data.length) {
            return null;
        }

        return (
            <div className="option__content search__count">
                {data.map(c => {
                    const checked = category === c.value;
                    return (
                        <button
                            key={`category_${c.value}`}
                            className="category__item"
                            onClick={() => onChange(!checked ? c.value : "")}
                        >
                            <CheckBox checked={checked}>{c.name} <span>{c.count}</span></CheckBox>
                        </button>
                    );
                })}
            </div>
        );
    }
}

SearchCategoryList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    category: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default SearchCategoryList;
