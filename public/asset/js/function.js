
var current_token = ""
var value_sort = "default"
var old_list = ""

function limit(text, count, insertDots){
    return text.slice(0, count) + (((text.length > count) && insertDots) ? "..." : "");
}
function validate(data){
    return data.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
function validateComment(data){
    return data.replace(/\\r\\n/g, "\n")
}
function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
function diffTime(dateNow, LastScan){
    const result = Math.abs(dateNow - LastScan) / 1000;
    const sec = Number(result);
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);
    var hour = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
    var minute = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
    var second = s > 0 ? s + (s == 1 ? " sec" : " secs") : sec+" sec";
    return hour + minute + second 
}

function date_format(date){
    day = date.getDate()
    month = date.getMonth()+1
    year = date.getFullYear()
    return "(" + padLeadingZeros(day, 2) + "/" + padLeadingZeros(month, 2) + "/" + year + ")" + " :" + " "
}