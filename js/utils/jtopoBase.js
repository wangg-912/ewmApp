function NodePostion(X, Y) {
    this.x = X;
    this.y = Y;

}
/**
 * TODO
 * @param d
 */
function topoNodeToolTipHandler(d,data) {
    var e = canvas.getBoundingClientRect();
    var a = Math.floor(d.clientX - e.left * (canvas.width / e.width) + canvas.offsetLeft + 16);
    var b = Math.floor(d.clientY - e.top * (canvas.height / e.height) + canvas.offsetTop + 16);
    if (data.type == null) {
    } else {
        if (data.type == "branch") {
            $("#toolTip").html("<li>设备ID:" + data.id.PrimeKey + "</li>" +
                "<li>设备名称:" + data.id.Name + "</li>" +
                "<li>边缘器件:" + data.EdgeDevice.Name + "</li>" +
                "<li>边缘器件类型:" + data.EdgeDevice.Type + "</li>")
        } else {
            if (d.target.topoType == "device") {
                var c = "\u53ef\u7ba1\u7406";
                if (d.target.isManagerNode == 0) {
                    c = "\u4e0d\u53ef\u7ba1\u7406"
                } else {
                    if (d.target.isManagerNode == 2) {
                        c = "\u672a\u914d\u7f6e"
                    }
                }
                $("#toolTip").html("<li>\u8bbe\u5907\u540d\u79f0\uff1a" + d.target.displayName + "</li><li>\u8bbe\u5907\u7c7b\u578b\uff1a" + d.target.nodeType + "</li><li>\u8bbe\u5907IP\uff1a" + d.target.ipAddress + "</li><li>\u8bbe\u5907MAC\uff1a" + d.target.deviceMainMAC + "</li><li>\u7ba1\u7406\u72b6\u6001\uff1a" + c + "</li><li>\u8bbe\u5907\u7ba1\u7406\u534f\u8bae\uff1a" + d.target.managerProtocol + "</li><li>\u8bbe\u5907\u6240\u5728\u7f51\u7edc\uff1a" + d.target.groupName + "</li>")
            } else {
                if (d.target.topoType == "link") {
                    $("#toolTip").html("<li>\u8d77\u70b9\u8bbe\u5907\uff1a" + d.target.fromNode + "</li><li>\u7ec8\u70b9\u8bbe\u5907\uff1a" + d.target.toNode + "</li><li>\u8d77\u70b9\u8d44\u6e90\uff1a" + d.target.fromResourceName + "</li><li>\u7ec8\u70b9\u8d44\u6e90\uff1a" + d.target.toResourceName + "</li><li>\u94fe\u8def\u63cf\u8ff0\uff1a" + d.target.linkDesc + "</li>")
                }
            }
        }
    }
    $("#toolTip").css({top: b, left: a}).show()
}
//计算str的像素宽度
function calcStringPixelsCount(str, strFontSize) {
    // 字符串字符个数
    var stringCharsCount = str.length;

    // 字符串像素个数
    var stringPixelsCount = 0;

    // JS 创建HTML元素：span
    var elementPixelsLengthRuler = document.createElement("span");
    elementPixelsLengthRuler.style.fontSize = strFontSize;  // 设置span的fontsize
    elementPixelsLengthRuler.style.visibility = "hidden";  // 设置span不可见
    elementPixelsLengthRuler.style.display = "inline-block";
    elementPixelsLengthRuler.style.wordBreak = "break-all !important";  // 打断单词

    // 添加span
    document.body.appendChild(elementPixelsLengthRuler);

    for (var i =0; i < stringCharsCount; i++) {
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
//GW_TextNode 对象： 拓扑中的文本，可拖放及设置名称，跟Node匹配，随节点而移动
//Base Object:  JTopo.TextNode
//构造函数： Secne -- 画布
//          Pos   -- 节点坐标
//          Name  -- 节点名称
//
function GW_TextNode(Parent,Scene, Pos, text) {

    /* 对象属性 */
    this.objId;    //Private,JTopo.TextNode对象
    var tmpLeft = Pos.x;
    var tmpTop = Pos.y;
    this.Font = "微软雅黑";
    this.FontSize = "32px";
    this.FontStyle = "bold";
    this.FontColor= '0,0,0';
    this.ParentNode = Parent;
    var myThis = this;

    this.TextNode = function () {
        var textNode = new JTopo.TextNode(text);
        textNode.font = this.FontStyle + this.FontSize + this.Font;   //jTopo 一个bug,必须按照这个顺序
        textNode.fontColor = this.FontColor;

        textNode.setSize(12, 12);
        textNode.setLocation(Pos.x, Pos.y);

        var textfield = $("#textfield");
        textNode.dbclick(function (event) {

            if (event.target == null) return;
            var e = event.target;

            textfield.css({
                "top": tmpTop,
                "left": tmpLeft,
                "z-index": 100,
                "font": 'bold 24px 微软雅黑'
            }).show().val(e.text).focus().select();
            //e.text = "";
            textfield[0].JTopoNode = e;
        });

        textfield.blur(function () {
            textfield[0].JTopoNode.text = textfield.hide().val();
        });
        this.objId = textNode;

        this.objId.addEventListener("mousedrag",this.Drag);

        Scene.TextNodeAdd(textNode);

    }

    this.Drag = function (event) {
        //console.log(event);
        myThis.objId.setLocation(event.x, event.y);
        myThis.ParentNode.SetTextPos(event.x,event.y);
        tmpLeft = event.x ; //- 20;
        tmpTop = event.y;// + 55;
    }

    this.setLocation = function(x,y){
        this.objId.setLocation(x,y);
    }

    this.SetFontSize = function(fontSize){
        this.FontSize = fontSize;
        this.objId.font = this.FontStyle + this.FontSize + this.Font;
    }

    this.TextNode();
}


//GW_Node 对象： 代表拓扑视图中的一个基本对象，可拖放及设置名称
//Base Object:  JTopo.Node
//构造函数： Secne -- 画布
//          Pos   -- 节点坐标
//          Name  -- 节点名称
//          PrimeKey  -- 节点键值

function GW_Node(Scene, Pos, nodeImage, Name, PrimeKey, Type, __node) {
    /*  Node对象属性  */
    this.state = null;     //节点状态
    this.objId;            // Private,JTopo.Node节点对象ID
    this.objTxtId;        //GW_TextNode对象ID,用于支持名称字体、颜色、位置等设置
    this.NodePos = Pos;
    this.Size = new NodePostion(48,48);
    var textWidth = calcStringPixelsCount(Name,"16px");
    this.TextOffsetPos =  new NodePostion(-((textWidth - this.Size.x+1)/2) , 40);  //默认正下方，居中

    this.Name = Name;     //拓扑节点名称,GW_TextNode
    this.PrimeKey = PrimeKey;        //节点对象数据库存储键值，唯一标记
    this.Type = Type;     //domain、branch、detail
    this.image = nodeImage;
    this.Scene = Scene;
    var myThis = this;

    var disX=0,disY=0;   //记录鼠标点击坐标

    /* Node对象行为 */
    //   this.Node()
    //   this.SetState(newState)      设置对象
    //   this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片
    //    this.SetSize(wdith,heigth)     设置大小，后续扩展类需要调整
    //    this.SetImage(newImage)        设置Node背景图片，后续扩展类需要调整背景
    //     this.OnDrag()                 TextNode随着拖动而调整

    // 构造函数

    this.Node = function () {
        var node = new JTopo.Node();
        var bkImg = null;
        node.setLocation(Pos.x, Pos.y);
         this.objId = node;

        if(nodeImage != "hide")
            this.SetImage(nodeImage);
        else
            this.SetSize(1, 1);//隐藏节点，用于连线的汇聚


        Scene.NodeAdd(this);
        //创建对应的NodeName节点
        var textPos = new NodePostion(Pos.x +this.TextOffsetPos.x , Pos.y + this.TextOffsetPos.y);
        var txtNode = new GW_TextNode(this,Scene, textPos, Name);
        this.objTxtId = txtNode;


        //Name = NodeText;
        this.objId.addEventListener("dbclick", this.dbClick);
        this.objId.addEventListener("mouseup", this.Click);
        this.objId.addEventListener("mousedown",this.MouseDown);
        this.objId.addEventListener("mousedrag",this.Drag);
        this.objId.addEventListener("mouseover", this.hoverHandler);
        this.objId.addEventListener("mouseout", this.mouseoutHandler);
    }
    this.hoverHandler = function (event) {
        topoNodeToolTipHandler(event,__node)
    };
    this.mouseoutHandler =function (event) {
        $("#toolTip").html("").hide();
    }

    this.MouseDown= function(event){
            var e = event;
            disX = e.clientX - myThis.NodePos.x;
            disY = e.clientY- myThis.NodePos.y;
    }

    this.Drag = function(event){
       var e = event || window.event;
        // 横轴坐标
        var leftX = e.clientX - disX;
        // 纵轴坐标
        var topY =e.clientY - disY;

        if( leftX < 0 ){
            leftX = 0;
        }
        if( topY < 0 ){
            topY = 0;
        }
        myThis.NodePos.x = e.x-disX;
        myThis.NodePos.y = e.y-disY;

        myThis.objId.setLocation(myThis.NodePos.x,myThis.NodePos.y);
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x,myThis.NodePos.y+myThis.TextOffsetPos.y);
    }

    this.SetTextPos = function(x,y){
        this.TextOffsetPos.x =  x - this.NodePos.x;
        this.TextOffsetPos.y =  y - this.NodePos.y;
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x,myThis.NodePos.y+myThis.TextOffsetPos.y);
    }

    this.AdjustSize = function()
    {
        //等比例缩放图片
        var imgWidth = this.image.width;
        var imgHeight = this.image.height;

        var  dimW  = imgWidth / 48;
        var  dimH =  imgHeight /48;

        if(dimW >= dimH)
        {
            if(dimW > 1)
            {
                imgWidth = imgWidth / dimW;
                imgHeight = imgHeight / dimW;
            }
        }
        else
        {
            if(dimH > 1)
            {
                imgWidth = imgWidth / dimH;
                imgHeight = imgHeight / dimH;
            }
        }

        this.SetSize(imgWidth, imgHeight);
    }

    this.Click =function(event)
    {
        if(event.button == 2){// 右键
            // 当前位置弹出菜单（div）
            $("#contextmenu").css({
                top: event.pageY,
                left: event.pageX
            }).show();
        }
    }
    this.dbClick = function(event)
    {
        if(event.target == null) return false;

        myThis.Scene.DbClick(myThis);
        //return true;
    }

    this.SetState = function (State) {
        this.state = State;
        if (State == "hide") {
            this.objId.setSize(1, 1);
        }
        else if (State == "visible")
            this.SetImage(this.image);
    }

    //需要返回JTopoNode
    this.getJTopoNode = function() {
        return this.objId;
    }
    //获取基类对象
    this.GetObjId = function () {
        return this.objId;
    }

    this.GW_Node = function () {
        return objId;
    }

    this.SetSize = function (width, heigth) {
        this.objId.setSize(width, heigth);
    }

    this.SetImage = function (newImage) {
        this.objId.setImage(newImage);
        this.image = newImage;
       this.AdjustSize();
    }

    this.SetFontSize = function(fontSize){
        this.objTxtId.SetFontSize(fontSize);
        textWidth = calcStringPixelsCount(this.Name ,fontSize);
        this.TextOffsetPos =  new NodePostion(-((textWidth - this.Size.x+1)/2) , 40);  //默认正下方，居中
        myThis.objTxtId.setLocation(myThis.NodePos.x + myThis.TextOffsetPos.x,myThis.NodePos.y+myThis.TextOffsetPos.y);
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
function GW_DomainNode(Scene, Pos, nodeImage, Name,PrimeKey,Type) {
    /*  Node对象属性  */
    this.state = null;     //节点状态
    this.objId = null;            // GW_Node节点对象ID
    this.Name = Name;     //拓扑节点名称
    this.PrimeKey = PrimeKey;        //节点对象数据库存储键值，唯一标记
    this.Type = Type;
    this.image = nodeImage;

    /* Node对象行为 */
    //   this.Node()
    //   this.SetState(newState)      设置对象
    //   this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片

    // 构造函数

    this.GW_DomainNode = function () {
        var node = new GW_Node(Scene, Pos, nodeImage, Name,PrimeKey,this.Type);

        node.SetSize(200, 200);
        this.objId = node;

    }

    //需要返回JTopoNode
    this.getJTopoNode = function() {
        return this.objId.getJTopoNode();
    }
    //获取基类对象
    this.GW_Node = function () {
        return this.objId;
    }

    this.SetImage = function (newImage) {
        this.image = newImage;
        return  this.objId.SetImage(newImage);
    }

    this.GW_DomainNode();
}


//GW_BranchNode 对象： 代表拓扑视图中的一个基本对象，可拖放及设置名称
//Base Object:  GW_Node
//构造函数： Secne -- 画布
//          Pos   -- 节点坐标
//          nodeImage  -- 节点图片
//          Name  -- domain name
function GW_BranchNode(Scene, Pos, nodeImage, Name,PrimeKey,Type, __node) {
    /*  Node对象属性  */
    this.state = null;     //节点状态
    this.objId;            // GW_Node节点对象ID
    this.Name = Name;     //拓扑节点名称
    this.PrimeKey = PrimeKey;        //节点对象数据库存储键值，唯一标记
    this.Type = Type;
    this.image = nodeImage;

    /* Node对象行为 */
    //   this.Node()
    //   this.SetState(newState)      设置对象
    //   this.GetBkDefaultImg(nodeType)    根据节点类型获取节点默认的背景图片

    // 构造函数

    this.GW_BranchNode = function () {
        var node = new GW_Node(Scene, Pos, nodeImage, Name,PrimeKey,this.Type,__node);

        node.SetSize(300, 200);
        node.SetFontSize("24px");
        this.objId = node;
    }


    //需要返回JTopoNode
    this.getJTopoNode = function() {
        return this.objId.getJTopoNode();
    }
    //获取基类对象
    this.GW_Node = function () {
        return this.objId;
    }

    this.SetImage = function (newImage) {
        this.image = newImage;
        return  this.objId.SetImage(newImage);
    }


    this.GW_BranchNode();
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
    this.type = Type;     //类型： 取值目前： "fiber"  "pair";
    this.name = Name;
    var objId = null;
    this.PrimeKey = PrimeKey;

    this.Line = function () {
        var link = new JTopo.Link(NodeA.getJTopoNode(), NodeB.getJTopoNode(), Name);
        //link.arrowsRadius = 15;
        link.lineWidth = 3; // 线宽
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
    this.SetState = function (State) {
        this.state = State;
    }

    this.getJTopoLink = function () {
        return objId;
    }

    this.GetObjId = function () {
        return  objId;
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

    this.newLine = function () {


        var link = new JTopo.FlexionalLink(NodeA.getNode(), NodeB.getNode());
        link.strokeColor = '204,204,204';
        link.lineWidth = 1;
        Scene.sceneObj.add(link);
    }
    this.SetState = function (State) {
        this.state = State;
    }
    this.newLine();

}

function GW_stage(canvas) {
    var objId = null;
    this.dbClickHandle = null;
    this.SceneArray = new Object();

    this.stage = function (canvas) {
        objId = new JTopo.Stage(canvas);
    }

    this.GetObjId = function () {
        return objId;
    }


    this.AddSence = function(sence){
        this.SceneArray[sence.PrimeKey]=sence;
    }

    this.SaveImage = function() {
        var Image = objId.saveImageInfo();
        return Image;
    }
    this.regDbClick = function(Handler)
    {
        this.dbClickHandle = Handler;
    }

    this.DbClick = function(scene,Node)
    {//在Domain和Branch的Node节点上双击，进入下一层
        this.dbClickHandle(this,scene,Node);
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
    this.PrimeKey = SceneName;  //“branch”、branch primeKey、domain PrimeKey
    this.stage = stageIn;
    this.NodeArray = new Object();   // 根据节点PrimeKey从小到大排序
    this.LinkArray = new Object();

    var myThis = this;  //保存GW_Scence对象
    this.scene = function (stageIn) {
        ObjId = new JTopo.Scene(stageIn.GetObjId());
        stageIn.AddSence(this);
    }


    this.clearScene = function () {
        ObjId.clear();
    }

    this.DbClick = function(node)
    {
         myThis.stage.DbClick(myThis,node);
    }

    this.NodeAdd = function (GW_Node) {
        if (this.NodeArray[GW_Node.PrimeKey] == undefined) {
            this.NodeArray[GW_Node.PrimeKey] = GW_Node;
        }
        ObjId.add(GW_Node.getJTopoNode());
    }

    this.TextNodeAdd = function (GW_TextNode){
        ObjId.add(GW_TextNode);
    }

   this.LinkAdd = function (GW_Link) {
        if (this.LinkArray[GW_Link.PrimeKey] == undefined) {
            this.LinkArray[GW_Link.PrimeKey] = GW_Link;
        }
        ObjId.add(GW_Link.getJTopoLink());
    }
    this.NodeDel = function (GW_Node) {
        this.NodeArray[GW_Node.PrimeKey] = undefined;
    }

    this.LinkDel = function (GW_Link) {
        this.LinkArray[GW_Link.PrimeKey] = undefined;
    }

    this.SetState = function(newState)
    {
        if(newState == "visible")
        {
            ObjId.visible = true;
            ObjId.show();
        }
        else if(newState == "invisible")
        {
            ObjId.visible = false;
            ObjId.hide();
        }
    }

    this.GetObjId = function () {
        return  ObjId;
    }

    this.SetBkGround = function(bkImg) {
        ObjId.background = bkImg;
    }

    this.removeBkGround = function(){
        ObjId.background = "";
    }

    this.scene(stageIn);
}

