const ARTIST_REVIEW_EXAMPLE = {
    IMG_BASE_PATH: "/artist/review/example",
    CATEGORY: "PRODUCT",
    CATEGORY_NAME: "제품",
    ARTIST_NAME: "오디니크",
    TITLE: "안녕하세요, 포토그래퍼 오디니크입니다.",
    TAG: "제품,모델,연출",
    LIST: [
        {
            NO: 1,
            TYPE: "TEXT",
            VALUE: "안녕하세요, 포토그래퍼 오디니크입니다.\n" +
            "이번에 경원이라는 업체의 여행용 목베개, 식도염 베개, 허리 보호대를 촬영했습니다.\n" +
            "오랜만에 어두운 지하 스튜디오를 벗어나서 자연광 스튜디오로 나왔어요 ^^"
        },
        {
            NO: 2,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 5,
                LIST: [
                    { NO: 1, WIDTH: "740px", HEIGHT: "493px", DI: false, SRC: "/image_01.png", SRC_2X: "/2x/image_01.png" },
                    { NO: 2, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_02.png", SRC_2X: "/2x/image_02.png" },
                    { NO: 3, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_03.png", SRC_2X: "/2x/image_03.png" },
                    { NO: 4, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_04.png", SRC_2X: "/2x/image_04.png" },
                    { NO: 5, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_05.png", SRC_2X: "/2x/image_05.png" }
                ]
            }
        },
        {
            NO: 3,
            TYPE: "TEXT",
            VALUE: "모델 분이 도착하시기 전에 먼저 우선 제품 촬영을 시작했어요.\n" +
            "침대에 제품을 세팅하고 전체 이미지와 다양한 구도의 디테일 컷을 촬영했습니다.\n" +
            "제품도 침대도 밝고, 패턴이 있는 제품이라 패턴이 잘 표현될 수 있는 구도를 잡는 것을 중점적으로 진행했어요. :)"
        },
        {
            NO: 4,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 4,
                LIST: [
                    { NO: 6, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_06.png", SRC_2X: "/2x/image_06.png" },
                    { NO: 7, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_07.png", SRC_2X: "/2x/image_07.png" },
                    { NO: 8, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_08.png", SRC_2X: "/2x/image_08.png" },
                    { NO: 9, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_09.png", SRC_2X: "/2x/image_09.png" },
                ]
            }
        },
        {
            NO: 5,
            TYPE: "TEXT",
            VALUE: "베개 제품 촬영 후 이번에는 허리 보호대를 촬영했습니다.\n" +
            "다소 어두운 제품이기 때문에 블랙 부분의 디테일이 묻히지 않도록 진행했어요.\n" +
            "온/냉 찜질팩까지 포함되어 있어서, 컨디션에 맡게 사용하면 좋을 것 같아요.\n" +
            "허리 사이즈에 맞춰서 보호대가 늘어나기 때문에, 하나만 사도 가족들이 다 쓸 수 있을 것 같아요~"
        },
        {
            NO: 6,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 2,
                LIST: [
                    { NO: 10, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_10.png", SRC_2X: "/2x/image_10.png" },
                    { NO: 11, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_11.png", SRC_2X: "/2x/image_11.png" }
                ]
            }
        },
        {
            NO: 7,
            TYPE: "TEXT",
            VALUE: "이번에는 목베개를 촬영했습니다.\n" +
            "일상생활에서도 쓸 수 있지만 해외 여행시에도 사용할 수 있기에 캐리어와 각종 소품들을 연출하여 \n" +
            "여행 컨셉으로 촬영했어요."
        },
        {
            NO: 8,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 4,
                LIST: [
                    { NO: 12, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_12.png", SRC_2X: "/2x/image_12.png" },
                    { NO: 13, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_13.png", SRC_2X: "/2x/image_13.png" },
                    { NO: 14, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_14.png", SRC_2X: "/2x/image_14.png" },
                    { NO: 15, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_15.png", SRC_2X: "/2x/image_15.png" }
                ]
            }
        },
        {
            NO: 9,
            TYPE: "TEXT",
            VALUE: "이제 모델 분이 도착하셨어요.\n" +
            "아까 제품 연출컷으로 진행했던 세팅 그대로 모델분이 들고 있는 연출, 그리고 베개를 편안하게 배고 있는 \n" +
            "연출컷을 촬영했습니다. 여행 전날의 설렘이 조금은 느껴지시나요? ^^\n"
        },
        {
            NO: 10,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 4,
                LIST: [
                    { NO: 16, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_16.png", SRC_2X: "/2x/image_16.png" },
                    { NO: 17, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_17.png", SRC_2X: "/2x/image_17.png" },
                    { NO: 18, WIDTH: "365px", HEIGHT: "547px", DI: true, SRC: "/image_18.png", SRC_2X: "/2x/image_18.png" },
                    { NO: 19, WIDTH: "365px", HEIGHT: "547px", DI: true, SRC: "/image_19.png", SRC_2X: "/2x/image_19.png" }
                ]
            }
        },
        {
            NO: 11,
            TYPE: "TEXT",
            VALUE: "이제 모델분을 침대에 눕히고, 다양한 구도로 베개 컷을 촬영했습니다.\n" +
            "탑뷰 촬영에는 사다리를 이용하여 촬영했어요.\n" +
            "최대한 편안한 느낌을 보여줄 수 있도록 모델분께 주문을 드렸습니다."
        },
        {
            NO: 12,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 2,
                LIST: [
                    { NO: 20, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_20.png", SRC_2X: "/2x/image_20.png" },
                    { NO: 21, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_21.png", SRC_2X: "/2x/image_21.png" }
                ]
            }
        },
        {
            NO: 13,
            TYPE: "TEXT",
            VALUE: "혼신의 연기를 펼치고 계시는 모델분 ^^\n" +
                "단순한 모양의 베개인데, 이렇게 배고 있으면 식도염이 방지된다니 신기하네요~\n" +
                "자연광의 따뜻한 느낌을 살리기 위해 창가를 바라보는 구도로 촬영을 했어요."
        },
        {
            NO: 14,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 8,
                LIST: [
                    { NO: 22, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_22.png", SRC_2X: "/2x/image_22.png" },
                    { NO: 23, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_23.png", SRC_2X: "/2x/image_23.png" },
                    { NO: 24, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_24.png", SRC_2X: "/2x/image_24.png" },
                    { NO: 25, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_25.png", SRC_2X: "/2x/image_25.png" },
                    { NO: 26, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_26.png", SRC_2X: "/2x/image_26.png" },
                    { NO: 27, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_27.png", SRC_2X: "/2x/image_27.png" },
                    { NO: 28, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_28.png", SRC_2X: "/2x/image_28.png" },
                    { NO: 29, WIDTH: "365px", HEIGHT: "240px", DI: true, SRC: "/image_29.png", SRC_2X: "/2x/image_29.png" }
                ]
            }
        },
        {
            NO: 15,
            TYPE: "TEXT",
            VALUE: "허리 보호대 착용 단계 사진이에요.\n" +
                "이런 제품은 컨셉을 살려서 촬영하는 것도 물론 중요하지만, 단계별 착용 사진을 통해서 고객님들께서 제품을\n" +
                "사용하는데 이해가 잘 되도록 이해가 잘 되도록 해야해요.\n" +
                "최대한 동일한 구도와 앵글로 찍어서 전체적인 통일감을 주는 것이 중요합니다. :)"
        },
        {
            NO: 16,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 2,
                LIST: [
                    { NO: 30, WIDTH: "740px", HEIGHT: "1110px", DI: false, SRC: "/image_30.png", SRC_2X: "/2x/image_30.png" },
                    { NO: 31, WIDTH: "740px", HEIGHT: "493px", DI: true, SRC: "/image_31.png", SRC_2X: "/2x/image_31.png" }
                ]
            }
        },
        {
            NO: 17,
            TYPE: "TEXT",
            VALUE: "허리 보호대를 차고 일상생활을 하는 모습이에요.\n" +
            "주로 주부님들을 타겟으로 한 상품이다 보니, 청소하거나 집의 집기를 옮기는 일을 할 상황이 많은 것을 감안하여\n" +
            "그러한 연출로 촬영을 해보았습니다."
        },
        {
            NO: 18,
            TYPE: "IMAGE",
            IMG_DATA: {
                COUNT: 2,
                LIST: [
                    { NO: 32, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_32.png", SRC_2X: "/2x/image_32.png" },
                    { NO: 33, WIDTH: "365px", HEIGHT: "240px", DI: false, SRC: "/image_33.png", SRC_2X: "/2x/image_33.png" }
                ]
            }
        },
        {
            NO: 19,
            TYPE: "TEXT",
            VALUE: "마지막으로는 허리 보호대를 찬 상황에서의 상쾌한 표정을 짓는 연출 사진이에요 ^^\n" +
            "기지개도 펴보고, 활짝 웃어보고, 모델분께 다양한 연출을 요청드리며 촬영했어요.\n" +
            "때마침 스튜디오에 자연광이 예쁘게 드리워져서 생각보다 더 좋은 결과물을 얻을 수 있었어요."
        },
        {
            NO: 20,
            TYPE: "TEXT",
            VALUE: "오늘은 자연광 스튜디오에서 진행했던 다양한 제품 연출컷 촬영 이야기를 들려드렸습니다.\n" +
            "촬영에 대한 레퍼런스를 바탕으로 결과물을 만들어드리는 것 외에, 현장에서의 유연한 아이디어 제안으로\n" +
            "고객님께서 기대하셨던 것 이상의 결과물을 만들기 위해 항상 최선을 다해 노력하고 있습니다. \n" +
            "다음에 또 좋은 리뷰로 찾아 뵙겠습니다. :)"
        }
    ]
};

export default ARTIST_REVIEW_EXAMPLE;
