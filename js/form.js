$(document).ready(function () {
    $("#txtRePassword").prop("name", $("#txtRePassword").prop("id"));

    jQuery.extend(jQuery.validator.messages, {
        required: "*"
    });

    $("form").validate({
        ignore: "",
        rules: {
            txtRePassword:
            {
                equalTo: "#txtPassword"
            }
        }, messages: {

            txtRePassword:
                {
                    equalTo: "These passwords don't match"
                }
        }


    });
});