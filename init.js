// Initialize Firebase
function init () {
    const config = {
        apiKey: "AIzaSyBaWpWO4ClA0yUprIvhIQNqpnVko0o8cvQ",
        authDomain: "push-notification-152502.firebaseapp.com",
        databaseURL: "https://push-notification-152502.firebaseio.com",
        projectId: "push-notification-152502",
        storageBucket: "push-notification-152502.appspot.com",
        messagingSenderId: "695645857567"
    };
    firebase.initializeApp(config);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
    
    var CACHE_NAME = 'my-site-cache-v1';
    var urlsToCache = [
        '/',
        '/image'
    ];

    self.addEventListener('install', function(event) {
        // Perform install steps
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log('Opened cache');
                    return cache.addAll(urlsToCache);
                })
        );
    });

    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                        // Cache hit - return response
                        if (response) {
                            return response;
                        }
                        return fetch(event.request);
                    }
                )
        );
    });
}

export default init;
