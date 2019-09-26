import React, { Component, PropTypes } from "react";
import SNSSync from "./SocialSync";
import "./sns_sync_list.scss";

class SocialSyncList extends Component {
    render() {
        const count = this.props.data.reduce((result, obj) => {
            if (obj.sync) {
                result += 1;
            }
            return result;
        }, 0);

        return (
            <div className="social-sync-buttons">
                {this.props.join_type === "email" ?
                    <div>
                        <i className="social__icon__email" />
                        <span className="active">이메일</span>
                        <button className="button button__theme__yellow">가입완료</button>
                    </div>
                    : null
                }
                {this.props.data.map(obj => {
                    return <SNSSync key={obj.name} type={obj.name} click={obj.click} sync={obj.sync} count={count} join_type={this.props.join_type} />;
                })}
            </div>
        );
    }
}

/**
 *
 * @data [{name: social name, sync: true or false, click: function}]
 */
SocialSyncList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    join_type: PropTypes.string
};

export default SocialSyncList;
