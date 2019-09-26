import React, { Component, PropTypes } from "react";

// child component
import LikeItem from "../item/LikeItem";

export default class LikeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            onRemoveLike: props.onRemoveLike,
            onMoveLike: props.onMoveLike
        };
    }

    render() {
        const { list, onRemoveLike, onMoveLike } = this.props;
        return (
            <div className="users-like__list">
                {list.map((obj, idx) => {
                    return (
                        <LikeItem
                            data={obj}
                            index={idx}
                            onMoveLike={onMoveLike}
                            onRemoveLike={onRemoveLike}
                            key={`users-like__item-${idx}`}
                        />
                    );
                })}
            </div>
        );
    }
}


LikeList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    onMoveLike: PropTypes.func.isRequired,
    onRemoveLike: PropTypes.func.isRequired
};

LikeList.defaultProps = {
    list: []
};

