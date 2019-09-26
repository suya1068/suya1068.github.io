const BASE_PATH = "/event/20180321/images";
const version = "v=20180322_2200";
const EVENT_CONST = {
    IMG: {
        TOP: `${BASE_PATH}/p_img_01.jpg?${version}`,
        MIDDLE: `${BASE_PATH}/p_img_02.jpg?${version}`,
        BOTTOM: `${BASE_PATH}/p_img_03.jpg?${version}`
    },
    BUTTONS: {
        APPLY: `${BASE_PATH}/btn_01.png?${version}`,
        FACEBOOK: `${BASE_PATH}/f_btn_02.png?${version}`,
        NAVER: `${BASE_PATH}/n_btn_01.png?${version}`
    },
    QUICK: {
        MAIN: `${BASE_PATH}/quick_01.png?${version}`,
        QUOTATION: `${BASE_PATH}/quick_02.png?${version}`,
        TOP: `${BASE_PATH}/quick_03.png?${version}`
    }
};

export default EVENT_CONST;
