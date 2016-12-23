// 서비스워커가 지원되는 브라우저라면...
if ('serviceWorker' in navigator) {
    // 서비스워커 등록
    navigator.serviceWorker.register('./service-worker.js')
        .then(registration => navigator.serviceWorker.ready)
        .then(registration => {// register sync
            document.getElementById('requestButton').addEventListener('click', () => {
                registration.sync.register('image-fetch').then(() => {
                    console.log('Sync registered');
                });
            });
        });
} else {    // service worker를 지원하지 않을때
    document.getElementById('requestButton').addEventListener('click', () => {
        console.log('Fallback to fetch the image as usual');
    });
}
