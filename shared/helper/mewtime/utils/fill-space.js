export default function fillSpace(num, leng = 2, char = 0, reverse = false) {
    if (!(typeof num === "string" || typeof num === "number")) {
        throw new TypeError("The param is invalid type.");
    }

    let text = `${num}`;

    while (text.length < leng) {
        text = reverse ? `${text}${char}` : `${char}${text}`;
    }

    return text;
}
