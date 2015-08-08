var wsUrl = "/Authenticated/Services/AutoComplete.asmx/";
var enterOnSearch = false;

$(document).ready(function () {
    BindAutoComplete();
});

function BindAutoComplete() {
    $("input.autocomplete").each(function (index) {
        InitAutoComplete($(this));
    });
}

function InitAutoComplete(inputText) {
    var hf = $("#" + inputText.attr("hfID"));
    var onSelectHandler = inputText.attr("onSelectHandler");
    var localStorageKey = inputText.attr("LocalStorageKey");

    //is barcode read enter
    var queryOnEnter = inputText.hasClass("queryOnEnter");

    //clearing auto complete text box after select item
    var clearOnSelect = inputText.hasClass("clearOnSelect");
    var renderThumbnail = inputText.hasClass("autocomplete_thumbnail");

    inputText.keydown(function (event) {
        switch (event.keyCode) {
            case 13: //Enter
                //disable temporary for barcode scanner
                enterOnSearch = false;
                break;
            case 9: //Tab
            case 17://ctrl
            case 18://alt
            case 32: //space
            case 37: //Arrows
            case 38:
            case 39:
            case 40:
            case 113: //F2 Button
            case 115: //F4 Button
                break;
            default:
                hf.val('');
                break;
        }

        if (event.keyCode == 13 && !queryOnEnter) {
            return false;
        }
        else {
            return true;
        }
    });

    var config = {
        source: function (request, response) {
            if (POSSettings.isOnline()) {
                var wsMethod = inputText.attr("wsMethod");               
                var reqTerm = Formatter.ClearInvalidCharacter(request.term);
                $.ajax({
                    url: wsUrl + wsMethod,
                    data: "{'prefix':'" + reqTerm + "','count':50}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) { return data; },
                    success: function (data) {
                        response($.map(data.d, function (item) {
                            if (renderThumbnail) {
                                return {
                                    imgURL: item.ImgUrl,
                                    label: item.Value,
                                    id: item.Key
                                }
                            } else {
                                return {
                                    label: item.Value,
                                    id: item.Key
                                }
                            }

                        }))

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(textStatus);
                    }
                });
            }
            else {
                if (localStorageKey != undefined) {
                    var obj = JSON.parse(localStorage.getItem(localStorageKey));
                    if (obj != null) {

                        obj = $.grep(obj, function (row, i) {
                            if (localStorageKey == "Products") {
                                var code = (row.Code != null) ? " - " + row.Code : '';
                                row.label = row.Name + code;
                            } else if (localStorageKey == "Customers") {
                                row.label = row.Display + " - " + row.ContactPerson;
                            }
                            return (row.label.toString().toUpperCase().indexOf(request.term.toUpperCase()) != -1);
                        });

                        response($.map(obj, function (item) {
                            var labelDisplay = item.Name;
                            if (localStorageKey == "Products") {
                                var code = (item.Code != null) ? " - " + item.Code : '';
                                labelDisplay = item.Name + code;                                
                            } else if (localStorageKey == "Customers") {
                                labelDisplay = item.Display;
                            }
                            return {
                                label: labelDisplay,
                                id: item.ID
                            }
                        }))
                    }
                } else {
                    response($.map(new Array(), function () {
                        return {
                            label: '',
                            id: ''
                        }
                    }))
                }
            }
        },
        select: function (event, ui) {
            hf.val(ui.item.id).change();

            //Check OnSelectHandler
            if (onSelectHandler != undefined) {
                window[onSelectHandler](ui);
            }
            if (clearOnSelect) {
                inputText.val("");
                return false;
            }

        },
        minLength: 3,
        autoFocus: true,
        focus: function (event, ui) {
            if (enterOnSearch) {
                var autocomplete = $(this).data("autocomplete");
                var menu = autocomplete.menu;

                if (menu.active != null) {
                    menu._trigger("selected", event, { item: menu.active });
                }

                enterOnSearch = false;
            }
        }
    }
    inputText.autocomplete(config).keyup(function (e) {
        if (e.which === 13 && queryOnEnter) {
            inputText.autocomplete("close");
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        //display image when renderthumbnail and online
        if (renderThumbnail & item.imgURL != undefined) {
            autoCompleteLink = $.validator.format("<a><img src=\"{0}\"><span>{1}</span></a>", Formatter.GenerateImagen(item.imgURL, 40, 40), item.label);
        }
        else {
            autoCompleteLink = $.validator.format("<a>{0}</a>", item.label);
        }
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append(autoCompleteLink)
            .appendTo(ul);
    };
}
