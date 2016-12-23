let self = this;

// 푸시 메시지 이벤트
self.addEventListener('push', function(event) {
    // debugger;
    console.log('push 메시지', event);

    // 푸시 메시지 제목
    let title = 'Notification-push';
    // 푸시 메시지 내용
    let body = '새로운 업데이트가 있습니다. 클릭하면 페이지로 이동합니다..';
    // 푸시 아이콘에 넣을 이미지
    let icon = 'https://raw.githubusercontent.com/deanhume/typography/gh-pages/icons/typography.png';
    let tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        // 푸시 알림을 보여줌
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );
});

// 푸시 메시지 클릭 이벤트
self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.tag);
    // 푸시 메시지를 내리고
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window"
        }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow('https://suya1068.github.io');
            }
        })
    );
});

