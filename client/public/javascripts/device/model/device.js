acclab.model.device = Backbone.Model.extend({
});

acclab.collection.device = Backbone.Collection.extend({
    model: acclab.model.device,

    url: function() {
	return acclab.options["host"] + "/1.0/acc/get";
    },
});