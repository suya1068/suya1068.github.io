var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var request = require("request");
var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var test_token_save = {};
var Authorization = "AAAAofe5Zx8:APA91bF2d2zdRqZIkzXTfqdIDKqL4N592QyIro2Ahcjdf7vuKMWuSzVdiFCQ9SvXhdZQ-eUuCnnMk7O2nQsrjDEZI0aAmoH2981Ggq7T63wXpYMEjezi9U8fzmyfk-0XNlDatf7mXx9d";
var CONTENT_TYPE = "application/json";
var FCM_END_POINT = "https://fcm.googleapis.com/fcm/send";

app.use("/test", function(req, res) {
    var token = req.body.token || "";
    if (token) {
        test_token_save.token = token;
        res.status(201).json(test_token_save);
    } else {
        res.status(404).json({ error: "token is empty" });
    }

    console.log("test_token_save", test_token_save);
});

app.use("/fore", function (req, res) {
    var token = test_token_save.token;
    request({
        url: FCM_END_POINT,
        method: "POST",
        headers: {
            Authorization: "key=" + Authorization,
            "Content-Type": CONTENT_TYPE
        },
        body: JSON.stringify({
            "notification": {
                "title": "푸쉬 테스트",
                "body": "푸쉬 메시지가 보내지고 있습니다.",
                "icon": "./image/logo.png"
            },
            "to": token
        })
    }, function (error, response, body) {
        if (response.statusCode >= 400) {
            console.log("HTTP ERROR", response)
        } else {
            console.log("on Success");
        }
    });
// app.use("/pushsend", function (req, res) {
});
app.use("/back", function (req, res) {
    var token = test_token_save.token;
    request({
        url: FCM_END_POINT,
        method: "POST",
        headers: {
            Authorization: "key=" + Authorization,
            "Content-Type": CONTENT_TYPE
        },
        body: JSON.stringify({
            "data": {
                "title": "백그라운드 메시지",
                "body": "닫힌상태에서도 메시지가 보내지네요",
                "icon": "./image/logo.png"
            },
            "to": token
        })
    }, function (error, response, body) {
        if (response.statusCode >= 400) {
            console.log("HTTP ERROR", response)
        } else {
            console.log("on Success");
            console.log(response);
        }
    });
// app.use("/pushsend", function (req, res) {
});

app.listen(port, function() {
    console.log("server on port 3000");
});

