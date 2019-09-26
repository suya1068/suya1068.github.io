export const STATE = {
    PRODUCT_NO: "product_no",       // 의뢰서 번호
    BASIC: {
        key: "basic",            // 객체 키
        TITLE: "title",
        CATEGORY: "category",
        AGREE: "agree"
    },
    OPTION: {
        key: "option",
        PACKAGE: {
            key: "package",
            TITLE: "title", // 패키지명*
            CONTENT: "content", // 패키지 설명*
            PRICE: "price", // 패키지 금액 & 상품당 금액
            MIN_PRICE: "min_price", // 최소 진행 금액
            PHOTO_TIME: "photo_time", // 촬영시간
            PHOTO_CNT: "photo_cnt", // 사진수
            CUSTOM_CNT: "custom_cnt", // 보정사진수
            PERIOD: "complete_period", // 최종사진 전달 기간 or 의상 대여 기간,
            SIZE: "size", // 의상 사이즈
            RUNNING_TIME: "running_time"
        },
        EXTRA_OPTION: {
            key: "extra_option",
            TIME: { code: "time", title: "촬영시간 추가", price: "" }, // 촬영시간추가 금액
            PERSON: { code: "person", title: "인원 추가", price: "" }, // 인원추가 금액
            PHOTO: { code: "photo", title: "사진 추가", price: "" }, // 사진추가 금액
            CUSTOM: { code: "custom", title: "보정사진 추가", price: "" }, // 보정사진추가 금액
            CONCEPT: { code: "concept", title: "연출사진 추가", price: "" }, // 상품당 연출 사진 추가금액
            PATH: { code: "path", title: "누끼사진 추가", price: "" }, // 상품당 누끼 사진 추가금액
            TRAVEL: { code: "travel", title: "출장비 추가", price: "" }, // 출장비추가 금액
            HELPER: { code: "helper", title: "헬퍼 추가", price: "" }, // 헬퍼추가 금액
            ACTOR: { code: "actor", title: "배우섭외", price: "" },
            HAIR: { code: "hair", title: "헤어/메이크업", price: "" },
            PLAN: { code: "plan", title: "기획/콘티", price: "" }
        },
        CUSTOM_OPTION: {
            key: "custom_option",
            TITLE: "title", // 맞춤옵션명
            CONTENT: "content", // 맞춤옵션 설명
            PRICE: "price" // 맞춤옵션 금액
        }
    },
    DETAIL: {
        key: "detail",
        CONTENT: "content",
        TAG: "tag",
        DESCRIPTION: "description",
        REGION: "region"
    },
    CATEGORY_CODES: "category_codes",
    PORTFOLIO: "portfolio_list",
    THUMBNAIL: "thumb_img",
    UPLOAD_INFO: "upload_info",
    MAIN_VIDEO: "main_video",
    VIDEO_LIST: "video_list"
};

