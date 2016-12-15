/**
 * Created by suya1 on 2016-12-15.
 */
self.addEventListener('install', function(event) {
    event.waitUntil (
        caches.open('cache-name').then(function(cache) {
            return cache.addAll([
                '/'
            ]);
        }).then(function() {
            console.log('설치완료');
        }).catch(function() {
            console.log('설치실패');
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.reqeust).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
