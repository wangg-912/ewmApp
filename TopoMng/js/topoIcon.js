//模拟一段JSON数据，实际要从数据库中读取
var per = [
    {id:001,class:"网络设备",icon:'../resource/physical/NetDevice/100mswitch.png',name:"100M 交换机",tag:"switch 100M",status:"发布"},
    {id:001,class:"网络设备",icon:'../resource/physical/NetDevice/2124.png',name:"2124 路由器",tag:"router 2124",status:"发布"},
    {id:003,class:"网络设备",icon:'../resource/physical/NetDevice/4507.png',name:"核心交换机",tag:"switch 4507",status:"发布"},
    {id:004,class:"网络设备",icon:'../resource/physical/NetDevice/ig1000.png',name:"iG1000 sdn网关",tag:"sdn-gateway 100M",status:"发布"},
    {id:005,class:"网络设备",icon:'../resource/physical/NetDevice/ig2000.png',name:"iG2000 sdn网关",tag:"sdn-gateway 1000M",status:"发布"},
    {id:006,class:"网络设备",icon:'../resource/physical/NetDevice/router.png',name:"路由器",tag:"router 100M",status:"发布"},
    {id:007,class:"网络设备",icon:'../resource/physical/NetDevice/sdn switch.png',name:"SDN交换机",tag:"sdn-switch 1000M",status:"发布"},
    {id:008,class:"网络设备",icon:'../resource/physical/NetDevice/wifi.png',name:"wifi路由器",tag:"wifi 1000M",status:"发布"},
    {id:008,class:"终端设备",icon:'../resource/physical/HostDevice/computervsd.png',name:"个人主机",tag:"pc ",status:"发布"},
    {id:009,class:"终端设备",icon:'../resource/physical/HostDevice/disk.png',name:"存储",tag:"store ",status:"发布"},
    {id:010,class:"终端设备",icon:'../resource/physical/HostDevice/monitor.png',name:"摄像头",tag:"monitor ",status:"发布"},
    {id:011,class:"终端设备",icon:'../resource/physical/HostDevice/printer.png',name:"网络打印机",tag:"printer ",status:"发布"},
    {id:012,class:"终端设备",icon:'../resource/physical/HostDevice/roll machine.png',name:"考勤机",tag:"roll machine ",status:"发布"},
    {id:012,class:"终端设备",icon:'../resource/physical/HostDevice/server.jpg',name:"服务器",tag:"server",status:"发布"},
    {id:013,class:"域设备",icon:'../resource/physical/AreaDevice/domain.png',name:"部门 ",tag:"department",status:"发布"},
    {id:013,class:"域设备",icon:'../resource/physical/AreaDevice/branch.png',name:"分支 ",tag:"branch",status:"发布"},
    {id:016,class:"线路",icon:'../resource/physical/Line/line.bmp',name:"ethernet",tag:"网线",status:"发布"},
    {id:016,class:"拓扑背景",icon:'../resource/physical/Background/jigui.png',name:"单开机柜",tag:"机柜",status:"发布"},
    {id:016,class:"拓扑背景",icon:'../resource/physical/Background/2jigui.png',name:"对开机柜",tag:"对开机柜",status:"发布"},
    {id:016,class:"拓扑背景",icon:'../resource/physical/Background/beijing_1.png',name:"北京地图",tag:"北京地图",status:"发布"}
];


/*图片-添加*/
function picture_add(title, url) {
    var index = layer.open({
        type: 2,
        title: title,
        content: url
    });
    layer.full(index);
}

/*图片-查看*/
function picture_show(title, url, id) {
    var index = layer.open({
        type: 2,
        title: title,
        content: url
    });
    layer.full(index);
}

/*图片-审核*/
function picture_shenhe(obj, id) {
    layer.confirm('审核文章？', {
            btn: ['通过', '不通过'],
            shade: false
        },
        function () {
            $(obj).parents("tr").find(".td-manage").prepend('<a class="c-primary" onClick="picture_start(this,id)" href="javascript:;" title="申请上线">申请上线</a>');
            $(obj).parents("tr").find(".td-status").html('<span class="label label-success radius">已发布</span>');
            $(obj).remove();
            layer.msg('已发布', {icon: 6, time: 1000});
        },
        function () {
            $(obj).parents("tr").find(".td-manage").prepend('<a class="c-primary" onClick="picture_shenqing(this,id)" href="javascript:;" title="申请上线">申请上线</a>');
            $(obj).parents("tr").find(".td-status").html('<span class="label label-danger radius">未通过</span>');
            $(obj).remove();
            layer.msg('未通过', {icon: 5, time: 1000});
        });
}

