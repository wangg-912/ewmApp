/**
 * 用户登录事件.
 */
function onClick_Login() {
    var postJsonArray = new Array();
    var postJsonObject = new Object();
    postJsonObject.username = $("#username").val();
    postJsonObject.password = $("#password").val();
    postJsonArray.push(createPostData("System.Auth", "login", postJsonObject));
    ajaxJsonPost(postJsonArray, loginSuccess, loginError);
}

var loginSuccess = function (data) {
    var result = grepResponse(data, "System.Auth", "login");
    if (result["Success"]) {
        $(location).attr("href", "index.html");
    } else {
        alert("login failure: " + result["Reason"]);
    }

}

var loginError = function (data) {
    alert("Error:" + JSON.stringify(data, null, 2));
}