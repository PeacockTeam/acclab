acclab = {};
acclab.options = {};

// XXX: find normal deps module?
function loadScript(url) {
    $.ajax({
	url : url,
	dataType : "script",
	async : false,
	cache: false
    });
}

$(function() {
    // TODO: move to config file
    acclab.options = _(acclab.options).extend({
	host: "http://localhost:3000"
    });

    acclab.view = {};
    acclab.collection = {};
    acclab.model = {};

    loadScript("javascripts/device/model/device.js");
    loadScript("javascripts/device/view/device.js");

    window.device = new acclab.collection.device();
    window.deviceview = new acclab.view.device({ model: device });

    device.fetch();

    return;
    $('#root-tabs').tabs();

    // XXX: load and view? use backbone?

    // Load all existed devices
    $.get(options["host"] + "/1.0/acc/get")
	.success(function(data) {

	    var $device = $.template("<h3><a data-id='${device_id}' href='#'>${device_name}</a></h3>" +
				     "<div>"+
				     "Id: <span class='dev-id'>${device_id}</span><br />" +
				     "Total samples: <span class='label success'>${total}</span>" +
				     "</div>");


	    $("#device-list").empty();

	    // TODO: think abount device name?
	    data.devices.forEach(function(d) {
		$.tmpl($device, {
		    device_id: d.device_id,
		    total: d.total,
		    device_name: "Unknown"
		}).appendTo("#device-list");
	    });

	    $("#device-list").accordion();
	});

    // Plot graph for specific device
    $("#device-list>h3>a").live("click", function() {
	var device = $(this).attr("data-id");
	var $summary = $.template("Total samples: <span class='label success'>" +
				  "${total}" +
				  "</span>");

	$("button#remove-graph").removeClass("disabled");
	$("#selected-device").empty();

	$.get(options["host"] + "/1.0/acc/get/" + device)
	    .success(function(data) {
		$.tmpl($summary, { total: data.data.length })
		    .appendTo("#selected-device");

		// TODO: we plot all x, y, z,
		// but we need each other plot
		//
		// - with filters (hight, low, idle, ...)
		// - with gestures mark (recoginzed or not)
		// - with train mark (what point trained?)
		// - ???
		plot("graph", data.data);
	    });
    });

    $("button#remove-graph").click(function() {
	$("#graph").html("<h2>Click on device to plot</h2>");
	$(this).addClass("disabled");
	$("#selected-device").empty();
    });
});
