/**
 * ==============================================================================
 * 重构Topo整体
 * 作者 by wanggang
 * 日期 2018-09-07
 * ==============================================================================
 */
/**
 * 注册GW命名空间
 */
;(function() {
    var root = this;

    var GW = function(obj) {
        if (obj instanceof GW) return obj;
        if (!(this instanceof GW)) return new GW(obj);
    };
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = GW;
        }
        exports.GW = GW;
    } else {
        root.GW = GW;
    }
    GW.VERSION = '0.0.1';
}).call(this);
/**
 * =============================================================
 * TOPO 相关
 * 重构 by wanggang
 * 日期 2018-09-07
 * =============================================================
 */
/**
 * 创建hover事件
 * @param d
 */
function topoNodeToolTipHandler(d, data, type) {
    console.log(data);
    var e = canvas.getBoundingClientRect();
    var a = Math.floor(d.clientX - e.left * (canvas.width / e.width) + canvas.offsetLeft + 16);
    var b = Math.floor(d.clientY - e.top * (canvas.height / e.height) + canvas.offsetTop + 16);
    if (type == null) {} else {
        switch (type) {
            case "branch":
                //PrimeKey: 1, Name: "成都分支"
                $("#toolTip").html("<li>分支ID:" + data.PrimeKey + "</li><li>分支名称:" + data.Name + "</li>");
                break;
            case "edge":
                $("#toolTip").html("<li>出口设备:" + data.Name + "</li><li>设备类型:" + data.Type + "</li>");
                break;
            case "device":
                $("#toolTip").html("<li>设备类型:" + data + "</li>");
                break;
            case "xx":

                break;
            default:
                $("#toolTip").html(" ");
                break
        }
    }
    $("#toolTip").css({ top: b, left: a }).show()
}
/**
 * 移除事件对象，防止事件污染
 */
function removeTopoTipHandler() {
    $("#toolTip").html("").hide();
}
//计算str的像素宽度
function calcStringPixelsCount(str, strFontSize) {
    // 字符串字符个数
    var stringCharsCount = str.length;
    // 字符串像素个数
    var stringPixelsCount = 0;
    // JS 创建HTML元素：span
    var elementPixelsLengthRuler = document.createElement("span");
    elementPixelsLengthRuler.style.fontSize = strFontSize; // 设置span的fontsize
    elementPixelsLengthRuler.style.visibility = "hidden"; // 设置span不可见
    elementPixelsLengthRuler.style.display = "inline-block";
    elementPixelsLengthRuler.style.wordBreak = "break-all !important"; // 打断单词
    // 添加span
    document.body.appendChild(elementPixelsLengthRuler);
    for (var i = 0; i < stringCharsCount; i++) {
        // 判断字符是否为空格，如果是用&nbsp;替代，原因如下：
        // 1）span计算单个空格字符（ ），其像素长度为0
        // 2）空格字符在字符串的开头或者结果，计算时会忽略字符串
        if (str[i] == " ") {
            elementPixelsLengthRuler.innerHTML = "&nbsp;";
        } else {
            elementPixelsLengthRuler.innerHTML = str[i];
        }

        stringPixelsCount += elementPixelsLengthRuler.offsetWidth;
    }
    return stringPixelsCount;
}

/**
 * 初始化拓扑
 * @param canvasID canvas的ID
 * @param isShowTopoBar 是否显示工具栏
 */

function loadTopo(params, successCallback, errorCallback) {
    $.ajax({
        url: "/cmd",
        type: "POST",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            //console.info(" --> ajaxJsonPost success: " + JSON.stringify(data, null, 2));
            successCallback && successCallback(data);
        },
        failure: function(info) {
            //console.error(" --> ajaxJsonPost failure: " + JSON.stringify(data, null, 2));
            // _failure(data);
            errorCallback && errorCallback(info)
        }
    })
}
/**
 * 成功回调
 * @param data
 */
