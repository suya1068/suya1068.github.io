import React, { Component, PropTypes } from "react";

import Input from "desktop/resources/components/form/Input";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";

class LicenseePage extends Component {
    constructor(props) {
        super(props);

        const d = new Date();

        this.state = {
            text: "",
            list: [],
            display_list: [],
            date: "",
            content: "",
            user: auth.getUser(),
            isLoading: false,
            doYear: d.getFullYear(),
            doMonth: d.getMonth() + 1,
            isSection: false,
            isSave: false
        };
        this.getMyCareer = this.getMyCareer.bind(this);
        this.changeText = this.changeText.bind(this);
        this.addCareer = this.addCareer.bind(this);
        this.deleteCareer = this.deleteCareer.bind(this);
        this.onDateBlur = this.onDateBlur.bind(this);

        this.beforeunLoad = this.beforeunLoad.bind(this);
    }

    componentWillMount() {
        // this.addCareer();
    }

    componentDidMount() {
        const id = this.state.user && this.state.user.id;
        if (!id) {
            PopModal.alert("정보를 불러오는 중 오류가 발생하였습니다. 다시 시도해주세요.", { callBack: () => { location.href = "/artists"; } });
        } else {
            this.props.router.setRouteLeaveHook(this.props.route, () => {
                const { isSave } = this.state;
                let str;
                if (!isSave) {
                    str = "페이지를 벗어나면 변경된 내용이 저장되지 않을 수 있습니다.";
                }
                return str;
            });
            window.addEventListener("beforeunload", this.beforeunLoad);
            this.getMyCareer(id);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.beforeunLoad);
    }

    /**
     * 작가소개 경력사항 입력 state 에 저장
     */
    onChange(e, type, value) {
        // if (type === "content" && !this.state.isSection) {
        //     this.setState({
        //         [type]: ""
        //     });
        // } else {
        //     this.setState({
        //         [type]: value
        //     });
        // }

        this.setState({
            [type]: value
        });
    }

    /**
     * 경력 년,월 입력 후 vaildation
     */
    onDateBlur() {
        const { date } = this.state;
        let fillDate = date;
        if (date.length > 4) {
            const year = date.substr(0, 4);
            let month = date.substr(4);
            if (month.length === 1) {
                month = utils.fillSpace(month, 2, "0");
                fillDate = `${year}${month}`;
            }
        }

        this.setState({
            date: fillDate
        });
        // let flag = false;
        // if (date.length > 4) {
        //     const doMount
        // }
        // this.setState({
        //     isSection: flag
        // });
    }

