$(document).ready(function () {
    //Stop submit using enter Key
    $("form").keypress(function (e) {
        if (e.which == 13) {
            var tagName = e.target.tagName.toLowerCase();
            if (tagName !== "textarea") {
                e.preventDefault();
                return false;
            }
        }
    });

    $("nav").mCustomScrollbar({
        scrollButtons: {
            enable: false
        },
        theme: "dark",
        autoHideScrollbar: true
    });

    $('div.account > i').click(function () {
        var nav = $('nav');
        var pos = nav.position();

        if (pos.left == -140) {
            nav.animate({ "left": "0px" }, "slow");
        }
        else {
            nav.animate({ "left": "-140px" }, "slow", function () {
                nav.css('left','');
            });
        }
    });

    $("div.status_bar > section > a").click(function () {
        var siblingSection = $(this).parent().siblings("section");
        siblingSection.find(".dropdown").hide();
        $(this).next().slideToggle("fast");
    });

    $("div.pane h2").click(function () {
        $(this).next().toggle();
    });

    $("input.delete").click(function () {
        var valid = confirm("Are you sure you want to delete this record ?");
        return valid;
    });
    $("input.restore").click(function () {
        var valid = confirm("Are you sure you want to restore this record ?");
        return valid;
    });
    $("div.filter a.more").click(function () {
        $("div.filter div.filter_more").toggle();
    });

    $("a.full_screen").click(function () {
        var f = $("form");
        f.toggleClass("full_screen");

        var a = $(this);
        if (f.hasClass("full_screen")) {
            a.text("Exit Full Screen");
        }
        else {
            a.text("Full Screen");
        }
    });

    $("div.more_menu > a").click(function () {
        $(this).next().slideToggle("fast");
    });

    var txtSearch = $('#txtSearch');
    txtSearch.keydown(function (event) {
        if (event.keyCode == 13) {
            runSearch(this.value, false);
            return false;
        }
    });

    $('table thead th:first-child input[type="checkbox"]').click(function () {
        var chkBox = $(this);

        var selected = $(chkBox).attr("checked");
        var table = $(this).parent().closest("table");

        if (table.hasClass("floatThead-table")) {
            table = table.parent().prev();
        }

        table.find('input[type="checkbox"]').each(function (i) {
            this.checked = selected;
        });
    });

    var tableAction = $('.table_action');
    var tableCheckboxes = $('table input[type="checkbox"]');

    tableAction.hide();
    tableCheckboxes.click(function () {
        var checkedCount = tableCheckboxes.filter(":checked").length;
        tableAction.toggle(checkedCount > 0);
    });

    $('div.search_filter > a').click(function (e) {
        $(this).next().slideToggle("fast");
    });

    $("table.floatTHead").floatThead({
        scrollingTop: 96
    });

    $("div.page_action > div.more > a").click(function () {
        $(this).next().slideToggle("fast");
    });

    PanelButton("buttonID", 13);

    $("section.complete div.more_actions > a").click(function () {
        $(this).next().toggle();
    });
});

function PanelButton(attr, keyCode) {
    var selector = "div[" + attr + "]";
    $(selector).each(function (index) {
        var buttonID = $(this).attr(attr);

        $(this).find("input:not(.autocomplete),select,textarea").keydown(function (e) {
            if ((e.which && e.which == keyCode) || (e.keyCode && e.keyCode == keyCode)) {
                //When enter key is pressed, check element type
                var btn = $("#" + buttonID);
                btn.click();

                return false;
            } else {
                return true;
            }
        });
    });
}


function runSearch(value, newWindow) {
    if (value != "") {
        var searchUrl = "/Authenticated/Search/Variant/Basic.aspx?search=" + value;
        if (newWindow) {
            window.open(searchUrl);
        }
        else {
            window.location = searchUrl;
        }
    }
}

