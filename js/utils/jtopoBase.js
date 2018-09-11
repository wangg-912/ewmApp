function NodePostion(X, Y) {
    this.x = X;
    this.y = Y;

}
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
 * 创建文本节点  拓扑中的文本，可拖放及设置名称，跟Node匹配，随节点而移动
 * @param Parent
 * @param Scene  画布
 * @param Pos  节点坐标
 * @param text   节点名称
 * @constructor
 */
function GW_TextNode(Parent, Scene, Pos, text) {
    /* 对象属性 */
    this.objId; //Private,JTopo.TextNode对象
    var tmpLeft = Pos.x;
    var tmpTop = Pos.y;
    /*this.Font = "Microsoft YaHei";
    this.FontSize = "32px";
    this.FontStyle = "bold";*/
    this.FontColor = '0,0,0';
    this.ParentNode = Parent;
    var myThis = this;

    this.TextNode = function() {
        var textNode = new JTopo.TextNode(text);
        textNode.font = '16px 微软雅黑'; //jTopo 一个bug,必须按照这个顺序
        textNode.fontColor = this.FontColor;

        textNode.setSize(12, 12);
        textNode.setLocation(Pos.x, Pos.y);

        var textfield = $("#textfield");
        textNode.dbclick(function(event) {

            if (event.target == null) return;
            var e = event.target;

            textfield.css({
                "top": tmpTop,
                "left": tmpLeft,
                "z-index": 100,
                "font": '16px 微软雅黑'
            }).show().val(e.text).focus().select();
            //e.text = "";
            textfield[0].JTopoNode = e;
        });

        textfield.blur(function() {
            textfield[0].JTopoNode.text = textfield.hide().val();
        });
        this.objId = textNode;

        this.objId.addEventListener("mousedrag", this.Drag);

        Scene.TextNodeAdd(textNode);

    }

    this.Drag = function(event) {
        //console.log(event);
        myThis.objId.setLocation(event.x, event.y);
        myThis.ParentNode.SetTextPos(event.x, event.y);
        tmpLeft = event.x; //- 20;
        tmpTop = event.y; // + 55;
    }

    this.setLocation = function(x, y) {
        this.objId.setLocation(x, y);
    }

    this.SetFontSize = function(fontSize) {
        this.FontSize = fontSize;
        this.objId.font = this.FontStyle + this.FontSize + this.Font;
    }

    this.TextNode();
}

/**
 * 创建节点  代表拓扑视图中的一个基本对象，可拖放及设置名称
 * @param Scene 画布
 * @param Pos  节点坐标
 * @param nodeImage   节点图片
 * @param Name   节点名称
 * @param PrimeKey  节点键值
 * @param Type  节点类型
 * @param __node  节点数据
 * @constructor
 */
