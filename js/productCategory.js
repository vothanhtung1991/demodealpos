$(document).ready(function () {
    var treeClass = ".myTree";
    var fullFunction = $(treeClass).hasClass("fullFunction");
    var config = {
        "core": {
            "multiple": false,
            "check_callback": true
        },
        "contextmenu": {
            items: function (o, cb) {
                return {
                    "create": {
                        "separator_before": false,
                        "separator_after": true,
                        "_disabled": false,
                        "label": "Create",
                        action: function (data) {
                            var inst = $.jstree.reference(data.reference),
                               obj = inst.get_node(data.reference);
                            var Icon = "";
                            switch (obj.state.icon) {
                                case "/images/plugin/jstree/icon/home.png":
                                    Icon = "";
                                    break;
                                default:
                                    Icon = "/images/plugin/jstree/icon/file.png";
                                    break;
                            }

                            inst.create_node(obj, { "icon": Icon, "text": "New Category" }, "last", function (new_node) {
                                setTimeout(function () { inst.edit(new_node); }, 0);
                            });
                        },

                    },
                    "rename": {
                        "separator_before": false,
                        "separator_after": false,
                        "_disabled": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                   obj = inst.get_node(data.reference);
                            if (obj.parents.length == 1) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        "label": "Rename",
                        action: function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            inst.edit(obj);
                        }
                    },
                    "remove": {
                        "separator_before": false,
                        "icon": false,
                        "separator_after": true,
                        "_disabled": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                   obj = inst.get_node(data.reference);
                            if (obj.parents.length == 1) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        "label": "Delete",
                        action: function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            var guid = obj.id;
                            var count = 0;
                            $.ajax({
                                url: "/Authenticated/Services/Catalog.asmx/CountCategoryProducts",
                                data: "{ 'id': '" + guid + "' }",
                                dataType: "json",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                async: false,
                                success: function (responseData) {
                                    count = responseData.d;
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    alert(textStatus);
                                }
                            });
                            if (count == 0) {
                                deleteCategory(guid, inst, obj);
                            }
                            else {
                                if (confirm(jQuery.validator.format("There are {0} products inside this category. Are you sure you want to delete this category?", count))) {
                                    deleteCategory(guid, inst, obj);
                                }
                            }
                        }
                    },
                    "prop": {
                        "separator_before": false,
                        "icon": false,
                        "separator_after": false,
                        "_disabled": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                   obj = inst.get_node(data.reference);
                            if (obj.parents.length == 1) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        "label": "Properties",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);

                            var guid = obj.id;
                            var url = "ProductCategoryInfo.aspx?ID=" + guid;
                            window.location = url;
                        }

                    }
                }
            }
        },
        "plugins": ["contextmenu"]
    }
    if (!fullFunction) {
        config["plugins"] = [];
    }
    $(treeClass).jstree(config)
        .on("create_node.jstree", function (e, data) {
            var inst = data.instance;
            var obj = data.node;
            inst.set_id(obj, Constants.GuidEmpty);
        })
    .on("rename_node.jstree", function (e, data) {
        var name = data.text;
        var oldName = data.old;
        var guid = data.node.id;
        var inst = data.instance;
        var obj = data.node;
        var parentID = obj.parent;
        if (guid != Constants.GuidEmpty) {
            if (name != oldName) {
                $.ajax({
                    url: "/Authenticated/Services/Catalog.asmx/RenameProductCategory",
                    data: "{ 'parentID': '" + parentID + "', 'guidID': '" + guid + "', 'name' : '" + name + "' }",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) { return data; },
                    success: function (responseData) {
                        var result = responseData.d;
                        if (!result.Success) {
                            alert(result.Message);
                            inst.edit(obj, oldName);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("Fail to Rename Category");
                        inst.edit(obj, oldName);

                    }
                });

            }
        } else {
            $.ajax({
                url: "/Authenticated/Services/Catalog.asmx/CreateProductCategory",
                data: "{ 'parentID': '" + parentID + "', 'name' : '" + name + "' }",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataFilter: function (data) { return data; },
                success: function (responseData) {
                    var result = responseData.d;
                    if (result.Success) {
                        inst.set_id(obj, result.ObjectID);

                        //focus on the new created node
                        inst.deselect_all(true);
                        inst.select_node(obj);
                    }
                    else {
                        alert(result.Message);

                        //Remove Node
                        inst.delete_node(obj);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(textStatus);

                    //Remove Node
                    inst.delete_node(obj);
                }
            });
        }
    })
        .on("changed.jstree", function (event, data) {
            var inst = data.instance;
            var obj = data.node;
            var name = obj.text;
            var guid = obj.id;
            var parentID = obj.parent;

            var triggerID = $(this).attr('triggerID');
            var hfID = $(this).attr('hfID');
            if (hfID != undefined) {
                if (name == "Home") {
                    name = "Choose..";
                    $("#" + hfID).val('');
                }
                else {
                    $("#" + hfID).val(guid);
                }

                $("#" + triggerID).text(name);
            }
        });

});
function deleteCategory(guid, inst, obj) {
    $.ajax({
        url: "/Authenticated/Services/Catalog.asmx/DeleteProductCategory",
        data: "{ 'id': '" + guid + "' }",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataFilter: function (data) { return data; },
        success: function (responseData) {
            var result = responseData.d;
            if (!result.Success) {
                alert(result.Message);
            }
            else {
                if (inst.is_selected(obj)) {
                    inst.delete_node(inst.get_selected());
                }
                else {
                    inst.delete_node(obj);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}