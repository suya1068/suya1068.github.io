import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import Input, { classSize, classWidth, classTheme } from "desktop/resources/components/form/Input";
import Checkbox from "desktop/resources/components/form/Checkbox";
import CheckboxText from "desktop/resources/components/form/CheckboxText";
import RadioGroup from "desktop/resources/components/form/RadioGroup";
import Dropdown from "desktop/resources/components/form/Dropdown";
import Heart from "desktop/resources/components/form/Heart";
import Qty from "desktop/resources/components/form/Qty";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import Buttons from "desktop/resources/components/button/Buttons";
import Badge from "desktop/resources/components/form/Badge";
import Breadcrumb from "desktop/resources/components/form/Breadcrumb";
import NotifyMenu from "desktop/resources/components/notify/NotifyMenu";
import Accordion from "desktop/resources/components/form/Accordion";

import "desktop/resources/components/form/form.scss";

//* 더미 데이터
const accordionData = [
    {
        title: "Q. 포스냅은 무엇을 하는 곳인가요?",
        content: "포스냅은 웹상에서 사진작가와 고객을 연결하는 서비스를 제공합니다.\n"
        + "회원 가입과 작가로 등록하기는 무료이며, SNS계정을 통해 손쉽게 가입할 수 있습니다.\n"
        + "작가로 등록된 회원은 본인의 사진으로 자유롭게 상품을 구성할 수 있습니다.",
        value: 1
    },
    {
        title: "Q. 포스냅은 무엇을 하는 곳인가요?",
        content: "포스냅은 웹상에서 사진작가와 고객을 연결하는 서비스를 제공합니다.\n"
        + "회원 가입과 작가로 등록하기는 무료이며, SNS계정을 통해 손쉽게 가입할 수 있습니다.\n"
        + "작가로 등록된 회원은 본인의 사진으로 자유롭게 상품을 구성할 수 있습니다.",
        value: 2
    },
    {
        title: "Q. 포스냅은 무엇을 하는 곳인가요?",
        content: "포스냅은 웹상에서 사진작가와 고객을 연결하는 서비스를 제공합니다.\n"
        + "회원 가입과 작가로 등록하기는 무료이며, SNS계정을 통해 손쉽게 가입할 수 있습니다.\n"
        + "작가로 등록된 회원은 본인의 사진으로 자유롭게 상품을 구성할 수 있습니다.",
        value: 3
    },
    {
        title: "Q. 포스냅은 무엇을 하는 곳인가요?",
        content: "포스냅은 웹상에서 사진작가와 고객을 연결하는 서비스를 제공합니다.\n"
        + "회원 가입과 작가로 등록하기는 무료이며, SNS계정을 통해 손쉽게 가입할 수 있습니다.\n"
        + "작가로 등록된 회원은 본인의 사진으로 자유롭게 상품을 구성할 수 있습니다.",
        value: 4
    },
    {
        title: "Q. 포스냅은 무엇을 하는 곳인가요?",
        content: "포스냅은 웹상에서 사진작가와 고객을 연결하는 서비스를 제공합니다.\n"
        + "회원 가입과 작가로 등록하기는 무료이며, SNS계정을 통해 손쉽게 가입할 수 있습니다.\n"
        + "작가로 등록된 회원은 본인의 사진으로 자유롭게 상품을 구성할 수 있습니다.",
        value: 5
    }
];

const radioData = [
    { name: "이용문의", value: "question", checked: "", disabled: "" },
    { name: "오류문의", value: "error", checked: "", disabled: "disabled" },
    { name: "기타", value: "etc", checked: "", disabled: "" }
];

const popButtonData = [
    { title: "button1", resultFunc: () => console.log("BUTTON 1") },
    { title: "button2button2", resultFunc: () => console.log("BUTTON 2") },
    { title: "button3", resultFunc: () => console.log("BUTTON 3") },
    { title: "button4button4button4", resultFunc: () => console.log("BUTTON 4") },
    { title: "button5", resultFunc: () => console.log("BUTTON 5") }
];

const dropDownData = [
    { value: "a", name: "ㄱ 1번", caption: "99999999" },
    { value: "b", name: "ㄴ 2번", caption: "99999999" },
    { value: "c", name: "ㄷ 3번", caption: "99999999" },
    { value: "d", name: "ㄹ 4번", caption: "99999999" },
    { value: "e", name: "ㅁ 5번", caption: "99999999" },
    { value: "f", name: "ㅁ 6번", caption: "99999999" },
    { value: "g", name: "ㅁ 7번", caption: "99999999" },
    { value: "h", name: "ㅁ 8번", caption: "99999999" },
    { value: "i", name: "ㅁ 9번", caption: "99999999" },
    { value: "j", name: "ㅁ 10번", caption: "99999999" }
];

