(function (global, func) {
    if ('serviceWorker' in navigator) {
        alert('use service worker.');
        func();
    } else {
        alert('not use service worker.');
    }
})(window || self, function () {
    var config = {
        apiKey: "AIzaSyBaWpWO4ClA0yUprIvhIQNqpnVko0o8cvQ",
        authDomain: "push-notification-152502.firebaseapp.com",
        databaseURL: "https://push-notification-152502.firebaseio.com",
        projectId: "push-notification-152502",
        storageBucket: "push-notification-152502.appspot.com",
        messagingSenderId: "695645857567"
    };
    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    let testToken;

// const instance = axios.create({
//     baseURL: 'https://fcm.googleapis.com/fcm/send',
//     timeout: 1000,
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": "key=AAAAofe5Zx8:APA91bFN5BYn34PhZHqTxsTAK-8jKUjwSqps4NqlSIXL4PozUDpk_HFq_djSPmrTAtr_4QWinpQ42hxKXEOKf002IzvWHmtNKsJixKt4pYM9FSUMXsnUg8-Cy4GUsyU6uvaHChEU63Xt"
//     }
// });

//사용자가 메시지를 열람할 것인지 물어봐야 함.
    messaging.requestPermission().then(function () {
        //사용자가 허용했다면 별도의 알람 없이 진행하고..
        console.log("Have permissiong");
        //토큰을 얻고 promise를 리턴.
        return messaging.getToken();
    })
        .then(function (token) {
            console.log("token", token);
            const node = document.getElementById('token');
            node.innerHTML = token;
            node.addEventListener('click', function () {
                this.select();
            });

            testToken = token;
        })
        .catch(function (error) {
            //사용자가 허용하지 않았다면 메시지를 더이상 보내지 못한다는 사실을 알려줘야 함.
            console.log("error occured");        //테스트를 위해 그냥 콘솔만.
        });
    /*
     data : {
     "to": token,
     "notification": {
     "title": "Hello",
     "body": "world"
     }
     }
     */

    messaging.onMessage(function(payload) {
        console.log("onMessage: ", payload);
    });

// function testHTTP() {
//     instance.post("", {
//         "to": testToken,
//         "notification": {
//             "title": "Hello",
//             "body": "world"
//         }
//     }).then(function (response) {
//         console.log(response);
//     }).catch(function (error) {
//         console.log(error);
//     });
// }

// axios({
//     method: 'post',
//     url: 'https://fcm.googleapis.com/fcm/send',
//     data: {
//         notification: {
//             "title": "Hello",
//             "body": "world"
//         }
//     }
// });
// var bigOne = document.getElementById("bigOne");
// var dbRef = firebase.database().ref().child("text");
// dbRef.on("value", snap => bigOne.innerText = snap.val());
// var httpRequest;
// document.getElementById("testButton").onclick = function() {
//     if (window.XMLHttpRequest) {
//         httpRequest = new XMLHttpRequest();
//     } else if (window.ActiveXObject) {
//         try {
//             httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
//         } catch (e) {
//             try {
//                 httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
//             } catch (e) {}
//         }
//     }
//
//     if (!httpRequest) {
//         alert("Giving up : ( Cannot create an XMLHTTP instance");
//         return false;
//     }
//
//     httpRequest.onreadystatechange = alertContents;
//     httpRequest.open("GET", "https://fcm.googleapis.com/fcm/send");
//     httpRequest.send();
//
//     function alertContents() {
//         if (httpRequest.readyState === 4) {
//             if (httpRequest.status === 200) {
//                 alert(httpRequest.responseText);
//             } else {
//                 alert('There was a problem with the request.');
//             }
//         }
//     }
// };

});
