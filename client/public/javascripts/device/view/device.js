acclab.view.device = Backbone.View.extend({

    initialize: function() {
	var model = this.model;

	model.bind("all", this.allEvents, this);
	model.bind("add", this.addDevice, this);
	model.bind("reset", this.render, this);
    },

    allEvents: function(method, model) {
	console.log("device all:", method, model);
    },

    render: function(collection) {
	console.log("device reset", collection);

	$("#device-list").accordion("destroy");
	$("#device-list").empty();

	collection.each(this.addDevice);

	$("#device-list").accordion();
    },

    addDevice: function(device) {
	console.log("device add:", device);

	var device_id = device.get("device_id");
	var total = device.get("total");

	$("#device-template").tmpl({
	    device_id: device_id,
	    total: total,
	    device_name: "Unknown"
	}).appendTo("#device-list");
    },
});