function successCall(data) {
    if (data.length && data[0].success) {
        switch (data[0].op){
            case "loadTopoView"://分支
                crumbsHandler({type:"top"});
                GW.scene ? GW.scene.clear(): GW.scene = new JTopo.Scene();
                loadBranchTopo(data[0].result);
                break;
            case "loadDomainView"://部门
                clearBranchTopo();
                GW.scene ? GW.scene.clear(): GW.scene = new JTopo.Scene();
                loadDeptTopo(data[0].result);
                break;
            default:
                //TODO
                break
        }

        createLinkForMannul();
    } else {
        alert("暂无数据！")
    }
}
/**
 * 失败回调
 * @param info
 */
function errorCall(info) {
    console.error(" --> ajaxJsonPost failure: " + JSON.stringify(info, null, 2));
}



//var canvas,stage,scene;
/**
 * 初始化Topo
 * @param canvasID 画布ID
 * @param stage 舞台
 * @param scene 场景
 * @return {JTopo.Scene|*|b}
 */
function initTopo(canvasID, stage, scene) {
    /**
     * canvas实例
     */
    GW.canvas = document.getElementById(canvasID);
    /**
     * stage实例
     */
    GW.stage = new JTopo.Stage(canvas);
    /**
     * scene实例
     */
    GW.scene = new JTopo.Scene();
    /**
     * scene实例id 默认为"";
     */
    GW.scene.id = "";

    /**
     * scene实例错误的Unicode字符串!"";
     */
    GW.scene.parentId = "";

    /**
     * 鹰眼
     */
    GW.stage.eagleEye.visible = false;
    GW.scene.translateY = 20;
    /**
     * 背景图
     * */
    GW.scene.background = '';
    /*if(params["scene.id"]!= undefined&&params["scene.id"]!=null){
     scene.id=params["scene.id"];
     }*/
    GW.scene.addEventListener("click",function (event) {
        $("#contextmenu").hide();
    })

    GW.stage.add(GW.scene);
    //GW.stage.addEventListener("dbclick", GW.dbClick);
    GW.dbClick = function (event) {
        if(!event.target) return false;
        var node = event.target;
        crumbsHandler(node);
        //debugger;
        loadDataByNode(node);
    }
    /*分支持久化*/
    GW._branch = {
        "center": null,
        "edge": [],
        "_b": {},
        "rs": {},
        "ls": {},
        "fs": {}
    };
    /*部门持久化*/
    GW._dept = {

    }
    /*叶子拓扑持久化*/
    GW.leaf = {

    }
    GW.linkTimer = null;
    GW.pieTimer = null;
    GW.serveTimer = null;
    return GW.scene;
}
function loadDataByNode(node) {
    var req = "";
    switch (node.type){
        case "top":
            req = "loadBranchView";
            break;
        case "branch":
            req = "loadDomainView";
            break;
        case "Depart":
            req = "loadTopoView";
            break;
    }
    loadTopo([{
        resource: "Topo.View",
        op:req
    }], successCall, errorCall);
}
function clearBranchTopo() {
    GW._branch = {
        "center": null,
        "edge": [],
        "_b": {},
        "rs": {},
        "ls": {},
        "fs": {}
    };
}
function clearDeptTopo() {
    GW._dept = {
    //TODO
    }
}
function clearLeafTopo() {
    GW._leaf = {
    //TODO
    }
}

/**
 * 设置canvas大小
 */
function setCanvasSize(opts) {
    GW.canvas.width = 1700;
    GW.canvas.height = 1300;
}
/*===========================================================================================
*  拓扑分支操作
* ===========================================================================================
* */
/**
 * 加载分支
 * @param result
 */
function loadBranchTopo(result) {
    if (result.length) {
        renderBranchTopo(result[0]);
    }
}
/**
 * 渲染分支Topo
 * @param data
 */
function renderBranchTopo(data) {
    var _links = data.links,
        _nodes = data.nodes;
    GW.branchLinks = _links;
    $.each(_nodes, function(i, node) {
        createBranch(node);
    });
    createEdgeDeviceLink();
}
/**
 * 创建分支
 * @param obj 分支数据
 */
