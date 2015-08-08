$(document).ready(function () {
    var chkBox = $("#chkBoxAdvance");
    refreshCheckBox(chkBox);

    $(chkBox).change(function () {
        refreshCheckBox($(this));
    });

    var liRadio = $('ul.inventory input')
    refreshRadio(liRadio);

    $(liRadio).change(function () {
        refreshRadio($(this));
    });

    $('a.more').click(function () {
        $(this).prev().toggle();
    });
});

function refreshCheckBox(chkBox) {
    var chk = $(chkBox);
    var checked = chk.is(':checked');
    if (checked) {
        chk.parent().next().show();
    }
    else {
        chk.parent().next().hide();
    }
};

function refreshRadio(radio) {
    var divDate = $('div.inventory_date');
    var val = $(radio).filter(':checked').val();
    if (val == "true") {
        divDate.show();
    }
    else {
        divDate.hide();
    }
};