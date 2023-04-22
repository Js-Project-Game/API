export function rgbToRgba(rgb, alpha) {
    let rgba = rgb.replace("rgb", "rgba");
    rgba = rgba.replace(")", ", " + alpha + ")");
    return rgba;
}

let milliseconds = new Date().getMilliseconds()
let seconds = new Date().getSeconds()

export let time = {
    Minutes: 0,
    Seconds: 0,
    Milliseconds: 0
}

export function GetTime() {
    //model: "00:00.000"
    let now_milliseconds = new Date().getMilliseconds();
    let now_seconds = new Date().getSeconds();
    if (now_milliseconds > milliseconds) {
        time.Milliseconds = now_milliseconds - milliseconds;
    } else if (now_milliseconds <= milliseconds){
        time.Milliseconds = (1000 + now_milliseconds) - milliseconds;
    }
    if (now_seconds > seconds) {
        time.Seconds = now_seconds - seconds;
    } else if (now_seconds <= seconds){
        time.Seconds = (60 + now_seconds) - seconds;
    }
    if (time.Seconds+1 === 60) {
        time.Minutes ++;
        time.Seconds = 0;
    }
}