/**
 * Created by suya1 on 2016-12-21.
 */
onmessage = function(evt) {
    var num = evt.data;
    var result = 0;
    for(var i = 1; i <= num; i++)
    {
        result += i;
    }
    postMessage(result);
};