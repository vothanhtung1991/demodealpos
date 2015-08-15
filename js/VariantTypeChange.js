$(document).ready(function () {
    OnTypeChange();
    $("#ddlType").change(OnTypeChange);
    keymanager.init();
});
var keymanager = {
    Body: '',
    init: function () {
        this.Body = $("body");
            keymanager.Body.bind('keyup', function (e) {
                keymanager.BodyKey(e);
        });
    },
    BodyKey: function (e) {
            //Press F4 to open dialog
        if ((e.which && e.which == 115) || (e.keyCode && e.keyCode == 115)) {
            $("#dialogVariantComponent").dialog('open');
        }
    }

}
function OnTypeChange() {
    var ddlType = $("#ddlType");
    var divComponents = $("#divComponents");
    var divParent = $("#divParent");
    var divPoint = $("#divPoint");
    var divStock = $("#divStock");
    var autocompleteVariantParent = $("input.variantParent");

    if (ddlType.val() == "3" || ddlType.val() == "5") {
        divComponents.show();
    }
    else {
        divComponents.hide();
    }

    if (ddlType.val() == "7") {
        divParent.show();
        autocompleteVariantParent.addClass("required");
    }
    else {
        divParent.hide();
        autocompleteVariantParent.removeClass("required");
    }

    if (ddlType.val() == "10") {
        divPoint.show();
        divStock.hide();
    }
    else {
        divPoint.hide();
        divStock.show();
    }
}