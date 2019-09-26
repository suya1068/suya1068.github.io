const EXTRA_INFO_KEYS = {
    HOW_SHOT: "how_shot",
    SHOT_PLACE: "shot_place",
    HAIR_MAKEUP: "hair_makeup",
    ALBUM_FRAME: "album_frame",
    CLOTHES_HAIR: "clothes_hair"
};

export const KEYS_TEXT = {
    [EXTRA_INFO_KEYS.HOW_SHOT]: "어떤 촬영이 필요하신가요?",
    [EXTRA_INFO_KEYS.SHOT_PLACE]: "촬영장소를 알려주세요!",
    [EXTRA_INFO_KEYS.HAIR_MAKEUP]: "헤어메이크업이 필요하신 경우 체크해주세요.",
    [EXTRA_INFO_KEYS.ALBUM_FRAME]: "앨범 및 액자가 필요하신 경우 체크해주세요.",
    [EXTRA_INFO_KEYS.CLOTHES_HAIR]: "의상 및 헤어메이크업이 필요하신 경우 체크해주세요."
};

export const CATEGORY_TITLE = {
    WEDDING: "웨딩",
    BABY: "베이비",
    PROFILE: "개인 프로필",
    SNAP: "스냅"
};

export const CATEGORY_CONTENT_TEXT = {
    WEDDING: "일정 및 장소와 예산 등 추가 문의사항을 남겨주세요!",
    BABY: "일정 및 장소와 예산 등 추가 문의사항을 남겨주세요!",
    PROFILE: "일정 및 컨셉수와 예산 등 추가 문의사항을 남겨주세요!",
    SNAP: "일정 및 컨셉수와 예산 등 추가 문의사항을 남겨주세요!"
};

export const EXTRA_INFO_DATA_SET = {
    WEDDING: [
        EXTRA_INFO_KEYS.HOW_SHOT,
        EXTRA_INFO_KEYS.ALBUM_FRAME,
        EXTRA_INFO_KEYS.CLOTHES_HAIR
    ],
    BABY: [
        EXTRA_INFO_KEYS.HOW_SHOT,
        EXTRA_INFO_KEYS.ALBUM_FRAME,
        EXTRA_INFO_KEYS.CLOTHES_HAIR
    ],
    PROFILE: [
        EXTRA_INFO_KEYS.HOW_SHOT,
        EXTRA_INFO_KEYS.SHOT_PLACE,
        EXTRA_INFO_KEYS.HAIR_MAKEUP
    ],
    SNAP: [
        EXTRA_INFO_KEYS.HOW_SHOT,
        EXTRA_INFO_KEYS.SHOT_PLACE,
        EXTRA_INFO_KEYS.HAIR_MAKEUP
    ]
};

export const INIT_DATA = {
    [EXTRA_INFO_KEYS.HOW_SHOT]: "",
    [EXTRA_INFO_KEYS.SHOT_PLACE]: "",
    [EXTRA_INFO_KEYS.ALBUM_FRAME]: false,
    [EXTRA_INFO_KEYS.CLOTHES_HAIR]: false,
    [EXTRA_INFO_KEYS.HAIR_MAKEUP]: false
};

const WEDDING_BASE_URL = "/common/counsel/wedding";
const BABY_BASE_URL = "/common/counsel/baby";
const SNAP_BASE_URL = "/common/counsel/snap";
const PROFILE_BASE_URL = "/common/counsel/profile";