export const EXTRA_OPTION = [
    {
        code: "time",
        title: "촬영시간 추가",
        content: "기본 촬영 시간 이상의 추가촬영을 진행하는 경우 해당 옵션을 선택해 주세요.",
        user_tooltip: "기본 촬영 시간 이상의 추가촬영을 진행하는 경우 해당 옵션을 선택해 주세요.\n( 30분당 )",
        placeholder: "추가시간(30분단위) 당 금액 추가 (≥ 1,000)"
    }, // 촬영시간추가 금액
    {
        code: "person",
        title: "인원 추가",
        content: "기준인원 외의 인원 추가 시 해당 옵션을 선택해 주세요.",
        user_tooltip: "기준인원 외의 인원 추가 시 해당 옵션을 선택해 주세요.\n( 인원 1명당 )",
        placeholder: "1명 당 추가금액 (≥ 1,000)"
    }, // 인원추가 금액
    {
        code: "photo",
        title: "사진 추가",
        content: "기본 제공 이미지 이상의 추가 이미지를 제공하는 경우 해당 옵션을 선택해 주세요.",
        user_tooltip: "기본 제공 이미지 이상의 이미지를 추가하고 싶은 경우 해당 옵션을 선택해 주세요.\n( 이미지 1장당 )",
        placeholder: "1장 당 추가금액 (≥ 1,000)"
    }, // 사진추가 금액
    {
        code: "custom",
        title: "보정사진 추가",
        content: "기본 보정 이미지 이상의 추가 보정 이미지를 제공하는 경우 해당 옵션을 선택해 주세요.",
        user_tooltip: "기본 보정 이미지 이상의 보정 이미지를 추가하고 싶은 경우 해당 옵션을 선택해 주세요.\n( 보정이미지 1장당 )",
        placeholder: "1장 당 추가금액 (≥ 1,000)"
    }, // 보정사진추가 금액
    {
        code: "concept",
        title: "연출사진 추가",
        content: "연출사진을 제공하는 경우 해당 옵션을 선택해 주세요.\n상품 1개당 연출사진 추가금액을 입력해주세요.",
        user_tooltip: "더 많은 연출사진을 원하시면 선택해주세요.\n( 상품 1개당 연출사진 )",
        placeholder: "1장 당 추가금액 (≥ 1,000)"
    }, // 상품당 연출 사진 추가금액
    {
        code: "path",
        title: "누끼사진 추가",
        content: "누끼사진을 제공하는 경우 해당 옵션을 선택해 주세요.\n상품 1개당 누끼사진 추가금액을 입력해주세요.",
        user_tooltip: "더 많은 누끼사진을 원하시면 선택해주세요.\n( 상품 1개당 누끼사진 )",
        placeholder: "1장 당 추가금액 (≥ 1,000)"
    }, // 상품당 누끼 사진 추가금액
    {
        code: "travel",
        title: "출장비 추가",
        content: "출장 촬영을 제공하는 경우 해당 옵션을 선택해 주세요.",
        user_tooltip: "기본 출장비 입니다.",
        placeholder: "출장 촬영 추가금액 (≥ 1,000)"
    }, // 출장비추가 금액
    {
        code: "helper",
        title: "헬퍼 추가",
        content: "헬퍼가 동행하는 경우 해당 옵션을 선택해주세요.",
        user_tooltip: "헬퍼가 필요한 경우 옵션을 선택해주세요.",
        placeholder: "헬퍼 추가금액 (≥ 1,000)"
    }, // 헬퍼추가
    {
        code: "actor",
        title: "배우섭외",
        content: "배우 섭외를 제공하는 경우 해당 옵션을 선택해 주세요.",
        user_tooltip: "배우 섭외가 필요한 경우 해당 옵션을 선택해 주세요.",
        placeholder: "배우섭외 추가금액을 입력해주세요."
    }, // 배우섭외
    {
        code: "hair",
        title: "헤어/메이크업",
        content: "헤어/메이크업을 제공하는 경우 해당옵션을 선택해 주세요.",
        user_tooltip: "헤어/메이크업이 필요한 경우 해당옵션을 선택해 주세요.",
        placeholder: "헤어/메이크업 추가금액을 입력해주세요."
    }, // 헤어/메이크업
    {
        code: "plan",
        title: "기획/콘티",
        content: "기획/콘티를 제공하는 경우 해당옵션을 선택해 주세요.",
        user_tooltip: "기획/콘티가 필요한 경우 해당옵션을 선택해 주세요.",
        placeholder: "기획/콘티비용의 추가금액을 입력해주세요."
    } // 기획/콘티
];

export const EXTRA_OPTION_CODE = EXTRA_OPTION.reduce((r, o) => { r[o.code] = o.code; return r; }, {});

    // TITLE: "title", // 패키지명*
    // CONTENT: "content", // 패키지 설명*
    // PRICE: "price", // 패키지 금액 & 상품당 금액
    // MIN_PRICE: "min_price", // 최소 진행 금액
    // PHOTO_TIME: "photo_time", // 촬영시간
    // PHOTO_CNT: "photo_cnt", // 사진수
    // CUSTOM_CNT: "custom_cnt", // 보정사진수
    // PERIOD: "complete_period", // 최종사진 전달 기간 or 의상 대여 기간,
    // SIZE: "size" // 의상 사이즈

