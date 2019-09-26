import utils from "shared/helper/utils";

class board {
    constructor(instance) {
        this.base = "/boards";
        this.instance = instance;
    }

    selectBoardList(boardType, category, offset, limit) {
        const query = [
            `board_type=${boardType}`
        ];

        if (category) {
            query.push(`category=${category}`);
        }

        if (offset) {
            query.push(`offset=${offset}`);
        }

        if (limit) {
            query.push(`limit=${limit}`);
        }

        return this.instance.get(`${this.base}?${query.join("&")}`);
    }

    selectOneBoard(no, boardType) {
        return this.instance.get(`${this.base}/${no}?board_type=${boardType}`);
    }
}

export default board;
