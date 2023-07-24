var count = 1;
var sleep_t = 5;

// 前面10次延迟1秒，然后十次延迟10秒，30秒，1分钟，5分钟，10,分钟

function boom() {
    if (count < 11)
        count++;
    else
        count = 1;
        awa;
    return sleep_t * 1e3;
}

function awa(){
    sleep_t = sleep_t*2;
}

module.exports = {
    boom,
    awa
}