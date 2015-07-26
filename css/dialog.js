$(document).ready(function () {
    // Dialog	
    var initDialog = {
        resizable: false,
        draggable: false,
        autoOpen: false,
        open: function (event, ui) {
            var input = $(this).find("input.datepicker");
            input.removeAttr("disabled");
            if (input.hasClass("disabled")) {
                input.datepicker('destroy');
            }


        },
        create: function (event, ui) {
            var dialog = $(this);
            var inputs = dialog.find("input,textarea");
            inputs.keyup(function (e) {
                if ((e.which && e.which == 113) || (e.keyCode && e.keyCode == 113)) {
                    var buttons = dialog.parent().find('.ui-dialog-buttonset').find('button');
                    var btnOK = buttons.last();
                    btnOK.click();
                }
            });

            return true;
        },
        minWidth: 315,
        width: "auto",
        bgiframe: true,
        modal: true,
        buttons: ''
    }
    var button = {
        Cancel: function () {
            $(this).dialog('close');
        },
        "Ok (F2)": function () {
            var submitOK = true;
            var dialogObj = $(this);

            var onOKHandler = $(this).attr("onOKHandler");
            if (onOKHandler != undefined) {
                var returnValue = window[onOKHandler]();
                if (returnValue == false) { submitOK = false; }
            }

            if (submitOK) {
                var submitID = dialogObj.attr("DialogOKButtonID");
                if (submitID != undefined) {
                    var btnSubmit = $("#" + submitID);
                    //button cannot be submitted without closing the dialog first

                    dialogObj.dialog('close');
                    btnSubmit.click();
                    return true;
                }
            }

            if (submitOK) {
                $(this).dialog('close');
            }
        }
    }
    $('div.dialog').each(function (index) {
        var dlg = $(this);
        var autoOpenDialog = (dlg.attr("autoOpen") == "1");
        if (dlg.hasClass("hideButton")) {
            initDialog.buttons = '';
        } else {
            initDialog.buttons = button;
        }
        initDialog.autoOpen = autoOpenDialog;

        dlg.dialog(initDialog);
        dlg.parent().appendTo($("form:first"));

    });

    // Dialog Link
    $('a[dialogID], button[dialogID]').click(function () {
        var valid = true;
        var validationMethod = $(this).attr("validate");

        if (validationMethod != "" && validationMethod != undefined && validationMethod != null) {
            valid = window[validationMethod]();
        }

        if (valid) {
            var dialogID = '#' + $(this).attr("dialogID");
            var dialogObject = $(dialogID);
            var focusID = dialogObject.attr("inputFocusID");

            //workaround to stop datepicker to open on dialog show
            dialogObject.find("input.datepicker").prop('disabled', true);
            dialogObject.dialog('open');

            //Sell screen auto block amount
            //nofocus come from dialog invoice payment, used for tablet user
            var nofocus = dialogObject.attr("nofocus");

            if (Constants.IsNotEmpty(focusID) && nofocus != "true") {
                var focusObject = $('#' + focusID);
                focusObject.focus(function () {
                    $(this).select();
                });
                focusObject.focus();
            }           
            
        }

        return false;
    });

    $("div.dialog a.more").click(function () {
        $("div.dialog table.more, div.dialog div.more").toggle();
       
    });
   
});
