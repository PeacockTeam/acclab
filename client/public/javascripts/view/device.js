acclab.view.device = new Backbone.View.extend({

    el: 'div',
    id: 'device-list',

    events: {
	'click .WHAT': "load",
    },

    model: null,

    initialize: function(model) {
	this.model = model;

	model.bind("add", this.addDevice, this);
	model.bind("reset", this.render, this);
    },

    render: function(collection) {
	console.log(collection);
    },

    addDevice: function(device) {
	console.log(device);
    }

    load: function(device) {
	console.log("Hello", device);
    }
});