/*图片-下架*/
function picture_stop(obj, id) {
    layer.confirm('确认要下架吗？', function (index) {
        $(obj).parents("tr").find(".td-manage").prepend('<a style="text-decoration:none" onClick="picture_start(this,id)" href="javascript:;" title="发布"><i class="Hui-iconfont">&#xe603;</i></a>');
        $(obj).parents("tr").find(".td-status").html('<span class="label label-defaunt radius">已下架</span>');
        $(obj).remove();
        layer.msg('已下架!', {icon: 5, time: 1000});
    });
}

/*图片-发布*/
function picture_start(obj, id) {
    layer.confirm('确认要发布吗？', function (index) {
        $(obj).parents("tr").find(".td-manage").prepend('<a style="text-decoration:none" onClick="picture_stop(this,id)" href="javascript:;" title="下架"><i class="Hui-iconfont">&#xe6de;</i></a>');
        $(obj).parents("tr").find(".td-status").html('<span class="label label-success radius">已发布</span>');
        $(obj).remove();
        layer.msg('已发布!', {icon: 6, time: 1000});
    });
}

/*图片-申请上线*/
function picture_shenqing(obj, id) {
    $(obj).parents("tr").find(".td-status").html('<span class="label label-default radius">待审核</span>');
    $(obj).parents("tr").find(".td-manage").html("");
    layer.msg('已提交申请，耐心等待审核!', {icon: 1, time: 2000});
}

/*图片-编辑*/
function picture_edit(title, url, id) {
    var index = layer.open({
        type: 2,
        title: title,
        content: url
    });
    layer.full(index);
}

