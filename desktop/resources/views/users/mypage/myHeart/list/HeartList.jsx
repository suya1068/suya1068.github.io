import React, { Component, PropTypes } from "react";
import HeartItem from "../item/HeartItem";

export default class HeartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            total_count: props.total_count,
            onRemoveLike: props.onMore,
            onMoveLike: props.onDelete
        };
    }

    render() {
        const { onMoveLike, onRemoveLike, list, total_count } = this.props;

        return (
            <div className="myHeart" key="hear-list">
                <div className="myHeart__title">
                    <p className="h5 text-bold">내하트 목록 <span className="listCnt">{total_count}</span></p>
                </div>
                <div className="myHeart__list">
                    {list.map((item, idx) => {
                        return (
                            <HeartItem
                                data={item}
                                index={idx}
                                onMoveLike={onMoveLike}
                                onRemoveLike={onRemoveLike}
                                key={`users-like__item-${idx}`}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

HeartList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    total_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onRemoveLike: PropTypes.func.isRequired,
    onMoveLike: PropTypes.func.isRequired
};
