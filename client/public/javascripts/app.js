$(function() {

    $('#root-tabs').tabs();
    $('#source-tabs').tabs();

    // XXX: usually  used same host
    // TODO: move to config file
    var options = {
	host: "http://localhost:3000"
    };

    var MAX_POINTS = 400;

    $('span#max').text(MAX_POINTS);

    // XXX: load and view? use backbone? currently
    // developd in backbone repo

    $("#rewind").button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-prev"
	}
    }).click(function() {
	var from = $('span#from').text();

        $('#control').trigger("change", [ +from - MAX_POINTS ]);

    });

    $("#forward").button({
	text: false,
	icons: {
	    primary: "ui-icon-seek-next"
	}
    }).click(function() {
	var from = $('span#from').text();

	$('#control').trigger("change", [ +from + MAX_POINTS ]);
    });

    $.get(options["host"] + "/1.0/acc/taptap/get")
	.success(function(data) {
	    // TODO: write template on jade!
	    var $file = $.template("<h3><a data-id='${id}' href='#'>${filename}</a></h3>" +
				   "<div style='padding-left:5px;'>" +
				   "<b>Board:</b> ${board} <br />" +
				   "<b>Manufacturer:</b> ${manufacturer} <br />" +
				   "<b>Model:</b> ${model} <br />" +
				   "<b>Version Release:</b> ${release} <br />" +
				   "<b>Version SDK:</b> ${sdk} <br />" +
				   "<b>Scenario:</b> <span class='label success'>${scenario}</span> <br />" +
				   "<b>Details:</b> <span class='label success'>${details}</span> <br />" +
				   "</div>");

	    var current_list = "#file-list";

	    $(current_list).empty();

	    data.forEach(function(f) {
		var device = f.data.metaData.device;
		var scenario = f.data.metaData.scenario;

		$.tmpl($file, {
		    id: f._id,
		    filename: f.filename,
		    board: device.board,
		    manufacturer: device.manufacturer,
		    model: device.model,
		    release: device.versionRelease,
		    sdk: device.versionSDK,
		    scenario: scenario.scenario,
		    details: scenario.details
		}).appendTo(current_list);
	    });

	    // XXX: hack for faild loading (use css to avoid it)
	    $('#source-tabs').tabs('select', '#taptap-tab');
	    $(current_list).accordion();
	});

    // Plot graph for specific device
    $("#file-list>h3>a").live("click", function() {
	var file_id = $(this).attr("data-id");

	var $summary = $.template("Total samples: <span class='label success'>" +
				  "${total}" +
				  "</span>");

	$("button#remove-graph").removeClass("disabled");
	$("#selected-file").empty();

	$.get(options["host"] + "/1.0/acc/taptap/get/" + file_id)
	    .success(function(data) {
		var total = data.data.accelerList.length
		$.tmpl($summary, { total: total })
		    .appendTo("#selected-file");

		$('span#from').text(0);
		$('span#total').text(total);
		$('#control').unbind();
		$("#graph").html("<h2>Click on device to plot</h2>");

		// conver from taptap format
		var outFormat = [];
		data.data.accelerList.accelerMessage.forEach(function(item) {
		    outFormat.push(
			{
			    timestamp: +data.data.startTime + +item.time,
			    data: {
				x: +item.x,
				y: +item.y,
				z: +item.z
			    }
			});
		});

		$('#control').bind('change', { data: outFormat }, partial_plot);

		$('#control').trigger('change', [ 0 ]);
	    });
    });

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

	    // XXX: hack for faild loading (use css to avoid it)
	    $('#source-tabs').tabs('select', '#our-tab');
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
		var total = data.data.length;

		$.tmpl($summary, { total: total })
		    .appendTo("#selected-device");

		$('span#from').text(0);
		$('span#total').text(total);
		$('#control').unbind();
		$("#graph").html("<h2>Click on device to plot</h2>");

		$('#control').bind('change', { data: data.data }, partial_plot);
		$('#control').trigger('change', [ 0 ]);
	    });
    });

    var partial_plot = function(event, from) {
	var data = event.data.data;
	var total = $('span#total').text();
	var limit = +MAX_POINTS;

	if (from < 0)
	    return;

	if (from >= total)
	    return;

	if (from + MAX_POINTS >= total)
	    limit = total - from;

	console.log("plot only", from, limit);
	var partial_data = data.slice(from, +from + limit);

	$('span#displayed').text(limit);
	$('span#from').text(from);

	// TODO: we plot all x, y, z,
	// but we need each other plot
	//
	// - with filters (hight, low, idle, ...)
	// - with gestures mark (recoginzed or not)
	// - with train mark (what point trained?)
	// - ???
	plot("graph", partial_data);
    };

    $("button#remove-graph").click(function() {
	$("#graph").html("<h2>Click on device to plot</h2>");
	$(this).addClass("disabled");
	$("#selected-device").empty();
    });
});
