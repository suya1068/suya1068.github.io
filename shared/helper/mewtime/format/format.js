import fillSpace from "../utils/fill-space";


export const formatToken = {};

export const addFormatToken = (token, option, callback) => {
    formatToken[token] = callback;
};


addFormatToken("YYYY", null, function () {
    return `${this.year()}`;
});

addFormatToken("YY", null, function () {
    return `${this.year() % 100}`;
});

addFormatToken("Y", null, function () {
    return `${this.year()}`;
});

addFormatToken("MM", null, function () {
    return `${fillSpace(this.month() + 1)}`;
});

addFormatToken("M", null, function () {
    return `${this.month() + 1}`;
});

addFormatToken("DD", null, function () {
    return `${fillSpace(this.date())}`;
});

addFormatToken("D", null, function () {
    return `${this.date()}`;
});

addFormatToken("HH", null, function () {
    return `${fillSpace(this.hours())}`;
});

addFormatToken("H", null, function () {
    return `${this.hours()}`;
});

addFormatToken("hh", null, function () {
    return `${fillSpace(this.hours() < 13 ? this.hours() : this.hours() - 12)}`;
});

addFormatToken("h", null, function () {
    return `${this.hours() < 13 ? this.hours() : this.hours() - 12}`;
});

addFormatToken("mm", null, function () {
    return `${fillSpace(this.minutes())}`;
});

addFormatToken("m", null, function () {
    return `${this.minutes()}`;
});

addFormatToken("ss", null, function () {
    return `${fillSpace(this.seconds())}`;
});

addFormatToken("s", null, function () {
    return `${this.seconds()}`;
});

addFormatToken("a/p", null, function () {
    return `${this.hours() < 12 ? "AM" : "PM"}`;
});

addFormatToken("A/P", null, function () {
    return `${this.hours() < 12 ? "오전" : "오후"}`;
});
