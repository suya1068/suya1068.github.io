import React, { Component, PropTypes } from "react";

class ProductsConceptSearch extends Component {
    createButton(title, selected, callback) {
        return (
            <button key={title} className={selected ? "selected" : ""} onClick={callback}>
                <img alt="ic" src={`${__SERVER__.img}/common/icon/check_${selected ? "white" : "gray"}.png`} />
                <span>{title}</span>
            </button>
        );
    }

    render() {
        const { data, recommend_list, select, recommend, onSelectDepth, onSelectRecommend } = this.props;

        return (
            <div className="concept__search__container">
                <div className="concept__search__box">
                    <div className="search__depth">
                        {data.map(o => {
                            return (
                                <div key={o.concept_no} className="depth__item">
                                    <div className="concept__label">{o.depth1}</div>
                                    <div className="concept__buttons">
                                        {o.depth2.map(depth => {
                                            const selected = select[o.depth1] || [];
                                            return this.createButton(depth, selected.includes(depth), () => onSelectDepth(o.depth1, depth));
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="search__recommend">
                        <div className="concept__label">추천컨셉</div>
                        <div className="concept__buttons">
                            {Object.keys(recommend_list).map((key, i) => {
                                const obj = recommend_list[key];
                                const selected = recommend === key;
                                return [i > 0 && i % 2 === 0 ? <br /> : null, this.createButton(obj.title, selected, () => onSelectRecommend(key, obj.depth2))];
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProductsConceptSearch.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        concept_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        depth1: PropTypes.string,
        depth2: PropTypes.arrayOf(PropTypes.string)
    })),
    recommend_list: PropTypes.shape([PropTypes.node]),
    select: PropTypes.shape([PropTypes.node]),
    recommend: PropTypes.string,
    onSelectDepth: PropTypes.func.isRequired,
    onSelectRecommend: PropTypes.func.isRequired
};

export default ProductsConceptSearch;
