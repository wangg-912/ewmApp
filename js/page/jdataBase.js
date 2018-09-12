var gw_IconImgArray = {
    "switch": {'imgUrl': "../resource/100mswitch.png", 'objId': null, 'validId': false},
    "iG2000": {'imgUrl': "../resource/ig2000.png", 'objId': null, 'validId': false},
    "iG1000": {'imgUrl': "../resource/ig1000.png", 'objId': null, 'validId': false},
     "host": {'imgUrl': "../resource/host.png", 'objId': null, 'validId': false},
    "sdn switch": {'imgUrl': "../resource/sdn switch.png", 'objId': null, 'validId': false},
    "wifi": {'imgUrl': "../resource/wifi.png", 'objId': null, 'validId': false},
    "monitor": {'imgUrl': "../resource/monitor.png", 'objId': null, 'validId': false},
    "printer": {'imgUrl': "../resource/printer.png", 'objId': null, 'validId': false},
    "server": {'imgUrl': "../resource/server.jpg", 'objId': null, 'validId': false},
    "roll machine": {'imgUrl': "../resource/roll machine.png", 'objId': null, 'validId': false},
    "branch": {'imgUrl': "../resource/branchCloud.png", 'objId': null, 'validId': false},
    "firewall": {'imgUrl': "../resource/logic/NetDevice/firewall_s0.png", 'objId': null, 'validId': false},
    "domain": {'imgUrl': "../resource/domain.png", 'objId': null, 'validId': false}
};
function  PreLoagImageFinsish(imgIndex,image) {
    console.log(imgIndex + " image load ok!");
    gw_IconImgArray[imgIndex].objId = image;
    gw_IconImgArray[imgIndex].validId = true;
}
/*
    在系统加载时，提前将图片资源加载，以便后续生成背景使用
 */
function  PreLoadImageResoure() {
     var  image;

    for(var i  in gw_IconImgArray){
        image = new Image();
        image.src = gw_IconImgArray[i].imgUrl;
        gw_IconImgArray[i].objId = image;

        image.onload = PreLoagImageFinsish(i,image);
    }
}


/*function navMenu(menuStage,menuScene,menuNode) {

    //g_Prev = menuScene.PrimeKey;
    //g_PrevNode = menuNode.Type;

    if( menuNode.Type == "branch" ) {
        $("#navLink").html("<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"" + menuScene.PrimeKey + "\" onclick=\"stagePrvScene(this)\">分支机构</a> <span class=\"c-gray en\">&gt;</span> " + menuNode.Name);
        //g_PrevBranchId = menuScene.PrimeKey;
        g_PrevDepartName = menuNode.Name;
    }
    else if(menuNode.Type == "Depart")
        $("#navLink").html("<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"branch\" onclick=\"stagePrvScene(this)\">分支机构</a> " +
            "<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"" + menuScene.PrimeKey + "\" onclick=\"stagePrvScene(this)\">" + g_PrevDepartName +"</a>" +
            "<span id='detail' class=\"c-gray en\">&gt;</span> "+ menuNode.Name);
}*/




