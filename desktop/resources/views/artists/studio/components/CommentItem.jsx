import "../scss/comment_item.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import Img from "shared/components/image/Img";

class CommentItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { comment_no, profile_img, nick_name, manager_id, comment, reg_dt } = this.props.data;

        return (
            <div className="comment__item">
                <div className="comment__item__profile">
                    {manager_id ?
                        <Img image={{ src: "/common/default_profile_blue.jpg", type: "image", default: "/common/default_profile_img.jpg" }} />
                        : <Img image={{ src: profile_img, default: "/common/default_profile_img.jpg" }} />
                    }
                </div>
                <div className="comment__item__info">
                    <div className="name">
                        {nick_name || manager_id}
                    </div>
                    <div className="content">
                        {utils.linebreak(comment)}
                    </div>
                    <div className="date">
                        {reg_dt}
                    </div>
                </div>
            </div>
        );
    }
}

CommentItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default CommentItem;