export const CATEGORY_LIST = [
    {
        name: "프로필",
        code: "PROFILE",
        display_order: "1",
        tag: "배우프로필, 바디프로필, 개인프로필,스튜디오, 증명사진,",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "제품",
        code: "PRODUCT",
        display_order: "2",
        tag: "룩북,광고,쇼핑몰,연출사진,누끼,여성의류,뷰티용품,모델",
        except: true,
        cnt_price: 1000,
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "상품당 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 1,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.MIN_PRICE,
                title: "최소 진행 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "직접입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60일)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.CONCEPT.code,
            STATE.OPTION.EXTRA_OPTION.PATH.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "행사",
        code: "EVENT",
        display_order: "3",
        tag: "세미나,연회장,공연,기업연수,콘서트,파티,",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "웨딩",
        code: "WEDDING",
        display_order: "4",
        tag: "웨딩스냅,본식,셀프웨딩,웨딩사진",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "인테리어",
        code: "INTERIOR",
        display_order: "6",
        tag: "팬션,매장,홍보,건물,실내촬영,",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PHOTO.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "스냅",
        code: "SNAP",
        display_order: "6",
        tag: "개인화보,커플,우정스냅,가족사진,반려동물,셀프웨딩",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "음식",
        code: "FOOD",
        display_order: "7",
        tag: "메뉴판,누끼,식품,카페,레스토랑,한식,디저트",
        except: true,
        cnt_price: 1000,
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "상품당 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 1,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.MIN_PRICE,
                title: "최소 진행 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "직접입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60일)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.CONCEPT.code,
            STATE.OPTION.EXTRA_OPTION.PATH.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "베이비",
        code: "BABY",
        display_order: "8",
        tag: "홈스냅,돌잔치,성장앨범,돌사진,돌스냅",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    // {
    //     name: "광고",
    //     code: "AD",
    //     display_order: "9",
    //     tag: "스냅,베이비,웨딩",
    //     min_price: 100000,
    //     package: [
    //         {
    //             code: STATE.OPTION.PACKAGE.TITLE,
    //             title: "패키지명(5 ~ 10)",
    //             placeholder: "패키지명을 입력해주세요.",
    //             tooltip: "패키지는 최대 3개까지 등록가능합니다."
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.CONTENT,
    //             title: "패키지설명",
    //             placeholder: "패키지 설명을 입력해주세요.",
    //             tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.PRICE,
    //             title: "금액",
    //             placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 100,000)",
    //             tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.PHOTO_TIME,
    //             title: "촬영시간 (분)"
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.PHOTO_CNT,
    //             title: "제공 이미지 최소 컷 수",
    //             placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
    //             title: "보정 이미지 최소 컷 수",
    //             placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
    //         },
    //         {
    //             code: STATE.OPTION.PACKAGE.PERIOD,
    //             title: "최종사진 전달 기간",
    //             placeholder: "직접입력해주세요. (1 ~ 60)"
    //         }
    //     ]
    // },
    {
        name: "개인영상",
        code: "VIDEO",
        display_order: "10",
        tag: "SNS,광고,홍보영상",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "최소 진행 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.RUNNING_TIME,
                title: "영상러닝타임 (분)",
                placeholder: "제작가능한 러닝타임(분)을 입력해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "작업 기간",
                placeholder: "직접입력해주세요. (1 ~ 60일)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code
        ]
    },
    {
        name: "기업영상",
        code: "VIDEO_BIZ",
        display_order: "10",
        tag: "SNS,광고,홍보영상",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "최소 진행 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.RUNNING_TIME,
                title: "영상러닝타임 (분)",
                placeholder: "제작가능한 러닝타임(분)을 입력해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "작업 기간",
                placeholder: "직접입력해주세요. (1 ~ 60일)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.ACTOR.code,
            STATE.OPTION.EXTRA_OPTION.HAIR.code,
            STATE.OPTION.EXTRA_OPTION.PLAN.code
        ]
    },
    {
        name: "기업프로필",
        code: "PROFILE_BIZ",
        display_order: "11",
        tag: "임직원/사원프로필/CEO",
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_TIME,
                title: "촬영시간 (분)"
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.CUSTOM_CNT,
                title: "보정 이미지 최소 컷 수",
                placeholder: "최소 전달 컷 수를 입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.TIME.code,
            STATE.OPTION.EXTRA_OPTION.PERSON.code,
            STATE.OPTION.EXTRA_OPTION.CUSTOM.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "패션",
        code: "FASHION",
        display_order: "12",
        tag: "쇼핑몰촬영, 룩북촬영, 화보촬영, 의류촬영, 악세사리촬영, 아동복촬영, 카달로그촬영",
        except: true,
        cnt_price: 1000,
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "상품당 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 1,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.MIN_PRICE,
                title: "최소 진행 금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PHOTO_CNT,
                title: "제공 이미지 최소 컷 수",
                placeholder: "직접입력해주세요. (1 ~ 9,999)"
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "최종사진 전달 기간",
                placeholder: "직접입력해주세요. (1 ~ 60일)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.CONCEPT.code,
            STATE.OPTION.EXTRA_OPTION.PATH.code,
            STATE.OPTION.EXTRA_OPTION.TRAVEL.code
        ]
    },
    {
        name: "의상대여",
        code: "DRESS_RENT",
        display_order: "13",
        tag: null,
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "해당 패키지 이외의 옵션은 추가옵션에서 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.PERIOD,
                title: "대여 기간",
                placeholder: "의상대여기간을 입력해주세요.(1~999)"
            },
            {
                code: STATE.OPTION.PACKAGE.SIZE,
                title: "사이즈",
                placeholder: "의상의 사이즈를 입력해주세요",
                tooltip: "대여가능한 사이즈를 영문 혹은 숫자로 입력해주세요. (예 S,M,L 혹은 90~100 등)"
            }
        ],
        extra: [
            STATE.OPTION.EXTRA_OPTION.HELPER.code
        ]
    },
    {
        name: "모델",
        code: "MODEL",
        display_order: "14",
        tag: null,
        min_price: 5000,
        package: [
            {
                code: STATE.OPTION.PACKAGE.TITLE,
                title: "패키지명(5 ~ 10)",
                placeholder: "패키지명을 입력해주세요.",
                tooltip: "패키지는 최대 3개까지 등록가능합니다."
            },
            {
                code: STATE.OPTION.PACKAGE.CONTENT,
                title: "패키지설명",
                placeholder: "패키지 설명을 입력해주세요.",
                tooltip: "패키지 금액에 제공가능한 서비스를 작성해주세요."
            },
            {
                code: STATE.OPTION.PACKAGE.PRICE,
                title: "최소진행금액",
                placeholder: "부가가치세 및 수수료 포함가격으로 입력. (≥ 5,000)",
                tooltip: "패키지 및 옵션 선택 최종 금액(결제금액)의 최소 금액을 입력해주세요. 해당 금액 이상만 결제 진행 가능 합니다."
            }
        ],
        extra: []
    }
];

export const CATEGORY_CODE = CATEGORY_LIST.reduce((r, o) => { r[o.code] = o.code; return r; }, {});
