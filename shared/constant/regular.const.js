export default {
    INPUT: {
        NUMBER: /[^0-9]+/g,
        NUMBER_MINUS: /[^0-9-]+/g,
        CHARACTER1: /[^\s\da-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ/(),+\-ᆞㆍ]+/gi
    },
    VIDEO_URL: /^((https|http):\/\/)?((www|player).)?((youtube|youtu|vimeo).(com|be))(\/(embed|video|watch))?(\/|\?(v)=)[^\s&]+$/,
    VIDEO_URL_REPLACE: /^((https|http):\/\/)?((www|player).)?((youtube|youtu|vimeo).(com|be))(\/(embed|video|watch))?(\/|\?(v)=)/,
    DOMAIN: /((https|http):\/\/)?([\w]+\.)?([\w@]+\.(kr|co\.kr|com|net))(:[0-9]+)?(\/\S*)?/,
    EMAIL: /[0-9a-zA-Z][0-9a-zA-Z\-._]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}/,
    HTML_TAG: /<(\/[ ]{0,})?[!-a-z]+([ ]{0,}[a-z-]+=["']([a-z0-9가-힇 #():;.,_?=&-/!]+)?["'])*?>/,
    HTML_EDITOR: /<(\/[ ]{0,})?(a|meta|script|style|link|noscript|iframe|html|head|body|footer|form)([ ]{0,}[a-z-]+=["']([a-z0-9가-힇 #():;.,_?=&-/!]+)?["'])*?>/,
    HTML_IMG: /<(\/[ ]{0,})?(img)([ ]{0,}[a-z-]+=["']([a-z0-9가-힇 #():;.,_?=&-/!]+)?["'])*?>/
};