function createBranch(obj) {
    createBackgroundNode(obj);
    (obj.EdgeDevice && !$.isEmptyObject(obj.EdgeDevice)) ? createEdgeDeviceNode(obj): null;
    createAutoIconNode(obj);
}
/**
 * 创建带背景图的节点
 * @param container 承载容器
 * @param obj 依赖数据
 */
function createBackgroundNode(obj) {
    var node = new JTopo.Node();
    node.setBound((obj.location.x), (obj.location.y), 300, 200);
    node.zIndex = 1;
    node.type = obj.type;
    node.primeKey = obj.id.PrimeKey;
    node.name = obj.id.Name;
    node.setImage("/resource/branchCloud.png");
    node.addEventListener("dbclick", GW.dbClick);
    GW.scene.add(node);

}
/**
 * 创建分支设备的出口设备节点并记录节点对应关系
 * @param container
 * @param obj
 */
function createEdgeDeviceNode(obj) {
    var edgeNode = new JTopo.Node();
    obj.id.PrimeKey == 0 ? edgeNode.setBound((obj.location.x) + 150, (obj.location.y) + 160, 60, 45) : edgeNode.setBound((obj.location.x) + 150, (obj.location.y), 60, 45);
    edgeNode.zIndex = 2;
    edgeNode.alpha = 1;
    edgeNode.fillColor = "255, 255, 255";
    //判断是否告警的操作；
    if(obj.alert !== "none"){
        edgeNode.alarm = obj.alert || "告警";
    }
    edgeNode.setImage(gw_IconImgArray[obj.EdgeDevice.Type].imgUrl);
    //(edgeNode);
    edgeNode.addEventListener("mouseover", function(event) {
        topoNodeToolTipHandler(event, obj.EdgeDevice, "edge");
    })
    edgeNode.addEventListener("mouseout", function(event) {
            removeTopoTipHandler();
    })
        //edgeNode.alarm = obj.alert;
    GW._branch._b[(obj.id.PrimeKey)] = edgeNode;
    GW.scene.add(edgeNode);
    obj.devType ? createBranchDriveIconNode(obj, edgeNode) : null;
    //obj.id.PrimeKey == 0 ? GW._branch.center = edgeNode :GW._branch.edge.push(edgeNode);
}
/**
 * 创建自定义图标节点
 * @param container
 * @param obj
 */
function createAutoIconNode(obj) {
    var iconNode = new JTopo.Node(obj.id.Name || "");
    iconNode.setBound((obj.location.x + 20), (obj.location.y + 20), 40, 40);
    iconNode.font = "bold 14px 微软雅黑";
    iconNode.fontColor = "30,144,255";
    iconNode.zIndex = 3;
    iconNode.addEventListener("mouseover", function(event) {
        topoNodeToolTipHandler(event, obj.id, "branch");
    })
    iconNode.addEventListener("mouseout", function(event) {
        removeTopoTipHandler();
    })
    obj.id.PrimeKey == 0 ? iconNode.setImage("/resource/logic/AreaDevice/louyu.png") : iconNode.setImage("/resource/logic/AreaDevice/wlzx.png");
    //container.add(iconNode);
    GW.scene.add(iconNode);
}
/**
 * 创建分支中的设备终端
 * @param container
 * @param obj
 * @param ccNode
 */
