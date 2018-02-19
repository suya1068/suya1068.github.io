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
}

export default init;
