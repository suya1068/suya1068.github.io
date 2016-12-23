if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
        // 서비스워커 등록 성공
        console.log('service worker 등록 성공: ', registration.scope);
        registration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription){
            isPushEnabled = true;
            console.log("subscription.subscriptionId: ", subscription.subscriptionId);
            console.log("subscription.endpoint: ", subscription.endpoint);
            return sendSubscriptionToServer(subscription);
        }).catch(function(e) {
            console.log("메시지 전송에 실패했습니다.", e);
        })
    }).catch(function(err) {
        // service worker 등록 실패
        console.log('service worker 등록 실패: ', err);
    });
}

// send subscription id to server
function sendSubscriptionToServer(subscription) {
    // 서버에 보낼 메시지..
    console.log(subscription);
}
