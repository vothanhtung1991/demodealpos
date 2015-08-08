$(document).ready(function () {
    LoadAutoNumeric();
});

autoNumericLoaded = false;
function LoadAutoNumeric() {
    if (!autoNumericLoaded) {
        autoNumericLoaded = true;

        //Previously initialization is inside focus
        $("input.txtPrice").autoNumeric({
            aPad: false,
            vMin: '-999999999999999.99',
            vMax: '999999999999999.99'
        });

        //Previously initialization is inside focus
        $("input.txtQty").autoNumeric({
            aPad: false,
            vMax: '999999999999.99',
            vMin: '-999999999999.99'
        });
        $("input.txtAbsolute").autoNumeric({
            aPad: false,
            vMax: '999999999999.99',
            vMin: '0'
        });
        $("input.txtPcg").autoNumeric({
            aPad: false,
            vMax: '100.00'
        });

        $("input.memberPoint").autoNumeric({
            aPad: false,
            vMin: '0',
            vMax: '999999999999'
        });

        var selector = "input.txtQty,input.txtPrice,input.txtPcg,input.txtAbsolute";
        $(selector).focus(function () {
            $(this).addClass('MaskedEditFocus');
        });

        $(selector).blur(function () {
            $(this).removeClass('MaskedEditFocus');
        });
    }
}