$(document).ready(function(){
    $("#tabs").tabs();
    $("#vertical_tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#vertical_tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
    $(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *")
      .removeClass("ui-corner-all ui-corner-top")
      .addClass("ui-corner-bottom");

    // move the nav to the bottom
    $(".tabs-bottom .ui-tabs-nav").appendTo(".bottom>div");


    var tabNumber = $("#tabNumber").val();
    if (!(tabNumber==undefined)) {
        $("#tabs").tabs({ active: tabNumber });
    }
});