function GW_Node(Scene, Pos, nodeImage, Name, PrimeKey, Type, __node) {
    /*  Node对象属性  */
    this.state = null; //节点状态
    this.objId; // Private,JTopo.Node节点对象ID
    this.objTxtId; //GW_TextNode对象ID,用于支持名称字体、颜色、位置等设置
    this.NodePos = Pos;
    this.Size = new NodePostion(48, 48);
    var textWidth = calcStringPixelsCount(Name, "16px");
    this.TextOffsetPos = new NodePostion(-((textWidth - this.Size.x + 1) / 2), 40); //默认正下方，居中

    this.Name = Name; //拓扑节点名称,GW_TextNode
    this.PrimeKey = PrimeKey; //节点对象数据库存储键值，唯一标记
    this.Type = Type; //domain、branch、detail
    this.image = nodeImage;
    this.Scene = Scene;
    var myThis = this;

    var disX = 0,
        disY = 0; //记录鼠标点击坐标

    /* Node对象行为 */
    //   this.Node()
    //   this.SetState(newState)      设置对象
    //   this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片
    //    this.SetSize(wdith,heigth)     设置大小，后续扩展类需要调整
    //    this.SetImage(newImage)        设置Node背景图片，后续扩展类需要调整背景
    //     this.OnDrag()                 TextNode随着拖动而调整

    // 构造函数

    this.Node = function() {
        var node = new JTopo.Node();
        var bkImg = null;
        node.setLocation(Pos.x, Pos.y);
        this.objId = node;

        if (nodeImage != "hide")
            this.SetImage(nodeImage);
        else
            this.SetSize(1, 1); //隐藏节点，用于连线的汇聚


        Scene.NodeAdd(this);
        //创建对应的NodeName节点
        var textPos = new NodePostion(Pos.x + this.TextOffsetPos.x, Pos.y + this.TextOffsetPos.y);
        var txtNode = new GW_TextNode(this, Scene, textPos, Name);
        this.objTxtId = txtNode;


        //Name = NodeText;
        this.objId.addEventListener("dbclick", this.dbClick);
        this.objId.addEventListener("mouseup", this.Click);
        this.objId.addEventListener("mousedown", this.MouseDown);
        this.objId.addEventListener("mousedrag", this.Drag);
        this.objId.addEventListener("mouseover", this.hoverHandler);
        this.objId.addEventListener("mouseout", this.mouseoutHandler);
    }
    this.hoverHandler = function(event) {
        topoNodeToolTipHandler(event, __node)
    };
    this.mouseoutHandler = function(event) {
        removeTopoTipHandler();
    }

    this.MouseDown = function(event) {
        removeTopoTipHandler();
        var e = event;
        disX = e.clientX - myThis.NodePos.x;
        disY = e.clientY - myThis.NodePos.y;

    }

    this.Drag = function(event) {
        var e = event || window.event;
        // 横轴坐标
        var leftX = e.clientX - disX;
        // 纵轴坐标
        var topY = e.clientY - disY;

        if (leftX < 0) {
            leftX = 0;
        }
        if (topY < 0) {
            topY = 0;
        }
        myThis.NodePos.x = e.x - disX;
        myThis.NodePos.y = e.y - disY;

        myThis.objId.setLocation(myThis.NodePos.x, myThis.NodePos.y);
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x, myThis.NodePos.y + myThis.TextOffsetPos.y);
    }

    this.SetTextPos = function(x, y) {
        this.TextOffsetPos.x = x - this.NodePos.x;
        this.TextOffsetPos.y = y - this.NodePos.y;
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x, myThis.NodePos.y + myThis.TextOffsetPos.y);
    }

    this.AdjustSize = function() {
        //等比例缩放图片
        var imgWidth = this.image.width;
        var imgHeight = this.image.height;

        var dimW = imgWidth / 48;
        var dimH = imgHeight / 48;

        if (dimW >= dimH) {
            if (dimW > 1) {
                imgWidth = imgWidth / dimW;
                imgHeight = imgHeight / dimW;
            }
        } else {
            if (dimH > 1) {
                imgWidth = imgWidth / dimH;
                imgHeight = imgHeight / dimH;
            }
        }

        this.SetSize(imgWidth, imgHeight);
    }

    this.Click = function(event) {
        if (event.button == 2) { // 右键
            // 当前位置弹出菜单（div）
            $("#contextmenu").css({
                top: event.pageY,
                left: event.pageX
            }).show();
        }
    }
    this.dbClick = function(event) {
        if (event.target == null) return false;

        myThis.Scene.DbClick(myThis);
        //return true;
    }

    this.SetState = function(State) {
        this.state = State;
        if (State == "hide") {
            this.objId.setSize(1, 1);
        } else if (State == "visible")
            this.SetImage(this.image);
    }

    //需要返回JTopoNode
    this.getJTopoNode = function() {
            return this.objId;
        }
        //获取基类对象
    this.GetObjId = function() {
        return this.objId;
    }

    this.GW_Node = function() {
        return objId;
    }

    this.SetSize = function(width, heigth) {
        this.objId.setSize(width, heigth);
    }

    this.SetImage = function(newImage) {
        this.objId.setImage(newImage);
        this.image = newImage;
        this.AdjustSize();
    }

    this.SetFontSize = function(fontSize) {
        this.objTxtId.SetFontSize(fontSize);
        textWidth = calcStringPixelsCount(this.Name, fontSize);
        this.TextOffsetPos = new NodePostion(-((textWidth - this.Size.x + 1) / 2), 40); //默认正下方，居中
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x, myThis.NodePos.y + myThis.TextOffsetPos.y);
    }

    // 生成对象
    this.Node();
}