    /**
     * 작가 경력내역을 불러온다.
     * @param id
     */
    getMyCareer(id) {
        const request = API.artists.getAritstsIntro(id);
        request.then(response => {
            const data = response.data;
            const career = this.composeList(data.career);
            const intro = data.intro;
            // const career = null;
            // const intro = null;

            this.setState({
                list: career || [],
                text: intro || "",
                // list: career || [],
                // text: intro || "",
                isLoading: true
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    beforeunLoad(e) {
        const { isSave } = this.state;
        if (!isSave) {
            e.returnValue = "페이지를 벗어나면 변경된 내용이 저장되지 않을 수 있습니다.";
        }
    }

    changeText(e) {
        const current = e.currentTarget;
        const value = current.value;
        const maxLength = current.getAttribute("maxLength");

        if (value && maxLength && value.length > maxLength) {
            return;
        }

        this.setState({
            text: value
        });
    }

    addCareer(date, content) {
        const { list, doYear, doMonth } = this.state;
        const dateCheck = d => {
            let flag = false;
            const year = date.substr(0, 4);
            const month = date.substr(4);
            const doDay = doYear.toString() + doMonth.toString();
            if (year < 1900 || year > doYear) {
                PopModal.toast("기간을 확인해주세요.");
            } else if (month < 1 || month > 12) {
                PopModal.toast("기간을 확인해주세요.");
            } else if (date > doDay) {
                PopModal.toast("경력기간을 확인해주세요.");
            } else {
                flag = true;
            }
            return flag;
        };

        if (!date && !content) {
            PopModal.toast("날짜와 내용을 입력해주세요.");
        } else if (!date) {
            PopModal.toast("날짜를 입력해주세요.");
        } else if (!content) {
            if (date.length < 5) {
                PopModal.toast("기간을 확인해주세요.");
            } else if (date.length === 6 && dateCheck(date)) {
                PopModal.toast("내용을 입력해주세요.");
            }
        } else if (utils.isValidDomain(content)) {
            PopModal.toast("보안상 안전하지 않은 문자가 있어 처리할 수 없습니다.");
        } else if (date.length > 0 && date.length < 6) {
            PopModal.toast("기간을 확인해주세요.");
        } else if (date.length > 5) {
            if (dateCheck(date)) {
                list.push({ date, content });
                const _list = this.careerSort(list);

                this.setState({
                    list: _list,
                    date: "",
                    content: ""
                });
            }
        }
    }

    deleteCareer(index) {
        const { list } = this.state;

        list.splice(index, 1);
        this.setState({
            list
        });
    }

    careerSort(list) {
        if (list.length > 1) {
            const sortFeild = "date";
            const sorting = list.sort((a, b) => {
                return a[sortFeild] - b[sortFeild];
            });
            return sorting;
        }
        return list;
    }

    apiCareerSave(text, list, user) {
        if (text === "") {
            PopModal.toast("상세소개를 작성해주세요.");
        } else if (utils.isValidDomain(text)) {
            PopModal.toast("보안상 안전하지 않은 문자가 있어 처리할 수 없습니다.");
        } else {
            const _list = list.filter(item => {
                const s = item.content.split("");
                const o = s.filter(c => { return c !== " "; }).join("");

                return o !== "포스냅가입";
            });
            const carreData = {
                intro: text,
                career: _list
            };
            const request = API.artists.updateAritstsIntro(user.id, { ...carreData });
            request.then(response => {
                const data = response.data;
                this.setState({
                    text: data.intro,
                    list: this.composeList(data.career),
                    // intro: data.intro,
                    // career: data.career,
                    isSave: true
                }, () => {
                    PopModal.toast("저장되었습니다.");
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    composeList(list) {
        if (utils.isArray(list) && list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                if (list[i].content === "포스냅 가입") {
                    list[i].default = true;
                } else {
                    list[i].default = false;
                }
            }
        }
        return list;
    }

    combineDate(date) {
        let changeDate = date.toString();
        let year;
        let month;
        if (date.length > 4) {
            year = changeDate.substr(0, 4);
            month = changeDate.substr(4);
            changeDate = `${year}.${month}`;
        }

        return changeDate;
    }

    render() {
        const { text, content, list, date, user, isLoading } = this.state;

        if (!isLoading) {
            return null;
        }

        return (
            <div className="artists-page-account">
                <div className="artist-content-row text-center" style={{ borderBottom: "none" }}>
                    <h1 className="h4-sub"><strong>작가 소개</strong></h1>
                    <p className="content" style={{ paddingTop: 10, fontSize: 14 }}>
                        <strong style={{ fontSize: 16, color: "#000" }}>작가페이지 및 견적서에 소개되는 내용입니다.</strong><br />
                        실제 진행하신 촬영이나 작업을 등록해주세요. 허위사실 등록으로 인한 피해는 포스냅에서 책임지지 않습니다.
                    </p>
                </div>
                <div className="artist-content-row">
                    <div className="content-columns">
                        <span className="title">상세소개</span>
                        <textarea
                            className="textarea product-edit-textarea option-name"
                            placeholder="스튜디오명, 연락처, 사이트주소, 외부아이디(카카오톡,인스타그램 등) 등을 노출하는 경우 해당 내역 삭제 및 서비스 이용에 즉각 제제를 받을 수 있습니다."
                            maxLength="800"
                            value={text}
                            onChange={e => this.changeText(e)}
                        />
                        <span className="text-count">{text.length}/800</span>
                        <span className="caption">고객에게 소개할 수 있는 공간입니다.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">경력사항</span>
                        <Input
                            inputStyle={{ size: "small", width: "w105" }}
                            type="number"
                            inline={{ value: this.combineDate(date), className: "text-center", placeholder: "yyyy.mm", maxLength: 7, onBlur: this.onDateBlur, onChange: (e, value) => this.onChange(e, "date", value) }}
                        />
                        <Input
                            inputStyle={{ size: "small", width: "w520" }}
                            inline={{ value: content, maxLength: 40, className: "career-input", placeholder: "내용을 입력해주세요.", onFocus: this.onFocus, onChange: (e, value) => this.onChange(e, "content", value) }}
                        />
                        <Buttons buttonStyle={{ width: "w83", size: "small", shape: "circle", theme: "default" }} inline={{ onClick: () => this.addCareer(date, content) }}>추가</Buttons>
                        <div className="input-text-count">
                            <p className="current-count">{content.length}</p>
                            <p className="max-count">40</p>
                        </div>
                    </div>
                    {list.map((obj, i) => {
                        const year = obj.date.substr(0, 4);
                        const month = obj.date.substr(4);
                        const changeDate = `${year}.${month}`;
                        return [
                            <div className="content-columns">
                                <span className="title">{""}</span>
                                <Input inputStyle={{ size: "small", width: "w105" }} disabled="disabled" type="number" inline={{ value: changeDate, className: "text-center", placeholder: "yyyy.mm", maxLength: 6 }} />
                                <Input inputStyle={{ size: "small", width: "w520" }} disabled="disabled" inline={{ value: obj.content, placeholder: "내용을 입력해주세요." }} />
                                {!obj.default ?
                                    <Buttons
                                        buttonStyle={{ width: "w83", size: "small", shape: "circle", theme: "gray" }}
                                        inline={{ onClick: () => this.deleteCareer(i) }}
                                    >삭제</Buttons> : null
                                }
                            </div>
                        ];
                    })}
                </div>
                <div className="artist-content-row text-center">
                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: () => this.apiCareerSave(text, list, user) }}>저장하기</Buttons>
                </div>
            </div>
        );
    }
}

export default LicenseePage;