function createBranchDriveIconNode(obj, ccNode) {
    $.each(obj.devType, function(i, drive) {
        var iconUrl = gw_IconImgArray[drive].imgUrl;
        var driveNode = new JTopo.Node();
        driveNode.setBound((obj.location.x) + (i + 1) * 50, ((obj.location.y) + 100), 30, 30);
        driveNode.font = "12px 微软雅黑";
        driveNode.fontColor = "0,0,0";
        driveNode.zIndex = 4;
        driveNode.setImage(iconUrl);
        driveNode.addEventListener("mouseover", function(event) {
            topoNodeToolTipHandler(event, drive, "device");
        })
        driveNode.addEventListener("mouseout", function(event) {
            removeTopoTipHandler();
        })
        driveNode.addEventListener("mouseup", function(event) {
            if (event.button == 2) { // 右键
                // 当前位置弹出菜单（div）
                $("#contextmenu").css({
                    top: event.pageY,
                    left: event.pageX
                }).show();
            }
        });
        createDevLink(ccNode, driveNode);
        //container.add(driveNode);
        GW.scene.add(driveNode);
    })

}
/**
 * 创建分支内部设备连线
 * @param container
 * @param cc 出口设备
 * @param ct 分之内当前设备
 */
function createDevLink(cc, ct) {
    var link = new JTopo.Link(cc, ct);
    //container.add(link);
    link.strokeColor = "65,105,225";
    link.lineWidth = 0.5;
    GW.scene.add(link);
}
/**
 * 创建出口设备连线逻辑
 */
function createEdgeDeviceLink() {
    $.each(GW.branchLinks, function(i, ls) {
            var alarm = ls.alert,
                tep = ls.endpoint,
                fromId = tep[0].refNode || "0",
                toId = tep[1].refNode || "";
            if (fromId && toId) {
                var flink = alarm != "none"? newAlarmFoldLink(GW._branch._b[fromId], GW._branch._b[toId], '', 'vertical',2) :newFoldLink(GW._branch._b[fromId], GW._branch._b[toId], '', 'vertical');
                GW._branch.ls[(tep[0].refNode + "-" + tep[1].refNode)] = flink;
            }
        })
}
/**
 * 出口设备连线操作
 * @param nodeA
 * @param nodeZ
 * @param text
 * @param direction
 * @param dashedPattern
 * @return {*|g}
 */
function newFoldLink(nodeA, nodeZ, text, direction, dashedPattern) {
    //var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
    var link = new JTopo.Link(nodeA, nodeZ, text);
    //var link = new JTopo.FoldLink(nodeA, nodeZ,text);
   // link.arrowsRadius = 8;
    link.lineWidth = 0.8; // 线宽
    link.offsetGap = 0;
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 0; // 文本偏移量（向下15个像素）
    //link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
    link.strokeColor = "0,0,255";
    link.dashedPattern = dashedPattern;
    GW.scene.add(link);
    return link;
}
/**
 * 出口设备连线操作
 * @param nodeA
 * @param nodeZ
 * @param text
 * @param direction
 * @param dashedPattern
 * @return {*|g}
 */
function newAlarmFoldLink(nodeA, nodeZ, text, direction, dashedPattern) {
    //var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
    var link = new JTopo.Link(nodeA, nodeZ, text);
    //var link = new JTopo.FoldLink(nodeA, nodeZ,text);
    // link.arrowsRadius = 8;
    link.lineWidth = 3; // 线宽
    link.offsetGap = 0;
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 0; // 文本偏移量（向下15个像素）
    //link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
    link.strokeColor = "255,0,0";
    link.dashedPattern = dashedPattern;
    GW.scene.add(link);
    return link;
}
/*=========================================================================
* 拓扑分支
*=========================================================================
* */
/**
 * 加载部门拓扑图
 * @param data
 */
function loadDeptTopo(data) {
    var _id = data[0].id,
        _links = data[0].links,
        _nodes = data[0].nodes;
    $.each(_nodes,function (i,node) {
        createDeptTopo(node)
    });
    createDeptLink(_links);
    //TODO
}
/**
 * 创建部门拓扑
 * @param data
 */
function createDeptTopo(data) {
    var node = new JTopo.Node(data.id.Name);
    switch (data.type){
        case "Depart":
            node.borderWidth = 0.6;
            node.borderColor = '0,0,0';
            node.font = "bold 20px 微软雅黑";
            node.fontColor = "0,0,0";
            node.textPosition = "Top_Center";
            node.setSize(300,300);
            break;
        case "Operator":
        case "FrieWall":
        case "switch":
            node.setSize(90,90);
            break;
    }
    node.setLocation(data.location.x,data.location.y);
    node.fillColor = "255, 255, 255";
    node.zIndex = 1;
    GW.scene.add(node);
    (data.EdgeDevice && !$.isEmptyObject(data.EdgeDevice)) ? createEdgeDeptNode(data): null;


}
/**
 * 创建部门出口设备
 * @param obj
 */