//GW_DomainNode 对象： 代表拓扑视图中的一个基本对象，可拖放及设置名称
//Base Object:  GW_Node
//构造函数： Secne -- 画布
//          Pos   -- 节点坐标
//          Type  -- 节点类型,区分domain，当前选择只有domain
//          Name  -- domain name
function GW_DomainNode(Scene, Pos, nodeImage, Name, PrimeKey, Type) {
    /*  Node对象属性  */
    this.state = null; //节点状态
    this.objId = null; // GW_Node节点对象ID
    this.Name = Name; //拓扑节点名称
    this.PrimeKey = PrimeKey; //节点对象数据库存储键值，唯一标记
    this.Type = Type;
    this.image = nodeImage;

    /* Node对象行为 */
    //   this.Node()
    //his.SetState(newState),      设置对象
    // this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片

    // 构造函数

    this.GW_DomainNode = function() {
        var node = new GW_Node(Scene, Pos, nodeImage, Name, PrimeKey, this.Type);

        node.SetSize(300, 200);
        this.objId = node;

    }

    //需要返回JTopoNode
    this.getJTopoNode = function() {
            return this.objId.getJTopoNode();
        }
        //获取基类对象
    this.GW_Node = function() {
        return this.objId;
    }

    this.SetImage = function(newImage) {
        this.image = newImage;
        return this.objId.SetImage(newImage);
    }

    this.GW_DomainNode();
}


/**
 * 创建分支
 * @param Scene  画布
 * @param Pos  节点坐标
 * @param nodeImage 节点图片
 * @param Name  domain name
 * @param PrimeKey
 * @param Type
 * @param __node 当前节点对象
 * @constructor
 */
function GW_BranchNode(opts) {
    this.state = null; //节点状态
    this.objId; // GW_Node节点对象ID
    this.childObjId = {};
    var _node = opts.node;
    this.Name = _node["id"].Name; //拓扑节点名称
    this.PrimeKey = _node["id"].PrimeKey; //节点对象数据库存储键值，唯一标记
    this.Type = opts["node"].type;
    this.image = opts["nodeIcons"][opts.type].objId;

    var Pos = new NodePostion(_node["location"]["x"], _node["location"]["y"]);
    /* Node对象行为 */
    //   this.Node()
    //   this.SetState(newState)      设置对象
    //   this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片

    // 构造函数

    this.GW_BranchNode = function() {
        var node = new GW_Node(opts.scene, Pos, this.image, this.Name, this.PrimeKey, this.Type, opts.node);
        node.SetSize(300, 200);
        node.SetFontSize("32");
        this.objId = node;
        var childDrive = _node.devType;
        if (childDrive.length) {
            $.each(childDrive, function(i, drive) {
                var img__ = opts["nodeIcons"][drive].objId;
                var childtopo = new GW_Node(opts.scene, {
                    x: Pos.x + (30 * (i + 1)),
                    y: Pos.y + (30 * (i + 1))
                }, img__, drive, (drive + (i + 1)), drive, opts.node);
                childtopo.SetSize(30, 30);
                opts.scene.NodeAdd(childtopo)

            })
        }
    }


    //需要返回JTopoNode
    this.getJTopoNode = function() {
            return this.objId.getJTopoNode();
        }
        //获取基类对象
    this.GW_Node = function() {
        return this.objId;
    }

    this.SetImage = function(newImage) {
        this.image = newImage;
        return this.objId.SetImage(newImage);
    }


    this.GW_BranchNode();
}


/**
 * ==============================================================================
 * 重构Topo整体
 * 作者 by wanggang
 * 日期 2018-09-07
 * ==============================================================================
 */
/**
 * 创建canvas
 * @param opts
 * @return {string}
 */
/*function createImage(opts) {
    var canvas = document.createElement('canvas');
    var ctx= canvas.getContext('2d');
    canvas.width=opts.width;
    canvas.height=opts.height;
    ctx.rect(0,0,canvas.width,canvas.heigh);
    ctx.fillStyle="transparent";
    ctx.fill();
    var nodeImage= new Image;
    nodeImage.src=opts.src;
    ctx.drawImage(nodeImage,0,0,canvas.width,canvas.height);
    var flagImage= new Image;
    flagImage.src=userPath+"../../images/cleditor/devicedisable.jpg";
    ctx.drawImage(flagImage,c.width-16,c.height-8,12,4);
    var box = canvas.toDataURL("image/png");
    return box;
}*/
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

