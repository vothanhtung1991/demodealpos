$(document).ready(function () {
    $("input.datepicker").each(function () {
        var required = $(this).hasClass("required");
        var config = {
            numberOfMonths: 2,
            dateFormat: 'dd M yy',
            changeMonth: true,
            changeYear: true,
            showButtonPanel: !required,
            beforeShow: function (input) {
                if (!required) {
                    dpClearButton(input);
                }
               
            },
            onChangeMonthYear: function (y, m, i) {
                var day = i.selectedDay;
                var month = m - 1;
                var newDate = new Date(y, month, day);

                //Set to last day of the month ex: 31 Jan to 31 Feb
                if (newDate.getMonth() > month) {
                    newDate.setMonth(newDate.getMonth(), 0);
                }

                $(this).datepicker('setDate', newDate);
                if (!required) {
                    dpClearButton(i.input);
                }
            }
        }

        var object = $(this);
        if (object.hasClass("birthday"))
        {
            config.yearRange = "-80:+0";
            config.maxDate = '1d';
        }

        object.datepicker(config);
    });
});
function dpClearButton(input) {
    setTimeout(function () {
        var buttonPane = $(input).datepicker("widget").find(".ui-datepicker-buttonpane");
       
        $("<button>", {
            text: "Clear",
            click: function () { jQuery.datepicker._clearDate(input); }
        }).appendTo(buttonPane).addClass("ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all");
    }, 1)
}