export const EXTRA_INFO_SUB_CONTENT = {
    WEDDING: {
        [EXTRA_INFO_KEYS.HOW_SHOT]: [
            { IMG: `${WEDDING_BASE_URL}/wedding_shot_self.jpg`, CAPTION: "셀프웨딩촬영", pick: false },
            { IMG: `${WEDDING_BASE_URL}/wedding_shot_studio.jpg`, CAPTION: "스튜디오촬영", pick: false },
            { IMG: `${WEDDING_BASE_URL}/wedding_shot_bon_snap.jpg`, CAPTION: "본식스냅", pick: false },
            { IMG: `${WEDDING_BASE_URL}/wedding_shot_bon_won.jpg`, CAPTION: "본식(원판포함)", pick: false },
            { IMG: `${WEDDING_BASE_URL}/wedding_shot_etc.jpg`, CAPTION: "기타", pick: false }
        ],
        [EXTRA_INFO_KEYS.ALBUM_FRAME]: [
            { IMG: `${WEDDING_BASE_URL}/wedding_album.jpg`, CAPTION: "앨범", pick: false }
        ],
        [EXTRA_INFO_KEYS.CLOTHES_HAIR]: [
            { IMG: `${WEDDING_BASE_URL}/wedding_hairmakeup.jpg`, CAPTION: "의상메이크업", pick: false }
        ]
    },
    BABY: {
        [EXTRA_INFO_KEYS.HOW_SHOT]: [
            { IMG: `${BABY_BASE_URL}/baby_shot_home_snap.jpg`, CAPTION: "홈스냅", pick: false },
            { IMG: `${BABY_BASE_URL}/baby_shot_100.jpg`, CAPTION: "백일사진", pick: false },
            { IMG: `${BABY_BASE_URL}/baby_shot_first_birth.jpg`, CAPTION: "돌사진", pick: false },
            { IMG: `${BABY_BASE_URL}/baby_shot_etc.jpg`, CAPTION: "기타", pick: false }
        ],
        [EXTRA_INFO_KEYS.ALBUM_FRAME]: [
            { IMG: `${BABY_BASE_URL}/baby_album.jpg`, CAPTION: "앨범", pick: false }
        ],
        [EXTRA_INFO_KEYS.CLOTHES_HAIR]: [
            { IMG: `${BABY_BASE_URL}/baby_hairmakeup.jpg`, CAPTION: "의상메이크업", pick: false }
        ]
    },
    PROFILE: {
        [EXTRA_INFO_KEYS.HOW_SHOT]: [
            { IMG: `${PROFILE_BASE_URL}/profile_shot_keep.jpg`, CAPTION: "소장용프로필", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_shot_audition.jpg`, CAPTION: "오디션용프로필", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_shot_sns.jpg`, CAPTION: "SNS용프로필", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_shot_etc.jpg`, CAPTION: "기타", pick: false }
        ],
        [EXTRA_INFO_KEYS.SHOT_PLACE]: [
            { IMG: `${PROFILE_BASE_URL}/profile_place_out.jpg`, CAPTION: "야외", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_place_rental.jpg`, CAPTION: "렌탈스튜디오", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_place_horizon.jpg`, CAPTION: "호리존", pick: false },
            { IMG: `${PROFILE_BASE_URL}/profile_place_etc.jpg`, CAPTION: "기타", pick: false }
        ],
        [EXTRA_INFO_KEYS.HAIR_MAKEUP]: [
            { IMG: `${PROFILE_BASE_URL}/profile_hairmakeup.jpg`, CAPTION: "헤어메이크업", pick: false }
        ]
    },
    SNAP: {
        [EXTRA_INFO_KEYS.HOW_SHOT]: [
            { IMG: `${SNAP_BASE_URL}/snap_shot_personal.jpg`, CAPTION: "개인스냅", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_shot_couple.jpg`, CAPTION: "커플스냅", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_shot_friedship.jpg`, CAPTION: "우정스냅", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_shot_family.jpg`, CAPTION: "가족사진", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_shot_etc.jpg`, CAPTION: "기타", pick: false }
        ],
        [EXTRA_INFO_KEYS.SHOT_PLACE]: [
            { IMG: `${SNAP_BASE_URL}/snap_place_seoul.jpg`, CAPTION: "서울", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_place_ex.jpg`, CAPTION: "국내(서울제외)", pick: false },
            { IMG: `${SNAP_BASE_URL}/snap_place_overseas.jpg`, CAPTION: "해외", pick: false }
        ],
        [EXTRA_INFO_KEYS.HAIR_MAKEUP]: [
            { IMG: `${SNAP_BASE_URL}/snap_hairmakeup.jpg`, CAPTION: "헤어메이크업", pick: false }
        ]
    }
};

