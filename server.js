var express = require("express");
var cors = require('cors');
var webPush = require('web-push');
var bodyParser = require("body-parser");

var app = express();
var port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
var serverKey = "AAAAofe5Zx8:APA91bF2d2zdRqZIkzXTfqdIDKqL4N592QyIro2Ahcjdf7vuKMWuSzVdiFCQ9SvXhdZQ-eUuCnnMk7O2nQsrjDEZI0aAmoH2981Ggq7T63wXpYMEjezi9U8fzmyfk-0XNlDatf7mXx9d";
var endpoint = "";
var keys = "";
var vapidKeys = webPush.generateVAPIDKeys();

console.log(vapidKeys);
webPush.setGCMAPIKey(serverKey);

app.get("/", function (req,res) {
    res.send("테스트");
});

app.post("/push", function(req, res) {
    console.log(req.body, req.body.pushSubscription);
    if (!req.body.pushSubscription) {
        return res.status(400).json({ error: "no_data" });
    } else {
        endpoint = req.body.pushSubscription.endpoint;
        keys = req.body.pushSubscription.keys;
        // var pushSubscription = {
        //     endpoint: req.body.pushSubscription.endpoint,
        //     keys: req.body.pushSubscription.keys
        // };
        res.status(201).json("OK");
    }
});

app.post("/send", function (req, res) {
    if (req.body.message) {
        var payload = JSON.stringify({
            body: req.body.message
        });
        var options = {
            TTL: 60
        };

        var pushSubscription = {
            endpoint: endpoint,
            keys: keys
        };

        console.log("test", pushSubscription);
        webPush.sendNotification(
            pushSubscription,
            payload,
            options
        ).then(function (data) {
            console.log("then", data);
        }).catch(function (err) {
            console.log("err", err);
        });
        res.status(201).json("send OK");
    } else {
        res.status(400).json("err");
    }
    console.log(req.body);

});


app.listen(port, function () {
    console.log("Example app listening on port " + port);
});