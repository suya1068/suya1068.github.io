if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        registration.pushManager.subscribe({userVisibleOnly: true})
            .then(function(subscription){
            isPushEnabled = true;
            console.log("subscription.subscriptionId: ", subscription.subscriptionId);
            console.log("subscription.endpoint: ", subscription.endpoint);
            return sendSubscriptionToServer(subscription);
        }).catch(function(e) {
            console.log("서버에 보내기 실패했엉", e);
        })
    }).catch(function(err) {
// registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
}