function successCall(data) {
    if (data.length && data[0].success) {
        loadBranchTopo(data[0].result);
        createLinkForMannul();
    } else {
        alert("暂无数据！")
    }
}

function errorCall(info) {
    console.error(" --> ajaxJsonPost failure: " + JSON.stringify(info, null, 2));
}

/**
 * =============================================================
 * TOPO 相关
 * 重构 by wanggang
 * 日期 2018-09-07
 * =============================================================
 */
/**
 * 注册GW命名空间
 */
;
(function() {
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

    GW.stage.add(GW.scene);

    GW._branch = {
        "center": null,
        "edge": [],
        "_b": {},
        "rs": {},
        "ls": {},
        "fs": {}
    };
    GW.linkTimer = null;
    GW.pieTimer = null;
    GW.serveTimer = null;
    return GW.scene;
}
/**
 * 设置canvas大小
 */
function setCanvasSize(opts) {
    GW.canvas.width = 1700;
    GW.canvas.height = 1300;
}

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
    var _id = data.id,
        _links = data.links,
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
    node.setImage("/resource/branchCloud.png");
    //container.add(node);
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
        /*if(GW._branch.center && GW._branch.edge.length){
            var edges = GW._branch.edge;
            $.each(edges,function (i,edge) {
                if(edge){
                    newFoldLink(GW._branch.center, edge,'','vertical');
                    //newFoldLink(edge,GW._branch.center,'','vertical')
                }
            })
        }*/
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
    link.textOffsetY = -15; // 文本偏移量（向下15个像素）
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
    link.textOffsetY = -15; // 文本偏移量（向下15个像素）
    //link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
    link.strokeColor = "255,0,0";
    link.dashedPattern = dashedPattern;
    GW.scene.add(link);
    return link;
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
            GW.scene.remove(link);
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

function clearAllLinkInfo() {
    clearInterval( GW.linkTimer);
    $.each(GW._branch.ls,function (i,ls) {
        ls.text = "";
    })
}
function clearAllPieInfo() {
    clearInterval( GW.pieTimer);
    $.each(GW._branch.fs,function (i,fs) {
        GW.scene.remove(fs);
    })
}

function showRelation(data) {
    var currentNode = GW._branch.ls[data.fromId + "-" + data.toId];
    currentNode.font = 14;
    currentNode.text = data.text;
    currentNode.fontColor = "0,0,0";
}

function showFRelation(data) {
    var fromNode = GW._branch._b[data.fromId],
        toNode = GW._branch._b[data.toId];
    showFlow(fromNode, toNode,data.fromId,data.toId);
}

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
        flow.setLocation((fromNode.x + toNode.x) / 2 + 60, (fromNode.y + toNode.y) / 2 - 25);
        GW.scene.add(flow);
        GW._branch.fs[fid+"-"+tid] = flow;
    }
}



















/* 链接两个GW_Node */
//GW_Line 对象： 拓扑中的节点之间的连接
//Base Object:  JTopo.Link
//构造函数： Secne -- 画布
//          NodeA   -- GW_Node, 起始节点
//          NodeB   -- GW_Node,终止节点
//          Type    -- 线路类型，如网线、光纤等
//          Name    -- 节点名称
//          PrimeKey -- 节点键值

function GW_Line(Scene, NodeA, NodeB, Type, Name, PrimeKey) {
    this.state = null;
    this.type = Type; //类型： 取值目前： "fiber"  "pair";
    this.name = Name;
    var objId = null;
    this.PrimeKey = PrimeKey;

    this.Line = function() {
        var link = new JTopo.Link(NodeA.getJTopoNode(), NodeB.getJTopoNode(), Name);
        //link.arrowsRadius = 15;
        link.lineWidth = 0.8; // 线宽
        link.dashedPattern = null; // 虚线
        link.bundleGap = 20; // 线条之间的间隔
        link.fontColor = "255,0,0";
        if (this.type == "fiber")
            link.strokeColor = '0,200,255';
        else if (this.type == "pair")
            link.strokeColor = '0,250,0';
        else
            link.strokeColor = '204,204,204';

        //link.bundleOffset = 30; // 折线拐角处的长度
        //link.offsetGap = 30;
        //link.textOffsetY = 3; // 文本偏移量（向下3个像素）

        //相邻两组连线不能用相同的direction属性，会产生重叠
        //link.direction = direction;
        //link.direction = 'vertical';
        //link.direction = 'horizontal';
        objId = link;

        Scene.LinkAdd(this);

    }
    this.SetState = function(State) {
        this.state = State;
    }

    this.getJTopoLink = function() {
        return objId;
    }

    this.GetObjId = function() {
        return objId;
    }
    this.Line();

}

