function CreateIconUl(addToolDiv,UlName) {
    var $div = $("<div></div>").attr({
        "white-space":"nowrap",
        "height":"auto"
    });
    var p = $("<p></p>").html(UlName);
    $div.append(p);
    $(addToolDiv).append($div);

    var ul = $("<ul></ul>").attr("id",UlName);
    ul.appendTo($div);
    return ul;
}
function  CreateIconLi(addUl,IconHref,IconName,IdInfo) {
    var $li = $("<li></li>").attr({
        "margin":"0px 0px 0px auto",
        "display":"inline-block",
        "width":"19%",
        "height":"40px",
        "float":"left"
    }).addClass("TopoIcon").appendTo($(addUl));

    var $a = $("<a></a>").attr("title",IconName).appendTo($li);
    $("<img />").attr({
        "id":IdInfo,
        "src":IconHref,
        "width":"40px",
        "verticalAlign":"middle",
        "display":"table-cell",
        "title":IconName
    }).appendTo($a);

}
function LoadTopoTools(divTopoTool){
    //创建网络设备
    var  ulNetDvice  = CreateIconUl(divTopoTool,"网络设备");
    var  ulHostDvice = CreateIconUl(divTopoTool,"终端设备");
    var  ulAreaDvice = CreateIconUl(divTopoTool,"域设备");
    var  ulLineDvice = CreateIconUl(divTopoTool,"连线");
    var  ulBkImg = CreateIconUl(divTopoTool,"拓扑背景");


    //加载系统Icon
    var appendUl = null;
    var iconImage = null;
    var width;
    var height;
    var imgClass;
    var imgId;

    for(var i=0;i<per.length;i++)
    {
        switch(per[i].class)
        {
            case "网络设备":
                appendUl = ulNetDvice;
                imgId = "NetDevice";
                break;
            case "终端设备":
                appendUl = ulHostDvice;
                imgId = "HostDevice";
                break;
            case "域设备":
                appendUl = ulAreaDvice;
                imgId = "AreaDevice";
               break;
            case "线路":
                appendUl = ulLineDvice;
                imgId = "line";
                break;
            case "拓扑背景":
                appendUl = ulBkImg;
                imgId = "TopoBkImg";
                 break;
        }
        //subDiv = document.createElement('div');
        //subDiv.setAttribute("width",width);
        //subDiv.setAttribute("height",height);

        CreateIconLi(appendUl,per[i].icon,per[i].name,imgId);
    }
}

function ToolBarTagle() {
    var toolcmdDiv = document.getElementById("toolcmd");
    var status = toolcmdDiv.getAttribute("status");
    if(status == "open"){

        $("#TopoToolBar").animate({width:'200px'},500).css("float","right");
        toolcmdDiv.setAttribute("src","../resource/icon/config-hide.png");
        toolcmdDiv.setAttribute("title","隐藏工具条");
        toolcmdDiv.setAttribute("status","close");

    }
    else{
        toolcmdDiv.setAttribute("src","../resource/icon/config-show.png");
        toolcmdDiv.setAttribute("title","展开工具条");
        toolcmdDiv.setAttribute("status","open");
        $("#TopoToolBar").animate({width:'0px'},function(){
            $("#TopoToolBar").css("float","none");
        });

    }

}

function removeBkimg()
{
    GW.scene.background = "";
}