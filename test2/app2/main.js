// import axios from "axios";

let message = "";
let isSubscribe = false;
let swReg = "";

let senderType = "";
let receiverType = "";
let tag = "";

const button = document.getElementById("push-test");
const subscribe = document.getElementById("subscribe-test");
const messagePushButton = document.getElementById("button-message-push");

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js')
        .then(function(reg) {
            console.log('Service Worker Registered!', reg);

            swReg = reg;
            initailizeUI();
        })
        .catch(function(err) {
            console.log('Service Worker registration failed: ', err);
        });
}

function initailizeUI() {
    subscribe.addEventListener("click", function () {
        console.log(isSubscribe);
        if (isSubscribe) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    swReg.pushManager.getSubscription().then(function(sub) {
        if (sub === null) {
            // Update UI to ask user to register for Push
            console.log('Not subscribed to push service!');
        } else {
            // We have a subscription, update the database
            console.log('Subscription object: ', sub);
        }
        updateBtn();
    });
}

function unsubscribeUser() {
    swReg.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (err) {
            console.log("error unsubscribing", err);
        })
        .then(function () {
            console.log("User is unsubscribed");
            isSubscribe = false;

            updateBtn();
        });
}

function updateBtn() {
    if (isSubscribe) {
        subscribe.textContent = "구독 중";
    } else {
        subscribe.textContent = "미구독 중";
    }
}

function subscribeUser() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(reg) {
            isSubscribe = true;
            updateBtn();
            reg.pushManager.subscribe({
                userVisibleOnly: true,
            }).then(function(sub) {
                console.log('Endpoint URL: ', sub.endpoint);
                axios.post("http://127.0.0.1:3000/push", {
                    pushSubscription: sub
                });
            }).catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
            });
        })
    }
}

Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
});

function displayNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            console.log("reg", reg);
            let title = "";
            const options = {};
            console.log(senderType, receiverType);
            if (senderType && receiverType) {
                if (senderType === "customer" && receiverType === "artist") {
                    title = "[김작가] 님의 메시지";
                    options.body = "김작가님의 메시지가 도착하였습니다.";
                } else if (senderType === "artist" && receiverType === "customer") {
                    title = "[김고객] 님의 메시지";
                    options.body = "김고객님의 메시지가 도착하였습니다.";
                } else {
                    title = "[포스냅] 고객센터";
                    options.body = "고객센터에서 메시지가 도착했습니다."
                }
                options.tag = tag;
            } else {
                title = "푸쉬 날리기 테스트";
                options.body = "테스트 테스트 테스트테스트 테스트 테스트테스트 테스트 테스트테스트 테스트 테스트테스트 테스트 테스트";
            }
            options.badge = "./image/badge.png";
            options.icon = "./image/logo-icon.png";
            reg.showNotification(title, options);
        });
    }
}

function sendToMessage() {
    console.log(message);
    axios.post("http://127.0.0.1:3000/send", {
        message: message
    });
}

function setMessage() {
    const messageInput = document.getElementById("push-input-message");

    console.log(messageInput.value);
    message = messageInput.value.toString();
}

function setSenderData(e, name) {
    senderType = name;
    tag = name;
    const test = document.getElementsByName("receiver_form")[0].children;
    for (let i = 0; i < test.length; i += 1) {
        const inputItem = test[i].querySelector("input");
        inputItem.checked = "";
        if (inputItem.value === name) {
            inputItem.disabled = "disabled";
        } else {
            inputItem.disabled = "";
        }
    }
}

function setReceiverData(e, name) {
    receiverType = name;
}

button.addEventListener("click", displayNotification);
messagePushButton.addEventListener("click", sendToMessage);
// subscribe.addEventListener("click", subscribeUser);
// messageInput.addEventListener("change", setMessage);