var i =0;
function timeCount(){
    i=i+1
    postMessage(i);
    setTimeout(timeCount, 500)
}
// timeCount()
