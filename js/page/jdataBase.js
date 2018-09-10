var gw_IconImgArray = {
    "switch": {'imgUrl': "../resource/100mswitch.png", 'objId': null, 'validId': false},
    "iG2000": {'imgUrl': "../resource/ig2000.png", 'objId': null, 'validId': false},
    "iG1000": {'imgUrl': "../resource/ig1000.png", 'objId': null, 'validId': false},
     "host": {'imgUrl': "../resource/host.png", 'objId': null, 'validId': false},
    "sdn switch": {'imgUrl': "../resource/sdn switch.png", 'objId': null, 'validId': false},
    "wifi": {'imgUrl': "../resource/wifi.png", 'objId': null, 'validId': false},
    "monitor": {'imgUrl': "../resource/monitor.png", 'objId': null, 'validId': false},
    "printer": {'imgUrl': "../resource/printer.png", 'objId': null, 'validId': false},
    "server": {'imgUrl': "../resource/server.png", 'objId': null, 'validId': false},
    "roll machine": {'imgUrl': "../resource/roll machine.png", 'objId': null, 'validId': false},
    "branch": {'imgUrl': "../resource/branchCloud.png", 'objId': null, 'validId': false},
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
/**
 * 创建拓扑视图根据不同的类型创建不同的分支
 * @param scene
 * @param data
 */
function topoGetSuccess(scene,data) {
    var viewObj,nodes,links,createNodeHide,json_type,Node,g_BasePos;
    $.each(data,function (i,view) {
        viewObj = view.result;
        nodes = viewObj[0].nodes;
        links = viewObj[0].links;
        for(var j = 0; j<nodes.length; j++){
            json_type  = nodes[j]["type"];
            if(nodes[j].id.PrimeKey == 0){
                g_BasePos = nodes[j].location.x;
            }
            var Pos = new NodePostion(nodes[j]["location"]["x"],nodes[j]["location"]["y"]);
            if(json_type == "branch"){
                canvas.width = 1700;
                canvas.height = 1150;
                if(!gw_IconImgArray["branch"].validId){
                    console.log("topoGetSuccess but branch image not ready!");
                }
                Node = new GW_BranchNode({
                    "scene":scene,
                    "node":nodes[j],
                    "type":"branch",
                    "nodeIcons":gw_IconImgArray
                })
                //Node = new GW_BranchNode(scene,Pos,gw_IconImgArray["branch"].objId,nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type,nodes[j]);
                //hidePos = new NodePostion(Pos.x+130,Pos.y+200);
                // createNodeHide = new GW_Node(scene,hidePos,"hide",null,null);
                //buildAndSetBkImg(Node,"branch",nodes[j]);
            }else if(json_type == "Depart"){
                Node = new GW_DomainNode(scene,Pos,gw_IconImgArray["domain"].objId,nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type);
                //buildAndSetBkImg(Node,"branch",nodes[j]);
            }else{
                Node = new GW_Node(scene,Pos,gw_IconImgArray[json_type].objId,nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type);

            }
        }
    })
    /*for (var i = 0; i < data.length; i++) {
        viewObj = data[i].result;
        nodes = viewObj[0].nodes;
        links = viewObj[0].links;

        for (var j = 0; j < nodes.length; j++) {
            //找出PrimeKey为0的X坐标，用于后面造图片判断使用哪组坐标队列


            if(json_type == "branch"){
                canvas.width = 1700;
                canvas.height = 1150;

                 if(gw_IconImgArray["branch"].validId == false){
                      //setTimeout(topoGetSuccess(scene,data),150);
                      console.log("topoGetSuccess but branch image not ready!");
                  }

                Node = new GW_BranchNode(scene,Pos,gw_IconImgArray["branch"].objId,
                    nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type,nodes[j]);


                //hidePos = new NodePostion(Pos.x+130,Pos.y+200);
               // createNodeHide = new GW_Node(scene,hidePos,"hide",null,null);

                //buildAndSetBkImg(Node,"branch",nodes[j]);


            }
            else if(json_type == "Depart"){
                /!*Node = new GW_DomainNode(scene,Pos,gw_IconImgArray["domain"].objId,
                    nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type);*!/

                //buildAndSetBkImg(Node,"domain",nodes[j]);
                WG();
            }
            else{
                Node = new GW_Node(scene,Pos,gw_IconImgArray[json_type].objId,nodes[j].id.Name,nodes[j].id.PrimeKey,nodes[j].type);

            }

        }
        /!*
            for (var j = 0; j < links.length; j++) {
            var refNodeA = links[j].endpoint[0].refNode;
            var refNodeB = links[j].endpoint[1].refNode;
            var NodeA = scene.NodeArray[refNodeA];
            var NodeB = scene.NodeArray[refNodeB];
            var type =  scene.NodeArray[links[j].media];
            var name =  scene.NodeArray[links[j].id.Name];
            var key  =  scene.NodeArray[links[j].id.PrimeKey];
            if(json_type == "branch") {
                NodeA = createNodeHide;
            }
            var Link = new GW_Line(scene,NodeA,NodeB,type,name,key);
            scene.LinkAdd(Link) ;
        } *!/
    }*/
    g_CurSence = scene;
    createHideLinkForMannul();
}


function topoGetFailure (data) {
    alert("load page data error.");
}

//需在json数据中确保几种组合下的边界设备位置都在数组最后一个。
var g_LeftTopoPos = [,,,
    [{"x":100,"y":50},{"x":150,"y":90},{"x":180,"y":30}],
    [{"x":100,"y":50},{"x":150,"y":90},{"x":120,"y":60},{"x":180,"y":30}],
    [{"x":100,"y":50},{"x":150,"y":90},{"x":120,"y":60},{"x":130,"y":60},{"x":180,"y":30}]];

var g_RightTopoPos = [,,,
    [{"x":70,"y":100},{"x":150,"y":120},{"x":50,"y":55}],
    [{"x":130,"y":120},{"x":60,"y":120},{"x":180,"y":100},{"x":50,"y":55}],
    [{"x":80,"y":80},{"x":60,"y":120},{"x":200,"y":100},{"x":130,"y":60},{"x":50,"y":55}]];

var g_TopoPos = [,,,
    [{"x":80,"y":80},{"x":200,"y":100},{"x":135,"y":160}],
    [{"x":80,"y":80},{"x":60,"y":120},{"x":200,"y":100},{"x":135,"y":160}],
    [{"x":80,"y":80},{"x":60,"y":120},{"x":200,"y":100},{"x":130,"y":60},{"x":135,"y":160}]];


function  buildImagOnloadCall(data,image,Node,nodeType){
    gw_IconImgArray[imgIndex].objId = image;
    gw_IconImgArray[imgIndex].validId = true;
    buildAndSetBkImg(Node,nodeType,data);
}
/**
 * 创建背景设置图片
 * @param in_Node 当前节点对象
 * @param Type 节点类型
 * @param data 节点数据
 */
function buildAndSetBkImg(in_Node,Type,data) {
    //debugger;
    return;
    var canvas = document.getElementById('canvas_bkimg');
    canvas.width = 300;
    canvas.height = 200;
    var g_tmpStage =  new GW_stage(canvas);
    var g_tmpScene = new GW_Scene(g_tmpStage, "tmpScene");
    g_tmpScene.clearScene();
    g_tmpScene.SetState("visible");
    //var nodes;
    var devType = data.devType;
    var edgeNodeIndex;
    var edgeType = data.EdgeDevice.Type;
    if (Type == "branch") {
        if (gw_IconImgArray["branch"].validId == true) {
            g_tmpScene.SetBkGround(gw_IconImgArray["branch"].objId);
        }
        else {
            console.log("scene branch background image load not finished!");
        }
    }
    else if (Type == "domain") {
        if (gw_IconImgArray["domain"].validId == true) {
            g_tmpScene.SetBkGround(gw_IconImgArray["domain"].objId);
        }
        else {
            console.log("scene customDomain background image load not finished!");
        }
    }
    else
        return;

    //建立背景图
    var nodeType;
    if(devType.length< 3){
       for(var j=devType.length;j<4;j++)
           devType[j] = "host";
   }
    //{
        //判断使用哪种坐标队列
        var PosArray = g_LeftTopoPos; //Default value
        var chkPos = data.location.x;

        if(data.id.PrimeKey == 0) {
            PosArray = g_TopoPos;
        }else {
            if (chkPos < g_BasePos)
                PosArray = g_LeftTopoPos;
            else
                PosArray = g_RightTopoPos;
        }
        for(var i=0;i<devType.length;i++){
            var Pos = new NodePostion(PosArray[devType.length][i].x,
                PosArray[devType.length][i].y);


            if(gw_IconImgArray[devType[i]] == undefined ){
                console.log(devType[i]+"undefined!");
                nodeType = "host"; //异常设置default 为host主机

            }
            else{
                nodeType = devType[i];
            }
            var image     = gw_IconImgArray[nodeType].objId;
            var validFlag =  gw_IconImgArray[nodeType].validId;
            if(validFlag == false){
                image.onload = buildImagOnloadCall(date,image,in_Node,nodeType);
               return;
            }
            var Node = new GW_Node(g_tmpScene,Pos,image,"",i);
            if(nodeType == edgeType){
                edgeNodeIndex = i;
            }
            g_tmpScene.NodeAdd(Node);
        }
        NodeA = g_tmpScene.NodeArray[edgeNodeIndex];
        for(var i=0;i<devType.length;i++)
        {
            NodeB = g_tmpScene.NodeArray[i];
            if(i == edgeNodeIndex)
                continue;
            else {
                if((NodeA == undefined) || (NodeB == undefined))
                {
                    console.log("Line  NodeA or NodeB undefined!");
                    continue;
                }
                var Line = new GW_Line(g_tmpScene,NodeA,NodeB,"DarkLine","",i);
            }
        }
    //}
    for(var i in g_tmpScene.NodeArray){
        delete g_tmpScene.NodeArray[i];
    }
    debugger;
    setTimeout(function () {
        var newbkImage = g_tmpStage.SaveImage();
        in_Node.SetImage(newbkImage);
        g_tmpScene.SetState("invisible");
    },100)
}

//实现scence的切换功能
function  stageDbClick(GW_stage,GW_scene,GW_Node){
    var sceneName;
    var req;
    //处理场景切换
    //隐藏当前场景
    GW_scene.SetState("invisible");
    //curLevSecenName = GW_scene.PrimeKey;
    //console.log(GW_Node);
    //遍历scene,确认node对应的下一级场景是否存在，存在则显示，不存在则重新获取json数据

    if(GW_Node.Type == "branch" || GW_Node.Type == "Depart"){ //进入下一级
        if(GW_Node.Type == "branch")
            req = "loadDomainView";
        else if(GW_Node.Type == "Depart")
            req = "loadTopoView";
        //判断是否已经加载过
        //var sceneName = GW_Node.PrimeKey; robert
        sceneName = GW_Node.Type + "&" + GW_Node.PrimeKey;
        var scene = GW_stage.SceneArray[sceneName];
        if(scene != undefined){
            scene.SetState("visible");
            g_CurSence = scene;
            //return;
        }
        else{//重新加载
            var postJsonArray = [];
            postJsonArray.push(createPostData("Topo.View",req));
            ajaxJsonPost(postJsonArray, function(data){
                if(data[0].success){
                    var secen = new GW_Scene(GW_stage, sceneName);
                    tmpData = data;
                    topoGetSuccess(secen, tmpData);
                }

            }, TopoDbError);

            /*debugger;
            var topoId = setInterval(function () {
                if(tmpDataStatus == 1) {
                    topoGetSuccess(secen, tmpData);
                    tmpDataStatus = 0;
                    clearInterval(topoId);
                }
            },150)*/
        }
        navMenu(GW_stage,GW_scene,GW_Node);
    }
    else
    { //do nothing
    }
}

/*var TopoDbSuccess = function (data) {
    if(data[0].success){
        var secen = new GW_Scene(GW_stage, sceneName);
        tmpDataStatus = 1;
        tmpData = data;
        topoGetSuccess(secen, tmpData);
    }else{
        tmpDataStatus = 0;
        tmpData = [];
    }

}*/

var TopoDbError = function (data) {
    alert("Error:" + JSON.stringify(data, null, 2));
}

function stagePrvScene(obj) {
    //var curSecenName = GW_scene.PrimeKey;
    //var lenIndex = curSecenName.lastIndexOf("&");
    //var PrevSecenName = curSecenName.substr(0,lenIndex);
    var navId = $(obj).attr("id");
    var navText = $(obj).text();

    var sence = g_CurStage.SceneArray[navId];
    if(sence == undefined){//应该不会发生

    }else{
        g_CurSence.SetState("invisible");
        sence.SetState("visible");
        g_CurSence = sence;

        if(navId == "branch")
            $("#navLink").html("<span class=\"c-gray en\">&gt;</span> " + navText);
        else if(navId.indexOf("&") != -1)
            $("#navLink").html("<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"branch\" onclick=\"stagePrvScene(this)\">分支机构</a> " +
                "<span class=\"c-gray en\">&gt;</span>" + navText );

    }
}

function navMenu(menuStage,menuScene,menuNode) {

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
}
//首次创造拓扑
function  InitLoadTopo() {
    var canvas = document.getElementById('canvas');
    var stage = new GW_stage(canvas);

    g_CurStage  = stage;
    g_CurStage.regDbClick(stageDbClick);

    canvas.width = 1700;
    canvas.height = 1150;
    var postJsonArray = new Array();
    postJsonArray.push(createPostData("Topo.View","loadBranchView"));
    ajaxJsonPost(postJsonArray, TopoReqSuccess, TopoReqError);
}

var TopoReqSuccess = function (data) {
    var secen = new GW_Scene(g_CurStage, "branch");
    //console.log(data);
    //secen.GetObjId().background = '../../resource/bg.jpg';
    g_CurSence = secen;
    topoGetSuccess(secen, data);
    $("#navLink").html("<span class=\"c-gray en\">&gt;</span> 分支机构 ");

}

var TopoReqError = function (data) {
    alert("Error:" + JSON.stringify(data, null, 2));
}

function createHideNode(op,node,nodeHide,nodeText)
{
    //取到显示节点位置坐标
    var oldLeft = node.GW_Node().GW_Node().getBound().left;
    var oldTop = node.GW_Node().GW_Node().getBound().top;
    var newLeft;
    var newTop;
    var offLeft;
    var offTop;

    //取到隐藏节点位置坐标
    if(op == "branch")
    {
        var newHideLeft;
        var newHideTop;

        var oldHideLeft = nodeHide.GW_Node().getBound().left;
        var oldHideTop = nodeHide.GW_Node().getBound().top;
    }

    //取到文本节点位置坐标
    var newTextLeft;
    var newTextTop;
    var oldTextLeft = nodeText.GW_TextNode().getBound().left;
    var oldTextTop = nodeText.GW_TextNode().getBound().top;




    node.GW_Node().GW_Node().mousedrag(function (event){
        //计算位移动
        newLeft = node.GW_Node().GW_Node().getBound().left;
        newTop = node.GW_Node().GW_Node().getBound().top;
        offLeft = oldLeft - newLeft;
        offTop = oldTop - newTop;

        //改变隐藏节点坐标
        if(op == "branch")
        {

            newHideLeft = oldHideLeft - offLeft;
            newHideTop = oldHideTop - offTop;
            nodeHide.GW_Node().setLocation(newHideLeft, newHideTop);
        }

        //改变文本节点坐标
        newTextLeft = oldTextLeft - offLeft;
        newTextTop = oldTextTop - offTop;
        nodeText.GW_TextNode().setLocation(newTextLeft, newTextTop);

    });
}

