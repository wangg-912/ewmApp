


function getPos(ev){
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    return{x: ev.clientX+scrollLeft, y: ev.clientY+scrollTop};
}
function getStyle(obj,name){
    if(obj.currentStyle){
        return obj.currentStyle[name];
    }
    else{
        return getComputedStyle(obj,false)[name];
    }
}
var oDiv = document.getElementById('play');
var oDiv2 = document.getElementById('outer');
var oBox = document.getElementById('inner');
oDiv.onmousedown = function(ev){
    var oEvent = ev || event;
    var pos = getPos(oEvent);
    var disx = pos.x - parseInt(getStyle(oDiv,'left'));
    document.onmousemove = function(ev){
        var oEvent = ev || event;
        var pos = getPos(oEvent);
        var l = pos.x - disx;
        if (l<0) {
            l=0;
        }
        if (l>parseInt(getStyle(oDiv2,'width')) - parseInt(getStyle(oDiv,'width'))) {
            l=parseInt(getStyle(oDiv2,'width')) - parseInt(getStyle(oDiv,'width'))
        }
        oDiv.style.left = l + 'px';
        oBox.style.width = l + 'px';
        //oBox.style.height = l/2 + 'px';
        //oBox.style.opacity = l/800;
    }
    document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;
    }
    return false;
}


function SlibarChangeStateImg(obj){
    var state = obj.getAttribute("state");
    if(state == "play")
    {
        obj.style.backgroundImage = "url(../resource/pause.png)";
        obj.setAttribute("state","pause");
    }
    else{
        obj.style.backgroundImage = "url(../resource/play.png)";
        obj.setAttribute("state","play");
    }

}