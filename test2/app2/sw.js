self.addEventListener('push', function(e) {
    console.log(e);
    let body = e.data && JSON.parse(e.data.text()) ? JSON.parse(e.data.text()) : "";
    if (e.data) {
        body = JSON.parse(e.data.text()).body;
    } else {
        body = "Push message no payload"
    }
    console.log("body", body);
    const options = {
        body: body
        // icon: 'images/example.png'
    };
    e.waitUntil(
        self.registration.showNotification("새 알람 도착", options)
    );
});