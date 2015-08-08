$(document).ready(
	function () {
	    var inputs = $("div.radio input");
	    inputs.click(function () {
	        var radio = $(this);
	        if (radio.is(':checked')) {
	            $("div.option").filter(":visible").slideUp();

	            var idx = inputs.index(radio);
	            $("div.option").eq(idx).slideDown();
	        }
	    });

	    var on = inputs.filter(':checked').index();


	    $("div.option").hide();
	    if (inputs.eq(0).is(":checked")) {
	        $("div.option").eq(0).show();
	    }
	    else {
	        $("div.option").eq(1).show();
	    }

	});