/**
 * 폼 데모 페이지
 */
class ElementsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
            heartCount: 0
        };

        this.resultValue = this.resultValue.bind(this);
        this.firstCheck = this.firstCheck.bind(this);
        this.secondCheck = this.secondCheck.bind(this);
        this.thirdCheck = this.thirdCheck.bind(this);
        this.resultRadio = this.resultRadio.bind(this);
        this.resultHeart = this.resultHeart.bind(this);
    }

    componentWillMount() {
    }

    resultValue(value) {
        const str = "INPUT VALUE : ";
        console.log(str + value);
    }

    firstCheck(isChecked) {
        const str = "FIRST IS CHECKED : ";
        console.log(str + isChecked);
    }

    secondCheck(isChecked) {
        const str = "SECOND IS CHECKED : ";
        console.log(str + isChecked);
    }

    thirdCheck(isChecked) {
        const str = "THIRD IS CHECKED : ";
        console.log(str + isChecked);
    }

    resultRadio(value) {
        const str = "RADIO VALUE : ";
        console.log(str + value);
    }

    resultHeart(count) {
        this.setState({
            heartCount: count
        });
    }

    render() {
        const popContent = <Icon name="chat" />;
        const popButton = (
            <PopDownContent target={popContent} align="left" key="pop-button">
                <div className="buttons-content">
                    {popButtonData.map((obj, i) => {
                        return (<Buttons key={`pop-button-${i}`} inline={{ title: obj.title, onClick: obj.resultFunc }}>{obj.title}</Buttons>);
                    })}
                </div>
            </PopDownContent>
        );

        return (
            <div className="demo-content">
                <h2>InputType</h2>
                <hr />
                <div>
                    {Object.keys(classSize).map((size, i) => {
                        return (
                            <div key={`size_${i}`}>
                                <h4>SIZE - {size}</h4>
                                {Object.keys(classWidth).map((width, j) => {
                                    return (
                                        <div key={`width_${j}`}>
                                            <Input key={i + j} inputStyle={{ size, width }} inline={{ placeholder: size + width }} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {Object.keys(classTheme).map((theme, i) => {
                        return (
                            <div key={`theme_${i}`}>
                                <h4>THEMe - {theme}</h4>
                                {Object.keys(classWidth).map((width, j) => {
                                    return (
                                        <div key={`width_${j}`}>
                                            <Input key={i + j} inputStyle={{ theme, width }} inline={{ placeholder: theme + width }} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <hr />
                <h3>CheckBox</h3>
                <div>
                    <CheckboxText type="text" resultFunc={this.secondCheck}>웨딩</CheckboxText>
                    <CheckboxText type="text" resultFunc={this.secondCheck} disabled>베이비</CheckboxText>
                    <CheckboxText type="text" resultFunc={this.secondCheck}>허니문</CheckboxText>
                    <Checkbox type="yellow_small" resultFunc={this.secondCheck} disabled />
                    <Checkbox type="yellow_small" resultFunc={this.secondCheck} />
                    <Checkbox type="yellow_small" resultFunc={this.secondCheck}>체크박스</Checkbox>
                    <Checkbox type="yellow_circle" resultFunc={this.secondCheck}>체크박스</Checkbox>
                </div>
                <hr />
                <h3>Radio Button</h3>
                <div>
                    <RadioGroup radios={radioData} resultFunc={this.resultRadio} />
                </div>
                <hr />
                <h3>Dropdown Button (Select 대체)</h3>
                <div>
                    <Dropdown size="small" list={dropDownData} />
                    <Dropdown list={dropDownData} />
                    <Dropdown size="large" list={dropDownData} />
                </div>
                <hr />
                <h3>Heart</h3>
                <div>
                    <Heart count={this.state.heartCount} resultFunc={this.resultHeart} />
                </div>
                <hr />
                <h3>QTY</h3>
                <div>
                    <Qty />
                </div>
                <hr />
                <h3>Popdown</h3>
                <div>
                    {popButton}
                    <PopDownContent target={popContent} align="left">
                        <NotifyMenu userType="U" />
                    </PopDownContent>
                    <PopDownContent target={popContent}>
                        <NotifyMenu userType="U" />
                    </PopDownContent>
                    <PopDownContent target={popContent} align="right">
                        <NotifyMenu userType="U" />
                    </PopDownContent>
                </div>
                <hr />
                <h3>Badge</h3>
                <div>
                    <Badge content={popButton} count="7" />
                </div>
                <hr />
                <h3>Breadcrumb</h3>
                <div>
                    <Breadcrumb />
                </div>
                <hr />
                <h3>Accordion</h3>
                <div>
                    <Accordion data={accordionData} />
                </div>
                <hr />
            </div>
        );
    }
}

export default ElementsPage;
