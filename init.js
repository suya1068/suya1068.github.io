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

export default init;
