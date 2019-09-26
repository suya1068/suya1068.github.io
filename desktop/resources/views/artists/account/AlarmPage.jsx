import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";

import Buttons from "desktop/resources/components/button/Buttons";
import Checkbox from "desktop/resources/components/form/Checkbox";
import CheckboxText from "desktop/resources/components/form/CheckboxText";
import PopModal from "shared/components/modal/PopModal";

class AlarmPage extends Component {
    constructor() {
        super();

        this.state = {
            categoryList: [],
            checkList: {},
            isProcess: false
        };

        this.onCheckAll = this.onCheckAll.bind(this);
        this.onCheckAlarm = this.onCheckAlarm.bind(this);
        this.onCheckSave = this.onCheckSave.bind(this);

        this.showProcess = this.showProcess.bind(this);
    }

    componentDidMount() {
        const promise = [];
        const user = auth.getUser();

        if (user) {
            promise.push(API.products.categorys());
            promise.push(API.artists.artistAlarm(user.id));

            Promise.all(promise).then(response => {
                const category = response[0];
                const alarm = response[1];
                const prop = {};

                if (category && alarm && category.status === 200 && alarm.status === 200) {
                    const c = category.data;
                    const a = alarm.data;

                    const _category = c.category.filter(item => {
                        return item.code !== "AD" && item.code !== "VIDEO";
                    });

                    prop.categoryList = _category;
                    // prop.categoryList = c.category;
                    if (a.list) {
                        prop.checkList = a.list.reduce((result, obj) => {
                            result[obj.category] = true;
                            return result;
                        }, {});
                    }
                }

                this.setState(prop);
            });
        } else {
            PopModal.alert("로그인 후 이용해주세요.");
        }
    }

    onCheckAll(b) {
        const { categoryList } = this.state;

        this.setState({
            checkList: categoryList.reduce((result, c) => {
                result[c.code] = b;
                return result;
            }, {})
        });
    }

    onCheckAlarm(value, code) {
        const { checkList } = this.state;

        if (checkList) {
            checkList[code] = value;

            this.setState({
                checkList
            });
        }
    }

    onCheckSave() {
        const user = auth.getUser();
        const { checkList } = this.state;

        if (user) {
            if (!this.showProcess(true)) {
                this.state.isProcess = true;
                const keys = Object.keys(checkList);
                const data = {
                    category: keys.reduce((result, key) => {
                        if (checkList[key]) {
                            result.push(key);
                        }
                        return result;
                    }, []).join(",")
                };

                API.artists.artistSaveAlarm(user.id, data).then(response => {
                    this.showProcess(false);
                    const a = response.data;

                    if (a.list) {
                        this.setState({
                            checkList: a.list.reduce((result, obj) => {
                                result[obj.category] = true;
                                return result;
                            }, {})
                        }, () => {
                            PopModal.toast("알림이 저장되었습니다");
                        });
                    }
                }).catch(error => {
                    this.showProcess(false);
                });
            }
        } else {
            PopModal.alert("로그인 후 이용해주세요.");
        }
    }

    showProcess(b) {
        const { isProcess } = this.state;

        if (b && !this.state.isProcess) {
            this.state.isProcess = true;
            PopModal.progress();
        } else if (!b) {
            this.state.isProcess = false;
            PopModal.closeProgress();
        }

        return isProcess;
    }

    render() {
        const { categoryList, checkList } = this.state;
        let isUnCheck = true;
        let isAllCheck = true;
        const category = categoryList && Array.isArray(categoryList) ?
            categoryList.map(c => {
                const check = !!checkList[c.code];

                if (isUnCheck && check) {
                    isUnCheck = false;
                }

                if (isAllCheck && !check) {
                    isAllCheck = false;
                }

                return (
                    <Checkbox key={`category-item-${c.code}`} checked={check} type="yellow_small" resultFunc={value => this.onCheckAlarm(value, c.code)}>{c.name}</Checkbox>
                );
            }) : null;

        return (
            <div className="artists-page-account artists-alarm">
                <div className="artist-content-row bg-white">
                    <p className="title sub">촬영요청 문자알림 설정</p>
                    <p className="content">알림을 설정하면 해당 카테고리의 촬영 요청서 등록 시 실시간으로 문자가 전송됩니다. (23시~08시 등록건은 08시 일괄발송)</p>
                </div>
                <div className="artist-content-row">
                    <div className="content-columns full-columns">
                        <span className="title">알림을 원하는 카테고리를 선택해 주세요.</span>
                        <p className="content">
                            <CheckboxText checked={isAllCheck} resultFunc={() => this.onCheckAll(true)}>모두선택</CheckboxText>
                            <CheckboxText checked={isUnCheck} resultFunc={() => this.onCheckAll(false)}>모두해제</CheckboxText>
                        </p>
                    </div>
                    <div className="artist-content-row bg-white">
                        <p className="content category-list">
                            {category}
                        </p>
                    </div>
                </div>
                <div className="artist-content-row text-center">
                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.onCheckSave }}>저장하기</Buttons>
                </div>
            </div>
        );
    }
}

export default AlarmPage;
