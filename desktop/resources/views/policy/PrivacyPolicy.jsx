import React from "react";
import "../../components/table/table.scss";
import { navUrlData, policyClasses } from "./policy_config";


class PrivacyPolicy extends React.Component {
    render() {
        return (
            <div className="container">
                <section className="site_main__index">
                    <h5>포스냅 개인정보 취급방침</h5>
                    <ol className="site_main__list">
                        <li>수집하는 개인정보의 형식</li>
                        <li>개인정보 수집 방법</li>
                        <li>개인정보 수집 및 이용 목적</li>
                        <li>개인정보의 공유 및 제공</li>
                        <li>이용자 및 법정대리인의 권리와 그 행사방법</li>
                        <li>개인정보 자동 수집 장치의 설치 / 운영 및 거부에 관한 사항</li>
                        <li>개인정보 보유 및 이용기간</li>
                        <li>개인정보 파기절차 및 방법</li>
                        <li>개인정보 관리책임자</li>
                        <li>개인정보취급방침의 개정 공고일자, 시행일자(7일차)</li>
                    </ol>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>1.수집하는 개인정보의 형식</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                포스냅 이용을 위해 개인정보의 수집이 필요합니다. 수집되는 개인정보는 다음과 같으며 사용자 동의후 수집됩니다.<br />
                                계정 정보: 이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지<br />
                                모바일 결제 정보: 성공한 결제 내역 정보<br />
                                웹 결제 정보: 계약된 PG사에 전달된 결제 정보<br />
                                로그 데이터: IP정보, 디바이스 또는 브라우저 정보, 조회된 도메인, 방문 웹페이지, 이용 통신사 구분, 이용 기록, 불량 이용 기록<br />
                                SNS 연동 정보: SNS에서 제공하는 사용자의 계정 정보와 친구 관계 정보 등 연동되는 SNS에서 허용하는 모든 정보 (지원 SNS는 운영에 따라 변경 가능합니다.)
                                </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>2.개인정보 수집 방법</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                사용자가 직접 입력하거나 이용 과정에서 수집되며 SNS와 같은 연계 서비스로부터 전달받기도 합니다.<br />
                                그리고 서비스 개선과 사용자 반응 파악을 위한 이용 통계 수집 툴에서 수집되기도 합니다.<br />
                                또한 전자메일/전화번호 등의 정보를 취득하는 경우가 있습니다.<br />
                                이 정보는 고객님께서 보다 풍부한 이벤트와 서비스를 이용하시기 위한 목적 및 본 서비스를 원활하게 이용하도록 하기 위한 목적으로만 사용 됩니다.<br />
                                또한 본 서비스에 있어 유료 서비스를 이용하기 위한 목적과 고객님의 유료 서비스 이용 오류 및 체납 등에 기인하여 이용료 회수 또는 환불처리 목적으로만 사용됩니다.
                            </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>3.개인정보 수집 및 이용 목적</h6>
                        <div className={policyClasses.panelBody}>
                            <p>포스냅의 원활한 이용을 위해 개인정보를 수집합니다. 세부적인 이용 목적은 다음과 같습니다.</p>
                            <ul className={policyClasses.panelBodyList}>
                                <li>본인 확인과 부정 이용 방지를 위해</li>
                                <li>서비스 이용 문의 응대를 위해</li>
                                <li>이용 현황 파악을 위한 통계 데이터 축적을 위해</li>
                                <li>캠페인 이벤트 등 추천 선물 발송을 위해</li>
                                <li>중요 공지사항의 전달을 위해</li>
                                <li>이벤트와 광고 전달을 위해</li>
                                <li>유료 이용 시 전송, 배송, 요금 정산을 위해</li>
                                <li>새로운 상품 추천을 위해</li>
                            </ul>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>4.개인정보 공유 및 제공</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                개인정보는 제3자에게 제공되지 않습니다. 하지만 포스냅과 연계된 서비스 또는 결제와 같이 제3자의 응대가 필요한 경우, 동의를 통해 개인정보가 전달 될 수도 있습니다.<br />
                                개인정보는 서비스 이용 완료 또는 고객 응대 후 파기됩니다.
                            </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>5.이용지 및 법정대리인의 권리와 그 행사방법</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                이용자 및 만 14세 미만의 사용자의 경우 법정 대리인은 개인정보의 조회, 수정 및 계정 삭제가 가능합니다. &#34;설정 &#8250; 계정삭제&#34;를 통해 직접 열람, 정정 또는 탈퇴가 가능합니다.
                            </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>6.개인정보 자동 수집 장치의 설치 / 운영 및 거부에 관한 사항</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                PC기반 포스냅 서비스 제공을 위해 쿠키를 생성하여 사용자의 저장 장치에 저장하기도합니다.<br />
                                쿠키는 이용자들의 사용 행태를 파악하여 이용자들에게 최적화된 정보 제공을 위해 사용합니다.<br />
                                쿠키 설정에 대해서 사용 하시는 브라우저의 설정에서 쿠키의 확인, 저장, 거정 등을 설정 할 수 있고 저장 거부시 로그인 등에 어려움이 발생 할 수도있습니다.
                            </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>7.개인정보 보유 및 이용기간</h6>
                        <div className={policyClasses.panelBody}>
                            <p>
                                이용 목적을 위해 한시적으로 보유하고 목적 달성시 개인정보는 파기됩니다.
                                하지만 관계 법령 등으로 보존 필요가 있는 경우 일정 기간 보관합니다.
                            </p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>8.개인정보 파기절차 및 방법</h6>
                        <div className={policyClasses.panelBody}>
                            <p>종이에 인쇄된 경우 분쇄 또는 소각으로 파기하며 전자적 파일의 경우 기술적으로 파기됩니다.</p>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>9.개인정보 관리책임자</h6>
                        <div className={policyClasses.panelBody}>
                            <table className="table">
                                <thead>
                                    <tr key="0">
                                        <th>이름</th>
                                        <th>소속</th>
                                        <th>직위</th>
                                        <th>연락처</th>
                                        <th>이메일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key="1">
                                        <td>박현철</td>
                                        <td>포스냅</td>
                                        <td>대표</td>
                                        <td>070-4060-4406</td>
                                        <td>hcpark@forsnap.com</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section className={policyClasses.panel}>
                        <h6 className={policyClasses.panelHeading}>10.개인정보취급방침의 개정 공고일자, 시행일자(7일차)</h6>
                        <div className={policyClasses.panelBody}>
                            <ul className={policyClasses.panelBodyList}>
                                <li>개인정보취급방침은 더욱 편리한 서비스 제공을 위해 변경 가능합니다.</li>
                                <li>중요한 변경사항이 있을 때에는 알기 쉬운 방법으로 개정 전에 이용자에게 개정 내용을 공지합니다.</li>
                                <li>공고일자: 2017년 2월 11일</li>
                            </ul>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default PrivacyPolicy;