var Formatter = {
    tempInput: null,
    Number: function (amount, ZeroDecimalSuffix) {
        ZeroDecimalSuffix = ZeroDecimalSuffix|| false;
        if (this.tempInput == null) {
            this.tempInput = $("<input id='temp' type='text' />");
            this.tempInput.autoNumeric({ aPad: ZeroDecimalSuffix, vMax: '999999999999999.99', vMin: '-999999999999999.99' });
        } else {
            this.tempInput.autoNumeric('update', { aPad: ZeroDecimalSuffix });
        }

        this.tempInput.autoNumeric('set', amount);
        var formatted = this.tempInput.val();
        return formatted;
    },
    ClearInvalidCharacter: function (valueToEscape) {
        if (valueToEscape != null && valueToEscape != "") {
            valueToEscape = valueToEscape.replace(/\n/g, "\\n");
            valueToEscape = valueToEscape.replace(/\"/g, "\\\"");
            valueToEscape = valueToEscape.replace(/'/g, "&apstrf");
            return valueToEscape;
        }
        else {
            return valueToEscape;
        }
    },
    NumberAbbreviate: function (number) {
        if (number == 0) {
            return '';
        }
        var mylength = parseInt(number).toString();
        if (mylength.length <= 4) {
            return parseFloat(number);
        }
        else if (mylength.length >= 5 && mylength.length <= 6) {
            return (number / 1000) + ' k';
        }
        else if (mylength.length >= 7 && mylength.length <= 9) {
            return (number / 1000000) + ' MM';
        }
        else if (mylength.length >= 10) {
            return number / 1000000000 + ' BN';
        }
    },
    PadLeft: function (value, width, padChar) {
        var val = value.toString();
        if (!padChar) { padChar = '0'; }
        while (val.length < width) {
            val = padChar + val;
        }
        return val;
    },
    GenerateImagen: function (ImageURLClient, width, heigth) {
        var formatImagen = "/ImageGen.ashx?image={0}&width={1}&height={2}";
        var defaultImage = "/Images/Icon/products_thumb.png";
        if (ImageURLClient == null) {
            return $.validator.format(formatImagen, defaultImage, width, heigth);
        }
        else {
            return $.validator.format(formatImagen, ImageURLClient, width, heigth);
        }
    },
    DateTime: {
        //parse from javascript datetime format to string with format  MM/dd/yyyy HH:mm:ss, ex '08/16/2013 00:00:00';
        ToSerializedString: function (dateVal) {
            try {
                var result =
                            ("00" + (dateVal.getMonth() + 1)).slice(-2) + "/" +
                            ("00" + dateVal.getDate()).slice(-2) + "/" +
                            dateVal.getFullYear() + " " +
                            ("00" + dateVal.getHours()).slice(-2) + ":" +
                            ("00" + dateVal.getMinutes()).slice(-2) + ":" +
                            ("00" + dateVal.getSeconds()).slice(-2);

                return result;
            }
            catch (err) {
                return dateVal;
            }
        },
        //parse from milisecond to javascript datetime;
        ParseJSONString: function (dateVal) {
            try {
                dateVal = dateVal.replace('/Date(', '');
                dateVal = dateVal.replace(')/', '');
                dateVal = parseInt(dateVal);
                dateVal = new Date(dateVal);
                return dateVal;
            }
            catch (err) {
                return new Date();
            }
        },
        //parse from javascript datetime to date time in receipt;
        ToReceiptString: function (dateVal) {
            try {
                var result = ("00" + dateVal.getDate()).slice(-2) + " " +
                            Constants.MonthName[dateVal.getMonth()] + " " +
                            dateVal.getFullYear() + " " +
                            ("00" + dateVal.getHours()).slice(-2) + ":" +
                            ("00" + dateVal.getMinutes()).slice(-2);

                return result;
            }
            catch (err) {
                return dateVal;
            }
        },
        //parse from javascript datetime to date only
        ToDateOnlyString: function (dateVal) {
            try {
                var result = ("00" + dateVal.getDate()).slice(-2) + " " +
                            Constants.MonthName[dateVal.getMonth()] + " " +
                            dateVal.getFullYear();
                return result;
            }
            catch (err) {
                return dateVal;
            }
        },
        //parse from MM dd yyyy to javacript date time
        ParseFormatted: function (dateString) {
            return new Date(dateString);
        },
        //Parse from dd-MMM-yyyy HH:mm to dd-MMM HH:mm
        ToSimple: function (dateString) {
            try {
                var dateformat = "{0}-{1} {2}";
                var date = dateString.split(" ")[0];
                var time = dateString.split(" ")[1];
                var day = date.split("-")[0];
                var month = date.split("-")[1];

                return $.validator.format(dateformat, day, month, time);
            }
            catch (err) {
                return dateString;
            }
        },

    },
}

var Constants = {
    GuidEmpty: '00000000-0000-0000-0000-000000000000',
    DateMinValue: '01 Jan 1',
    DecimalMinValue: '-7.922816251426434e+28',
    MonthName: new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
    IsEmpty: function (value) {
        if (value == '' || value == undefined || value == null || value == Constants.GuidEmpty) {
            return true;
        } else {
            return false;
        }
    },
    IsNotEmpty: function (value) {
        if (value != "" && value != Constants.GuidEmpty && value != undefined && value != null) {
            return true;
        }
        else {
            return false;
        }
    },
    NewLineToBR: function (str) {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    },
    ImageExtension: ['jpg', 'jpeg', 'png', 'gif']
}
var HtmlEditor = {
    AddStyle: function (file) {
        var head = $("head");
        var cssTemplate = '<link href="/Styles/{0}" rel="stylesheet" type="text/css" />';
        var linkElement = $.validator.format(cssTemplate, file);
        head.append(linkElement);
    },
    RemoveStyle: function (file) {
        var cssFileTemplate = "link[href*='/Styles/{0}']";
        var linkElement = $.validator.format(cssFileTemplate, file);
        $(linkElement).remove();
    }
}
var POSSettings = {   
    isOnline: function () {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/') + 1);        
        if (filename == "POS.aspx") {
                return navigator.onLine;            
        }
        return true;
    },
    queryRealtime: function () { //read data from server / local
        if (myLocalStorage.queryMode.GetProduct() == "1") {
            return this.isOnline();
        } else {
            return false;
        }
    },
    pushRealtime: function () { // submit order to server or local
        if (myLocalStorage.queryMode.GetOrder() == "1") {
            return this.isOnline();
        } else {
            return false;
        }
    },
}

function ToJavaScriptDate(value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    var dt = new Date(parseFloat(results[1]));
    return dt.getDate() + " " + (dt.getMonth() + 1) + " " + dt.getFullYear();
}