function createEdgeDeptNode(obj) {
    var edgeNode = new JTopo.Node();
    edgeNode.setBound(obj.location.x+120, obj.location.y+60, 60, 60);
    if(obj.alert !== "none"){
        edgeNode.alarm = obj.alert || "告警";
    }
    edgeNode.setImage(gw_IconImgArray[obj.EdgeDevice.Type].imgUrl);
    //(edgeNode);
    edgeNode.addEventListener("mouseover", function(event) {
        topoNodeToolTipHandler(event, obj.EdgeDevice, "edge");
    })
    edgeNode.addEventListener("mouseout", function(event) {
        removeTopoTipHandler();
    })
    GW.scene.add(edgeNode);
    GW._dept[obj.id.PrimeKey] = edgeNode;
    (obj.devType && obj.devType.length) ? createDeptInnerDevNode(obj,edgeNode): null;
}
/**
 * 创建部门内部设备关系
 * @param obj
 * @param ccNode
 */
function createDeptInnerDevNode(obj,ccNode) {
    $.each(obj.devType, function(i, drive) {
        var iconUrl = gw_IconImgArray[drive].imgUrl;
        var driveNode = new JTopo.Node();
        var emptyPadding = (300-(obj.devType.length*30))/(obj.devType.length+1);
        driveNode.setBound((obj.location.x) + (i + 1) * emptyPadding+(i*30), ((obj.location.y) + 200), 30, 30);
        driveNode.font = "12px 微软雅黑";
        driveNode.fontColor = "0,0,0";
        driveNode.zIndex = 4;
        driveNode.setImage(iconUrl);
        driveNode.addEventListener("mouseover", function(event) {
            topoNodeToolTipHandler(event, drive, "device");
        })
        driveNode.addEventListener("mouseout", function(event) {
            removeTopoTipHandler();
        })
        driveNode.addEventListener("mouseup", function(event) {
            if (event.button == 2) { // 右键
                // 当前位置弹出菜单（div）
                $("#contextmenu").css({
                    top: event.pageY,
                    left: event.pageX
                }).show();
            }
        });
        createDevLink(ccNode, driveNode);
        //container.add(driveNode);
        GW.scene.add(driveNode);
    })
}
/**
 * 创建出口设备之间的关联
 * @param links
 */
function createDeptLink(links) {
    $.each(links,function (i,linkinfo) {
        var t = linkinfo.endpoint;
        renderLink(t);
    })
    
}
function renderLink(rel) {
    var fromId = rel[0].refNode,
        toId = rel[1].refNode;
    var fromNode = GW._dept[fromId],
        toNode =  GW._dept[toId];
    var lnode = new JTopo.Link(fromNode,toNode);
    lnode.lineWidth = 3;
    lnode.strokeColor = "0,128,0";
    GW.scene.add(lnode);
    GW._dept[(fromId+"-"+toId)] = lnode;
}

/*=========================================================================
* 拓扑公用逻辑
* =========================================================================
* */
/**
 *
 * @param node
 */
function crumbsHandler(node) {
    switch (node.type){
        case "branch":
            $("#navLink").html("<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"" + node.primeKey + "\" onclick=\"turnScene(this)\"  ntype='top'>分支机构</a> <span class=\"c-gray en\">&gt;</span> " + node.name);
            break;
        case "Depart":

            break;
        default:
            $("#navLink").html("<span class=\"c-gray en\">&gt;</span> 分支机构 ");
            break;
    }
    return;

        /*$("#navLink").html("<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"branch\" onclick=\"stagePrvScene(this)\">分支机构</a> " +
            "<span class=\"c-gray en\">&gt;</span> <a href=\"javascript:void(0)\" id=\"" + menuScene.PrimeKey + "\" onclick=\"stagePrvScene(this)\">" + g_PrevDepartName +"</a>" +
            "<span id='detail' class=\"c-gray en\">&gt;</span> "+ menuNode.Name);*/
}

