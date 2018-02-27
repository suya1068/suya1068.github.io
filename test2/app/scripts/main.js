/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, es6 */

'use strict';
const applicationServerPublicKey = 'BJsCOvXQ_NmTsPaDwlPmKnWBBjFQuTNUhBB3YwqidcvDW9wQGTDGcn6ZgNgx45CPl0SNvhp8whEBgtDvnhgxuIg';
const test = document.getElementById("input-public-key").value;

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log("service worker and push is supported!");
    navigator.serviceWorker.register("sw.js")
        .then(function (swReg) {
            console.log("service worker is registered", swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.log("service worker error", error);
        });
} else {
    console.warn('push messaging is not supported');
    pushButton.textContent = "push not supported";
}

function initializeUI() {
    pushButton.addEventListener("click", function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log("user IS subscribed.");
            } else {
                console.log("User is NOT subscribed");
            }
            updateBtn();
        });
}

function updateBtn() {
    if (Notification.permission === "denied") {
        pushButton.textContent = "Push messaging Blocked.";
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = "disable push messaging";
    } else {
        pushButton.textContent = "enable push messaging";
    }
    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerPublicKey = document.querySelector("#input-public-key").value;
    if (applicationServerPublicKey === "") {
        alert("공개키 입력해주세요.");
        return;
    }
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    console.log("applicationServerKey", applicationServerKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log("user is subscribed.", subscription);

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function (err) {
            console.log("failed to subscribe the user", err);
            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (err) {
            console.log("error unsubscribing", err);
        })
        .then(function () {
            updateSubscriptionOnServer(null);
            console.log("User is unsubscribed");
            isSubscribed = false;

            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {
    const subscriptionJSON = document.querySelector(".js-subscription-json");
    const subscriptionDetails = document.querySelector(".js-subscription-details");

    if (subscription) {
        subscriptionJSON.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove("is-invisible");
    } else {
        subscriptionDetails.classList.add("is-invisible");
    }
}