/*图片-删除*/
function picture_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
        $.ajax({
            type: 'POST',
            url: '',
            dataType: 'json',
            success: function (data) {
                $(obj).parents("tr").remove();
                layer.msg('已删除!', {icon: 1, time: 1000});
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}

function showTime(){
    /*
        var mydate = new Date();
        mydate.getYear(); //获取当前年份(2位)
        mydate.getFullYear(); //获取完整的年份(4位,1970-????)
        mydate.getMonth(); //获取当前月份(0-11,0代表1月)
        mydate.getDate(); //获取当前日(1-31)
        mydate.getDay(); //获取当前星期X(0-6,0代表星期天)
        mydate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        mydate.getHours(); //获取当前小时数(0-23)
        mydate.getMinutes(); //获取当前分钟数(0-59)
        mydate.getSeconds(); //获取当前秒数(0-59)
        mydate.getMilliseconds(); //获取当前毫秒数(0-999)
        mydate.toLocaleDateString(); //获取当前日期
        var mytime=mydate.toLocaleTimeString(); //获取当前时间
        mydate.toLocaleString( ); //获取日期与时间

     */
    var week=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var second = now.getSeconds();

    month=month+1;

    var now_time = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second;
    return now_time;
}

function padding0(num, length) {
    //这里用slice和substr均可
    return (Array(length).join("0") + num).slice(-length);
}

/*
<tr class="text-c">
                <td><input name="" type="checkbox" value=""></td>
                <td>001</td>
                <td>分类名称</td>
                <td><a href="javascript:;" onClick="picture_edit('图库编辑','picture-show.html','10001')"><img width="210"
                                                                                                           class="picture-thumb"
                                                                                                           src="temp/200x150.jpg"></a>
                </td>
                <td class="text-l"><a class="maincolor" href="javascript:;"
                                      onClick="picture_edit('图库编辑','picture-show.html','10001')">现代简约 白色 餐厅</a></td>
                <td class="text-c">标签</td>
                <td>2014-6-11 11:11:42</td>
                <td class="td-status"><span class="label label-success radius">已发布</span></td>
                <td class="td-manage"><a style="text-decoration:none" onClick="picture_stop(this,'10001')"
                                         href="javascript:;" title="下架"><i class="Hui-iconfont">&#xe6de;</i></a> <a
                        style="text-decoration:none" class="ml-5"
                        onClick="picture_edit('图库编辑','picture-add.html','10001')" href="javascript:;" title="编辑"><i
                        class="Hui-iconfont">&#xe6df;</i></a> <a style="text-decoration:none" class="ml-5"
                                                                 onClick="picture_del(this,'10001')" href="javascript:;"
                                                                 title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a>
                </td>
            </tr>



 */

function LoadSystemIcon(table){
    var rowLine = table.rows.length;
    for(var i = 0;i < per.length; i++){ //遍历一下json数据
        rowLine = rowLine + 1;
        var trow = getDataRow(rowLine,per[i]); //定义一个方法,返回tr数据
        table.appendChild(trow);
    }
}

function getDataRow(rowLine,h){
    var row = document.createElement('tr'); //创建行
    row.setAttribute("class","text-c");

    var checkCell = document.createElement('td');
    var checkBox = document.createElement('input'); //创建一个input控件
    checkBox.setAttribute("type","checkbox");
    checkCell.appendChild(checkBox);
    row.appendChild(checkCell);

    var idCell = document.createElement('td'); //创建第一列id
    idCell.innerHTML = padding0(rowLine,3); // id,前补0
    row.appendChild(idCell); //加入行

    var nameCell = document.createElement('td');//创建第二列分类名称
    nameCell.innerHTML = h.class;
    row.appendChild(nameCell);

    //第三列： 图标ICON
    var iconCell = document.createElement('td');

    var m = document.createElement('a');
    m.setAttribute("href","javascript:;");
    m.setAttribute("onClick","picture_edit('图库编辑','picture-show.html','10001')");
    var img = document.createElement('img');
    img.setAttribute("width","79");
    img.setAttribute("src",h.icon);
    img.setAttribute("class","picture-thumb");
    m.appendChild(img);
    iconCell.appendChild(m);
    row.appendChild(iconCell);

    //第四列图片名称
    var nameCell = document.createElement('td');
    m = document.createElement('a');
    m.setAttribute("href","javascript:;");
    m.setAttribute("onClick","picture_edit('图库编辑','picture-show.html','10001')");
    m.setAttribute("class","maincolor");
    m.innerHTML = h.name;
    nameCell.setAttribute("class","text-l");
    nameCell.appendChild(m);
    row.appendChild(nameCell);

    //第五列图片关键字
    var tagCell = document.createElement('td');
    tagCell.innerHTML=h.tag;
    row.appendChild(tagCell);

    //第六列更新时间
    var timeCell = document.createElement('td');
    timeCell.innerHTML=showTime();
    row.appendChild(timeCell);

    //第七列更新时间
    var statusCell = document.createElement('td');
    statusCell.setAttribute("class","td-status");
    var span = document.createElement('span');
    span.setAttribute("class","label label-success radius");
    span.innerHTML=h.status;
    statusCell.appendChild(span);
    row.appendChild(statusCell);

    //第八列编辑框

    var mngCell = document.createElement('td');
    mngCell.setAttribute("class","td-manage");
    var a =  document.createElement('a');
    a.setAttribute("style","text-decoration:none");
    a.setAttribute("onClick","picture_stop(this,'10001')");
    a.setAttribute("href","javascript:;");
    a.setAttribute("title","下架");

    var  i = document.createElement('i');
    i.setAttribute("class","Hui-iconfont");
    i.innerHTML = '&#xe6de;';
    a.appendChild(i);
    mngCell.appendChild(a);

    a =  document.createElement('a');
    a.setAttribute("style","text-decoration:none");
    a.setAttribute("class","ml-5");
    a.setAttribute("onClick","picture_edit('图库编辑','picture-add.html','10001')");
    a.setAttribute("href","javascript:;");
    a.setAttribute("title","编辑");

    i = document.createElement('i');
    i.setAttribute("class","Hui-iconfont");
    i.innerHTML = '&#xe6df;';
    a.appendChild(i);
    mngCell.appendChild(a);

    a =  document.createElement('a');
    a.setAttribute("style","text-decoration:none");
    a.setAttribute("class","ml-5");
    a.setAttribute("onClick","picture_del(this,'10001')");
    a.setAttribute("href","javascript:;");
    a.setAttribute("title","删除");

    i = document.createElement('i');
    i.setAttribute("class","Hui-iconfont");
    i.innerHTML = '&#xe6e2;';
    a.appendChild(i);
    mngCell.appendChild(a);

    row.appendChild(mngCell);

    return row; //返回tr数据
}