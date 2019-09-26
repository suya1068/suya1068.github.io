import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import FileList from "./components/FileList";

class ConsultDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { data } = this.props;

        return (
            <div className="outside__consult__detail">
                <div className="consult__row">
                    <div className="title"><span>고객정보</span></div>
                    <table className="fixed">
                        <colgroup>
                            <col width="15%" />
                            <col width="35%" />
                            <col width="15%" />
                            <col width="35%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>고객명</th>
                                <td>{data.user_name}</td>
                                <th>휴대폰 번호</th>
                                <td>{data.user_phone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="consult__row trans">
                    <div className="title trans"><span>파일 첨부</span></div>
                    <FileList advice_order_no={data.advice_order_no} attach={data.attach} upload_info={data.upload_info} />
                </div>
            </div>
        );
    }
}

ConsultDetail.propTypes = {
    data: PropTypes.shape({
        advice_order_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        attach: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
        category: PropTypes.string,
        counsel_time: PropTypes.string,
        user_email: PropTypes.string,
        user_id: PropTypes.string,
        user_name: PropTypes.string,
        user_phone: PropTypes.string,
        upload_info: PropTypes.shape([PropTypes.node])
    })
};
ConsultDetail.defaultProps = {};

export default ConsultDetail;
