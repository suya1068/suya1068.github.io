// 메시징 서비스에선 서비스 워커가 꼭 필요함.
importScripts("https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaWpWO4ClA0yUprIvhIQNqpnVko0o8cvQ",
    authDomain: "push-notification-152502.firebaseapp.com",
    databaseURL: "https://push-notification-152502.firebaseio.com",
    projectId: "push-notification-152502",
    storageBucket: "push-notification-152502.appspot.com",
    messagingSenderId: "695645857567"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();