function turnScene(obj) {
    var type = $(obj).attr("ntype"),
        name = $(obj).text();
    loadDataByNode({type:type});
}
/**
 * 拖放停止时，在画布上添加节点
 * @param pos 位置
 * @param image 图片
 * @param name 文本
 * @param PrimeKey Key键
 * @param type 类型
 */
function dragAddNode(pos, image, name, PrimeKey, type) {
    var textWidth = calcStringPixelsCount(name, "12px");
    var textOffsetPos = { "x": -((textWidth - 45) / 2), "y": 40 }; //默认正下方，居中
    var node = new JTopo.Node();
    node.setImage(image.src);
    node.setLocation(pos.x + textOffsetPos.x, pos.y + textOffsetPos.y);
    switch (type) {
        case "edge": //出口设备
            node.setSize(60, 45);
            registerContextMenu(node);
            break;
        case "terminal":
            node.setSize(30, 30);
            registerContextMenu(node);
            break;
        case "dept":
            node.setSize(40, 40);
            break;
        case "branch":
            node.setSize(300, 200);
            break;
        default:
            node.setSize(26, 26);
            break;
    }
    //node.setSize(44,44);
    node.setLocation(pos.x, pos.y);
    GW.scene.add(node);
}
/**
 * 注册设备右键菜单
 * @param node
 */
function registerContextMenu(node) {
    node.addEventListener("mouseup", function(event) {
        if (event.button == 2) { // 右键
            // 当前位置弹出菜单（div）
            $("#contextmenu").css({
                top: event.pageY,
                left: event.pageX
            }).show();
        }
    });
}
/**
 * 启用连线编辑的逻辑
 */
function createLinkForMannul() {
    var beginNode = null,
        tempNodeA = new JTopo.Node('tempA');
    tempNodeA.setSize(1, 1);
    var tempNodeZ = new JTopo.Node('tempZ');
    tempNodeZ.setSize(1, 1);

    var link = new JTopo.Link(tempNodeA, tempNodeZ);
    if (tmpPolyLineAllow == true)
        link = new JTopo.FoldLink(tempNodeA, tempNodeZ);
    link.lineWidth = 0.8;

    //节点连线
    GW.scene.mouseup(function(e) {
        if ((tmpLineAllow == false) && (tmpPolyLineAllow == false))
            return;
        if (e.button == 2) {
            GW.scene.remove(link);
            beginNode = null;
            return;
        }
        if (e.target != null && e.target instanceof JTopo.Node) {
            if (beginNode == null) {
                beginNode = e.target;
                GW.scene.add(link);
                tempNodeA.setLocation(e.x, e.y);
                tempNodeZ.setLocation(e.x, e.y);
            } else if (beginNode !== e.target) {
                var endNode = e.target;
                if (tmpLineAllow == true)
                    var l = new JTopo.Link(beginNode, endNode);
                if (tmpPolyLineAllow == true)
                    var l = new JTopo.FoldLink(beginNode, endNode);
                GW.scene.add(l);
                beginNode = null;
                GW.scene.remove(link);
            } else {
                beginNode = null;
            }
        } else {
            GW.scene.remove(link);
            beginNode = null;
        }
    });
    GW.scene.mousedown(function(e) {
        if ((tmpLineAllow == false) && (tmpPolyLineAllow == false))
            return;
        if (e.target == null || e.target === beginNode || e.target === link) {
            GW.scene.hide(link);
            beginNode = null;
        }
    });

    GW.scene.mousemove(function(e) {
        if ((tmpLineAllow == false) && (tmpPolyLineAllow == false))
            return;
        tempNodeZ.setLocation(e.x, e.y);
    });
}
/**
 * 初始化拓扑链路，服务，流量的事件入口
 */

