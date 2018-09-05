/**
 * 构造请求数据对象.
 * @param _res 请求的资源名称
 * @param _op 请求的操作名称
 * @param _data 请求的数据对象
 * @param _option 请求的选项对象
 * @returns {Object} 请求数据对象
 */
function createPostData(_res, _op, _data, _option) {
    var postData = new Object();
    postData.resource = _res;
    postData.op = _op;
    postData.data = _data;
    postData.action = _option;
    return postData;
}


/**
 * post请求JSON数据.
 * @param _data 请求的数据
 * @param _success 成功回调
 * @param _failure 失败回调
 */
function ajaxJsonPost(_data, _success, _failure) {
    console.info(" --> ajaxJsonPost: " + JSON.stringify(_data, null, 2));
    $.ajax({
        url: "../cmd",
        type: "POST",
        data: JSON.stringify(_data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.info(" --> ajaxJsonPost success: " + JSON.stringify(data, null, 2));
            _success(data);
        },
        failure: function (data) {
            console.error(" --> ajaxJsonPost failure: " + JSON.stringify(data, null, 2));
            _failure(data);
        }
    });
}

function grepResponse(_data, _res, _op) {
    var rtnData;
    for (var i = 0; i < _data.length; i++) {
        if (_data[i].success && _res == _data[i].resource && _op == _data[i].op) {
            rtnData = _data[i].result;
        }
    }
    return rtnData;
}
