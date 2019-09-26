import React, { Component, PropTypes } from "react";

class ColumnHeader extends Component {
    render() {
        return (
            <div className="list__item">
                <div className="list__item__title notice__column">
                    <div className="date">
                        전달일자
                    </div>
                    <div className="nickname">
                        고객이름
                    </div>
                    <div className="category">
                        카테고리
                    </div>
                    <div className="price">
                        견적가(단위/원)
                    </div>
                    <div className="status">
                        진행상태
                    </div>
                </div>
            </div>
        );
    }
}

export default ColumnHeader;