/* 操作函数，星形连接NodeA和多个NodeB节点 */

// 函数有问题，并没有保存各节点信息，后续节点改名称会有问题

function A_link_MultiB(Scene, NodeA, NodeB, Type, Name) {
    if (Array.isArray(NodeB) == true) {
        for (var i = 0; i < NodeB.length; i++) {
            GW_Line(Scene, NodeA.getNode(), NodeB[i].getNode(), Name);
        }
    }

    //link.bundleGap = 20; // 线条之间的间隔
}

function newLine(Scene, NodeA, NodeB) {
    this.state = null;

    this.newLine = function() {


        var link = new JTopo.FlexionalLink(NodeA.getNode(), NodeB.getNode());
        link.strokeColor = '204,204,204';
        link.lineWidth = 1;
        Scene.sceneObj.add(link);
    }
    this.SetState = function(State) {
        this.state = State;
    }
    this.newLine();

}

function GW_stage(canvas) {
    var objId = null;
    this.dbClickHandle = null;
    this.SceneArray = {};

    this.stage = function(canvas) {
        objId = new JTopo.Stage(canvas);
    }

    this.GetObjId = function() {
        return objId;
    }


    this.AddSence = function(sence) {
        this.SceneArray[sence.PrimeKey] = sence;
    }

    this.SaveImage = function() {
        var Image = objId.saveImageInfo();
        return Image;
    }
    this.regDbClick = function(Handler) {
        this.dbClickHandle = Handler;
    }

    this.DbClick = function(scene, Node) { //在Domain和Branch的Node节点上双击，进入下一层
        this.dbClickHandle(this, scene, Node);
    }
    this.stage(canvas);
}

/**
 * 对象：Scene
 * @param stage , GW_stage 对象
 * @param SceneName
 * @constructor
 */
function GW_Scene(stageIn, SceneName) {
    var ObjId = null;
    this.PrimeKey = SceneName; //“branch”、branch primeKey、domain PrimeKey
    this.stage = stageIn;
    this.NodeArray = new Object(); // 根据节点PrimeKey从小到大排序
    this.LinkArray = new Object();

    var myThis = this; //保存GW_Scence对象
    this.scene = function(stageIn) {
        ObjId = new JTopo.Scene(stageIn.GetObjId());
        stageIn.AddSence(this);
    }


    this.clearScene = function() {
        ObjId.clear();
    }

    this.DbClick = function(node) {
        myThis.stage.DbClick(myThis, node);
    }

    this.NodeAdd = function(GW_Node) {
        if (this.NodeArray[GW_Node.PrimeKey] == undefined) {
            this.NodeArray[GW_Node.PrimeKey] = GW_Node;
        }
        ObjId.add(GW_Node.getJTopoNode());
    }


    this.TextNodeAdd = function(GW_TextNode) {
        ObjId.add(GW_TextNode);
    }

    this.LinkAdd = function(GW_Link) {
        if (this.LinkArray[GW_Link.PrimeKey] == undefined) {
            this.LinkArray[GW_Link.PrimeKey] = GW_Link;
        }
        ObjId.add(GW_Link.getJTopoLink());
    }
    this.NodeDel = function(GW_Node) {
        this.NodeArray[GW_Node.PrimeKey] = undefined;
    }

    this.LinkDel = function(GW_Link) {
        this.LinkArray[GW_Link.PrimeKey] = undefined;
    }

    this.SetState = function(newState) {
        if (newState == "visible") {
            ObjId.visible = true;
            ObjId.show();
        } else if (newState == "invisible") {
            ObjId.visible = false;
            ObjId.hide();
        }
    }

    this.GetObjId = function() {
        return ObjId;
    }

    this.SetBkGround = function(bkImg) {
        ObjId.background = bkImg;
    }

    this.removeBkGround = function() {
        ObjId.background = "";
    }

    this.scene(stageIn);
}