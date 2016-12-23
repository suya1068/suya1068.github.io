self.addEventListener('sync', function (event) {
    if(event.tag == 'image-fetch') {
        event.waitUntil(fetchDogImage());
    }
});

function fetchDogImage () {
    fetch('./cat.jpg')
        .then(function (response){
            return response;
        })
        .then(function (text){
            console.log('Request successful', text);
        })
        .catch(function (error){
            console.log('Request failed', error);
        });
}

