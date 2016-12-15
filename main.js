/**
 * Created by suya1 on 2016-12-15.
 */
if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('/fsdevtest/sw.js', {
       scope: '/fsdevtest/'
   }).then (function(registration) {
       console.log("서비스 워커 등록 성공", registration.scope);
   }).catch (function(err) {
       console.log("서비스 워커 등록 실패", err);
   });
}