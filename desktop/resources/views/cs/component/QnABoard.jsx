import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import CenterInfoPanel from "./CenterInfoPanel";
import TabMenu from "./TabMenu";
import tabMenuData from "./tabMenu_data";
import Accordion from "desktop/resources/components/form/Accordion";
import PopModal from "shared/components/modal/PopModal";

class QnABoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabMenu: [],
            tabData: {},
            list: [],
            offset: 0,
            limit: 10,
            board_type: "QNA",
            category: "MANY"
        };
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }

    componentWillMount() {
        const tabMenu = tabMenuData.TABMENU.CUSTOMERCENTER.reduce((result, obj) => {
            obj.callback = data => this.onChangeStatus(data);
            result.push(obj);
            return result;
        }, []);
        this.state.tabMenu = tabMenu;
        this.state.tabData = tabMenu[0];
    }

    componentDidMount() {
        this.getBoard();
    }

    onChangeStatus(obj) {
        // console.log(obj);
        const tabData = obj;
        const category = obj.category;

        this.setState({
            tabData,
            category
        }, () => {
            this.getBoard();
        });
    }

    getBoard() {
        const board_type = this.state.board_type;
        const category = this.state.category;
        const request = API.cs.selectBoardList(board_type, category);
        request.then(response => {
            const data = response.data;
            const list = data.list;
            this.setState({
                list
            });
        }, error => {
            PopModal.alert(error.data);
        });
    }

    render() {
        const tabData = this.state.tabData;
        const list = this.state.list;
        return (
            <div className="board container">
                <CenterInfoPanel />
                <h1>자주 묻는 질문</h1>
                <div className="board__tabMenu">
                    <TabMenu data={this.state.tabMenu} value={tabData.value} />
                    <div className="board_accor">
                        <Accordion data={list} />
                    </div>
                </div>
            </div>
        );
    }
}

export default QnABoard;