function initCheckbox() {
    $("#_link").unbind("click").click(function() {
        var flag = $(this)[0].checked;
        if (flag) {
            var _links = [];
            for (var i = 1; i < 6; i++) {
                var text = (Math.random() * 10).toFixed(1) + "/ 14 Mbps";
                _links.push({ "fromId": 0, "toId": i, "text": text })
            }
            getRelationByCheckType(_links, "link");
            GW.linkTimer = setInterval(function() {
                for (var i = 1; i < 6; i++) {
                    var text = (Math.random() * 10).toFixed(1) + "/ 14 Mbps";
                    _links.push({ "fromId": 0, "toId": i, "text": text })
                }
                getRelationByCheckType(_links, "link");
            }, 2000)
        } else {
            clearAllLinkInfo();
        }
    })
    $("#_flow").unbind("click").click(function() {
        var flag = $(this)[0].checked;
        if (flag) {
            var _links = [];
            for (var i = 1; i < 6; i++) {
                var text = (Math.random() * 10).toFixed(1) + "/ 14 Mbps";
                _links.push({ "fromId": 0, "toId": i, "text": text })
            }
            getRelationByCheckType(_links, 'flow');
            GW.pieTimer = setInterval(function() {
                for (var i = 1; i < 6; i++) {
                    var text = (Math.random() * 10).toFixed(1) + "/ 14 Mbps";
                    _links.push({ "fromId": 0, "toId": i, "text": text })
                }
                getRelationByCheckType(_links, 'flow');
            }, 2000)
        } else {
            clearAllPieInfo();
        }
    })
    $("#_service").unbind("click").click(function() {

    })
}
/**
 * 获取关系类型
 * @param _links
 * @param type
 */
function getRelationByCheckType(_links, type) {
    $.each(_links, function(i, _link) {
        switch (type) {
            case "link":
                showRelation(_link);
                break;
            case "flow":
                showFRelation(_link);
                break;
        }

    })
}
/**
 * 关闭链路监控
 */
function clearAllLinkInfo() {
    clearInterval( GW.linkTimer);
    $.each(GW._branch.ls,function (i,ls) {
        ls.text = "";
    })
}
/**
 * 关闭流量监控
 */
function clearAllPieInfo() {
    clearInterval( GW.pieTimer);
    $.each(GW._branch.fs,function (i,fs) {
        GW.scene.remove(fs);
        delete GW._branch.fs[i];
    })
}
/**
 * 显示线性关系
 * @param data
 */
function showRelation(data) {
    var currentNode = GW._branch.ls[data.fromId + "-" + data.toId];
    currentNode.font = 14;
    currentNode.text = data.text;
    currentNode.fontColor = "0,0,0";
    currentNode.textOffsetX = -50;
}
/**
 * 显示流量监控
 * @param data
 */
function showFRelation(data) {
    var fromNode = GW._branch._b[data.fromId],
        toNode = GW._branch._b[data.toId];
    showFlow(fromNode, toNode,data.fromId,data.toId);
}
/**
 * 绘制流量柱形图
 * @param fromNode
 * @param toNode
 * @param fid
 * @param tid
 */
function showFlow(fromNode, toNode, fid, tid) {
    //debugger;
    if(GW._branch.fs[fid+"-"+tid]){
        var currentNode = GW._branch.fs[fid+"-"+tid];
        currentNode.datas =  [Math.floor(Math.random()*10), 20];
    }else{
        var flow = new JTopo.BarChartNode();
        flow.height = 20;
        flow.width = 34;
        flow.colors = ["#3666B0","#2CA8E0"];
        flow.datas =  [2, 20];
        flow.titles = ['上', '下'];
        flow.setLocation((fromNode.x + toNode.x) / 2+40, (fromNode.y + toNode.y) / 2);
        GW.scene.add(flow);
        GW._branch.fs[fid+"-"+tid] = flow;
    }

}