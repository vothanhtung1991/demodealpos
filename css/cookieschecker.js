$(document).ready(function () {
    if (are_cookies_enabled() == false) {
        document.getElementById("divError").style.display = "block";
        document.getElementById("lblError").innerHTML = "Cookies disabled ! Please enable cookies from your browser option.";
    }

});

function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}