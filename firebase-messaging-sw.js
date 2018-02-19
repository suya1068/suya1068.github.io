importScripts("https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js");

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBaWpWO4ClA0yUprIvhIQNqpnVko0o8cvQ",
    authDomain: "push-notification-152502.firebaseapp.com",
    databaseURL: "https://push-notification-152502.firebaseio.com",
    projectId: "push-notification-152502",
    storageBucket: "push-notification-152502.appspot.com",
    messagingSenderId: "695645857567"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

// 백그라운드 메시지는 서비스 워커 안에서 이뤄져야 함.
// 웹 페이지가 열려있지 않을때에만 동작
messaging.setBackgroundMessageHandler(function (payload) {
    window.alert("background: " + payload);
    const title = payload.data.title;
    const options = {
        body: payload.data.body,
        icon: payload.data.icon
    };
    return self.registration.showNotification(title, options);
});

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/image/logo.png',
    '/image/logo_144.png',
    '/image/logo_192.png'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache', cache);
                return cache.addAll(urlsToCache);
            }).catch(function (error) {
            console.log("cache faile", error);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                console.log(response);
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
